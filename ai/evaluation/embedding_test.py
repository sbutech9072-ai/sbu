import json
import logging
import math
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional
from qdrant_client import QdrantClient

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.embeddings.gemini_client import GeminiEmbeddingClient
from ai.embeddings.query_embedding import QueryEmbeddingService
from ai.vectorstore.qdrant_client import QdrantLocalManager

logger = logging.getLogger("sbuweb.ai.evaluation.multilingual")


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Computes cosine similarity between two numerical vectors."""
    dot = sum(a * b for a, b in zip(v1, v2))
    norm_a = math.sqrt(sum(a * a for a in v1))
    norm_b = math.sqrt(sum(b * b for b in v2))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


class MultilingualEvaluationHarness:
    """
    Evaluates cross-lingual semantic retrieval across English, Bangla, Arabic,
    Hindi, Chinese, Japanese, French, German, and Spanish against the English knowledge base.
    """

    def __init__(
        self,
        queries_file: Optional[Path] = None,
        query_service: Optional[QueryEmbeddingService] = None,
        qdrant_client: Optional[QdrantClient] = None,
    ):
        self.queries_file = queries_file or (settings.AI_DIR / "evaluation" / "multilingual_queries.json")
        self.query_service = query_service or QueryEmbeddingService()
        self.client = qdrant_client or QdrantLocalManager.get_client()
        self.collection_name = settings.QDRANT_COLLECTION_NAME

    def run_evaluation(
        self,
        top_k: int = 3,
        use_mock: bool = False,
    ) -> Dict[str, Any]:
        """
        Executes multilingual queries against Qdrant collection.
        If `use_mock` is True, generates synthetic vectors to test pipeline without API costs.
        """
        with open(self.queries_file, "r", encoding="utf-8") as f:
            bench_data = json.load(f)

        results: List[Dict[str, Any]] = []

        for item in bench_data["queries"]:
            q_id = item["id"]
            language = item["language"]
            query_text = item["query"]
            target_sec = item.get("target_section", "")

            # 1. Embed query
            if use_mock:
                # Deterministic synthetic vector
                import hashlib
                h = hashlib.sha256(query_text.encode("utf-8")).hexdigest()
                seed = int(h[:8], 16)
                vec = [((seed + i) % 1000) / 1000.0 for i in range(settings.GEMINI_EMBEDDING_DIMENSION)]
                norm = sum(x * x for x in vec) ** 0.5
                query_vector = [x / norm for x in vec]
            else:
                query_vector = self.query_service.embed_query(query_text)

            # 2. Search Qdrant
            # Qdrant client query_points / search API
            search_hits = []
            try:
                # Use query_points (modern API) or search (compatible)
                if hasattr(self.client, "query_points"):
                    res = self.client.query_points(
                        collection_name=self.collection_name,
                        query=query_vector,
                        limit=top_k,
                    )
                    points = res.points
                else:
                    points = self.client.search(
                        collection_name=self.collection_name,
                        query_vector=query_vector,
                        limit=top_k,
                    )

                for p in points:
                    search_hits.append({
                        "point_id": str(p.id),
                        "score": round(float(p.score), 4),
                        "chunk_id": p.payload.get("chunk_id"),
                        "section_title": p.payload.get("section_title"),
                        "page_number": p.payload.get("page_number"),
                        "content_snippet": p.payload.get("original_text", "")[:120] + "...",
                    })
            except Exception as e:
                logger.warning("Search failed for query %s: %s", q_id, e)

            results.append({
                "id": q_id,
                "language": language,
                "query": query_text,
                "target_section": target_sec,
                "top_hit_score": search_hits[0]["score"] if search_hits else 0.0,
                "top_hit_section": search_hits[0]["section_title"] if search_hits else None,
                "hits": search_hits,
            })

        return {
            "benchmark_title": bench_data.get("benchmark_title"),
            "total_queries_tested": len(results),
            "mode": "mock_synthetic" if use_mock else "live_gemini_api",
            "results": results,
        }


if __name__ == "__main__":
    harness = MultilingualEvaluationHarness()
    res = harness.run_evaluation(use_mock=not settings.is_gemini_api_key_valid())
    print(json.dumps(res, indent=2, ensure_ascii=False))
