import React, { useState } from 'react';
import { Sliders, Play, AlertTriangle, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export const ScenarioSimulator: React.FC = () => {
  const [rainfallPct, setRainfallPct] = useState(-20.0);
  const [tempC, setTempC] = useState(2.0);
  const [vegPct, setVegPct] = useState(-10.0);

  // Baseline variables
  const baseMoisture = 28.4;
  const baseNdvi = 0.682;
  const baseTemp = 27.8;
  const basePrecip = 12.4;

  // Compute live simulated scenario metrics
  const scenPrecip = Math.max(0.0, basePrecip * (1.0 + rainfallPct / 100.0));
  const smDelta = (scenPrecip - basePrecip) * 0.45 - tempC * 1.2;
  const scenMoisture = Math.max(5.0, Math.min(50.0, baseMoisture + smDelta));

  const ndviDelta = (vegPct / 100.0) * 0.5 + (smDelta / 100.0) * 0.4;
  const scenNdvi = Math.max(0.05, Math.min(0.95, baseNdvi + ndviDelta));

  const droughtRisk = scenMoisture < 18.0 ? 'HIGH' : scenMoisture < 25.0 ? 'MODERATE' : 'LOW';

  return (
    <div className="space-y-6">
      {/* Simulation Controls Panel */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-scientific-800 pb-3">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>What-If Climate & Environmental Scenario Parameters</span>
          </h2>
          <span className="text-xs font-mono px-2.5 py-0.5 bg-amber-950/60 border border-amber-800/60 text-amber-300 rounded">
            SIMULATION ENGINE ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rainfall Slider */}
          <div className="bg-scientific-950 p-4 rounded-md border border-scientific-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-blue-400">Rainfall Perturbation</span>
              <span className="text-white font-bold">{rainfallPct > 0 ? `+${rainfallPct}` : rainfallPct}%</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={rainfallPct}
              onChange={(e) => setRainfallPct(parseFloat(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          {/* Temperature Slider */}
          <div className="bg-scientific-950 p-4 rounded-md border border-scientific-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-amber-400">Temperature Change</span>
              <span className="text-white font-bold">{tempC > 0 ? `+${tempC}` : tempC}°C</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={tempC}
              onChange={(e) => setTempC(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Vegetation Slider */}
          <div className="bg-scientific-950 p-4 rounded-md border border-scientific-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400">Vegetation Canopy Delta</span>
              <span className="text-white font-bold">{vegPct > 0 ? `+${vegPct}` : vegPct}%</span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={vegPct}
              onChange={(e) => setVegPct(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Baseline vs Scenario Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline Card */}
        <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-scientific-800 pb-2">
            <h3 className="text-sm font-semibold text-white">Current Observed Baseline State</h3>
            <span className="text-xs font-mono text-emerald-400">OBSERVED</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-scientific-950 rounded border border-scientific-800">
              <div className="text-scientific-400">Soil Moisture</div>
              <div className="text-xl font-bold text-white mt-1">{baseMoisture}%</div>
            </div>
            <div className="p-3 bg-scientific-950 rounded border border-scientific-800">
              <div className="text-scientific-400">NDVI Index</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">{baseNdvi}</div>
            </div>
            <div className="p-3 bg-scientific-950 rounded border border-scientific-800">
              <div className="text-scientific-400">Precipitation</div>
              <div className="text-xl font-bold text-blue-400 mt-1">{basePrecip} mm</div>
            </div>
            <div className="p-3 bg-scientific-950 rounded border border-scientific-800">
              <div className="text-scientific-400">Air Temperature</div>
              <div className="text-xl font-bold text-amber-400 mt-1">{baseTemp}°C</div>
            </div>
          </div>
        </div>

        {/* Simulated Scenario Card */}
        <div className="bg-scientific-900 border border-amber-800/60 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-scientific-800 pb-2">
            <h3 className="text-sm font-semibold text-white">Simulated Scenario State</h3>
            <span className="text-xs font-mono text-amber-400 font-bold">SIMULATION / SCENARIO</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-scientific-950 rounded border border-scientific-800">
              <div className="text-scientific-400">Simulated Moisture</div>
              <div className="text-xl font-bold text-amber-300 mt-1">{scenMoisture.toFixed(1)}%</div>
              <div className="text-[10px] text-red-400 mt-0.5">
                {(scenMoisture - baseMoisture).toFixed(1)}% delta
              </div>
            </div>

            <div className="p-3 bg-scientific-950 rounded border border-scientific-800">
              <div className="text-scientific-400">Simulated NDVI</div>
              <div className="text-xl font-bold text-emerald-300 mt-1">{scenNdvi.toFixed(3)}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                {(scenNdvi - baseNdvi).toFixed(3)} delta
              </div>
            </div>

            <div className="p-3 bg-scientific-950 rounded border border-scientific-800">
              <div className="text-scientific-400">Simulated Precip</div>
              <div className="text-xl font-bold text-blue-300 mt-1">{scenPrecip.toFixed(1)} mm</div>
              <div className="text-[10px] text-blue-400 mt-0.5">
                {(scenPrecip - basePrecip).toFixed(1)} mm delta
              </div>
            </div>

            <div className="p-3 bg-scientific-950 rounded border border-scientific-800">
              <div className="text-scientific-400">Simulated Temp</div>
              <div className="text-xl font-bold text-amber-300 mt-1">{(baseTemp + tempC).toFixed(1)}°C</div>
              <div className="text-[10px] text-amber-400 mt-0.5">
                +{tempC}°C delta
              </div>
            </div>
          </div>

          {/* Risk Alert Badge */}
          <div className="p-3 bg-amber-950/40 border border-amber-700/60 rounded flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Drought Stress Risk Level:</span>
            </div>
            <span className="font-bold text-amber-400 text-sm">{droughtRisk}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
