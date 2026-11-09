import sys
import tempfile
from pathlib import Path
from qdrant_client import QdrantClient

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.vectorstore.collection import QdrantCollectionManager
from ai.vectorstore.indexer import KnowledgeIndexer, generate_stable_point_id


def test_duplicate_prevention_on_rerun():
    """Item 11: Rerunning indexing command does not create duplicate vectors."""
    temp_dir = Path(tempfile.mkdtemp())
    client = QdrantClient(path=str(temp_dir))
    coll_mgr = QdrantCollectionManager(
        collection_name="test_inc_coll",
        dimension=1536,
        client=client,
    )
    manifest_file = temp_dir / "test_manifest.json"
    indexer = KnowledgeIndexer(collection_manager=coll_mgr, manifest_file=manifest_file)

    sample_records = [
        {
            "chunk_id": "c001",
            "document_id": "doc_a",
            "source_file": "doc_a.pdf",
            "page_number": 1,
            "section_title": "Overview",
            "chunk_index": 1,
            "content_type": "company_overview",
            "content_hash": "hash_aaa",
            "original_text": "Sample text A",
            "vector": [0.1] * 1536,
        },
        {
            "chunk_id": "c002",
            "document_id": "doc_a",
            "source_file": "doc_a.pdf",
            "page_number": 1,
            "section_title": "Services",
            "chunk_index": 2,
            "content_type": "general_knowledge",
            "content_hash": "hash_bbb",
            "original_text": "Sample text B",
            "vector": [0.2] * 1536,
        },
    ]

    # Run 1: initial index
    res1 = indexer.index_document_records(
        document_id="doc_a",
        source_file="doc_a.pdf",
        doc_sha256="doc_hash_1",
        records=sample_records,
    )
    assert res1["upserted_points"] == 2
    assert res1["skipped_points"] == 0
    assert res1["collection_total_points"] == 2

    # Run 2: exact duplicate run
    res2 = indexer.index_document_records(
        document_id="doc_a",
        source_file="doc_a.pdf",
        doc_sha256="doc_hash_1",
        records=sample_records,
    )
    assert res2["upserted_points"] == 0
    assert res2["skipped_points"] == 2
    assert res2["collection_total_points"] == 2  # No duplicate points created!

    client.close()
    print("✓ Test 1: Duplicate Prevention on Repeated Execution Passed (0 Duplicate Vectors)")


