import logging
from typing import List, Dict, Any
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

class CommunityResourceAgent:
    def __init__(self, model=None):
        self.model = model

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
        nearby = resource_service.get_nearby_resources(lat, lon, radius_km)
        return nearby
