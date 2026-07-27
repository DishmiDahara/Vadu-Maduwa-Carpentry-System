import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLoginPage({ onLoginSuccess, setActiveTab }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(username, password);
      onLoginSuccess(data);
      setActiveTab('admin-dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 space-y-6 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C68B59] to-[#8B4513]"></div>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-50 text-[#C68B59] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-gray-900">Admin Portal Login</h2>
          <p className="text-xs text-gray-500">WoodCraftPro Workshop Management Desk</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C68B59] focus:ring-2 focus:ring-[#C68B59]/20 outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C68B59] focus:ring-2 focus:ring-[#C68B59]/20 outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl text-[11px] text-amber-800 space-y-0.5">
            <p className="font-bold">Demo Credentials:</p>
            <p>Username: <code className="font-mono bg-white px-1.5 py-0.5 rounded">admin</code> | Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded">admin123</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1F26] hover:bg-black text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
            <ArrowRight className="w-4 h-4 text-[#C68B59]" />
          </button>
        </form>

      </div>
    </div>
  );
}