def test_incremental_updates_and_deletions():
    """Item 12: Incremental updates: only changed chunks re-embedded, removed chunks deleted."""
    temp_dir = Path(tempfile.mkdtemp())
    client = QdrantClient(path=str(temp_dir))
    coll_mgr = QdrantCollectionManager(
        collection_name="test_inc_update_coll",
        dimension=1536,
        client=client,
    )
    manifest_file = temp_dir / "test_manifest.json"
    indexer = KnowledgeIndexer(collection_manager=coll_mgr, manifest_file=manifest_file)

    # Initial state: 3 chunks (c1, c2, c3)
    initial_records = [
        {"chunk_id": "c1", "content_hash": "h1", "original_text": "T1", "page_number": 1, "section_title": "S1", "chunk_index": 1, "content_type": "gen", "vector": [0.1] * 1536},
        {"chunk_id": "c2", "content_hash": "h2", "original_text": "T2", "page_number": 1, "section_title": "S2", "chunk_index": 2, "content_type": "gen", "vector": [0.2] * 1536},
        {"chunk_id": "c3", "content_hash": "h3", "original_text": "T3", "page_number": 2, "section_title": "S3", "chunk_index": 3, "content_type": "gen", "vector": [0.3] * 1536},
    ]

    indexer.index_document_records("doc_a", "doc_a.pdf", "sha_1", initial_records)
    stats1 = coll_mgr.get_stats()
    assert stats1["points_count"] == 3

    # Update state:
    # c1 is unchanged (h1)
    # c2 is modified (h2_updated)
    # c3 is removed
    # c4 is newly added (h4)
    updated_records = [
        {"chunk_id": "c1", "content_hash": "h1", "original_text": "T1", "page_number": 1, "section_title": "S1", "chunk_index": 1, "content_type": "gen", "vector": [0.1] * 1536},
        {"chunk_id": "c2", "content_hash": "h2_updated", "original_text": "T2 Updated", "page_number": 1, "section_title": "S2", "chunk_index": 2, "content_type": "gen", "vector": [0.25] * 1536},
        {"chunk_id": "c4", "content_hash": "h4", "original_text": "T4 New", "page_number": 3, "section_title": "S4", "chunk_index": 4, "content_type": "gen", "vector": [0.4] * 1536},
    ]

    res = indexer.index_document_records("doc_a", "doc_a.pdf", "sha_2", updated_records)
    assert res["skipped_points"] == 1   # c1 skipped
    assert res["upserted_points"] == 2  # c2 updated + c4 added
    assert res["deleted_points"] == 1   # c3 deleted
    assert res["collection_total_points"] == 3  # c1, c2, c4 active

    # Verify c3 is no longer retrievable
    c3_pid = generate_stable_point_id("doc_a", "c3")
    retrieved = client.retrieve("test_inc_update_coll", ids=[c3_pid])
    assert len(retrieved) == 0, "Obsolete chunk c3 should have been deleted from Qdrant"

    # Verify c2 has updated payload
    c2_pid = generate_stable_point_id("doc_a", "c2")
    c2_ret = client.retrieve("test_inc_update_coll", ids=[c2_pid])
    assert len(c2_ret) == 1
    assert c2_ret[0].payload["original_text"] == "T2 Updated"

    client.close()
    print("✓ Test 2: Incremental Chunk Updates & Obsolete Vector Deletion Passed")


def test_multiple_document_indexing():
    """Item 12: Multi-document indexing maintains separate document identities."""
    temp_dir = Path(tempfile.mkdtemp())
    client = QdrantClient(path=str(temp_dir))
    coll_mgr = QdrantCollectionManager(
        collection_name="test_multi_doc_coll",
        dimension=1536,
        client=client,
    )
    manifest_file = temp_dir / "test_manifest.json"
    indexer = KnowledgeIndexer(collection_manager=coll_mgr, manifest_file=manifest_file)

    # Document 1 (SBU_TECH.pdf)
    doc1_records = [
        {"chunk_id": "c1", "content_hash": "d1_h1", "original_text": "Doc 1 text", "page_number": 1, "section_title": "S1", "chunk_index": 1, "content_type": "gen", "vector": [0.1] * 1536},
    ]
    indexer.index_document_records("doc_1", "SBU_TECH.pdf", "sha_doc1", doc1_records)

    # Document 2 (ANOTHER_GUIDE.pdf)
    doc2_records = [
        {"chunk_id": "c1", "content_hash": "d2_h1", "original_text": "Doc 2 text", "page_number": 1, "section_title": "S1", "chunk_index": 1, "content_type": "gen", "vector": [0.2] * 1536},
    ]
    indexer.index_document_records("doc_2", "ANOTHER_GUIDE.pdf", "sha_doc2", doc2_records)

    # Both documents must have separate points in Qdrant even with the same chunk_id ("c1")
    stats = coll_mgr.get_stats()
    assert stats["points_count"] == 2

    # Manifest must track both
    manifest = indexer._manifest["documents"]
    assert "doc_1" in manifest
    assert "doc_2" in manifest
    assert manifest["doc_1"]["source_file"] == "SBU_TECH.pdf"
    assert manifest["doc_2"]["source_file"] == "ANOTHER_GUIDE.pdf"

    client.close()
    print("✓ Test 3: Multiple Document Indexing & Provenance Passed")


if __name__ == "__main__":
    print("\nRunning Incremental Indexing & Duplicate Prevention Test Suite...\n")
    test_duplicate_prevention_on_rerun()
    test_incremental_updates_and_deletions()
    test_multiple_document_indexing()
    print("\n🎉 ALL INCREMENTAL INDEXING TESTS PASSED!\n")

