"""
Pydantic schemas for the AI Chatbot and RAG System integration.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class SourceCitation(BaseModel):
    """Grounded reference source from the verified knowledge base."""
    chunk_id: str = Field(..., description="Unique chunk identifier from knowledge base")
    source_file: str = Field(..., description="Source document name")
    page_number: int = Field(..., description="Original PDF page number")
    section_title: str = Field(..., description="Document section header")


class ChatRequest(BaseModel):
    """Visitor query payload for AI Assistant."""
    session_id: Optional[str] = Field(None, max_length=64, description="Optional existing session ID")
    message: str = Field(..., min_length=1, max_length=2000, description="User question or inquiry")
    language: Optional[str] = Field(None, max_length=30, description="Optional visitor language preference")


class ChatResponse(BaseModel):
    """Structured AI response conforming to Phase 5 requirements."""
    session_id: str = Field(..., description="Conversation session ID")
    answer: str = Field(..., description="Grounded AI response text")
    status: str = Field(..., description="Response status (answered, no_relevant_information, out_of_scope, etc.)")
    language: str = Field(..., description="Detected or synthesized language")
    sources: List[SourceCitation] = Field(default_factory=list, description="Verified knowledge-base citations")
    model: str = Field(..., description="Language model used for completion")
    request_id: str = Field(..., description="Unique trace ID for observability")


class NewSessionResponse(BaseModel):
    """Confirmation payload when initializing a fresh session."""
    session_id: str = Field(..., description="Newly allocated session ID")
    message: str = Field(..., description="Welcome greeting or reset confirmation")


class HealthResponse(BaseModel):
    """Diagnostic health check schema."""
    status: str = Field(..., description="'healthy' or 'degraded'")
    backend_available: bool = Field(True, description="FastAPI backend status")
    ai_module_available: bool = Field(..., description="Root AI workspace availability")
    qdrant_connected: bool = Field(..., description="Local Qdrant vector database status")
    embedding_ready: bool = Field(..., description="Gemini Embedding API configuration status")
    llm_ready: bool = Field(..., description="AgentRouter DeepSeek configuration status")
    collection_name: str = Field(..., description="Target Qdrant collection")
    model: str = Field(..., description="Configured generation model ID")


class MessageHistoryItem(BaseModel):
    """Historical message in an active session."""
    role: str
    content: str
    status: Optional[str] = None
    created_at: str


class SessionHistoryResponse(BaseModel):
    """Complete message history for an active session."""
    session_id: str
    total_messages: int
    messages: List[MessageHistoryItem]

