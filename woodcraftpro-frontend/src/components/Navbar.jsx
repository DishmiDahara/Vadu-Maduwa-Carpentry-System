import React, { useState } from 'react';
import { PhoneCall, ShieldCheck, UserCheck, LogOut, Globe, Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';

export default function Navbar({ activeTab, setActiveTab, onOpenInquiry, adminUser, onLogout }) {
  const { lang, setLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('home') || 'Home', action: 'home' },
    { id: 'about', label: t('aboutUs') || 'About Us', action: 'about' },
    { id: 'catalog', label: t('catalog') || 'Catalog', action: 'catalog' },
    { id: 'services', label: t('services') || 'Services', action: 'services' },
    { id: 'gallery', label: t('gallery') || 'Gallery', action: 'gallery' },
    { id: 'contact', label: t('contact') || 'Contact', action: 'contact' },
  ];

  const handleNavClick = (action) => {
    setActiveTab(action);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-200/50 shadow-sm transition-all bg-white/90 backdrop-blur-md">
      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
        
        {/* Left Section: Mobile Menu Toggle */}
        <div className="flex items-center">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#C68B59] hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Logo (Centered on Mobile, Left-aligned on Desktop) */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0 flex items-center cursor-pointer group py-1"
        >
          {logoImg && (
            <img 
              src={logoImg} 
              alt="වඩු මඩුව Carpentry Workshop" 
              className="h-14 sm:h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
          )}
        </div>

        {/* Center Section: Navigation Links with Integrated Language Select */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-full border border-gray-200 shadow-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.action)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeTab === item.action
                  ? 'bg-white text-[#C68B59] shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Divider */}
          <div className="h-5 w-px bg-gray-300 mx-1" />

          {/* Language Selector Dropdown directly inside Navbar */}
          <div className="relative flex items-center bg-white px-3 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:border-[#C68B59] transition-colors cursor-pointer group">
            <Globe className="w-3.5 h-3.5 text-[#C68B59] mr-1.5" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-gray-800 font-bold outline-none cursor-pointer pr-4 appearance-none text-xs z-10"
            >
              <option value="SI">සිංහල (SI)</option>
              <option value="EN">English (EN)</option>
              <option value="TA">தமிழ் (TA)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 pointer-events-none group-hover:text-[#C68B59] transition-colors" />
          </div>
        </nav>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenInquiry}
            className="flex items-center gap-2 bg-[#20120A] hover:bg-[#321C0F] text-white px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-[#C68B59]" />
            <span>අමතන්න</span>
          </button>

          {adminUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-semibold transition-all border ${
                  activeTab === 'admin-dashboard'
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
          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-200 mb-2">
            <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#C68B59]" />
              Language / භාෂාව
            </span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none"
            >
              <option value="SI">සිංහල (SI)</option>
              <option value="EN">English (EN)</option>
              <option value="TA">தமிழ் (TA)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.action)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between ${
                  activeTab === item.action
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
