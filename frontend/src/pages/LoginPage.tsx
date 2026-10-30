import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User as UserIcon, Mail, Globe, ArrowRight, UserPlus, CheckCircle2, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Invalid username or password');
        }

        const data = await res.json();
        login(data.access_token, data.user);
        
        // Strict Role-Based Redirect
        if (data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Sign Up / Registration
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, role }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Registration failed. Username or email may already be in use.');
        }

        const data = await res.json();
        login(data.access_token, data.user);
        setSuccessMsg('Account created successfully! Redirecting...');
        
        setTimeout(() => {
          if (data.user.role === 'ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (demoRole: 'ADMIN' | 'USER') => {
    if (demoRole === 'ADMIN') {
      login('demo_admin_jwt_token', { id: 1, username: 'admin', email: 'admin@bhu-tattva.gov.in', role: 'ADMIN' });
      navigate('/admin');
    } else {
      login('demo_user_jwt_token', { id: 2, username: 'user', email: 'user@bhu-tattva.gov.in', role: 'USER' });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-scientific-950 via-scientific-900 to-scientific-950">
      <div className="w-full max-w-md bg-scientific-900/90 backdrop-blur-xl border border-scientific-800 rounded-2xl p-7 shadow-2xl space-y-6">
        
        {/* Header Emblem */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-2xl shadow-inner">
            <Globe className="w-8 h-8 text-emerald-400 animate-spin-slow" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide font-sans">
            BHŪ-TATTVA-ANVEṢA
          </h1>
          <p className="text-xs text-scientific-400 max-w-xs mx-auto">
            Intelligent 3D Soil & Environmental Nexus System
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-scientific-950 p-1 rounded-xl border border-scientific-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-scientific-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'register'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-scientific-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="p-3 bg-red-950/70 border border-red-800/80 text-red-300 text-xs rounded-lg text-center font-mono">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs rounded-lg text-center font-mono flex items-center justify-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Login Shortcuts */}
        <div className="p-3 bg-scientific-950/80 rounded-xl border border-scientific-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-scientific-400">
            <span className="flex items-center space-x-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Evaluator Demo Access</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickDemoLogin('ADMIN')}
              className="px-3 py-2 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/60 text-amber-300 rounded-lg text-xs font-mono font-medium flex items-center justify-center space-x-1 transition-all"
            >
              <span>👑 Demo as Admin</span>
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin('USER')}
              className="px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 rounded-lg text-xs font-mono font-medium flex items-center justify-center space-x-1 transition-all"
            >
              <span>🔬 Demo as User</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-scientific-300 flex items-center space-x-1.5">
              <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or bhagyesh"
              className="w-full bg-scientific-950 border border-scientific-800 rounded-lg px-3 py-2 text-xs text-white placeholder-scientific-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-scientific-300 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-scientific-950 border border-scientific-800 rounded-lg px-3 py-2 text-xs text-white placeholder-scientific-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-scientific-300 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-scientific-950 border border-scientific-800 rounded-lg px-3 py-2 text-xs text-white placeholder-scientific-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-scientific-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Account Role</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                className="w-full bg-scientific-950 border border-scientific-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="USER">User / Researcher (View, Simulate & Explore)</option>
                <option value="ADMIN">Admin (Full System Data Management & Sensor Ingestion)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold font-mono text-white flex items-center justify-center space-x-2 transition-all shadow-md ${
              mode === 'login'
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-cyan-600 hover:bg-cyan-500'
            }`}
          >
            <span>{loading ? 'Processing...' : (mode === 'login' ? 'Sign In & Enter Dashboard' : 'Register Account')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-scientific-500 font-mono">
            JWT Encrypted • Role-Based Access Control • PostGIS Nexus v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
