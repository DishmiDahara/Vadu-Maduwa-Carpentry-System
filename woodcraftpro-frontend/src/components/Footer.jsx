import React from 'react';
import { Hammer, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';

export default function Footer({ setActiveTab, onOpenInquiry }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#121417] text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="text-3xl brand-font-sinhala text-white">{t('brandName')}</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-4 text-base">{t('exploreCategories')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-[#C68B59] transition-colors">{t('home')}</button></li>
              <li><button onClick={() => setActiveTab('catalog')} className="hover:text-[#C68B59] transition-colors">{t('catalog')}</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-[#C68B59] transition-colors">{t('services')}</button></li>
              <li><button onClick={() => setActiveTab('gallery')} className="hover:text-[#C68B59] transition-colors">{t('gallery')}</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-[#C68B59] transition-colors">{t('contact')}</button></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-heading font-semibold mb-4 text-base">{t('connectWithUs')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-[#C68B59] shrink-0 mt-0.5" />
                <span>No. 142, WoodCraft Industry Zone, Galle Road, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-[#C68B59] shrink-0" />
                <span>+94 (077) 123 4567 / +94 (011) 234 5678</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-[#C68B59] shrink-0" />
                <span>info@woodcraftpro.lk</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours & CTA */}
          <div className="space-y-4">
            <h4 className="text-white font-heading font-semibold text-base">{t('workingHours')}</h4>
            <div className="flex items-start gap-3 text-sm text-gray-400 bg-[#1C1F26] p-3.5 rounded-xl border border-gray-800">
              <Clock className="w-5 h-5 text-[#C68B59] shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Monday - Saturday</p>
                <p className="text-xs text-gray-400">8:30 AM - 6:00 PM</p>
                <p className="text-xs text-amber-500 font-semibold mt-1">Sunday: Appointment Only</p>
              </div>
            </div>
            <button
              onClick={onOpenInquiry}
              className="w-full bg-[#C68B59] hover:bg-[#b07646] text-white py-2.5 rounded-xl font-medium text-sm transition-all shadow-md"
            >
              {t('requestQuote')}
            </button>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {t('brandName')} Carpentry Workshop Management System. All rights reserved.</p>
          <p className="text-gray-400">Crafted with React.js & Java Spring Boot</p>
        </div>
      </div>
    </footer>
  );
}
