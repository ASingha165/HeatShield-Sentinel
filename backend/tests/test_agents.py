import pytest
from app.agents.environmental_agent import EnvironmentalRiskAgent
from app.agents.worker_safety_agent import WorkerSafetyAgent
from app.agents.resource_agent import CommunityResourceAgent
from app.agents.verification_agent import VerificationAgent
from app.agents.orchestrator import orchestrator
from app.schemas.environment import EnvironmentData
from app.schemas.assessment import WorkerAssessmentRequest


def test_environmental_agent_extreme_risk():
    agent = EnvironmentalRiskAgent()
    env = EnvironmentData(
        temperature_c=39.4,
        relative_humidity_pct=68.0,
        heat_index_c=51.2,
        wbgt_c=31.8,
        dew_point_c=32.1,
        wind_speed_kmh=14.0,
        solar_radiation_wm2=850.0,
        uv_index=10.0,
        observed_at="2026-10-28T14:00:00",
        source="IMD Kol-04",
        location_name="Kolkata",
        latitude=22.57,
        longitude=88.36,
        is_demo=True,
        freshness_status="Live",
        quality_score=95,
        alert_band="ORANGE",
    )
    result = agent.evaluate_risk(env)
    assert result["risk_tier"] == "EXTREME_DANGER"
    assert "Level 4" in result["thermal_class"]
    assert "core temperature" in result["limitation"].lower()


def test_worker_safety_agent_heavy_labor():
    agent = WorkerSafetyAgent()
    req = WorkerAssessmentRequest(
        sector="construction",
        workload="heavy",
        shift_duration_hours=7.0,
        peak_hours_exposure=True,
        water_access_liters_per_hr=1.0,
        shade_access="minimal",
        protective_gear=["hard_hat"],
        reported_symptoms=[],
    )
    env_risk = {
        "risk_tier": "EXTREME_DANGER",
        "heat_index_c": 51.2,
        "wbgt_c": 31.8,
    }
    result = agent.evaluate_worker_safety(req, env_risk)
    assert result["metabolic_rate_watts"] == 415
    assert "30 min work" in result["work_rest_ratio"] or "20 min work" in result["work_rest_ratio"]
    assert result["hydration_target_ml_per_hour"] >= 750


def test_community_resource_agent_zero_hallucination():
    agent = CommunityResourceAgent()
    shelters = agent.find_shelters(22.5726, 88.3639, radius_km=2.0)
    assert len(shelters) >= 2
    for s in shelters:
        # Guarantee no empty names or fake coordinates
        assert len(s.name) > 5
        assert s.latitude > 20.0 and s.longitude > 80.0
        assert s.verification_status in ["VERIFIED_MUNICIPAL", "FIELD_AUDITED", "DEMO_RECORD"]


def test_verification_agent_emergency_invariant():
    agent = VerificationAgent()
    reported_symptoms = ["dizziness", "vomiting", "confusion"]
    env_risk = {"risk_tier": "CAUTION", "heat_index_c": 35.0, "wbgt_c": 27.0}
    worker_safety = {
        "risk_score": 40,
        "work_rest_ratio": "50 min work / 10 min rest",
        "max_continuous_work_minutes": 50,
        "min_rest_minutes": 10,
        "critical_safety_directive": "Regular rest",
        "metabolic_rate_watts": 280,
    }
    audit = agent.audit_assessment(reported_symptoms, env_risk, worker_safety)
    # Verification Agent MUST override risk score to 100 and escalate to 108
    assert audit["requires_emergency_escalation"] is True
    assert audit["risk_tier"] == "EXTREME_DANGER"
    assert audit["risk_score"] == 100
    assert "STOP WORK" in audit["work_rest_ratio"]


@pytest.mark.asyncio
async def test_orchestrator_end_to_end():
    req = WorkerAssessmentRequest(
        sector="street_vendor",
        workload="moderate",
        shift_duration_hours=6.0,
        peak_hours_exposure=True,
        water_access_liters_per_hr=1.2,
        shade_access="partial",
        protective_gear=[],
        reported_symptoms=[],
    )
    res = await orchestrator.execute_assessment_workflow(req)
    assert res.assessment_id is not None
    assert res.work_rest_ratio is not None
    assert res.hydration_target_ml_per_hour > 0
    assert len(res.sources_cited) >= 2


def test_strands_sdk_agent_and_tool_registration():
    """Verifies that all 4 specialized agents initialize genuine Strands Agents with registered tools."""
    env_agent = EnvironmentalRiskAgent()
    assert env_agent.strands_agent is not None
    assert "calculate_thermal_hazard" in env_agent.strands_agent.tool_names

    worker_agent = WorkerSafetyAgent()
    assert worker_agent.strands_agent is not None
    assert "calculate_occupational_heat_strain" in worker_agent.strands_agent.tool_names

    resource_agent = CommunityResourceAgent()
    assert resource_agent.strands_agent is not None
    assert "query_verified_cooling_facilities" in resource_agent.strands_agent.tool_names

    verification_agent = VerificationAgent()
    assert verification_agent.strands_agent is not None
    assert "audit_safety_invariants" in verification_agent.strands_agent.tool_names


def test_strands_agent_tool_execution():
    """Verifies direct Strands tool invocation returning structured JSON content."""
    env_agent = EnvironmentalRiskAgent()
    output = env_agent.strands_agent.tool.calculate_thermal_hazard(
        temp_c=40.0,
        heat_index_c=52.0,
        wbgt_c=32.0,
        humidity_pct=70.0,
    )
    assert output["status"] == "success"
    assert "toolUseId" in output
    assert "EXTREME_DANGER" in output["content"][0]["text"]

