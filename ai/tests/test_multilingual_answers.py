"""
Unit tests for Multilingual Answer Generation.
Verifies cross-language synthesis (Bangla, Arabic, Hindi, CJK, etc.)
grounded in English source documents while preserving company entities.
"""

import unittest
from ai.llm.generator import RAGAnswerGenerator, GroundedResponse
from ai.llm.agentrouter_client import AgentRouterClient
from ai.evaluation.answer_evaluator import create_realistic_mock_handler


class TestMultilingualAnswers(unittest.TestCase):
    """Test suite for multilingual question answering."""

    def setUp(self):
        mock_client = AgentRouterClient(mock_handler=create_realistic_mock_handler())
        self.generator = RAGAnswerGenerator(client=mock_client)

    def test_regression_bangla_founders_query(self):
        """Verify Regression Test A: Bangla query retrieves and answers with correct leadership."""
        query = "এসবিইউ টেকের প্রধান প্রতিষ্ঠাতা এবং অংশীদার কারা?"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "answered")
        self.assertEqual(resp.language, "Bengali")
        self.assertTrue(resp.has_relevant_context)
        self.assertIn("বিধান সাহা ধ্রুব", resp.answer)
        self.assertIn("উৎসব সাহা", resp.answer)
        self.assertIn("বর্ষণ সাহা", resp.answer)

    def test_bangla_services_query(self):
        """Verify Bangla services query generates natural Bengali synthesis."""
        query = "এসবিইউ টেক কী ধরণের সেবা প্রদান করে?"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "answered")
        self.assertEqual(resp.language, "Bengali")
        self.assertTrue(resp.has_relevant_context)
        self.assertTrue("ওয়েব" in resp.answer or "ওয়েব" in resp.answer)
        self.assertIn("মোবাইল", resp.answer)

    def test_arabic_services_query(self):
        """Verify Arabic services query retains company name and retrieves correct section."""
        query = "ما هي الخدمات الهندسية التي تقدمها شركة SBU TECH؟"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "answered")
        self.assertEqual(resp.language, "Arabic")
        self.assertTrue(resp.has_relevant_context)
        self.assertIn("SBU TECH", resp.answer)

    def test_chinese_services_query(self):
        """Verify Chinese services query executes cross-lingual retrieval."""
        query = "SBU TECH 提供哪些软件工程服务？"
        resp: GroundedResponse = self.generator.generate_answer(query)

        self.assertEqual(resp.status, "answered")
        self.assertEqual(resp.language, "CJK")
        self.assertTrue(resp.has_relevant_context)
        self.assertIn("SBU TECH", resp.answer)


if __name__ == "__main__":
    unittest.main()
