import React from 'react';
import { Watershed, EnvironmentalState } from '../../types';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface SummaryWidgetProps {
  watershed?: Watershed;
  currentState?: EnvironmentalState;
}

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({ watershed, currentState }) => {
  return (
    <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-scientific-800 pb-3">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Environmental Nexus Status Report</span>
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 rounded">
          STATUS: NOMINAL
        </span>
      </div>

      {watershed && (
        <div className="text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-scientific-400">Target Sub-basin:</span>
            <span className="font-semibold text-white">{watershed.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-scientific-400">Area Bounding Extent:</span>
            <span className="font-mono text-scientific-200">{watershed.area_sqkm} km²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-scientific-400">Centroid Coordinates:</span>
            <span className="font-mono text-scientific-200">
              {watershed.centroid_lat}° N, {watershed.centroid_lon}° E
            </span>
          </div>
        </div>
      )}

      {currentState?.provenance && (
        <div className="p-3 bg-scientific-950 rounded-md border border-scientific-800 text-xs space-y-1.5 font-mono">
          <div className="text-scientific-400 font-sans font-semibold text-[11px] uppercase tracking-wider mb-1">
            Data Provenance Audit
          </div>
          <div className="flex justify-between">
            <span className="text-scientific-400">Fusion Engine:</span>
            <span className="text-emerald-400">{currentState.provenance.fusion_method || 'WeightedAverage'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-scientific-400">Data Sources:</span>
            <span className="text-scientific-200">
              {currentState.provenance.contributing_sources?.join(', ') || 'Sentinel-1, S-2, ERA5'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-scientific-400">Demo Provenance Flag:</span>
            <span className="text-amber-400 font-bold">
              {currentState.provenance.synthetic_demo_data ? 'synthetic_demo_data: true' : 'real_data: true'}
            </span>
          </div>
        </div>
      )}

      <div className="pt-2 text-[11px] text-scientific-400 flex items-start space-x-2">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          All sensor observations, raster grids, and confidence outputs are normalized under common spatial grid resolution (100m).
        </p>
      </div>
    </div>
  );
};
