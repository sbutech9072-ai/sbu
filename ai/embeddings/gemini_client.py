import logging
import time
import random
from typing import List, Optional
from google import genai
from google.genai import types
from google.genai.errors import APIError

from ai.config.settings import settings

logger = logging.getLogger("sbuweb.ai.embeddings.gemini_client")


class GeminiAuthError(Exception):
    """Raised when the Gemini API key is missing, invalid, or still a placeholder."""
    pass


class GeminiQuotaExceededError(Exception):
    """Raised when Gemini Free Tier quota is exhausted (HTTP 429)."""
    pass


class GeminiEmbeddingClient:
    """
    Official Google Gemini Embedding API client using `google-genai` SDK.
    Supports 100+ languages, 1536-dimensional embeddings, rate-limiting and backoff.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        dimension: Optional[int] = None,
    ):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_EMBEDDING_MODEL
        self.dimension = dimension or settings.GEMINI_EMBEDDING_DIMENSION
        self._client: Optional[genai.Client] = None

    def _ensure_client(self) -> genai.Client:
        """Initializes and caches the Google Gen AI client with validation."""
        if self._client is not None:
            return self._client

        if not settings.is_gemini_api_key_valid():
            raise GeminiAuthError(
                "Gemini API key is not configured or is still the placeholder. "
                "Please add your valid Gemini API key to `ai/.env` (GEMINI_API_KEY=...)."
            )

        try:
            self._client = genai.Client(api_key=self.api_key)
            return self._client
        except Exception as e:
            raise GeminiAuthError(f"Failed to initialize Google Gen AI client: {e}")

    def embed_text(
        self,
        text: str,
        custom_dimension: Optional[int] = None,
        max_retries: Optional[int] = None,
    ) -> List[float]:
        """
        Generates an embedding vector for a single text input with automatic retries and backoff.
        Requests exact output dimensionality (default: 1536).
        """
        client = self._ensure_client()
        dim = custom_dimension or self.dimension
        retries = max_retries or settings.MAX_RETRIES

        config = types.EmbedContentConfig(
            output_dimensionality=dim,
        )

        for attempt in range(1, retries + 1):
            try:
                # Add slight delay between calls to respect Free Tier RPM limits
                if settings.REQUEST_DELAY_SECONDS > 0:
                    time.sleep(settings.REQUEST_DELAY_SECONDS)

                response = client.models.embed_content(
                    model=self.model,
                    contents=text,
                    config=config,
                )

                if not response or not response.embeddings or not response.embeddings[0].values:
                    raise ValueError("Received empty embedding vector from Gemini API.")

                vector = list(response.embeddings[0].values)

                # Validate dimensionality
                if len(vector) != dim:
                    raise ValueError(
                        f"Vector dimension mismatch: expected {dim}, got {len(vector)}"
                    )

                return vector

            except APIError as api_err:
                error_code = getattr(api_err, "code", None)
                error_message = str(api_err).lower()

                # Quota or rate-limit error
                if error_code == 429 or "resource_exhausted" in error_message or "quota" in error_message:
                    if attempt == retries:
                        logger.error("Gemini API Free Tier rate limit or quota exceeded after %d retries.", retries)
                        raise GeminiQuotaExceededError(
                            "Gemini Free Tier quota or rate limit exceeded. Processing paused. "
                            "Please wait for quota reset or check your quota at Google AI Studio."
                        ) from api_err

                    sleep_time = (settings.BACKOFF_FACTOR ** attempt) + random.uniform(0.5, 1.5)
                    logger.warning(
                        "Gemini API rate limit hit (attempt %d/%d). Backing off for %.2fs...",
                        attempt,
                        retries,
                        sleep_time,
                    )
                    time.sleep(sleep_time)

                # Temporary server error (500, 503)
                elif error_code in (500, 502, 503, 504):
                    if attempt == retries:
                        raise
                    sleep_time = (settings.BACKOFF_FACTOR ** attempt) + random.uniform(0.5, 1.0)
                    logger.warning("Gemini server error %s. Retrying in %.2fs...", error_code, sleep_time)
                    time.sleep(sleep_time)
                else:
                    # Non-retryable error
                    raise

            except Exception as e:
                if attempt == retries:
                    raise
                sleep_time = (settings.BACKOFF_FACTOR ** attempt)
                logger.warning("Unexpected error during embedding generation: %s. Retrying...", e)
                time.sleep(sleep_time)

        raise RuntimeError("Failed to generate embedding after maximum retries.")
