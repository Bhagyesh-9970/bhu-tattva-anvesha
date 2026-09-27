import React from 'react';
import { Watershed, EnvironmentalState, Sensor } from '../types';
import { MetricCard } from '../components/dashboard/MetricCard';
import { WatershedMap } from '../components/map/WatershedMap';
import { SummaryWidget } from '../components/dashboard/SummaryWidget';
import { 
  Droplets, 
  Trees, 
  CloudRain, 
  Thermometer, 
  ShieldCheck, 
  ArrowRight,
  Database,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface OverviewPageProps {
  watershed?: Watershed;
  sensors?: Sensor[];
  latestState?: EnvironmentalState;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  watershed,
  sensors = [],
  latestState,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-scientific-900 to-scientific-950 border border-scientific-800 rounded-xl p-6 shadow-md">
        <div className="max-w-3xl">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800/60 inline-block mb-3">
            FINAL-YEAR RESEARCH PROTOTYPE — PHASE 1
          </span>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
            BHŪ-TATTVA-ANVEṢA (भू-तत्त्व-अन्वेष)
          </h1>
          <p className="text-sm text-scientific-300 leading-relaxed">
            An Intelligent 3D Soil and Environmental Nexus System: Integrating Digital Twins, Confidence-Aware Sensor Fusion, and Knowledge-Graph-Driven Decision Support for the Land–Water–Climate Continuum.
          </p>
        </div>
      </div>

      {/* Primary Environmental Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Soil Moisture"
          value={latestState?.soil_moisture ?? '28.4'}
          unit="%"
          subtitle="Topsoil Layer (0-10cm)"
          icon={Droplets}
          colorClass="text-cyan-400"
          confidence={latestState?.overall_confidence ?? 0.89}
        />
        <MetricCard
          title="Vegetation Index (NDVI)"
          value={latestState?.ndvi ?? '0.682'}
          subtitle="Sentinel-2 Derived"
          icon={Trees}
          colorClass="text-emerald-400"
          confidence={latestState?.overall_confidence ?? 0.89}
        />
        <MetricCard
          title="24h Precipitation"
          value={latestState?.precipitation_mm ?? '12.4'}
          unit="mm"
          subtitle="ERA5 / AWS Ingestion"
          icon={CloudRain}
          colorClass="text-blue-400"
        />
        <MetricCard
          title="Surface Temperature"
          value={latestState?.temperature_c ?? '27.8'}
          unit="°C"
          subtitle="Air Temperature Grid"
          icon={Thermometer}
          colorClass="text-amber-400"
        />
      </div>

      {/* Map & Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Pilot Watershed Geospatial Extent</span>
            </h2>
            <Link
              to="/map"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>Fullscreen Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <WatershedMap watershed={watershed} sensors={sensors} height="400px" />
        </div>

        <div className="space-y-4">
          <SummaryWidget watershed={watershed} currentState={latestState} />
          
          {/* System Capabilities Box */}
          <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-4 text-xs space-y-3">
            <h4 className="font-semibold text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>System Core Architecture</span>
            </h4>
            <ul className="space-y-2 text-scientific-300">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Multi-source Earth Observation Ingestion</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Confidence-Aware Multi-Sensor Fusion</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>Environmental Digital Twin (Soil-Water-Climate)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Knowledge Graph & Grounded RAG Assistant</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
