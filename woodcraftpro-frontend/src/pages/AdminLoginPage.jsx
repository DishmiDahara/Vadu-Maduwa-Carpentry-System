import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLoginPage({ onLoginSuccess, setActiveTab }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const performLogin = async (u, p) => {
    setError('');
    setLoading(true);
    try {
      const data = await api.login(u, p);
      onLoginSuccess(data);
      setActiveTab('admin-dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    performLogin(username, password);
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    performLogin('admin', 'admin123');
  };

  return (
    <div className="min-h-[680px] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-[#FAF4EB] via-[#F4ECE1] to-[#FAF4EB]">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#E8DEC8] space-y-6 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C68B59] via-[#8B4513] to-[#3D2415]"></div>

        {/* Back to Website Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6252] hover:text-[#2B190E] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-[#8B5E3C]" />
            <span>Return to Website (මුල් පිටුවට)</span>
          </button>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-[#8B5E3C] border border-amber-200">
            Staff Portal
          </span>
        </div>

        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 bg-[#FAF4EB] text-[#8B5E3C] rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-[#E8DEC8]">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black font-heading text-[#2B190E]">Admin Management Portal</h2>
          <p className="text-xs text-[#7A6252]">වඩු මඩුව | Carpentry Workshop Control Panel</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2B190E] uppercase tracking-wider mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#7A6252] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DEC8] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none text-sm font-medium bg-[#FAF4EB]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B190E] uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7A6252] absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E8DEC8] focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/20 outline-none text-sm font-medium bg-[#FAF4EB]/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-[11px] text-[#5C3A21] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Demo Credentials:
              </span>
              <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md font-medium">Pre-configured</span>
            </div>
            <p>Username: <code className="font-mono bg-white px-1.5 py-0.5 rounded font-bold border border-amber-200 text-[#2B190E]">admin</code> &bull; Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded font-bold border border-amber-200 text-[#2B190E]">admin123</code></p>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B190E] hover:bg-[#3D2415] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full bg-amber-100/70 hover:bg-amber-200 text-[#3D2415] py-2.5 rounded-xl font-bold text-xs transition-all border border-amber-300/80 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#8B5E3C]" />
              1-Click Quick Demo Login (ක්ෂණික පිවිසුම)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
