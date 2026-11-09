"""
Phase 4: Local LLM Model Loader
"""
from typing import Optional
from pathlib import Path
from ai.config.settings import settings


class LocalLLMLoader:
    """
    Manages loading and memory allocation for local quantized LLMs
    (e.g., Llama-3-8B-Instruct or Mistral) cached in ai/models/.
    """

    def __init__(
        self,
        model_name: Optional[str] = None,
        cache_dir: Optional[Path] = None,
    ):
        self.model_name = model_name or settings.LOCAL_LLM_MODEL_NAME
        self.cache_dir = cache_dir or settings.MODELS_DIR
        self._pipeline = None

    def load_model(self) -> None:
        """Loads model weights with 4-bit / 8-bit quantization."""
        raise NotImplementedError("Local LLM loader will be activated in Phase 4.")

