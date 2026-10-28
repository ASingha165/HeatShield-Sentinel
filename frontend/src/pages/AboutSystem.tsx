import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SystemStatus } from '../types';

export const AboutSystem: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoadingStatus(true);
      try {
        const s = await api.getStatus();
        setStatus(s);
      } catch (err) {
        console.warn('Status fetch error:', err);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="px-space-md lg:px-margin-desktop py-space-lg flex flex-col gap-space-lg max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-space-xs max-w-3xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            AWS STRANDS AGENTS SOCIAL GOOD HACKATHON 2026
          </span>
          <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">
            Oct 28 – Nov 4, 2026
          </span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
          About HeatShield Sentinel
        </h1>
        <p className="font-body-lg text-body-lg text-secondary">
          An AI-powered occupational climate-resilience architecture protecting outdoor laborers through deterministic safety guardrails, meso-climatic telemetry, and verified cooling resources.
        </p>
      </div>

      {/* System Status Telemetry Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-surface-tint">dns</span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              System Readiness & Telemetry Status
            </h2>
          </div>
          <span className="font-label-caps text-label-caps bg-surface-container px-2.5 py-1 rounded-full text-secondary font-semibold">
            {loadingStatus ? 'Checking Backend...' : 'Status Audited'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md pt-2">
          <div className="p-3 rounded-lg bg-surface-container-low border border-surface-variant/30">
            <span className="text-xs font-label-caps text-secondary uppercase font-semibold">Service Health</span>
            <p className="text-base font-bold text-primary mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
              {status?.status === 'healthy' ? 'Operational 100%' : 'Resilient Demo Mode'}
            </p>
            <span className="text-xs text-secondary">FastAPI + Python 3.12</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low border border-surface-variant/30">
            <span className="text-xs font-label-caps text-secondary uppercase font-semibold">AI Multi-Agent Harness</span>
            <p className="text-base font-bold text-primary mt-1">AWS Strands Agents SDK</p>
            <span className="text-xs text-secondary">4 Coordinated Agents</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low border border-surface-variant/30">
            <span className="text-xs font-label-caps text-secondary uppercase font-semibold">Amazon Bedrock Model</span>
            <p className="text-base font-bold text-on-tertiary-container mt-1">
              {status?.bedrock_model || 'Claude 3 Haiku / Local'}
            </p>
            <span className="text-xs text-secondary">Graceful Deterministic Fallback</span>
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low border border-surface-variant/30">
            <span className="text-xs font-label-caps text-secondary uppercase font-semibold">Verified Cooling Network</span>
            <p className="text-base font-bold text-surface-tint mt-1">
              {status?.resource_count || 6} Municipal Hubs
            </p>
            <span className="text-xs text-secondary">Kolkata Municipal Corp. Registry</span>
          </div>
        </div>
      </div>

      {/* 4 Agent Harness Explanation */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
        <div className="pb-2 border-b border-surface-variant/30">
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
            AWS Strands Multi-Agent Architecture
          </h2>
          <p className="text-body-sm text-secondary">
            Rather than relying on an unconstrained single prompt, HeatShield Sentinel separates concerns into four specialized agents with explicit tool boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">A</span>
              <h3 className="font-bold text-primary text-base">Environmental Risk Agent</h3>
            </div>
            <p className="text-body-sm text-secondary leading-relaxed">
              Ingests raw meteorological observations (dry bulb, humidity, solar radiation) and evaluates Steadman Heat Index and estimated WBGT (ISO 7243). Rejects contradictory or stale sensor feeds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">B</span>
              <h3 className="font-bold text-primary text-base">Worker Context & Safety Agent</h3>
            </div>
            <p className="text-body-sm text-secondary leading-relaxed">
              Considers work duration, metabolic workload (Watts), water access, and clothing to synthesize practical work-rest cycles aligned with NIOSH/NDMA occupational thresholds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">C</span>
              <h3 className="font-bold text-primary text-base">Community Resource Agent</h3>
            </div>
            <p className="text-body-sm text-secondary leading-relaxed">
              Performs spatial proximity queries against verified municipal registries. Guarantees zero fabricated cooling center coordinates or fake emergency contact numbers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">D</span>
              <h3 className="font-bold text-primary text-base">Verification & Safety Guard Agent</h3>
            </div>
            <p className="text-body-sm text-secondary leading-relaxed">
              Critiques generated outputs against strict invariants: enforces minimum shaded rest when WBGT exceeds safe limits and triggers immediate 108 Ambulance protocol if severe symptoms are reported.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Responsible AI Directives */}
      <div className="bg-error-container/30 rounded-xl p-space-md lg:p-space-lg shadow-sm border border-error/30 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-error">
          <span className="material-symbols-outlined text-[24px]">shield</span>
          <h3 className="font-headline-sm text-headline-sm font-bold uppercase tracking-wider">
            Responsible AI & Non-Diagnostic Notice
          </h3>
        </div>
        <p className="text-body-md text-on-error-container leading-relaxed font-medium">
          HeatShield Sentinel is strictly an occupational decision-support and planning platform. It does not provide medical diagnoses or predict core body temperature. In any instance where an individual shows signs of heat exhaustion or heatstroke (confusion, cessation of sweating, collapse, slurred speech), on-site leads must bypass automated tools and immediately contact <strong>108 Ambulance Emergency Services</strong>.
        </p>
      </div>
    </div>
  );
};
