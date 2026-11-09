import logging
from typing import Dict, Any, List, Optional
from qdrant_client import QdrantClient

from ai.config.settings import settings
from ai.vectorstore.qdrant_client import QdrantLocalManager

logger = logging.getLogger("sbuweb.ai.retrieval.semantic_search")


class SemanticSearchEngine:
    """
    Executes dense vector search against the local Qdrant collection
    using Cosine similarity on 1536-dimensional Gemini embeddings.
    """

    def __init__(
        self,
        client: Optional[QdrantClient] = None,
        collection_name: Optional[str] = None,
        default_candidate_limit: int = 10,
    ):
        self.client = client or QdrantLocalManager.get_client()
        self.collection_name = collection_name or settings.QDRANT_COLLECTION_NAME
        self.default_candidate_limit = default_candidate_limit

    def search(
        self,
        query_vector: List[float],
        top_k: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top matching chunks from Qdrant by cosine similarity.
        """
        limit = top_k or self.default_candidate_limit

        if hasattr(self.client, "query_points"):
            res = self.client.query_points(
                collection_name=self.collection_name,
                query=query_vector,
                limit=limit,
                with_payload=True,
            )
            raw_points = res.points
        else:
            raw_points = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit,
                with_payload=True,
            )

        results: List[Dict[str, Any]] = []
        seen_chunks = set()

        for point in raw_points:
            payload = point.payload or {}
            chunk_id = payload.get("chunk_id", str(point.id))

            if chunk_id in seen_chunks:
                continue
            seen_chunks.add(chunk_id)

            score = round(float(point.score), 4)

            results.append({
                "point_id": str(point.id),
                "chunk_id": chunk_id,
                "document_id": payload.get("document_id", settings.DOCUMENT_ID),
                "source_file": payload.get("source_file", "SBU_TECH.pdf"),
                "page_number": payload.get("page_number", 1),
                "section_title": payload.get("section_title", "Unknown Section"),
                "original_text": payload.get("original_text", ""),
                "content_type": payload.get("content_type", "general_knowledge"),
                "dense_score": score,
                "retrieval_method": "dense",
            })

        return results
