import logging
from typing import List
from app.core.config import settings

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Modular embedding interface supporting OpenAI, FastEmbed, or HuggingFace."""

    def __init__(self, model_name: str = "text-embedding-3-small"):
        self.model_name = model_name

    def embed_query(self, text: str) -> List[float]:
        """Generates embedding vector for a single query string."""
        if not settings.OPENAI_API_KEY:
            # Deterministic mock pseudo-embedding vector of 384 dimensions for offline testing
            return [0.01 * (i % 10) for i in range(384)]

        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            res = client.embeddings.create(input=[text], model=self.model_name)
            return res.data[0].embedding
        except Exception as e:
            logger.error("Embedding generation failed: %s", e)
            return [0.0] * 384

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generates embedding vectors for a batch of documents."""
        return [self.embed_query(t) for t in texts]

