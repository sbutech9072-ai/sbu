import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.retrieval.ranking import RankFusion


def test_rrf_consensus_elevation():
    """Verifies that candidates appearing in both dense and lexical rankings get elevated."""
    fusion = RankFusion(rrf_k=60, dense_weight=1.0, lexical_weight=0.8)

    # Candidate A is #1 in dense, but missing in BM25
    dense_results = [
        {"chunk_id": "c_A", "dense_score": 0.85, "section_title": "A"},
        {"chunk_id": "c_B", "dense_score": 0.82, "section_title": "B"},
        {"chunk_id": "c_C", "dense_score": 0.80, "section_title": "C"},
    ]

    # Candidate B is #1 in BM25, and #2 in dense
    lexical_results = [
        {"chunk_id": "c_B", "lexical_score": 1.0, "lexical_raw_score": 12.0, "section_title": "B"},
        {"chunk_id": "c_D", "lexical_score": 0.8, "lexical_raw_score": 9.0, "section_title": "D"},
    ]

    fused = fusion.fuse(dense_results, lexical_results, top_k=3)

    # c_B should be #1 because of consensus (dense rank 2 + lexical rank 1)
    # c_B RRF: 1.0/(60+2) + 0.8/(60+1) = 0.016129 + 0.013114 = 0.029243
    # c_A RRF: 1.0/(60+1) + 0.0 = 0.016393
    assert fused[0]["chunk_id"] == "c_B"
    assert fused[0]["retrieval_method"] == "hybrid_consensus"
    assert fused[1]["chunk_id"] == "c_A"
    assert fused[1]["retrieval_method"] == "dense_only"

    print("✓ Test 1: RRF Consensus Elevation (Dense + Lexical Consensus) Passed")


def test_rrf_traceability_fields():
    """Verifies all required ranking and score fields are populated."""
    fusion = RankFusion()
    dense_results = [{"chunk_id": "c1", "dense_score": 0.80, "section_title": "S1"}]
    lexical_results = [{"chunk_id": "c1", "lexical_score": 0.90, "section_title": "S1"}]

    fused = fusion.fuse(dense_results, lexical_results, top_k=1)
    res = fused[0]

    assert "dense_score" in res
    assert "dense_rank" in res
    assert "lexical_score" in res
    assert "lexical_rank" in res
    assert "final_fusion_score" in res
    assert "retrieval_method" in res
    assert res["dense_rank"] == 1
    assert res["lexical_rank"] == 1

    print("✓ Test 2: RRF Traceability and Score Schema Passed")


if __name__ == "__main__":
    print("\nRunning Rank Fusion Test Suite...\n")
    test_rrf_consensus_elevation()
    test_rrf_traceability_fields()
    print("\n🎉 ALL RANK FUSION TESTS PASSED!\n")

