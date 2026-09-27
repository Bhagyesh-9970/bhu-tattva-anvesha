import React from 'react';
import { FileSpreadsheet, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const ResearchPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-scientific-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <FileSpreadsheet className="w-5 h-5 text-amber-400" />
          <span>Research Protocol & Model Evaluation Benchmarks</span>
        </h1>
        <p className="text-xs text-scientific-400 mt-1">
          Comparative baseline vs confidence-aware fusion metrics and scientific reproducibility protocol.
        </p>
      </div>

      {/* Scientific Principle Alert */}
      <div className="p-4 bg-amber-950/30 border border-amber-800/60 rounded-lg text-xs space-y-2">
        <div className="flex items-center space-x-2 text-amber-300 font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>IMPORTANT RESEARCH INTEGRITY DIRECTIVE</span>
        </div>
        <p className="text-amber-200/80 leading-relaxed">
          The prototype explicitly distinguishes synthetic demo outputs from empirical research metrics. All performance numbers below are labeled <span className="font-mono text-amber-400">[SYNTHETIC PROTOTYPE BASELINE]</span> until experimental datasets undergo offline cross-validation in Phase 16.
        </p>
      </div>

      {/* Model Benchmark Table */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-white">
          Soil Moisture Sensor Fusion Model Benchmarking (Kabini Pilot Watershed)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left text-scientific-300">
            <thead className="bg-scientific-800 text-white uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3">Model Architecture</th>
                <th className="p-3">Data Sources</th>
                <th className="p-3">MAE (%)</th>
                <th className="p-3">RMSE (%)</th>
                <th className="p-3">R² Score</th>
                <th className="p-3">Uncertainty Metrics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-scientific-800">
              <tr className="hover:bg-scientific-800/50">
                <td className="p-3 font-bold text-white">Stage A: Single-Source Baseline</td>
                <td className="p-3">Sentinel-1 Radar SAR</td>
                <td className="p-3 text-amber-300">4.12</td>
                <td className="p-3 text-amber-300">5.48</td>
                <td className="p-3 text-amber-300">0.642</td>
                <td className="p-3 text-scientific-400">N/A</td>
              </tr>
              <tr className="hover:bg-scientific-800/50">
                <td className="p-3 font-bold text-white">Stage B: Simple Average Fusion</td>
                <td className="p-3">S1 + S2 + ERA5 + Ground</td>
                <td className="p-3 text-cyan-300">3.25</td>
                <td className="p-3 text-cyan-300">4.10</td>
                <td className="p-3 text-cyan-300">0.751</td>
                <td className="p-3 text-scientific-400">Fixed StdDev</td>
              </tr>
              <tr className="hover:bg-scientific-800/50">
                <td className="p-3 font-bold text-white">Stage C: Inverse-Variance Weighted</td>
                <td className="p-3">S1 + S2 + ERA5 + Ground</td>
                <td className="p-3 text-cyan-300">2.88</td>
                <td className="p-3 text-cyan-300">3.62</td>
                <td className="p-3 text-cyan-300">0.814</td>
                <td className="p-3 text-scientific-400">Weighted Variance</td>
              </tr>
              <tr className="hover:bg-scientific-800/50">
                <td className="p-3 font-bold text-white">Stage D: Random Forest Regressor</td>
                <td className="p-3">Multi-spectral + Backscatter</td>
                <td className="p-3 text-emerald-300">2.41</td>
                <td className="p-3 text-emerald-300">3.05</td>
                <td className="p-3 text-emerald-300">0.865</td>
                <td className="p-3 text-scientific-400">Trees Variance</td>
              </tr>
              <tr className="bg-emerald-950/40 border-l-4 border-emerald-400">
                <td className="p-3 font-bold text-emerald-300">Stage E: Confidence-Aware Fusion (Proposed)</td>
                <td className="p-3 text-emerald-300">Heterogeneous Multi-Sensor</td>
                <td className="p-3 font-bold text-emerald-400">1.85</td>
                <td className="p-3 font-bold text-emerald-400">2.32</td>
                <td className="p-3 font-bold text-emerald-400">0.918</td>
                <td className="p-3 font-bold text-emerald-400">Prediction Interval (95%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
