import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './pages/OverviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { ResearchPage } from './pages/ResearchPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { FusionVisualizer } from './components/fusion/FusionVisualizer';
import { DigitalTwin3DCanvas } from './components/digital_twin/DigitalTwin3DCanvas';
import { ScenarioSimulator } from './components/scenarios/ScenarioSimulator';
import { GraphExplorer } from './components/knowledge_graph/GraphExplorer';
import { AIChatInterface } from './components/assistant/AIChatInterface';
import { fetchHealth, fetchWatersheds, fetchSensors, fetchEnvironmentalStates } from './services/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 mins
    },
  },
});

const MainRoutes: React.FC = () => {
  const { data: health } = useQuery({ queryKey: ['health'], queryFn: fetchHealth });
  const { data: watersheds } = useQuery({ queryKey: ['watersheds'], queryFn: fetchWatersheds });
  const activeWatershed = watersheds && watersheds.length > 0 ? watersheds[0] : undefined;

  const { data: sensors } = useQuery({
    queryKey: ['sensors', activeWatershed?.id],
    queryFn: () => fetchSensors(activeWatershed?.id),
    enabled: !!activeWatershed,
  });

  const { data: states } = useQuery({
    queryKey: ['states', activeWatershed?.id],
    queryFn: () => fetchEnvironmentalStates(activeWatershed?.id, 30),
    enabled: !!activeWatershed,
  });

  const latestState = states && states.length > 0 ? states[0] : undefined;

  return (
    <Layout health={health} activeWatershed={activeWatershed}>
      <Routes>
        <Route
          path="/"
          element={
            <OverviewPage
              watershed={activeWatershed}
              sensors={sensors || []}
              latestState={latestState}
            />
          }
        />
        <Route path="/dashboard" element={<DashboardPage states={states || []} />} />
        <Route
          path="/map"
          element={<MapPage watershed={activeWatershed} sensors={sensors || []} />}
        />
        <Route path="/fusion" element={<FusionVisualizer />} />
        <Route path="/digital-twin" element={<DigitalTwin3DCanvas height="600px" />} />
        <Route path="/scenarios" element={<ScenarioSimulator />} />
        <Route path="/knowledge-graph" element={<GraphExplorer />} />
        <Route path="/assistant" element={<AIChatInterface />} />
        <Route path="/data-sources" element={<DataSourcesPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <MainRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
