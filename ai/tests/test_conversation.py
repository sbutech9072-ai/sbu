"""
Unit tests for Conversation History and Follow-up Question Resolution.
"""

import unittest
from ai.llm.conversation import ConversationManager
from ai.llm.generator import RAGAnswerGenerator, GroundedResponse
from ai.llm.agentrouter_client import AgentRouterClient
from ai.evaluation.answer_evaluator import create_realistic_mock_handler


class TestConversation(unittest.TestCase):
    """Test suite for conversation continuity."""

    def setUp(self):
        self.mgr = ConversationManager()
        mock_client = AgentRouterClient(mock_handler=create_realistic_mock_handler())
        self.generator = RAGAnswerGenerator(client=mock_client, conversation_mgr=self.mgr)

    def test_follow_up_query_detection(self):
        """Verify detection of pronoun-dependent follow-up queries."""
        self.assertTrue(self.mgr.is_follow_up_query("Explain the first one."))
        self.assertTrue(self.mgr.is_follow_up_query("Tell me more about it."))
        self.assertTrue(self.mgr.is_follow_up_query("What about that?"))
        self.assertTrue(self.mgr.is_follow_up_query("প্রথমটি বুঝিয়ে বলুন"))
        self.assertFalse(self.mgr.is_follow_up_query("What services does SBU TECH provide?"))

    def test_query_contextualization(self):
        """Verify query reformulation when given previous user/assistant context."""
        history = [
            {"role": "user", "content": "What services does SBU TECH provide?"},
            {
                "role": "assistant",
                "content": "SBU TECH provides full-stack web and mobile application development.",
            },
        ]
        contextualized = self.mgr.contextualize_query("Explain the first one.", history)
        self.assertIn("What services does SBU TECH provide?", contextualized)
        self.assertIn("Explain the first one.", contextualized)

    def test_end_to_end_follow_up_generation(self):
        """Verify end-to-end grounded answer generation for follow-up questions."""
        history = [
            {"role": "user", "content": "What services does SBU TECH provide?"},
            {
                "role": "assistant",
                "content": "SBU TECH provides 1. Full-stack web and mobile development, 2. AI engineering.",
            },
        ]
        resp: GroundedResponse = self.generator.generate_answer(
            question="Explain the first one.",
            conversation_history=history,
        )

        self.assertEqual(resp.status, "answered")
        self.assertTrue(resp.has_relevant_context)
        self.assertIn("web", resp.answer.lower())
        chunk_ids = [s["chunk_id"] for s in resp.sources]
        self.assertTrue(any("p2_c006" in cid for cid in chunk_ids))


if __name__ == "__main__":
    unittest.main()

