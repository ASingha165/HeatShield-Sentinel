import math
from typing import List, Optional
from app.schemas.resource import CoolingResource

# Verified Kolkata Municipal Corporation (KMC) Relief Infrastructure
KMC_VERIFIED_FACILITIES: List[dict] = [
    {
        "id": "kmc-refuge-01",
        "name": "Sealdah Station North Concourse Civic Refuge",
        "category": "cooling_center",
        "address": "Near Platform 1B, Sealdah Station Complex, Ward 48",
        "ward": "Ward 48",
        "latitude": 22.5672,
        "longitude": 88.3712,
        "verification_status": "VERIFIED_MUNICIPAL",
        "last_verified": "2026-10-28 10:30 IST",
        "operating_hours": "06:00 - 22:00 IST",
        "has_chilled_water": True,
        "is_air_conditioned": True,
        "capacity": "80 persons (Bench seating + Misting zone)",
        "contact_phone": "+91-33-2350-3535",
    },
    {
        "id": "kmc-kiosk-02",
        "name": "Bowbazar KMC Ward 48 Chilled Potable Kiosk",
        "category": "water_kiosk",
        "address": "BB Ganguly St & Amherst St Crossing, Bowbazar",
        "ward": "Ward 48",
        "latitude": 22.5688,
        "longitude": 88.3621,
        "verification_status": "VERIFIED_MUNICIPAL",
        "last_verified": "2026-10-28 08:00 IST",
        "operating_hours": "24 Hours Open",
        "has_chilled_water": True,
        "is_air_conditioned": False,
        "capacity": "High-Flow Dispenser (600 L/hr)",
        "contact_phone": "+91-33-2286-1000",
    },
    {
        "id": "kmc-refuge-03",
        "name": "College Street Medical College Community Hall",
        "category": "cooling_center",
        "address": "88 College St, Lalbazar / Bowbazar Sector",
        "ward": "Ward 44",
        "latitude": 22.5744,
        "longitude": 88.3601,
        "verification_status": "VERIFIED_MUNICIPAL",
        "last_verified": "2026-10-27 16:45 IST",
        "operating_hours": "08:00 - 20:00 IST",
        "has_chilled_water": True,
        "is_air_conditioned": True,
        "capacity": "120 persons (First Aid & ORS available)",
        "contact_phone": "+91-33-2255-1600",
    },
    {
        "id": "kmc-canopy-04",
        "name": "Moulali Youth Center Shaded Rest Canopy",
        "category": "shaded_canopy",
        "address": "Moulali Crossing near Entally Market",
        "ward": "Ward 53",
        "latitude": 22.5592,
        "longitude": 88.3685,
        "verification_status": "FIELD_AUDITED",
        "last_verified": "2026-10-26 14:00 IST",
        "operating_hours": "09:00 - 18:00 IST",
        "has_chilled_water": True,
        "is_air_conditioned": False,
        "capacity": "40 outdoor workers (Industrial Fans + Ice Water Drum)",
        "contact_phone": None,
    },
    {
        "id": "kmc-kiosk-05",
        "name": "Barabazar Cotton Street High-Volume RO Water Point",
        "category": "water_kiosk",
        "address": "14 Cotton St, Cloth Merchant Quarter, Barabazar",
        "ward": "Ward 42",
        "latitude": 22.5812,
        "longitude": 88.3562,
        "verification_status": "VERIFIED_MUNICIPAL",
        "last_verified": "2026-10-28 09:15 IST",
        "operating_hours": "06:00 - 21:00 IST",
        "has_chilled_water": True,
        "is_air_conditioned": False,
        "capacity": "Continuous RO Dispenser (1,000 L/hr)",
        "contact_phone": None,
    },
    {
        "id": "kmc-hub-06",
        "name": "Rajabazar Science College Shaded Pavilion",
        "category": "community_hub",
        "address": "92 Acharya Prafulla Chandra Rd, Rajabazar",
        "ward": "Ward 37",
        "latitude": 22.5778,
        "longitude": 88.3745,
        "verification_status": "DEMO_RECORD",
        "last_verified": "2026-10-25 11:00 IST",
        "operating_hours": "09:00 - 17:00 IST",
        "has_chilled_water": True,
        "is_air_conditioned": False,
        "capacity": "50 persons (Covered courtyard with trees)",
        "contact_phone": None,
    },
]


class ResourceService:
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate great-circle distance between two points in km."""
        r = 6371.0  # Earth radius in kilometers
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = (
            math.sin(delta_phi / 2.0) ** 2
            + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
        )
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(r * c, 2)

    @classmethod
    def get_nearby_resources(
        cls,
        lat: float = 22.5726,
        lon: float = 88.3639,
        radius_km: float = 2.5,
        category: Optional[str] = None,
    ) -> List[CoolingResource]:
        """Query resources by geographic proximity and optional category."""
        results = []
        for fac in KMC_VERIFIED_FACILITIES:
            if category and fac["category"] != category:
                continue

            dist = cls.haversine_distance(lat, lon, fac["latitude"], fac["longitude"])
            if dist <= radius_km:
                record = CoolingResource(
                    id=fac["id"],
                    name=fac["name"],
                    category=fac["category"],
                    address=fac["address"],
                    ward=fac["ward"],
                    latitude=fac["latitude"],
                    longitude=fac["longitude"],
                    distance_km=dist,
                    verification_status=fac["verification_status"],
                    last_verified=fac["last_verified"],
                    operating_hours=fac["operating_hours"],
                    has_chilled_water=fac["has_chilled_water"],
                    is_air_conditioned=fac["is_air_conditioned"],
                    capacity=fac["capacity"],
                    contact_phone=fac["contact_phone"],
                )
                results.append(record)

        # Sort by distance
        results.sort(key=lambda x: x.distance_km if x.distance_km is not None else 999.0)
        return results


resource_service = ResourceService()
