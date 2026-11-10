"""
AgentRouter API Gateway Client for DeepSeek V4.1 Flash.
Handles authentication, request routing, strict fallback prevention,
cost/credit tracking, exponential backoff retries, and response validation.
"""

import time
import json
import logging
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional
import httpx

from ai.config.settings import settings

logger = logging.getLogger("sbuweb.ai.llm.agentrouter")


class AgentRouterError(Exception):
    """Base exception for AgentRouter API operations."""
    pass


class AgentRouterAuthError(AgentRouterError):
    """Raised when authentication fails (HTTP 401)."""
    pass


class AgentRouterCreditsError(AgentRouterError):
    """Raised when wallet credits are insufficient (HTTP 402)."""
    pass


class AgentRouterFallbackError(AgentRouterError):
    """Raised when provider fallback was executed despite allowFallback=False."""
    pass


class AgentRouterModelMismatchError(AgentRouterError):
    """Raised when returned model/provider differs from DeepSeek V4.1 Flash."""
    pass


class AgentRouterRateLimitError(AgentRouterError):
    """Raised when rate limits are exceeded (HTTP 429)."""
    pass


class AgentRouterAPIError(AgentRouterError):
    """Raised for server-side or unhandled API gateway errors."""
    pass


@dataclass
class AgentRouterChatResponse:
    """Structured response from AgentRouter chat completion execution."""
    completion_text: str
    model: str
    provider: str
    route_key: str
    fallback_used: bool
    usage: Dict[str, int] = field(default_factory=dict)
    credits_charged: float = 0.0
    raw_response: Dict[str, Any] = field(default_factory=dict)


