from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "heatshield-sentinel"
    version: str = "1.0.0"
    demo_mode: bool = True
    aws_configured: bool = False


class ComponentStatusResponse(BaseModel):
    service: str = "heatshield-sentinel"
    version: str = "1.0.0"
    status: str = "healthy"
    demo_mode: bool = True
    aws_configured: bool = False
    bedrock_model: str = "offline (deterministic rules)"
    weather_provider: str = "open-meteo / simulated-alipore-imd"
    resource_count: int = 6


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    reply: str
    safety_notice: str
    sources: list[str]
    is_demo: bool = True
