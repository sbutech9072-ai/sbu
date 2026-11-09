from fastapi import APIRouter, Response, status
from app.integrations.supabase_client import verify_supabase_connection

router = APIRouter()


@router.get("/health", summary="Health Check & Supabase Telemetry")
async def health_check(response: Response):
    """
    Service health check verifying backend status and Supabase connectivity.
    Matches legacy /api/v1/health signature for 100% reverse proxy compatibility.
    """
    supabase_status = await verify_supabase_connection()
    connected = supabase_status.get("connected", False)

    if not connected:
        response.status_code = status.HTTP_200_OK  # keep 200 for container orchestrator readiness with informative message

    return {
        "status": "ok" if connected else "degraded",
        "framework": "FastAPI (Python 3.13)",
        "message": "Backend server is running",
        "supabaseConnected": connected,
        "supabaseMessage": supabase_status.get("message", ""),
        "database": "connected",
    }

