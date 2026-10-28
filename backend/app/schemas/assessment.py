from typing import List, Optional, Literal, Dict
from pydantic import BaseModel, Field
from .resource import CoolingResource

WorkSector = Literal[
    "construction", 
    "street_vendor", 
    "delivery_courier", 
    "daily_labor", 
    "health_worker", 
    "sanitation"
]

WorkloadIntensity = Literal["light", "moderate", "heavy", "very_heavy"]
ShadeAccess = Literal["full", "partial", "minimal", "none"]
RiskTier = Literal["NORMAL", "CAUTION", "EXTREME_CAUTION", "DANGER", "EXTREME_DANGER"]


class WorkerAssessmentRequest(BaseModel):
    sector: WorkSector = Field(..., description="Target occupational sector")
    workload: WorkloadIntensity = Field(..., description="Physical effort and metabolic level")
    shift_duration_hours: float = Field(..., ge=0.5, le=18, description="Continuous shift length in hours")
    peak_hours_exposure: bool = Field(True, description="Whether working through 11:30 - 15:30 IST window")
    water_access_liters_per_hr: float = Field(..., ge=0, le=5, description="Available drinking water supply per worker")
    shade_access: ShadeAccess = Field(..., description="Shade accessibility on site")
    protective_gear: List[str] = Field(default_factory=list, description="List of PPE worn (helmet, boots, vest, etc.)")
    reported_symptoms: List[str] = Field(default_factory=list, description="Self-reported or observed symptoms")
    notes: Optional[str] = Field(None, description="Optional field site notes")
    latitude: Optional[float] = Field(None, description="Worker location latitude")
    longitude: Optional[float] = Field(None, description="Worker location longitude")
    ambient_temp_c: Optional[float] = Field(None, description="Optional controlled ambient temperature in Celsius")
    relative_humidity_pct: Optional[float] = Field(None, description="Optional controlled relative humidity percentage")


class WorkerAssessmentResponse(BaseModel):
    assessment_id: str
    risk_tier: RiskTier
    risk_score: int = Field(..., ge=0, le=100)
    thermal_class: str
    metabolic_rate_watts: int
    metabolic_category: str
    environmental_summary: Dict[str, float]
    work_rest_ratio: str
    max_continuous_work_minutes: int
    min_rest_minutes: int
    hydration_target_ml_per_hour: int
    critical_safety_directive: str
    mandatory_protocols: List[str]
    suggested_precautions: List[str]
    requires_emergency_escalation: bool
    emergency_action_steps: Optional[List[str]] = None
    limitations: List[str]
    sources_cited: List[str]
    created_at: str
    is_demo: bool = True


class ShiftTimelineSlot(BaseModel):
    time_range: str
    status: Literal["SAFE", "ADVISORY", "CRITICAL_PAUSE"]
    work_minutes: int
    rest_minutes: int
    guideline: str


class SafetyPlanRequest(BaseModel):
    assessment_id: str
    crew_size: int = Field(1, ge=1, le=500)
    language: str = Field("en", description="'en', 'bn', or 'hi'")


class EmergencyProtocol(BaseModel):
    phone: str = "108"
    action_directives: List[str]


class SafetyPlanResponse(BaseModel):
    plan_id: str
    assessment_id: str
    worker_title: str
    workload_summary: str
    shift_timeline: List[ShiftTimelineSlot]
    work_rest_ratio: str
    hydration_schedule: List[str]
    nearby_cooling_shelters: List[CoolingResource]
    emergency_protocol: EmergencyProtocol
    formatted_sms_text: str
    generated_at: str
    is_demo: bool = True


SafetyPlan = SafetyPlanResponse
