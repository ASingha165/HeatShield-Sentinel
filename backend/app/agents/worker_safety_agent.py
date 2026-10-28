import json
import logging
from typing import Dict, Any, List, Optional
from strands import Agent, tool
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

@tool
def calculate_occupational_heat_strain(
    workload: str,
    wbgt_c: float,
    heat_index_c: float,
    shift_hours: float,
    shade_access: str,
    water_access_l_hr: float,
) -> str:
    """
    Computes ISO 7243 metabolic wattage, NIOSH work-rest cycles, and hydration targets
    for outdoor occupational heat strain.
    """
    metabolic_info = METABOLIC_BURDEN_TABLE.get(
        workload, 
        METABOLIC_BURDEN_TABLE["moderate"]
    )
    watts = metabolic_info["watts"]

    # Base scoring algorithm (0 to 100)
    env_score = min(40, int((heat_index_c / 55.0) * 40.0))
    meta_score = min(30, int((watts / 520.0) * 30.0))
    
    exposure_penalty = 10 if shift_hours >= 7 else (5 if shift_hours >= 4 else 0)
    shade_penalty = 10 if shade_access in ["none", "minimal"] else (4 if shade_access == "partial" else 0)
    water_penalty = 10 if water_access_l_hr < 0.75 else 0

    risk_score = min(100, max(10, env_score + meta_score + exposure_penalty + shade_penalty + water_penalty))

    # NIOSH / ISO 7243 Work-Rest Schedules
    if wbgt_c >= 32.0 or heat_index_c >= 52.0:
        if watts >= 400:
            work_rest = "20 min work / 40 min rest"
            max_work = 20
            min_rest = 40
        else:
            work_rest = "30 min work / 30 min rest"
            max_work = 30
            min_rest = 30
    elif wbgt_c >= 30.0 or heat_index_c >= 46.0:
        if watts >= 400:
            work_rest = "30 min work / 30 min rest"
            max_work = 30
            min_rest = 30
        else:
            work_rest = "45 min work / 15 min rest"
            max_work = 45
            min_rest = 15
    elif wbgt_c >= 28.0 or heat_index_c >= 40.0:
        work_rest = "45 min work / 15 min rest"
        max_work = 45
        min_rest = 15
    else:
        work_rest = "50 min work / 10 min rest"
        max_work = 50
        min_rest = 10

    hydration_target = 1000 if (watts >= 400 or heat_index_c >= 45.0) else (750 if heat_index_c >= 38.0 else 500)

    return json.dumps({
        "risk_score": risk_score,
        "metabolic_rate_watts": watts,
        "metabolic_category": metabolic_info["label"],
        "work_rest_ratio": work_rest,
        "max_continuous_work_minutes": max_work,
        "min_rest_minutes": min_rest,
        "hydration_target_ml_per_hour": hydration_target,
    })


class WorkerSafetyAgent:
    def __init__(self, model=None):
        self.model = model
        self.strands_agent: Optional[Agent] = None
        self._init_strands_agent()

    def _init_strands_agent(self):
        """Initializes the Strands SDK Agent with occupational heat strain tools."""
        try:
            agent_kwargs: Dict[str, Any] = {
                "tools": [calculate_occupational_heat_strain],
                "system_prompt": WORKER_SAFETY_AGENT_SYSTEM_PROMPT,
            }
            if self.model:
                agent_kwargs["model"] = self.model
            self.strands_agent = Agent(**agent_kwargs)
            logger.info("WorkerSafetyAgent initialized with Strands SDK Agent.")
        except Exception as e:
            logger.warning(f"Strands Agent initialization fallback in WorkerSafetyAgent: {e}")
            self.strands_agent = None

    def evaluate_worker_safety(self, req: WorkerAssessmentRequest, env_risk: Dict[str, Any]) -> Dict[str, Any]:
        """
        Synthesizes work-rest cycles, hydration quotas, and safety directives
        grounded in NIOSH and NDMA occupational guidelines.
        """
        wbgt = env_risk["wbgt_c"]
        hi = env_risk["heat_index_c"]

        # Execute through Strands Agent tool if available
        if self.strands_agent and hasattr(self.strands_agent.tool, "calculate_occupational_heat_strain"):
            try:
                tool_output = self.strands_agent.tool.calculate_occupational_heat_strain(
                    workload=req.workload,
                    wbgt_c=wbgt,
                    heat_index_c=hi,
                    shift_hours=req.shift_duration_hours,
                    shade_access=req.shade_access,
                    water_access_l_hr=req.water_access_liters_per_hr,
                )
                if isinstance(tool_output, dict) and "content" in tool_output and tool_output["content"]:
                    strain = json.loads(tool_output["content"][0]["text"])
                else:
                    strain = json.loads(calculate_occupational_heat_strain(
                        req.workload, wbgt, hi, req.shift_duration_hours, req.shade_access, req.water_access_liters_per_hr
                    ))
            except Exception as e:
                logger.warning(f"Strands tool execution error ({e}); using direct physical strain model.")
                strain = json.loads(calculate_occupational_heat_strain(
                    req.workload, wbgt, hi, req.shift_duration_hours, req.shade_access, req.water_access_liters_per_hr
                ))
        else:
            strain = json.loads(calculate_occupational_heat_strain(
                req.workload, wbgt, hi, req.shift_duration_hours, req.shade_access, req.water_access_liters_per_hr
            ))

        work_rest = strain["work_rest_ratio"]
        hydration_target = strain["hydration_target_ml_per_hour"]

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
            f"{strain['metabolic_category']} requires scheduled cooling recovery."
        )

        return {
            "risk_score": strain["risk_score"],
            "metabolic_rate_watts": strain["metabolic_rate_watts"],
            "metabolic_category": strain["metabolic_category"],
            "work_rest_ratio": work_rest,
            "max_continuous_work_minutes": strain["max_continuous_work_minutes"],
            "min_rest_minutes": strain["min_rest_minutes"],
            "hydration_target_ml_per_hour": hydration_target,
            "critical_safety_directive": critical_directive,
            "mandatory_protocols": mandatory_protocols,
            "suggested_precautions": suggested_precautions,
        }
