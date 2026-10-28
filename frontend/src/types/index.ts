export type RiskTier = 'NORMAL' | 'CAUTION' | 'EXTREME_CAUTION' | 'DANGER' | 'EXTREME_DANGER';

export type WorkSector = 
  | 'construction' 
  | 'street_vendor' 
  | 'delivery_courier' 
  | 'daily_labor' 
  | 'health_worker' 
  | 'sanitation';

export type WorkloadIntensity = 'light' | 'moderate' | 'heavy' | 'very_heavy';

export type ShadeAccess = 'full' | 'partial' | 'minimal' | 'none';

export type VerificationStatus = 'VERIFIED_MUNICIPAL' | 'FIELD_AUDITED' | 'DEMO_RECORD';

export interface EnvironmentData {
  temperature_c: number;
  relative_humidity_pct: number;
  heat_index_c: number;
  wbgt_c: number;
  dew_point_c: number;
  wind_speed_kmh: number;
  solar_radiation_wm2: number;
  uv_index: number;
  observed_at: string;
  source: string;
  location_name: string;
  latitude: number;
  longitude: number;
  is_demo: boolean;
  freshness_status: string;
  quality_score: number;
  alert_band: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
}

export interface WorkerAssessmentRequest {
  sector: WorkSector;
  workload: WorkloadIntensity;
  shift_duration_hours: number;
  peak_hours_exposure: boolean;
  water_access_liters_per_hr: number;
  shade_access: ShadeAccess;
  protective_gear: string[];
  reported_symptoms: string[];
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface WorkerAssessmentResult {
  assessment_id: string;
  risk_tier: RiskTier;
  risk_score: number; // 0-100
  thermal_class: string;
  metabolic_rate_watts: number;
  metabolic_category: string;
  environmental_summary: {
    ambient_temp_c: number;
    heat_index_c: number;
    wbgt_c: number;
    humidity_pct: number;
  };
  work_rest_ratio: string;
  max_continuous_work_minutes: number;
  min_rest_minutes: number;
  hydration_target_ml_per_hour: number;
  critical_safety_directive: string;
  mandatory_protocols: string[];
  suggested_precautions: string[];
  requires_emergency_escalation: boolean;
  emergency_action_steps?: string[];
  limitations: string[];
  sources_cited: string[];
  created_at: string;
  is_demo: boolean;
}

export interface ShiftTimelineSlot {
  time_range: string;
  status: 'SAFE' | 'ADVISORY' | 'CRITICAL_PAUSE';
  work_minutes: number;
  rest_minutes: number;
  guideline: string;
}

export interface SafetyPlan {
  plan_id: string;
  assessment_id: string;
  worker_title: string;
  workload_summary: string;
  shift_timeline: ShiftTimelineSlot[];
  work_rest_ratio: string;
  hydration_schedule: string[];
  nearby_cooling_shelters: CoolingResource[];
  emergency_protocol: {
    phone: string;
    action_directives: string[];
  };
  formatted_sms_text: string;
  generated_at: string;
  is_demo: boolean;
}

export interface CoolingResource {
  id: string;
  name: string;
  category: 'water_kiosk' | 'cooling_center' | 'shaded_canopy' | 'community_hub';
  address: string;
  ward: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
  verification_status: VerificationStatus;
  last_verified: string;
  operating_hours: string;
  has_chilled_water: boolean;
  is_air_conditioned: boolean;
  capacity: string;
  contact_phone?: string;
}

export interface SystemStatus {
  service: string;
  version: string;
  status: 'healthy' | 'degraded' | 'offline';
  demo_mode: boolean;
  aws_configured: boolean;
  bedrock_model: string;
  weather_provider: string;
  resource_count: number;
}
