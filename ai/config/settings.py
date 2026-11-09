import os
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Determine base AI workspace directory
AI_DIR = Path(__file__).resolve().parent.parent

# Explicitly load ai/.env
_env_file = AI_DIR / ".env"
if _env_file.is_file():
    load_dotenv(_env_file, override=True)


class AISettings(BaseSettings):
    """
    Centralized configuration for the SBU TECH AI subsystem.
    Loads configurations from `ai/.env` with type validation and path resolution.
    """

    model_config = SettingsConfigDict(
        env_file=str(AI_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Base workspace directories
    AI_DIR: Path = AI_DIR
    ROOT_DIR: Path = AI_DIR.parent

    # Document locations
    SOURCE_PDF: Path = AI_DIR / "SBU_TECH.pdf"

    # Data directories
    DATA_DIR: Path = AI_DIR / "data"
    RAW_DIR: Path = DATA_DIR / "raw"
    EXTRACTED_DIR: Path = DATA_DIR / "extracted"
    CLEANED_DIR: Path = DATA_DIR / "cleaned"
    CHUNKS_DIR: Path = DATA_DIR / "chunks"
    EVALUATION_DIR: Path = DATA_DIR / "evaluation"
    EMBEDDINGS_DIR: Path = DATA_DIR / "embeddings"
    INDEXING_DIR: Path = DATA_DIR / "indexing"

    # Phase 1 Processing output files
    RAW_EXTRACTED_FILE: Path = EXTRACTED_DIR / "raw_extracted.json"
    CLEANED_TEXT_FILE: Path = CLEANED_DIR / "cleaned_text.txt"
    CHUNKS_JSONL_FILE: Path = CHUNKS_DIR / "chunks.jsonl"
    CHUNKS_CSV_FILE: Path = CHUNKS_DIR / "chunks.csv"
    MANIFEST_FILE: Path = DATA_DIR / "manifest.json"
    REVIEW_REPORT_FILE: Path = DATA_DIR / "review_report.md"

    # Phase 2 Caching & Indexing artifacts
    EMBEDDING_CACHE_FILE: Path = EMBEDDINGS_DIR / "embedding_cache.json"
    INDEXING_MANIFEST_FILE: Path = INDEXING_DIR / "indexing_manifest.json"
    EXCLUDED_CHUNKS_FILE: Path = INDEXING_DIR / "excluded_chunks.json"

    # Storage and models
    MODELS_DIR: Path = AI_DIR / "models"
    STORAGE_DIR: Path = AI_DIR / "storage"
    QDRANT_STORAGE_DIR: Path = STORAGE_DIR / "qdrant"
    LOGS_DIR: Path = AI_DIR / "logs"
    PROMPTS_DIR: Path = AI_DIR / "prompts"
    SYSTEM_PROMPT_FILE: Path = PROMPTS_DIR / "system_prompt.txt"

    # Phase 1: Ingestion & Chunking parameters
    DOCUMENT_ID: str = "sbu_tech_kb_v1"
    TARGET_CHUNK_TOKENS: int = 400
    MIN_CHUNK_TOKENS: int = 80
    MAX_CHUNK_TOKENS: int = 550
    CHUNK_OVERLAP_TOKENS: int = 65

    # Phase 2: Google Gemini Embedding API configuration
    GEMINI_API_KEY: str = Field(default="PASTE_YOUR_GEMINI_API_KEY_HERE")
    GEMINI_EMBEDDING_MODEL: str = Field(default="gemini-embedding-2")
    GEMINI_EMBEDDING_DIMENSION: int = Field(default=1536)

    # Phase 2: Qdrant Vector Database configuration
    QDRANT_COLLECTION_NAME: str = Field(default="sbu_tech_knowledge_base")
    QDRANT_LOCAL_PATH: str = Field(default="./storage/qdrant")

    # Phase 4: AgentRouter API configuration
    AGENTIC_API_BASE_URL: str = Field(default="https://api.agentrouter.to/api/agentic-api")
    AGENTIC_API_KEY: str = Field(default="PASTE_YOUR_AGENTROUTER_API_KEY_HERE")
    AGENTROUTER_MODEL: str = Field(default="deepseek-flash")
    AGENTROUTER_PROVIDER: str = Field(default="deepseek")
    AGENTROUTER_ROUTE_KEY: str = Field(default="models.chat.complete.deepseek.mpp")
    AGENTROUTER_ALLOW_FALLBACK: bool = Field(default=False)
    AGENTROUTER_MAX_TOKENS: int = Field(default=1500)
    AGENTROUTER_TEMPERATURE: float = Field(default=0.2)
    AGENTROUTER_TIMEOUT_SECONDS: float = Field(default=60.0)

    # API Rate Limiting & Retry configuration
    MAX_CONCURRENCY: int = Field(default=3)
    REQUEST_DELAY_SECONDS: float = Field(default=0.5)
    MAX_RETRIES: int = Field(default=5)
    BACKOFF_FACTOR: float = Field(default=2.0)

    # Phase 3 & 4 (Prepared)
    TOP_K_RETRIEVAL: int = 5
    LOCAL_LLM_MODEL_NAME: str = "meta-llama/Llama-3-8B-Instruct"

    @property
    def resolved_qdrant_path(self) -> Path:
        """Resolves the Qdrant local storage path relative to AI_DIR."""
        raw_path = Path(self.QDRANT_LOCAL_PATH)
        if raw_path.is_absolute():
            return raw_path
        return (self.AI_DIR / raw_path).resolve()

    def is_gemini_api_key_valid(self) -> bool:
        """
        Validates whether the Gemini API key has been populated by the user.
        Returns False if the key is empty, None, or still the placeholder string.
        """
        key = (self.GEMINI_API_KEY or "").strip()
        if not key:
            return False
        if key == "PASTE_YOUR_GEMINI_API_KEY_HERE" or key.startswith("PASTE_YOUR_"):
            return False
        if len(key) < 10:
            return False
        return True

    def is_agentrouter_api_key_valid(self) -> bool:
        """
        Validates whether the AgentRouter API key has been populated by the user.
        Returns False if the key is empty, None, or still the placeholder string.
        """
        key = (self.AGENTIC_API_KEY or "").strip()
        if not key:
            return False
        if key == "PASTE_YOUR_AGENTROUTER_API_KEY_HERE" or key.startswith("PASTE_YOUR_"):
            return False
        if len(key) < 10:
            return False
        return True

    def ensure_directories(self) -> None:
        """Creates all necessary AI directory paths if they do not exist."""
        for path in [
            self.DATA_DIR,
            self.RAW_DIR,
            self.EXTRACTED_DIR,
            self.CLEANED_DIR,
            self.CHUNKS_DIR,
            self.EVALUATION_DIR,
            self.EMBEDDINGS_DIR,
            self.INDEXING_DIR,
            self.MODELS_DIR,
            self.STORAGE_DIR,
            self.resolved_qdrant_path,
            self.LOGS_DIR,
            self.PROMPTS_DIR,
        ]:
            path.mkdir(parents=True, exist_ok=True)


# Global settings singleton
settings = AISettings()
settings.ensure_directories()
