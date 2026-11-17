"""
SBU TECH AI Embeddings Subsystem
Powered by official Google Gemini Embedding API (`gemini-embedding-2`).
"""
from ai.embeddings.gemini_client import (
    GeminiEmbeddingClient,
    GeminiAuthError,
    GeminiQuotaExceededError,
)
from ai.embeddings.query_embedding import (
    QueryEmbeddingService,
    format_query_input,
)

__all__ = [
    "GeminiEmbeddingClient",
    "GeminiAuthError",
    "GeminiQuotaExceededError",
    "QueryEmbeddingService",
    "format_query_input",
]
