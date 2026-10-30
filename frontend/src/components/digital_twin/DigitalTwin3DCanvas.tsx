import React, { useEffect, useRef, useState } from 'react';
import { 
  Layers, RotateCcw, Info, Camera, Compass, Sun, Droplets, 
  Flame, Mountain, Sliders, Eye 
} from 'lucide-react';

declare global {
  interface Window {
    THREE?: any;
  }
}

interface DigitalTwin3DCanvasProps {
  height?: string;
}

export const DigitalTwin3DCanvas: React.FC<DigitalTwin3DCanvasProps> = ({ height = '580px' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Layer & Visual States
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'elevation' | 'vegetation' | 'soil' | 'water' | 'confidence'>('satellite');
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'top' | 'isometric'>('perspective');
  const [showWireframe, setShowWireframe] = useState(false);
  const [verticalExaggeration, setVerticalExaggeration] = useState(1.5);
  
  // 3D Scenario States
  const [floodLevel, setFloodLevel] = useState(0); // 0 to 10 meters
  const [isDroughtMode, setIsDroughtMode] = useState(false);
  const [sunAngle, setSunAngle] = useState(45); // 0 to 180 degrees

  // Telemetry HUD
  const [hudCoords, setHudCoords] = useState({ x: 0, y: 35, z: 45 });

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    let animationFrameId: number;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;

    script.onload = () => {
      if (!isMounted || !containerRef.current || !window.THREE) return;

      const THREE = window.THREE;
      const width = containerRef.current.clientWidth;
      const heightPx = containerRef.current.clientHeight;

      // 1. Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x061325); // Deep Space Navy
      scene.fog = new THREE.FogExp2(0x061325, 0.008);

      // 2. Camera setup
      const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
      if (cameraPreset === 'top') {
        camera.position.set(0, 58, 0.1);
      } else if (cameraPreset === 'isometric') {
        camera.position.set(38, 38, 38);
      } else {
        camera.position.set(0, 32, 44);
      }
      camera.lookAt(0, 0, 0);

      // 3. Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      // 4. Lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, isDroughtMode ? 0.9 : 0.7);
      scene.add(ambientLight);

      const rad = (sunAngle * Math.PI) / 180;
      const lightX = Math.cos(rad) * 45;
      const lightY = Math.sin(rad) * 45 + 10;
      const dirLight = new THREE.DirectionalLight(isDroughtMode ? 0xffea88 : 0xffffff, 1.1);
      dirLight.position.set(lightX, lightY, 20);
      scene.add(dirLight);

      // 5. Procedural DEM Terrain Mesh Generation matching Kabini Sub-basin
      const size = 34;
      const segments = 80;
      const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
      geometry.rotateX(-Math.PI / 2);

      const posAttribute = geometry.attributes.position;
      for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const z = posAttribute.getZ(i);
        // Realistic river valley & ridges
        const y = (Math.sin(x * 0.16) * Math.cos(z * 0.16) * 4.4 + Math.sin(x * 0.38 + z * 0.28) * 1.6) * verticalExaggeration;
        posAttribute.setY(i, y);
      }
      geometry.computeVertexNormals();

      // 6. Layer Color Mapping
      let meshColor = 0x2e7d32; // Default lush green

      if (isDroughtMode) {
        meshColor = 0xbcaaa4; // Parched dry earth
      } else {
        if (activeLayer === 'satellite') meshColor = 0x2e7d32;
        if (activeLayer === 'elevation') meshColor = 0x8d5b4c;
        if (activeLayer === 'vegetation') meshColor = 0x10b981;
        if (activeLayer === 'soil') meshColor = 0xa1887f;
        if (activeLayer === 'water') meshColor = 0x0288d1;
        if (activeLayer === 'confidence') meshColor = 0x9333ea;
      }

      const terrainMaterial = new THREE.MeshStandardMaterial({
        color: meshColor,
        roughness: isDroughtMode ? 0.9 : 0.55,
        metalness: 0.15,
        wireframe: showWireframe || activeLayer === 'elevation',
        flatShading: true,
      });

      const terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
      scene.add(terrainMesh);

      // 7. Dynamic Hydrological Flood Water Plane
      const waterPlaneGeo = new THREE.PlaneGeometry(size * 1.05, size * 1.05);
      waterPlaneGeo.rotateX(-Math.PI / 2);
      const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x00bcd4,
        transparent: true,
        opacity: 0.65,
        roughness: 0.1,
        metalness: 0.8,
      });
      const waterPlane = new THREE.Mesh(waterPlaneGeo, waterMaterial);
      // Map flood slider (0 to 10m) to Y position (-2.2 to +3.5)
      const waterY = isDroughtMode ? -4.0 : (-2.2 + (floodLevel / 10) * 5.2);
      waterPlane.position.y = waterY;
      scene.add(waterPlane);

      // 8. Grid base helper
      const gridHelper = new THREE.GridHelper(48, 24, 0x10b981, 0x1e3a5f);
      gridHelper.position.y = -5.5;
      scene.add(gridHelper);

      // 9. Render & Animation loop
      let angle = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (autoRotate && cameraPreset === 'perspective') {
          angle += 0.0025;
          camera.position.x = Math.sin(angle) * 48;
          camera.position.z = Math.cos(angle) * 48;
          camera.lookAt(0, 0, 0);

          setHudCoords({
            x: parseFloat(camera.position.x.toFixed(1)),
            y: parseFloat(camera.position.y.toFixed(1)),
            z: parseFloat(camera.position.z.toFixed(1)),
          });
        }

        renderer.render(scene, camera);
      };
      animate();
    };

    document.body.appendChild(script);

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [activeLayer, autoRotate, cameraPreset, showWireframe, verticalExaggeration, floodLevel, isDroughtMode, sunAngle]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-scientific-800 shadow-2xl bg-scientific-950 flex flex-col">
      {/* Top 3D Control Bar */}
      <div className="bg-scientific-900 border-b border-scientific-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-20">
        
        {/* Layer Switcher */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          <span className="flex items-center space-x-1 font-bold text-white font-mono mr-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Layer:</span>
          </span>
          {(['satellite', 'elevation', 'vegetation', 'soil', 'water', 'confidence'] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-2.5 py-1 rounded capitalize font-mono text-[11px] font-semibold transition-all ${
                activeLayer === layer
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-scientific-800 text-scientific-300 hover:text-white hover:bg-scientific-700'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* Camera Views & Wireframe */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="flex items-center space-x-1 bg-scientific-950 p-1 rounded border border-scientific-800">
            <button
              onClick={() => { setCameraPreset('perspective'); setAutoRotate(true); }}
              className={`px-2 py-0.5 rounded text-[11px] ${
                cameraPreset === 'perspective' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
              }`}
            >
              360° Orbit
            </button>
            <button
              onClick={() => { setCameraPreset('top'); setAutoRotate(false); }}
              className={`px-2 py-0.5 rounded text-[11px] ${
                cameraPreset === 'top' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
              }`}
            >
              Top-Down
            </button>
            <button
              onClick={() => { setCameraPreset('isometric'); setAutoRotate(false); }}
              className={`px-2 py-0.5 rounded text-[11px] ${
                cameraPreset === 'isometric' ? 'bg-cyan-600 text-white font-bold' : 'text-scientific-400 hover:text-white'
              }`}
            >
              Isometric
            </button>
          </div>

          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`px-2.5 py-1 rounded text-[11px] transition-colors border ${
              showWireframe ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-scientific-800 text-scientific-400 border-scientific-700'
            }`}
          >
            Contours
          </button>
        </div>
      </div>

      {/* 3D Canvas with Real-Time HUD & Interactive Scenario Sliders */}
      <div className="relative w-full flex-1">
        
        {/* Scenario Controls Box (Top Left Inside Canvas) */}
        <div className="absolute top-3 left-3 z-20 bg-scientific-950/85 backdrop-blur-md border border-scientific-800/80 rounded-xl p-3 text-xs font-mono space-y-2.5 shadow-xl max-w-xs">
          <div className="flex items-center space-x-1.5 text-cyan-400 font-bold border-b border-scientific-800 pb-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>3D Physical Scenarios</span>
          </div>

          {/* Flood Inundation Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-scientific-300">
              <span className="flex items-center space-x-1">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>Flood Surge:</span>
              </span>
              <strong className="text-white">+{floodLevel}m</strong>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={floodLevel}
              onChange={(e) => setFloodLevel(parseInt(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-scientific-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Drought Stress Mode */}
          <div className="flex items-center justify-between pt-1">
            <span className="flex items-center space-x-1 text-[11px] text-scientific-300">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>Drought Desiccation:</span>
            </span>
            <button
              onClick={() => setIsDroughtMode(!isDroughtMode)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                isDroughtMode ? 'bg-amber-600 text-white' : 'bg-scientific-800 text-scientific-400'
              }`}
            >
              {isDroughtMode ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Sun Lighting Angle Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-scientific-300">
              <span className="flex items-center space-x-1">
                <Sun className="w-3 h-3 text-amber-300" />
                <span>Solar Azimuth:</span>
              </span>
              <strong className="text-white">{sunAngle}°</strong>
            </div>
            <input
              type="range"
              min="15"
              max="165"
              step="5"
              value={sunAngle}
              onChange={(e) => setSunAngle(parseInt(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-scientific-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Telemetry HUD (Top Right Inside Canvas) */}
        <div className="absolute top-3 right-3 z-20 bg-scientific-950/85 backdrop-blur-md border border-scientific-800/80 rounded-xl p-3 text-[11px] font-mono space-y-1 shadow-xl text-scientific-300">
          <div className="text-emerald-400 font-bold border-b border-scientific-800 pb-1 mb-1.5 flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Kabini Digital Twin HUD</span>
          </div>
          <div>Peak Crest: <strong className="text-white">1,620m MSL</strong></div>
          <div>Valley Floor: <strong className="text-white">680m MSL</strong></div>
          <div>Cam Orbit: <strong className="text-cyan-400">[{hudCoords.x}, {hudCoords.y}, {hudCoords.z}]</strong></div>
          <div>Vertical Relief: <strong className="text-amber-400">{verticalExaggeration}x</strong></div>
        </div>

        {/* Three.js Container */}
        <div ref={containerRef} style={{ height }} className="w-full bg-scientific-950" />

        {/* Bottom Information Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-scientific-950/90 backdrop-blur-md border-t border-scientific-800 px-4 py-2 text-xs flex items-center justify-between text-scientific-300 font-mono">
          <div className="flex items-center space-x-2">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>CartoDEM 30m Resampled to 10m Physics Grid (EPSG:4326)</span>
          </div>
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            {isDroughtMode ? 'DROUGHT SIMULATION' : (floodLevel > 0 ? `FLOOD SIMULATION (+${floodLevel}M)` : `${activeLayer.toUpperCase()} MODE`)}
          </span>
        </div>
      </div>
    </div>
  );
};

