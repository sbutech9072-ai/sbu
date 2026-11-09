import sys
import tempfile
from pathlib import Path
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.vectorstore.qdrant_client import QdrantLocalManager
from ai.vectorstore.collection import (
    QdrantCollectionManager,
    IncompatibleVectorDimensionError,
)
from ai.vectorstore.indexer import generate_stable_point_id


def test_qdrant_collection_creation():
    """Item 7: Qdrant collection creation with 1536 Cosine vectors."""
    temp_dir = Path(tempfile.mkdtemp())
    client = QdrantClient(path=str(temp_dir))
    coll_mgr = QdrantCollectionManager(
        collection_name="test_sbu_coll",
        dimension=1536,
        client=client,
    )

    res = coll_mgr.ensure_collection()
    assert res["status"] == "created"
    assert res["dimension"] == 1536
    assert res["distance"] == "COSINE"

    # Incompatibility test: trying to ensure with dimension 768 must raise IncompatibleVectorDimensionError
    bad_mgr = QdrantCollectionManager(
        collection_name="test_sbu_coll",
        dimension=768,
        client=client,
    )
    try:
        bad_mgr.ensure_collection()
        assert False, "Should have raised IncompatibleVectorDimensionError"
    except IncompatibleVectorDimensionError:
        pass

    client.close()
    print("✓ Test 1: Qdrant Collection Creation & Dimension Safety Passed")


def test_vector_storage_and_metadata():
    """Item 8 & 9: Vector storage and metadata preservation."""
    temp_dir = Path(tempfile.mkdtemp())
    client = QdrantClient(path=str(temp_dir))
    coll_mgr = QdrantCollectionManager(
        collection_name="test_storage_coll",
        dimension=1536,
        client=client,
    )
    coll_mgr.ensure_collection()

    point_id = generate_stable_point_id("doc_1", "chunk_01")
    dummy_vec = [0.01] * 1536

    payload = {
        "point_id": point_id,
        "chunk_id": "chunk_01",
        "document_id": "doc_1",
        "source_file": "SBU_TECH.pdf",
        "original_text": "SBU TECH is a software studio.",
        "page_number": 1,
        "section_title": "Overview",
        "chunk_index": 1,
        "content_type": "company_overview",
        "content_hash": "hash12345",
        "embedding_model": "gemini-embedding-2",
        "embedding_dimension": 1536,
    }

    client.upsert(
        collection_name="test_storage_coll",
        points=[PointStruct(id=point_id, vector=dummy_vec, payload=payload)],
    )

    # Retrieve and verify all fields
    retrieved = client.retrieve("test_storage_coll", ids=[point_id], with_vectors=True)
    assert len(retrieved) == 1
    p = retrieved[0]
    assert p.id == point_id
    assert len(p.vector) == 1536
    assert p.payload["chunk_id"] == "chunk_01"
    assert p.payload["document_id"] == "doc_1"
    assert p.payload["original_text"] == "SBU TECH is a software studio."
    assert p.payload["page_number"] == 1
    assert p.payload["embedding_dimension"] == 1536
    assert p.payload["embedding_model"] == "gemini-embedding-2"

    client.close()
    print("✓ Test 2: Vector Storage & Complete Metadata Preservation Passed")


def test_similarity_search_smoke():
    """Item 10: Similarity search smoke test."""
    temp_dir = Path(tempfile.mkdtemp())
    client = QdrantClient(path=str(temp_dir))
    coll_mgr = QdrantCollectionManager(
        collection_name="test_search_coll",
        dimension=1536,
        client=client,
    )
    coll_mgr.ensure_collection()

    # Insert two distinct vectors
    v1 = [1.0 if i == 0 else 0.0 for i in range(1536)]
    v2 = [1.0 if i == 1 else 0.0 for i in range(1536)]

    p1 = PointStruct(
        id=generate_stable_point_id("doc_1", "c1"),
        vector=v1,
        payload={"chunk_id": "c1", "section_title": "Section A"},
    )
    p2 = PointStruct(
        id=generate_stable_point_id("doc_1", "c2"),
        vector=v2,
        payload={"chunk_id": "c2", "section_title": "Section B"},
    )
    client.upsert("test_search_coll", points=[p1, p2])

    # Search for vector close to v1
    query_vec = [0.99 if i == 0 else 0.01 for i in range(1536)]
    if hasattr(client, "query_points"):
        res = client.query_points("test_search_coll", query=query_vec, limit=1)
        matches = res.points
    else:
        matches = client.search("test_search_coll", query_vector=query_vec, limit=1)

    assert len(matches) == 1
    assert matches[0].payload["chunk_id"] == "c1"
    assert matches[0].score > 0.9

    client.close()
    print("✓ Test 3: Cosine Similarity Search Smoke Test Passed")


def test_database_persistence():
    """Item 13: Local disk database persistence across client sessions."""
    temp_dir = Path(tempfile.mkdtemp())

    # Session 1: Create and write
    c1 = QdrantClient(path=str(temp_dir))
    coll_mgr = QdrantCollectionManager(
        collection_name="persistent_coll",
        dimension=1536,
        client=c1,
    )
    coll_mgr.ensure_collection()
    pid = generate_stable_point_id("doc_1", "p_persisted")
    c1.upsert(
        collection_name="persistent_coll",
        points=[
            PointStruct(
                id=pid,
                vector=[0.05] * 1536,
                payload={"text": "Persisted in local storage"},
            )
        ],
    )
    c1.close()

    # Session 2: Reopen from same path and read
    c2 = QdrantClient(path=str(temp_dir))
    retrieved = c2.retrieve("persistent_coll", ids=[pid])
    assert len(retrieved) == 1
    assert retrieved[0].payload["text"] == "Persisted in local storage"
    c2.close()

    print("✓ Test 4: Local Database Disk Persistence Passed")


if __name__ == "__main__":
    print("\nRunning Local Qdrant Vector Database Test Suite...\n")
    test_qdrant_collection_creation()
    test_vector_storage_and_metadata()
    test_similarity_search_smoke()
    test_database_persistence()
    print("\n🎉 ALL QDRANT VECTOR DATABASE TESTS PASSED!\n")

