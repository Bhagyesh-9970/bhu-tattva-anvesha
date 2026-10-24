import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User as UserIcon, KeyRound, Globe, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await res.json();
      login(data.access_token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (role: 'ADMIN' | 'USER') => {
    if (role === 'ADMIN') {
      login('demo_admin_jwt_token', { id: 1, username: 'admin', email: 'admin@bhu-tattva.gov.in', role: 'ADMIN' });
    } else {
      login('demo_user_jwt_token', { id: 2, username: 'user', email: 'user@bhu-tattva.gov.in', role: 'USER' });
    }
    navigate('/');
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-6 bg-scientific-950">
      <div className="w-full max-w-md bg-scientific-900 border border-scientific-800 rounded-xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-950 border border-emerald-700/60 rounded-xl mb-2">
            <Globe className="w-8 h-8 text-emerald-400 animate-spin-slow" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">BHŪ-TATTVA-ANVEṢA</h1>
          <p className="text-xs text-scientific-400">
            Operational Environmental Intelligence System Login
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded text-center">
            {error}
          </div>
        )}

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-mono text-scientific-400 uppercase tracking-wider block text-center">
            1-Click Demo Quick Logins
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => quickDemoLogin('ADMIN')}
              className="px-3 py-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 rounded text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>👑 Login as Admin</span>
            </button>
            <button
              onClick={() => quickDemoLogin('USER')}
              className="px-3 py-2.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>🔬 Login as User</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-scientific-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-mono text-scientific-400">OR CREDENTIALS</span>
          <div className="flex-grow border-t border-scientific-800"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-scientific-300 flex items-center space-x-1">
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-xs text-white placeholder-scientific-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-scientific-300 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full bg-scientific-950 border border-scientific-800 rounded px-3 py-2 text-xs text-white placeholder-scientific-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded font-mono flex items-center justify-center space-x-2 transition-colors"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
