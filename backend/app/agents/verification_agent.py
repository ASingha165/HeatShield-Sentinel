import logging
from typing import Dict, Any, List

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
   - If WBGT > 31.5C and workload is heavy, mandatory work duration cannot exceed 30 minutes.
   - Fluid intake must be at least 250 mL every 15-20 minutes during dangerous heat.
3. Reject any model-generated text that attempts to give medical diagnosis or promises absolute safety.
"""

class VerificationAgent:
    def __init__(self, model=None):
        self.model = model

    def audit_assessment(
        self,
        reported_symptoms: List[str],
        env_risk: Dict[str, Any],
        worker_safety: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Deterministic safety audit and guardrail enforcement.
        """
        # 1. Check for acute medical emergency symptoms
        has_emergency = any(
            s.lower() in EMERGENCY_SYMPTOM_KEYS or any(k in s.lower() for k in EMERGENCY_SYMPTOM_KEYS)
            for s in reported_symptoms
        )

        emergency_action_steps = None
        if has_emergency:
            requires_emergency_escalation = True
            risk_tier = "EXTREME_DANGER"
            risk_score = 100
            work_rest_ratio = "STOP WORK IMMEDIATELY"
            max_work = 0
            min_rest = 60
            critical_directive = (
                "CRITICAL MEDICAL EMERGENCY DETECTED: Signs of exertional heat exhaustion or heatstroke reported. "
                "STOP WORK IMMEDIATELY, MOVE WORKER TO SHADE, INITIATE ACTIVE COOLING, AND CALL 108 AMBULANCE NOW."
            )
            emergency_action_steps = [
                "Call 108 (West Bengal Emergency Ambulance) or 112 immediately.",
                "Move the affected worker to air-conditioned refuge or dense shade.",
                "Remove heavy outer garments, boots, and helmet.",
                "Douse head, neck, and torso with cool water; fan vigorously.",
                "DO NOT force fluids if the individual is confused, vomiting, or semi-conscious.",
            ]
        else:
            requires_emergency_escalation = False
            risk_tier = env_risk["risk_tier"]
            risk_score = worker_safety["risk_score"]
            work_rest_ratio = worker_safety["work_rest_ratio"]
            max_work = worker_safety["max_continuous_work_minutes"]
            min_rest = worker_safety["min_rest_minutes"]
            critical_directive = worker_safety["critical_safety_directive"]

            # Safety Rule 2: Invariant enforcement for extreme heat + heavy labor
            if (env_risk["wbgt_c"] >= 31.5 or env_risk["heat_index_c"] >= 51.0) and worker_safety["metabolic_rate_watts"] >= 400:
                if max_work > 30:
                    max_work = 30
                    min_rest = 30
                    work_rest_ratio = "30 min work / 30 min rest"
                    logger.info("Verification Guard enforced 30/30 work-rest invariant for extreme thermal load.")

        # Standard limitations and source citations
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
