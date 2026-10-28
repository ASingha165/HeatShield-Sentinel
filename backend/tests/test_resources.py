import pytest
from app.services.resource_service import resource_service


def test_haversine_distance():
    # Distance from Sealdah to College St is ~1.2 km
    dist = resource_service.haversine_distance(22.5672, 88.3712, 22.5744, 88.3601)
    assert 0.8 <= dist <= 1.6


def test_get_nearby_resources():
    # Query within 2.5 km of Central Kolkata
    facilities = resource_service.get_nearby_resources(22.5726, 88.3639, radius_km=2.5)
    assert len(facilities) >= 3
    # Check verification status exists on all facilities
    for f in facilities:
        assert f.verification_status in ["VERIFIED_MUNICIPAL", "FIELD_AUDITED", "DEMO_RECORD"]
        assert f.latitude != 0.0
        assert f.longitude != 0.0


def test_filter_by_category():
    water_kiosks = resource_service.get_nearby_resources(22.5726, 88.3639, radius_km=5.0, category="water_kiosk")
    assert len(water_kiosks) >= 1
    for k in water_kiosks:
        assert k.category == "water_kiosk"
