import logging
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

import boto3
from strands import Agent
from strands.models.bedrock import BedrockModel

from app.core.config import settings
from app.schemas.assessment import (
    WorkerAssessmentRequest,
    WorkerAssessmentResponse,
    SafetyPlan,
    ShiftTimelineSlot,
    EmergencyProtocol,
)
from app.schemas.environment import EnvironmentData
from app.services.weather_service import weather_service
from app.services.resource_service import resource_service
from .environmental_agent import EnvironmentalRiskAgent
from .worker_safety_agent import WorkerSafetyAgent
from .resource_agent import CommunityResourceAgent
from .verification_agent import VerificationAgent

logger = logging.getLogger(__name__)


class StrandsOrchestrator:
    def __init__(self):
        self.bedrock_model: Optional[BedrockModel] = None
        self.is_bedrock_available: bool = False
        self._init_bedrock()

        # Initialize Sub-Agents
        self.env_agent = EnvironmentalRiskAgent(model=self.bedrock_model)
        self.worker_agent = WorkerSafetyAgent(model=self.bedrock_model)
        self.resource_agent = CommunityResourceAgent(model=self.bedrock_model)
        self.verification_agent = VerificationAgent(model=self.bedrock_model)

        # Bounded Strands Chat Assistant
        self.chat_agent: Optional[Agent] = None
        if self.bedrock_model:
            try:
                self.chat_agent = Agent(
                    model=self.bedrock_model,
                    system_prompt=(
                        "You are the HeatShield Sentinel Assistant, an AI expert in occupational climate resilience. "
                        "Your mission is to guide outdoor workers and safety supervisors on heat mitigation. "
                        "STRICT RULES: "
                        "1. Never give medical diagnoses. "
                        "2. Always recommend calling 108 immediately for suspected heatstroke (confusion, collapse, cessation of sweat). "
                        "3. Rely only on validated public health frameworks (NDMA / NIOSH / WHO)."
                    ),
                )
            except Exception as e:
                logger.warning(f"Could not initialize Strands chat agent: {e}")

    def _init_bedrock(self):
        """Attempts to initialize Amazon Bedrock model provider via Strands SDK."""
        try:
            # Check if AWS credentials exist
            session = boto3.Session(region_name=settings.AWS_REGION)
            creds = session.get_credentials()
            if creds and creds.access_key:
                self.bedrock_model = BedrockModel(
                    model_id=settings.BEDROCK_MODEL_ID,
                    region_name=settings.AWS_REGION,
                )
                self.is_bedrock_available = True
                logger.info(f"Initialized BedrockModel with {settings.BEDROCK_MODEL_ID} in {settings.AWS_REGION}")
            else:
                logger.info("No active AWS credentials found. Strands will operate with deterministic public health rule engine.")
        except Exception as e:
            logger.info(f"Amazon Bedrock not connected ({e}); using resilient deterministic fallback mode.")
            self.is_bedrock_available = False

    async def execute_assessment_workflow(self, req: WorkerAssessmentRequest) -> WorkerAssessmentResponse:
        """
        Executes the 8-step multi-agent assessment workflow.
        """
        assessment_id = f"HSR-2026-WB-{uuid.uuid4().hex[:6].upper()}"
        created_at = datetime.now().isoformat()

        # Step 1 & 2: Fetch environmental telemetry
        lat = req.latitude or settings.DEFAULT_LATITUDE
        lon = req.longitude or settings.DEFAULT_LONGITUDE

        if req.ambient_temp_c is not None and req.relative_humidity_pct is not None:
            hi = weather_service.calculate_heat_index(req.ambient_temp_c, req.relative_humidity_pct)
            wbgt = weather_service.calculate_estimated_wbgt(req.ambient_temp_c, req.relative_humidity_pct)
            dp = weather_service.calculate_dew_point(req.ambient_temp_c, req.relative_humidity_pct)
            alert_band = "ORANGE" if hi >= 50.0 or wbgt >= 31.0 else "YELLOW" if hi >= 40.0 else "GREEN"
            env_data = EnvironmentData(
                temperature_c=req.ambient_temp_c,
                relative_humidity_pct=req.relative_humidity_pct,
                heat_index_c=hi,
                wbgt_c=wbgt,
                dew_point_c=dp,
                wind_speed_kmh=14.0,
                solar_radiation_wm2=850.0,
                uv_index=10.0,
                observed_at=created_at,
                source="Controlled Site Observation",
                location_name="Kolkata Urban Sector",
                latitude=lat,
                longitude=lon,
                is_demo=True,
                freshness_status="Controlled Site Telemetry",
                quality_score=100,
                alert_band=alert_band,
            )
        else:
            env_data = await weather_service.get_observations(lat, lon)

        # Step 3: Run Environmental Risk Agent
        env_risk = self.env_agent.evaluate_risk(env_data)

        # Step 4: Run Worker Context & Safety Planning Agent
        worker_safety = self.worker_agent.evaluate_worker_safety(req, env_risk)

        # Step 5: Verification & Safety Guard Agent Audit
        audit = self.verification_agent.audit_assessment(
            req.reported_symptoms,
            env_risk,
            worker_safety,
        )

        return WorkerAssessmentResponse(
            assessment_id=assessment_id,
            risk_tier=audit["risk_tier"],
            risk_score=audit["risk_score"],
            thermal_class=env_risk["thermal_class"],
            metabolic_rate_watts=worker_safety["metabolic_rate_watts"],
            metabolic_category=worker_safety["metabolic_category"],
            environmental_summary={
                "ambient_temp_c": env_risk["ambient_temp_c"],
                "heat_index_c": env_risk["heat_index_c"],
                "wbgt_c": env_risk["wbgt_c"],
                "humidity_pct": env_risk["humidity_pct"],
            },
            work_rest_ratio=audit["work_rest_ratio"],
            max_continuous_work_minutes=audit["max_continuous_work_minutes"],
            min_rest_minutes=audit["min_rest_minutes"],
            hydration_target_ml_per_hour=worker_safety["hydration_target_ml_per_hour"],
            critical_safety_directive=audit["critical_safety_directive"],
            mandatory_protocols=worker_safety["mandatory_protocols"],
            suggested_precautions=worker_safety["suggested_precautions"],
            requires_emergency_escalation=audit["requires_emergency_escalation"],
            emergency_action_steps=audit["emergency_action_steps"],
            limitations=audit["limitations"],
            sources_cited=audit["sources_cited"],
            created_at=created_at,
            is_demo=not self.is_bedrock_available,
        )

    async def generate_safety_plan(
        self,
        assessment_id: str,
        crew_size: int = 10,
        language: str = "en",
    ) -> SafetyPlan:
        """
        Synthesizes a chronological work-rest shift timeline and cooling shelter routing.
        """
        plan_id = f"PLAN-KOL-{uuid.uuid4().hex[:6].upper()}"
        now_iso = datetime.now().isoformat()

        # Step 1: Query nearby verified shelters via Community Resource Agent
        shelters = self.resource_agent.find_shelters(
            lat=settings.DEFAULT_LATITUDE,
            lon=settings.DEFAULT_LONGITUDE,
            radius_km=2.0,
        )

        # Step 2: Build shift timeline slots
        shift_timeline = [
            ShiftTimelineSlot(
                time_range="07:00 – 10:30 IST",
                status="SAFE",
                work_minutes=50,
                rest_minutes=10,
                guideline="Morning cooler window. Schedule heaviest physical labor (masonry/rebar/excavation) during this period.",
            ),
            ShiftTimelineSlot(
                time_range="10:30 – 12:00 IST",
                status="ADVISORY",
                work_minutes=40,
                rest_minutes=20,
                guideline="Thermal radiation escalating rapidly. Mandatory fluid break every 20 min. Rotate crew to covered zones.",
            ),
            ShiftTimelineSlot(
                time_range="12:00 – 15:30 IST",
                status="CRITICAL_PAUSE",
                work_minutes=25,
                rest_minutes=35,
                guideline="PEAK SOLAR AND WET-BULB HAZARD WINDOW (WBGT > 31.5°C). Suspend direct sun activity. Relocate crew to nearest civic refuge.",
            ),
            ShiftTimelineSlot(
                time_range="15:30 – 18:00 IST",
                status="ADVISORY",
                work_minutes=40,
                rest_minutes=20,
                guideline="Evening transition period. Solar radiation declining but ambient vapor pressure remains high. Electrolyte replenishment.",
            ),
        ]

        # Step 3: Hydration Schedule
        hydration_schedule = [
            "07:00 IST: 500 mL water intake prior to shift start.",
            "Every 20 min during work: 250 mL cool potable water (1 full cup).",
            "12:00 IST: 300 mL Oral Rehydration Solution (ORS) during midday break.",
            "Post-shift: Minimum 750 mL fluid recovery to compensate for metabolic sweat loss.",
        ]

        # Formatted SMS Text
        nearest_shelter_name = shelters[0].name if shelters else "Improvised Shaded Canopy"
        formatted_sms = (
            f"HEATSHIELD ALERT [Kolkata Ward 48]: Dangerous Heat Conditions (WBGT 31.8C). "
            f"Crew of {crew_size}: 30m work / 30m rest. Min 1L water/hr with ORS. "
            f"Nearest verified refuge: {nearest_shelter_name}. "
            f"Emergency heatstroke protocol: Call 108 immediately."
        )

        return SafetyPlan(
            plan_id=plan_id,
            assessment_id=assessment_id,
            worker_title=f"Outdoor Workforce Crew ({crew_size} workers)",
            workload_summary="Heavy Workload · Central Kolkata Sector",
            shift_timeline=shift_timeline,
            work_rest_ratio="30 min work / 30 min rest (Peak: 25/35)",
            hydration_schedule=hydration_schedule,
            nearby_cooling_shelters=shelters[:3],
            emergency_protocol=EmergencyProtocol(
                phone="108",
                action_directives=[
                    "Stop work immediately if confusion, collapse, or vomiting occurs.",
                    "Move worker into nearest shaded or air-conditioned facility.",
                    "Douse torso and head with water and fan vigorously.",
                    "Call 108 Ambulance immediately.",
                ],
            ),
            formatted_sms_text=formatted_sms,
            generated_at=now_iso,
            is_demo=not self.is_bedrock_available,
        )

    async def answer_chat(self, message: str, context: Optional[dict] = None) -> Dict[str, Any]:
        """Provides bounded advice with strict non-diagnostic and safety constraints."""
        emergency_indicators = ["collapse", "passed out", "unconscious", "confused", "no sweat", "vomit"]
        if any(ind in message.lower() for ind in emergency_indicators):
            return {
                "reply": (
                    "CRITICAL EMERGENCY DIRECTIVE: The symptoms you described indicate life-threatening heatstroke! "
                    "Immediately call 108 (Ambulance), move the person to the shade, douse them with cool water, and fan them. "
                    "Do NOT give oral fluids if they are confused or unconscious."
                ),
                "safety_notice": "Immediate medical attention required via 108 Emergency Ambulance.",
                "sources": ["National Disaster Management Authority (NDMA) Heatwave Directives"],
                "is_demo": True,
            }

        # If Bedrock Strands agent is available
        if self.chat_agent and self.is_bedrock_available:
            try:
                response = self.chat_agent(message)
                return {
                    "reply": str(response),
                    "safety_notice": "Non-diagnostic guidance based on occupational heat safety standards.",
                    "sources": ["NIOSH Criteria for a Recommended Standard: Occupational Exposure to Heat"],
                    "is_demo": False,
                }
            except Exception as e:
                logger.warning(f"Strands Bedrock chat invocation failed: {e}")

        # Deterministic conversational response
        return {
            "reply": (
                "For outdoor laborers in high wet-bulb conditions (e.g. Kolkata summer), maintain a strict "
                "work-rest cycle: 30 minutes of labor followed by 30 minutes in shade. Drink 250 mL of cool water "
                "every 15-20 minutes, and rotate crews away from direct sunlight between 12:00 and 15:30 IST."
            ),
            "safety_notice": "Non-diagnostic guidance based on NIOSH and NDMA occupational heat safety standards.",
            "sources": [
                "NIOSH Criteria for a Recommended Standard: Occupational Exposure to Heat (2016)",
                "NDMA National Heat Wave Guidelines",
            ],
            "is_demo": True,
        }


orchestrator = StrandsOrchestrator()
