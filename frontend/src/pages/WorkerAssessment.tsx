import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../components/Layout';
import { api } from '../services/api';
import { 
  WorkSector, 
  WorkloadIntensity, 
  ShadeAccess, 
  WorkerAssessmentRequest 
} from '../types';

export const WorkerAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveAssessment, openEmergencyModal, environment } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [sector, setSector] = useState<WorkSector>('construction');
  const [workload, setWorkload] = useState<WorkloadIntensity>('heavy');
  const [shiftHours, setShiftHours] = useState<number>(7);
  const [peakHours, setPeakHours] = useState<boolean>(true);
  const [waterAccess, setWaterAccess] = useState<number>(0.75); // L/hr
  const [shadeAccess, setShadeAccess] = useState<ShadeAccess>('minimal');
  const [selectedGear, setSelectedGear] = useState<string[]>(['hard_hat', 'boots']);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [crewNotes, setCrewNotes] = useState<string>('Sealdah metro construction phase 2 trench work');

  // Dynamic Metabolic Calculations based on ISO 7243
  const getMetabolicRate = (w: WorkloadIntensity) => {
    switch (w) {
      case 'light': return { watts: 150, text: '~150 W / Light' };
      case 'moderate': return { watts: 280, text: '~280 W / Moderate' };
      case 'heavy': return { watts: 415, text: '~415 W / Heavy' };
      case 'very_heavy': return { watts: 520, text: '~520 W / Extreme' };
    }
  };

  const currentMetabolic = getMetabolicRate(workload);

  // Calculate live projected thermal risk
  const getProjectedRisk = () => {
    const hasEmergency = selectedSymptoms.some(s => ['confusion', 'no_sweat', 'vomiting', 'fainting'].includes(s));
    if (hasEmergency) return { level: 'Level 4 (CRITICAL)', color: 'text-error', bg: 'bg-error-container text-error' };
    if (workload === 'heavy' || workload === 'very_heavy' || shiftHours >= 6) {
      return { level: 'Level 4: Extreme Vulnerability', color: 'text-error', bg: 'bg-error-container text-error' };
    }
    if (workload === 'moderate') {
      return { level: 'Level 3: High Vulnerability', color: 'text-on-tertiary-container', bg: 'bg-tertiary-fixed text-on-tertiary-fixed' };
    }
    return { level: 'Level 2: Moderate Vulnerability', color: 'text-surface-tint', bg: 'bg-surface-container-high text-on-surface' };
  };

  const projectedRisk = getProjectedRisk();

  const toggleGear = (item: string) => {
    setSelectedGear(prev => 
      prev.includes(item) ? prev.filter(g => g !== item) : [...prev, item]
    );
  };

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: WorkerAssessmentRequest = {
      sector,
      workload,
      shift_duration_hours: Number(shiftHours),
      peak_hours_exposure: peakHours,
      water_access_liters_per_hr: Number(waterAccess),
      shade_access: shadeAccess,
      protective_gear: selectedGear,
      reported_symptoms: selectedSymptoms,
      notes: crewNotes,
      latitude: environment.latitude,
      longitude: environment.longitude,
    };

    try {
      const result = await api.submitAssessment(payload);
      setActiveAssessment(result);
      if (result.requires_emergency_escalation) {
        openEmergencyModal();
      }
      navigate('/safe-work-planner');
    } catch (err: any) {
      console.error('Assessment submission error:', err);
      setErrorMessage('Assessment processing failed. Please check your inputs or proceed with offline plan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-space-md lg:p-space-lg max-w-[1360px] mx-auto w-full flex flex-col gap-space-lg">
      {/* Header and Live Burden Pill */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-bold">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              NIOSH / ISO 7243 ALIGNED
            </span>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
              Form Ref: HSR-2026-WB
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
            Occupational Heat-Exposure Risk Assessment Wizard
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-3xl">
            Evaluate worker-specific heat vulnerability to generate personalized, evidence-based safety guidance. No medical diagnosis or sensitive PII required.
          </p>
        </div>

        {/* Live Calculated Burden Tag */}
        <div className="flex items-center gap-space-md p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              Projected Thermal Class
            </span>
            <span className={`font-headline-sm text-headline-sm font-bold flex items-center gap-1.5 ${projectedRisk.color}`}>
              <span className="material-symbols-outlined text-[20px]">warning</span>
              {projectedRisk.level}
            </span>
          </div>
          <div className="h-10 w-px bg-surface-variant"></div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              Est. Metabolic Rate
            </span>
            <span className="font-label-lg text-label-lg text-on-surface font-bold">
              {currentMetabolic.text}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Navigation Indicator */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-variant/40">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-sm">
          {[
            { step: 1, title: 'Profile & Sector' },
            { step: 2, title: 'Exposure & Intensity' },
            { step: 3, title: 'Hydration & Rest' },
            { step: 4, title: 'Environment & Gear' },
            { step: 5, title: 'Triage & Directives' },
          ].map(({ step, title }) => (
            <button
              key={step}
              type="button"
              onClick={() => setCurrentStep(step)}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all ${
                currentStep === step
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : currentStep > step
                  ? 'bg-surface-container text-on-surface'
                  : 'bg-surface-container-low text-secondary opacity-70'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-label-caps text-label-caps font-bold ${
                currentStep === step
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : currentStep > step
                  ? 'bg-surface-tint text-on-primary'
                  : 'bg-surface-container-high text-secondary'
              }`}>
                {currentStep > step ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  `0${step}`
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-caps text-label-caps uppercase opacity-80">
                  Step 0{step}
                </span>
                <span className="font-label-md text-label-md font-semibold truncate">
                  {title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-3 bg-error-container text-on-error-container rounded-lg flex items-center gap-2 text-body-sm">
          <span className="material-symbols-outlined text-[20px] text-error">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40">
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
          {/* STEP 1: Profile & Sector */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-space-md animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Step 1: Occupational Profile & Sector
                </h2>
                <p className="font-body-md text-body-md text-secondary">
                  Select the primary outdoor occupational role to calibrate baseline metabolic and exposure models.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md mt-2">
                {[
                  { id: 'construction', label: 'Construction Laborers', icon: 'engineering', desc: 'Heavy masonry, rebar fixing, excavation' },
                  { id: 'street_vendor', label: 'Street Vendors & Hawkers', icon: 'storefront', desc: 'Prolonged stationary solar exposure on asphalt' },
                  { id: 'delivery_courier', label: 'Delivery & Couriers', icon: 'two_wheeler', desc: 'Motorbike/cycle riding in high thermal zones' },
                  { id: 'daily_labor', label: 'Daily-Wage Outdoor Labor', icon: 'handyman', desc: 'Loading/unloading, cargo, seasonal manual work' },
                  { id: 'health_worker', label: 'Community Health Workers', icon: 'medical_services', desc: 'ASHA/civic door-to-door community patrols' },
                  { id: 'sanitation', label: 'Sanitation & Waste Workers', icon: 'cleaning_services', desc: 'Municipal street cleaning and waste sorting' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSector(item.id as WorkSector)}
                    className={`p-space-md rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      sector === item.id
                        ? 'border-primary bg-primary-container/10 ring-2 ring-primary/20 shadow-sm'
                        : 'border-surface-variant/60 bg-surface-container-lowest hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[28px] ${sector === item.id ? 'text-primary' : 'text-secondary'}`}>
                        {item.icon}
                      </span>
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">
                        {item.label}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-2 hover:bg-primary-container transition-all"
                >
                  Continue to Exposure & Intensity
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Exposure & Intensity */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-space-md animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Step 2: Exposure Duration & Workload Intensity
                </h2>
                <p className="font-body-md text-body-md text-secondary">
                  Physical workload directly determines internal metabolic heat production that must be dissipated.
                </p>
              </div>

              {/* Workload Radio Grid */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
                  Physical Workload Intensity (Metabolic Burden)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-sm">
                  {[
                    { id: 'light', label: 'Light (~150 W)', desc: 'Inspection, sitting, driving' },
                    { id: 'moderate', label: 'Moderate (~280 W)', desc: 'Vending, continuous walking' },
                    { id: 'heavy', label: 'Heavy (~415 W)', desc: 'Rebar fixing, masonry, shoveling' },
                    { id: 'very_heavy', label: 'Very Heavy (~520 W)', desc: 'Maximum manual excavation' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setWorkload(item.id as WorkloadIntensity)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        workload === item.id
                          ? 'border-primary bg-primary-container/15 font-semibold text-primary'
                          : 'border-surface-variant bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <p className="font-label-md text-label-md font-bold">{item.label}</p>
                      <p className="font-body-sm text-body-sm text-secondary mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shift Duration Slider */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
                    Total Outdoor Shift Duration
                  </label>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    {shiftHours} Hours
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  step="0.5"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-surface-variant rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-secondary font-label-caps">
                  <span>1 hr (Short)</span>
                  <span>4 hrs (Half shift)</span>
                  <span>8 hrs (Standard)</span>
                  <span>12+ hrs (Extended)</span>
                </div>
              </div>

              {/* Peak Hours Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-variant/40 mt-2">
                <input
                  type="checkbox"
                  id="peakHoursCheck"
                  checked={peakHours}
                  onChange={(e) => setPeakHours(e.target.checked)}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="peakHoursCheck" className="flex flex-col cursor-pointer">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Exposure During Solar Peak (11:30 – 15:30 IST)
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">
                    Direct ultraviolet and maximum thermal solar radiation occurs during this midday window.
                  </span>
                </label>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-variant transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-2 hover:bg-primary-container transition-all"
                >
                  Continue to Hydration & Rest
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Hydration & Rest */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-space-md animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Step 3: Hydration Supply & Shade Availability
                </h2>
                <p className="font-body-md text-body-md text-secondary">
                  Access to cool potable water and effective shade directly mitigates progressive core body heating.
                </p>
              </div>

              {/* Water Access Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
                    Drinking Water Supply Available Per Worker
                  </label>
                  <span className="font-headline-sm text-headline-sm text-surface-tint font-bold">
                    {waterAccess} Liters / hour
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.25"
                  value={waterAccess}
                  onChange={(e) => setWaterAccess(parseFloat(e.target.value))}
                  className="w-full accent-surface-tint h-2 bg-surface-variant rounded-lg cursor-pointer"
                />
                <span className="font-body-sm text-body-sm text-secondary">
                  {waterAccess < 0.75 
                    ? '⚠️ INSUFFICIENT for heavy labor under current heat index (NIOSH recommends min 1.0 L/hr).' 
                    : 'Adequate hydration supply available on site.'}
                </span>
              </div>

              {/* Shade Access */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
                  Shade & Cooling Break Facilities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-sm">
                  {[
                    { id: 'full', label: 'Full Access', desc: 'Air-conditioned room or solid canopy' },
                    { id: 'partial', label: 'Partial Access', desc: 'Tarpaulin, dense trees nearby' },
                    { id: 'minimal', label: 'Minimal', desc: 'Temporary shadow behind structures' },
                    { id: 'none', label: 'No Shade', desc: 'Continuous direct open solar exposure' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setShadeAccess(item.id as ShadeAccess)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        shadeAccess === item.id
                          ? 'border-primary bg-primary-container/15 font-semibold text-primary'
                          : 'border-surface-variant bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <p className="font-label-md text-label-md font-bold">{item.label}</p>
                      <p className="font-body-sm text-body-sm text-secondary mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-variant transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-2 hover:bg-primary-container transition-all"
                >
                  Continue to Environment & Gear
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Environment & Gear */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-space-md animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Step 4: Clothing, Protective Equipment & Site Context
                </h2>
                <p className="font-body-md text-body-md text-secondary">
                  Heavy synthetic PPE impairs sweating and traps convective heat next to the skin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-1">
                {[
                  { id: 'hard_hat', label: 'Hard Hat / Safety Helmet', desc: 'Traps heat at scalp; add neck flap if possible' },
                  { id: 'boots', label: 'Heavy Steel-Toe Leather Boots', desc: 'High thermal retention on asphalt' },
                  { id: 'reflective_vest', label: 'Synthetic High-Vis Vest', desc: 'Can restrict airflow if non-mesh' },
                  { id: 'full_sleeves', label: 'Heavy Cotton / Denim Clothes', desc: 'Provides sun protection but increases heat retention' },
                  { id: 'respirator', label: 'Dust Mask / Respirator', desc: 'Increases breathing resistance during exertion' },
                  { id: 'gloves', label: 'Heavy Rubber/Leather Gloves', desc: 'Impairs heat loss through palms' },
                ].map((gear) => (
                  <div
                    key={gear.id}
                    onClick={() => toggleGear(gear.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                      selectedGear.includes(gear.id)
                        ? 'border-primary bg-primary-container/15'
                        : 'border-surface-variant bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGear.includes(gear.id)}
                      readOnly
                      className="mt-0.5 w-4 h-4 accent-primary"
                    />
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold">{gear.label}</p>
                      <p className="font-body-sm text-body-sm text-secondary">{gear.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Site Notes */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">
                  Site Location & Microclimate Context Notes
                </label>
                <input
                  type="text"
                  value={crewNotes}
                  onChange={(e) => setCrewNotes(e.target.value)}
                  placeholder="e.g. Sealdah flyover construction site, Ward 48"
                  className="p-2.5 rounded-lg bg-surface-container-low border border-surface-variant text-on-surface font-body-md text-body-md"
                />
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-variant transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center gap-2 hover:bg-primary-container transition-all"
                >
                  Continue to Triage & Symptoms
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Triage & Synthesis */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-space-md animate-fade-in">
              <div className="flex flex-col gap-1">
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Step 5: Pre-Shift Health Check & Emergency Symptom Triage
                </h2>
                <p className="font-body-md text-body-md text-secondary">
                  Check if any worker in the crew currently exhibits signs of thermal strain.
                </p>
              </div>

              {/* Critical Warning Box */}
              <div className="p-space-md rounded-xl bg-error-container/60 text-on-error-container border border-error/40 flex items-start gap-3">
                <span className="material-symbols-outlined text-[24px] text-error flex-shrink-0">emergency</span>
                <div className="text-body-sm leading-relaxed">
                  <span className="font-bold uppercase text-error block">Emergency Escalation Rule:</span>
                  Selecting severe symptoms (confusion, vomiting, loss of consciousness, cessation of sweat) will trigger immediate 108 Ambulance protocol and halt regular algorithmic scoring.
                </div>
              </div>

              {/* Symptom Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-1">
                {[
                  { id: 'headache', label: 'Persistent Throbbing Headache', isSevere: false },
                  { id: 'dizziness', label: 'Lightheadedness / Dizziness', isSevere: false },
                  { id: 'heavy_sweat', label: 'Profuse / Continuous Sweating', isSevere: false },
                  { id: 'muscle_cramps', label: 'Painful Muscle Cramps in Legs/Arms', isSevere: false },
                  { id: 'nausea', label: 'Nausea or Stomach Upset', isSevere: false },
                  { id: 'confusion', label: '🚨 Mental Confusion / Slurred Speech', isSevere: true },
                  { id: 'no_sweat', label: '🚨 Hot, Dry Skin (Absence of Sweat)', isSevere: true },
                  { id: 'vomiting', label: '🚨 Projectile Vomiting or Seizures', isSevere: true },
                  { id: 'fainting', label: '🚨 Collapse or Loss of Consciousness', isSevere: true },
                ].map((symptom) => (
                  <div
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      selectedSymptoms.includes(symptom.id)
                        ? symptom.isSevere
                          ? 'border-error bg-error-container text-error font-bold'
                          : 'border-primary bg-primary-container/20 font-semibold text-primary'
                        : 'border-surface-variant bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <span className="font-label-md text-label-md">{symptom.label}</span>
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom.id)}
                      readOnly
                      className="w-4 h-4 accent-error"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-4 border-t border-surface-variant">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-variant transition-colors"
                >
                  Back to Step 4
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                      Running Strands Safety Engine...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                      Synthesize Assessment & Generate Safe Work Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
