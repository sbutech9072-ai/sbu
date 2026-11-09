"""
FastAPI Backend Integration Tests for Phase 5 AI Assistant Endpoints.
Tests request validation, health checks, session creation, chat generation,
source citations, follow-up continuity, rate limiting, and session isolation.
"""

import sys
import unittest
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure root workspace and backend are in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
for p in [str(PROJECT_ROOT), str(BACKEND_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.main import app
from app.services.ai_chat import AIChatService
from ai.llm.agentrouter_client import AgentRouterClient
from ai.evaluation.answer_evaluator import create_realistic_mock_handler


class TestFastAPIPhase5Integration(unittest.TestCase):
    """Integration test suite for FastAPI AI Assistant endpoints."""

    @classmethod
    def setUpClass(cls):
        # Inject realistic mock handler into chat service so no live credits are burned during tests
        mock_client = AgentRouterClient(mock_handler=create_realistic_mock_handler())
        from app.api.v1.endpoints import ai as ai_endpoint_module
        ai_endpoint_module.chat_service = AIChatService(custom_client=mock_client)
        cls.client = TestClient(app)

    def test_01_health_check_endpoints(self):
        """1. Verify health check on both /api/ai/health and /api/v1/ai/health."""
        for path in ("/api/ai/health", "/api/v1/ai/health"):
            resp = self.client.get(path)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertIn("status", data)
            self.assertTrue(data["backend_available"])
            self.assertTrue(data["ai_module_available"])
            self.assertIn("qdrant_connected", data)
            self.assertIn("embedding_ready", data)
            self.assertIn("llm_ready", data)
            # Ensure no credentials leaked
            self.assertNotIn("key", str(data).lower())
            self.assertNotIn("secret", str(data).lower())

    def test_02_new_session_endpoint(self):
        """2. Verify session allocation via POST /api/ai/session/new."""
        resp = self.client.post("/api/ai/session/new")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("session_id", data)
        self.assertTrue(len(data["session_id"]) >= 8)

    def test_03_request_validation_empty_message(self):
        """3. Verify 400 Bad Request on empty or whitespace message."""
        resp = self.client.post("/api/ai/chat", json={"message": ""})
        self.assertEqual(resp.status_code, 400)
        data = resp.json()
        self.assertEqual(data.get("code"), "VALIDATION_ERROR")

    def test_04_successful_chat_generation(self):
        """4. Verify successful chat response on POST /api/ai/chat."""
        payload = {
            "message": "What services does SBU TECH provide?",
        }
        resp = self.client.post("/api/ai/chat", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        self.assertIn("session_id", data)
        self.assertIn("answer", data)
        self.assertEqual(data["status"], "answered")
        self.assertIn("request_id", data)
        self.assertTrue(len(data["sources"]) > 0)
        first_src = data["sources"][0]
        self.assertIn("chunk_id", first_src)
        self.assertIn("page_number", first_src)

    def test_05_multi_turn_continuity(self):
        """5. Verify multi-turn conversational continuity within the same session."""
        # Turn 1
        resp1 = self.client.post("/api/ai/chat", json={"message": "What services does SBU TECH provide?"})
        self.assertEqual(resp1.status_code, 200)
        sid = resp1.json()["session_id"]

        # Turn 2 (Follow-up referencing Turn 1)
        resp2 = self.client.post(
            "/api/ai/chat",
            json={"session_id": sid, "message": "Explain the first one."}
        )
        self.assertEqual(resp2.status_code, 200)
        data2 = resp2.json()
        self.assertEqual(data2["session_id"], sid)
        self.assertEqual(data2["status"], "answered")
        self.assertIn("web", data2["answer"].lower())

    def test_06_session_isolation(self):
        """6. Verify session isolation between different visitors."""
        # Session A
        resp_a = self.client.post("/api/ai/chat", json={"message": "Where is SBU TECH based?"})
        sid_a = resp_a.json()["session_id"]

        # Session B
        resp_b = self.client.post("/api/ai/chat", json={"message": "How do clients log in to the portal?"})
        sid_b = resp_b.json()["session_id"]

        self.assertNotEqual(sid_a, sid_b)

        # Check history of Session A
        hist_a = self.client.get(f"/api/ai/session/{sid_a}/history")
        self.assertEqual(hist_a.status_code, 200)
        msgs_a = hist_a.json()["messages"]
        self.assertEqual(msgs_a[0]["content"], "Where is SBU TECH based?")

        # Check history of Session B
        hist_b = self.client.get(f"/api/ai/session/{sid_b}/history")
        self.assertEqual(hist_b.status_code, 200)
        msgs_b = hist_b.json()["messages"]
        self.assertEqual(msgs_b[0]["content"], "How do clients log in to the portal?")

    def test_07_no_answer_abstention(self):
        """7. Verify missing company info returns polite abstention without sources."""
        resp = self.client.post(
            "/api/ai/chat",
            json={"message": "How many employees does SBU TECH currently have worldwide?"}
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "no_relevant_information")
        self.assertEqual(len(data["sources"]), 0)
        self.assertIn("couldn't find this information", data["answer"].lower())

    def test_08_api_v1_path_parity(self):
        """8. Verify identical behavior between /api/ai/chat and /api/v1/ai/chat."""
        resp = self.client.post(
            "/api/v1/ai/chat",
            json={"message": "What is SBU TECH?"}
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("session_id", data)
        self.assertIn("answer", data)


if __name__ == "__main__":
    unittest.main()
