# HeatShield Sentinel — System Architecture

## 1. Architectural Principles

1. **Separation of Environmental Hazard vs. Physiological Strain:** Environmental conditions (ambient temperature, humidity, solar radiation) define the external exposure hazard; they do not quantify an individual worker's internal core temperature.
2. **Deterministic Safety Guardrails:** AI agents enhance context understanding and language generation, but deterministic logic enforces critical boundaries (e.g., maximum work duration, minimum rest duration, mandatory emergency escalation).
3. **Graceful Degradation:** The platform operates in two validated modes:
   - *Live Connected Mode:* Amazon Bedrock Claude 3 Haiku via AWS Strands Agents SDK + Live Open-Meteo API.
   - *Autonomous Demonstration Mode:* Built-in deterministic safety reasoning engine + Calibrated Kolkata IMD microclimate telemetry.
4. **Transparent Provenance:** Every piece of advice, thermal index, and cooling location carries source attribution, confidence metrics, and verification status.

---

## 2. Component Architecture

### Frontend (React + TypeScript + Vite + Tailwind CSS)
* **Design Foundation:** Material 3 design system implemented via Google Stitch tokens.
* **Component Layers:**
  - `Layout`: Shared responsive sidebar navigation (`CommandCenter`, `WorkerAssessment`, `SafeWorkPlanner`, `HeatRiskIntelligence`, `CoolingResources`, `CommunityInsights`, `AboutSystem`).
  - `Header`: Active microzone indicator, demo status pill, language selector (English, Bengali, Hindi), Emergency Protocol button.
  - `Pages`: 7 comprehensive operational screens.
  - `Services`: Typed HTTP API client with resilient fallback handling.
  - `State Management`: Context-driven state preserving active worker assessment results across views.

### Backend (FastAPI + Pydantic v2 + Python 3.12)
* **Application Core:**
  - `app/main.py`: FastAPI application lifecycle, CORS, routing.
  - `app/core/config.py`: Typed configuration via Pydantic BaseSettings.
  - `app/schemas/`: Typed request/response models.
  - `app/services/weather_service.py`: Provider abstraction for Open-Meteo & simulated IMD station readings.
  - `app/services/resource_service.py`: Spatial proximity engine for verified municipal cooling hubs.
  - `app/agents/`: AWS Strands Agents multi-agent harness.

---

## 3. AWS Strands Agents SDK Workflow

```
[ POST /api/v1/assessments ]
             │
             ▼
   [ Weather Provider ]  <── Fetches Dry Bulb, RH, Wind Speed, Solar Radiation
             │
             ▼
┌─────────────────────────┐
│ Environmental Risk Agent│  <── Calculates Heat Index (Steadman) & WBGT
└────────────┬────────────┘
             │ (Structured Risk Profile)
             ▼
┌─────────────────────────┐
│   Worker Safety Agent   │  <── Evaluates Workload, Shift, Hydration, Shade
└────────────┬────────────┘
             │ (Draft Safety Directives)
             ▼
┌─────────────────────────┐
│ Community Resource Agent│  <── Queries Verified Facilities within Walking Radius
└────────────┬────────────┘
             │ (Verified Facility Data)
             ▼
┌─────────────────────────┐
│   Verification Agent    │  <── Validates against Invariants & Safety Protocols
└────────────┬────────────┘
             │ (Audited Response)
             ▼
   [ API Response JSON ]
```

### Strands Agent Definitions:
1. **`environmental_agent`**: Built with `strands.Agent(model=BedrockModel(...))`. Computes Steadman equation when ambient temp ≥ 27°C and RH ≥ 40%. Generates human-understandable risk context.
2. **`worker_safety_agent`**: Maps metabolic rate (Watts) based on sector and intensity. Computes work/rest schedule following NIOSH Criteria for a Recommended Standard (Occupational Exposure to Heat).
3. **`resource_agent`**: Applies spatial filtering and verification flags (`VERIFIED_MUNICIPAL`, `FIELD_AUDITED`, `DEMO_RECORD`).
4. **`verification_agent`**: Ensures adherence to safety constraints and injects emergency 108 Ambulance escalation if acute distress symptoms are reported.
