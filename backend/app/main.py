import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.database.init_db import init_db
from app.middleware.cors import setup_cors
from app.api.v1.api import api_router
from app.api.v1.endpoints import ai as ai_endpoint

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("sbuweb.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing Sbu Tech FastAPI Engine...")
    init_db()
    logger.info("Database schemas verified and seeded.")
    yield
    # Shutdown sequence
    logger.info("Sbu Tech FastAPI Engine shutdown.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-throughput systems architecture API for Sbu Tech web platforms, cloud infrastructure, and private AI systems.",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# Configure CORS
setup_cors(app)

# Standardized Error Handling (maintaining compatibility with frontend error parsers)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    field_errors = {}
    for err in exc.errors():
        loc = err.get("loc", [])
        field_name = loc[-1] if loc else "general"
        msg = err.get("msg", "Validation error")
        # Format neatly
        if str(field_name) not in field_errors:
            field_errors[str(field_name)] = []
        field_errors[str(field_name)].append(msg)

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "code": "VALIDATION_ERROR",
            "errors": field_errors,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": "HTTP_ERROR",
            "message": exc.detail if isinstance(exc.detail, str) else "Request error",
            "errors": exc.detail if isinstance(exc.detail, dict) else None,
        },
    )


# Mount API V1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount AI routes directly at /api/ai for standardized root API access
app.include_router(ai_endpoint.router, prefix="/api")


@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/api/docs",
        "health": f"{settings.API_V1_STR}/health",
    }

