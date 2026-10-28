import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../components/Layout';
import { api } from '../services/api';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const { environment, setEnvironment, openEmergencyModal } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('Sync Feed');

  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    setSyncMessage('Syncing IMD...');
    try {
      const data = await api.getEnvironment(environment.latitude, environment.longitude);
      setEnvironment(data);
      setSyncMessage('Synced Now');
      setTimeout(() => setSyncMessage('Sync Feed'), 2500);
    } catch {
      setSyncMessage('Cached Sync');
      setTimeout(() => setSyncMessage('Sync Feed'), 2500);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Demonstration Mode Operational Banner */}
      <div className="px-space-md lg:px-space-lg py-space-md bg-surface-container-high/60 backdrop-blur-md border-b border-surface-variant/40">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center justify-center p-2 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed shadow-sm">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-tertiary-fixed-variant font-bold">
                  Demonstration Mode Active
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-on-tertiary-container animate-ping"></span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Calibrated sample meteorology for Central Kolkata (Sealdah – College St area), synchronized with simulated IMD microclimate thresholds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-space-sm flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps shadow-sm border border-surface-variant/40">
              Node: Kol-04 (Alipore Sync)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps shadow-sm border border-surface-variant/40">
              QA: {environment.quality_score}/100
            </span>
            <button
              onClick={handleRefreshFeed}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-all shadow-sm border border-surface-variant/50 cursor-pointer disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[16px] text-surface-tint ${isRefreshing ? 'animate-spin' : ''}`}>
                sync
              </span>
              {syncMessage}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="w-full max-w-[1440px] mx-auto px-space-md lg:px-space-lg py-space-lg flex flex-col gap-space-lg">
        {/* Title & Alert Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-8 rounded-full bg-primary-container"></span>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest font-bold">
                Operational Command Center
              </span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
              HeatShield Sentinel
            </h1>
            <p className="font-body-lg text-body-lg text-secondary">
              Heat-risk intelligence and deterministic safety planning for outdoor workforces.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
                Pre-monsoon Alert Band
              </span>
              <span className="font-label-lg text-label-lg text-error flex items-center justify-end gap-1 font-bold">
                <span className="material-symbols-outlined text-[18px]">severe_cold</span> Orange Warning (WB-03)
              </span>
            </div>
            <button
              onClick={() => navigate('/safe-work-planner')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-lg text-label-lg font-semibold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
              Review Action Directives
            </button>
          </div>
        </div>

        {/* Primary Observation & Telemetry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md lg:gap-space-lg items-stretch">
          {/* Main Weather Bento */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-space-md pb-space-sm border-b border-surface-variant/30">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-bold">
                  Surface Observation Point
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {environment.location_name}
                </h2>
                <span className="font-body-sm text-body-sm text-secondary">
                  Ward 48 (Sealdah – College St Corridor) · Kol-04 Micro-sensor · {environment.freshness_status}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps font-semibold">
                <span className="h-2 w-2 rounded-full bg-surface-tint animate-pulse"></span> Live Microclimate
              </span>
            </div>

            {/* 4 Metric Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md py-space-md my-space-xs rounded-xl bg-surface-container-low px-space-md">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
                  Air Temperature
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-metric-display text-metric-display text-primary leading-none font-bold">
                    {environment.temperature_c}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-secondary">°C</span>
                </div>
                <span className="font-body-sm text-body-sm text-secondary mt-1">Nominal ambient</span>
              </div>

              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
                  Heat Index (Est.)
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-metric-display text-metric-display text-error leading-none font-bold">
                    {environment.heat_index_c}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-error">°C</span>
                </div>
                <span className="font-label-caps text-label-caps text-error mt-1 font-bold">
                  EXTREME DANGER
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
                  Rel. Humidity
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-xl text-headline-xl text-primary leading-none font-bold">
                    {environment.relative_humidity_pct}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-secondary">%</span>
                </div>
                <span className="font-body-sm text-body-sm text-secondary mt-1">Vapor saturated</span>
              </div>

              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
                  Wet Bulb (WBGT)
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-tertiary-container leading-none font-bold">
                    {environment.wbgt_c}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-secondary">°C</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-tertiary-container mt-1 font-semibold">
                  High Threshold
                </span>
              </div>
            </div>

            {/* Quick Context Summary */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs text-body-sm text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-surface-tint">info</span>
                Non-diagnostic: External thermal conditions only; does not predict internal core body heat.
              </span>
              <button 
                onClick={() => navigate('/heat-risk-intelligence')}
                className="text-primary font-semibold hover:underline flex items-center gap-1"
              >
                Detailed Meteorological Telemetry
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Quick Action & Field Crew Status Card */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col justify-between gap-space-md">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
                <span className="font-label-caps text-label-caps text-secondary uppercase font-bold tracking-wider">
                  Field Workforce Triage
                </span>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-caps text-label-caps font-bold">
                  Level 4 High Risk
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2.5">
                <div className="p-3 rounded-lg bg-surface-container-low border border-surface-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[22px] text-primary">engineering</span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">Construction Sites (Sealdah)</p>
                      <p className="font-body-sm text-body-sm text-secondary">14 Active Crews · Heavy Workload</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps bg-error text-on-error px-2 py-0.5 rounded font-bold">
                    30/30 Rest
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low border border-surface-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[22px] text-primary">storefront</span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">Street Vendors (Bowbazar)</p>
                      <p className="font-body-sm text-body-sm text-secondary">~320 Hawkers · Moderate Workload</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps bg-on-tertiary-container text-white px-2 py-0.5 rounded font-bold">
                    45/15 Rest
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low border border-surface-variant/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[22px] text-primary">two_wheeler</span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">Delivery Couriers (Central)</p>
                      <p className="font-body-sm text-body-sm text-secondary">Continuous Traffic Exposure</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps bg-primary text-on-primary px-2 py-0.5 rounded font-bold">
                    Hydration Stop
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Assessment CTA */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/worker-assessment')}
                className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">assignment</span>
                Start Worker Exposure Assessment
              </button>
              <button
                onClick={openEmergencyModal}
                className="w-full py-2 px-4 rounded-lg bg-error-container hover:bg-error/20 text-error font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                Suspected Heatstroke? Call 108
              </button>
            </div>
          </div>
        </div>

        {/* Action Directives Banner (Scroll Target) */}
        <div id="actionPlanSection" className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
          <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-primary">verified_user</span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Operational Directives & Action Protocols
              </h3>
            </div>
            <span className="font-label-caps text-label-caps bg-surface-container px-2.5 py-1 rounded-full text-secondary font-semibold">
              Aligned with NDMA / NIOSH Guidelines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-variant/40 flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-error font-bold">Directive 01</span>
                <h4 className="font-label-lg text-label-lg text-on-surface font-bold mt-1">
                  Mandatory Work-Rest Scheduling
                </h4>
                <p className="font-body-sm text-body-sm text-secondary mt-1 leading-relaxed">
                  Heavy outdoor labor must enforce a strict 30-minute rest pause for every 30 minutes of continuous exertion under shade.
                </p>
              </div>
              <button 
                onClick={() => navigate('/safe-work-planner')}
                className="mt-3 text-primary font-semibold text-xs hover:underline flex items-center gap-1"
              >
                Open Shift Timeline Planner
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-variant/40 flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-surface-tint font-bold">Directive 02</span>
                <h4 className="font-label-lg text-label-lg text-on-surface font-bold mt-1">
                  Hydration & Electrolyte Quota
                </h4>
                <p className="font-body-sm text-body-sm text-secondary mt-1 leading-relaxed">
                  Provide at least 1 Liter of cool potable water per hour per laborer. Distribute Oral Rehydration Salts (ORS) during mid-shift rest intervals.
                </p>
              </div>
              <button 
                onClick={() => navigate('/cooling-resources')}
                className="mt-3 text-primary font-semibold text-xs hover:underline flex items-center gap-1"
              >
                Find Chilled Water Kiosks
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-variant/40 flex flex-col justify-between">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-on-tertiary-container font-bold">Directive 03</span>
                <h4 className="font-label-lg text-label-lg text-on-surface font-bold mt-1">
                  Buddy-System Surveillance
                </h4>
                <p className="font-body-sm text-body-sm text-secondary mt-1 leading-relaxed">
                  Never permit lone workers in direct sun. Pair laborers to observe subtle disorientation, headache, or unsteady gait before collapse occurs.
                </p>
              </div>
              <button 
                onClick={openEmergencyModal}
                className="mt-3 text-error font-semibold text-xs hover:underline flex items-center gap-1"
              >
                Review 108 Emergency Protocol
                <span className="material-symbols-outlined text-[14px]">emergency</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
