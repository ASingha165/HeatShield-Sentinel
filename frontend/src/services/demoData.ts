import { 
  EnvironmentData, 
  CoolingResource, 
  WorkerAssessmentResult, 
  SafetyPlan 
} from '../types';

export const DEMO_ENVIRONMENT: EnvironmentData = {
  temperature_c: 39.4,
  relative_humidity_pct: 68,
  heat_index_c: 51.2,
  wbgt_c: 31.8,
  dew_point_c: 32.1,
  wind_speed_kmh: 14.2,
  solar_radiation_wm2: 890,
  uv_index: 10,
  observed_at: new Date().toISOString(),
  source: 'Alipore IMD Mesonet (Kol-04)',
  location_name: 'Kolkata, West Bengal (Barabazar / Sealdah Ward 48)',
  latitude: 22.5726,
  longitude: 88.3639,
  is_demo: true,
  freshness_status: 'Synchronized 12m ago',
  quality_score: 94,
  alert_band: 'ORANGE',
};

export const DEMO_RESOURCES: CoolingResource[] = [
  {
    id: 'kmc-refuge-01',
    name: 'Sealdah Station North Concourse Civic Refuge',
    category: 'cooling_center',
    address: 'Near Platform 1B, Sealdah Station Complex, Ward 48',
    ward: 'Ward 48',
    latitude: 22.5672,
    longitude: 88.3712,
    distance_km: 0.35,
    verification_status: 'VERIFIED_MUNICIPAL',
    last_verified: '2026-10-28 10:30 IST',
    operating_hours: '06:00 - 22:00 IST',
    has_chilled_water: true,
    is_air_conditioned: true,
    capacity: '80 persons (Bench seating + Misting zone)',
    contact_phone: '+91-33-2350-3535',
  },
  {
    id: 'kmc-kiosk-02',
    name: 'Bowbazar KMC Ward 48 Chilled Potable Kiosk',
    category: 'water_kiosk',
    address: 'BB Ganguly St & Amherst St Crossing, Bowbazar',
    ward: 'Ward 48',
    latitude: 22.5688,
    longitude: 88.3621,
    distance_km: 0.55,
    verification_status: 'VERIFIED_MUNICIPAL',
    last_verified: '2026-10-28 08:00 IST',
    operating_hours: '24 Hours Open',
    has_chilled_water: true,
    is_air_conditioned: false,
    capacity: 'High-Flow Dispenser (600 L/hr)',
  },
  {
    id: 'kmc-refuge-03',
    name: 'College Street Medical College Community Hall',
    category: 'cooling_center',
    address: '88 College St, Lalbazar / Bowbazar Sector',
    ward: 'Ward 44',
    latitude: 22.5744,
    longitude: 88.3601,
    distance_km: 0.85,
    verification_status: 'VERIFIED_MUNICIPAL',
    last_verified: '2026-10-27 16:45 IST',
    operating_hours: '08:00 - 20:00 IST',
    has_chilled_water: true,
    is_air_conditioned: true,
    capacity: '120 persons (First Aid & ORS available)',
    contact_phone: '+91-33-2255-1600',
  },
  {
    id: 'kmc-canopy-04',
    name: 'Moulali Youth Center Shaded Rest Canopy',
    category: 'shaded_canopy',
    address: 'Moulali Crossing near Entally Market',
    ward: 'Ward 53',
    latitude: 22.5592,
    longitude: 88.3685,
    distance_km: 1.1,
    verification_status: 'FIELD_AUDITED',
    last_verified: '2026-10-26 14:00 IST',
    operating_hours: '09:00 - 18:00 IST',
    has_chilled_water: true,
    is_air_conditioned: false,
    capacity: '40 outdoor workers (Industrial Fans + Ice Water Drum)',
  },
  {
    id: 'kmc-kiosk-05',
    name: 'Barabazar Cotton Street High-Volume RO Water Point',
    category: 'water_kiosk',
    address: '14 Cotton St, Cloth Merchant Quarter, Barabazar',
    ward: 'Ward 42',
    latitude: 22.5812,
    longitude: 88.3562,
    distance_km: 1.35,
    verification_status: 'VERIFIED_MUNICIPAL',
    last_verified: '2026-10-28 09:15 IST',
    operating_hours: '06:00 - 21:00 IST',
    has_chilled_water: true,
    is_air_conditioned: false,
    capacity: 'Continuous RO Dispenser (1,000 L/hr)',
  },
  {
    id: 'kmc-hub-06',
    name: 'Rajabazar Science College Shaded Pavilion',
    category: 'community_hub',
    address: '92 Acharya Prafulla Chandra Rd, Rajabazar',
    ward: 'Ward 37',
    latitude: 22.5778,
    longitude: 88.3745,
    distance_km: 1.45,
    verification_status: 'DEMO_RECORD',
    last_verified: '2026-10-25 11:00 IST',
    operating_hours: '09:00 - 17:00 IST',
    has_chilled_water: true,
    is_air_conditioned: false,
    capacity: '50 persons (Covered courtyard with trees)',
  }
];

