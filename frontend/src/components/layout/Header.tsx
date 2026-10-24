import React from 'react';
import { Activity, ShieldCheck, Database, Globe, Sun, Moon, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { HealthStatus, Watershed } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  health?: HealthStatus;
  activeWatershed?: Watershed;
}

export const Header: React.FC<HeaderProps> = ({ health, activeWatershed }) => {
  const { user, logout, theme, toggleTheme, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-scientific-900 border-b border-scientific-800 px-6 flex items-center justify-between shadow-md z-30 transition-colors">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 bg-emerald-950 border border-emerald-700/60 rounded-lg group-hover:border-emerald-500 transition-colors">
            <Globe className="w-6 h-6 text-emerald-400 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-wide">
                BHŪ-TATTVA-ANVEṢA
              </h1>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                v1.0 Operational
              </span>
            </div>
            <p className="text-xs text-scientific-400 hidden sm:block">
              Intelligent 3D Soil & Environmental Nexus System
            </p>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        {/* Active Watershed Badge */}
        {activeWatershed && (
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-scientific-800 border border-scientific-700 rounded-full text-scientific-200 font-mono">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{activeWatershed.name}</span>
          </div>
        )}

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 bg-scientific-800 hover:bg-scientific-700 border border-scientific-700 rounded-md text-scientific-200 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Health Status Indicator */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-700/50 rounded-full text-emerald-300 font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>STATUS: ONLINE</span>
        </div>

        {/* User Account / Auth Section */}
        {user ? (
          <div className="flex items-center space-x-2 bg-scientific-800/90 border border-scientific-700 rounded-full py-1 pl-3 pr-1.5 text-scientific-200 font-mono">
            <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-white text-xs">{user.username}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${isAdmin ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'}`}>
              {user.role}
            </span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              title="Logout"
              className="p-1 hover:bg-scientific-700 rounded-full text-scientific-400 hover:text-red-400 transition-colors ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-mono text-xs font-semibold transition-colors shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
};
