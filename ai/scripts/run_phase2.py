#!/usr/bin/env python3
"""
SBU TECH AI Subsystem — Phase 2 Execution Script
Generates Gemini Embeddings and indexes vectors into local Qdrant vector database.
"""
import sys
import json
import logging
import argparse
from pathlib import Path

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.embeddings.generator import DocumentEmbeddingGenerator
from ai.vectorstore.qdrant_client import QdrantLocalManager
from ai.vectorstore.collection import QdrantCollectionManager
from ai.vectorstore.indexer import KnowledgeIndexer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("sbuweb.ai.phase2.runner")


def run_phase2_pipeline(mock_mode: bool = False):
    print("=" * 68)
    print("🚀 SBU TECH AI SUBSYSTEM — PHASE 2: GEMINI EMBEDDINGS & QDRANT")
    print("=" * 68)
    print(f"Embedding Model:     {settings.GEMINI_EMBEDDING_MODEL}")
    print(f"Vector Dimensions:   {settings.GEMINI_EMBEDDING_DIMENSION}")
    print(f"Qdrant Storage:      {settings.resolved_qdrant_path}")
    print(f"Qdrant Collection:   {settings.QDRANT_COLLECTION_NAME}")
    print("-" * 68)

    # 1. API Key Check
    has_valid_key = settings.is_gemini_api_key_valid()
    if not has_valid_key and not mock_mode:
        print("\n⚠️  ACTION REQUIRED: Gemini API Key Not Configured")
        print("--------------------------------------------------------------------")
        print(f"File location:    {settings.AI_DIR / '.env'}")
        print("Current status:   Placeholder value ('PASTE_YOUR_GEMINI_API_KEY_HERE')")
        print("\nPlease paste your Google Gemini API key into `ai/.env`:")
        print("  GEMINI_API_KEY=your_actual_key_here")
        print("\nTo test pipeline mechanics, Qdrant indexing, and schemas without")
        print("live API calls, re-run with: python ai/scripts/run_phase2.py --mock")
        print("=" * 68)
        return False

    if mock_mode:
        print("ℹ️  Running in MOCK / LOCAL SIMULATION MODE (Zero API calls)")

    # 2. Load Phase 1 Chunks
    chunks_file = settings.CHUNKS_JSONL_FILE
    if not chunks_file.exists():
        print(f"❌ Error: Chunks file not found at {chunks_file}. Run Phase 1 first.")
        return False

    with open(chunks_file, "r", encoding="utf-8") as f:
        all_chunks = [json.loads(line) for line in f if line.strip()]

    print(f"\n[Step 1] Loaded {len(all_chunks)} chunks from Phase 1 ({chunks_file.name})")

    # 3. Privacy & Guardrail Filtering
    generator = DocumentEmbeddingGenerator()
    approved_chunks, excluded_chunks = generator.filter_chunks_for_privacy(all_chunks)
    print(f"[Step 2] Privacy filtering: {len(approved_chunks)} approved, {len(excluded_chunks)} excluded")
    print(f"         Excluded report saved: {settings.EXCLUDED_CHUNKS_FILE}")

    # 4. Generate Embeddings
    print(f"\n[Step 3] Processing 1536-dim embeddings for {len(approved_chunks)} approved chunks...")
    embedded_records = generator.generate_embeddings_for_chunks(
        approved_chunks,
        mock_embedding_for_testing=mock_mode,
    )
    print(f"         Embeddings generated/cached: {len(embedded_records)} records")

    # 5. Incremental Qdrant Indexing
    print(f"\n[Step 4] Indexing vectors into local Qdrant collection '{settings.QDRANT_COLLECTION_NAME}'...")
    indexer = KnowledgeIndexer()

    # Get source PDF hash from manifest or file
    manifest_sha = "unknown"
    if settings.MANIFEST_FILE.exists():
        with open(settings.MANIFEST_FILE, "r", encoding="utf-8") as f:
            manifest_data = json.load(f)
            manifest_sha = manifest_data.get("source_document", {}).get("sha256", "unknown")

    index_res = indexer.index_document_records(
        document_id=settings.DOCUMENT_ID,
        source_file="SBU_TECH.pdf",
        doc_sha256=manifest_sha,
        records=embedded_records,
    )

    print(f"         Points upserted: {index_res['upserted_points']}")
    print(f"         Points skipped (unchanged): {index_res['skipped_points']}")
    print(f"         Points deleted (obsolete):  {index_res['deleted_points']}")
    print(f"         Total active vectors in Qdrant: {index_res['collection_total_points']}")

    # 6. Smoke Test Search
    print("\n[Step 5] Running vector similarity smoke test in Qdrant...")
    test_vec = embedded_records[0]["vector"]
    client = QdrantLocalManager.get_client()
    if hasattr(client, "query_points"):
        search_res = client.query_points(
            collection_name=settings.QDRANT_COLLECTION_NAME,
            query=test_vec,
            limit=2,
        )
        points = search_res.points
    else:
        points = client.search(
            collection_name=settings.QDRANT_COLLECTION_NAME,
            query_vector=test_vec,
            limit=2,
        )

    for idx, p in enumerate(points, 1):
        print(f"         Top Match #{idx}: Score={float(p.score):.4f} | Section='{p.payload.get('section_title')}' (Page {p.payload.get('page_number')})")

    print("\n" + "=" * 68)
    print("🎉 PHASE 2 PIPELINE EXECUTION COMPLETE")
    print("=" * 68)
    print(f"Total Chunks Processed:       {len(all_chunks)}")
    print(f"Excluded Chunks (Privacy):    {len(excluded_chunks)}")
    print(f"Approved Chunks:              {len(approved_chunks)}")
    print(f"Vectors in Local Qdrant:      {index_res['collection_total_points']}")
    print(f"Embedding Cache File:         {settings.EMBEDDING_CACHE_FILE}")
    print(f"Indexing Manifest File:       {settings.INDEXING_MANIFEST_FILE}")
    print("=" * 68)
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run SBU TECH AI Phase 2 Pipeline")
    parser.add_argument("--mock", action="store_true", help="Run in local mock mode without live Gemini API calls")
    args = parser.parse_args()

    success = run_phase2_pipeline(mock_mode=args.mock)
    if not success:
        sys.exit(1)

