import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


class VectorStoreAdapter:
    """
    Modular abstraction for vector databases (Qdrant, pgvector, or In-Memory).
    Enables future RAG semantic search without breaking existing schemas.
    """

    def __init__(self):
        # In-memory document storage for zero-dependency standalone readiness
        self._memory_store: List[Dict[str, Any]] = []

    def insert(self, document_id: str, text: str, vector: List[float], metadata: Dict[str, Any] = None) -> None:
        self._memory_store.append({
            "id": document_id,
            "text": text,
            "vector": vector,
            "metadata": metadata or {},
        })

    def search(self, query_vector: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        # In-memory cosine-similarity / ranking fallback
        results = sorted(
            self._memory_store,
            key=lambda x: sum(a * b for a, b in zip(x["vector"][:len(query_vector)], query_vector)),
            reverse=True,
        )
        return results[:top_k]

