import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../components/Layout';

export const SafeWorkPlanner: React.FC = () => {
  const navigate = useNavigate();
  const { activeAssessment, activeSafetyPlan, openEmergencyModal, currentLanguage } = useApp();
  const [copiedSms, setCopiedSms] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  const handleCopySms = () => {
    navigator.clipboard.writeText(activeSafetyPlan.formatted_sms_text);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 3000);
  };

  return (
    <div className="p-space-md lg:p-space-lg flex flex-col gap-space-lg max-w-[1440px] mx-auto w-full">
      {/* Screen Header & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary text-on-primary font-label-caps text-label-caps font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
              ACTIVE SAFETY PROTOCOL
            </span>
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              NDMA / WHO Compliant
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-background tracking-tight font-bold">
            Safe Work Operational Planner
          </h1>
          <p className="font-body-md text-body-md text-secondary max-w-3xl">
            Customized heat-mitigation schedule and practical safety protocols generated for:{' '}
            <span className="font-semibold text-on-background">{activeSafetyPlan.worker_title}</span>{' '}
            ({activeSafetyPlan.workload_summary}).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            type="button"
            onClick={handleCopySms}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-variant transition-colors shadow-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copiedSms ? 'done' : 'sms'}
            </span>
            {copiedSms ? 'SMS Copied!' : 'SMS Crew Lead'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-variant transition-colors shadow-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print Field Card
          </button>

          <button
            type="button"
            onClick={() => setShowPosterModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:opacity-90 transition-opacity shadow-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Bengali / Hindi Poster
          </button>
        </div>
      </div>

      {/* 1. Urgent Safety & Medical Protocol Alert (Prominent Top Banner) */}
      <div className="rounded-xl bg-error-container text-on-error-container p-space-md lg:p-space-lg shadow-md relative overflow-hidden border border-error/30">
        <div className="flex items-start gap-space-md relative z-10">
          <div className="p-2.5 rounded-lg bg-error text-on-error flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">emergency</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-label-lg text-label-lg font-bold uppercase tracking-wider text-error">
                CRITICAL SAFETY DIRECTIVE
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-error text-on-error font-label-caps text-label-caps font-bold">
                MANDATORY PROTOCOL
              </span>
            </div>
            <p className="font-body-md text-body-md leading-relaxed text-on-error-container font-medium">
              Heat exhaustion can progress rapidly to exertional heatstroke. If anyone experiences confusion, slurred speech, vomiting, or loss of consciousness:{' '}
              <span className="font-bold underline decoration-error">
                STOP WORK IMMEDIATELY, MOVE TO SHADE, INITIATE ACTIVE COOLING (water dousing), AND CALL 108 AMBULANCE.
              </span>{' '}
              Do not delay emergency care for algorithm re-assessment.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-error/10 to-transparent pointer-events-none"></div>
      </div>

      {/* 2. Context Snapshot Card & Ratios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Left Metric Snapshot */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-bold tracking-wider">
              Enforced Work-Rest Cycle
            </span>
            <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-variant/40 flex flex-col items-center text-center">
              <span className="font-metric-display text-metric-display text-primary font-bold leading-none">
                {activeAssessment.work_rest_ratio.split(' ')[0]}
              </span>
              <span className="font-label-lg text-label-lg text-secondary uppercase mt-1 font-semibold">
                Work Minutes / Rest Minutes
              </span>
              <span className="font-body-sm text-body-sm text-error font-bold mt-2 bg-error-container/60 px-3 py-1 rounded-full">
                {activeAssessment.work_rest_ratio}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-variant/30 flex flex-col gap-2">
            <div className="flex justify-between text-body-sm">
              <span className="text-secondary">Metabolic Burden:</span>
              <span className="font-bold text-on-surface">{activeAssessment.metabolic_rate_watts} Watts</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-secondary">Hydration Quota:</span>
              <span className="font-bold text-surface-tint">{activeAssessment.hydration_target_ml_per_hour} mL / hour</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-secondary">Form Ref ID:</span>
              <span className="font-mono text-xs text-secondary">{activeAssessment.assessment_id}</span>
            </div>
          </div>
        </div>

        {/* Right Directives List */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
              <span className="font-label-caps text-label-caps text-secondary uppercase font-bold tracking-wider">
                Mandatory Operational Protocols
              </span>
              <span className="font-label-caps text-label-caps bg-primary-container text-on-primary px-2.5 py-0.5 rounded-full font-bold">
                Field Enforced
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2.5">
              {activeAssessment.mandatory_protocols.map((protocol, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-surface-variant/30">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="font-body-md text-body-md text-on-surface leading-snug">
                    {protocol}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-variant/30 flex items-center justify-between">
            <span className="text-xs text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-surface-tint">verified</span>
              Cites NIOSH & NDMA Occupational Heatwave Guidelines
            </span>
            <button
              onClick={() => navigate('/worker-assessment')}
              className="text-primary font-semibold text-xs hover:underline"
            >
              Adjust Worker Context
            </button>
          </div>
        </div>
      </div>

      {/* 3. Chronological Shift Timeline */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">schedule</span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              Shift Work-Rest Timeline & Solar Progression
            </h2>
          </div>
          <span className="font-label-caps text-label-caps bg-surface-container px-2.5 py-1 rounded-full text-secondary font-semibold">
            Central Kolkata (IST)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {activeSafetyPlan.shift_timeline.map((slot, index) => {
            const isCritical = slot.status === 'CRITICAL_PAUSE';
            const isAdvisory = slot.status === 'ADVISORY';
            return (
              <div
                key={index}
                className={`p-space-md rounded-xl border flex flex-col justify-between transition-all ${
                  isCritical
                    ? 'border-error bg-error-container/30 ring-1 ring-error/40'
                    : isAdvisory
                    ? 'border-on-tertiary-container/30 bg-tertiary-fixed/20'
                    : 'border-surface-variant bg-surface-container-low'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      {slot.time_range}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-label-caps text-label-caps font-bold ${
                      isCritical
                        ? 'bg-error text-on-error'
                        : isAdvisory
                        ? 'bg-on-tertiary-container text-white'
                        : 'bg-primary-container text-on-primary'
                    }`}>
                      {slot.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-headline-lg text-headline-lg font-bold text-primary">
                      {slot.work_minutes}m
                    </span>
                    <span className="text-body-sm text-secondary">work /</span>
                    <span className="font-headline-lg text-headline-lg font-bold text-error">
                      {slot.rest_minutes}m
                    </span>
                    <span className="text-body-sm text-secondary">rest</span>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface mt-2 leading-relaxed">
                    {slot.guideline}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-surface-variant/40 flex items-center justify-between text-xs text-secondary font-label-caps">
                  <span>Slot #{index + 1}</span>
                  <span>{isCritical ? '🚨 No Direct Sun' : 'Shaded Rest'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Hydration & Nearby Cooling Shelters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Hydration Schedule */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-surface-variant/30">
              <span className="material-symbols-outlined text-[22px] text-surface-tint">water_drop</span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Hydration Protocol & Fluid Schedule
              </h3>
            </div>
            <div className="mt-3 flex flex-col gap-2.5">
              {activeSafetyPlan.hydration_schedule.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container-low border border-surface-variant/30">
                  <span className="material-symbols-outlined text-[18px] text-surface-tint">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-surface-container-high/60 text-body-sm text-secondary flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">tips_and_updates</span>
            <span>Do not rely on thirst alone. In high humidity (68% RH), sweat fails to evaporate and dehydration occurs silently.</span>
          </div>
        </div>

        {/* Nearby Cooling Shelters Routing */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-primary">location_on</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Routed Municipal Cooling Shelters
                </h3>
              </div>
              <button
                onClick={() => navigate('/cooling-resources')}
                className="text-primary font-semibold text-xs hover:underline"
              >
                View Full Map (6 Kiosks)
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-2.5">
              {activeSafetyPlan.nearby_cooling_shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="p-3 rounded-lg bg-surface-container-low border border-surface-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        {shelter.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full font-label-caps text-label-caps bg-primary-fixed text-on-primary-fixed font-bold">
                        {shelter.verification_status === 'VERIFIED_MUNICIPAL' ? 'Verified KMC' : 'Field Audited'}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-secondary">
                      {shelter.address} · {shelter.operating_hours}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      {shelter.distance_km} km
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${shelter.latitude},${shelter.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface"
                      title="Open in Maps"
                    >
                      <span className="material-symbols-outlined text-[18px]">directions</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-variant/30 flex justify-between items-center text-xs text-secondary">
            <span>Verified coordinates from Kolkata Municipal Corporation Registry</span>
            <button
              onClick={openEmergencyModal}
              className="text-error font-bold hover:underline flex items-center gap-1"
            >
              Ambulance Assistance: Call 108
            </button>
          </div>
        </div>
      </div>

      {/* Multilingual Poster Modal */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl shadow-2xl border border-surface-variant p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-2 border-b border-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-primary">picture_as_pdf</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Bengali / Hindi Field Safety Cards
                </h3>
              </div>
              <button
                onClick={() => setShowPosterModal(false)}
                className="p-1 rounded-lg text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {/* Bengali Card */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant flex flex-col gap-2">
                <span className="font-label-caps text-label-caps bg-primary-container text-on-primary px-2 py-0.5 rounded w-max">
                  বাংলা নির্দেশিকা (Bengali)
                </span>
                <h4 className="font-bold text-on-surface text-sm">তীব্র গরম ও লু সতর্কতা কার্ড</h4>
                <p className="text-xs text-secondary leading-relaxed">
                  ৩০ মিনিট কাজ / ৩০ মিনিট ছায়ায় বিশ্রাম। প্রতি ২০ মিনিটে ২৫০ মিলি জল পান করুন। মাথা ঘোরা বা বমি ভাব হলে অবিলম্বে ১০৮ নম্বরে ফোন করুন।
                </p>
                <button
                  onClick={() => window.print()}
                  className="mt-2 py-1.5 px-3 rounded-lg bg-surface-container-high hover:bg-surface-variant text-xs font-bold text-on-surface flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">print</span>
                  Print Bengali Card
                </button>
              </div>

              {/* Hindi Card */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant flex flex-col gap-2">
                <span className="font-label-caps text-label-caps bg-primary-container text-on-primary px-2 py-0.5 rounded w-max">
                  हिंदी निर्देशिका (Hindi)
                </span>
                <h4 className="font-bold text-on-surface text-sm">भीषण गर्मी एवं लू सुरक्षा कार्ड</h4>
                <p className="text-xs text-secondary leading-relaxed">
                  ३० मिनट कार्य / ३० मिनट छाया में विश्राम। प्रत्येक २० मिनट में ठंडा पानी या ओआरएस पिएं। चक्कर या बेहोशी होने पर तुरंत १०৮ पर कॉल करें।
                </p>
                <button
                  onClick={() => window.print()}
                  className="mt-2 py-1.5 px-3 rounded-lg bg-surface-container-high hover:bg-surface-variant text-xs font-bold text-on-surface flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">print</span>
                  Print Hindi Card
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPosterModal(false)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
