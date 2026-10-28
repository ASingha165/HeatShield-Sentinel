import json
import logging
from typing import List, Dict, Any, Optional
from strands import Agent, tool
from app.services.resource_service import resource_service
from app.schemas.resource import CoolingResource

logger = logging.getLogger(__name__)

RESOURCE_AGENT_SYSTEM_PROMPT = """
You are the Community Resource Agent of HeatShield Sentinel.
Your responsibility:
1. Identify verified municipal cooling shelters, air-conditioned civic halls, and chilled potable water kiosks.
2. Calculate walking distance to nearby refuges.
3. STRICT INVARIANT: Never invent addresses, telephone numbers, or GPS coordinates. If no verified shelter is within walking distance, explicitly state that no verified facility exists within walking range.
"""

@tool
def query_verified_cooling_facilities(lat: float, lon: float, radius_km: float = 2.0) -> str:
    """
    Queries authenticated municipal registry for verified cooling centers and water kiosks.
    Strictly preserves provenance, verification badges, and spatial proximity.
    """
    shelters = resource_service.get_nearby_resources(lat, lon, radius_km)
    serialized = [s.model_dump() for s in shelters]
    return json.dumps(serialized)


class CommunityResourceAgent:
    def __init__(self, model=None):
        self.model = model
        self.strands_agent: Optional[Agent] = None
        self._init_strands_agent()

    def _init_strands_agent(self):
        """Initializes the Strands SDK Agent with municipal resource query tools."""
        try:
            agent_kwargs: Dict[str, Any] = {
                "tools": [query_verified_cooling_facilities],
                "system_prompt": RESOURCE_AGENT_SYSTEM_PROMPT,
            }
            if self.model:
                agent_kwargs["model"] = self.model
            self.strands_agent = Agent(**agent_kwargs)
            logger.info("CommunityResourceAgent initialized with Strands SDK Agent.")
        except Exception as e:
            logger.warning(f"Strands Agent initialization fallback in CommunityResourceAgent: {e}")
            self.strands_agent = None

    def find_shelters(
        self, 
        lat: float = 22.5726, 
        lon: float = 88.3639, 
        radius_km: float = 2.0
    ) -> List[CoolingResource]:
        """
        Retrieves verified cooling facilities from municipal registry.
        Preserves 100% provenance and verification status.
        """
        if self.strands_agent and hasattr(self.strands_agent.tool, "query_verified_cooling_facilities"):
            try:
                tool_output = self.strands_agent.tool.query_verified_cooling_facilities(
                    lat=lat,
                    lon=lon,
                    radius_km=radius_km,
                )
                if isinstance(tool_output, dict) and "content" in tool_output and tool_output["content"]:
                    records = json.loads(tool_output["content"][0]["text"])
                    return [CoolingResource(**r) for r in records]
            except Exception as e:
                logger.warning(f"Strands tool execution error ({e}); using direct registry lookup.")

        nearby = resource_service.get_nearby_resources(lat, lon, radius_km)
        return nearby
