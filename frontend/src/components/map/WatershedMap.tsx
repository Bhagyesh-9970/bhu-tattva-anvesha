import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Watershed, Sensor } from '../../types';
import { Layers, Eye, EyeOff, Globe, MapPin, Ruler, Compass, Crosshair } from 'lucide-react';

interface WatershedMapProps {
  watershed?: Watershed;
  sensors?: Sensor[];
  height?: string;
}

export const WatershedMap: React.FC<WatershedMapProps> = ({
  watershed,
  sensors = [],
  height = '550px',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonLayer = useRef<L.GeoJSON | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const measureLineLayer = useRef<L.Polyline | null>(null);

  // Basemap & Layer states
  const [basemap, setBasemap] = useState<'satellite' | 'topo' | 'dark'>('satellite');
  const [showBoundary, setShowBoundary] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showNDVI, setShowNDVI] = useState(false);

  // Telemetry & Measurement states
  const [cursorPos, setCursorPos] = useState({ lat: 11.9200, lon: 76.2500, zoom: 11 });
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<L.LatLng[]>([]);
  const [measuredDistance, setMeasuredDistance] = useState<number>(0);

  // Basemap URLs
  const basemaps = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  };

  const attributions = {
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    topo: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
    dark: '&copy; OpenStreetMap contributors &copy; CARTO',
  };

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const lat = watershed?.centroid_lat || 11.92;
    const lon = watershed?.centroid_lon || 76.25;

    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 11,
      zoomControl: false,
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer (Esri Satellite)
    const baseLayer = L.tileLayer(basemaps.satellite, {
      attribution: attributions.satellite,
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = baseLayer;

    // Track Mouse Coordinates Telemetry
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorPos({
        lat: parseFloat(e.latlng.lat.toFixed(4)),
        lon: parseFloat(e.latlng.lng.toFixed(4)),
        zoom: map.getZoom(),
      });
    });

    // Measurement Click Handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isMeasuring) {
        setMeasurePoints((prev) => {
          const updated = [...prev, e.latlng];
          if (updated.length > 1) {
            let totalDist = 0;
            for (let i = 0; i < updated.length - 1; i++) {
              totalDist += updated[i].distanceTo(updated[i + 1]);
            }
            setMeasuredDistance(parseFloat((totalDist / 1000).toFixed(2)));
          }
          return updated;
        });
      }
    });

    leafletMap.current = map;

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update Basemap Tiles
  useEffect(() => {
    if (!leafletMap.current) return;

    if (tileLayerRef.current) {
      leafletMap.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(basemaps[basemap], {
      attribution: attributions[basemap],
      maxZoom: 19,
    }).addTo(leafletMap.current);

    tileLayerRef.current = newLayer;
  }, [basemap]);

  // Update Watershed GeoJSON Polygon
  useEffect(() => {
    if (!leafletMap.current || !watershed?.boundary_geojson) return;

    if (geojsonLayer.current) {
      leafletMap.current.removeLayer(geojsonLayer.current);
      geojsonLayer.current = null;
    }

    if (showBoundary) {
      const layer = L.geoJSON(watershed.boundary_geojson as any, {
        style: {
          color: basemap === 'satellite' ? '#00e676' : '#10b981',
          weight: 3,
          opacity: 0.95,
          fillColor: '#00e676',
          fillOpacity: 0.15,
          dashArray: '6, 6',
        },
      }).addTo(leafletMap.current);

      layer.bindPopup(`
        <div style="font-family: monospace; font-size: 12px; color: #102a43;">
          <strong style="color: #0b1b2b; font-size: 13px;">ISRO Bhuvan Spatial Extent</strong><br/>
          <b>Watershed:</b> ${watershed.name}<br/>
          <b>Code:</b> ${watershed.code}<br/>
          <b>Area:</b> ${watershed.area_sqkm} km²<br/>
          <b>Grid:</b> 100m Resolution (EPSG:4326)
        </div>
      `);

      geojsonLayer.current = layer;
      leafletMap.current.fitBounds(layer.getBounds(), { padding: [25, 25] });
    }
  }, [watershed, showBoundary, basemap]);

  // Update Sensor Markers
  useEffect(() => {
    if (!leafletMap.current) return;

    if (markersLayer.current) {
      leafletMap.current.removeLayer(markersLayer.current);
      markersLayer.current = null;
    }

    if (showSensors && sensors.length > 0) {
      const group = L.layerGroup().addTo(leafletMap.current);

      sensors.forEach((sensor) => {
        const marker = L.circleMarker([sensor.latitude, sensor.longitude], {
          radius: 8,
          color: '#ffffff',
          fillColor: '#00bcd4',
          fillOpacity: 0.95,
          weight: 2,
        }).addTo(group);

        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 12px; color: #102a43;">
            <strong style="color: #0b1b2b; font-size: 13px;">${sensor.name}</strong><br/>
            <b>Sensor Code:</b> ${sensor.sensor_code}<br/>
            <b>Type:</b> ${sensor.sensor_type}<br/>
            <b>Elevation:</b> ${sensor.elevation_m} m<br/>
            <b>Coordinates:</b> ${sensor.latitude.toFixed(4)}°N, ${sensor.longitude.toFixed(4)}°E<br/>
            <b>Status:</b> <span style="color: green; font-weight: bold;">${sensor.status}</span>
          </div>
        `);
      });

      markersLayer.current = group;
    }
  }, [sensors, showSensors]);

  // Handle Measurement Line Rendering
  useEffect(() => {
    if (!leafletMap.current) return;

    if (measureLineLayer.current) {
      leafletMap.current.removeLayer(measureLineLayer.current);
      measureLineLayer.current = null;
    }

    if (measurePoints.length > 1) {
      const line = L.polyline(measurePoints, {
        color: '#ff9800',
        weight: 3,
        dashArray: '5, 5',
      }).addTo(leafletMap.current);
      measureLineLayer.current = line;
    }
  }, [measurePoints]);

  const clearMeasurement = () => {
    setMeasurePoints([]);
    setMeasuredDistance(0);
    setIsMeasuring(false);
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-scientific-800 shadow-xl bg-scientific-950">
      {/* Top ISRO Bhuvan Controls Bar */}
      <div className="absolute top-3 left-3 z-[1000] bg-scientific-900/90 backdrop-blur-md border border-scientific-700/60 rounded-md p-2 text-xs flex flex-wrap items-center gap-2 shadow-lg">
        {/* Basemap Switcher Buttons */}
        <div className="flex items-center space-x-1 bg-scientific-950 p-1 rounded border border-scientific-800">
          <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1" />
          <button
            onClick={() => setBasemap('satellite')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              basemap === 'satellite' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
            }`}
          >
            🛰️ High-Res Satellite
          </button>
          <button
            onClick={() => setBasemap('topo')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              basemap === 'topo' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
            }`}
          >
            🗺️ Topographic
          </button>
          <button
            onClick={() => setBasemap('dark')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              basemap === 'dark' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
            }`}
          >
            🌙 Dark GIS
          </button>
        </div>

        {/* Layer Toggles */}
        <button
          onClick={() => setShowBoundary(!showBoundary)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors text-[11px] font-mono ${
            showBoundary ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' : 'bg-scientific-800 text-scientific-400'
          }`}
        >
          {showBoundary ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Boundary</span>
        </button>

        <button
          onClick={() => setShowSensors(!showSensors)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors text-[11px] font-mono ${
            showSensors ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60' : 'bg-scientific-800 text-scientific-400'
          }`}
        >
          {showSensors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Sensors ({sensors.length})</span>
        </button>

        {/* Distance Measurement Tool */}
        <button
          onClick={() => {
            if (isMeasuring) clearMeasurement();
            else setIsMeasuring(true);
          }}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors text-[11px] font-mono ${
            isMeasuring ? 'bg-amber-950 text-amber-300 border border-amber-700/60' : 'bg-scientific-800 text-scientific-400 hover:text-white'
          }`}
        >
          <Ruler className="w-3.5 h-3.5 text-amber-400" />
          <span>{isMeasuring ? 'Measuring...' : 'Measure Distance'}</span>
        </button>
      </div>

      {/* Distance Measurement Overlay Badge */}
      {measuredDistance > 0 && (
        <div className="absolute top-14 left-3 z-[1000] bg-amber-950/90 backdrop-blur-md border border-amber-700/80 text-amber-300 px-3 py-1.5 rounded-md text-xs font-mono shadow-lg flex items-center space-x-2">
          <span>Distance: <strong>{measuredDistance} km</strong></span>
          <button onClick={clearMeasurement} className="text-amber-400 hover:text-white underline font-sans text-[10px]">
            Clear
          </button>
        </div>
      )}

      {/* Leaflet Map Canvas Div */}
      <div ref={mapRef} style={{ height }} className="w-full bg-scientific-950" />

      {/* ISRO Bhuvan Telemetry Cursor Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-scientific-950/90 backdrop-blur-md border-t border-scientific-800 px-4 py-1.5 text-[11px] font-mono flex items-center justify-between text-scientific-300">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lat: <strong className="text-white">{cursorPos.lat}° N</strong></span>
          </div>
          <div>
            <span>Lon: <strong className="text-white">{cursorPos.lon}° E</strong></span>
          </div>
          <div>
            <span>Zoom: <strong className="text-cyan-400">{cursorPos.zoom}</strong></span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-scientific-400">CRS: EPSG:4326 (WGS84)</span>
          <span className="text-emerald-400 font-bold">100m Spatial Grid</span>
        </div>
      </div>
    </div>
  );
};
