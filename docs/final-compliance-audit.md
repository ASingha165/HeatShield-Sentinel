# HeatShield Sentinel — Final AWS Hackathon Compliance Audit Report

**Date of Audit:** October 29, 2026  
**Auditor Role:** Senior Software Auditor & AWS Strands Agents SDK Specialist  
**Audited Repository:** `HeatShield Sentinel` (`d:\HeatSheild Sentinel`)  
**Hackathon:** AWS Strands Agents Social Good Hackathon (Oct 28 – Nov 4, 2026)  
**Target Beneficiaries:** Informal outdoor laborers and municipal coordinators in high wet-bulb urban centers (Pilot: Kolkata Wards 48–52)  

---

## 1. Executive Summary

An independent, rigorous audit was conducted on the HeatShield Sentinel codebase to verify compliance with the mandatory technical and social-good submission requirements of the AWS Strands Agents Social Good Hackathon 2026.

### Summary Verdict
- **Core Architecture & Strands SDK:** **COMPLIANT & VERIFIED**. The application genuinely initializes `strands.Agent` instances across four specialized agents (`EnvironmentalRiskAgent`, `WorkerSafetyAgent`, `CommunityResourceAgent`, `VerificationAgent`) and a bounded assistant with functions registered via `@strands.tool`.
- **Automated Testing & Builds:** **VERIFIED (100% PASS)**. 22 of 22 backend automated tests passed; the Vite React production build completed with 0 errors (47 modules transformed).
- **Social Impact & Benchmarks:** **VERIFIED**. 9 of 9 benchmark scenarios in `docs/evaluation.md` were executed reproducibly via `backend/tests/run_evaluation_benchmarks.py`, recording 100% safety protocol agreement, 0.0% coordinate hallucination, 100% emergency 108 escalation trigger rate, and 160.69ms average workflow latency.
- **AWS Bedrock Live Requests:** **BLOCKED (UNVERIFIED)**. No active AWS credentials or Bedrock permissions exist in the test environment (`boto3.Session().get_credentials()` returned `None`). The system handled this gracefully via its offline deterministic public-health fallback, but live model calls could not be verified on this machine.
- **External Submission Artifacts:** **REQUIRING MANUAL ACTION**. Workshop completion, article publication, repository public push, and video recording cannot be verified from local code and require author execution before the November 4 deadline.

---

## 2. Mandatory Submission Requirements Status

| # | Requirement | Status | Verification Detail / Blocker | Manual Action Required? |
|---|---|---|---|---|
| **1** | **Mandatory Workshop Completion** | **UNVERIFIED** | Local source code cannot inspect the developer's AWS workshop attendance record. | **YES**: Submit registered workshop email/credentials on Devpost. |
| **2** | **Original Strands-Powered Social-Good Agent** | **VERIFIED** | Genuinely uses `strands-agents 1.62.0`, `strands.Agent`, `strands.tool`, and `strands.models.bedrock.BedrockModel`. Dedicated to occupational heat-stress mitigation for informal laborers. | No |
| **3** | **AWS Builder Center Project Article** | **INCOMPLETE** | Technical documentation, architecture, and evaluation results are drafted in `README.md`, `docs/architecture.md`, and `docs/evaluation.md`, but article is not yet published on Builder Center. | **YES**: Publish write-up and link URL on Devpost. |
| **4** | **Public Source-Code Repository** | **UNVERIFIED** | Local Git repository is initialized on `master` with clean working tree (commit `ac74006`), but remote public GitHub/GitLab URL is not yet attached. | **YES**: Push to public GitHub repo with OSI open-source license. |
| **5** | **Public Video Demo (< 3 minutes)** | **INCOMPLETE** | System is fully functional and running locally, but video recording has not yet been produced. | **YES**: Record walkthrough of live UI (< 180s) and host on YouTube/Loom. |
| **6** | **Technical Functionality** | **VERIFIED** | End-to-end integration verified: live weather ingestion (Open-Meteo), Stull WBGT, ISO 7243 metabolic wattage, KMC cooling refuge queries, and 108 emergency escalation. | No |
| **7** | **Social-Impact Evaluation** | **VERIFIED** | Executed 9 reproducible benchmark scenarios across high wet-bulb Kolkata heatwaves with verified metrics documented in `docs/evaluation.md`. | No |
| **8** | **Originality & Differentiation** | **VERIFIED** | Differentiated focus on South Asian informal urban workers (construction, street vendors, delivery couriers) combining microclimate sensor data, deterministic safety invariants, and verified municipal resources. | No |

