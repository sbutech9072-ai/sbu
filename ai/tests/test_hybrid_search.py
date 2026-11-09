import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.retrieval.retriever import retrieve_context


def test_hybrid_search_interface():
    """Verifies the standardized retrieve_context functional interface."""
    res = retrieve_context(
        question="What services does SBU TECH provide?",
        top_k=3,
        search_mode="hybrid",
    )

    assert res["search_mode"] == "hybrid"
    assert res["has_relevant_context"] is True
    assert len(res["retrieved_chunks"]) <= 3
    assert len(res["retrieved_chunks"]) > 0

    top_chunk = res["retrieved_chunks"][0]
    expected_keys = [
        "chunk_id",
        "document_id",
        "source_file",
        "page_number",
        "section_title",
        "original_text",
        "dense_score",
        "lexical_score",
        "final_fusion_score",
        "retrieval_method",
    ]
    for k in expected_keys:
        assert k in top_chunk, f"Missing key {k} in chunk payload"

    print("✓ Test 1: Standardized retrieve_context Interface & Schema Passed")


def test_no_answer_abstention():
    """Verifies that out-of-domain questions trigger clean abstention (has_relevant_context = False)."""
    ood_query = "How many employees does SBU TECH currently have?"
    res = retrieve_context(
        question=ood_query,
        top_k=3,
        search_mode="hybrid",
    )

    assert res["has_relevant_context"] is False
    assert len(res["retrieved_chunks"]) == 0
    assert "abstention_reason" in res
    assert len(res["abstention_reason"]) > 10

    print("✓ Test 2: Calibrated No-Answer / Out-of-Domain Abstention Passed")


def test_mode_switching_parity():
    """Verifies retrieval operates cleanly in dense, bm25, and hybrid modes."""
    q = "Who owns SBU TECH?"
    res_hybrid = retrieve_context(q, search_mode="hybrid")
    res_dense = retrieve_context(q, search_mode="dense")
    res_bm25 = retrieve_context(q, search_mode="bm25")

    assert res_hybrid["search_mode"] == "hybrid"
    assert res_dense["search_mode"] == "dense"
    assert res_bm25["search_mode"] == "bm25"

    assert res_hybrid["has_relevant_context"] is True
    assert res_dense["has_relevant_context"] is True
    assert res_bm25["has_relevant_context"] is True

    print("✓ Test 3: Mode Switching Parity (Dense, BM25, Hybrid) Passed")


if __name__ == "__main__":
    print("\nRunning Hybrid Search & Relevance Filter Test Suite...\n")
    test_hybrid_search_interface()
    test_no_answer_abstention()
    test_mode_switching_parity()
    print("\n🎉 ALL HYBRID SEARCH TESTS PASSED!\n")

