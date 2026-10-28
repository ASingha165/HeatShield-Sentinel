import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_successful_assessment():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "sector": "construction",
            "workload": "heavy",
            "shift_duration_hours": 7.0,
            "peak_hours_exposure": True,
            "water_access_liters_per_hr": 0.75,
            "shade_access": "minimal",
            "protective_gear": ["hard_hat", "boots"],
            "reported_symptoms": [],
            "notes": "Sealdah flyover rebar work",
            "ambient_temp_c": 39.4,
            "relative_humidity_pct": 68.0,
        }
        res = await client.post("/api/v1/assessments", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["assessment_id"].startswith("HSR-2026-WB-")
        assert data["risk_tier"] in ["DANGER", "EXTREME_DANGER"]
        assert data["metabolic_rate_watts"] >= 400
        assert data["work_rest_ratio"] is not None
        assert data["hydration_target_ml_per_hour"] >= 750
        assert len(data["mandatory_protocols"]) >= 2
        assert len(data["sources_cited"]) >= 1
        assert data["requires_emergency_escalation"] is False


@pytest.mark.asyncio
async def test_emergency_symptom_escalation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "sector": "construction",
            "workload": "heavy",
            "shift_duration_hours": 6.0,
            "peak_hours_exposure": True,
            "water_access_liters_per_hr": 0.5,
            "shade_access": "none",
            "protective_gear": ["hard_hat"],
            "reported_symptoms": ["confusion", "fainting"],
        }
        res = await client.post("/api/v1/assessments", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["requires_emergency_escalation"] is True
        assert data["risk_tier"] == "EXTREME_DANGER"
        assert "STOP WORK IMMEDIATELY" in data["work_rest_ratio"]
        assert data["emergency_action_steps"] is not None
        assert len(data["emergency_action_steps"]) >= 3


@pytest.mark.asyncio
async def test_validation_errors():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Invalid shift hours (> 18)
        invalid_payload = {
            "sector": "construction",
            "workload": "heavy",
            "shift_duration_hours": 24.0,
            "water_access_liters_per_hr": 1.0,
            "shade_access": "full",
        }
        res = await client.post("/api/v1/assessments", json=invalid_payload)
        assert res.status_code == 422  # Unprocessable Entity


@pytest.mark.asyncio
async def test_safety_plan_generation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "assessment_id": "HSR-TEST-001",
            "crew_size": 15,
            "language": "en",
        }
        res = await client.post("/api/v1/safety-plans", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["plan_id"].startswith("PLAN-KOL-")
        assert len(data["shift_timeline"]) >= 3
        assert len(data["nearby_cooling_shelters"]) >= 1
        assert "108" in data["emergency_protocol"]["phone"]
        assert len(data["formatted_sms_text"]) > 20


@pytest.mark.asyncio
async def test_chat_endpoint_emergency():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {"message": "A worker collapsed and is not sweating!"}
        res = await client.post("/api/v1/chat", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "108" in data["reply"]
        assert "Emergency" in data["safety_notice"]
