#!/usr/bin/env python3
"""
SBU TECH AI Subsystem — Phase 1 Pipeline CLI Runner
Executes local PDF validation, text extraction, cleaning, and structure-aware chunking.
"""
import sys
import logging
from pathlib import Path

# Ensure workspace root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.ingestion.pipeline import RAGIngestionPipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("sbuweb.ai.runner")


def main():
    print("=" * 64)
    print("🚀 SBU TECH AI SUBSYSTEM — PHASE 1 INGESTION RUNNER")
    print("=" * 64)
    print(f"Source PDF:       {settings.SOURCE_PDF}")
    print(f"Data Directory:   {settings.DATA_DIR}")
    print("-" * 64)

    pipeline = RAGIngestionPipeline()
    result = pipeline.run()

    print("\n" + "=" * 64)
    print("🎉 INGESTION PIPELINE FINISHED SUCCESSFULLY")
    print("=" * 64)
    print(f"Total Pages:              {result['total_pages']}")
    print(f"Extracted Characters:     {result['character_count']:,}")
    print(f"Extracted Words:          {result['word_count']:,}")
    print(f"Total Chunks Generated:   {result['chunk_count']}")
    print(f"Review Cautions/Warnings: {result['review_cautions_count']}")
    print(f"Chunks Requiring Review:  {result['review_flagged_chunks']}")
    print("\nSaved Artifacts:")
    for name, path in result["artifacts"].items():
        print(f"  • {name:<18}: {path}")
    print("=" * 64)


if __name__ == "__main__":
    main()

