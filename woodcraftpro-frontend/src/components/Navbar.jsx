import React from 'react';
import { Hammer, PhoneCall, ShieldCheck, UserCheck, LogOut, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ activeTab, setActiveTab, onOpenInquiry, adminUser, onLogout }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-200/50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C68B59] to-[#8B4513] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Hammer className="w-6 h-6" />
          </div>
          <div>
            <span className="text-3xl brand-font-sinhala tracking-tight text-gray-900 group-hover:text-[#C68B59] transition-colors">
              {t('brandName')}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold -mt-1">
              {t('brandTag')}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-full border border-gray-200">
          {[
            { id: 'home', label: t('home') },
            { id: 'catalog', label: t('catalog') },
            { id: 'services', label: t('services') },
            { id: 'gallery', label: t('gallery') },
            { id: 'contact', label: t('contact') },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === item.id
                  ? 'bg-white text-[#C68B59] shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions & Trilingual Switcher */}
        <div className="flex items-center gap-2.5">
          
          {/* Trilingual Language Selector Dropdown */}
          <div className="relative flex items-center bg-gray-100 p-1 rounded-full border border-gray-200 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-[#C68B59] ml-2 mr-1" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-gray-800 font-bold outline-none cursor-pointer pr-2 py-1 text-xs"
            >
              <option value="SI">සිංහල (SI)</option>
              <option value="EN">English (EN)</option>
              <option value="TA">தமிழ் (TA)</option>
            </select>
          </div>

          <button
            onClick={onOpenInquiry}
            className="hidden sm:flex items-center gap-2 bg-[#C68B59] hover:bg-[#b07646] text-white px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            {t('requestQuote')}
          </button>

          {adminUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-[#1C1F26] text-white border-[#1C1F26]'
                    : 'bg-amber-50 text-[#8B4513] border-amber-200 hover:bg-amber-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                {t('adminDesk')}
              </button>
              <button
                onClick={onLogout}
                title="Logout Admin"
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('admin-login')}
              className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#C68B59] px-2.5 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-[#C68B59]" />
              {t('adminPortal')}
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
