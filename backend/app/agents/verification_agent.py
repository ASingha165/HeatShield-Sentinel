import json
import logging
from typing import Dict, Any, List, Optional
from strands import Agent, tool

logger = logging.getLogger(__name__)

EMERGENCY_SYMPTOM_KEYS = {
    "confusion",
    "no_sweat",
    "vomiting",
    "fainting",
    "slurred_speech",
    "convulsions",
    "unconscious",
}

VERIFICATION_AGENT_SYSTEM_PROMPT = """
You are the Verification and Safety Guard Agent of HeatShield Sentinel.
Your responsibility:
1. Audit assessment drafts for clinical contradictions, unsupported claims, or safety violations.
2. Enforce deterministic life-safety rules:
   - If emergency symptoms are present, escalate immediately to 108 Ambulance protocol.
   - If WBGT >= 31.5C and workload is heavy, mandatory continuous work duration cannot exceed 30 minutes.
   - Fluid intake must be at least 250 mL every 15-20 minutes during dangerous heat.
3. Reject any model-generated text that attempts to give medical diagnosis or promises absolute safety.
"""

@tool
def audit_safety_invariants(
    reported_symptoms_csv: str,
    wbgt_c: float,
    heat_index_c: float,
    metabolic_watts: int,
    proposed_max_work: int,
) -> str:
    """
    Audits workplace recommendations against strict life-safety constraints,
    escalating acute emergency symptoms to 108 protocol and enforcing 30/30 work-rest invariants.
    """
    symptoms = [s.strip().lower() for s in reported_symptoms_csv.split(",") if s.strip()]
    has_emergency = any(
        s in EMERGENCY_SYMPTOM_KEYS or any(k in s for k in EMERGENCY_SYMPTOM_KEYS)
        for s in symptoms
    )

    if has_emergency:
        return json.dumps({
            "requires_emergency_escalation": True,
            "risk_tier": "EXTREME_DANGER",
            "risk_score": 100,
            "work_rest_ratio": "STOP WORK IMMEDIATELY",
            "max_continuous_work_minutes": 0,
            "min_rest_minutes": 60,
            "critical_safety_directive": (
                "CRITICAL MEDICAL EMERGENCY DETECTED: Signs of exertional heat exhaustion or heatstroke reported. "
                "STOP WORK IMMEDIATELY, MOVE WORKER TO SHADE, INITIATE ACTIVE COOLING, AND CALL 108 AMBULANCE NOW."
            ),
            "emergency_action_steps": [
                "Call 108 (West Bengal Emergency Ambulance) or 112 immediately.",
                "Move the affected worker to air-conditioned refuge or dense shade.",
                "Remove heavy outer garments, boots, and helmet.",
                "Douse head, neck, and torso with cool water; fan vigorously.",
                "DO NOT force fluids if the individual is confused, vomiting, or semi-conscious.",
            ],
        })

    # Non-emergency: check extreme heat invariant
    work_limit = proposed_max_work
    work_rest = None
    if (wbgt_c >= 31.5 or heat_index_c >= 51.0) and metabolic_watts >= 400:
        if work_limit > 30:
            work_limit = 30
            work_rest = "30 min work / 30 min rest"

    return json.dumps({
        "requires_emergency_escalation": False,
        "max_continuous_work_minutes": work_limit,
        "work_rest_ratio": work_rest,
    })


class VerificationAgent:
    def __init__(self, model=None):
        self.model = model
        self.strands_agent: Optional[Agent] = None
        self._init_strands_agent()

    def _init_strands_agent(self):
        """Initializes the Strands SDK Agent with safety invariant auditing tools."""
        try:
            agent_kwargs: Dict[str, Any] = {
                "tools": [audit_safety_invariants],
                "system_prompt": VERIFICATION_AGENT_SYSTEM_PROMPT,
            }
            if self.model:
                agent_kwargs["model"] = self.model
            self.strands_agent = Agent(**agent_kwargs)
            logger.info("VerificationAgent initialized with Strands SDK Agent.")
        except Exception as e:
            logger.warning(f"Strands Agent initialization fallback in VerificationAgent: {e}")
            self.strands_agent = None

    def audit_assessment(
        self,
        reported_symptoms: List[str],
        env_risk: Dict[str, Any],
        worker_safety: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Deterministic safety audit and guardrail enforcement via Strands SDK tool.
        """
        symptoms_csv = ",".join(reported_symptoms)
        wbgt = env_risk["wbgt_c"]
        hi = env_risk["heat_index_c"]
        watts = worker_safety["metabolic_rate_watts"]
        proposed_work = worker_safety["max_continuous_work_minutes"]

        # Run safety audit tool
        audit_result = None
        if self.strands_agent and hasattr(self.strands_agent.tool, "audit_safety_invariants"):
            try:
                tool_output = self.strands_agent.tool.audit_safety_invariants(
                    reported_symptoms_csv=symptoms_csv,
                    wbgt_c=wbgt,
                    heat_index_c=hi,
                    metabolic_watts=watts,
                    proposed_max_work=proposed_work,
                )
                if isinstance(tool_output, dict) and "content" in tool_output and tool_output["content"]:
                    audit_result = json.loads(tool_output["content"][0]["text"])
            except Exception as e:
                logger.warning(f"Strands verification tool error ({e}); using direct audit.")

        if not audit_result:
            audit_result = json.loads(audit_safety_invariants(symptoms_csv, wbgt, hi, watts, proposed_work))

        if audit_result.get("requires_emergency_escalation"):
            requires_emergency_escalation = True
            risk_tier = audit_result["risk_tier"]
            risk_score = audit_result["risk_score"]
            work_rest_ratio = audit_result["work_rest_ratio"]
            max_work = audit_result["max_continuous_work_minutes"]
            min_rest = audit_result["min_rest_minutes"]
            critical_directive = audit_result["critical_safety_directive"]
            emergency_action_steps = audit_result["emergency_action_steps"]
        else:
            requires_emergency_escalation = False
            risk_tier = env_risk["risk_tier"]
            risk_score = worker_safety["risk_score"]
            work_rest_ratio = audit_result.get("work_rest_ratio") or worker_safety["work_rest_ratio"]
            max_work = audit_result["max_continuous_work_minutes"]
            min_rest = worker_safety["min_rest_minutes"]
            critical_directive = worker_safety["critical_safety_directive"]
            emergency_action_steps = None

        limitations = [
            "This assessment evaluates environmental exposure and physical workload only.",
            "It does not monitor internal core body temperature, cardiovascular reserve, or clinical vitals.",
            "This is an occupational safety decision-support tool, NOT a medical diagnostic instrument.",
        ]

        sources_cited = [
            "NIOSH Criteria for a Recommended Standard: Occupational Exposure to Heat and Hot Environments (DHHS Pub. No. 2016-106)",
            "ISO 7243:2017 Ergonomics of the thermal environment — Assessment of heat stress using WBGT",
            "National Disaster Management Authority (NDMA) National Guidelines on Heat Wave Action Plans (Govt of India)",
        ]

        return {
            "requires_emergency_escalation": requires_emergency_escalation,
            "emergency_action_steps": emergency_action_steps,
            "risk_tier": risk_tier,
            "risk_score": risk_score,
            "work_rest_ratio": work_rest_ratio,
            "max_continuous_work_minutes": max_work,
            "min_rest_minutes": min_rest,
            "critical_safety_directive": critical_directive,
            "limitations": limitations,
            "sources_cited": sources_cited,
        }
