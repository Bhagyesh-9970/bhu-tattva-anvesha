import React from 'react';
import { Database, Satellite, Radio, Globe, Layers } from 'lucide-react';

const datasetRegistry = [
  {
    name: 'Sentinel-1 SAR Backscatter',
    provider: 'ESA Copernicus',
    variables: 'VV, VH, VV/VH ratio',
    resolution: '10m spatial / 6-day revisit',
    status: 'INGESTION ADAPTER ACTIVE',
    type: 'Satellite Radar',
    icon: Satellite,
    color: 'text-cyan-400',
  },
  {
    name: 'Sentinel-2 MSI Optical',
    provider: 'ESA Copernicus',
    variables: 'NDVI, EVI, NDWI, Multi-spectral bands',
    resolution: '10m-20m spatial / 5-day revisit',
    status: 'INGESTION ADAPTER ACTIVE',
    type: 'Satellite Optical',
    icon: Satellite,
    color: 'text-emerald-400',
  },
  {
    name: 'ERA5 Reanalysis',
    provider: 'ECMWF',
    variables: 'Air Temp, Precip, Humidity, Wind, Radiation',
    resolution: '0.1° (~11km) / Hourly',
    status: 'INGESTION ADAPTER ACTIVE',
    type: 'Climate Model',
    icon: Globe,
    color: 'text-amber-400',
  },
  {
    name: 'SoilGrids 250m',
    provider: 'ISRIC World Soil Information',
    variables: 'Soil Organic Carbon, pH, Sand, Silt, Clay, Bulk Density',
    resolution: '250m spatial / Static depths',
    status: 'INGESTION ADAPTER ACTIVE',
    type: 'Soil Mapping',
    icon: Layers,
    color: 'text-amber-600',
  },
  {
    name: 'SMAP Soil Moisture',
    provider: 'NASA Jet Propulsion Laboratory',
    variables: 'Surface Soil Moisture (0-5cm)',
    resolution: '9km / 1-3 day revisit',
    status: 'MODULAR ADAPTER STUB',
    type: 'Satellite Microwave',
    icon: Radio,
    color: 'text-purple-400',
  },
  {
    name: 'Ground Sensor Telemetry',
    provider: 'Local Weather & Soil Stations',
    variables: 'Point Moisture, Station Temp, Water Gauge',
    resolution: 'Point / 15-min interval',
    status: 'ACTIVE TELEMETRY',
    type: 'In-Situ Sensors',
    icon: Database,
    color: 'text-blue-400',
  },
];

export const DataSourcesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-scientific-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <span>Multi-Source Dataset Registry</span>
        </h1>
        <p className="text-xs text-scientific-400 mt-1">
          Catalog of Earth Observation satellites, reanalysis climate grids, static soil maps, and ground station adapters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {datasetRegistry.map((ds) => {
          const Icon = ds.icon;
          return (
            <div
              key={ds.name}
              className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-scientific-800 text-scientific-300 rounded border border-scientific-700">
                    {ds.type}
                  </span>
                  <Icon className={`w-5 h-5 ${ds.color}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{ds.name}</h3>
                <p className="text-xs text-scientific-400">Provider: {ds.provider}</p>
                <div className="mt-3 pt-3 border-t border-scientific-800/80 text-xs space-y-1.5 font-mono">
                  <div>
                    <span className="text-scientific-400">Variables: </span>
                    <span className="text-scientific-200">{ds.variables}</span>
                  </div>
                  <div>
                    <span className="text-scientific-400">Resolution: </span>
                    <span className="text-scientific-200">{ds.resolution}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-scientific-800/60 flex items-center justify-between text-[11px]">
                <span className="text-scientific-400 font-mono">STATUS:</span>
                <span className="font-mono font-semibold text-emerald-400">{ds.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
