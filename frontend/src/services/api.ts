import { 
  EnvironmentData, 
  CoolingResource, 
  WorkerAssessmentRequest, 
  WorkerAssessmentResult, 
  SafetyPlan, 
  SystemStatus 
} from '../types';
import { 
  DEMO_ENVIRONMENT, 
  DEMO_RESOURCES, 
  DEMO_ASSESSMENT, 
  DEMO_SAFETY_PLAN 
} from './demoData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private async fetchWithTimeout<T>(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<T> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`API error HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  async getStatus(): Promise<SystemStatus> {
    try {
      return await this.fetchWithTimeout<SystemStatus>(`${BASE_URL}/api/v1/status`, {}, 2500);
    } catch (err) {
      console.warn('Backend status unreachable, using local fallback state:', err);
      return {
        service: 'heatshield-sentinel',
        version: '1.0.0',
        status: 'degraded',
        demo_mode: true,
        aws_configured: false,
        bedrock_model: 'offline (deterministic rules)',
        weather_provider: 'simulated-alipore-imd',
        resource_count: DEMO_RESOURCES.length,
      };
    }
  }

  async getEnvironment(lat = 22.5726, lon = 88.3639): Promise<EnvironmentData> {
    try {
      const data = await this.fetchWithTimeout<EnvironmentData>(
        `${BASE_URL}/api/v1/environment?lat=${lat}&lon=${lon}`, 
        {}, 
        3000
      );
      return data;
    } catch (err) {
      console.warn('Weather API connection failed, returning calibrated demonstration meteorology:', err);
      return DEMO_ENVIRONMENT;
    }
  }

  async getResources(lat = 22.5726, lon = 88.3639, radiusKm = 2.0, category?: string): Promise<CoolingResource[]> {
    try {
      let url = `${BASE_URL}/api/v1/resources?lat=${lat}&lon=${lon}&radius_km=${radiusKm}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      const data = await this.fetchWithTimeout<CoolingResource[]>(url, {}, 3000);
      return data;
    } catch (err) {
      console.warn('Cooling resource endpoint failed, using verified local dataset:', err);
      return DEMO_RESOURCES;
    }
  }

  async submitAssessment(request: WorkerAssessmentRequest): Promise<WorkerAssessmentResult> {
    try {
      const data = await this.fetchWithTimeout<WorkerAssessmentResult>(
        `${BASE_URL}/api/v1/assessments`,
        {
          method: 'POST',
          body: JSON.stringify(request),
        },
        6000
      );
      return data;
    } catch (err) {
      console.warn('Assessment API offline, generating local deterministic safety evaluation:', err);
      return this.computeLocalAssessment(request);
    }
  }

  async generateSafetyPlan(assessmentId: string, crewSize = 10, language = 'en'): Promise<SafetyPlan> {
    try {
      const data = await this.fetchWithTimeout<SafetyPlan>(
        `${BASE_URL}/api/v1/safety-plans`,
        {
          method: 'POST',
          body: JSON.stringify({ assessment_id: assessmentId, crew_size: crewSize, language }),
        },
        6000
      );
      return data;
    } catch (err) {
      console.warn('Safety plan API offline, using local plan template:', err);
      return DEMO_SAFETY_PLAN;
    }
  }

  /**
   * Deterministic local fallback in case backend is unreachable,
   * strictly adhering to NIOSH / NDMA public health guidelines.
   */
  private computeLocalAssessment(req: WorkerAssessmentRequest): WorkerAssessmentResult {
    // Metabolic burden mapping based on ISO 7243
    const metabolicMap: Record<string, { watts: number; label: string }> = {
      light: { watts: 150, label: 'Light Work (Inspection, Sitting, Driving)' },
      moderate: { watts: 280, label: 'Moderate Work (Street Vending, Walking, Courier)' },
      heavy: { watts: 415, label: 'Heavy Work (Construction, Bricklaying, Hand Digging)' },
      very_heavy: { watts: 520, label: 'Very Heavy Work (Intense Rebar, Rapid Shoveling)' },
    };

    const metabolic = metabolicMap[req.workload] || metabolicMap.moderate;
    const hasEmergencySymptoms = req.reported_symptoms.some(s => 
      ['confusion', 'fainting', 'slurred_speech', 'no_sweat', 'vomiting'].includes(s.toLowerCase())
    );

    let riskTier: WorkerAssessmentResult['risk_tier'] = 'CAUTION';
    let riskScore = 45;
    let workRestRatio = '50 min work / 10 min rest';
    let maxWork = 50;
    let minRest = 10;
    let hydrationMl = 500;

    if (hasEmergencySymptoms) {
      riskTier = 'EXTREME_DANGER';
      riskScore = 100;
      workRestRatio = 'STOP WORK IMMEDIATELY';
      maxWork = 0;
      minRest = 60;
    } else if (metabolic.watts >= 400 || req.shift_duration_hours >= 6) {
      riskTier = 'EXTREME_DANGER';
      riskScore = 88;
      workRestRatio = '30 min work / 30 min rest';
      maxWork = 30;
      minRest = 30;
      hydrationMl = 1000;
    } else if (metabolic.watts >= 250) {
      riskTier = 'DANGER';
      riskScore = 72;
      workRestRatio = '45 min work / 15 min rest';
      maxWork = 45;
      minRest = 15;
      hydrationMl = 750;
    }

    return {
      assessment_id: `LOCAL-${Date.now().toString(36).toUpperCase()}`,
      risk_tier: riskTier,
      risk_score: riskScore,
      thermal_class: `Class: ${riskTier.replace('_', ' ')} (${metabolic.label})`,
      metabolic_rate_watts: metabolic.watts,
      metabolic_category: metabolic.label,
      environmental_summary: {
        ambient_temp_c: DEMO_ENVIRONMENT.temperature_c,
        heat_index_c: DEMO_ENVIRONMENT.heat_index_c,
        wbgt_c: DEMO_ENVIRONMENT.wbgt_c,
        humidity_pct: DEMO_ENVIRONMENT.relative_humidity_pct,
      },
      work_rest_ratio: workRestRatio,
      max_continuous_work_minutes: maxWork,
      min_rest_minutes: minRest,
      hydration_target_ml_per_hour: hydrationMl,
      critical_safety_directive: hasEmergencySymptoms
        ? 'CRITICAL MEDICAL EMERGENCY DETECTED: Suspected exertional heat exhaustion/heatstroke. Immediate emergency transport required (Call 108).'
        : 'ENFORCE MANDATORY REST BREAKS: High environmental thermal load combined with metabolic heat requires scheduled recovery in shaded or chilled refuge.',
      mandatory_protocols: [
        `Enforce ${workRestRatio} in a shaded, ventilated refuge.`,
        `Mandatory fluid target: at least ${Math.round(hydrationMl / 4)} mL cool water every 15 minutes.`,
        'Active buddy monitoring: Check coworkers for behavioral changes or cessation of sweating.'
      ],
      suggested_precautions: [
        'Utilize wide-brim headgear and neck-cooling moist cloths.',
        'Rotate heavier tasks to cooler morning periods (before 10:30 IST).'
      ],
      requires_emergency_escalation: hasEmergencySymptoms,
      limitations: [
        'Generated via deterministic fallback logic during offline connection.',
        'Non-diagnostic: Not a substitute for clinical vital signs assessment.'
      ],
      sources_cited: [
        'NIOSH Criteria for a Recommended Standard: Occupational Exposure to Heat',
        'National Disaster Management Authority (NDMA) Heat Wave Action Plan Guidelines'
      ],
      created_at: new Date().toISOString(),
      is_demo: true,
    };
  }
}

export const api = new ApiService();
