import re
import logging
from typing import Dict, Any, List, Tuple, Set, Optional

logger = logging.getLogger("sbuweb.ai.retrieval.filter")

COMMON_QUERY_STOPWORDS = {
    "what", "is", "are", "the", "how", "many", "does", "do", "did", "can",
    "i", "a", "an", "of", "in", "to", "for", "with", "on", "at", "by",
    "from", "currently", "have", "has", "had", "would", "should", "could",
    "sbu", "tech", "sbutech", "about", "tell", "me", "show", "give", "please",
}


def compute_token_jaccard(text1: str, text2: str) -> float:
    """Computes Jaccard similarity between token sets of two texts."""
    words1 = set(re.findall(r"\w+", text1.lower()))
    words2 = set(re.findall(r"\w+", text2.lower()))
    if not words1 or not words2:
        return 0.0
    intersection = len(words1 & words2)
    union = len(words1 | words2)
    return intersection / max(1, union)


class RelevanceFilter:
    """
    Applies calibrated similarity thresholding, deduplication, and
    out-of-domain / no-answer detection.
    """

    def __init__(
        self,
        min_dense_threshold: float = 0.62,
        min_fusion_threshold: float = 0.015,
        dedup_jaccard_threshold: float = 0.82,
    ):
        self.min_dense_threshold = min_dense_threshold
        self.min_fusion_threshold = min_fusion_threshold
        self.dedup_jaccard_threshold = dedup_jaccard_threshold

    def filter_and_deduplicate(
        self,
        candidates: List[Dict[str, Any]],
        query_text: str = "",
        top_k: int = 5,
        custom_threshold: Optional[float] = None,
    ) -> Tuple[bool, List[Dict[str, Any]], str]:
        """
        Filters candidates against calibrated thresholds and removes redundant chunks.
        Performs No-Answer detection for unverified topics (e.g. employee count, stock ticker).
        """
        threshold = custom_threshold if custom_threshold is not None else self.min_dense_threshold

        if not candidates:
            return (
                False,
                [],
                "No candidate documents retrieved from the knowledge base.",
            )

        top_candidate = candidates[0]
        top_dense = top_candidate.get("dense_score", 0.0)
        top_lexical = top_candidate.get("lexical_score", 0.0)
        is_pure_bm25 = top_candidate.get("retrieval_method") == "bm25"

        # 1. Calibrated General Threshold (e.g. chocolate cake, weather)
        if not is_pure_bm25 and top_dense < threshold:
            reason = (
                f"No verified information in the SBU TECH knowledge base. "
                f"Top similarity score ({top_dense:.3f}) fell below the calibrated "
                f"relevance threshold ({threshold:.3f})."
            )
            return False, [], reason
        elif is_pure_bm25 and top_lexical < 0.15:
            return False, [], "BM25 keyword match score below lexical threshold."

        # 2. Strict Entity & Factual Topic Verification for English Queries
        # If query asks about a specific entity/topic (e.g. 'employees', 'ticker', 'nasdaq', 'salary')
        # that does not exist in any candidate chunk, and dense score is not exceptionally high (>= 0.82),
        # abstain rather than hallucinatory retrieval of generic company overviews.
        substantive_terms = [
            w for w in re.findall(r"[a-zA-Z]{3,}", query_text.lower())
            if w not in COMMON_QUERY_STOPWORDS
        ]

        if substantive_terms and top_dense < 0.82:
            combined_candidate_text = " ".join(
                (c.get("section_title", "") + " " + c.get("original_text", "")).lower()
                for c in candidates[:3]
            )
            # Check if at least one substantive term is present in candidates
            has_term_match = any(term in combined_candidate_text for term in substantive_terms)
            if not has_term_match:
                missing_topic = ", ".join(f"'{t}'" for t in substantive_terms)
                reason = (
                    f"No verified information in the SBU TECH knowledge base regarding {missing_topic}. "
                    f"Candidate chunks discuss studio engineering services but contain no data on this topic."
                )
                return False, [], reason

        # 3. Filter candidates meeting minimum threshold
        qualifying: List[Dict[str, Any]] = []
        for c in candidates:
            if c.get("dense_score", 0.0) >= threshold or c.get("lexical_score", 0.0) >= 0.35:
                qualifying.append(c)

        if not qualifying:
            return (
                False,
                [],
                f"All retrieved candidates fell below the relevance threshold ({threshold:.3f}).",
            )

        # 4. Deduplication: remove near-identical duplicate text blocks
        deduplicated: List[Dict[str, Any]] = []
        for cand in qualifying:
            cand_text = cand.get("original_text", "")
            is_redundant = False

            for existing in deduplicated:
                jaccard = compute_token_jaccard(cand_text, existing.get("original_text", ""))
                if jaccard >= self.dedup_jaccard_threshold:
                    is_redundant = True
                    break

            if not is_redundant:
                deduplicated.append(cand)

            if len(deduplicated) >= top_k:
                break

        return True, deduplicated, ""
