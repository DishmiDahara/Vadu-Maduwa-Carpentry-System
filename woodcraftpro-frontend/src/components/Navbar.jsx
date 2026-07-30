import React, { useState } from 'react';
import { Hammer, PhoneCall, ShieldCheck, UserCheck, LogOut, Globe, Menu, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';

export default function Navbar({ activeTab, setActiveTab, onOpenInquiry, adminUser, onLogout }) {
  const { lang, setLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'custom-order', label: ` ${t('customIdeaNav')}`, action: 'custom-order', highlight: true },
    { id: 'catalog', label: `${t('catalog')} ▾`, action: 'catalog' },
    { id: 'gallery', label: t('projects'), action: 'gallery' },
    { id: 'services', label: t('aboutUs'), action: 'services' },
    { id: 'contact', label: t('contact'), action: 'contact' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#16181D]/95 backdrop-blur-xl border-b border-amber-900/20 text-white shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

        {/* Left Section: Brand Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-amber-200 hover:text-white hover:bg-amber-900/30 rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo Plaque */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer group py-1"
          >
            <img
              src={logoImg}
              alt="වඩු මඩුව Carpentry Workshop"
              className="h-10 sm:h-14 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-lg"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.action)}
              className={`px-3.5 py-1.5 text-sm font-medium transition-all rounded-xl ${activeTab === item.action
                  ? 'text-amber-400 font-semibold bg-white/10'
                  : 'text-gray-200 hover:text-white hover:bg-white/5'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions & Language Selector Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-3">

          {/* Trilingual Language Selector Pill (Mockup Match) */}
          <div className="flex items-center bg-white/10 hover:bg-white/15 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-white/15 text-[11px] sm:text-xs font-semibold text-white backdrop-blur-md transition-all">
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 mr-1 sm:mr-1.5" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer pr-0.5 py-0.5 text-[11px] sm:text-xs"
            >
              <option value="EN" className="bg-[#1C1F26] text-white">English</option>
              <option value="SI" className="bg-[#1C1F26] text-white">සිංහල</option>
              <option value="TA" className="bg-[#1C1F26] text-white">தமிழ்</option>
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
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-semibold transition-all border ${activeTab === 'admin-dashboard'
                    ? 'bg-[#1C1F26] text-white border-[#1C1F26]'
                    : 'bg-amber-50 text-[#8B4513] border-amber-200 hover:bg-amber-100'
                  }`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">{t('adminDesk')}</span>
              </button>
              <button
                onClick={onLogout}
                title="Logout Admin"
                className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('admin-login')}
              className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#C68B59] px-2.5 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-[#C68B59]" />
              {t('adminPortal')}
            </button>
          )}
        </div>

      </div>

      {/* Responsive Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between ${activeTab === item.id
                    ? 'bg-amber-50 text-[#C68B59] border border-amber-200/60'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-gray-400">➔</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenInquiry();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#C68B59] hover:bg-[#b07646] text-white py-3 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              {t('requestQuote')}
            </button>

            {!adminUser && (
              <button
                onClick={() => handleNavClick('admin-login')}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2.5 rounded-xl font-medium text-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#C68B59]" />
                {t('adminPortal')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
