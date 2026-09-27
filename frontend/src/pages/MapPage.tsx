import React from 'react';
import { Watershed, Sensor } from '../types';
import { WatershedMap } from '../components/map/WatershedMap';
import { MapPin, Info } from 'lucide-react';

interface MapPageProps {
  watershed?: Watershed;
  sensors?: Sensor[];
}

export const MapPage: React.FC<MapPageProps> = ({ watershed, sensors = [] }) => {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Interactive Geospatial GIS Map</span>
          </h1>
          <p className="text-xs text-scientific-400 mt-0.5">
            Spatial extent, ground sensor telemetry markers, and watershed polygon overlays.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-scientific-900 px-3 py-1.5 rounded-md border border-scientific-800">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-scientific-300">Spatial Grid: 100m Resolution (EPSG:4326)</span>
        </div>
      </div>

      <div className="flex-1 min-h-[550px]">
        <WatershedMap watershed={watershed} sensors={sensors} height="calc(100vh - 180px)" />
      </div>
    </div>
  );
};
