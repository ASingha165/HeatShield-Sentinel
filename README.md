# HeatShield Sentinel — AI Climate Resilience Platform

[![AWS Strands Agents Social Good Hackathon 2026](https://img.shields.io/badge/AWS%20Hackathon-Strands%20Agents%202026-FF9900.svg)](https://aws.amazon.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-61DAFB.svg)](https://reactjs.org/)

**HeatShield Sentinel** is an AI-powered occupational climate-resilience platform engineered for outdoor laborers, frontline community coordinators, and municipal safety supervisors facing lethal urban heat conditions.

Piloted for the high-density metropolitan corridor of **Kolkata, West Bengal** (Ward 48–52, Sealdah, Barabazar, College Street), the system translates live meso-climatic observations and wet-bulb globe temperature (WBGT) estimations into context-aware, deterministic work-rest schedules and verified cooling shelter navigation.

---

## 🎯 Target Population & Social Problem

Rapid urbanization coupled with maritime humidity creates lethal "wet-bulb" microclimates where sweat cannot evaporate effectively. Those most vulnerable include:
* **Construction Workers:** High metabolic workload under unshaded direct solar irradiance.
* **Street Vendors & Hawkers:** Stationary prolonged thermal exposure on asphalt corridors.
* **Delivery & Gig Couriers:** Rapid cardiovascular spikes navigating traffic in high-humidity ambient heat.
* **Daily-Wage Outdoor Laborers & Sanitation Teams:** Limited labor protections, scarce potable drinking water access.
* **Frontline Community Health Workers (ASHA/Volunteers):** Managing localized heat vulnerability triage without clinical diagnostic tools.

---

## ⚡ Core Features

1. **Operational Command Center:** Real-time urban sector surveillance, IMD alert band synchronization (Orange/Red warnings), live heat index, and active crew status.
2. **Occupational Heat Risk Assessment Wizard:** 5-step interactive workflow evaluating work intensity, shift duration, hydration access, shade availability, and protective gear.
3. **Safe Work Operational Planner:** Actionable work-rest ratios (e.g., 45/15, 30/30 min), hourly hydration quotas (≥250ml every 20 min), and immediate Bengali/Hindi field card exports.
4. **Heat Risk Intelligence & Meteorological Analysis:** Granular biophysical heat-stress telemetry, dry bulb vs wet-bulb progression curves, and dew point tracking.
5. **Verified Community Cooling & Hydration Network:** Searchable, spatial directory of municipal water kiosks, chilled civic shelters, and shaded rest canopies with explicit verification audits.
6. **Community Resilience Insights:** Ward-level heat vulnerability heatmaps and anonymized intervention efficacy tracking.
7. **Strict Responsible AI & Emergency Guardrails:** Non-diagnostic boundaries and instantaneous 108 Ambulance escalation for exertional heatstroke symptoms.

---

## 🧠 AWS Strands Multi-Agent Architecture

HeatShield Sentinel leverages the **AWS Strands Agents SDK (`strands-agents`)** with a coordinated 4-agent harness:

```
                  [ Meteorological Data & User Context ]
                                   │
                                   ▼
                   ┌────────────────────────────────┐
                   │   Agent A: Environmental Risk  │
                   │   Calculates Heat Index & WBGT │
                   └───────────────┬────────────────┘
                                   │
                                   ▼
                   ┌────────────────────────────────┐
                   │   Agent B: Worker Context      │
                   │   Determines Work/Rest Protocols │
                   └───────────────┬────────────────┘
                                   │
                                   ▼
                   ┌────────────────────────────────┐
                   │   Agent C: Community Resource  │
                   │   Audited Cooling Facilities   │
                   └───────────────┬────────────────┘
                                   │
                                   ▼
                   ┌────────────────────────────────┐
                   │   Agent D: Verification Guard  │
                   │   Deterministic Safety Check   │
                   └───────────────┬────────────────┘
                                   │
                                   ▼
                     [ Structured Safety Directives ]
```

* **Agent A (Environmental Risk Agent):** Parses raw telemetry, detects missing data, computes Steadman Heat Index and estimated WBGT, and assigns validated thermal hazard categories.
* **Agent B (Worker Context & Safety Agent):** Assesses metabolic load and exposure duration to synthesize work-rest schedules aligned with NIOSH/ISO 7243 standards.
* **Agent C (Community Resource Agent):** Spatial discovery of verified municipal cooling hubs; guarantees no hallucinated or unverified coordinates.
* **Agent D (Verification & Safety Guard Agent):** Enforces deterministic invariants (e.g. WBGT > 32°C mandates ≥50% shade rest; emergency symptoms bypass AI and invoke 108 protocol).

---

## ☁️ AWS & Foundation Model Integration

* **Amazon Bedrock:** Powered by Claude 3 Haiku (`anthropic.claude-3-haiku-20240307-v1:0`) via the Strands `BedrockModel` provider.
* **Resilience Mode:** When running without active AWS credentials or offline, the platform seamlessly switches to deterministic public-health rules labeled with prominent **DEMO MODE / SIMULATION ACTIVE** banners.

---

## 🚀 Quick Start Guide

### Prerequisites
* Python 3.12+
* Node.js v18+ (Node.js v24 tested)
* Git

### 1. Repository Setup
```bash
git clone https://github.com/your-org/heatshield-sentinel.git
cd heatshield-sentinel
cp .env.example .env
```

### 2. Backend Installation & Start
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI backend
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation available at: `http://localhost:8000/docs`

### 3. Frontend Installation & Start
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

Execute automated unit, schema, and agent workflow tests:
```bash
# Run backend test suite
pytest -v backend/tests/

# Verify frontend production build
cd frontend && npm run build
```

---

## 🛡️ Responsible AI & Health Notice

1. **Non-Diagnostic:** HeatShield Sentinel does not provide medical diagnoses or predict physiological core body temperature.
2. **Emergency Protocol:** In cases of heat exhaustion or heatstroke (confusion, collapse, cessation of sweating, vomiting), **call 108 (India Emergency Ambulance)** immediately. Do not delay emergency transport for software re-calculation.
3. **Data Integrity:** All sample facilities and meteorological feeds are labeled clearly when demonstration data is active.

---

## 📄 License
This project is licensed under the Apache 2.0 / MIT License for the AWS Strands Agents Social Good Hackathon 2026.
