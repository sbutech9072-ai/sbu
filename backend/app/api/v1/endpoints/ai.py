"""
FastAPI REST Endpoints for SBU TECH AI Assistant & RAG Engine.
Supports chat generation, session continuity, verified source citations,
rate-limiting, and non-sensitive diagnostic health checks.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Request, status, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    NewSessionResponse,
    SessionHistoryResponse,
    MessageHistoryItem,
)
from app.services.ai_chat import AIChatService
from app.middleware.ai_rate_limiter import check_ai_rate_limit
from app.models.ai_session import ChatSession, ChatMessage

router = APIRouter(prefix="/ai", tags=["Applied AI & RAG Assistant"])
chat_service = AIChatService()


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Grounded AI Response",
    dependencies=[Depends(check_ai_rate_limit)],
)
def chat_endpoint(
    payload: ChatRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Primary conversational endpoint for the SBU TECH AI Assistant.
    Retrieves grounded context from approved engineering documents,
    resolves follow-up queries, validates citations, and maintains session continuity.
    """
    client_ip = (
        request.headers.get("x-forwarded-for")
        or request.headers.get("x-real-ip")
        or (request.client.host if request.client else "127.0.0.1")
    )
    client_ip = client_ip.split(",")[0].strip()

    return chat_service.chat(
        db=db,
        message=payload.message,
        session_id=payload.session_id,
        client_ip=client_ip,
        language=payload.language,
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="AI Subsystem Diagnostic Health Check",
)
def health_endpoint():
    """
    Reports readiness of the RAG pipeline, Qdrant vector database,
    and configured LLM provider without exposing private keys.
    """
    return chat_service.check_health()


@router.post(
    "/session/new",
    response_model=NewSessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Initialize or Reset Conversation Session",
)
def new_session_endpoint(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Allocates a fresh, isolated session ID for a visitor.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    session_obj = chat_service.get_or_create_session(db=db, session_id=None, client_ip=client_ip)
    return NewSessionResponse(
        session_id=session_obj.id,
        message="New conversation session initialized successfully.",
    )


@router.get(
    "/session/{session_id}/history",
    response_model=SessionHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve Session Message History",
)
def get_session_history_endpoint(
    session_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieves conversational history for an existing session ID.
    Enforces session isolation.
    """
    session_obj = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Chat session '{session_id}' not found.",
        )

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    history_items = [
        MessageHistoryItem(
            role=m.role,
            content=m.content,
            status=m.status,
            created_at=m.created_at.isoformat() if m.created_at else "",
        )
        for m in messages
    ]

    return SessionHistoryResponse(
        session_id=session_id,
        total_messages=len(history_items),
        messages=history_items,
    )
