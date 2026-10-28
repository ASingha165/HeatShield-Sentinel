import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { EmergencyModal } from './EmergencyModal';
import { WorkerAssessmentResult, SafetyPlan, EnvironmentData } from '../types';
import { DEMO_ASSESSMENT, DEMO_SAFETY_PLAN, DEMO_ENVIRONMENT } from '../services/demoData';

interface AppContextType {
  currentLanguage: 'en' | 'bn' | 'hi';
  setLanguage: (lang: 'en' | 'bn' | 'hi') => void;
  activeAssessment: WorkerAssessmentResult;
  setActiveAssessment: (res: WorkerAssessmentResult) => void;
  activeSafetyPlan: SafetyPlan;
  setActiveSafetyPlan: (plan: SafetyPlan) => void;
  environment: EnvironmentData;
  setEnvironment: (env: EnvironmentData) => void;
  openEmergencyModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [currentLanguage, setLanguage] = useState<'en' | 'bn' | 'hi'>('en');
  const [activeAssessment, setActiveAssessment] = useState<WorkerAssessmentResult>(DEMO_ASSESSMENT);
  const [activeSafetyPlan, setActiveSafetyPlan] = useState<SafetyPlan>(DEMO_SAFETY_PLAN);
  const [environment, setEnvironment] = useState<EnvironmentData>(DEMO_ENVIRONMENT);

  return (
    <AppContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        activeAssessment,
        setActiveAssessment,
        activeSafetyPlan,
        setActiveSafetyPlan,
        environment,
        setEnvironment,
        openEmergencyModal: () => setEmergencyOpen(true),
      }}
    >
      <div className="min-h-screen bg-background font-sans text-on-surface antialiased flex">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
          {/* Top Header */}
          <Header
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenEmergency={() => setEmergencyOpen(true)}
            currentLanguage={currentLanguage}
            onLanguageChange={setLanguage}
          />

          {/* Page View Container */}
          <main className="flex-1 pt-16">
            <Outlet />
          </main>
        </div>

        {/* Life-Safety Emergency 108 Modal */}
        <EmergencyModal
          isOpen={emergencyOpen}
          onClose={() => setEmergencyOpen(false)}
        />
      </div>
    </AppContext.Provider>
  );
};
