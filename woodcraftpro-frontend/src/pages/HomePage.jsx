import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  PhoneCall, 
  MapPin, 
  DoorClosed, 
  Kanban, 
  ChefHat, 
  BedDouble, 
  UtensilsCrossed, 
  Armchair, 
  Award, 
  Users 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

import TrustProofSection from '../components/TrustProofSection';
import { Sparkles, Hammer } from 'lucide-react';

export default function HomePage({ setActiveTab, onSelectProductForQuote, onOpenInquiry }) {
  const { t } = useLanguage();

  // 6 Specialization dark photo cards matching user mockup exactly
  const specializationCards = [
    {
      title: t('mainDoors'),
      icon: DoorClosed,
      image: '/banner_crafts/door_main.jpg',
      action: 'catalog'
    },
    {
      title: t('staircases'),
      icon: Kanban,
      image: '/banner_crafts/staircase_main.jpg',
      action: 'catalog'
    },
    {
      title: t('pantryKitchens'),
      icon: ChefHat,
      image: '/banner_crafts/pantry_main.jpg',
      action: 'catalog'
    },
    {
      title: t('bedroomsCategory'),
      icon: BedDouble,
      image: '/banner_crafts/card_bedroom.jpg',
      action: 'catalog'
    },
    {
      title: t('diningSets'),
      icon: UtensilsCrossed,
      image: '/banner_crafts/card_dining.jpg',
      action: 'catalog'
    },
    {
      title: t('furnitureCategory'),
      icon: Armchair,
      image: '/banner_crafts/card_furniture.jpg',
      action: 'catalog'
    },
  ];

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent('Hi වඩු මඩුව (Vadu Maduwa), I would like to inquire about your custom teak & wooden furniture.');
    window.open(`https://wa.me/94773769849?text=${text}`, '_blank');
  };

  const handleLocationClick = () => {
    // Open Google Maps directions for Dodangoda / Kalutara Showroom
    window.open('https://maps.google.com/?q=Dodangoda+Kalutara+Sri+Lanka', '_blank');
  };

  return (
    <div className="bg-[#0B0C0E] text-white font-sans min-h-screen pb-28">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 pt-3">
        
        {/* ========================================================
            1. HERO SECTION (Full-Photo Background Lit Staircase Hero)
           ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 min-h-[520px] sm:min-h-[580px] flex items-center">
          
          {/* High-Resolution Illuminated Staircase Background Photo */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
            style={{ backgroundImage: `url('/hero_staircase_bg.png')` }}
          ></div>

          {/* Dark luxury radial & linear vignette gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-black/40"></div>

          {/* Hero Content Panel */}
          <div className="relative z-10 max-w-2xl px-5 sm:px-10 py-10 sm:py-14 space-y-6">
            
            {/* 15+ Years Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1A1815]/80 backdrop-blur-md border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 tracking-wide uppercase shadow-lg">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t('yearsCraftsmanship')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading leading-[1.15] text-white tracking-tight">
              {t('craftingTimeless')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D99B6A] via-[#E6B78E] to-[#C68B59]">
                {t('woodenInteriors')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-xs sm:text-base leading-relaxed font-normal max-w-xl">
              {t('heroDescMockup')}
            </p>

            {/* Stacked / Inline Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-[#B87A46] hover:bg-[#a06838] text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl hover:shadow-amber-950/50 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer border border-amber-400/30"
              >
                <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                <span>{t('customIdeaNav')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-[#121418]/90 hover:bg-black/80 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 backdrop-blur-md active:scale-95 cursor-pointer"
              >
                <span>{t('browseCatalog')}</span>
              </button>
            </div>

            {/* Social Proof & Rating Row */}
            <div className="pt-1 flex items-center gap-2.5 text-xs text-gray-300">
              <div className="flex text-amber-400 font-bold">
                <span>⭐⭐⭐⭐⭐</span>
              </div>
              <span className="text-white font-extrabold text-sm">4.9/5</span>
              <span className="text-gray-400 font-medium">• {t('trustedFamilies')}</span>
            </div>

          </div>

        </section>


        {/* ========================================================
            2. "BRING YOUR OWN IDEA" PROMINENT FEATURE BANNER
           ======================================================== */}
        <section className="bg-gradient-to-r from-[#181A22] via-[#241F1A] to-[#181A22] rounded-3xl p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-[11px] font-extrabold text-amber-300 uppercase tracking-widest">
              <Hammer className="w-3.5 h-3.5 text-amber-400" />
              <span>Custom Idea Request & Live Estimator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight">
              ඔබගේ හිතේ තියෙන ඕනෑම Idea එකක් Design කර ගෘහ භාණ්ඩ සාදාගන්න!
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Pinterest photo එකක් හෝ Sketch එකක් අප වෙත එවන්න. ඔබගේ ඉඩකඩට සහ බජට් එකට ගැළපෙන ලී වර්ගයෙන් (Teak/Mahogany) සාදා දෙනු ලැබේ.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <button
              onClick={() => setActiveTab('custom-order')}
              className="bg-gradient-to-r from-[#C68B59] to-[#B87A46] hover:from-[#b07646] hover:to-[#a06838] text-white px-8 py-4 rounded-2xl font-extrabold text-sm shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/40"
            >
              <span>{t('customIdeaNav')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>


        {/* ========================================================
            3. 3-COLUMN STATS CARD (Dark Elevated Glass Card)
           ======================================================== */}
        <section>
          <div className="bg-[#14161D]/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl grid grid-cols-3 gap-3 text-center divide-x divide-white/10">
            
            <div className="px-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold font-heading text-white">1200+</h3>
              <p className="text-xs text-gray-400 font-medium">{t('projectsStat')}</p>
            </div>

            <div className="px-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold font-heading text-white">15+</h3>
              <p className="text-xs text-gray-400 font-medium">{t('yearsExperience')}</p>
            </div>

            <div className="px-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold font-heading text-white">100%</h3>
              <p className="text-xs text-gray-400 font-medium">{t('genuineTeak')}</p>
            </div>

          </div>
        </section>


        {/* ========================================================
            4. "WHAT WE SPECIALIZE IN" (6 Dark Image Cards)
           ======================================================== */}
        <section className="pt-2">
          
          {/* Section Header with Golden Accent Lines */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/60"></div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-wide">
                — {t('whatWeSpecializeIn')} —
              </h2>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/60"></div>
            </div>
          </div>

          {/* 6 Dark Image Cards Grid (2 cols mobile, 3 cols desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
            {specializationCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTab(card.action)}
                  className="group relative rounded-2xl overflow-hidden h-44 sm:h-52 cursor-pointer shadow-xl border border-white/10 flex flex-col justify-between p-4 transition-all duration-500 hover:border-amber-500/50 hover:shadow-amber-950/30"
                >
                  {/* Background Photo */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 group-hover:from-black/95 transition-colors"></div>

                  {/* Card Content Overlay */}
                  <div className="relative z-10 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 backdrop-blur-md text-amber-400 flex items-center justify-center">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors drop-shadow-md">
                      {card.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

        </section>


        {/* ========================================================
            5. TRUST & PROOF SECTION (Timber Certifications & Reviews)
           ======================================================== */}
        <TrustProofSection onOpenCustomOrder={() => setActiveTab('custom-order')} />

      </div>

      {/* ========================================================
          4. FIXED BOTTOM STICKY NAVIGATION BAR (Matching Mockup)
         ======================================================== */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-md sm:w-full z-50 bg-[#16181E]/95 backdrop-blur-xl border border-white/20 py-3 px-6 rounded-full shadow-2xl flex items-center justify-around text-white">
        
        <button
          onClick={handleWhatsAppClick}
          className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 flex items-center justify-center text-emerald-400 transition-colors">
            <MessageCircle className="w-4.5 h-4.5 fill-emerald-400/20" />
          </div>
          <span className="text-[11px] font-semibold text-gray-200 group-hover:text-white transition-colors">
            {t('whatsappNav')}
          </span>
        </button>

        <button
          onClick={() => window.open('tel:0773769849')}
          className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/20 group-hover:bg-amber-500/30 flex items-center justify-center text-amber-400 transition-colors">
            <PhoneCall className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-semibold text-gray-200 group-hover:text-white transition-colors">
            {t('callNow')}
          </span>
        </button>

        <button
          onClick={handleLocationClick}
          className="flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 flex items-center justify-center text-blue-400 transition-colors">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-semibold text-gray-200 group-hover:text-white transition-colors">
            {t('locationNav')}
          </span>
        </button>

      </div>

    </div>
  );
}
