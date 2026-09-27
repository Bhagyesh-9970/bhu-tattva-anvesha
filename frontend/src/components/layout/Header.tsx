import React from 'react';
import { Activity, ShieldCheck, Database, Layers, Globe } from 'lucide-react';
import { HealthStatus, Watershed } from '../../types';

interface HeaderProps {
  health?: HealthStatus;
  activeWatershed?: Watershed;
}

export const Header: React.FC<HeaderProps> = ({ health, activeWatershed }) => {
  return (
    <header className="h-16 bg-scientific-900 border-b border-scientific-800 px-6 flex items-center justify-between shadow-md z-30">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-emerald-950 border border-emerald-700/60 rounded-lg">
          <Globe className="w-6 h-6 text-emerald-400 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center">
            BHŪ-TATTVA-ANVEṢA
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800 ml-3">
              ISRO Bhuvan Prototype Framework
            </span>
          </h1>
          <p className="text-xs text-scientific-400 hidden sm:block">
            Intelligent 3D Soil & Environmental Nexus System for the Land–Water–Climate Continuum
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        {/* Active Watershed Badge */}
        {activeWatershed && (
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-scientific-800 border border-scientific-700 rounded-full text-scientific-200 font-mono">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{activeWatershed.name}</span>
          </div>
        )}

        {/* Data Mode Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-950/40 border border-amber-700/50 rounded-full text-amber-300 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DATA_MODE: {health?.data_mode.toUpperCase() || 'MOCK'}</span>
        </div>

        {/* Health Status Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-700/50 rounded-full text-emerald-300 font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>API: {health?.status.toUpperCase() || 'ONLINE'}</span>
        </div>
      </div>
    </header>
  );
};
