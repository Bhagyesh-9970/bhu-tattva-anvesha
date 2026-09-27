import React, { useState } from 'react';
import { Network, Database, Info, Search, Terminal } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  name: string;
  type?: string;
  x: number;
  y: number;
  color: string;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
}

const initialNodes: GraphNode[] = [
  { id: 'ws_1', label: 'Watershed', name: 'Kabini Sub-basin', x: 250, y: 150, color: '#10b981' },
  { id: 'riv_1', label: 'River', name: 'Kabini River', x: 100, y: 80, color: '#1e88e5' },
  { id: 'soil_1', label: 'SoilRegion', name: 'HD Kote Red Laterite Zone', x: 120, y: 240, color: '#8d5b4c' },
  { id: 'veg_1', label: 'VegetationRegion', name: 'Moist Deciduous Canopy', x: 400, y: 80, color: '#4caf50' },
  { id: 'sens_1', label: 'Sensor', name: 'KAB-SOIL-01 Station', x: 400, y: 250, color: '#0288d1' },
  { id: 'var_1', label: 'EnvironmentalVariable', name: 'Topsoil Moisture (%)', x: 250, y: 320, color: '#ab47bc' },
  { id: 'risk_1', label: 'Risk', name: 'Seasonal Soil Deficit', x: 100, y: 360, color: '#fb8c00' },
];

const initialEdges: GraphEdge[] = [
  { source: 'ws_1', target: 'riv_1', type: 'CONTAINS' },
  { source: 'ws_1', target: 'soil_1', type: 'CONTAINS' },
  { source: 'ws_1', target: 'veg_1', type: 'CONTAINS' },
  { source: 'ws_1', target: 'sens_1', type: 'HAS_SENSOR' },
  { source: 'sens_1', target: 'var_1', type: 'OBSERVES' },
  { source: 'soil_1', target: 'var_1', type: 'MEASURES' },
  { source: 'var_1', target: 'risk_1', type: 'AFFECTS' },
];

export const GraphExplorer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(initialNodes[0]);
  const [cypherQuery, setCypherQuery] = useState(
    'MATCH (w:Watershed)-[r:HAS_SENSOR]->(s:Sensor) RETURN w.name, s.name, s.type'
  );

  const nodeMap = new Map(initialNodes.map((n) => [n.id, n]));

  return (
    <div className="space-y-6">
      <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-scientific-800 pb-3">
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Network className="w-4 h-4 text-emerald-400" />
            <span>Neo4j Environmental Knowledge Graph Subgraph</span>
          </h2>
          <span className="text-xs font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800/60">
            GRAPH ENGINE ONLINE
          </span>
        </div>

        {/* Graph Canvas & Side Inspector Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-scientific-950 rounded-lg border border-scientific-800 relative h-[420px] flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full">
              {/* Render Edges */}
              {initialEdges.map((edge, idx) => {
                const src = nodeMap.get(edge.source);
                const tgt = nodeMap.get(edge.target);
                if (!src || !tgt) return null;
                const midX = (src.x + tgt.x) / 2;
                const midY = (src.y + tgt.y) / 2;

                return (
                  <g key={idx}>
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke="#334e68"
                      strokeWidth="2"
                      strokeDasharray="4, 4"
                    />
                    <text
                      x={midX}
                      y={midY}
                      fill="#829ab1"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      dy="-4"
                    >
                      {edge.type}
                    </text>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {initialNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedNode(node)}
                  >
                    <circle
                      r={isSelected ? "18" : "14"}
                      fill={node.color}
                      stroke={isSelected ? "#ffffff" : "#102a43"}
                      strokeWidth={isSelected ? "3" : "2"}
                    />
                    <text
                      y="26"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.name}
                    </text>
                    <text
                      y="38"
                      textAnchor="middle"
                      fill="#829ab1"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      :{node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Side Entity Inspector */}
          <div className="bg-scientific-950 border border-scientific-800 rounded-lg p-4 font-mono text-xs space-y-4">
            <div className="border-b border-scientific-800 pb-2 flex items-center justify-between">
              <span className="text-scientific-400 font-sans font-semibold uppercase text-[11px]">
                Entity Inspector
              </span>
              <span className="px-2 py-0.5 bg-scientific-800 rounded text-cyan-400 text-[10px]">
                :{selectedNode.label}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-scientific-400">Node ID: </span>
                <span className="text-white font-bold">{selectedNode.id}</span>
              </div>
              <div>
                <span className="text-scientific-400">Entity Name: </span>
                <span className="text-emerald-400 font-bold">{selectedNode.name}</span>
              </div>
              <div>
                <span className="text-scientific-400">Spatial Context: </span>
                <span className="text-scientific-200">Kabini River Watershed</span>
              </div>
              <div>
                <span className="text-scientific-400">Provenance Flag: </span>
                <span className="text-amber-400 font-bold">synthetic_demo_data: true</span>
              </div>
            </div>

            <div className="pt-3 border-t border-scientific-800 space-y-2">
              <div className="text-scientific-400 font-sans font-semibold text-[11px] uppercase">
                Active Connections ({initialEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length})
              </div>
              {initialEdges
                .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                .map((e, idx) => (
                  <div key={idx} className="p-2 bg-scientific-900 rounded border border-scientific-800 text-[11px]">
                    <span className="text-cyan-400">{e.source}</span>
                    <span className="text-scientific-400"> -[{e.type}]-&gt; </span>
                    <span className="text-emerald-400">{e.target}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Cypher Query Console */}
        <div className="pt-3 border-t border-scientific-800 space-y-2">
          <label className="text-xs font-semibold text-white flex items-center space-x-1.5">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Cypher Graph Console</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={cypherQuery}
              onChange={(e) => setCypherQuery(e.target.value)}
              className="flex-1 bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-xs font-mono text-emerald-300 focus:outline-none focus:border-cyan-500"
            />
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold font-mono">
              Execute Cypher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
