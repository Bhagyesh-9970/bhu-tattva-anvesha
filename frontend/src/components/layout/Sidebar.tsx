import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  SlidersHorizontal, 
  Box, 
  GitFork, 
  Network, 
  Bot, 
  Database, 
  FileSpreadsheet 
} from 'lucide-react';

const navigationItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Dashboard', path: '/dashboard', icon: SlidersHorizontal },
  { name: 'Interactive Map', path: '/map', icon: MapPin },
  { name: 'Sensor Fusion', path: '/fusion', icon: GitFork, badge: 'Phase 7' },
  { name: 'Digital Twin (3D)', path: '/digital-twin', icon: Box, badge: 'Phase 10' },
  { name: 'Knowledge Graph', path: '/knowledge-graph', icon: Network, badge: 'Phase 12' },
  { name: 'AI Decision RAG', path: '/assistant', icon: Bot, badge: 'Phase 13' },
  { name: 'Data Sources', path: '/data-sources', icon: Database },
  { name: 'Model Evaluation', path: '/research', icon: FileSpreadsheet },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-scientific-900 border-r border-scientific-800 flex flex-col justify-between select-none">
      <div className="py-4">
        <div className="px-4 mb-3 text-xs font-semibold text-scientific-400 uppercase tracking-wider">
          Navigation Menu
        </div>
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-scientific-800 text-emerald-400 border-l-2 border-emerald-400'
                      : 'text-scientific-300 hover:bg-scientific-800/60 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-scientific-800 text-scientific-400 rounded border border-scientific-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-scientific-800 text-[11px] text-scientific-400 font-mono">
        <p>CRS: EPSG:4326 (WGS84)</p>
        <p>Grid Resolution: 100m</p>
      </div>
    </aside>
  );
};
