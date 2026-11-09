import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("sbuweb.ai.retrieval.ranking")


class RankFusion:
    """
    Combines dense semantic rankings and lexical BM25 rankings
    using Reciprocal Rank Fusion (RRF) and normalized hybrid scoring.
    """

    def __init__(
        self,
        rrf_k: int = 60,
        dense_weight: float = 1.4,
        lexical_weight: float = 0.6,
    ):
        self.rrf_k = rrf_k
        self.dense_weight = dense_weight
        self.lexical_weight = lexical_weight

    def fuse(
        self,
        dense_results: List[Dict[str, Any]],
        lexical_results: List[Dict[str, Any]],
        top_k: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Merges dense and lexical results using Reciprocal Rank Fusion:
        RRF_Score(d) = (w_dense / (k + rank_dense)) + (w_lexical / (k + rank_lexical))
        """
        dense_rank_map: Dict[str, int] = {}
        dense_data_map: Dict[str, Dict[str, Any]] = {}

        for rank, item in enumerate(dense_results, 1):
            cid = item["chunk_id"]
            dense_rank_map[cid] = rank
            dense_data_map[cid] = item

        lexical_rank_map: Dict[str, int] = {}
        lexical_data_map: Dict[str, Dict[str, Any]] = {}

        for rank, item in enumerate(lexical_results, 1):
            cid = item["chunk_id"]
            lexical_rank_map[cid] = rank
            lexical_data_map[cid] = item

        # All unique candidate chunk IDs
        all_chunk_ids = set(dense_rank_map.keys()) | set(lexical_rank_map.keys())
        fused_candidates: List[Dict[str, Any]] = []

        for cid in all_chunk_ids:
            # 1. RRF Score calculation
            rrf_score = 0.0
            if cid in dense_rank_map:
                rrf_score += self.dense_weight / (self.rrf_k + dense_rank_map[cid])
            if cid in lexical_rank_map:
                rrf_score += self.lexical_weight / (self.rrf_k + lexical_rank_map[cid])

            # 2. Extract best available metadata from either source
            base = dense_data_map.get(cid) or lexical_data_map.get(cid) or {}

            dense_score = dense_data_map.get(cid, {}).get("dense_score", 0.0)
            dense_rank = dense_rank_map.get(cid, 999)

            lexical_score = lexical_data_map.get(cid, {}).get("lexical_score", 0.0)
            lexical_raw = lexical_data_map.get(cid, {}).get("lexical_raw_score", 0.0)
            lexical_rank = lexical_rank_map.get(cid, 999)

            # Determine retrieval method provenance
            if cid in dense_rank_map and cid in lexical_rank_map:
                method = "hybrid_consensus"
            elif cid in dense_rank_map:
                method = "dense_only"
            else:
                method = "bm25_only"

            fused_candidates.append({
                "chunk_id": cid,
                "document_id": base.get("document_id", ""),
                "source_file": base.get("source_file", "SBU_TECH.pdf"),
                "page_number": base.get("page_number", 1),
                "section_title": base.get("section_title", "Unknown Section"),
                "original_text": base.get("original_text", ""),
                "content_type": base.get("content_type", "general_knowledge"),
                "dense_score": dense_score,
                "dense_rank": dense_rank,
                "lexical_score": lexical_score,
                "lexical_raw_score": lexical_raw,
                "lexical_rank": lexical_rank,
                "final_fusion_score": round(rrf_score, 6),
                "retrieval_method": method,
            })

        # Sort by final_fusion_score descending, tie-break by dense_score
        fused_candidates.sort(
            key=lambda x: (x["final_fusion_score"], x["dense_score"]),
            reverse=True,
        )

        return fused_candidates[:top_k]
