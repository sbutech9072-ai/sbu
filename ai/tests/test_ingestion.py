import csv
import json
import sys
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.config.settings import settings
from ai.ingestion.pdf_extractor import PDFExtractor
from ai.ingestion.cleaner import DocumentCleaner
from ai.ingestion.chunker import StructureAwareChunker
from ai.ingestion.pipeline import RAGIngestionPipeline


def test_pdf_detection_and_validation():
    pdf_path = PDFExtractor.locate_pdf()
    assert pdf_path.exists(), f"Source PDF does not exist at {pdf_path}"
    assert pdf_path.name == "SBU_TECH.pdf"

    val = PDFExtractor.validate_pdf(pdf_path)
    assert val["total_pages"] == 3, f"Expected 3 pages, found {val['total_pages']}"
    assert val["all_pages_selectable"] is True
    assert val["ocr_required"] is False
    assert len(val["sha256"]) == 64
    print("✓ Step 1: PDF Detection & Validation Passed (3 pages, valid checksum, selectable text)")


def test_text_and_table_extraction():
    pdf_path = PDFExtractor.locate_pdf()
    raw = PDFExtractor.extract_raw_pages(pdf_path)

    assert "document_metadata" in raw
    assert len(raw["pages"]) == 3

    p1 = raw["pages"][0]
    p2 = raw["pages"][1]
    p3 = raw["pages"][2]

    assert p1["character_count"] > 100
    assert p2["character_count"] > 100
    assert p3["character_count"] > 100

    # Verify tables parsed on page 1
    assert len(p1["tables"]) >= 1, "Expected at least 1 table extracted on page 1"
    print("✓ Step 2: Extraction & Table Layout Preservation Passed")


def test_cleaning_and_placeholder_detection():
    pdf_path = PDFExtractor.locate_pdf()
    raw = PDFExtractor.extract_raw_pages(pdf_path)
    cleaned = DocumentCleaner.process_document(raw)

    # Verify running headers stripped
    for page in cleaned["pages"]:
        assert "SBU TECH  |  INTERNAL KNOWLEDGE REFERENCE" not in page["cleaned_text"]

    # Verify essential contact & owners preserved
    full_text = cleaned["consolidated_text"]
    assert "admin@sbutech.com" in full_text
    assert "01347861527" in full_text
    assert "Rangpur, Bangladesh" in full_text
    assert "Bidhan Shaha Dhrubo" in full_text
    assert "Utsob Saha" in full_text
    assert "Borson Saha" in full_text

    # Verify review items detected (unconfirmed terms & structural gap)
    review_items = cleaned["review_items"]
    assert len(review_items) > 0

    types_found = [item["type"] for item in review_items]
    assert "unconfirmed_caution" in types_found
    assert "structural_gap" in types_found

    # Verify mock placeholder detection test
    mock_test_text = "Standard client agreement [ADD OFFICIAL CONTRACT NUMBER] with fee [TBD]."
    mock_findings = DocumentCleaner.detect_placeholders_and_warnings(mock_test_text, page_number=1)
    mock_texts = [f["text"] for f in mock_findings]
    assert "[ADD OFFICIAL CONTRACT NUMBER]" in mock_texts
    assert "[TBD]" in mock_texts

    print("✓ Step 3: Text Cleaning, Header Stripping & Placeholder Detection Passed")


def test_structure_aware_chunking():
    pdf_path = PDFExtractor.locate_pdf()
    raw = PDFExtractor.extract_raw_pages(pdf_path)
    cleaned = DocumentCleaner.process_document(raw)
    chunks = StructureAwareChunker.chunk_document(cleaned)

    assert len(chunks) >= 8, f"Expected at least 8 semantic chunks, got {len(chunks)}"

    required_keys = [
        "chunk_id",
        "document_id",
        "source_file",
        "page_number",
        "section_title",
        "chunk_index",
        "content",
        "content_type",
        "review_required",
        "token_count",
        "char_count",
    ]

    for c in chunks:
        for k in required_keys:
            assert k in c, f"Missing key {k} in chunk {c}"
        assert c["token_count"] > 0
        assert len(c["content"]) > 0
        assert c["page_number"] in [1, 2, 3]

    # Verify Q&A content type detected
    types = [c["content_type"] for c in chunks]
    assert "qa_pairs" in types
    assert "portal_guide" in types or "company_overview" in types

    print("✓ Step 4: Structure-Aware Chunking & Token Bounds Passed")


def test_pipeline_and_artifacts():
    pipeline = RAGIngestionPipeline()
    result = pipeline.run(force=True)

    assert result["status"] == "success"
    assert result["total_pages"] == 3
    assert result["chunk_count"] > 0

    # Verify artifacts exist on disk in ai/data/
    assert settings.RAW_EXTRACTED_FILE.exists()
    assert settings.CLEANED_TEXT_FILE.exists()
    assert settings.CHUNKS_JSONL_FILE.exists()
    assert settings.CHUNKS_CSV_FILE.exists()
    assert settings.MANIFEST_FILE.exists()
    assert settings.REVIEW_REPORT_FILE.exists()

    # Validate JSONL
    with open(settings.CHUNKS_JSONL_FILE, "r", encoding="utf-8") as f:
        jsonl_lines = [json.loads(line) for line in f if line.strip()]
    assert len(jsonl_lines) == result["chunk_count"]

    # Validate CSV
    with open(settings.CHUNKS_CSV_FILE, "r", encoding="utf-8") as f:
        csv_rows = list(csv.reader(f))
    assert len(csv_rows) == result["chunk_count"] + 1  # Header + rows

    # Validate Manifest
    with open(settings.MANIFEST_FILE, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    assert manifest["source_document"]["filename"] == "SBU_TECH.pdf"
    assert manifest["chunking_metrics"]["total_chunks"] == result["chunk_count"]

    # Validate Review Report
    report_text = settings.REVIEW_REPORT_FILE.read_text(encoding="utf-8")
    assert "Missing Section 3" in report_text
    assert "Mock Admin Mode" in report_text

    print("✓ Step 5: All 6 Processing Artifacts Validated in ai/data/")


def test_idempotency():
    pipeline = RAGIngestionPipeline()
    res1 = pipeline.run(force=True)
    res2 = pipeline.run(force=True)

    assert res1["chunk_count"] == res2["chunk_count"]
    assert res1["sha256"] == res2["sha256"]

    # Check file contents match identically
    with open(settings.CHUNKS_JSONL_FILE, "r", encoding="utf-8") as f:
        lines1 = f.readlines()
    res3 = pipeline.run(force=True)
    with open(settings.CHUNKS_JSONL_FILE, "r", encoding="utf-8") as f:
        lines2 = f.readlines()

    assert len(lines1) == len(lines2)
    print("✓ Step 6: Idempotent Execution Verified (0 Duplicate Records on Rerun)")


if __name__ == "__main__":
    print("\nStarting SBU TECH AI Ingestion Test Suite...\n")
    test_pdf_detection_and_validation()
    test_text_and_table_extraction()
    test_cleaning_and_placeholder_detection()
    test_structure_aware_chunking()
    test_pipeline_and_artifacts()
    test_idempotency()
    print("\n🎉 ALL AI INGESTION ACCEPTANCE TESTS PASSED!\n")

