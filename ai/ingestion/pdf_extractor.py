import hashlib
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
try:
    import pymupdf as fitz
except ImportError:
    import fitz

from ai.config.settings import settings

logger = logging.getLogger("sbuweb.ai.ingestion.pdf_extractor")


class PDFExtractor:
    """
    Locates, validates, and extracts text and tables from local PDF documents using PyMuPDF.
    Ensures local-only execution with zero external network or third-party OCR calls.
    """

    @staticmethod
    def calculate_sha256(filepath: Path) -> str:
        """Calculates SHA-256 checksum to guarantee document provenance and idempotency."""
        sha256 = hashlib.sha256()
        with open(filepath, "rb") as f:
            for block in iter(lambda: f.read(65536), b""):
                sha256.update(block)
        return sha256.hexdigest()

    @classmethod
    def locate_pdf(cls, custom_path: Optional[str] = None) -> Path:
        """Locates the source PDF document using AI settings or custom override."""
        if custom_path:
            p = Path(custom_path).resolve()
            if p.is_file():
                return p
            raise FileNotFoundError(f"Custom PDF not found at: {p}")

        if settings.SOURCE_PDF.is_file():
            return settings.SOURCE_PDF

        # Search parent directories as fallback
        fallback = settings.ROOT_DIR / "ai" / "SBU_TECH.pdf"
        if fallback.is_file():
            return fallback

        raise FileNotFoundError(f"Source PDF not found at {settings.SOURCE_PDF}")

    @classmethod
    def validate_pdf(cls, filepath: Path) -> Dict[str, Any]:
        """
        Validates the PDF: confirms file readability, page count, and determines
        whether each page contains selectable text or scanned raster images.
        """
        if not filepath.exists():
            raise FileNotFoundError(f"File not found: {filepath}")

        doc = fitz.open(filepath)
        total_pages = len(doc)
        file_size = filepath.stat().st_size
        checksum = cls.calculate_sha256(filepath)

        page_analyses: List[Dict[str, Any]] = []

        for page_idx in range(total_pages):
            page = doc[page_idx]
            page_num = page_idx + 1

            text = page.get_text("text").strip()
            char_count = len(text)
            has_selectable_text = char_count > 20

            # Scan for embedded raster images
            image_list = page.get_images(full=True)
            image_count = len(image_list)

            # Detect whether OCR is required (only if 0 text and images exist)
            needs_ocr = (not has_selectable_text) and (image_count > 0)

            page_analyses.append({
                "page_number": page_num,
                "has_selectable_text": has_selectable_text,
                "character_count": char_count,
                "image_count": image_count,
                "needs_ocr": needs_ocr,
                "is_empty": char_count == 0 and image_count == 0,
            })

        doc.close()

        all_selectable = all(p["has_selectable_text"] for p in page_analyses)
        any_ocr_needed = any(p["needs_ocr"] for p in page_analyses)

        return {
            "filepath": str(filepath.resolve()),
            "filename": filepath.name,
            "sha256": checksum,
            "filesize_bytes": file_size,
            "total_pages": total_pages,
            "all_pages_selectable": all_selectable,
            "ocr_required": any_ocr_needed,
            "page_details": page_analyses,
        }

    @classmethod
    def extract_raw_pages(cls, filepath: Path) -> Dict[str, Any]:
        """
        Extracts structured raw text, tables, and positional blocks from each page.
        Preserves original page numbering for source traceability.
        """
        validation = cls.validate_pdf(filepath)
        doc = fitz.open(filepath)
        extracted_pages: List[Dict[str, Any]] = []

        total_extracted_chars = 0
        total_extracted_words = 0

        for page_idx, page in enumerate(doc):
            page_num = page_idx + 1
            raw_text = page.get_text("text")

            # Extract table structures using PyMuPDF's built-in layout engine
            extracted_tables: List[Dict[str, Any]] = []
            try:
                table_finder = page.find_tables()
                if table_finder and table_finder.tables:
                    for t_idx, table in enumerate(table_finder.tables):
                        extracted_tables.append({
                            "table_index": t_idx + 1,
                            "bbox": list(table.bbox),
                            "rows": table.extract(),
                            "row_count": table.row_count,
                            "col_count": table.col_count,
                        })
            except Exception as e:
                logger.warning("Table extraction notice on page %d: %s", page_num, e)

            words = raw_text.split()
            word_count = len(words)
            char_count = len(raw_text)

            total_extracted_chars += char_count
            total_extracted_words += word_count

            extracted_pages.append({
                "page_number": page_num,
                "raw_text": raw_text,
                "character_count": char_count,
                "word_count": word_count,
                "tables": extracted_tables,
                "is_empty": char_count == 0,
            })

        doc.close()

        return {
            "document_metadata": {
                "filename": filepath.name,
                "filepath": str(filepath.resolve()),
                "sha256": validation["sha256"],
                "total_pages": validation["total_pages"],
                "total_characters": total_extracted_chars,
                "total_words": total_extracted_words,
            },
            "pages": extracted_pages,
        }
