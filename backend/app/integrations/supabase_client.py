import logging
from typing import Dict, Any
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)


async def verify_supabase_connection() -> Dict[str, Any]:
    """
    Checks the Supabase Auth API settings endpoint without modifying data.
    Directly mirrors the behavior of verifySupabaseConnection from the legacy Node.js backend.
    """
    supabase_url = settings.SUPABASE_URL.strip() if settings.SUPABASE_URL else ""
    supabase_key = settings.SUPABASE_KEY.strip() if settings.SUPABASE_KEY else ""

    if not supabase_url or not supabase_key:
        return {
            "connected": False,
            "message": "Supabase credentials are not configured",
        }

    target_url = f"{supabase_url.rstrip('/')}/auth/v1/settings"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(target_url, headers=headers)
            if response.status_code == 200:
                return {
                    "connected": True,
                    "message": "Supabase connected successfully",
                }
            return {
                "connected": False,
                "message": f"Supabase Auth API returned HTTP {response.status_code}",
            }
    except Exception as e:
        return {
            "connected": False,
            "message": str(e) if str(e) else "Unknown connection error",
        }

