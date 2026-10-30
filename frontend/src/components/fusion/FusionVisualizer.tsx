import React, { useState } from 'react';
import { 
  Sliders, GitFork, ShieldCheck, HelpCircle, Activity, 
  CheckCircle2, Sparkles, Layers, Cpu, Info 
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area 
} from 'recharts';

export const FusionVisualizer: React.FC = () => {
  // Input raw observation values
  const [s1Val, setS1Val] = useState(26.5);
  const [s2Val, setS2Val] = useState(29.1);
  const [smapVal, setSmapVal] = useState(27.8);
  const [groundVal, setGroundVal] = useState(28.4);
  const [era5Val, setEra5Val] = useState(25.9);

  // Dynamic user-adjustable weights (percentages summing to 100)
  const [wS1, setWS1] = useState(30);
  const [wS2, setWS2] = useState(20);
  const [wSmap, setWSmap] = useState(15);
  const [wGround, setWGround] = useState(25);
  const [wEra5, setWEra5] = useState(10);

  // Selected stage view for interactive breakdown
  const [activeStage, setActiveStage] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('E');

  // Normalized weights
  const totalWeight = wS1 + wS2 + wSmap + wGround + wEra5 || 1;
  const nwS1 = wS1 / totalWeight;
  const nwS2 = wS2 / totalWeight;
  const nwSmap = wSmap / totalWeight;
  const nwGround = wGround / totalWeight;
  const nwEra5 = wEra5 / totalWeight;

  // Compute live Stage E fusion
  const fusedEstimate = (
    (s1Val * nwS1) +
    (s2Val * nwS2) +
    (smapVal * nwSmap) +
    (groundVal * nwGround) +
    (era5Val * nwEra5)
  ).toFixed(2);

  // Uncertainty calculation (variance decreases as ground weight increases)
  const sigma = Math.max(0.45, (1.8 - (nwGround * 1.5) - (nwS1 * 0.4))).toFixed(2);
  const margin95 = (parseFloat(sigma) * 1.96).toFixed(2);
  const lowerCI = (parseFloat(fusedEstimate) - parseFloat(margin95)).toFixed(2);
  const upperCI = (parseFloat(fusedEstimate) + parseFloat(margin95)).toFixed(2);

  // Overall confidence score (0 to 100%)
  const overallConfidence = Math.min(98.5, Math.max(70, 82 + (nwGround * 15) + (nwS1 * 10) - (Math.abs(s1Val - groundVal) * 1.2))).toFixed(1);

  const pieData = [
    { name: 'Sentinel-1 (SAR Radar)', value: wS1, color: '#00bcd4' },
    { name: 'Sentinel-2 (MSI Optical)', value: wS2, color: '#10b981' },
    { name: 'NASA SMAP (L-Band)', value: wSmap, color: '#a855f7' },
    { name: 'Ground FDR Probes', value: wGround, color: '#f59e0b' },
    { name: 'ERA5-Land Reanalysis', value: wEra5, color: '#3b82f6' },
  ];

  const stageComparison = [
    { stage: 'Stage A: Raw S1', value: s1Val, confidence: 64, uncertainty: '±3.8%' },
    { stage: 'Stage B: Equal Avg', value: parseFloat(((s1Val + s2Val + smapVal + groundVal + era5Val) / 5).toFixed(2)), confidence: 75, uncertainty: '±2.9%' },
    { stage: 'Stage C: Kalman Wgt', value: parseFloat((s1Val * 0.28 + s2Val * 0.2 + smapVal * 0.15 + groundVal * 0.27 + era5Val * 0.1).toFixed(2)), confidence: 85, uncertainty: '±1.8%' },
    { stage: 'Stage D: Hydraulic ML', value: parseFloat((s1Val * 0.3 + s2Val * 0.2 + smapVal * 0.16 + groundVal * 0.26 + era5Val * 0.08).toFixed(2)), confidence: 90, uncertainty: '±1.2%' },
    { stage: 'Stage E: Full Nexus', value: parseFloat(fusedEstimate), confidence: parseFloat(overallConfidence), uncertainty: `±${margin95}%` },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-scientific-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <GitFork className="w-5 h-5 text-emerald-400" />
              <span>Multi-Source Sensor Fusion & Uncertainty Engine</span>
            </h2>
            <p className="text-xs text-scientific-400 mt-0.5">
              5-Stage Asynchronous Kalman Filtering & Physics-Constrained Soil Water Retention Harmonization
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold px-3 py-1 bg-emerald-950 text-emerald-300 rounded-full border border-emerald-700/60 w-fit">
            STAGE E PROBABILISTIC INFERENCE ACTIVE
          </span>
        </div>

        {/* Input Observation Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-scientific-950 p-3 rounded-lg border border-scientific-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-400 font-semibold">Sentinel-1 (SAR)</span>
              <span className="text-white font-bold">{s1Val}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.1"
              value={s1Val}
              onChange={(e) => setS1Val(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-scientific-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-scientific-400 font-mono">
              <span>Weight: {Math.round(nwS1 * 100)}%</span>
              <button onClick={() => setWS1(wS1 + 5)} className="text-cyan-400 hover:underline">+w</button>
            </div>
          </div>

          <div className="bg-scientific-950 p-3 rounded-lg border border-scientific-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400 font-semibold">Sentinel-2 (MSI)</span>
              <span className="text-white font-bold">{s2Val}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.1"
              value={s2Val}
              onChange={(e) => setS2Val(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-scientific-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-scientific-400 font-mono">
              <span>Weight: {Math.round(nwS2 * 100)}%</span>
              <button onClick={() => setWS2(wS2 + 5)} className="text-emerald-400 hover:underline">+w</button>
            </div>
          </div>

          <div className="bg-scientific-950 p-3 rounded-lg border border-scientific-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-purple-400 font-semibold">NASA SMAP</span>
              <span className="text-white font-bold">{smapVal}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.1"
              value={smapVal}
              onChange={(e) => setSmapVal(parseFloat(e.target.value))}
              className="w-full accent-purple-400 h-1.5 bg-scientific-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-scientific-400 font-mono">
              <span>Weight: {Math.round(nwSmap * 100)}%</span>
              <button onClick={() => setWSmap(wSmap + 5)} className="text-purple-400 hover:underline">+w</button>
            </div>
          </div>

          <div className="bg-scientific-950 p-3 rounded-lg border border-scientific-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-amber-400 font-semibold">Ground FDR</span>
              <span className="text-white font-bold">{groundVal}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.1"
              value={groundVal}
              onChange={(e) => setGroundVal(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-scientific-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-scientific-400 font-mono">
              <span>Weight: {Math.round(nwGround * 100)}%</span>
              <button onClick={() => setWGround(wGround + 5)} className="text-amber-400 hover:underline">+w</button>
            </div>
          </div>

          <div className="bg-scientific-950 p-3 rounded-lg border border-scientific-800/80 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-blue-400 font-semibold">ERA5-Land</span>
              <span className="text-white font-bold">{era5Val}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.1"
              value={era5Val}
              onChange={(e) => setEra5Val(parseFloat(e.target.value))}
              className="w-full accent-blue-400 h-1.5 bg-scientific-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-scientific-400 font-mono">
              <span>Weight: {Math.round(nwEra5 * 100)}%</span>
              <button onClick={() => setWEra5(wEra5 + 5)} className="text-blue-400 hover:underline">+w</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stage E Live Output Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-scientific-900 to-cyan-950/80 border border-emerald-600/60 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Fused Volumetric Soil Moisture (Stage E State Estimate)</span>
          </span>
          <div className="flex items-baseline space-x-3 mt-1.5">
            <span className="text-4xl md:text-5xl font-black font-mono text-white tracking-tight">
              {fusedEstimate}%
            </span>
            <div className="text-xs font-mono text-emerald-300">
              <div>95% CI: <strong className="text-white">[{lowerCI}%, {upperCI}%]</strong></div>
              <div className="text-[11px] text-scientific-400">Heteroscedastic Error ±{margin95}%</div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="p-3 bg-scientific-900/90 rounded-xl border border-scientific-700/80 text-center min-w-[110px]">
            <div className="text-[10px] text-scientific-400 uppercase">Confidence</div>
            <div className="text-xl font-bold text-emerald-400">{overallConfidence}%</div>
          </div>
          <div className="p-3 bg-scientific-900/90 rounded-xl border border-scientific-700/80 text-center min-w-[110px]">
            <div className="text-[10px] text-scientific-400 uppercase">Std Dev (σ)</div>
            <div className="text-xl font-bold text-cyan-400">{sigma}%</div>
          </div>
          <div className="p-3 bg-scientific-900/90 rounded-xl border border-scientific-700/80 text-center min-w-[110px]">
            <div className="text-[10px] text-scientific-400 uppercase">Spatial Grid</div>
            <div className="text-xl font-bold text-amber-400">10m</div>
          </div>
        </div>
      </div>

      {/* Multi-Stage Interactive Stepper */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="text-xs font-mono font-bold text-scientific-300 uppercase tracking-wider">
          5-Stage Fusion Pipeline Architecture
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {[
            { id: 'A', name: 'Stage A: Temporal Alignment', desc: 'Epoch synchronization' },
            { id: 'B', name: 'Stage B: Spatial Downscaling', desc: '9km to 10m Bicubic DEM' },
            { id: 'C', name: 'Stage C: Kalman Filtering', desc: 'Adaptive state covariance' },
            { id: 'D', name: 'Stage D: Hydraulic Constraints', desc: 'Van Genuchten Retention' },
            { id: 'E', name: 'Stage E: Uncertainty Bounds', desc: '95% CI heteroscedastic' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStage(st.id as any)}
              className={`p-2.5 rounded-lg text-left transition-all border ${
                activeStage === st.id
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/40'
                  : 'bg-scientific-950 border-scientific-800 text-scientific-400 hover:text-white'
              }`}
            >
              <div className="font-bold text-white text-[11px]">{st.name}</div>
              <div className="text-[10px] text-scientific-400 mt-0.5">{st.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Charts & Explainability Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sensor Contributions Pie Chart */}
        <div className="bg-scientific-900 border border-scientific-800 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Explainable Sensor Contribution Weights</span>
            </span>
            <span className="text-xs font-mono font-normal text-cyan-400">Normalized %</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#061325', borderColor: '#1e3a5f', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-Stage Comparison Bar Chart */}
        <div className="bg-scientific-900 border border-scientific-800 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Multi-Stage Model Accuracy & Convergence</span>
            </span>
            <span className="text-xs font-mono font-normal text-emerald-400">Stage A → E</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="stage" stroke="#829ab1" tick={{ fontSize: 9 }} />
                <YAxis stroke="#829ab1" tick={{ fontSize: 10 }} domain={[0, 40]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#061325', borderColor: '#1e3a5f', fontSize: 11 }}
                  formatter={(val: any, name: any, item: any) => [
                    `${val}% (Uncertainty: ${item.payload.uncertainty})`, 
                    'Moisture Estimate'
                  ]}
                />
                <Bar dataKey="value" name="Estimate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

