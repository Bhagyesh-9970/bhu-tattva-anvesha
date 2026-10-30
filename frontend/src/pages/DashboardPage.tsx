import React from 'react';
import { EnvironmentalState } from '../types';
import { EnvironmentalCharts } from '../components/dashboard/EnvironmentalCharts';
import { useArea } from '../context/AreaContext';
import { Activity, MapPin, RefreshCw, Layers } from 'lucide-react';

interface DashboardPageProps {
  states: EnvironmentalState[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ states }) => {
  const { selectedArea, knownZones, selectZone, resetToFullWatershed, loading } = useArea();

  // If selectedArea has time_series, format them for EnvironmentalCharts
  const chartData: EnvironmentalState[] = (selectedArea?.time_series && selectedArea.time_series.length > 0)
    ? selectedArea.time_series.map((item, idx) => ({
        id: idx + 1,
        watershed_id: 1,
        timestamp: item.timestamp || new Date().toISOString(),
        soil_moisture: item.soil_moisture,
        ndvi: item.ndvi,
        precipitation_mm: item.precipitation_mm,
        temperature_c: item.temperature_c,
        overall_confidence: item.confidence || 0.92,
        uncertainty_score: 0.08,
        synthetic_demo_data: false,
        provenance: { source: 'SpatialAreaHarmonizer' },
      }))
    : states;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Controls Header */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold text-white tracking-wide">
              {selectedArea ? selectedArea.zone_name : 'Watershed Environmental Analytics'}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {selectedArea ? `${selectedArea.area_sqkm} km²` : 'Full Basin'}
            </span>
          </div>
          <p className="text-xs text-scientific-400 mt-0.5">
            14-Day Micro-Sensor Harmonization & High-Resolution Soil-Climate Dynamics
          </p>
        </div>

        {/* Quick Micro-Zone Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-scientific-400 text-[11px] hidden sm:inline mr-1">Zone Filter:</span>
          {knownZones.map((z) => {
            const isSelected = selectedArea?.zone_id === z.id;
            return (
              <button
                key={z.id}
                onClick={() => selectZone(z.id)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all font-semibold ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-400'
                    : 'bg-scientific-800 text-scientific-300 hover:bg-scientific-700 hover:text-white border border-scientific-700/60'
                }`}
              >
                {z.name}
              </button>
            );
          })}
          {selectedArea && selectedArea.zone_id !== 'entire_watershed' && (
            <button
              onClick={() => resetToFullWatershed()}
              className="px-2 py-1 bg-scientific-800 hover:bg-scientific-700 text-scientific-300 rounded text-[11px] border border-scientific-700"
              title="Reset"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <EnvironmentalCharts data={chartData} />
    </div>
  );
};

