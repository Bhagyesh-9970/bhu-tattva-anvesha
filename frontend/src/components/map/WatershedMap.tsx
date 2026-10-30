import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Watershed, Sensor } from '../../types';
import { useArea } from '../../context/AreaContext';
import { 
  Layers, Eye, EyeOff, Globe, MapPin, Ruler, Compass, Crosshair, 
  Square, RefreshCw, CheckCircle2, Sparkles, Navigation 
} from 'lucide-react';

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
  const { selectedArea, selectZone, selectBbox, resetToFullWatershed, knownZones, loading: areaLoading } = useArea();

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geojsonLayer = useRef<L.GeoJSON | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const measureLineLayer = useRef<L.Polyline | null>(null);
  const selectionLayer = useRef<L.Rectangle | null>(null);

  // Basemap & Layer states
  const [basemap, setBasemap] = useState<'satellite' | 'topo' | 'dark'>('satellite');
  const [showBoundary, setShowBoundary] = useState(true);
  const [showSensors, setShowSensors] = useState(true);

  // Selection states
  const [isDrawingBbox, setIsDrawingBbox] = useState(false);
  const [boxStartPoint, setBoxStartPoint] = useState<L.LatLng | null>(null);

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

    // Interactive Map Click Handler (Distance or Custom Land Parcel Drawing)
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
      } else if (isDrawingBbox) {
        if (!boxStartPoint) {
          setBoxStartPoint(e.latlng);
        } else {
          // Second click completes the bounding box
          const minLat = Math.min(boxStartPoint.lat, e.latlng.lat);
          const maxLat = Math.max(boxStartPoint.lat, e.latlng.lat);
          const minLon = Math.min(boxStartPoint.lng, e.latlng.lng);
          const maxLon = Math.max(boxStartPoint.lng, e.latlng.lng);
          
          selectBbox([
            parseFloat(minLon.toFixed(4)),
            parseFloat(minLat.toFixed(4)),
            parseFloat(maxLon.toFixed(4)),
            parseFloat(maxLat.toFixed(4)),
          ]);

          setBoxStartPoint(null);
          setIsDrawingBbox(false);
        }
      }
    });

    leafletMap.current = map;

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [isMeasuring, isDrawingBbox, boxStartPoint]);

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
          weight: 2,
          opacity: 0.7,
          fillColor: '#00e676',
          fillOpacity: 0.08,
          dashArray: '5, 5',
        },
      }).addTo(leafletMap.current);

      geojsonLayer.current = layer;
    }
  }, [watershed, showBoundary, basemap]);

  // Update Selected Land Area Bounding Box on Map
  useEffect(() => {
    if (!leafletMap.current) return;

    if (selectionLayer.current) {
      leafletMap.current.removeLayer(selectionLayer.current);
      selectionLayer.current = null;
    }

    if (selectedArea?.bbox && selectedArea.bbox.length === 4) {
      const [minLon, minLat, maxLon, maxLat] = selectedArea.bbox;
      const bounds: L.LatLngBoundsExpression = [
        [minLat, minLon],
        [maxLat, maxLon],
      ];

      const rect = L.rectangle(bounds, {
        color: '#06b6d4',
        weight: 3,
        opacity: 0.9,
        fillColor: '#06b6d4',
        fillOpacity: 0.2,
        dashArray: '4, 4',
      }).addTo(leafletMap.current);

      rect.bindTooltip(
        `<b>Selected Parcel:</b> ${selectedArea.zone_name}<br/><b>Area:</b> ${selectedArea.area_sqkm} km² (${selectedArea.area_ha} ha)`,
        { permanent: false, direction: 'top' }
      );

      selectionLayer.current = rect;

      // Smoothly pan & fit bounds if not entire watershed
      if (selectedArea.zone_id !== 'entire_watershed') {
        leafletMap.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    }
  }, [selectedArea]);

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
          radius: 7,
          color: '#ffffff',
          fillColor: '#10b981',
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
    <div className="relative w-full rounded-xl overflow-hidden border border-scientific-800 shadow-xl bg-scientific-950 flex flex-col">
      {/* Dynamic Zone Quick Selector Bar */}
      <div className="bg-scientific-900 border-b border-scientific-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Select Land Area / Micro-Zone:
          </span>
        </div>

        {/* Micro-Zone Quick Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {knownZones.map((z) => {
            const isSelected = selectedArea?.zone_id === z.id;
            return (
              <button
                key={z.id}
                onClick={() => selectZone(z.id)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md ring-1 ring-cyan-400'
                    : 'bg-scientific-800/80 text-scientific-300 hover:bg-scientific-700 hover:text-white border border-scientific-700/60'
                }`}
              >
                {z.name}
              </button>
            );
          })}

          {/* Reset Button */}
          {selectedArea && selectedArea.zone_id !== 'entire_watershed' && (
            <button
              onClick={() => resetToFullWatershed()}
              title="Reset to Full Watershed"
              className="px-2 py-1 bg-scientific-800 hover:bg-scientific-700 text-scientific-300 hover:text-white rounded-md text-[11px] font-mono flex items-center space-x-1 border border-scientific-700"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative w-full flex-1">
        {/* Top Controls Overlay */}
        <div className="absolute top-3 left-3 z-[1000] bg-scientific-900/90 backdrop-blur-md border border-scientific-700/60 rounded-lg p-2 text-xs flex flex-wrap items-center gap-2 shadow-lg">
          {/* Basemap Switcher Buttons */}
          <div className="flex items-center space-x-1 bg-scientific-950 p-1 rounded border border-scientific-800">
            <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1" />
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                basemap === 'satellite' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
              }`}
            >
              🛰️ Satellite
            </button>
            <button
              onClick={() => setBasemap('topo')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                basemap === 'topo' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
              }`}
            >
              🗺️ Topo
            </button>
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                basemap === 'dark' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
              }`}
            >
              🌙 Dark
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
            <span>Basin Outline</span>
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

          {/* Interactive Land Parcel Drawing Tool */}
          <button
            onClick={() => {
              setIsDrawingBbox(!isDrawingBbox);
              setBoxStartPoint(null);
              if (isMeasuring) clearMeasurement();
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors text-[11px] font-mono ${
              isDrawingBbox ? 'bg-cyan-900 text-cyan-200 border border-cyan-500 animate-pulse' : 'bg-scientific-800 text-scientific-300 hover:text-white'
            }`}
          >
            <Square className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isDrawingBbox ? (boxStartPoint ? 'Click 2nd Corner...' : 'Click 1st Corner...') : 'Draw Area Box'}</span>
          </button>

          {/* Distance Measurement Tool */}
          <button
            onClick={() => {
              if (isMeasuring) clearMeasurement();
              else {
                setIsMeasuring(true);
                setIsDrawingBbox(false);
              }
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition-colors text-[11px] font-mono ${
              isMeasuring ? 'bg-amber-950 text-amber-300 border border-amber-700/60' : 'bg-scientific-800 text-scientific-400 hover:text-white'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span>{isMeasuring ? 'Measuring...' : 'Measure'}</span>
          </button>
        </div>

        {/* Active Selected Parcel Telemetry Banner */}
        {selectedArea && (
          <div className="absolute top-16 right-3 z-[1000] bg-scientific-900/90 backdrop-blur-md border border-cyan-500/50 text-cyan-100 px-3.5 py-2 rounded-lg text-xs font-mono shadow-xl flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <div className="font-bold text-white text-[12px] flex items-center space-x-1.5">
                <span>{selectedArea.zone_name}</span>
                <span className="text-cyan-400 font-normal">({selectedArea.area_sqkm} km² / {selectedArea.area_ha.toLocaleString()} ha)</span>
              </div>
              <div className="text-[10px] text-scientific-300">
                Soil Moisture: <strong>{selectedArea.soil_moisture.toFixed(1)}%</strong> | NDVI: <strong>{selectedArea.ndvi.toFixed(2)}</strong> | Sensors: <strong>{selectedArea.active_sensors_count}</strong>
              </div>
            </div>
          </div>
        )}

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

        {/* Telemetry Cursor Status Bar */}
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
            <span className="text-emerald-400 font-bold">10m Dynamic Ground Grid</span>
          </div>
        </div>
      </div>
    </div>
  );
};