export const DEMO_ASSESSMENT: WorkerAssessmentResult = {
  assessment_id: 'HSR-2026-WB-4809',
  risk_tier: 'EXTREME_DANGER',
  risk_score: 88,
  thermal_class: 'Level 4: Extreme Occupational Heat Stress',
  metabolic_rate_watts: 415,
  metabolic_category: 'Heavy Workload (Excavation / Steel Rebar / Masonry)',
  environmental_summary: {
    ambient_temp_c: 39.4,
    heat_index_c: 51.2,
    wbgt_c: 31.8,
    humidity_pct: 68,
  },
  work_rest_ratio: '30 min work / 30 min rest',
  max_continuous_work_minutes: 30,
  min_rest_minutes: 30,
  hydration_target_ml_per_hour: 1000,
  critical_safety_directive: 'MANDATORY IMMEDIATE WORK RE-SCHEDULING: Extreme wet-bulb ambient conditions (WBGT 31.8°C) combined with heavy metabolic rate (>400W) exceed human evaporative compensation thresholds.',
  mandatory_protocols: [
    'Enforce 30-minute shaded/cooled recovery interval after every 30 minutes of continuous exertion.',
    'Hydration minimum: 250 ml (1 glass) of cool water or oral rehydration solution (ORS) every 15-20 minutes.',
    'Buddy-system surveillance: Pair workers to observe early symptoms of heat exhaustion.',
    'Suspend direct sun exposure between 12:00 IST and 15:30 IST; reschedule heavy concrete/rebar pours to pre-dawn.'
  ],
  suggested_precautions: [
    'Douse cotton towels in chilled water around neck and head during breaks.',
    'Wear wide-brimmed shade covers over helmets; avoid dark-colored unventilated synthetic garments.',
    'Electrolyte replacement is required when sweating continuously beyond 2 hours.'
  ],
  requires_emergency_escalation: false,
  limitations: [
    'Calculated based on ambient micro-station observations; does not account for pre-existing cardiovascular conditions, medications, or dehydration levels.',
    'This is an occupational safety planning tool and NOT a medical diagnostic confirmation.'
  ],
  sources_cited: [
    'NIOSH Criteria for a Recommended Standard: Occupational Exposure to Heat (DHHS Pub. 2016-106)',
    'ISO 7243:2017 Hot Environments — Estimation of heat stress on working man based on WBGT',
    'NDMA National Guidelines for Preparation of Action Plan - Prevention and Management of Heat Wave'
  ],
  created_at: new Date().toISOString(),
  is_demo: true,
};

export const DEMO_SAFETY_PLAN: SafetyPlan = {
  plan_id: 'PLAN-KOL-2026-088',
  assessment_id: 'HSR-2026-WB-4809',
  worker_title: 'Construction Laborers (Crew of 12)',
  workload_summary: 'Heavy Workload (415W) · 7 hrs shift · Sealdah Urban Site',
  shift_timeline: [
    {
      time_range: '07:00 – 10:30 IST',
      status: 'SAFE',
      work_minutes: 50,
      rest_minutes: 10,
      guideline: 'Optimal morning window. Complete heavy aggregate movement and scaffolding.'
    },
    {
      time_range: '10:30 – 12:00 IST',
      status: 'ADVISORY',
      work_minutes: 40,
      rest_minutes: 20,
      guideline: 'Thermal load rising rapidly. Hydration check every 20 min. Rotate crew to covered areas.'
    },
    {
      time_range: '12:00 – 15:30 IST',
      status: 'CRITICAL_PAUSE',
      work_minutes: 25,
      rest_minutes: 35,
      guideline: 'PEAK HAZARD WINDOW (WBGT > 31.5°C). Suspend direct sun activity. Move crew to Sealdah Civic Refuge.'
    },
    {
      time_range: '15:30 – 18:00 IST',
      status: 'ADVISORY',
      work_minutes: 40,
      rest_minutes: 20,
      guideline: 'Evening transition. Ambient remains high (37°C) but solar radiation declines. Electrolyte rest.'
    }
  ],
  work_rest_ratio: '30 min work / 30 min rest (Peak: 25/35)',
  hydration_schedule: [
    '07:00 IST: 500 mL water intake before shift start',
    'Every 20 min during work: 250 mL cool water (1 full cup)',
    '12:00 IST: 300 mL ORS electrolyte solution during long break',
    'Post-shift: Minimum 750 mL fluid recovery'
  ],
  nearby_cooling_shelters: DEMO_RESOURCES.slice(0, 3),
  emergency_protocol: {
    phone: '108 (West Bengal Ambulance)',
    action_directives: [
      'Stop work immediately if confusion, collapse, or slurred speech occurs.',
      'Move patient to maximum shade or air-conditioned vehicle.',
      'Initiate rapid evaporative cooling with wet cloths and fanning.',
      'Call 108 immediately — do not wait for patient to recover on site.'
    ]
  },
  formatted_sms_text: 'HEATSHIELD ALERT [Ward 48 Central Kolkata]: Extreme Danger (WBGT 31.8C). Construction crew protocol: 30m work / 30m rest. Min 1L water/hr with ORS. Nearest AC shelter: Sealdah North Concourse (Platform 1B). Emergency heat illness: Call 108.',
  generated_at: new Date().toISOString(),
  is_demo: true
};
