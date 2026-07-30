import React, { useState } from 'react';
import { ShieldCheck, UserCheck, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';

export default function Navbar({ activeTab, setActiveTab, onOpenInquiry, adminUser, onLogout }) {
  const { lang, setLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', action: 'home' },
    { id: 'catalog', label: 'Catalog', action: 'catalog' },
    { id: 'services', label: 'Services', action: 'services' },
    { id: 'gallery', label: 'Gallery', action: 'gallery' },
    { id: 'about', label: 'About Us', action: 'services' },
    { id: 'contact', label: 'Contact', action: 'contact' },
  ];

  const handleNavClick = (action) => {
    setActiveTab(action);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2B190E] border-b border-[#4A2E1B] text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

        {/* Left Section: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-amber-200 hover:text-white hover:bg-amber-900/30 rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer group py-1"
          >
            {logoImg && (
              <img
                src={logoImg}
                alt="වඩු මඩුව Wadu Maduwa"
                className="h-10 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            )}
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.action)}
              className={`px-3.5 py-1.5 text-sm font-medium transition-all rounded-lg ${
                activeTab === item.action
                  ? 'text-white bg-[#4A2E1B] font-semibold border border-amber-500/30'
                  : 'text-amber-100/90 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Section: Language Pills & Admin */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Language Selector Toggle Pills (Mockup Match: සිංහල | English | தமிழ்) */}
          <div className="bg-[#1D1109] border border-[#4A2E1B] p-1 rounded-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setLang('SI')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                lang === 'SI' ? 'bg-[#8B5E3C] text-white font-bold shadow' : 'text-amber-200/70 hover:text-white'
              }`}
            >
              සිංහල
            </button>
            <button
              onClick={() => setLang('EN')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                lang === 'EN' ? 'bg-[#8B5E3C] text-white font-bold shadow' : 'text-amber-200/70 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('TA')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                lang === 'TA' ? 'bg-[#8B5E3C] text-white font-bold shadow' : 'text-amber-200/70 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* Admin Dashboard / Login */}
          {adminUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-amber-400 text-[#2B190E] border-amber-300'
                    : 'bg-[#4A2E1B] text-amber-100 border-amber-700/50 hover:bg-[#5C3922]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </button>
              <button
                onClick={onLogout}
                title="Logout Admin"
                className="p-1.5 text-amber-200/70 hover:text-red-400 rounded-lg hover:bg-red-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('admin-login')}
              className="hidden lg:flex items-center gap-1.5 text-xs text-amber-200/80 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-amber-800/40"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Admin
            </button>
          )}

        </div>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#2B190E] border-b border-[#4A2E1B] px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.action)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-between ${
                activeTab === item.action
                  ? 'bg-[#8B5E3C] text-white'
                  : 'text-amber-100/90 hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs text-amber-300/50">➔</span>
            </button>
          ))}
          {!adminUser && (
            <button
              onClick={() => handleNavClick('admin-login')}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#1D1109] text-amber-200 py-2 rounded-lg font-medium text-xs border border-[#4A2E1B]"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Admin Portal
            </button>
          )}
        </div>
      )}
    </header>
  );
}
