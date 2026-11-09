"""
Unit tests for Citation Validation and Hallucination Stripping.
"""

import unittest
from ai.llm.answer_validator import AnswerValidator


class TestCitations(unittest.TestCase):
    """Test suite for citation validation."""

    def setUp(self):
        self.validator = AnswerValidator()
        self.retrieved_chunks = [
            {
                "chunk_id": "sbu_tech_kb_v1_p2_c006",
                "source_file": "SBU_TECH.pdf",
                "page_number": 2,
                "section_title": "4. What SBU TECH does",
            },
            {
                "chunk_id": "sbu_tech_kb_v1_p3_c015",
                "source_file": "SBU_TECH.pdf",
                "page_number": 3,
                "section_title": "7. Website portal & login guidance",
            },
        ]

    def test_valid_citation_extraction(self):
        """Verify extraction and metadata mapping of valid chunk citations."""
        answer_text = (
            "SBU TECH provides full-stack web and mobile engineering [sbu_tech_kb_v1_p2_c006]. "
            "Clients can log in to the portal at /client/login [sbu_tech_kb_v1_p3_c015]."
        )
        sources, bad_citations, cleaned = self.validator.extract_and_validate_citations(
            answer_text, self.retrieved_chunks
        )

        self.assertEqual(len(sources), 2)
        self.assertEqual(len(bad_citations), 0)
        self.assertEqual(sources[0]["chunk_id"], "sbu_tech_kb_v1_p2_c006")
        self.assertEqual(sources[0]["page_number"], 2)
        self.assertEqual(sources[1]["chunk_id"], "sbu_tech_kb_v1_p3_c015")
        self.assertEqual(sources[1]["page_number"], 3)

    def test_hallucinated_citation_stripping(self):
        """Verify that hallucinated citations are flagged and stripped from output."""
        answer_text = (
            "SBU TECH provides mobile engineering [sbu_tech_kb_v1_p2_c006] and has an office in Mars [sbu_tech_kb_v1_p99_c999]."
        )
        sources, bad_citations, cleaned = self.validator.extract_and_validate_citations(
            answer_text, self.retrieved_chunks
        )

        self.assertEqual(len(sources), 1)
        self.assertIn("sbu_tech_kb_v1_p99_c999", bad_citations)
        self.assertNotIn("[sbu_tech_kb_v1_p99_c999]", cleaned)
        self.assertIn("[sbu_tech_kb_v1_p2_c006]", cleaned)

    def test_fallback_sources_when_no_inline_tags(self):
        """Verify that if LLM omits bracketed tags, top retrieved chunks are attached."""
        answer_text = "SBU TECH provides web and cloud services."
        sources, bad_citations, cleaned = self.validator.extract_and_validate_citations(
            answer_text, self.retrieved_chunks
        )

        self.assertTrue(len(sources) > 0)
        self.assertEqual(sources[0]["chunk_id"], "sbu_tech_kb_v1_p2_c006")


if __name__ == "__main__":
    unittest.main()

