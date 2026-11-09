"""
Production-grade AI Chat Integration Service for FastAPI.
Bridges REST endpoints to the centralized `ai/` RAG subsystem,
manages database session persistence, continuity, and health reporting.
"""

import sys
import uuid
import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

# Ensure root workspace is accessible for importing the centralized `ai` package
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings as ai_settings
from ai.llm import generate_grounded_answer, GroundedResponse, AgentRouterClient
from ai.vectorstore.qdrant_client import QdrantLocalManager
from app.models.ai_session import ChatSession, ChatMessage
from app.schemas.ai import ChatResponse, SourceCitation, HealthResponse

logger = logging.getLogger("sbuweb.backend.services.ai_chat")


class AIChatService:
    """
    High-level orchestrator connecting FastAPI requests to the `ai/` RAG pipeline
    with persistent conversation history and session isolation.
    """

    def __init__(self, custom_client: Optional[AgentRouterClient] = None):
        self.custom_client = custom_client

    def get_or_create_session(
        self,
        db: Session,
        session_id: Optional[str] = None,
        client_ip: Optional[str] = None,
        language: Optional[str] = None,
    ) -> ChatSession:
        """
        Retrieves an existing conversation session or initializes a fresh one.
        Ensures strict session isolation and tracking.
        """
        clean_sid = (session_id or "").strip()

        if clean_sid:
            existing = db.query(ChatSession).filter(ChatSession.id == clean_sid).first()
            if existing:
                return existing

        # Generate new session ID
        new_sid = clean_sid if (clean_sid and len(clean_sid) >= 8) else f"sbu_chat_{uuid.uuid4().hex[:16]}"
        new_session = ChatSession(
            id=new_sid,
            visitor_ip=client_ip,
            language=language or "auto",
            is_active=True,
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        return new_session

    def get_conversation_history(
        self,
        db: Session,
        session_id: str,
        limit_turns: int = 6,
    ) -> List[Dict[str, str]]:
        """
        Retrieves recent turns for conversational continuity without context overload.
        """
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(limit_turns * 2)
            .all()
        )
        # Reverse to chronological order
        messages.reverse()
        return [{"role": m.role, "content": m.content} for m in messages]

    def chat(
        self,
        db: Session,
        message: str,
        session_id: Optional[str] = None,
        client_ip: Optional[str] = None,
        language: Optional[str] = None,
    ) -> ChatResponse:
        """
        Executes a complete grounded chat transaction:
        1. Resolves or creates conversation session.
        2. Retrieves recent conversation history.
        3. Invokes centralized RAG engine `generate_grounded_answer`.
        4. Persists user message and assistant response to SQLite database.
        5. Formats and returns structured response.
        """
        request_id = f"req_{uuid.uuid4().hex[:12]}"
        clean_message = message.strip()

        # 1. Resolve session
        session_obj = self.get_or_create_session(
            db=db,
            session_id=session_id,
            client_ip=client_ip,
            language=language,
        )

        # 2. Retrieve history for follow-up resolution
        history = self.get_conversation_history(db, session_obj.id, limit_turns=4)

        # 3. Call centralized RAG generation engine
        try:
            rag_result: GroundedResponse = generate_grounded_answer(
                question=clean_message,
                conversation_history=history,
                client=self.custom_client,
            )
        except Exception as e:
            logger.error("Error executing RAG pipeline: %s", e, exc_info=True)
            return ChatResponse(
                session_id=session_obj.id,
                answer=(
                    "I am currently experiencing a temporary connection issue. "
                    "Please try again or contact our team directly at admin@sbutech.com."
                ),
                status="generation_error",
                language=language or "English",
                sources=[],
                model=ai_settings.AGENTROUTER_MODEL,
                request_id=request_id,
            )

        # 4. Map sources
        sources_list: List[SourceCitation] = []
        for src in rag_result.sources:
            sources_list.append(
                SourceCitation(
                    chunk_id=src.get("chunk_id", "kb_ref"),
                    source_file=src.get("source_file", "SBU_TECH.pdf"),
                    page_number=src.get("page_number", 1),
                    section_title=src.get("section_title", "Document Section"),
                )
            )

        # 5. Persist turns in database
        try:
            user_msg = ChatMessage(
                session_id=session_obj.id,
                role="user",
                content=clean_message,
            )
            asst_msg = ChatMessage(
                session_id=session_obj.id,
                role="assistant",
                content=rag_result.answer,
                status=rag_result.status,
                sources_json=json.dumps([s.model_dump() for s in sources_list]),
            )
            db.add(user_msg)
            db.add(asst_msg)
            db.commit()
        except Exception as db_err:
            logger.error("Failed to persist chat messages to database: %s", db_err)
            db.rollback()

        # 6. Return response
        return ChatResponse(
            session_id=session_obj.id,
            answer=rag_result.answer,
            status=rag_result.status,
            language=rag_result.language,
            sources=sources_list,
            model=rag_result.model or ai_settings.AGENTROUTER_MODEL,
            request_id=request_id,
        )

    def check_health(self) -> HealthResponse:
        """
        Executes non-invasive health checks on Qdrant, embeddings, and LLM readiness.
        Never exposes secrets, database credentials, or API keys.
        """
        qdrant_ok = False
        try:
            q_client = QdrantLocalManager.get_client()
            col = q_client.get_collection(ai_settings.QDRANT_COLLECTION_NAME)
            qdrant_ok = col.status is not None
        except Exception as e:
            logger.warning("Health check: Qdrant probe failed: %s", e)

        emb_ok = ai_settings.is_gemini_api_key_valid()
        llm_ok = ai_settings.is_agentrouter_api_key_valid()

        all_ok = qdrant_ok and emb_ok and llm_ok

        return HealthResponse(
            status="healthy" if all_ok else "degraded",
            backend_available=True,
            ai_module_available=True,
            qdrant_connected=qdrant_ok,
            embedding_ready=emb_ok,
            llm_ready=llm_ok,
            collection_name=ai_settings.QDRANT_COLLECTION_NAME,
            model=ai_settings.AGENTROUTER_MODEL,
        )
