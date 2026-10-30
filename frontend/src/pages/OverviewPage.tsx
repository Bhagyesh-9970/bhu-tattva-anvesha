import React from 'react';
import { Watershed, EnvironmentalState, Sensor } from '../types';
import { MetricCard } from '../components/dashboard/MetricCard';
import { WatershedMap } from '../components/map/WatershedMap';
import { SummaryWidget } from '../components/dashboard/SummaryWidget';
import { useArea } from '../context/AreaContext';
import { 
  Droplets, 
  Trees, 
  CloudRain, 
  Thermometer, 
  ArrowRight,
  Database,
  MapPin,
  RefreshCw,
  Sparkles,
  Activity,
  Layers
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
  const { selectedArea, resetToFullWatershed, loading } = useArea();

  // Compute active values based on selected area vs default watershed state
  const soilMoistureVal = selectedArea
    ? selectedArea.soil_moisture.toFixed(1)
    : (latestState?.soil_moisture ?? '28.4');

  const ndviVal = selectedArea
    ? selectedArea.ndvi.toFixed(3)
    : (latestState?.ndvi ?? '0.682');

  const precipVal = selectedArea
    ? selectedArea.precipitation_mm.toFixed(1)
    : (latestState?.precipitation_mm ?? '12.4');

  const tempVal = selectedArea
    ? selectedArea.temperature_c.toFixed(1)
    : (latestState?.temperature_c ?? '27.8');

  const organicCarbonVal = selectedArea
    ? selectedArea.soil_organic_carbon.toFixed(2)
    : '1.24';

  const phVal = selectedArea
    ? selectedArea.soil_ph.toFixed(1)
    : '6.8';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Minimalistic Interactive Selected Area Hero Banner */}
      <div className="bg-gradient-to-r from-scientific-900 via-scientific-950 to-scientific-900 border border-scientific-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800/80 uppercase">
                ISRO Bhuvan Spatial Grid • 10m
              </span>
              {selectedArea && selectedArea.zone_id !== 'entire_watershed' && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded-full border border-cyan-800 animate-pulse">
                  Custom Parcel Filtered
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>{selectedArea ? selectedArea.zone_name : 'Kabini Sub-basin Nexus'}</span>
            </h1>
            <p className="text-xs text-scientific-300 max-w-2xl">
              {selectedArea 
                ? `Dynamic localized telemetry computed for ${selectedArea.area_sqkm} km² (${selectedArea.area_ha.toLocaleString()} hectares) across ${selectedArea.active_sensors_count} in-situ FDR sensors.`
                : 'Integrating satellite earth observation (Sentinel-1/2, SMAP) and ground IoT networks into a unified 3D continuous monitoring nexus.'}
            </p>
          </div>

          {/* Quick Stats / Action Pill */}
          <div className="flex items-center space-x-3 shrink-0">
            {selectedArea && selectedArea.zone_id !== 'entire_watershed' ? (
              <button
                onClick={() => resetToFullWatershed()}
                className="px-3 py-1.5 bg-scientific-800 hover:bg-scientific-700 text-cyan-300 hover:text-white rounded-lg text-xs font-mono font-semibold flex items-center space-x-1.5 border border-scientific-700 transition-all shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Reset to Basin</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-scientific-800/80 border border-scientific-700 rounded-lg text-xs font-mono text-scientific-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>1,240 km² Full Basin</span>
              </div>
            )}

            <Link
              to="/digital-twin"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Twin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Environmental Metric Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Soil Moisture"
          value={soilMoistureVal}
          unit="%"
          subtitle="Topsoil Layer (0-10cm)"
          icon={Droplets}
          colorClass="text-cyan-400"
          confidence={latestState?.overall_confidence ?? 0.91}
        />
        <MetricCard
          title="Vegetation (NDVI)"
          value={ndviVal}
          subtitle="Sentinel-2 Canopy"
          icon={Trees}
          colorClass="text-emerald-400"
          confidence={latestState?.overall_confidence ?? 0.89}
        />
        <MetricCard
          title="24h Precipitation"
          value={precipVal}
          unit="mm"
          subtitle="ERA5 / Local Inflow"
          icon={CloudRain}
          colorClass="text-blue-400"
        />
        <MetricCard
          title="Surface Temp"
          value={tempVal}
          unit="°C"
          subtitle="Micro-climate Sensor"
          icon={Thermometer}
          colorClass="text-amber-400"
        />
        <MetricCard
          title="Soil Org. Carbon"
          value={organicCarbonVal}
          unit="%"
          subtitle="SOC Density"
          icon={Sparkles}
          colorClass="text-purple-400"
        />
        <MetricCard
          title="Soil Reaction"
          value={phVal}
          unit="pH"
          subtitle="Subsurface Acidity"
          icon={Activity}
          colorClass="text-teal-400"
        />
      </div>

      {/* Interactive Map & Concise Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <span className="text-white font-bold flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Geospatial Land Parcel Explorer</span>
            </span>
            <Link
              to="/map"
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold"
            >
              <span>Fullscreen GIS</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {/* Interactive Map with parcel selection */}
          <WatershedMap watershed={watershed} sensors={sensors} height="430px" />
        </div>

        <div className="space-y-4">
          <SummaryWidget watershed={watershed} currentState={latestState} />
        </div>
      </div>
    </div>
  );
};
