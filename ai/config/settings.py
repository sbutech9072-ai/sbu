from pathlib import Path
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Determine base AI workspace and project root directories
AI_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = AI_DIR.parent

# Explicitly load centralized root .env (with fallback to ai/.env if present)
_root_env_file = ROOT_DIR / ".env"
_local_env_file = AI_DIR / ".env"
_active_env_file = _root_env_file if _root_env_file.is_file() else _local_env_file
if _active_env_file.is_file():
    load_dotenv(_active_env_file, override=True)


class AISettings(BaseSettings):
    """
    Centralized configuration for the SBU TECH AI subsystem.
    Loads configurations from the root `.env` with type validation and path resolution.
    """

    model_config = SettingsConfigDict(
        env_file=str(_active_env_file),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Base workspace directories & files
    AI_DIR: Path = AI_DIR
    ROOT_DIR: Path = ROOT_DIR
    DATA_DIR: Path = AI_DIR / "data"
    CHUNKS_JSONL_FILE: Path = DATA_DIR / "chunks.jsonl"
    PROMPTS_DIR: Path = AI_DIR / "prompts"
    SYSTEM_PROMPT_FILE: Path = PROMPTS_DIR / "system_prompt.txt"
    DOCUMENT_ID: str = "sbu_tech_kb_v1"

    # Supabase PostgreSQL pgvector connection
    DATABASE_URL: str = Field(default="")

    # Google Gemini Embedding API configuration
    GEMINI_API_KEY: str = Field(default="PASTE_YOUR_GEMINI_API_KEY_HERE")
    GEMINI_EMBEDDING_MODEL: str = Field(default="gemini-embedding-2")
    GEMINI_EMBEDDING_DIMENSION: int = Field(default=1536)

    # AgentRouter API configuration
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
    TOP_K_RETRIEVAL: int = 5

    def is_gemini_api_key_valid(self) -> bool:
        """Validates whether the Gemini API key has been populated by the user."""
        key = (self.GEMINI_API_KEY or "").strip()
        if not key or key == "PASTE_YOUR_GEMINI_API_KEY_HERE" or key.startswith("PASTE_YOUR_") or len(key) < 10:
            return False
        return True

    def is_agentrouter_api_key_valid(self) -> bool:
        """Validates whether the AgentRouter API key has been populated by the user."""
        key = (self.AGENTIC_API_KEY or "").strip()
        if not key or key == "PASTE_YOUR_AGENTROUTER_API_KEY_HERE" or key.startswith("PASTE_YOUR_") or len(key) < 10:
            return False
        return True


# Global settings singleton
settings = AISettings()
