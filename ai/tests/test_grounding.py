"""
Unit tests for Strict Grounding & Abstention Safeguards.
Verifies knowledge-base-only constraints, unanswerable company inquiries,
and out-of-scope rejection.
"""

import unittest
from ai.llm.generator import RAGAnswerGenerator, GroundedResponse
from ai.llm.agentrouter_client import AgentRouterClient
from ai.evaluation.answer_evaluator import create_realistic_mock_handler


class TestGroundingSafeguards(unittest.TestCase):
    """Test suite for factual grounding and abstention."""

    def setUp(self):
        mock_client = AgentRouterClient(mock_handler=create_realistic_mock_handler())
        self.generator = RAGAnswerGenerator(client=mock_client)

    def test_missing_company_information_abstention(self):
        """Verify unanswerable company question abstains politely without calling LLM."""
        query = "How many employees does SBU TECH currently have worldwide?"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "no_relevant_information")
        self.assertFalse(resp.has_relevant_context)
        self.assertEqual(len(resp.sources), 0)
        self.assertIn("couldn't find this information", resp.answer.lower())
        self.assertEqual(resp.credits_charged, 0.0)  # Zero credits spent!

    def test_out_of_scope_rejection(self):
        """Verify general world knowledge inquiry is cleanly rejected."""
        query = "Who is the Prime Minister of Bangladesh?"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "out_of_scope")
        self.assertFalse(resp.has_relevant_context)
        self.assertEqual(len(resp.sources), 0)
        self.assertIn("exclusively to answer questions about sbu tech", resp.answer.lower())
        self.assertEqual(resp.credits_charged, 0.0)  # Zero credits spent!

    def test_compliance_and_readiness_grounding(self):
        """Verify that SOC 2 questions clearly state readiness and not formal certification."""
        query = "Does SBU TECH hold formal third-party SOC 2 and HIPAA certifications?"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "answered")
        self.assertTrue(resp.has_relevant_context)
        # Grounding check: must mention readiness/controls and not certified
        answer_lower = resp.answer.lower()
        self.assertTrue("not hold" in answer_lower or "readiness" in answer_lower or "controls" in answer_lower)

    def test_mock_admin_mode_grounding(self):
        """Verify that admin questions state the website uses a Mock Admin Mode interface."""
        query = "Can I use the admin panel to modify live production database records?"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "answered")
        self.assertTrue(resp.has_relevant_context)
        self.assertIn("mock admin mode", resp.answer.lower())


if __name__ == "__main__":
    unittest.main()

