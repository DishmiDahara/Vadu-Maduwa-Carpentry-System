import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Share2, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';

export default function Footer({ setActiveTab, onOpenInquiry }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1D1109] text-amber-100/80 pt-12 pb-8 border-t border-[#3D2415]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {logoImg && (
                <img src={logoImg} alt="වඩු මඩුව Logo" className="h-10 w-auto object-contain" />
              )}
              <div>
                <span className="font-heading font-black text-xl text-white block">{t('brandName')}</span>
                <span className="text-[9px] tracking-widest text-amber-300 uppercase block -mt-1">{t('brandTag')}</span>
              </div>
            </div>
            <p className="text-xs text-amber-200/70 leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-[#2B190E] border border-[#4A2E1B] flex items-center justify-center text-amber-300 hover:text-white hover:bg-[#8B5E3C] transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#2B190E] border border-[#4A2E1B] flex items-center justify-center text-amber-300 hover:text-white hover:bg-[#8B5E3C] transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://wa.me/94773769849" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#2B190E] border border-[#4A2E1B] flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#4A2E1B] pb-2">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition-colors">{t('home')}</button></li>
              <li><button onClick={() => setActiveTab('catalog')} className="hover:text-amber-400 transition-colors">{t('catalog')}</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition-colors">{t('services')}</button></li>
              <li><button onClick={() => setActiveTab('gallery')} className="hover:text-amber-400 transition-colors">{t('gallery')}</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition-colors">{t('contact')}</button></li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#4A2E1B] pb-2">{t('ourServices')}</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition-colors">{t('service1Title')}</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition-colors">{t('service2Title')}</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition-colors">{t('service3Title')}</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition-colors">{t('service4Title')}</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition-colors">{t('service5Title')}</button></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-[#4A2E1B] pb-2">{t('contactInfo')}</h4>
            <ul className="space-y-2.5 text-xs text-amber-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/yzoz7pPtRuo15tSK6" target="_blank" rel="noreferrer" className="hover:text-amber-400 underline transition-colors">
                  {t('addressValue')}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>077 376 9849 / 034 228 5162</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@wadumaduwa.lk</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t('workingHoursValue')}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 border-t border-[#3D2415] text-center text-xs text-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>{t('allRightsReserved')}</p>
          <p className="text-amber-300/50">{t('designedForCraftsmanship')}</p>
        </div>

      </div>
    </footer>
  );
}
