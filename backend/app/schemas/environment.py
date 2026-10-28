from typing import Optional
from pydantic import BaseModel, Field


class EnvironmentData(BaseModel):
    temperature_c: float = Field(..., description="Ambient dry bulb temperature in Celsius")
    relative_humidity_pct: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    heat_index_c: float = Field(..., description="Calculated Steadman Heat Index in Celsius")
    wbgt_c: float = Field(..., description="Estimated Wet Bulb Globe Temperature in Celsius")
    dew_point_c: float = Field(..., description="Dew point in Celsius")
    wind_speed_kmh: float = Field(..., ge=0, description="Wind speed in km/h")
    solar_radiation_wm2: float = Field(..., ge=0, description="Direct and diffuse solar radiation in W/m²")
    uv_index: float = Field(..., ge=0, description="Ultraviolet index")
    observed_at: str = Field(..., description="ISO observation timestamp")
    source: str = Field(..., description="Data provider or station name")
    location_name: str = Field(..., description="Location label")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    is_demo: bool = Field(True, description="Flag indicating demonstration or simulation data")
    freshness_status: str = Field(..., description="Human-readable freshness label")
    quality_score: int = Field(94, ge=0, le=100, description="Data completeness QA score")
    alert_band: str = Field("ORANGE", description="Meteorological alert tier: GREEN, YELLOW, ORANGE, RED")
