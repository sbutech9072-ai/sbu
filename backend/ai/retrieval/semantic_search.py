import logging
from typing import Dict, Any, List, Optional
import psycopg2

from ai.config.settings import settings

logger = logging.getLogger("sbuweb.ai.retrieval.semantic_search")


class SemanticSearchEngine:
    """
    Executes dense vector search directly against Supabase PostgreSQL (`pgvector`)
    using the `match_sbu_chunks` RPC function on 1536-dimensional Gemini embeddings.
    """

    def __init__(
        self,
        database_url: Optional[str] = None,
        default_candidate_limit: int = 10,
    ):
        self.database_url = database_url or settings.DATABASE_URL
        self.default_candidate_limit = default_candidate_limit

    def search(
        self,
        query_vector: List[float],
        top_k: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top matching chunks from Supabase `sbu_knowledge_chunks` by cosine similarity.
        """
        limit = top_k or self.default_candidate_limit
        if not self.database_url:
            logger.warning("DATABASE_URL is not configured for Supabase semantic search.")
            return []

        vec_str = "[" + ",".join(f"{float(v):.8f}" for v in query_vector) + "]"
        results: List[Dict[str, Any]] = []
        seen_chunks = set()

        try:
            conn = psycopg2.connect(self.database_url)
            try:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, chunk_id, title, page_number, content, metadata, similarity
                        FROM match_sbu_chunks(%s::vector(1536), 0.15, %s);
                        """,
                        (vec_str, limit),
                    )
                    rows = cur.fetchall()
            finally:
                conn.close()

            for row in rows:
                point_id, chunk_id, sec_title, page_num, orig_text, meta, sim = row
                if chunk_id in seen_chunks:
                    continue
                seen_chunks.add(chunk_id)
                meta_dict = meta if isinstance(meta, dict) else {}

                results.append({
                    "point_id": str(point_id),
                    "chunk_id": chunk_id,
                    "document_id": meta_dict.get("document_id", settings.DOCUMENT_ID),
                    "source_file": meta_dict.get("source_file", "SBU_TECH.pdf"),
                    "page_number": page_num or 1,
                    "section_title": sec_title or "Unknown Section",
                    "original_text": orig_text or "",
                    "content_type": meta_dict.get("content_type", "general_knowledge"),
                    "dense_score": round(float(sim or 0.0), 4),
                    "retrieval_method": "dense",
                })
        except Exception as e:
            logger.error("Supabase pgvector semantic search failed: %s", e)

        return results
