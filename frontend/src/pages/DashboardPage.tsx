import React from 'react';
import { EnvironmentalState } from '../types';
import { EnvironmentalCharts } from '../components/dashboard/EnvironmentalCharts';
import { Activity, RefreshCw } from 'lucide-react';

interface DashboardPageProps {
  states: EnvironmentalState[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ states }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-scientific-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Environmental Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-scientific-400 mt-1">
            Time-Series Dynamics & Multi-Sensor Fused Environmental Indicators
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-scientific-400">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span>Real-time Buffer Active</span>
        </div>
      </div>

      <EnvironmentalCharts data={states} />
    </div>
  );
};
