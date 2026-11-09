import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.retrieval.semantic_search import SemanticSearchEngine
from ai.embeddings.query_embedding import QueryEmbeddingService


def test_semantic_search_execution():
    """Verifies dense semantic search against active Qdrant database."""
    query_service = QueryEmbeddingService()
    search_engine = SemanticSearchEngine()

    # Query for services
    q_vec = query_service.embed_query("What services does SBU TECH provide?")
    assert len(q_vec) == 1536

    hits = search_engine.search(query_vector=q_vec, top_k=5)
    assert len(hits) > 0
    assert len(hits) <= 5

    top_hit = hits[0]
    required_keys = [
        "chunk_id",
        "document_id",
        "source_file",
        "page_number",
        "section_title",
        "original_text",
        "dense_score",
        "retrieval_method",
    ]
    for k in required_keys:
        assert k in top_hit, f"Missing key {k} in hit: {top_hit}"

    # Dense score should be high for in-domain query
    assert top_hit["dense_score"] > 0.70
    assert top_hit["retrieval_method"] == "dense"
    print("✓ Test 1: Dense Semantic Search & Provenance Metadata Passed")


def test_dense_score_ordering():
    """Verifies that results are returned ordered by dense cosine score descending."""
    query_service = QueryEmbeddingService()
    search_engine = SemanticSearchEngine()

    q_vec = query_service.embed_query("Who owns SBU TECH?")
    hits = search_engine.search(query_vector=q_vec, top_k=5)

    scores = [h["dense_score"] for h in hits]
    assert scores == sorted(scores, reverse=True), f"Hits not in descending score order: {scores}"
    print("✓ Test 2: Dense Score Descending Ordering Passed")


if __name__ == "__main__":
    print("\nRunning Semantic Search Test Suite...\n")
    test_semantic_search_execution()
    test_dense_score_ordering()
    print("\n🎉 ALL SEMANTIC SEARCH TESTS PASSED!\n")