class AgentRouterClient:
    """
    HTTP client for AgentRouter Agentic API.
    Interacts with POST /domains/models/capabilities/chat-complete/execute
    using Bearer token authorization and strict route guarantees.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        provider: Optional[str] = None,
        route_key: Optional[str] = None,
        allow_fallback: Optional[bool] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        timeout_seconds: Optional[float] = None,
        max_retries: int = 3,
        backoff_factor: float = 1.5,
        mock_handler: Optional[Any] = None,
    ):
        self.api_key = api_key if api_key is not None else settings.AGENTIC_API_KEY
        self.base_url = (base_url or settings.AGENTIC_API_BASE_URL).rstrip("/")
        self.model = model or settings.AGENTROUTER_MODEL
        self.provider = provider or settings.AGENTROUTER_PROVIDER
        self.route_key = route_key or settings.AGENTROUTER_ROUTE_KEY
        self.allow_fallback = (
            allow_fallback if allow_fallback is not None else settings.AGENTROUTER_ALLOW_FALLBACK
        )
        self.max_tokens = max_tokens or settings.AGENTROUTER_MAX_TOKENS
        self.temperature = (
            temperature if temperature is not None else settings.AGENTROUTER_TEMPERATURE
        )
        self.timeout_seconds = timeout_seconds or settings.AGENTROUTER_TIMEOUT_SECONDS
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor
        self.mock_handler = mock_handler

    @property
    def execute_endpoint(self) -> str:
        """Returns the full execute endpoint URL."""
        return f"{self.base_url}/domains/models/capabilities/chat-complete/execute"

    @property
    def contract_endpoint(self) -> str:
        """Returns the capability inspection contract endpoint URL."""
        return f"{self.base_url}/domains/models/capabilities/chat-complete"

    def _get_headers(self) -> Dict[str, str]:
        """Builds safe authorization headers without logging credentials."""
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "SBU-TECH-AI-Assistant/1.0",
        }

    def validate_api_key(self) -> None:
        """
        Validates API key format without making network requests.
        Ensures placeholder values are caught early.
        """
        key = (self.api_key or "").strip()
        if not key or key == "PASTE_YOUR_AGENTROUTER_API_KEY_HERE" or key.startswith("PASTE_YOUR_"):
            raise AgentRouterAuthError(
                "AGENTIC_API_KEY is not configured in the root `.env`. "
                "Please paste your AgentRouter API key into `.env` to proceed."
            )
        if len(key) < 8:
            raise AgentRouterAuthError("AGENTIC_API_KEY is too short or malformed.")

    def inspect_capability_contract(self) -> Dict[str, Any]:
        """
        Queries AgentRouter's capability contract to inspect supported parameters,
        routes, and schema definitions.
        """
        if self.mock_handler:
            return {
                "capability": "chat-complete",
                "domain": "models",
                "supportedRoutes": ["models.chat.complete.deepseek.mpp"],
                "defaultModel": "deepseek-flash",
                "provider": "deepseek",
            }

        self.validate_api_key()
        try:
            with httpx.Client(timeout=self.timeout_seconds) as client:
                resp = client.get(self.contract_endpoint, headers=self._get_headers())
                if resp.status_code == 200:
                    return resp.json()
                logger.warning(
                    "Contract inspection returned HTTP %d: %s", resp.status_code, resp.text[:200]
                )
                return {"status_code": resp.status_code, "detail": resp.text[:300]}
        except Exception as e:
            logger.warning("Contract endpoint inspection failed: %s", e)
            return {"error": str(e)}

    def chat_complete(
        self,
        messages: List[Dict[str, str]],
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
    ) -> AgentRouterChatResponse:
        """
        Executes a chat completion request through AgentRouter's DeepSeek MPP route.

        Args:
            messages: List of message dictionaries with 'role' and 'content'.
            max_tokens: Maximum tokens to generate (overrides default).
            temperature: Sampling temperature (overrides default).

        Returns:
            AgentRouterChatResponse containing text, metadata, usage, and credits.
        """
        # 1. Check if mock handler is provided (for unit testing without credits)
        if self.mock_handler:
            return self._handle_mock_call(messages, max_tokens, temperature)

        # 2. Key validation
        self.validate_api_key()

        # 3. Build payload
        payload = {
            "model": self.model,
            "provider": self.provider,
            "routeKey": self.route_key,
            "messages": messages,
            "max_tokens": max_tokens or self.max_tokens,
            "temperature": self.temperature if temperature is None else temperature,
            "allowFallback": self.allow_fallback,
        }

        # 4. Execute request with exponential backoff for transient errors
        headers = self._get_headers()
        url = self.execute_endpoint
        attempt = 0
        last_error = None

        while attempt <= self.max_retries:
            attempt += 1
            try:
                with httpx.Client(timeout=self.timeout_seconds) as client:
                    response = client.post(url, json=payload, headers=headers)

                # Check HTTP status
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_and_validate_response(data)

                if response.status_code == 401:
                    raise AgentRouterAuthError(
                        "AgentRouter authentication failed (HTTP 401). "
                        "Please verify AGENTIC_API_KEY in `.env`."
                    )

                if response.status_code == 402:
                    raise AgentRouterCreditsError(
                        "AgentRouter insufficient wallet credits (HTTP 402). "
                        "Please recharge your AgentRouter balance to continue."
                    )

                if response.status_code == 429:
                    if attempt <= self.max_retries:
                        sleep_time = self.backoff_factor ** attempt
                        logger.warning(
                            "AgentRouter rate limited (429). Retrying in %.1fs (attempt %d/%d)...",
                            sleep_time, attempt, self.max_retries
                        )
                        time.sleep(sleep_time)
                        continue
                    raise AgentRouterRateLimitError("AgentRouter rate limit exceeded (HTTP 429).")

                if response.status_code in (500, 502, 503, 504):
                    if attempt <= self.max_retries:
                        sleep_time = self.backoff_factor ** attempt
                        logger.warning(
                            "AgentRouter server error (%d). Retrying in %.1fs (attempt %d/%d)...",
                            response.status_code, sleep_time, attempt, self.max_retries
                        )
                        time.sleep(sleep_time)
                        continue
                    raise AgentRouterAPIError(
                        f"AgentRouter gateway error (HTTP {response.status_code}): {response.text[:300]}"
                    )

                # Other HTTP errors
                raise AgentRouterAPIError(
                    f"AgentRouter request failed with HTTP {response.status_code}: {response.text[:300]}"
                )

            except (httpx.TimeoutException, httpx.NetworkError) as net_err:
                last_error = net_err
                if attempt <= self.max_retries:
                    sleep_time = self.backoff_factor ** attempt
                    logger.warning(
                        "Network error (%s). Retrying in %.1fs (attempt %d/%d)...",
                        net_err, sleep_time, attempt, self.max_retries
                    )
                    time.sleep(sleep_time)
                    continue
                raise AgentRouterAPIError(f"AgentRouter network error: {net_err}") from net_err

        raise AgentRouterAPIError(f"AgentRouter request failed after {self.max_retries} retries: {last_error}")

    def _parse_and_validate_response(self, data: Dict[str, Any]) -> AgentRouterChatResponse:
        """
        Extracts response fields and enforces strict model and fallback invariants.
        """
        # Check for credit error embedded in 200 payload
        if data.get("error"):
            err_msg = str(data["error"]).lower()
            if "credit" in err_msg or "balance" in err_msg or "insufficient" in err_msg:
                raise AgentRouterCreditsError(f"AgentRouter wallet balance issue: {data['error']}")
            raise AgentRouterAPIError(f"AgentRouter error in response: {data['error']}")

        # Primary extraction
        completion_text = (
            data.get("completionText")
            or data.get("result", {}).get("completionText")
            or (data.get("choices", [{}])[0].get("message", {}).get("content"))
            or ""
        )

        returned_model = (
            data.get("model")
            or data.get("result", {}).get("model")
            or self.model
        )

        returned_provider = (
            data.get("provider")
            or data.get("result", {}).get("provider")
            or self.provider
        )

        route_key = (
            data.get("routeKey")
            or data.get("result", {}).get("routeKey")
            or self.route_key
        )

        fallback_used = bool(
            data.get("fallbackUsed")
            or data.get("result", {}).get("fallbackUsed")
            or False
        )

        usage = (
            data.get("usage")
            or data.get("result", {}).get("usage")
            or {}
        )

        credits_charged = float(
            data.get("creditsCharged")
            or data.get("result", {}).get("creditsCharged")
            or data.get("credits_charged")
            or 0.0
        )

        # 1. Fallback Prevention Check
        if not self.allow_fallback and fallback_used:
            raise AgentRouterFallbackError(
                f"AgentRouter executed a fallback provider ({returned_provider}/{returned_model}), "
                f"which violates the strict allowFallback=False policy."
            )

        # 2. Provider Verification
        if self.provider.lower() != returned_provider.lower():
            raise AgentRouterModelMismatchError(
                f"Expected provider '{self.provider}', but AgentRouter returned '{returned_provider}'."
            )

        # 3. Model Verification: Ensure returned model is DeepSeek Flash
        model_lower = returned_model.lower()
        if "deepseek" not in model_lower:
            raise AgentRouterModelMismatchError(
                f"Configured model is DeepSeek V4.1 Flash ('{self.model}'), "
                f"but AgentRouter returned unrelated model '{returned_model}'."
            )

        return AgentRouterChatResponse(
            completion_text=completion_text.strip(),
            model=returned_model,
            provider=returned_provider,
            route_key=route_key,
            fallback_used=fallback_used,
            usage=usage,
            credits_charged=credits_charged,
            raw_response=data,
        )

    def _handle_mock_call(
        self,
        messages: List[Dict[str, str]],
        max_tokens: Optional[int],
        temperature: Optional[float],
    ) -> AgentRouterChatResponse:
        """Handles mock invocation for tests without spending credits or network calls."""
        if callable(self.mock_handler):
            raw = self.mock_handler(messages)
            if isinstance(raw, AgentRouterChatResponse):
                return raw
            if isinstance(raw, dict):
                return self._parse_and_validate_response(raw)
            return AgentRouterChatResponse(
                completion_text=str(raw),
                model=self.model,
                provider=self.provider,
                route_key=self.route_key,
                fallback_used=False,
                usage={"prompt_tokens": 120, "completion_tokens": 80, "total_tokens": 200},
                credits_charged=0.0001,
            )

        # Default mock response
        return AgentRouterChatResponse(
            completion_text="Mock DeepSeek V4.1 Flash response.",
            model=self.model,
            provider=self.provider,
            route_key=self.route_key,
            fallback_used=False,
            usage={"prompt_tokens": 100, "completion_tokens": 50, "total_tokens": 150},
            credits_charged=0.0001,
        )
