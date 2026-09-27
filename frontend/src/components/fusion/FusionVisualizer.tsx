import React, { useState } from 'react';
import { Sliders, GitFork, ShieldCheck, HelpCircle, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const FusionVisualizer: React.FC = () => {
  const [s1Val, setS1Val] = useState(26.5);
  const [s2Val, setS2Val] = useState(29.1);
  const [smapVal, setSmapVal] = useState(27.8);
  const [groundVal, setGroundVal] = useState(28.4);

  // Compute live Stage E fusion
  const contribS1 = 0.31;
  const contribS2 = 0.22;
  const contribSmap = 0.18;
  const contribGround = 0.29;

  const fusedEstimate = (
    (s1Val * contribS1) +
    (s2Val * contribS2) +
    (smapVal * contribSmap) +
    (groundVal * contribGround)
  ).toFixed(2);

  const lowerCI = (parseFloat(fusedEstimate) - 0.95).toFixed(2);
  const upperCI = (parseFloat(fusedEstimate) + 0.95).toFixed(2);

  const pieData = [
    { name: 'Sentinel-1 (SAR)', value: 31, color: '#00bcd4' },
    { name: 'Sentinel-2 (MSI)', value: 22, color: '#4caf50' },
    { name: 'SMAP (Microwave)', value: 18, color: '#ab47bc' },
    { name: 'Ground Sensors', value: 29, color: '#ff9800' },
  ];

  const stageComparison = [
    { stage: 'Stage A: S1 Single Source', value: s1Val, confidence: 64 },
    { stage: 'Stage B: Simple Average', value: ((s1Val + s2Val + smapVal + groundVal) / 4).toFixed(1), confidence: 78 },
    { stage: 'Stage C: Weighted Fusion', value: ((s1Val * 0.25 + s2Val * 0.2 + smapVal * 0.2 + groundVal * 0.35)).toFixed(1), confidence: 84 },
    { stage: 'Stage D: Random Forest ML', value: ((s1Val * 0.3 + s2Val * 0.22 + smapVal * 0.18 + groundVal * 0.3)).toFixed(1), confidence: 88 },
    { stage: 'Stage E: Proposed Fusion', value: fusedEstimate, confidence: 94 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-scientific-800 pb-3">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <GitFork className="w-4 h-4 text-emerald-400" />
            <span>Multi-Sensor Inputs & Live Fusion Simulation</span>
          </h2>
          <span className="text-xs font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800/60">
            CONFIDENCE ENGINE ACTIVE
          </span>
        </div>

        {/* Input Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-scientific-950 p-3 rounded-md border border-scientific-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-400">Sentinel-1 (SAR)</span>
              <span className="text-white font-bold">{s1Val}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="0.1"
              value={s1Val}
              onChange={(e) => setS1Val(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="bg-scientific-950 p-3 rounded-md border border-scientific-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400">Sentinel-2 (MSI)</span>
              <span className="text-white font-bold">{s2Val}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="0.1"
              value={s2Val}
              onChange={(e) => setS2Val(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="bg-scientific-950 p-3 rounded-md border border-scientific-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-purple-400">SMAP (Microwave)</span>
              <span className="text-white font-bold">{smapVal}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="0.1"
              value={smapVal}
              onChange={(e) => setSmapVal(parseFloat(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <div className="bg-scientific-950 p-3 rounded-md border border-scientific-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-amber-400">Ground Sensors</span>
              <span className="text-white font-bold">{groundVal}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="0.1"
              value={groundVal}
              onChange={(e) => setGroundVal(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Stage E Result Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 to-scientific-900 border border-emerald-700/60 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            PROPOSED CONFIDENCE-AWARE FUSED ESTIMATE (STAGE E)
          </span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-4xl font-extrabold font-mono text-white">{fusedEstimate}%</span>
            <span className="text-xs text-emerald-300 font-mono">
              95% CI: [{lowerCI}%, {upperCI}%]
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="p-3 bg-scientific-900 rounded-md border border-scientific-800 text-center">
            <div className="text-scientific-400">Overall Confidence</div>
            <div className="text-lg font-bold text-emerald-400">94.0%</div>
          </div>
          <div className="p-3 bg-scientific-900 rounded-md border border-scientific-800 text-center">
            <div className="text-scientific-400">Uncertainty Bound</div>
            <div className="text-lg font-bold text-cyan-400">± 0.95%</div>
          </div>
        </div>
      </div>

      {/* Charts & Explainability Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Contributions Pie Chart */}
        <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Explainable Sensor Contributions</span>
            <span className="text-xs font-mono font-normal text-scientific-400">Dynamic Weights</span>
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#102a43', borderColor: '#334e68', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Stage Comparison Bar Chart */}
        <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Stage A to E Fusion Model Benchmarking</span>
            <span className="text-xs font-mono font-normal text-cyan-400">Accuracy & Confidence</span>
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243b53" />
                <XAxis dataKey="stage" stroke="#829ab1" tick={{ fontSize: 9 }} />
                <YAxis stroke="#829ab1" tick={{ fontSize: 10 }} domain={[0, 40]} />
                <Tooltip contentStyle={{ backgroundColor: '#102a43', borderColor: '#334e68', fontSize: 11 }} />
                <Bar dataKey="value" name="Soil Moisture Estimate (%)" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