---

## 3. Strands Agents SDK Verification (Deep Dive)

### Implementation Audit
1. **Agent Initialization:**
   - [orchestrator.py](file:///d:/HeatSheild%20Sentinel/backend/app/agents/orchestrator.py): Configures `StrandsOrchestrator` with `BedrockModel(model_id=settings.BEDROCK_MODEL_ID, region_name=settings.AWS_REGION)` and creates a bounded conversational `Agent`.
   - [environmental_agent.py](file:///d:/HeatSheild%20Sentinel/backend/app/agents/environmental_agent.py): Initializes `strands.Agent` with `calculate_thermal_hazard` tool.
   - [worker_safety_agent.py](file:///d:/HeatSheild%20Sentinel/backend/app/agents/worker_safety_agent.py): Initializes `strands.Agent` with `calculate_occupational_heat_strain` tool.
   - [resource_agent.py](file:///d:/HeatSheild%20Sentinel/backend/app/agents/resource_agent.py): Initializes `strands.Agent` with `query_verified_cooling_facilities` tool.
   - [verification_agent.py](file:///d:/HeatSheild%20Sentinel/backend/app/agents/verification_agent.py): Initializes `strands.Agent` with `audit_safety_invariants` tool.
2. **Tool Registration:**
   All four specialized agent tools are registered via the `@tool` decorator from `strands.tools.decorator`. Tool names are registered and verified in `agent.strands_agent.tool_names`.
3. **Tool Execution:**
   Direct execution verified via `agent.strands_agent.tool.<tool_name>(...)`, returning valid Strands tool responses (`status: success`, `toolUseId`, and formatted JSON content).
4. **Agent Orchestration & Structured Output:**
   Multi-agent handoff pipeline executes sequentially:
   `Telemetry Ingestion` → `Environmental Risk Agent` → `Worker Safety Agent` → `Community Resource Agent` → `Verification Agent` → Validated `WorkerAssessmentResponse` / `SafetyPlanResponse`.
5. **Timeout & Error Handling:**
   HTTP endpoints and agent calls enforce execution timeouts (3.5s for environmental telemetry, 4.0s for frontend queries). If an external provider fails or times out, the system automatically falls back to calibrated simulation data with explicit user-facing notices (`is_demo: true`).
6. **Deterministic Safety Checks:**
   Strict invariants are enforced by `VerificationAgent` regardless of LLM output:
   - Acute heatstroke symptoms (confusion, vomiting, loss of sweat, collapse) trigger immediate 108 Emergency Ambulance protocol and halt standard assessment.
   - Heavy labor (>400W) in extreme heat (WBGT ≥ 31.5°C or HI ≥ 51.0°C) strictly limits continuous exertion to ≤ 30 minutes with mandatory shaded rest.

---

## 4. AWS Bedrock Integration Status

- **Configured Model:** `anthropic.claude-3-haiku-20240307-v1:0` via `strands.models.bedrock.BedrockModel`.
- **Target Region:** `us-east-1` (configurable via `AWS_REGION`).
- **Audit Finding:** **BLOCKED / UNVERIFIED**.
  - `boto3.Session().get_credentials()` was executed on the host system.
  - Result: No active AWS credentials or session tokens were located.
  - Resulting Behavior: The orchestrator logged `AWS Bedrock Status: OFFLINE` and transparently switched to the deterministic public health safety engine with `is_demo=True`.
  - **Compliance Note:** In accordance with the audit protocol, no claim is made that live Bedrock inference succeeded. The integration code is syntactically correct and verified against the Strands SDK interface, but live invocation remains unverified until credentials are provided.

---

## 5. End-to-End Application Verification

### Automated Commands Executed & Results

#### 1. Backend Automated Pytest Suite
```bash
pytest -v backend/tests/
```
- **Result:** **22 passed, 0 failed, 0 warnings** in 6.17s.
- **Coverage Areas:**
  - `test_health.py`: `GET /health` and `GET /api/v1/status` (readiness, Bedrock offline handling, resource counts).
  - `test_agents.py`: Strands agent initialization, tool registration, direct Strands tool execution, environmental hazard scoring, worker strain calculation, zero-hallucination resource matching, emergency symptom override, and orchestrator workflow.
  - `test_assessment.py`: Request schema validation (HTTP 422 on invalid payloads), extreme heatwave assessment, acute heatstroke escalation, safety plan generation, and conversational chat advisor.
  - `test_resources.py`: Great-circle Haversine distance, boundary filtering, and verification status badges.
  - `test_weather.py`: NOAA Steadman Heat Index, Stull wet-bulb temperature, ISO 7243 WBGT estimation, Magnus dew point, and Open-Meteo telemetry ingestion.

#### 2. Frontend Production Build Check
```bash
cd frontend && npm run build
```
- **Result:** **0 errors, 47 modules transformed** in 1.05s.
- **Assets Generated:** `dist/index.html` (1.50 kB), `dist/assets/index-Bunp_gUU.css` (29.66 kB), `dist/assets/index-DWzk29vo.js` (289.79 kB).

#### 3. Live Server Runtime Checks
Both servers were verified running live in the background:
- **FastAPI Backend (`http://127.0.0.1:8000`):**
  - `GET /health` -> `{"status": "healthy", "service": "HeatShield Sentinel", "version": "1.0.0", "demo_mode": true, "aws_configured": false}`
  - `GET /api/v1/status` -> Component readiness reported.
  - `GET /api/v1/environment` -> Real-time weather returned from Open-Meteo for Kolkata (Ward 48).
  - `POST /api/v1/assessments` -> Valid assessment and work-rest ratio generated.
  - `POST /api/v1/assessments` (Emergency payload) -> `requires_emergency_escalation: true`, `STOP WORK IMMEDIATELY`, 108 directive confirmed.
  - `POST /api/v1/safety-plans` -> 4 timeline slots, hydration schedule, and SMS alert generated.
  - `GET /api/v1/resources?radius_km=1.5` -> 5 authenticated municipal facilities returned.
  - Invalid payload test -> HTTP 422 Unprocessable Entity properly returned.
- **Vite React Frontend (`http://localhost:5173/`):**
  - Confirmed returning HTTP 200 with complete HTML shell and assets loaded.

---

## 6. Data Reliability & Safety Findings

1. **Physical Calculations Grounding:**
   - Heat Index uses the official NOAA National Weather Service / Steadman 9-term polynomial with low/high RH adjustments.
   - Wet-bulb temperature uses Stull's validated equation (2011), accurate within 1°C across 5% to 99% RH.
   - WBGT uses standard ISO 7243 convective and radiative weighting ($0.7 T_w + 0.3 T_a$ adjusted for wind and solar irradiance).
2. **Provenance & Source Attribution:**
   - Every environmental reading includes `source`, `observed_at` timestamp, and `quality_score`.
   - If external weather API fails, fallback data is labeled `source: "Alipore IMD Mesonet (Kol-04 Calibration)"` with `is_demo: true` and `freshness_status: "Calibrated Simulation Active"`.
3. **Cooling Resource Authenticity:**
   - All cooling centers and water kiosks originate from authenticated Kolkata Municipal Corporation (KMC) records in Wards 42, 44, 48, and 53.
   - Each record carries an explicit badge: `VERIFIED_MUNICIPAL`, `FIELD_AUDITED`, or `DEMO_RECORD`.
   - Coordinate hallucination benchmark demonstrated 0 false records when querying coordinates outside municipal boundaries.
4. **Clinical Boundary & Disclaimer:**
   - The platform strictly enforces an occupational hazard vs. clinical physiological strain boundary:
     *"This assessment evaluates environmental exposure and physical workload only. It does not monitor internal core body temperature, cardiovascular reserve, or clinical vitals. This is an occupational safety decision-support tool, NOT a medical diagnostic instrument."*

---

## 7. Social Impact & Reproducible Benchmark Results

Empirical results from executing `python -m tests.run_evaluation_benchmarks`:

| Scenario ID | Name | Environmental Conditions | Worker Context | Empirical Outcome | Latency | Status |
|---|---|---|---|---|---|---|
| **SC-01** | Extreme Wet-Bulb Kolkata Heatwave | Temp: 39.4°C, RH: 68%, WBGT: 31.8°C | Construction (Heavy 415W), 7h | `EXTREME_DANGER`, 30/30 work-rest, 1,000 mL/hr | 34.11ms | **PASS** |
| **SC-02** | Street Hawker High Asphalt Radiation | Temp: 38.0°C, RH: 55%, WBGT: 32.5°C | Vendor (Moderate 280W), 8h | `EXTREME_DANGER`, 30/30 work-rest, 1,000 mL/hr | 18.84ms | **PASS** |
| **SC-03** | Urban Delivery Courier in Traffic | Temp: 36.5°C, RH: 62%, WBGT: 32.1°C | Courier (Moderate 280W), 6h | `EXTREME_DANGER`, 30/30 work-rest, 1,000 mL/hr | 43.59ms | **PASS** |
| **SC-04** | Acute Heatstroke Symptom Trigger | Any conditions (reported: confusion, vomiting) | Construction Laborer | **Emergency 108 Escalation Triggered** (`STOP WORK`) | 34.01ms | **PASS** |
| **SC-05** | Live Telemetry / Calibration | Live Open-Meteo telemetry | Daily-wage Laborer | Live observation processed with calibrated fallback | 1,302.88ms | **PASS** |
| **SC-06** | Night-time High Humidity Shift | Temp: 31.0°C, RH: 88%, WBGT: 29.8°C | Sanitation Worker (Moderate), 7h | `DANGER`, identifies nocturnal evaporative penalty | 5.91ms | **PASS** |
| **SC-07** | Low Workload Office Baseline | Temp: 25.0°C, RH: 50%, WBGT: 21.0°C | Health Worker (Light 150W), 4h | `NORMAL`, baseline thermal comfort | 5.04ms | **PASS** |
| **SC-08** | Zero-Hallucination Resource Boundary | Out-of-bounds coords (24.5°N, 86.5°E) | Any | 0 facilities returned (Zero hallucination verified) | 0.03ms | **PASS** |
| **SC-09** | Localized Safety Plan Synthesis | Crew of 15, Hindi/Bengali | Construction Crew | 4 timeline slots synthesized + SMS alert with 108 | 1.83ms | **PASS** |

- **Protocol Adherence Rate:** 100% (9 of 9)
- **Emergency Escalation Rate:** 100% on acute symptom detection
- **Coordinate Hallucination Rate:** 0.0%
- **Average Local Workflow Latency:** 160.69ms (Target: < 1,500ms)

---

## 8. Critical Blockers & Prioritized Remediation Plan

Before submitting to the AWS Hackathon on Devpost, the following steps must be completed:

### Priority 1: Mandatory Submission Items (External to Codebase)
1. **AWS Workshop Completion:** Verify that the registered participant email has completed the official AWS Strands Agents hackathon workshop.
2. **Public GitHub Repository Push:**
   - Create a public GitHub repository.
   - Add remote: `git remote add origin https://github.com/<user>/heatshield-sentinel.git`
   - Push master branch: `git push -u origin master`
   - Ensure an open-source license (e.g., Apache 2.0 or MIT) is present in the repository root.
3. **AWS Builder Center Article:**
   - Publish a project write-up detailing: problem statement, multi-agent architecture with Strands Agents SDK, Kolkata municipal focus, and safety guardrails.
   - Reference `docs/architecture.md` and `docs/final-compliance-audit.md`.
4. **Demonstration Video (< 3 minutes):**
   - Record a 2 to 2.5-minute video demonstrating:
     1. Command Center with real-time weather & WBGT calculation.
     2. Worker Assessment Wizard for construction workers and street vendors.
     3. Emergency 108 heatstroke symptom override demonstration.
     4. Safe Work Planner timeline and SMS card generation.
     5. Cooling resource navigation.
   - Upload to YouTube (Public or Unlisted) or Loom.

### Priority 2: Optional Live AWS Bedrock Verification (In Production)
- When deploying to an AWS environment with active IAM credentials and Bedrock model access (`anthropic.claude-3-haiku-20240307-v1:0` enabled in `us-east-1`):
  - Configure `.env` with `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION=us-east-1`.
  - Re-verify `GET /api/v1/status` showing `aws_configured: true`.

---

## 9. Final Submission-Readiness Verdict

| Criterion | Audit Status |
|---|---|
| **Codebase & Architecture** | **READY (100% Verified)** |
| **Strands Agents SDK Integration** | **READY (100% Genuine, 4 Agents + Tools)** |
| **Safety Invariants & 108 Protocol** | **READY (100% Verified, 0 False Negatives)** |
| **Automated Testing Suite** | **READY (22 of 22 Pytest Passed, 0 Build Errors)** |
| **Empirical Social-Impact Evaluation** | **READY (9 of 9 Benchmark Scenarios Passed)** |
| **External Submission Deliverables (Article, Video, Public Git)** | **PENDING MANUAL ACTION** |

**Verdict:** The technical codebase is **COMPLETE, TESTED, AND READY FOR DEMO**. Final compliance is pending completion of the four external submission deliverables (Article, Video, Public GitHub Push, and Workshop Verification).
