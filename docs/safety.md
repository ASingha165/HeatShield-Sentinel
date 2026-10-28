# HeatShield Sentinel — Safety Directives & Responsible AI Framework

## 1. Safety Directives & Clinical Non-Diagnostic Boundary

HeatShield Sentinel is engineered as an **occupational risk-mitigation tool**, not a medical diagnostic device.

### Core Safety Rules
1. **Never Guarantee Safety:** The system never issues statements guaranteeing that an outdoor worker is "safe from heat illness". Individual physiological factors (age, hydration status, acclimatization, chronic cardiovascular or renal conditions, medications) introduce significant variance.
2. **Deterministic Overrides:** LLM responses cannot soften, weaken, or contradict deterministic public-health safety constraints:
   - When Heat Index exceeds 54°C (130°F) or WBGT exceeds 32.5°C with heavy labor: **Mandatory work cessation or maximum 15 min work / 45 min rest**.
   - Minimum hydration requirement: **250 mL (1 cup) cool water every 15–20 minutes**.
3. **No Delay for Clinical Emergencies:** If suspected heatstroke symptoms (confusion, altered mental status, loss of consciousness, cessation of sweating, convulsions, projectile vomiting) are present, the system **immediately halts algorithmic assessment** and displays the **Emergency 108 Protocol**.

---

## 2. Emergency 108 Heatstroke Protocol

When acute symptoms are triggered:
```
┌────────────────────────────────────────────────────────────────────────┐
│                      CRITICAL MEDICAL EMERGENCY                         │
│                                                                        │
│  1. IMMEDIATELY CALL 108 (Emergency Ambulance - West Bengal / India).  │
│  2. Move individual to maximum shade or air-conditioned vehicle/room.  │
│  3. Remove heavy outer clothing and equipment.                         │
│  4. Initiate active cooling:                                           │
│     - Douse head and torso with cool water.                            │
│     - Fan aggressively to maximize evaporative cooling.                │
│     - Apply cold wet cloths or ice packs to neck, armpits, and groin.  │
│  5. DO NOT force an unconscious or confused person to drink fluids.    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Integrity & Verification Standard

* **Zero Hallucination Tolerance on Municipal Resources:** The system will never generate fictional cooling centers, fake emergency telephone numbers, or unverified GPS coordinates.
* **Verification Badges:**
  - `VERIFIED_MUNICIPAL`: Audited by Kolkata Municipal Corporation (KMC) / NDMA registry.
  - `FIELD_AUDITED`: Verified within past 7 days by community health partner.
  - `DEMO_RECORD`: Clearly identified demonstration record for testing and simulation purposes.
