import json
import logging
from typing import Dict, Any, Optional
from strands import Agent, tool
from app.schemas.environment import EnvironmentData

logger = logging.getLogger(__name__)

ENVIRONMENT_AGENT_SYSTEM_PROMPT = """
You are the Environmental Risk Agent of HeatShield Sentinel.
Your responsibility:
1. Interpret environmental observations (dry bulb temperature, relative humidity, estimated WBGT, solar radiation, wind speed).
2. Categorize thermal hazard level: NORMAL (<27C HI), CAUTION (27-32C HI), EXTREME_CAUTION (32-41C HI), DANGER (41-51C HI), EXTREME_DANGER (>=51C HI or WBGT >=31.5C).
3. Validate data integrity: flag missing or physically implausible readings.
4. STRICT INVARIANT: You must distinguish environmental heat hazard from individual physiological strain. Weather data alone does NOT measure internal core body temperature or individual dehydration.
"""

@tool
def calculate_thermal_hazard(temp_c: float, heat_index_c: float, wbgt_c: float, humidity_pct: float) -> str:
    """
    Evaluates environmental thermal hazard tier and bioclimatic classification
    based on NOAA and ISO 7243 thresholds.
    """
    if heat_index_c >= 51.0 or wbgt_c >= 31.5:
        tier = "EXTREME_DANGER"
        thermal_class = "Level 4: Extreme Bioclimatic Hazard"
        hazard_summary = "Lethal wet-bulb conditions. Human evaporative cooling capacity severely impaired."
    elif heat_index_c >= 41.0 or wbgt_c >= 29.0:
        tier = "DANGER"
        thermal_class = "Level 3: Severe Bioclimatic Hazard"
        hazard_summary = "Heat cramps and exhaustion likely; heatstroke possible with prolonged exertion."
    elif heat_index_c >= 32.0 or wbgt_c >= 26.5:
        tier = "EXTREME_CAUTION"
        thermal_class = "Level 2: Elevated Thermal Burden"
        hazard_summary = "Heat exhaustion possible with prolonged exposure and physical activity."
    elif heat_index_c >= 27.0:
        tier = "CAUTION"
        thermal_class = "Level 1: Moderate Thermal Burden"
        hazard_summary = "Fatigue possible with prolonged exposure."
    else:
        tier = "NORMAL"
        thermal_class = "Level 0: Baseline"
        hazard_summary = "Thermal hazard within standard occupational comfort boundaries."

    return json.dumps({
        "risk_tier": tier,
        "thermal_class": thermal_class,
        "hazard_summary": hazard_summary,
    })


class EnvironmentalRiskAgent:
    def __init__(self, model=None):
        self.model = model
        self.strands_agent: Optional[Agent] = None
        self._init_strands_agent()

    def _init_strands_agent(self):
        """Initializes the Strands SDK Agent with registered thermal hazard tools."""
        try:
            agent_kwargs: Dict[str, Any] = {
                "tools": [calculate_thermal_hazard],
                "system_prompt": ENVIRONMENT_AGENT_SYSTEM_PROMPT,
            }
            if self.model:
                agent_kwargs["model"] = self.model
            self.strands_agent = Agent(**agent_kwargs)
            logger.info("EnvironmentalRiskAgent initialized with Strands SDK Agent.")
        except Exception as e:
            logger.warning(f"Strands Agent initialization fallback in EnvironmentalRiskAgent: {e}")
            self.strands_agent = None

    def evaluate_risk(self, env: EnvironmentData) -> Dict[str, Any]:
        """
        Calculates and structures the environmental thermal hazard profile.
        Uses Strands tool execution with validated meteorological thresholds.
        """
        temp = env.temperature_c
        hi = env.heat_index_c
        wbgt = env.wbgt_c
        rh = env.relative_humidity_pct

        # Execute through Strands Agent tool if available
        if self.strands_agent and hasattr(self.strands_agent.tool, "calculate_thermal_hazard"):
            try:
                tool_output = self.strands_agent.tool.calculate_thermal_hazard(
                    temp_c=temp,
                    heat_index_c=hi,
                    wbgt_c=wbgt,
                    humidity_pct=rh,
                )
                if isinstance(tool_output, dict) and "content" in tool_output and tool_output["content"]:
                    parsed = json.loads(tool_output["content"][0]["text"])
                    tier = parsed["risk_tier"]
                    thermal_class = parsed["thermal_class"]
                    hazard_summary = parsed["hazard_summary"]
                else:
                    parsed = json.loads(calculate_thermal_hazard(temp, hi, wbgt, rh))
                    tier = parsed["risk_tier"]
                    thermal_class = parsed["thermal_class"]
                    hazard_summary = parsed["hazard_summary"]
            except Exception as e:
                logger.warning(f"Strands tool execution error ({e}); using direct physical model.")
                parsed = json.loads(calculate_thermal_hazard(temp, hi, wbgt, rh))
                tier = parsed["risk_tier"]
                thermal_class = parsed["thermal_class"]
                hazard_summary = parsed["hazard_summary"]
        else:
            parsed = json.loads(calculate_thermal_hazard(temp, hi, wbgt, rh))
            tier = parsed["risk_tier"]
            thermal_class = parsed["thermal_class"]
            hazard_summary = parsed["hazard_summary"]

        return {
            "risk_tier": tier,
            "thermal_class": thermal_class,
            "ambient_temp_c": temp,
            "heat_index_c": hi,
            "wbgt_c": wbgt,
            "humidity_pct": rh,
            "hazard_summary": hazard_summary,
            "data_freshness": env.freshness_status,
            "qa_score": env.quality_score,
            "limitation": "Environmental index only: does not measure internal core temperature.",
        }
