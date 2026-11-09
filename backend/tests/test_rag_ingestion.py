"""
Backend integration test for centralized AI pipeline.
Executes the test suite in `ai/tests/test_ingestion.py`.
"""
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.tests.test_ingestion import (
    test_pdf_detection_and_validation,
    test_text_and_table_extraction,
    test_cleaning_and_placeholder_detection,
    test_structure_aware_chunking,
    test_pipeline_and_artifacts,
    test_idempotency,
)

if __name__ == "__main__":
    print("\n[Backend Test Runner] Delegating to centralized ai/tests/test_ingestion.py...\n")
    test_pdf_detection_and_validation()
    test_text_and_table_extraction()
    test_cleaning_and_placeholder_detection()
    test_structure_aware_chunking()
    test_pipeline_and_artifacts()
    test_idempotency()
    print("\n🎉 ALL BACKEND AI DELEGATION TESTS PASSED!\n")
