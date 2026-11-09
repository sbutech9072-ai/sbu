import os
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    port = int(os.getenv("PORT", settings.PORT))
    host = os.getenv("HOST", settings.HOST)
    reload = os.getenv("ENV", "development").lower() == "development"

    print(f"🚀 Sbu Tech FastAPI Backend starting on http://{host}:{port}")
    print(f"📖 OpenAPI Swagger Documentation at http://localhost:{port}/api/docs")
    print(f"🏥 Health Telemetry at http://localhost:{port}{settings.API_V1_STR}/health")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
    )

