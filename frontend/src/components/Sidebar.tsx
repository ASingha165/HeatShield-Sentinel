import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', label: 'Command Center', icon: 'grid_view' },
  { path: '/worker-assessment', label: 'Worker Assessment', icon: 'assignment' },
  { path: '/safe-work-planner', label: 'Safe Work Planner', icon: 'event_available' },
  { path: '/heat-risk-intelligence', label: 'Heat Risk Intelligence', icon: 'thermostat' },
  { path: '/cooling-resources', label: 'Cooling Resources', icon: 'water_drop' },
  { path: '/community-insights', label: 'Community Insights', icon: 'query_stats' },
  { path: '/about-the-system', label: 'About the System', icon: 'security' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between 
        shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="p-space-lg flex items-start justify-between gap-space-sm bg-surface-container-lowest border-b border-surface-variant/40">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold shadow-sm">
                <span className="material-symbols-outlined text-[22px] text-primary-fixed">shield_with_heart</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                  HeatShield
                </span>
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">
                  Sentinel · Social Good
                </span>
              </div>
            </div>
            {/* Close button on mobile */}
            <button 
              className="lg:hidden p-1 text-secondary hover:text-on-surface"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-xs px-space-md py-space-lg">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-label-lg text-label-lg transition-all
                  ${isActive 
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }
                `}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Demonstration Mode Badge Card */}
        <div className="p-space-md m-space-md bg-surface-container-lowest rounded-xl flex flex-col gap-space-xs border border-surface-variant/50 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase font-bold tracking-wider">
              Demonstration Mode
            </span>
            <span className="h-2 w-2 rounded-full bg-surface-tint animate-pulse"></span>
          </div>
          <div className="font-label-md text-label-md text-on-surface font-medium">
            Kolkata, WB Urban Sector
          </div>
          <div className="flex items-center justify-between pt-space-xs border-t border-surface-variant/30 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-caps text-label-caps bg-surface-container text-on-surface-variant">
              Node: Kol-04 Sync
            </span>
            <span className="font-label-caps text-label-caps text-surface-tint font-bold">
              Active 100%
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
