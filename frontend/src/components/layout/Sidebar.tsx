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
  FileSpreadsheet,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigationItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Dashboard', path: '/dashboard', icon: SlidersHorizontal },
  { name: 'Interactive Map', path: '/map', icon: MapPin },
  { name: 'Sensor Fusion', path: '/fusion', icon: GitFork },
  { name: 'Digital Twin (3D)', path: '/digital-twin', icon: Box },
  { name: 'What-If Scenarios', path: '/scenarios', icon: Sliders },
  { name: 'Knowledge Graph', path: '/knowledge-graph', icon: Network },
  { name: 'AI Decision RAG', path: '/assistant', icon: Bot },
  { name: 'Data Sources', path: '/data-sources', icon: Database },
  { name: 'Model Evaluation', path: '/research', icon: FileSpreadsheet },
];

export const Sidebar: React.FC = () => {
  const { user, isAdmin } = useAuth();

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
                  `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-scientific-800 text-emerald-400 border-l-2 border-emerald-400 font-semibold'
                      : 'text-scientific-300 hover:bg-scientific-800/60 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </NavLink>
            );
          })}

          {/* Admin Portal link */}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors mt-2 ${
                isActive
                  ? 'bg-cyan-950/80 text-cyan-300 border-l-2 border-cyan-400 font-semibold'
                  : 'text-cyan-400/90 hover:bg-cyan-950/40 hover:text-cyan-300'
              }`
            }
          >
            <div className="flex items-center space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Admin Portal</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-800">
              {isAdmin ? 'ADMIN' : 'RESTRICTED'}
            </span>
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-scientific-800 text-[11px] text-scientific-400 font-mono space-y-1">
        <div className="flex items-center justify-between text-scientific-300">
          <span>Active Role:</span>
          <span className={`font-bold ${isAdmin ? 'text-amber-400' : 'text-emerald-400'}`}>
            {user?.role || 'GUEST'}
          </span>
        </div>
        <p>CRS: EPSG:4326 (WGS84)</p>
        <p>Grid Resolution: 100m</p>
      </div>
    </aside>
  );
};
