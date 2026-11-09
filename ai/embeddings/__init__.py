"""
SBU TECH AI Embeddings Subsystem (Phase 2)
Powered by official Google Gemini Embedding API (`gemini-embedding-2`).
"""
from ai.embeddings.gemini_client import (
    GeminiEmbeddingClient,
    GeminiAuthError,
    GeminiQuotaExceededError,
)
from ai.embeddings.generator import (
    DocumentEmbeddingGenerator,
    format_chunk_document_input,
    calculate_content_hash,
)
from ai.embeddings.query_embedding import (
    QueryEmbeddingService,
    format_query_input,
)

__all__ = [
    "GeminiEmbeddingClient",
    "GeminiAuthError",
    "GeminiQuotaExceededError",
    "DocumentEmbeddingGenerator",
    "QueryEmbeddingService",
    "format_chunk_document_input",
    "format_query_input",
    "calculate_content_hash",
]
