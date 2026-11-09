import time
import logging
from typing import Dict, Any, List, Optional

from ai.config.settings import settings
from ai.retrieval.query_processor import QueryProcessor, ProcessedQuery
from ai.retrieval.hybrid_search import HybridSearchOrchestrator
from ai.retrieval.relevance_filter import RelevanceFilter

logger = logging.getLogger("sbuweb.ai.retrieval.retriever")


class ContextRetriever:
    """
    Master Retrieval Coordinator for SBU TECH RAG system.
    Provides the standardized interface `retrieve_context(...)`.
    """

    def __init__(
        self,
        query_processor: Optional[QueryProcessor] = None,
        search_orchestrator: Optional[HybridSearchOrchestrator] = None,
        relevance_filter: Optional[RelevanceFilter] = None,
    ):
        self.query_processor = query_processor or QueryProcessor()
        self.orchestrator = search_orchestrator or HybridSearchOrchestrator()
        self.relevance_filter = relevance_filter or RelevanceFilter()

    def retrieve(
        self,
        question: str,
        top_k: int = 5,
        search_mode: str = "hybrid",
        score_threshold: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Executes end-to-end retrieval for a user question.
        Returns verified context blocks with complete provenance and relevance guarantees.
        """
        t0 = time.perf_counter()
        warnings: List[str] = []

        # 1. Query Processing & Validation
        try:
            processed: ProcessedQuery = self.query_processor.process_query(question)
        except Exception as e:
            return {
                "original_question": question,
                "detected_script": "unknown",
                "search_mode": search_mode,
                "has_relevant_context": False,
                "retrieved_chunks": [],
                "abstention_reason": f"Query validation failed: {e}",
                "retrieval_warnings": [str(e)],
                "execution_time_ms": round((time.perf_counter() - t0) * 1000, 2),
            }

        # 2. Candidate Retrieval (Dense / BM25 / Hybrid)
        candidate_pool = max(10, top_k * 2)
        try:
            raw_candidates = self.orchestrator.search(
                query_text=processed.cleaned_query,
                query_vector=processed.vector,
                search_mode=search_mode,
                candidate_pool=candidate_pool,
            )
        except Exception as e:
            logger.error("Candidate search failed: %s", e)
            return {
                "original_question": question,
                "detected_script": processed.detected_script,
                "search_mode": search_mode,
                "has_relevant_context": False,
                "retrieved_chunks": [],
                "abstention_reason": f"Retrieval backend error: {e}",
                "retrieval_warnings": [str(e)],
                "execution_time_ms": round((time.perf_counter() - t0) * 1000, 2),
            }

        # 3. Relevance Filtering, Deduplication & No-Answer Detection
        has_context, final_chunks, reason = self.relevance_filter.filter_and_deduplicate(
            candidates=raw_candidates,
            query_text=processed.cleaned_query,
            top_k=top_k,
            custom_threshold=score_threshold,
        )

        elapsed_ms = round((time.perf_counter() - t0) * 1000, 2)

        return {
            "original_question": processed.raw_query,
            "detected_script": processed.detected_script,
            "search_mode": search_mode,
            "has_relevant_context": has_context,
            "relevance_threshold": score_threshold or self.relevance_filter.min_dense_threshold,
            "candidate_count": len(raw_candidates),
            "retrieved_count": len(final_chunks),
            "retrieved_chunks": final_chunks,
            "abstention_reason": reason,
            "retrieval_warnings": warnings,
            "execution_time_ms": elapsed_ms,
        }


# Global singleton instance for convenient import
_default_retriever = ContextRetriever()


def retrieve_context(
    question: str,
    top_k: int = 5,
    search_mode: str = "hybrid",
    score_threshold: Optional[float] = None,
) -> Dict[str, Any]:
    """
    Standardized Phase 3 functional interface:
    `retrieve_context(question, top_k=5, search_mode="hybrid")`
    """
    return _default_retriever.retrieve(
        question=question,
        top_k=top_k,
        search_mode=search_mode,
        score_threshold=score_threshold,
    )
