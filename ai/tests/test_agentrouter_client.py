"""
Unit tests for AgentRouterClient.
Tests configuration, API key validation, payload formatting, model validation,
fallback prevention, credit error handling, and response parsing.
"""

import unittest
from unittest.mock import MagicMock, patch

from ai.config.settings import settings
from ai.llm.agentrouter_client import (
    AgentRouterClient,
    AgentRouterChatResponse,
    AgentRouterAuthError,
    AgentRouterCreditsError,
    AgentRouterFallbackError,
    AgentRouterModelMismatchError,
    AgentRouterRateLimitError,
)


class TestAgentRouterClient(unittest.TestCase):
    """Test suite for AgentRouter API Client."""

    def test_environment_configuration(self):
        """1. Verify environment configuration loading."""
        self.assertEqual(settings.AGENTROUTER_MODEL, "deepseek-flash")
        self.assertEqual(settings.AGENTROUTER_PROVIDER, "deepseek")
        self.assertEqual(settings.AGENTROUTER_ROUTE_KEY, "models.chat.complete.deepseek.mpp")
        self.assertFalse(settings.AGENTROUTER_ALLOW_FALLBACK)
        self.assertEqual(settings.AGENTROUTER_MAX_TOKENS, 1500)
        self.assertEqual(settings.AGENTROUTER_TEMPERATURE, 0.2)

    def test_api_key_validation_placeholder(self):
        """2. Verify placeholder key is rejected without network call."""
        client = AgentRouterClient(api_key="PASTE_YOUR_AGENTROUTER_API_KEY_HERE")
        with self.assertRaises(AgentRouterAuthError):
            client.validate_api_key()

        client_empty = AgentRouterClient(api_key="")
        with self.assertRaises(AgentRouterAuthError):
            client_empty.validate_api_key()

    def test_successful_mock_response_parsing(self):
        """3. Verify correct parsing of AgentRouter completion fields."""
        client = AgentRouterClient(
            api_key="valid-dummy-key-for-test",
            mock_handler=lambda msgs: {
                "completionText": "Hello from DeepSeek V4.1 Flash",
                "model": "deepseek-flash",
                "provider": "deepseek",
                "routeKey": "models.chat.complete.deepseek.mpp",
                "fallbackUsed": False,
                "usage": {"prompt_tokens": 50, "completion_tokens": 15, "total_tokens": 65},
                "creditsCharged": 0.00012,
            }
        )
        resp = client.chat_complete([{"role": "user", "content": "Hello"}])
        self.assertIsInstance(resp, AgentRouterChatResponse)
        self.assertEqual(resp.completion_text, "Hello from DeepSeek V4.1 Flash")
        self.assertEqual(resp.model, "deepseek-flash")
        self.assertEqual(resp.provider, "deepseek")
        self.assertFalse(resp.fallback_used)
        self.assertEqual(resp.usage["total_tokens"], 65)
        self.assertAlmostEqual(resp.credits_charged, 0.00012)

    def test_strict_fallback_prevention(self):
        """4. Verify response is rejected if fallbackUsed=True."""
        client = AgentRouterClient(
            api_key="valid-dummy-key-for-test",
            allow_fallback=False,
            mock_handler=lambda msgs: {
                "completionText": "Fallback response",
                "model": "backup-model",
                "provider": "deepseek",
                "routeKey": "models.chat.complete.deepseek.mpp",
                "fallbackUsed": True,
            }
        )
        with self.assertRaises(AgentRouterFallbackError):
            client.chat_complete([{"role": "user", "content": "Test"}])

    def test_model_and_provider_mismatch_prevention(self):
        """5. Verify response is rejected if provider or model does not match."""
        # Provider mismatch
        client_wrong_provider = AgentRouterClient(
            api_key="valid-dummy-key-for-test",
            mock_handler=lambda msgs: {
                "completionText": "Wrong provider response",
                "model": "deepseek-flash",
                "provider": "openrouter",
                "routeKey": "models.chat.complete.deepseek.mpp",
                "fallbackUsed": False,
            }
        )
        with self.assertRaises(AgentRouterModelMismatchError):
            client_wrong_provider.chat_complete([{"role": "user", "content": "Test"}])

        # Model mismatch (unrelated model)
        client_wrong_model = AgentRouterClient(
            api_key="valid-dummy-key-for-test",
            mock_handler=lambda msgs: {
                "completionText": "Unrelated model response",
                "model": "gpt-4o-mini",
                "provider": "deepseek",
                "routeKey": "models.chat.complete.deepseek.mpp",
                "fallbackUsed": False,
            }
        )
        with self.assertRaises(AgentRouterModelMismatchError):
            client_wrong_model.chat_complete([{"role": "user", "content": "Test"}])

    def test_insufficient_credits_handling(self):
        """6. Verify handling of HTTP 402 or embedded balance errors."""
        client = AgentRouterClient(
            api_key="valid-dummy-key-for-test",
            mock_handler=lambda msgs: {
                "error": "Insufficient wallet balance or credits"
            }
        )
        with self.assertRaises(AgentRouterCreditsError):
            client.chat_complete([{"role": "user", "content": "Test"}])


if __name__ == "__main__":
    unittest.main()

