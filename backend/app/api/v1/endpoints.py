from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException, status
import logging

from app.schemas.environment import EnvironmentData
from app.schemas.assessment import (
    WorkerAssessmentRequest,
    WorkerAssessmentResponse,
    SafetyPlanRequest,
    SafetyPlanResponse,
)
from app.schemas.resource import CoolingResource
from app.schemas.status import (
    ComponentStatusResponse,
    ChatRequest,
    ChatResponse,
)
from app.services.weather_service import weather_service
from app.services.resource_service import resource_service
from app.agents.orchestrator import orchestrator
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/status",
    response_model=ComponentStatusResponse,
    summary="Component readiness status",
)
async def get_system_status():
    """Returns component readiness, Bedrock configuration, and provider status."""
    return ComponentStatusResponse(
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        status="healthy",
        demo_mode=settings.DEMO_MODE or not orchestrator.is_bedrock_available,
        aws_configured=orchestrator.is_bedrock_available,
        bedrock_model=settings.BEDROCK_MODEL_ID if orchestrator.is_bedrock_available else "offline (deterministic public health rules)",
        weather_provider="Open-Meteo API + Simulated Alipore IMD Mesonet",
        resource_count=len(resource_service.get_nearby_resources(radius_km=10.0)),
    )


@router.get(
    "/environment",
    response_model=EnvironmentData,
    summary="Environmental observations and thermal indices",
)
async def get_environment_observations(
    lat: float = Query(22.5726, ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(88.3639, ge=-180.0, le=180.0, description="Longitude"),
):
    """
    Returns real-time or calibrated meteorological observations,
    including Heat Index, estimated WBGT, and data freshness status.
    """
    try:
        data = await weather_service.get_observations(lat, lon)
        return data
    except Exception as e:
        logger.error(f"Failed to fetch environmental telemetry: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Environmental observation service temporarily unavailable.",
        )


@router.post(
    "/assessments",
    response_model=WorkerAssessmentResponse,
    summary="Perform occupational heat risk assessment",
)
async def create_worker_assessment(payload: WorkerAssessmentRequest):
    """
    Accepts worker-context and environmental information and returns an
    evidence-based risk assessment with explicit limitations and safety directives.
    """
    try:
        response = await orchestrator.execute_assessment_workflow(payload)
        return response
    except Exception as e:
        logger.error(f"Assessment workflow error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing occupational heat assessment.",
        )


@router.post(
    "/safety-plans",
    response_model=SafetyPlanResponse,
    summary="Generate contextual safe work plan",
)
async def generate_safety_plan(payload: SafetyPlanRequest):
    """Generates a contextual work-rest timeline, hydration quotas, and cooling routing."""
    try:
        plan = await orchestrator.generate_safety_plan(
            assessment_id=payload.assessment_id,
            crew_size=payload.crew_size,
            language=payload.language,
        )
        return plan
    except Exception as e:
        logger.error(f"Safety plan generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating safe work operational plan.",
        )


@router.get(
    "/resources",
    response_model=List[CoolingResource],
    summary="Query verified community cooling resources",
)
async def get_cooling_resources(
    lat: float = Query(22.5726, ge=-90.0, le=90.0),
    lon: float = Query(88.3639, ge=-180.0, le=180.0),
    radius_km: float = Query(2.5, ge=0.1, le=20.0),
    category: Optional[str] = Query(None, description="water_kiosk, cooling_center, shaded_canopy, community_hub"),
):
    """Returns audited cooling facilities with location coordinates and verification badges."""
    resources = resource_service.get_nearby_resources(
        lat=lat,
        lon=lon,
        radius_km=radius_km,
        category=category,
    )
    return resources


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Bounded heat safety conversational advisor",
)
async def heat_safety_chat(payload: ChatRequest):
    """Provides bounded conversational guidance using public health heat guidelines."""
    result = await orchestrator.answer_chat(payload.message, payload.context)
    return ChatResponse(
        reply=result["reply"],
        safety_notice=result["safety_notice"],
        sources=result["sources"],
        is_demo=result["is_demo"],
    )
