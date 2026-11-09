import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger("sbuweb.ai.ingestion.cleaner")


class DocumentCleaner:
    """
    Cleans extracted PDF text while preserving company intelligence:
    - Strips repeating running headers, footers, and standalone page numbers.
    - Preserves tables and formats them into clean Markdown representations.
    - Retains names, emails, phone numbers, URLs, and questions/answers.
    - Detects editable placeholders (e.g. [ADD CONTRACT NUMBER]) and compliance cautions.
    - Flags structural section gaps (e.g. missing Section 3).
    """

    REPEATED_RUNNING_HEADERS = [
        re.compile(
            r"SBU TECH\s*\|\s*INTERNAL KNOWLEDGE REFERENCE.*?(?:Page\s*\d+\s*of\s*\d+)?\n?",
            re.IGNORECASE,
        ),
        re.compile(
            r"Working knowledge base.*?(?:Verify contract-specific and unconfirmed details before publication\.?)\n?",
            re.IGNORECASE,
        ),
    ]

    PLACEHOLDER_PATTERNS = [
        re.compile(r"\[ADD\s+[^\]]+\]", re.IGNORECASE),
        re.compile(r"\[INSERT\s+[^\]]+\]", re.IGNORECASE),
        re.compile(r"\[TBD\]", re.IGNORECASE),
        re.compile(r"\[TODO\]", re.IGNORECASE),
    ]

    UNCONFIRMED_PATTERNS = [
        (
            re.compile(r"Verify contract-specific and unconfirmed details", re.IGNORECASE),
            "Document header explicitly warns that contract-specific terms must be verified before publication.",
        ),
        (
            re.compile(r"Mock Admin Mode", re.IGNORECASE),
            "Document notes the live admin portal displays 'Mock Admin Mode'. Must not be presented as live production DB until confirmed.",
        ),
        (
            re.compile(r"Do not claim that SBU TECH is SOC 2 or HIPAA certified", re.IGNORECASE),
            "Certification compliance caution: SBU TECH designs for readiness, but is not certified SOC 2 / HIPAA.",
        ),
        (
            re.compile(r"Never invent a contract number", re.IGNORECASE),
            "Strict AI invariant: Never invent contract numbers, fees, statuses, or deadlines.",
        ),
    ]

    @staticmethod
    def format_table_as_markdown(table_rows: List[List[Any]]) -> str:
        """Converts extracted 2D table row arrays into formatted GitHub-flavored Markdown tables."""
        if not table_rows or len(table_rows) < 1:
            return ""

        cleaned_rows: List[List[str]] = []
        for row in table_rows:
            cleaned_row = [
                re.sub(r"\s+", " ", str(cell or "")).strip().replace("|", "\\|")
                for cell in row
            ]
            if any(cleaned_row):
                cleaned_rows.append(cleaned_row)

        if not cleaned_rows:
            return ""

        headers = cleaned_rows[0]
        separator = ["---"] * len(headers)
        lines = [
            "| " + " | ".join(headers) + " |",
            "| " + " | ".join(separator) + " |",
        ]

        for row in cleaned_rows[1:]:
            while len(row) < len(headers):
                row.append("")
            lines.append("| " + " | ".join(row[: len(headers)]) + " |")

        return "\n".join(lines)

    @classmethod
    def clean_page_text(cls, raw_text: str, page_number: int) -> str:
        """Cleans running headers, trailing artifacts, and excess spacing from a single page."""
        cleaned = raw_text

        # Strip repeated running headers & footers
        for pattern in cls.REPEATED_RUNNING_HEADERS:
            cleaned = pattern.sub("", cleaned)

        # Normalize line breaks and tabs
        cleaned = cleaned.replace("\r\n", "\n").replace("\r", "\n")
        cleaned = re.sub(r"[ \t]+", " ", cleaned)

        # Remove repeated page numbers (e.g. standalone numbers at beginning or end of page)
        cleaned = re.sub(rf"^\s*{page_number}\s*$", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(rf"^\s*Page\s+{page_number}\s*$", "", cleaned, flags=re.IGNORECASE | re.MULTILINE)

        # Normalize bullet points
        cleaned = re.sub(r"^[•·*]\s*", "• ", cleaned, flags=re.MULTILINE)

        # Remove redundant blank lines (more than 2 consecutive)
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)

        return cleaned.strip()

    @classmethod
    def detect_placeholders_and_warnings(
        cls,
        text: str,
        page_number: int,
    ) -> List[Dict[str, Any]]:
        """Scans extracted text for editable placeholders, syntax brackets, and compliance cautions."""
        findings: List[Dict[str, Any]] = []

        # 1. Bracketed placeholders
        for pattern in cls.PLACEHOLDER_PATTERNS:
            for match in pattern.finditer(text):
                findings.append({
                    "type": "editable_placeholder",
                    "text": match.group(0),
                    "page_number": page_number,
                    "severity": "high",
                    "description": "Unfilled template placeholder. Must not be used as confirmed company fact.",
                })

        # 2. Domain-specific unconfirmed notices
        for pattern, explanation in cls.UNCONFIRMED_PATTERNS:
            match = pattern.search(text)
            if match:
                findings.append({
                    "type": "unconfirmed_caution",
                    "text": match.group(0),
                    "page_number": page_number,
                    "severity": "medium",
                    "description": explanation,
                })

        return findings

    @classmethod
    def process_document(cls, raw_extracted: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes entire raw extracted document: cleans page texts, replaces tables with
        structured markdown tables, detects review items, and produces consolidated cleaned text.
        """
        cleaned_pages: List[Dict[str, Any]] = []
        all_review_items: List[Dict[str, Any]] = []
        full_cleaned_text_blocks: List[str] = []

        # Check for structural section gaps (e.g. Section 2 to Section 4 jump)
        combined_raw = "\n".join(p["raw_text"] for p in raw_extracted["pages"])
        if "2. Owners & leadership" in combined_raw and "4. What SBU TECH does" in combined_raw:
            text_between = combined_raw.split("2. Owners & leadership")[1].split("4. What SBU TECH does")[0]
            if "3." not in text_between:
                all_review_items.append({
                    "type": "structural_gap",
                    "text": "Missing Section 3",
                    "page_number": 2,
                    "severity": "low",
                    "description": "Document jumps directly from '2. Owners & leadership' (Page 1) to '4. What SBU TECH does' (Page 2). Section 3 is missing in the source PDF.",
                })

        for p in raw_extracted["pages"]:
            page_num = p["page_number"]
            raw_text = p["raw_text"]

            cleaned_text = cls.clean_page_text(raw_text, page_num)

            # Detect placeholders and review items on this page
            page_review_items = cls.detect_placeholders_and_warnings(raw_text, page_num)
            all_review_items.extend(page_review_items)

            # Format extracted tables into markdown representations for the page
            tables_md: List[str] = []
            for t in p.get("tables", []):
                rows = t.get("rows", [])
                if rows:
                    md_table = cls.format_table_as_markdown(rows)
                    if md_table:
                        tables_md.append(md_table)

            cleaned_pages.append({
                "page_number": page_num,
                "cleaned_text": cleaned_text,
                "tables_markdown": tables_md,
                "word_count": len(cleaned_text.split()),
                "has_review_items": len(page_review_items) > 0,
            })

            # Append to overall text
            page_banner = f"--- [Page {page_num}] ---"
            full_cleaned_text_blocks.append(f"{page_banner}\n\n{cleaned_text}")

        return {
            "document_metadata": raw_extracted["document_metadata"],
            "consolidated_text": "\n\n".join(full_cleaned_text_blocks),
            "pages": cleaned_pages,
            "review_items": all_review_items,
        }

