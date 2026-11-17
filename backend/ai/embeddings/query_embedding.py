import logging
from typing import List, Optional
from ai.config.settings import settings
from ai.embeddings.gemini_client import GeminiEmbeddingClient

logger = logging.getLogger("sbuweb.ai.embeddings.query")


def format_query_input(user_question: str) -> str:
    """
    Formats the query using Gemini Embedding 2 task instructions:
    `task: search result | query: {user_question}`
    Preserves the user's original language without translation.
    """
    clean_query = user_question.strip()
    return f"task: search result | query: {clean_query}"


class QueryEmbeddingService:
    """
    Reusable query embedding service for semantic retrieval.
    Prepares query vectors for downstream vector search.
    """

    def __init__(self, client: Optional[GeminiEmbeddingClient] = None):
        self.client = client or GeminiEmbeddingClient()
        self.dimension = settings.GEMINI_EMBEDDING_DIMENSION

    def embed_query(self, user_question: str) -> List[float]:
        """
        Embeds a user inquiry preserving the exact language input.
        Returns a validated 1536-dimensional vector.
        """
        if not user_question or not user_question.strip():
            raise ValueError("Query string cannot be empty.")

        formatted_input = format_query_input(user_question)
        vector = self.client.embed_text(formatted_input, custom_dimension=self.dimension)

        if len(vector) != self.dimension:
            raise ValueError(
                f"Query embedding dimension mismatch: expected {self.dimension}, got {len(vector)}"
            )

        return vector

