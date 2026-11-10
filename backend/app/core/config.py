import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BACKEND_DIR.parent
DEFAULT_DB_PATH = (BACKEND_DIR / "sbuweb.db").as_posix()

# Load centralized root .env (with fallback to backend/.env if present)
_root_env_file = ROOT_DIR / ".env"
_local_env_file = BACKEND_DIR / ".env"
_active_env_file = _root_env_file if _root_env_file.is_file() else _local_env_file
if _active_env_file.is_file():
    load_dotenv(_active_env_file, override=True)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_active_env_file),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Base Application Metadata
    PROJECT_NAME: str = "Sbu Tech Systems API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    PORT: int = 5000
    HOST: str = "0.0.0.0"
    DEBUG: bool = False

    # Security & Tokens
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sbu-tech-production-grade-jwt-secret-key-change-in-prod-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    # Defaults to SQLite if PostgreSQL is not specified, enabling zero-config local operations
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

    # Supabase Integration (Preserving existing configuration)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://rwvziiwpitsupexrijxv.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    # Google Integrations (OAuth / Sign-In / GCP)
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv(
        "GOOGLE_REDIRECT_URI",
        "https://www.sbutech.com/api/v1/auth/google/callback"
    )

    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "https://www.sbutech.com",
        "https://sbutech.com",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]

    # Email Service
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "engineering@sbutech.com")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "Sbu Tech Dispatch")

    # AI / RAG Architecture
    AI_ENABLED: bool = True


settings = Settings()

