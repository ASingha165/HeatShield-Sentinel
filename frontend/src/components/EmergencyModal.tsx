import React from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-surface-container-lowest max-w-xl w-full rounded-2xl shadow-2xl border-2 border-error overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-modal-title"
      >
        {/* Header Banner */}
        <div className="bg-error text-on-error p-space-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[28px] animate-bounce">e911_emergency</span>
            <div>
              <h2 id="emergency-modal-title" className="font-headline-sm text-headline-sm font-bold uppercase tracking-wide">
                Heat Illness Protocol 108
              </h2>
              <p className="text-body-sm opacity-90">West Bengal / National Emergency Ambulance Directive</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-on-error transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg flex flex-col gap-space-md">
          {/* Urgent Warning Callout */}
          <div className="p-space-md rounded-xl bg-error-container text-on-error-container border border-error/30 flex flex-col gap-1">
            <span className="font-label-caps text-label-caps uppercase text-error font-bold tracking-wider">
              Immediate Life-Safety Action Required
            </span>
            <p className="font-body-md text-body-md font-medium leading-relaxed">
              If an outdoor worker exhibits <span className="font-bold underline">confusion, loss of consciousness, cessation of sweating, slurred speech, or convulsions</span>, they are suffering from severe exertional heatstroke.
            </p>
          </div>

          {/* Action Steps */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-label-lg text-label-lg text-primary font-bold uppercase tracking-wider">
              On-Site First Responder Directives:
            </h3>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-surface-variant">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-xs">1</span>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">CALL 108 IMMEDIATELY</p>
                <p className="font-body-sm text-body-sm text-secondary">Dial 108 (State Ambulance) or 112 (National Emergency). State exact location: e.g., Sealdah North Concourse / Barabazar Ward 48.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-surface-variant">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-xs">2</span>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">MOVE TO IMMEDIATE SHADE OR AC</p>
                <p className="font-body-sm text-body-sm text-secondary">Relocate the individual away from asphalt, direct sunlight, and heat sources into the nearest air-conditioned facility or dense tree canopy.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-surface-variant">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-xs">3</span>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">AGGRESSIVE ACTIVE COOLING</p>
                <p className="font-body-sm text-body-sm text-secondary">Douse head, neck, and torso with cool water. Fan vigorously to stimulate evaporation. Apply ice packs to armpits, groin, and neck.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-surface-variant">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-error text-on-error flex items-center justify-center font-bold text-xs">4</span>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">NEVER FORCE FLUIDS ON UNCONSCIOUS PERSON</p>
                <p className="font-body-sm text-body-sm text-secondary">Do not attempt to force water or ORS if the person is disoriented or vomiting (aspiration risk). Keep airway clear.</p>
              </div>
            </div>
          </div>

          {/* Quick Call Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a 
              href="tel:108"
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-error hover:bg-error/90 text-on-error font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              CALL 108 AMBULANCE NOW
            </a>
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md font-semibold transition-colors"
            >
              Dismiss Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
