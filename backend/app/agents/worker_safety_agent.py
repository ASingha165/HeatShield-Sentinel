import logging
from typing import Dict, Any, List
from app.schemas.assessment import WorkerAssessmentRequest

logger = logging.getLogger(__name__)

WORKER_SAFETY_AGENT_SYSTEM_PROMPT = """
You are the Worker Context and Safety Planning Agent of HeatShield Sentinel.
Your responsibility:
1. Interpret the user's occupational context (sector, physical workload, exposure hours, water availability, shade).
2. Calculate metabolic rate (Watts) based on ISO 7243 and assign work-rest schedules using NIOSH/NDMA guidelines.
3. Formulate practical, deterministic hydration and recovery instructions.
4. STRICT INVARIANT: Never prescribe medical drugs. Never guarantee safety from heat injury.
"""

METABOLIC_BURDEN_TABLE = {
    "light": {"watts": 150, "label": "Light Work (~150 W: Inspection, Sitting, Vehicle Operation)"},
    "moderate": {"watts": 280, "label": "Moderate Work (~280 W: Street Vending, Continuous Walking, Delivery Courier)"},
    "heavy": {"watts": 415, "label": "Heavy Work (~415 W: Construction Masonry, Steel Rebar, Hand Shoveling)"},
    "very_heavy": {"watts": 520, "label": "Very Heavy Work (~520 W: Rapid Trench Digging, High-Effort Manual Labor)"},
}

class WorkerSafetyAgent:
    def __init__(self, model=None):
        self.model = model

    def evaluate_worker_safety(self, req: WorkerAssessmentRequest, env_risk: Dict[str, Any]) -> Dict[str, Any]:
        """
        Synthesizes work-rest cycles, hydration quotas, and safety directives
        grounded in NIOSH and NDMA occupational guidelines.
        """
        metabolic_info = METABOLIC_BURDEN_TABLE.get(
            req.workload, 
            METABOLIC_BURDEN_TABLE["moderate"]
        )
        watts = metabolic_info["watts"]
        wbgt = env_risk["wbgt_c"]
        hi = env_risk["heat_index_c"]

        # Base scoring algorithm (0 to 100)
        # Environmental factor (40 pts) + Metabolic factor (30 pts) + Shift/Shade (30 pts)
        env_score = min(40, int((hi / 55.0) * 40.0))
        meta_score = min(30, int((watts / 520.0) * 30.0))
        
        exposure_penalty = 10 if req.shift_duration_hours >= 7 else (5 if req.shift_duration_hours >= 4 else 0)
        shade_penalty = 10 if req.shade_access in ["none", "minimal"] else (4 if req.shade_access == "partial" else 0)
        water_penalty = 10 if req.water_access_liters_per_hr < 0.75 else 0

        risk_score = min(100, max(10, env_score + meta_score + exposure_penalty + shade_penalty + water_penalty))

        # Determine NIOSH / ISO 7243 Work-Rest Schedules
        if wbgt >= 32.0 or hi >= 52.0:
            if watts >= 400:
                work_rest = "20 min work / 40 min rest"
                max_work = 20
                min_rest = 40
            else:
                work_rest = "30 min work / 30 min rest"
                max_work = 30
                min_rest = 30
        elif wbgt >= 30.0 or hi >= 46.0:
            if watts >= 400:
                work_rest = "30 min work / 30 min rest"
                max_work = 30
                min_rest = 30
            else:
                work_rest = "45 min work / 15 min rest"
                max_work = 45
                min_rest = 15
        elif wbgt >= 28.0 or hi >= 40.0:
            work_rest = "45 min work / 15 min rest"
            max_work = 45
            min_rest = 15
        else:
            work_rest = "50 min work / 10 min rest"
            max_work = 50
            min_rest = 10

        # Hydration Target
        hydration_target = 1000 if (watts >= 400 or hi >= 45.0) else (750 if hi >= 38.0 else 500)

        # Mandatory Protocols
        mandatory_protocols: List[str] = [
            f"Enforce mandatory {work_rest} rotation under shaded refuge.",
            f"Hydration target: consume at least {int(hydration_target / 4)} mL of cool water every 15-20 minutes.",
            "Institute buddy-system check-ins every 30 minutes to identify subtle disorientation or ataxia.",
        ]

        if req.peak_hours_exposure and hi >= 45.0:
            mandatory_protocols.append("Suspend direct sunlight exposure between 12:00 and 15:30 IST; relocate crew to covered or ventilated zones.")

        if req.water_access_liters_per_hr < 0.75:
            mandatory_protocols.append("CRITICAL: On-site drinking water supply is inadequate. Dispatch immediate municipal water refills before resuming exertion.")

        suggested_precautions: List[str] = [
            "Use wet cotton neck covers and wide-brim attachments on safety helmets.",
            "Avoid dark, heavy unventilated clothing. Loosen tight restrictive PPE during rest breaks.",
            "Add electrolyte solution (ORS) if sweating continuously for more than 2 hours."
        ]

        critical_directive = (
            f"MANDATORY REST ENFORCEMENT: Extreme ambient heat ({hi}°C HI / {wbgt}°C WBGT) combined with "
            f"{metabolic_info['label']} requires scheduled cooling recovery."
        )

        return {
            "risk_score": risk_score,
            "metabolic_rate_watts": watts,
            "metabolic_category": metabolic_info["label"],
            "work_rest_ratio": work_rest,
            "max_continuous_work_minutes": max_work,
            "min_rest_minutes": min_rest,
            "hydration_target_ml_per_hour": hydration_target,
            "critical_safety_directive": critical_directive,
            "mandatory_protocols": mandatory_protocols,
            "suggested_precautions": suggested_precautions,
        }
