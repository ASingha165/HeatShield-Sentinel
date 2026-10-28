import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.endpoints import router as v1_router
from app.schemas.status import HealthResponse
from app.agents.orchestrator import orchestrator

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("heatshield-sentinel")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(
        f"AWS Bedrock Status: {'AVAILABLE' if orchestrator.is_bedrock_available else 'OFFLINE (Running deterministic safety engine)'}"
    )
    logger.info(f"Allowed CORS Origins: {settings.allowed_cors_origins}")
    yield
    logger.info("Shutting down HeatShield Sentinel backend.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered climate-resilience platform for outdoor workers using AWS Strands Agents SDK.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Non-sensitive service health",
)
async def health_check():
    """Returns basic service health without exposing credentials or account secrets."""
    return HealthResponse(
        status="healthy",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        demo_mode=settings.DEMO_MODE or not orchestrator.is_bedrock_available,
        aws_configured=orchestrator.is_bedrock_available,
    )


# Mount API Router
app.include_router(v1_router, prefix=settings.API_V1_PREFIX)
