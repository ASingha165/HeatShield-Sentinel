import React, { useState } from 'react';

export const CommunityInsights: React.FC = () => {
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Ward,Vulnerability,WorkerPopulation,HeatIndexAvg,ActiveRefuges,WaterDispensedLitres\n" +
      "Ward 48 (Sealdah),Level 4 Extreme,2450,51.2,4,48000\n" +
      "Ward 42 (Barabazar),Level 4 Extreme,3100,50.8,5,56000\n" +
      "Ward 44 (College St),Level 3 High,1800,48.5,3,24000\n" +
      "Ward 53 (Bowbazar),Level 3 High,1400,47.9,3,20000\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "kmc_heat_vulnerability_ward_metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportedStatus('CSV Downloaded');
    setTimeout(() => setExportedStatus(null), 3000);
  };

  return (
    <div className="px-space-md lg:px-margin-desktop py-space-lg flex flex-col gap-space-lg max-w-[1440px] mx-auto w-full">
      {/* Top Context & Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs max-w-3xl">
          <div className="inline-flex items-center gap-space-xs">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-surface-tint"></span>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-bold">
              Screen 06 • Public Health Surveillance
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
            Community Heat Vulnerability & Safety Analytics
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Aggregate, privacy-preserving operational metrics for community health leads, labor unions, and municipal disaster management teams. Zero individual PII stored.
          </p>
        </div>

        {/* Action & Export Toolbar */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-space-xs px-3.5 py-2 bg-surface-container-high text-on-surface hover:bg-surface-variant font-label-md text-label-md rounded-lg transition-colors shadow-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">table_view</span>
            <span>{exportedStatus || 'Export CSV for Health Officer'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-space-xs px-3.5 py-2 bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md rounded-lg transition-colors shadow-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Weekly Climate Briefing (PDF)</span>
          </button>
        </div>
      </div>

      {/* Demonstration Banner */}
      <div className="flex items-center justify-between gap-space-md bg-tertiary-fixed/30 p-space-md rounded-xl shadow-sm border border-tertiary-fixed/40">
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed shrink-0 font-bold">
            <span className="material-symbols-outlined text-[20px]">science</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-label-lg text-label-lg text-primary font-bold">Demonstration Dashboard</span>
            <span className="hidden sm:inline text-secondary font-label-md">•</span>
            <span className="font-body-sm text-body-sm text-secondary">
              Aggregated simulated data across 14 municipal wards in Central and East Kolkata over the past 7 days. Zero PII transmitted.
            </span>
          </div>
        </div>
        <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full font-label-caps text-label-caps bg-surface-container-lowest text-secondary shadow-sm font-semibold">
          Synced with KMC Ward Health Registry
        </span>
      </div>

      {/* 5 High-Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Worker Assessments</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">assignment_turned_in</span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">1,842</span>
            <span className="text-surface-tint font-label-caps text-label-caps font-bold mt-1">↑ 24% this week</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Directives Issued</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">4,110</span>
            <span className="text-secondary font-label-caps text-label-caps mt-1">Active mitigations</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Hydration Dispatched</span>
            <span className="material-symbols-outlined text-surface-tint text-[20px]">water_drop</span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="font-headline-xl text-headline-xl text-surface-tint font-bold">148,000 L</span>
            <span className="text-surface-tint font-label-caps text-label-caps font-bold mt-1">KMC RO Kiosks</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">108 Emergency Triages</span>
            <span className="material-symbols-outlined text-error text-[20px]">emergency</span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="font-headline-xl text-headline-xl text-error font-bold">12</span>
            <span className="text-error font-label-caps text-label-caps font-bold mt-1">Ambulances called</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Cooling Refuge Visits</span>
            <span className="material-symbols-outlined text-primary text-[20px]">deck</span>
          </div>
          <div className="mt-2 flex flex-col">
            <span className="font-headline-xl text-headline-xl text-primary font-bold">8,390</span>
            <span className="text-secondary font-label-caps text-label-caps mt-1">Civic shelter check-ins</span>
          </div>
        </div>
      </div>

      {/* Ward-by-Ward Vulnerability Grid Table */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-lg shadow-sm border border-surface-variant/40 flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-2 border-b border-surface-variant/30">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Central Kolkata Municipal Ward Vulnerability Matrix
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">
              Correlated heat stress index, estimated outdoor laborer density, and cooling infrastructure coverage.
            </p>
          </div>
          <span className="font-label-caps text-label-caps bg-surface-container px-2.5 py-1 rounded-full text-secondary font-bold">
            Ward Cluster 42–53
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant text-secondary font-label-caps text-label-caps uppercase">
                <th className="py-3 px-4">Municipal Ward</th>
                <th className="py-3 px-4">Thermal Vulnerability</th>
                <th className="py-3 px-4">Outdoor Labor Pop.</th>
                <th className="py-3 px-4">Peak Heat Index</th>
                <th className="py-3 px-4">Cooling Kiosks</th>
                <th className="py-3 px-4">Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/30 text-body-md text-on-surface">
              {[
                { ward: 'Ward 48 (Sealdah)', level: 'Extreme Danger (Level 4)', pop: '2,450 workers', hi: '51.2°C', kiosks: '4 Kiosks (2 AC)', status: 'Mandatory 30/30 Rest', alert: true },
                { ward: 'Ward 42 (Barabazar)', level: 'Extreme Danger (Level 4)', pop: '3,100 workers', hi: '50.8°C', kiosks: '5 Kiosks (1 AC)', status: 'Hydration Dispatched', alert: true },
                { ward: 'Ward 44 (College St)', level: 'High Caution (Level 3)', pop: '1,800 workers', hi: '48.5°C', kiosks: '3 Kiosks (1 AC)', status: 'Shaded Canopy Ready', alert: false },
                { ward: 'Ward 53 (Bowbazar)', level: 'High Caution (Level 3)', pop: '1,400 workers', hi: '47.9°C', kiosks: '3 Kiosks (0 AC)', status: 'Misting Fans Active', alert: false },
                { ward: 'Ward 37 (Rajabazar)', level: 'Caution (Level 2)', pop: '1,950 workers', hi: '46.4°C', kiosks: '2 Kiosks (0 AC)', status: 'Monitoring Active', alert: false },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-4 font-bold text-primary">{row.ward}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-bold ${
                      row.alert ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                    }`}>
                      {row.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-secondary">{row.pop}</td>
                  <td className="py-3.5 px-4 font-bold text-error">{row.hi}</td>
                  <td className="py-3.5 px-4 text-secondary">{row.kiosks}</td>
                  <td className="py-3.5 px-4 font-semibold text-primary">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
