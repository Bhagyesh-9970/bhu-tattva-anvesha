import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { EnvironmentalState } from '../../types';

interface EnvironmentalChartsProps {
  data: EnvironmentalState[];
}

export const EnvironmentalCharts: React.FC<EnvironmentalChartsProps> = ({ data }) => {
  const formattedData = [...data].reverse().map((item) => ({
    date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    soilMoisture: item.soil_moisture,
    ndvi: item.ndvi,
    temp: item.temperature_c,
    precip: item.precipitation_mm,
    confidence: (item.overall_confidence * 100).toFixed(1),
    uncertainty: (item.uncertainty_score * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Chart 1: Soil Moisture & NDVI */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
          <span>Soil Moisture (%) & NDVI Dual Index Trend</span>
          <span className="text-xs font-mono font-normal text-scientific-400">30-Day Resolution</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243b53" />
              <XAxis dataKey="date" stroke="#829ab1" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#1e88e5" tick={{ fontSize: 11 }} domain={[0, 50]} label={{ value: 'Soil Moisture (%)', angle: -90, position: 'insideLeft', fill: '#1e88e5', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#2e7d32" tick={{ fontSize: 11 }} domain={[0, 1]} label={{ value: 'NDVI Index', angle: 90, position: 'insideRight', fill: '#2e7d32', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#102a43', borderColor: '#334e68', fontSize: 12, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="soilMoisture" name="Soil Moisture (%)" stroke="#1e88e5" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="ndvi" name="NDVI Index" stroke="#4caf50" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Climate Drivers (Precipitation & Temperature) */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
          <span>Precipitation (mm) & Surface Air Temperature (°C)</span>
          <span className="text-xs font-mono font-normal text-scientific-400">ERA5 / Sensor Baseline</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243b53" />
              <XAxis dataKey="date" stroke="#829ab1" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#0288d1" tick={{ fontSize: 11 }} label={{ value: 'Rainfall (mm)', angle: -90, position: 'insideLeft', fill: '#0288d1', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#fb8c00" tick={{ fontSize: 11 }} domain={[15, 40]} label={{ value: 'Temp (°C)', angle: 90, position: 'insideRight', fill: '#fb8c00', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#102a43', borderColor: '#334e68', fontSize: 12, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar yAxisId="left" dataKey="precip" name="Precipitation (mm)" fill="#0288d1" opacity={0.7} radius={[2, 2, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#fb8c00" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Fusion Confidence vs Uncertainty */}
      <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center justify-between">
          <span>Sensor Fusion Confidence Score vs Uncertainty (%)</span>
          <span className="text-xs font-mono font-normal text-emerald-400">Confidence Model Active</span>
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243b53" />
              <XAxis dataKey="date" stroke="#829ab1" tick={{ fontSize: 11 }} />
              <YAxis stroke="#829ab1" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#102a43', borderColor: '#334e68', fontSize: 12, borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Area type="monotone" dataKey="confidence" name="Overall Confidence (%)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Area type="monotone" dataKey="uncertainty" name="Uncertainty Score (%)" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
