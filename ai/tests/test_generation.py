"""
Unit tests for End-to-End RAG Generation.
Verifies response schema, retrieval-to-generation pipeline,
and status assignment without spending live credits.
"""

import unittest
from ai.llm.generator import RAGAnswerGenerator, GroundedResponse
from ai.llm.agentrouter_client import AgentRouterClient
from ai.evaluation.answer_evaluator import create_realistic_mock_handler


class TestRAGGeneration(unittest.TestCase):
    """Test suite for RAG Generation flow."""

    def setUp(self):
        mock_client = AgentRouterClient(mock_handler=create_realistic_mock_handler())
        self.generator = RAGAnswerGenerator(client=mock_client)

    def test_successful_answer_generation(self):
        """Verify successful answer generation with verified sources."""
        query = "What services does SBU TECH provide?"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "answered")
        self.assertTrue(resp.has_relevant_context)
        self.assertTrue(len(resp.sources) > 0)
        self.assertEqual(resp.model, "deepseek-flash")
        self.assertEqual(resp.provider, "deepseek")
        self.assertTrue(resp.credits_charged > 0)
        self.assertIn("web", resp.answer.lower())

    def test_schema_completeness(self):
        """Verify that all required fields are present in the response dictionary."""
        query = "Where is SBU TECH based and what is their official contact email?"
        resp: GroundedResponse = self.generator.generate_answer(query)
        data = resp.to_dict()

        expected_keys = [
            "answer", "status", "language", "sources", "has_relevant_context",
            "model", "provider", "usage", "credits_charged", "refusal_reason", "execution_time_ms"
        ]
        for key in expected_keys:
            self.assertIn(key, data)

        self.assertEqual(data["status"], "answered")
        self.assertTrue(len(data["sources"]) > 0)
        first_source = data["sources"][0]
        self.assertIn("chunk_id", first_source)
        self.assertIn("page_number", first_source)
        self.assertIn("section_title", first_source)

    def test_regression_portal_login_guidance(self):
        """Verify Regression B: Portal Login guidance answers correctly."""
        query = "How do clients log in to the SBU TECH client portal?"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "answered")
        self.assertTrue(resp.has_relevant_context)
        self.assertIn("/client/login", resp.answer)
        chunk_ids = [s["chunk_id"] for s in resp.sources]
        self.assertTrue(any("p3_c015" in cid for cid in chunk_ids))


if __name__ == "__main__":
    unittest.main()

