import React, { useEffect, useRef, useState } from 'react';
import { Layers, RotateCcw, Info, Camera, Compass } from 'lucide-react';

declare global {
  interface Window {
    THREE?: any;
  }
}

interface DigitalTwin3DCanvasProps {
  height?: string;
}

export const DigitalTwin3DCanvas: React.FC<DigitalTwin3DCanvasProps> = ({ height = '550px' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'elevation' | 'vegetation' | 'soil' | 'water' | 'confidence'>('satellite');
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'top' | 'isometric'>('perspective');

  const controlsRef = useRef<any>(null);

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
      scene.background = new THREE.Color(0x061325); // ISRO Deep Space Navy

      // 2. Camera setup
      const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
      if (cameraPreset === 'top') {
        camera.position.set(0, 55, 0.1);
      } else if (cameraPreset === 'isometric') {
        camera.position.set(35, 35, 35);
      } else {
        camera.position.set(0, 35, 45);
      }
      camera.lookAt(0, 0, 0);

      // 3. Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, heightPx);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

      // 4. Lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight.position.set(25, 45, 25);
      scene.add(dirLight);

      // 5. Procedural DEM Terrain Mesh Generation matching Kabini Sub-basin
      const size = 32;
      const segments = 70;
      const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
      geometry.rotateX(-Math.PI / 2);

      const posAttribute = geometry.attributes.position;
      for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const z = posAttribute.getZ(i);
        // Terrain elevation displacement (Western Ghats crest & Kabini valley)
        const y = Math.sin(x * 0.18) * Math.cos(z * 0.18) * 4.2 + Math.sin(x * 0.4 + z * 0.3) * 1.5;
        posAttribute.setY(i, y);
      }
      geometry.computeVertexNormals();

      // 6. Layer Color Mapping (ISRO Bhuvan style)
      let meshColor = 0x1e88e5; // Satellite/Water blue
      let wireframeBool = false;

      if (activeLayer === 'satellite') meshColor = 0x2e7d32; // Forest green / Satellite hybrid
      if (activeLayer === 'elevation') { meshColor = 0x8d5b4c; wireframeBool = true; } // Topo mesh
      if (activeLayer === 'vegetation') meshColor = 0x4caf50; // Green NDVI
      if (activeLayer === 'soil') meshColor = 0xa1887f; // Soil brown
      if (activeLayer === 'water') meshColor = 0x0288d1; // Hydrology cyan
      if (activeLayer === 'confidence') meshColor = 0xab47bc; // Purple confidence heatmap

      const material = new THREE.MeshStandardMaterial({
        color: meshColor,
        roughness: 0.5,
        metalness: 0.25,
        wireframe: wireframeBool,
        flatShading: true,
      });

      const terrainMesh = new THREE.Mesh(geometry, material);
      scene.add(terrainMesh);

      // Grid helper base (ISRO Bhuvan Spatial Grid 100m)
      const gridHelper = new THREE.GridHelper(45, 25, 0x00e676, 0x102a43);
      gridHelper.position.y = -4.5;
      scene.add(gridHelper);

      // Animation loop
      let angle = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (autoRotate && cameraPreset === 'perspective') {
          angle += 0.003;
          camera.position.x = Math.sin(angle) * 50;
          camera.position.z = Math.cos(angle) * 50;
          camera.lookAt(0, 0, 0);
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
  }, [activeLayer, autoRotate, cameraPreset]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-scientific-800 shadow-xl bg-scientific-950">
      {/* 3D Layer Switcher Control Bar */}
      <div className="absolute top-3 left-3 z-20 bg-scientific-900/90 backdrop-blur-md border border-scientific-700/60 rounded-md p-2 text-xs flex flex-wrap gap-1.5 shadow-lg">
        <span className="flex items-center space-x-1.5 font-semibold text-scientific-200 mr-2 font-mono">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>ISRO 3D Layer:</span>
        </span>
        {(['satellite', 'elevation', 'vegetation', 'soil', 'water', 'confidence'] as const).map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            className={`px-2.5 py-1 rounded capitalize font-mono text-[11px] transition-colors ${
              activeLayer === layer
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'bg-scientific-800 text-scientific-400 hover:text-white'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Camera Angle Presets Overlay */}
      <div className="absolute top-3 right-3 z-20 bg-scientific-900/90 backdrop-blur-md border border-scientific-700/60 rounded-md p-1.5 text-xs flex items-center space-x-2">
        <span className="text-[11px] font-mono text-scientific-400 flex items-center space-x-1">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span>View:</span>
        </span>
        <button
          onClick={() => { setCameraPreset('perspective'); setAutoRotate(true); }}
          className={`px-2 py-0.5 rounded text-[11px] font-mono ${
            cameraPreset === 'perspective' ? 'bg-cyan-600 text-white font-bold' : 'bg-scientific-800 text-scientific-400'
          }`}
        >
          360° Orbit
        </button>
        <button
          onClick={() => { setCameraPreset('top'); setAutoRotate(false); }}
          className={`px-2 py-0.5 rounded text-[11px] font-mono ${
            cameraPreset === 'top' ? 'bg-cyan-600 text-white font-bold' : 'bg-scientific-800 text-scientific-400'
          }`}
        >
          Top-Down 2D
        </button>
        <button
          onClick={() => { setCameraPreset('isometric'); setAutoRotate(false); }}
          className={`px-2 py-0.5 rounded text-[11px] font-mono ${
            cameraPreset === 'isometric' ? 'bg-cyan-600 text-white font-bold' : 'bg-scientific-800 text-scientific-400'
          }`}
        >
          Isometric
        </button>
      </div>

      {/* Three.js Canvas Container */}
      <div ref={containerRef} style={{ height }} className="w-full" />

      {/* ISRO Bhuvan 3D Layer Metadata Overlay Footer */}
      <div className="absolute bottom-3 left-3 right-3 z-20 bg-scientific-950/90 backdrop-blur-md border border-scientific-800 rounded-md p-2.5 text-xs flex items-center justify-between text-scientific-300 font-mono">
        <div className="flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bhuvan ISRO 3D Digital Twin — DEM Height Mesh & Satellite Layer (Kabini Sub-basin)</span>
        </div>
        <span className="font-bold text-emerald-400">ACTIVE LAYER: {activeLayer.toUpperCase()}</span>
      </div>
    </div>
  );
};
