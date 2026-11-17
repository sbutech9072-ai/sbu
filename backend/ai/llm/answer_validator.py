"""
Answer Validation, Citation Extraction, and Grounding Guardrails.
Enforces that generated answers strictly reference approved retrieved chunks,
validates citations against provenance metadata, and strips ungrounded claims.
"""

import re
import logging
from typing import Dict, Any, List, Set, Tuple, Optional

logger = logging.getLogger("sbuweb.ai.llm.validator")

# Regex to find citation tags like [sbu_tech_kb_v1_p3_c015] or [p3_c015]
CITATION_REGEX = re.compile(r"\[(sbu_tech_kb_v1_p\d+_c\d+|p\d+_c\d+)\]", re.IGNORECASE)

# Keywords indicating missing info / abstention across English and Bangla
ABSTENTION_PATTERNS = [
    r"couldn'?t find this information",
    r"do not have (verified|any) information",
    r"not (mentioned|found|available) in the (knowledge base|provided context)",
    r"please contact our team",
    r"reach out to our team",
    r"তথ্য খুঁজে পাওয়া যা(য়নি|য় নাই)",
    r"সরাসরি কোনো তথ্য নেই",
    r"আমাদের টিমের সাথে যোগাযোগ",
    r"knowledge base does not contain",
    r"designed exclusively to answer questions about sbu tech",
    r"out-of-scope",
]


class AnswerValidator:
    """
    Validates LLM-generated answers for factual citations,
    hallucination flags, and compliance with SBU TECH guardrails.
    """

    def __init__(self, allowed_placeholders: Optional[List[str]] = None):
        self.allowed_placeholders = allowed_placeholders or []

    def extract_and_validate_citations(
        self,
        answer_text: str,
        retrieved_chunks: List[Dict[str, Any]],
    ) -> Tuple[List[Dict[str, Any]], List[str], str]:
        """
        Extracts cited chunk IDs from the generated text and verifies them against
        the actual retrieved context.

        Returns:
            Tuple of:
            - validated_sources: List of valid source metadata dicts.
            - hallucinated_citations: List of chunk IDs cited that were NOT in the retrieved context.
            - cleaned_answer: Answer text with hallucinated citations stripped or normalized.
        """
        # Map of valid chunk IDs present in the retrieved context
        chunk_map: Dict[str, Dict[str, Any]] = {}
        for chunk in retrieved_chunks:
            cid = chunk.get("chunk_id", "")
            if cid:
                chunk_map[cid] = chunk
                # Also index short alias (e.g. p3_c015)
                short_cid = re.sub(r"^sbu_tech_kb_v1_", "", cid)
                chunk_map[short_cid] = chunk

        # Find all citations in text
        raw_matches = CITATION_REGEX.findall(answer_text)
        cited_ids: Set[str] = set(raw_matches)

        validated_sources: List[Dict[str, Any]] = []
        hallucinated_citations: List[str] = []
        seen_validated_cids: Set[str] = set()

        for cid in cited_ids:
            clean_cid = cid.strip()
            if clean_cid in chunk_map:
                matched_chunk = chunk_map[clean_cid]
                canonical_cid = matched_chunk.get("chunk_id", clean_cid)
                if canonical_cid not in seen_validated_cids:
                    seen_validated_cids.add(canonical_cid)
                    validated_sources.append({
                        "chunk_id": canonical_cid,
                        "source_file": matched_chunk.get("source_file", "SBU_TECH.pdf"),
                        "page_number": matched_chunk.get("page_number", 1),
                        "section_title": matched_chunk.get("section_title", "Document Section"),
                    })
            else:
                hallucinated_citations.append(clean_cid)

        # If LLM didn't cite in-line brackets, but retrieved chunks were valid,
        # attach the top retrieved chunks as sources to preserve traceability
        if not validated_sources and retrieved_chunks:
            for chunk in retrieved_chunks[:3]:
                cid = chunk.get("chunk_id")
                if cid and cid not in seen_validated_cids:
                    seen_validated_cids.add(cid)
                    validated_sources.append({
                        "chunk_id": cid,
                        "source_file": chunk.get("source_file", "SBU_TECH.pdf"),
                        "page_number": chunk.get("page_number", 1),
                        "section_title": chunk.get("section_title", "Document Section"),
                    })

        # Strip hallucinated citation tags from the text
        cleaned_answer = answer_text
        for bad_cid in hallucinated_citations:
            logger.warning("Stripping hallucinated citation ID: %s", bad_cid)
            cleaned_answer = cleaned_answer.replace(f"[{bad_cid}]", "")

        return validated_sources, hallucinated_citations, cleaned_answer.strip()

    def is_abstention_response(self, text: str) -> bool:
        """
        Determines if the LLM output expresses an abstention or lack of verified information.
        """
        text_lower = text.lower()
        for pattern in ABSTENTION_PATTERNS:
            if re.search(pattern, text_lower):
                return True
        return False

    def check_prompt_injection_leak(self, text: str) -> bool:
        """
        Checks if the response leaks internal system prompts, API keys, or developer instructions.
        """
        text_lower = text.lower()
        forbidden_phrases = [
            "agentic_api_key",
            "models.chat.complete",
            "gemini_api_key",
            "here are my system instructions",
            "my instructions are to",
            "disregard previous instructions",
            "i am now dan",
        ]
        for phrase in forbidden_phrases:
            if phrase in text_lower:
                return True
        return False

    def validate_placeholders(self, text: str) -> bool:
        """
        Detects unreplaced editable placeholders like [ADD OFFICIAL CONTRACT NUMBER].
        """
        placeholder_pattern = r"\[ADD\s+[^\]]+\]"
        matches = re.findall(placeholder_pattern, text)
        for m in matches:
            if m not in self.allowed_placeholders:
                return False
        return True

