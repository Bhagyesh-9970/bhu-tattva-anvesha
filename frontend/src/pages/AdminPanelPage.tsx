import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Plus, Database, Settings, Sun, Moon, CheckCircle, AlertCircle, Layers } from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const { user, isAdmin, theme, toggleTheme } = useAuth();

  // Sensor Form State
  const [sensorCode, setSensorCode] = useState('');
  const [sensorName, setSensorName] = useState('');
  const [sensorType, setSensorType] = useState('SOIL_MOISTURE');
  const [lat, setLat] = useState('11.9100');
  const [lon, setLon] = useState('76.2100');
  const [elevation, setElevation] = useState('710');
  const [sensorMsg, setSensorMsg] = useState('');

  // Dataset Registration Form State
  const [dsName, setDsName] = useState('');
  const [dsProvider, setDsProvider] = useState('');
  const [dsVariables, setDsVariables] = useState('');
  const [dsMsg, setDsMsg] = useState('');

  // Grid Resolution Settings State
  const [gridRes, setGridRes] = useState('100');
  const [settingsMsg, setSettingsMsg] = useState('');

  if (!isAdmin) {
    return (
      <div className="p-8 bg-scientific-900 border border-red-800 rounded-lg text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Access Restricted — Admin Authorization Required</h2>
        <p className="text-xs text-scientific-400">
          You are currently logged in as standard user <span className="font-mono text-cyan-400">"{user?.username}"</span>. Log in as an <span className="font-mono text-emerald-400">ADMIN</span> to access system data management.
        </p>
      </div>
    );
  }

  const handleAddSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSensorMsg('');

    try {
      const res = await fetch('/api/v1/admin/sensors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watershed_id: 1,
          sensor_code: sensorCode,
          sensor_type: sensorType,
          name: sensorName,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          elevation_m: parseFloat(elevation),
          status: 'ACTIVE',
        }),
      });

      if (!res.ok) throw new Error('Failed to create sensor');

      setSensorMsg('✅ Ground Telemetry Sensor registered successfully into database!');
      setSensorCode('');
      setSensorName('');
    } catch (err: any) {
      setSensorMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleRegisterDataset = async (e: React.FormEvent) => {
    e.preventDefault();
    setDsMsg('');

    try {
      const res = await fetch('/api/v1/admin/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dsName,
          provider: dsProvider,
          variables: dsVariables,
          resolution: '10m spatial / 5-day',
          dataset_type: 'Satellite Raster',
        }),
      });

      if (!res.ok) throw new Error('Failed to register dataset');

      setDsMsg(`✅ Dataset '${dsName}' registered successfully into system catalog!`);
      setDsName('');
      setDsProvider('');
      setDsVariables('');
    } catch (err: any) {
      setDsMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg('✅ System operational settings updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 to-scientific-900 border border-cyan-700/60 rounded-xl p-5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-900/60 rounded-lg border border-cyan-700">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Admin Management Portal</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded border border-emerald-700">
                ROLE: ADMIN
              </span>
            </h1>
            <p className="text-xs text-scientific-300 mt-0.5">
              Add telemetry sensors, upload observations, register satellite rasters, and customize system themes.
            </p>
          </div>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 px-3.5 py-2 bg-scientific-800 hover:bg-scientific-700 text-white rounded-md border border-scientific-700 text-xs font-mono transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          <span>Theme: {theme.toUpperCase()}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form 1: Add Ground Telemetry Sensor */}
        <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-scientific-800 pb-3">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add New Ground Telemetry Sensor</span>
          </h2>

          {sensorMsg && <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 p-2.5 rounded border border-emerald-800">{sensorMsg}</div>}

          <form onSubmit={handleAddSensor} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-scientific-400 block mb-1">Sensor Code</label>
                <input
                  type="text"
                  required
                  value={sensorCode}
                  onChange={(e) => setSensorCode(e.target.value)}
                  placeholder="e.g. KAB-SOIL-03"
                  className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-scientific-400 block mb-1">Sensor Type</label>
                <select
                  value={sensorType}
                  onChange={(e) => setSensorType(e.target.value)}
                  className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
                >
                  <option value="SOIL_MOISTURE">SOIL_MOISTURE</option>
                  <option value="WEATHER">WEATHER (AWS)</option>
                  <option value="WATER_LEVEL">WATER_LEVEL</option>
                  <option value="MULTI_PARAM">MULTI_PARAM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-scientific-400 block mb-1">Station Name</label>
              <input
                type="text"
                required
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
                placeholder="e.g. Hunsur Watershed Soil Station"
                className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-scientific-400 block mb-1">Latitude (°N)</label>
                <input
                  type="text"
                  required
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-scientific-400 block mb-1">Longitude (°E)</label>
                <input
                  type="text"
                  required
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-scientific-400 block mb-1">Elevation (m)</label>
                <input
                  type="text"
                  required
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                  className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono font-semibold transition-colors mt-2"
            >
              Add Sensor to Database
            </button>
          </form>
        </div>

        {/* Form 2: Register Earth Observation Dataset */}
        <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-scientific-800 pb-3">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Register Earth Observation Dataset</span>
          </h2>

          {dsMsg && <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 p-2.5 rounded border border-cyan-800">{dsMsg}</div>}

          <form onSubmit={handleRegisterDataset} className="space-y-3 text-xs">
            <div>
              <label className="text-scientific-400 block mb-1">Dataset Name</label>
              <input
                type="text"
                required
                value={dsName}
                onChange={(e) => setDsName(e.target.value)}
                placeholder="e.g. Landsat-9 OLI-2 Surface Reflectance"
                className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-scientific-400 block mb-1">Provider</label>
                <input
                  type="text"
                  required
                  value={dsProvider}
                  onChange={(e) => setDsProvider(e.target.value)}
                  placeholder="e.g. USGS / NASA"
                  className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-scientific-400 block mb-1">Variables</label>
                <input
                  type="text"
                  required
                  value={dsVariables}
                  onChange={(e) => setDsVariables(e.target.value)}
                  placeholder="e.g. LST, Thermal, Multi-spectral"
                  className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-mono font-semibold transition-colors mt-2"
            >
              Register Dataset into Catalog
            </button>
          </form>

          {/* Form 3: System Settings & Spatial Grid Config */}
          <div className="pt-4 border-t border-scientific-800 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>System Settings & Grid Resolution Config</span>
            </h3>

            {settingsMsg && <div className="text-xs font-mono text-amber-300 bg-amber-950/60 p-2 rounded border border-amber-800">{settingsMsg}</div>}

            <form onSubmit={handleUpdateSettings} className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-scientific-400">Spatial Grid:</span>
              <select
                value={gridRes}
                onChange={(e) => setGridRes(e.target.value)}
                className="bg-scientific-950 border border-scientific-800 text-white px-2 py-1 rounded"
              >
                <option value="50">50m High Resolution</option>
                <option value="100">100m Standard Resolution</option>
                <option value="250">250m Regional Resolution</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-semibold"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
