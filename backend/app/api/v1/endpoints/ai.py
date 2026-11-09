from pydantic import BaseModel, Field
from fastapi import APIRouter
from app.rag.assistant import AIAssistantService

router = APIRouter(prefix="/ai", tags=["Applied AI & RAG Assistant"])

assistant_service = AIAssistantService()


class AIChatInput(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User question or architecture inquiry")


class AIChatResponse(BaseModel):
    query: str
    answer: str
    sources: list
    model: str
    rag_enabled: bool


@router.post("/chat", response_model=AIChatResponse, summary="Conversational Engineering Assistant")
def chat_with_assistant(payload: AIChatInput):
    """
    RAG-enabled AI Assistant endpoint.
    Retrieves relevant engineering studio documents and returns contextual answers.
    """
    result = assistant_service.query(payload.message)
    return AIChatResponse(
        query=result["query"],
        answer=result["answer"],
        sources=result["sources"],
        model=result["model"],
        rag_enabled=result["rag_enabled"],
    )

