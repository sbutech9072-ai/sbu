"""
Phase 2: Embedding Model Abstraction (Prepared for BAAI/bge-m3)
"""
from typing import List, Optional
from ai.config.settings import settings


class BGEEmbeddingModel:
    """
    Interface for BAAI/bge-m3 multilingual dense & sparse embeddings.
    To be activated during Phase 2.
    """

    def __init__(
        self,
        model_name: Optional[str] = None,
        device: Optional[str] = None,
    ):
        self.model_name = model_name or settings.EMBEDDING_MODEL_NAME
        self.device = device or settings.EMBEDDING_DEVICE
        self.dimension = settings.EMBEDDING_DIMENSION
        self._model = None

    def load(self) -> None:
        """Loads model weights locally into memory / GPU."""
        raise NotImplementedError("Embedding model loading will be activated in Phase 2.")

    def encode(self, texts: List[str]) -> List[List[float]]:
        """Encodes texts into 1024-dimensional normalized dense vectors."""
        raise NotImplementedError("Embedding generation will be activated in Phase 2.")

