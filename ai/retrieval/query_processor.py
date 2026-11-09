import re
import logging
from dataclasses import dataclass
from typing import List, Optional

from ai.config.settings import settings
from ai.embeddings.query_embedding import QueryEmbeddingService

logger = logging.getLogger("sbuweb.ai.retrieval.query_processor")


@dataclass
class ProcessedQuery:
    """Holds processed user query and its embedding representation."""
    raw_query: str
    cleaned_query: str
    detected_script: str
    vector: List[float]
    dimension: int


def detect_script(text: str) -> str:
    """Module-level helper to identify Unicode script block."""
    if re.search(r"[\u0980-\u09FF]", text):
        return "Bengali"
    if re.search(r"[\u0600-\u06FF]", text):
        return "Arabic"
    if re.search(r"[\u0900-\u097F]", text):
        return "Devanagari"
    if re.search(r"[\u4E00-\u9FFF\u3040-\u30FF]", text):
        return "CJK"
    return "Latin"


class QueryProcessor:
    """
    Validates user queries, detects language scripts, and generates
    1536-dimensional query embeddings without auto-translation.
    """

    def __init__(self, query_service: Optional[QueryEmbeddingService] = None):
        self.query_service = query_service or QueryEmbeddingService()
        self.dimension = settings.GEMINI_EMBEDDING_DIMENSION

    @staticmethod
    def detect_script(text: str) -> str:
        """Identifies Unicode script block for multilingual tracking."""
        if re.search(r"[\u0980-\u09FF]", text):
            return "Bengali"
        if re.search(r"[\u0600-\u06FF]", text):
            return "Arabic"
        if re.search(r"[\u0900-\u097F]", text):
            return "Devanagari"
        if re.search(r"[\u4E00-\u9FFF\u3040-\u30FF]", text):
            return "CJK"
        return "Latin"

    def process_query(self, user_question: str) -> ProcessedQuery:
        """
        Validates, prepares, and embeds a user question.
        Preserves original wording and script.
        """
        if not user_question or not user_question.strip():
            raise ValueError("User query cannot be empty or whitespace.")

        cleaned = user_question.strip()
        script = self.detect_script(cleaned)

        # Generate 1536-dim vector via Gemini Embedding 2
        vector = self.query_service.embed_query(cleaned)

        if len(vector) != self.dimension:
            raise ValueError(
                f"Generated query vector dimension mismatch: expected {self.dimension}, got {len(vector)}"
            )

        return ProcessedQuery(
            raw_query=user_question,
            cleaned_query=cleaned,
            detected_script=script,
            vector=vector,
            dimension=len(vector),
        )

