import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CommandCenter } from './pages/CommandCenter';
import { WorkerAssessment } from './pages/WorkerAssessment';
import { SafeWorkPlanner } from './pages/SafeWorkPlanner';
import { HeatRiskIntelligence } from './pages/HeatRiskIntelligence';
import { CoolingResources } from './pages/CoolingResources';
import { CommunityInsights } from './pages/CommunityInsights';
import { AboutSystem } from './pages/AboutSystem';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CommandCenter />} />
          <Route path="command-center" element={<CommandCenter />} />
          <Route path="worker-assessment" element={<WorkerAssessment />} />
          <Route path="safe-work-planner" element={<SafeWorkPlanner />} />
          <Route path="heat-risk-intelligence" element={<HeatRiskIntelligence />} />
          <Route path="cooling-resources" element={<CoolingResources />} />
          <Route path="community-insights" element={<CommunityInsights />} />
          <Route path="about-the-system" element={<AboutSystem />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
