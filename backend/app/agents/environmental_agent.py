import logging
from typing import Dict, Any
from app.schemas.environment import EnvironmentData

logger = logging.getLogger(__name__)

ENVIRONMENTAL_AGENT_SYSTEM_PROMPT = """
You are the Environmental Risk Agent of HeatShield Sentinel.
Your responsibility:
1. Interpret environmental observations (dry bulb temperature, relative humidity, estimated WBGT, solar radiation, wind speed).
2. Categorize thermal hazard level: NORMAL (<27C HI), CAUTION (27-32C HI), EXTREME_CAUTION (32-41C HI), DANGER (41-51C HI), EXTREME_DANGER (>=51C HI or WBGT >=31C).
3. Validate data integrity: flag missing or physically implausible readings.
4. STRICT INVARIANT: You must distinguish environmental heat hazard from individual physiological strain. Weather data alone does NOT measure internal core body temperature or individual dehydration.
"""

class EnvironmentalRiskAgent:
    def __init__(self, model=None):
        self.model = model

    def evaluate_risk(self, env: EnvironmentData) -> Dict[str, Any]:
        """
        Calculates and structures the environmental thermal hazard profile.
        Uses deterministic physical rules with validated meteorological thresholds.
        """
        temp = env.temperature_c
        hi = env.heat_index_c
        wbgt = env.wbgt_c
        rh = env.relative_humidity_pct

        # Deterministic categorization aligned with NOAA/IMD
        if hi >= 51.0 or wbgt >= 31.5:
            tier = "EXTREME_DANGER"
            thermal_class = "Level 4: Extreme Bioclimatic Hazard"
            hazard_summary = "Lethal wet-bulb conditions. Human evaporative cooling capacity severely impaired."
        elif hi >= 41.0 or wbgt >= 29.0:
            tier = "DANGER"
            thermal_class = "Level 3: Severe Bioclimatic Hazard"
            hazard_summary = "Heat cramps and exhaustion likely; heatstroke possible with prolonged exertion."
        elif hi >= 32.0 or wbgt >= 26.5:
            tier = "EXTREME_CAUTION"
            thermal_class = "Level 2: Elevated Thermal Burden"
            hazard_summary = "Heat exhaustion possible with prolonged exposure and physical activity."
        elif hi >= 27.0:
            tier = "CAUTION"
            thermal_class = "Level 1: Moderate Thermal Burden"
            hazard_summary = "Fatigue possible with prolonged exposure."
        else:
            tier = "NORMAL"
            thermal_class = "Level 0: Baseline"
            hazard_summary = "Thermal hazard within standard occupational comfort boundaries."

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
