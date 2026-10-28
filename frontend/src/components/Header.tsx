import React, { useState } from 'react';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenEmergency: () => void;
  currentLanguage: 'en' | 'bn' | 'hi';
  onLanguageChange: (lang: 'en' | 'bn' | 'hi') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  onOpenEmergency,
  currentLanguage,
  onLanguageChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 px-space-md lg:px-space-lg flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-variant/40">
      {/* Left: Mobile Toggle & Location Telemetry Pill */}
      <div className="flex items-center gap-space-sm lg:gap-space-md">
        {/* Mobile Hamburger */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Location & IMD Sync Pill */}
        <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm border border-surface-variant/40">
          <span className="material-symbols-outlined text-[18px] text-surface-tint">location_on</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold truncate max-w-[240px] md:max-w-none">
            Kolkata, West Bengal (Barabazar / Sealdah Ward 48)
          </span>
          <span className="ml-1 hidden md:inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-label-caps bg-surface-container text-secondary">
            Live Weather API + IMD Alert Sync
          </span>
        </div>

        {/* Demo Mode Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps font-bold shadow-sm">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          <span className="hidden xs:inline">DEMO DATA ACTIVE</span>
        </div>
      </div>

      {/* Right: Language, Emergency 108, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-space-md">
        {/* Language Switcher */}
        <div className="flex items-center bg-surface-container-lowest rounded-lg p-0.5 font-label-caps text-label-caps text-secondary border border-surface-variant/40 shadow-sm">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded transition-colors ${
              currentLanguage === 'en'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'hover:text-on-surface'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('bn')}
            className={`px-2 py-1 rounded transition-colors ${
              currentLanguage === 'bn'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'hover:text-on-surface'
            }`}
          >
            বাংলা
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2 py-1 rounded transition-colors ${
              currentLanguage === 'hi'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'hover:text-on-surface'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Emergency 108 Protocol Button */}
        <button
          type="button"
          onClick={onOpenEmergency}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-error text-on-error font-label-md text-label-md font-bold hover:bg-error-container hover:text-on-error-container transition-all shadow-sm flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
          <span className="hidden sm:inline">Heat Illness Protocol 108</span>
          <span className="sm:hidden">108</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex items-center justify-center p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label-caps text-[9px] font-bold">
              1
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-variant p-space-md flex flex-col gap-2 z-50">
              <div className="flex items-center justify-between pb-1 border-b border-surface-variant">
                <span className="font-label-md text-label-md text-primary font-bold">Active Advisories</span>
                <span className="font-label-caps text-label-caps text-secondary">IMD Alert</span>
              </div>
              <div className="p-2 rounded-lg bg-error-container/40 text-on-error-container text-body-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0">severe_cold</span>
                <div>
                  <p className="font-semibold text-xs">Orange Heatwave Warning</p>
                  <p className="text-[11px] opacity-90">Peak heat index projected 51.2°C in Sealdah Ward 48 between 12:00–15:30 IST.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Name */}
        <div className="hidden md:flex items-center gap-space-sm pl-space-xs border-l border-surface-variant/40">
          <div className="flex flex-col text-right">
            <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold">
              Ananya Sen
            </span>
            <span className="font-label-caps text-label-caps text-secondary">
              Safety Field Lead
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container text-primary-fixed flex items-center justify-center font-bold text-xs ring-2 ring-primary-fixed/50">
            AS
          </div>
        </div>
      </div>
    </header>
  );
};
