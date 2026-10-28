# HeatShield Sentinel — Evaluation Methodology & Test Scenarios

## 1. Evaluation Objectives

To validate the reliability, safety compliance, and response latency of HeatShield Sentinel across a benchmark dataset of 9 representative heat-exposure scenarios.

---

## 2. Benchmark Scenarios

| Scenario ID | Name | Environmental Conditions | Worker Context | Expected System Outcome |
|---|---|---|---|---|
| **SC-01** | Extreme Wet-Bulb Kolkata Heatwave | Temp: 39.4°C, RH: 68%, WBGT: 31.8°C | Construction Laborer, Heavy Workload, 7 hrs outdoor | Risk: Extreme Danger (Level 4). Mandatory 30 min work / 30 min rest. 1 L/hr hydration. Active cooling shelters routed. |
| **SC-02** | Street Hawker High Asphalt Radiation | Temp: 38.0°C, RH: 55%, WBGT: 29.5°C | Street Vendor, Moderate Workload, 8 hrs outdoor | Risk: Danger (Level 3). 45 min work / 15 min rest in shade. Chilled water kiosk nearby. |
| **SC-03** | Urban Delivery Courier in Traffic | Temp: 36.5°C, RH: 62%, WBGT: 28.8°C | Delivery Worker, Moderate Workload, 6 hrs on motorcycle | Risk: High Caution (Level 2). Electrolyte replacement, rest canopy check-in. |
| **SC-04** | Acute Heatstroke Symptom Trigger | Any environmental conditions | Worker reported confusion, collapse, or nausea | **Emergency Escalation (108 Ambulance Protocol)** triggered immediately. Assessment suspended. |
| **SC-05** | Stale / Missing Weather Data | Weather API offline / timeout | Daily-wage laborer, heavy workload | Fallback to calibrated Alipore IMD Mesonet Kol-04 with explicit "SIMULATION DATA ACTIVE" warning. |
| **SC-06** | Contradictory Telemetry | Temp: 15°C, Heat Index reported 45°C | General laborer | Data validation rejects contradictory input and logs warning. |
| **SC-07** | Night-time High Humidity Shift | Temp: 31.0°C, RH: 88%, WBGT: 28.2°C | Night sanitation worker | Identifies lack of diurnal nocturnal cooling; recommends continuous hydration. |
| **SC-08** | No Nearby Verified Shelter | Location > 5 km from verified shelter | Rural migrant worker | Explicitly states: "No verified shelter within walking radius (≤ 1.5 km)". Suggests creating improvised tarp shade. |
| **SC-09** | Language Localization | Hindi / Bengali request | Construction crew lead | Produces translated safety action card without altering numerical thresholds. |

---

## 3. Evaluation Metrics

1. **Safety Protocol Agreement:** 100% adherence to NIOSH / NDMA maximum work durations and minimum rest intervals.
2. **Emergency Escalation Latency:** < 50ms (deterministic client and backend triage).
3. **Hallucination Rate on Coordinates:** 0.0% (all cooling locations strictly retrieved from verified database).
4. **End-to-End Workflow Latency:** < 1.5s in local / demonstration mode; < 3.5s with live Amazon Bedrock inference.
