import json
import math
import logging
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.retrieval.retriever import ContextRetriever

logger = logging.getLogger("sbuweb.ai.evaluation.retrieval_evaluator")


def compute_dcg(relevances: List[int], k: int) -> float:
    """Computes Discounted Cumulative Gain up to rank k."""
    dcg = 0.0
    for i, rel in enumerate(relevances[:k], 1):
        if rel > 0:
            dcg += rel / math.log2(i + 1)
    return dcg


def compute_ndcg(relevances: List[int], total_relevant: int, k: int) -> float:
    """Computes Normalized Discounted Cumulative Gain at rank k."""
    dcg = compute_dcg(relevances, k)
    ideal_rels = [1] * min(k, total_relevant)
    idcg = compute_dcg(ideal_rels, k)
    if idcg == 0:
        return 0.0
    return dcg / idcg


class RetrievalEvaluator:
    """
    Evaluates Dense, BM25, and Hybrid retrieval across precision, recall,
    MRR, nDCG@5, and no-answer abstention accuracy.
    """

    def __init__(
        self,
        queries_file: Optional[Path] = None,
        retriever: Optional[ContextRetriever] = None,
    ):
        self.queries_file = queries_file or (settings.AI_DIR / "evaluation" / "retrieval_queries.json")
        self.retriever = retriever or ContextRetriever()

    def run_benchmark(self, top_k: int = 5) -> Dict[str, Any]:
        """
        Runs comprehensive benchmark across all modes: 'dense', 'bm25', 'hybrid'.
        """
        with open(self.queries_file, "r", encoding="utf-8") as f:
            bench_config = json.load(f)

        queries = bench_config["queries"]
        modes = ["dense", "bm25", "hybrid"]
        mode_reports: Dict[str, Any] = {}

        for mode in modes:
            logger.info("Evaluating retrieval mode: %s...", mode)
            mode_reports[mode] = self._evaluate_single_mode(queries, mode=mode, top_k=top_k)

        full_results = {
            "benchmark_name": bench_config.get("benchmark_name"),
            "total_queries": len(queries),
            "answerable_queries": sum(1 for q in queries if q["is_answerable"]),
            "unanswerable_queries": sum(1 for q in queries if not q["is_answerable"]),
            "top_k_evaluated": top_k,
            "mode_comparisons": mode_reports,
        }

        # Save to disk
        out_file = settings.AI_DIR / "evaluation" / "retrieval_results.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(full_results, f, indent=2, ensure_ascii=False)

        logger.info("Evaluation results saved to %s", out_file)
        return full_results

    def _evaluate_single_mode(
        self,
        queries: List[Dict[str, Any]],
        mode: str,
        top_k: int,
    ) -> Dict[str, Any]:
        """Runs evaluation for a specific retrieval mode."""
        reciprocal_ranks: List[float] = []
        hits_at_1 = 0
        hits_at_3 = 0
        hits_at_5 = 0
        ndcgs_at_5: List[float] = []

        # No-answer detection metrics
        true_abstentions = 0
        false_positives = 0
        unanswerable_count = 0

        query_evals: List[Dict[str, Any]] = []

        for q in queries:
            qid = q["id"]
            question = q["query"]
            is_answerable = q["is_answerable"]
            expected_sections = [s.lower() for s in q.get("expected_sections", [])]
            expected_prefixes = q.get("expected_chunk_prefixes", [])

            # Run retrieval
            res = self.retriever.retrieve(
                question=question,
                top_k=top_k,
                search_mode=mode,
            )

            has_context = res["has_relevant_context"]
            retrieved = res["retrieved_chunks"]

            # 1. Unanswerable query handling (No-Answer Detection)
            if not is_answerable:
                unanswerable_count += 1
                if not has_context or len(retrieved) == 0:
                    true_abstentions += 1
                    status = "correct_abstention"
                else:
                    false_positives += 1
                    status = "false_positive"

                query_evals.append({
                    "query_id": qid,
                    "query": question,
                    "language": q.get("language"),
                    "is_answerable": False,
                    "has_relevant_context": has_context,
                    "status": status,
                    "retrieved_top_k": [
                        {
                            "section_title": c["section_title"],
                            "score": c.get("final_fusion_score", 0.0),
                            "dense_score": c.get("dense_score", 0.0),
                        }
                        for c in retrieved[:3]
                    ],
                })
                continue

            # 2. Answerable query evaluation
            # Determine relevance for each retrieved chunk (1 if match, 0 if not)
            relevances: List[int] = []
            first_relevant_rank: Optional[int] = None

            for rank, c in enumerate(retrieved, 1):
                c_title = c.get("section_title", "").lower()
                c_id = c.get("chunk_id", "")

                is_match = False
                # Section title matching
                for exp_sec in expected_sections:
                    if exp_sec in c_title or c_title in exp_sec:
                        is_match = True
                        break

                # Chunk prefix matching
                if not is_match:
                    for pref in expected_prefixes:
                        if c_id.startswith(pref):
                            is_match = True
                            break

                rel = 1 if is_match else 0
                relevances.append(rel)

                if is_match and first_relevant_rank is None:
                    first_relevant_rank = rank

            # Metrics updates
            if first_relevant_rank is not None:
                reciprocal_ranks.append(1.0 / first_relevant_rank)
                if first_relevant_rank == 1:
                    hits_at_1 += 1
                if first_relevant_rank <= 3:
                    hits_at_3 += 1
                if first_relevant_rank <= 5:
                    hits_at_5 += 1
            else:
                reciprocal_ranks.append(0.0)

            ndcg_val = compute_ndcg(relevances, total_relevant=len(expected_sections) or 1, k=top_k)
            ndcgs_at_5.append(ndcg_val)

            query_evals.append({
                "query_id": qid,
                "query": question,
                "language": q.get("language"),
                "is_answerable": True,
                "first_relevant_rank": first_relevant_rank,
                "hit_at_1": first_relevant_rank == 1,
                "ndcg_at_5": round(ndcg_val, 4),
                "top_5_results": [
                    {
                        "rank": idx,
                        "chunk_id": c["chunk_id"],
                        "section_title": c["section_title"],
                        "page_number": c["page_number"],
                        "dense_score": c.get("dense_score", 0.0),
                        "lexical_score": c.get("lexical_score", 0.0),
                        "fusion_score": c.get("final_fusion_score", 0.0),
                    }
                    for idx, c in enumerate(retrieved[:5], 1)
                ],
            })

        answerable_count = len(queries) - unanswerable_count
        mrr = round(sum(reciprocal_ranks) / max(1, answerable_count), 4)
        top1_acc = round(hits_at_1 / max(1, answerable_count), 4)
        hit3_acc = round(hits_at_3 / max(1, answerable_count), 4)
        hit5_acc = round(hits_at_5 / max(1, answerable_count), 4)
        mean_ndcg = round(sum(ndcgs_at_5) / max(1, len(ndcgs_at_5)), 4)

        abstention_accuracy = round(true_abstentions / max(1, unanswerable_count), 4)

        return {
            "mode": mode,
            "metrics": {
                "top_1_accuracy": top1_acc,
                "hit_at_3": hit3_acc,
                "hit_at_5": hit5_acc,
                "mean_reciprocal_rank": mrr,
                "mean_ndcg_at_5": mean_ndcg,
                "no_answer_abstention_accuracy": abstention_accuracy,
                "false_positive_rate": round(false_positives / max(1, unanswerable_count), 4),
            },
            "queries": query_evals,
        }

