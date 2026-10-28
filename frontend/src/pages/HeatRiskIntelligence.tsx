import React from 'react';
import { useApp } from '../components/Layout';

export const HeatRiskIntelligence: React.FC = () => {
  const { environment } = useApp();

  return (
    <div className="p-space-md lg:p-space-lg max-w-7xl mx-auto w-full flex flex-col gap-space-lg">
      {/* Breadcrumb & Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-bold">
              Scientific Telemetry
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps text-primary uppercase font-bold">
              Meso-Climatic Microzone #04
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
            Heat Risk Intelligence & Meteorological Analysis
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            In-depth multi-variable thermal stress modeling, observational time-series, and environmental hazard attribution for Greater Kolkata.
          </p>
        </div>

        {/* Station Telemetry Pill Container */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-variant/40 flex flex-col gap-1.5 min-w-[280px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-tint"></span>
              <span className="font-label-md text-label-md text-primary font-bold">
                {environment.source}
              </span>
            </div>
            <span className="font-label-caps text-label-caps bg-surface-container px-2 py-0.5 rounded-full text-secondary font-bold">
              QA {environment.quality_score}/100
            </span>
          </div>
          <div className="flex items-center justify-between font-body-sm text-body-sm text-secondary">
            <span>Obs: {environment.freshness_status}</span>
            <span className="flex items-center gap-1 font-label-caps text-label-caps text-on-surface font-semibold">
              <span className="material-symbols-outlined text-[14px] text-surface-tint">sync</span> Run: Live Sync
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-surface-tint h-full w-[94%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Multi-Metric Environmental Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md">
        {/* Dry Bulb Card */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              Dry Bulb Temp
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">thermostat</span>
          </div>
          <div className="my-2">
            <div className="font-metric-display text-headline-xl text-primary font-bold">
              {environment.temperature_c}<span className="font-headline-sm text-headline-sm text-secondary ml-0.5">°C</span>
            </div>
            <span className="font-label-caps text-label-caps text-error bg-error-container/50 px-1.5 py-0.5 rounded font-bold">
              +3.2°C above seasonal
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-secondary">Convective ambient thermal load</div>
        </div>

        {/* Relative Humidity */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              Relative Humidity
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">humidity_high</span>
          </div>
          <div className="my-2">
            <div className="font-metric-display text-headline-xl text-primary font-bold">
              {environment.relative_humidity_pct}<span className="font-headline-sm text-headline-sm text-secondary ml-0.5">%</span>
            </div>
            <span className="font-label-caps text-label-caps text-secondary bg-surface-container px-1.5 py-0.5 rounded font-bold">
              Dew Point: {environment.dew_point_c}°C
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-secondary">Bay of Bengal maritime plume</div>
        </div>

        {/* Heat Index */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              Heat Index (Est.)
            </span>
            <span className="material-symbols-outlined text-error text-[20px]">warning</span>
          </div>
          <div className="my-2">
            <div className="font-metric-display text-headline-xl text-error font-bold">
              {environment.heat_index_c}<span className="font-headline-sm text-headline-sm text-error ml-0.5">°C</span>
            </div>
            <span className="font-label-caps text-label-caps text-error bg-error-container/60 px-1.5 py-0.5 rounded font-bold">
              EXTREME DANGER
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-secondary">NOAA Steadman Formulation</div>
        </div>

        {/* WBGT */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              Wet Bulb (WBGT)
            </span>
            <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">device_thermostat</span>
          </div>
          <div className="my-2">
            <div className="font-metric-display text-headline-xl text-on-tertiary-container font-bold">
              {environment.wbgt_c}<span className="font-headline-sm text-headline-sm text-on-tertiary-container ml-0.5">°C</span>
            </div>
            <span className="font-label-caps text-label-caps text-on-tertiary-fixed bg-tertiary-fixed px-1.5 py-0.5 rounded font-bold">
              ISO 7243 High Limit
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-secondary">Evaporative cooling constraint</div>
        </div>

        {/* Wind Speed */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              Surface Wind
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">air</span>
          </div>
          <div className="my-2">
            <div className="font-metric-display text-headline-xl text-primary font-bold">
              {environment.wind_speed_kmh}<span className="font-headline-sm text-headline-sm text-secondary ml-0.5">km/h</span>
            </div>
            <span className="font-label-caps text-label-caps text-surface-tint bg-primary-fixed px-1.5 py-0.5 rounded font-bold">
              SSE Plume
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-secondary">Boundary layer ventilation</div>
        </div>

        {/* Solar Irradiance */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between hover:translate-y-[-2px] transition-all">
          <div className="flex items-start justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
              Solar Radiation
            </span>
            <span className="material-symbols-outlined text-secondary text-[20px]">wb_sunny</span>
          </div>
          <div className="my-2">
            <div className="font-metric-display text-headline-xl text-primary font-bold">
              {environment.solar_radiation_wm2}<span className="font-headline-sm text-headline-sm text-secondary ml-0.5">W/m²</span>
            </div>
            <span className="font-label-caps text-label-caps text-error bg-error-container/40 px-1.5 py-0.5 rounded font-bold">
              UV Index: {environment.uv_index}
            </span>
          </div>
          <div className="font-body-sm text-body-sm text-secondary">Direct shortwave thermal load</div>
        </div>
      </div>

      {/* Diurnal Thermal Stress Curve / Hourly Heatwave Progression */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-variant/30">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Hourly Bioclimatic Progression (06:00 – 20:00 IST)
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">
              Observed & forecast progression across Central Kolkata Urban Heat Island.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-label-caps">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-error"></span> Heat Index (°C)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary"></span> Ambient Temp (°C)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-surface-tint"></span> WBGT (°C)
            </span>
          </div>
        </div>

        {/* Visual Progression Bars */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {[
            { time: '06:00', temp: 29.8, hi: 35.2, wbgt: 26.5, label: 'Morning' },
            { time: '09:00', temp: 34.2, hi: 42.1, wbgt: 28.8, label: 'Rising' },
            { time: '12:00', temp: 38.8, hi: 49.5, wbgt: 31.2, label: 'Danger' },
            { time: '14:00', temp: 39.4, hi: 51.2, wbgt: 31.8, label: 'PEAK' },
            { time: '16:00', temp: 38.1, hi: 48.0, wbgt: 30.5, label: 'Advisory' },
            { time: '18:00', temp: 35.6, hi: 44.2, wbgt: 29.1, label: 'Sunset' },
            { time: '20:00', temp: 33.0, hi: 40.5, wbgt: 27.9, label: 'Nocturnal' },
          ].map((bar, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 p-2 rounded-lg bg-surface-container-low border border-surface-variant/30">
              <span className="font-label-caps text-label-caps text-secondary font-bold">{bar.time}</span>
              <div className="w-full flex flex-col gap-1 my-1">
                <div 
                  className="bg-error rounded-t text-[10px] text-white font-bold text-center py-1"
                  style={{ height: `${(bar.hi / 55) * 60}px` }}
                >
                  {bar.hi}°
                </div>
                <div 
                  className="bg-primary/80 text-[10px] text-white font-bold text-center py-0.5"
                  style={{ height: `${(bar.temp / 55) * 45}px` }}
                >
                  {bar.temp}°
                </div>
                <div 
                  className="bg-surface-tint/90 rounded-b text-[10px] text-white font-bold text-center py-0.5"
                  style={{ height: `${(bar.wbgt / 55) * 35}px` }}
                >
                  {bar.wbgt}°
                </div>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                bar.label === 'PEAK' ? 'bg-error text-on-error' : 'bg-surface-container text-secondary'
              }`}>
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Scientific Boundary: Biophysical Heat Strain vs Environmental Hazard */}
      <div className="rounded-xl p-space-md lg:p-space-lg bg-surface-container-high/40 border border-surface-variant/50 flex flex-col gap-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-primary">biotech</span>
          <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
            Scientific Methodology & Non-Diagnostic Boundary
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md text-body-md text-on-surface">
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-surface-variant/40">
            <h4 className="font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-surface-tint">check_circle</span>
              What This Meteorological Model Captures
            </h4>
            <p className="text-secondary text-sm mt-1 leading-relaxed">
              Ambient dry bulb temperature, relative humidity from maritime air masses, estimated wet-bulb globe temperature (ISO 7243), and solar radiation. These define the external thermal stress placed on human thermoregulation.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-lowest border border-surface-variant/40">
            <h4 className="font-bold text-error flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-error">cancel</span>
              What Weather Data Cannot Capture
            </h4>
            <p className="text-secondary text-sm mt-1 leading-relaxed">
              Individual core body temperature, cardiovascular reserve, hydration status, acclimatization state, or prescription medication side effects. Consequently, HeatShield Sentinel never claims to medically clear a worker.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
