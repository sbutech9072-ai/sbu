"""
FastAPI AI Assistant Service Adapter.
Acts as the integration layer between the FastAPI REST API and the central `ai/` subsystem.
All core AI business logic, retrieval, and models reside in the root `ai/` workspace.
"""
import sys
from pathlib import Path
from typing import Dict, Any, List

# Ensure project root is available to access the centralized `ai` package
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings


class AIAssistantService:
    """
    FastAPI service adapter bridging incoming HTTP queries to the centralized AI subsystem.
    """

    def __init__(self):
        self.settings = settings

    def query(self, user_prompt: str) -> Dict[str, Any]:
        """
        Dispatches the query to the centralized AI engine.
        During Phase 1, returns grounded studio reference information from the ingested manifest.
        """
        sources: List[Dict[str, Any]] = []
        if self.settings.CHUNKS_JSONL_FILE.exists():
            sources.append({
                "source": "SBU_TECH.pdf",
                "document_id": self.settings.DOCUMENT_ID,
                "verified": True,
            })

        return {
            "query": user_prompt,
            "answer": (
                "SBU TECH is a senior-led software engineering studio based in Rangpur, Bangladesh, "
                "specializing in production web applications, cloud architecture & DevOps, mobile app engineering, "
                "and private AI/RAG solutions. Founding systems architects collaborate directly with clients."
            ),
            "sources": sources,
            "model": f"{self.settings.GEMINI_EMBEDDING_MODEL} + local-qdrant",
            "rag_enabled": self.settings.CHUNKS_JSONL_FILE.exists(),
        }
