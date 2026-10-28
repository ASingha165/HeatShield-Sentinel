from typing import Optional, Literal
from pydantic import BaseModel, Field

VerificationStatus = Literal["VERIFIED_MUNICIPAL", "FIELD_AUDITED", "DEMO_RECORD"]
ResourceCategory = Literal["water_kiosk", "cooling_center", "shaded_canopy", "community_hub"]


class CoolingResource(BaseModel):
    id: str = Field(..., description="Unique resource ID")
    name: str = Field(..., description="Resource facility name")
    category: ResourceCategory = Field(..., description="Type of cooling amenity")
    address: str = Field(..., description="Physical street address")
    ward: str = Field(..., description="Municipal ward identifier")
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")
    distance_km: Optional[float] = Field(None, description="Walking distance from search origin in km")
    verification_status: VerificationStatus = Field(..., description="Verification classification")
    last_verified: str = Field(..., description="Timestamp or date when last audited")
    operating_hours: str = Field(..., description="Active operational hours")
    has_chilled_water: bool = Field(..., description="Presence of cold drinking water")
    is_air_conditioned: bool = Field(..., description="Presence of active air conditioning")
    capacity: str = Field(..., description="Seating or hydration flow capacity")
    contact_phone: Optional[str] = Field(None, description="Contact phone or helpline number")
