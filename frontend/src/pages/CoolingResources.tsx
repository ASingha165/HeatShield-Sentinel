import React, { useState, useEffect } from 'react';
import { CoolingResource } from '../types';
import { api } from '../services/api';
import { DEMO_RESOURCES } from '../services/demoData';

export const CoolingResources: React.FC = () => {
  const [resources, setResources] = useState<CoolingResource[]>(DEMO_RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [radiusFilter, setRadiusFilter] = useState<number>(3.0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await api.getResources(22.5726, 88.3639, radiusFilter);
        setResources(data);
      } catch (err) {
        console.warn('Failed to fetch remote resources, using local registry:', err);
        setResources(DEMO_RESOURCES);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [radiusFilter]);

  const filteredResources = resources.filter((res) => {
    const matchesSearch = 
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.ward.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      categoryFilter === 'ALL' || res.category === categoryFilter;

    const matchesVerification = 
      verificationFilter === 'ALL' || res.verification_status === verificationFilter;

    return matchesSearch && matchesCategory && matchesVerification;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Operational Sub-Header Bar */}
      <div className="px-space-md lg:px-margin-desktop py-space-lg bg-surface-container-low flex flex-col md:flex-row md:items-end justify-between gap-space-md shadow-sm border-b border-surface-variant/40">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-surface-tint animate-pulse"></span>
              WARD 48–52 SECTOR SURVEILLANCE
            </span>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">
              KMC Urban Relief Grid
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Verified Community Cooling & Hydration Network
          </h1>
          <p className="font-body-md text-body-md text-secondary max-w-3xl">
            Real-time municipal inventory of verified chilled drinking water kiosks, air-conditioned civic refuges, and shaded rest canopies across Central Kolkata.
          </p>
        </div>

        {/* Live Telemetry Quick Counter Pill */}
        <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-sm border border-surface-variant/40 self-start md:self-auto">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Active Refuges</span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">18 / 19 Live</span>
          </div>
          <div className="w-px h-8 bg-surface-variant"></div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Hydration Volume</span>
            <span className="font-headline-sm text-headline-sm text-surface-tint font-bold">4,200 L/hr</span>
          </div>
        </div>
      </div>

      {/* Search, Category Filters & Spatial Controls */}
      <div className="px-space-md lg:px-margin-desktop py-space-md bg-surface-container flex flex-col gap-space-sm shadow-sm z-10 border-b border-surface-variant/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm items-center">
          {/* Search Field */}
          <div className="lg:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-secondary pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by neighborhood, landmark, or ward (e.g. Sealdah, College St, Bowbazar)..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface placeholder:text-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container border border-surface-variant/40"
            />
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-2 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-3 py-2.5 rounded-lg shadow-sm focus:outline-none cursor-pointer pr-8 border border-surface-variant/40"
            >
              <option value="ALL">All Categories</option>
              <option value="water_kiosk">Chilled Water Kiosks</option>
              <option value="cooling_center">AC Civic Refuges</option>
              <option value="shaded_canopy">Shaded Canopies</option>
              <option value="community_hub">Community Pavilions</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-secondary pointer-events-none">
              filter_list
            </span>
          </div>

          {/* Verification Dropdown */}
          <div className="lg:col-span-2 relative">
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-3 py-2.5 rounded-lg shadow-sm focus:outline-none cursor-pointer pr-8 border border-surface-variant/40"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED_MUNICIPAL">KMC Verified (100%)</option>
              <option value="FIELD_AUDITED">Field Audited</option>
              <option value="DEMO_RECORD">Demo Record</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-secondary pointer-events-none">
              verified
            </span>
          </div>

          {/* Radius Filter */}
          <div className="lg:col-span-2 relative">
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(parseFloat(e.target.value))}
              className="w-full appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md px-3 py-2.5 rounded-lg shadow-sm focus:outline-none cursor-pointer pr-8 border border-surface-variant/40"
            >
              <option value="1.0">Walking: ≤ 1.0 km</option>
              <option value="2.0">Walking: ≤ 2.0 km</option>
              <option value="5.0">Sector: ≤ 5.0 km</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-secondary pointer-events-none">
              near_me
            </span>
          </div>
        </div>
      </div>

      {/* Directory Resource Grid */}
      <div className="p-space-md lg:p-margin-desktop max-w-[1440px] mx-auto w-full flex flex-col gap-space-md">
        {loading && (
          <div className="flex items-center justify-center p-8 text-secondary">
            <span className="material-symbols-outlined text-[24px] animate-spin mr-2">progress_activity</span>
            Loading verified cooling coordinates...
          </div>
        )}

        {!loading && filteredResources.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-surface-variant/40 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[40px] text-secondary">location_off</span>
            <p className="font-headline-sm text-headline-sm text-primary font-bold">No Verified Shelters Found</p>
            <p className="font-body-md text-body-md text-secondary max-w-md">
              No facilities match your search criteria within this walking radius. Please widen your search or seek improvised shade.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setCategoryFilter('ALL'); setVerificationFilter('ALL'); }}
              className="mt-2 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {filteredResources.map((res) => {
            const isVerified = res.verification_status === 'VERIFIED_MUNICIPAL';
            const isAudited = res.verification_status === 'FIELD_AUDITED';

            return (
              <div
                key={res.id}
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40 flex flex-col justify-between hover:translate-y-[-2px] transition-all"
              >
                <div>
                  {/* Card Header & Verification Status Badge */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-surface-variant/30">
                    <span className="font-label-caps text-label-caps uppercase font-bold text-secondary">
                      {res.ward}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-caps text-label-caps font-bold ${
                      isVerified
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : isAudited
                        ? 'bg-surface-container-high text-on-surface'
                        : 'bg-tertiary-fixed text-on-tertiary-fixed'
                    }`}>
                      <span className="material-symbols-outlined text-[13px]">
                        {isVerified ? 'verified' : isAudited ? 'check_circle' : 'science'}
                      </span>
                      {isVerified ? 'KMC Verified' : isAudited ? 'Field Audited' : 'Demo Record'}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div className="mt-3 flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-primary-container text-primary-fixed flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">
                        {res.category === 'water_kiosk'
                          ? 'water_drop'
                          : res.category === 'cooling_center'
                          ? 'mode_fan'
                          : 'deck'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                        {res.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                        {res.address}
                      </p>
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {res.has_chilled_water && (
                      <span className="px-2 py-0.5 rounded-md bg-surface-container-low text-surface-tint font-label-caps text-label-caps font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">ac_unit</span> Chilled Water
                      </span>
                    )}
                    {res.is_air_conditioned && (
                      <span className="px-2 py-0.5 rounded-md bg-surface-container-low text-primary font-label-caps text-label-caps font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">mode_fan</span> Air Conditioned
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-secondary font-label-caps text-label-caps">
                      {res.capacity}
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-surface-variant/30 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-primary">{res.distance_km} km away</span>
                    <span className="text-[11px] text-secondary">{res.operating_hours}</span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${res.latitude},${res.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">directions</span>
                    Directions
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
