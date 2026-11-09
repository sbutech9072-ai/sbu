import logging
from typing import Dict, Any, List, Optional

from ai.retrieval.semantic_search import SemanticSearchEngine
from ai.retrieval.bm25_search import BM25SearchEngine
from ai.retrieval.ranking import RankFusion

logger = logging.getLogger("sbuweb.ai.retrieval.hybrid_search")


class HybridSearchOrchestrator:
    """
    Coordinates Dense Vector Retrieval (Gemini + Qdrant) and
    Lexical Retrieval (BM25) with Reciprocal Rank Fusion.
    """

    def __init__(
        self,
        semantic_engine: Optional[SemanticSearchEngine] = None,
        bm25_engine: Optional[BM25SearchEngine] = None,
        rank_fusion: Optional[RankFusion] = None,
    ):
        self.semantic_engine = semantic_engine or SemanticSearchEngine()
        self.bm25_engine = bm25_engine or BM25SearchEngine()
        self.rank_fusion = rank_fusion or RankFusion()

    def search(
        self,
        query_text: str,
        query_vector: List[float],
        search_mode: str = "hybrid",
        candidate_pool: int = 12,
    ) -> List[Dict[str, Any]]:
        """
        Executes search under the specified mode: 'hybrid', 'dense', or 'bm25'.
        """
        mode = search_mode.lower()

        if mode == "dense":
            dense_results = self.semantic_engine.search(
                query_vector=query_vector,
                top_k=candidate_pool,
            )
            for r in dense_results:
                r["final_fusion_score"] = r.get("dense_score", 0.0)
            return dense_results

        elif mode == "bm25":
            lexical_results = self.bm25_engine.search(
                query=query_text,
                top_k=candidate_pool,
            )
            for r in lexical_results:
                r["final_fusion_score"] = r.get("lexical_score", 0.0)
            return lexical_results

        elif mode == "hybrid":
            dense_results = self.semantic_engine.search(
                query_vector=query_vector,
                top_k=candidate_pool,
            )
            lexical_results = self.bm25_engine.search(
                query=query_text,
                top_k=candidate_pool,
            )
            fused = self.rank_fusion.fuse(
                dense_results=dense_results,
                lexical_results=lexical_results,
                top_k=candidate_pool,
            )
            return fused

        else:
            raise ValueError(f"Unsupported search_mode '{search_mode}'. Expected 'hybrid', 'dense', or 'bm25'.")

