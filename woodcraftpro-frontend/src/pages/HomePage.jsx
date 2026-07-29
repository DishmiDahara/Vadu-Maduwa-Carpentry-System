import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  DoorClosed, 
  Kanban, 
  ChefHat, 
  BedDouble, 
  UtensilsCrossed, 
  Armchair, 
  Ruler, 
  PenTool, 
  Award, 
  Wrench, 
  Headphones,
  Users,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({ setActiveTab, onSelectProductForQuote, onOpenInquiry }) {
  const { t } = useLanguage();

  // Desktop quick category strip
  const quickCategories = [
    { label: t('doorsCategory'), icon: DoorClosed },
    { label: t('staircasesCategory'), icon: Kanban },
    { label: t('pantryCategory'), icon: ChefHat },
    { label: t('bedroomsCategory'), icon: BedDouble },
    { label: t('diningCategory'), icon: UtensilsCrossed },
    { label: t('furnitureCategory'), icon: Armchair },
  ];

  // Mobile 3x2 "Our Services" grid cards matching mockup
  const mobileServices = [
    { label: t('doorsCategory'), icon: DoorClosed, action: 'catalog' },
    { label: t('staircasesCategory'), icon: Kanban, action: 'catalog' },
    { label: t('pantryKitchens'), icon: ChefHat, action: 'catalog' },
    { label: t('bedroomsCategory'), icon: BedDouble, action: 'catalog' },
    { label: t('diningSets'), icon: UtensilsCrossed, action: 'catalog' },
    { label: t('furnitureCategory'), icon: Armchair, action: 'catalog' },
  ];

  // Specialization cards for Desktop
  const specializationCards = [
    {
      title: t('mainDoors'),
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: t('bedroomDoors'),
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: t('staircases'),
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: t('pantryKitchens'),
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: t('diningSets'),
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: t('beds'),
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: t('cupboardsWardrobes'),
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent('Hi වඩු මඩුව (Vadu Maduwa), I would like to inquire about your custom teak & wooden furniture.');
    window.open(`https://wa.me/94773769849?text=${text}`, '_blank');
  };

  return (
    <div className="text-gray-900 font-sans">

      {/* ========================================================
          MOBILE VIEW (Strictly matching User's Mobile Mockup Screenshot < 768px)
         ======================================================== */}
      <div className="block md:hidden space-y-7 px-4 pt-3 pb-28">
        
        {/* 1. Mobile Hero Card */}
        <div className="bg-[#14161B] text-white rounded-3xl p-5 border border-amber-900/30 shadow-2xl space-y-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,139,89,0.18),transparent_55%)] pointer-events-none"></div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-full text-[11px] font-semibold text-amber-300 tracking-wide uppercase shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('yearsCraftsmanship')}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold font-heading leading-tight text-white tracking-tight">
            {t('craftingTimeless')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D99B6A] via-[#E6B78E] to-[#C68B59]">
              {t('woodenInteriors')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-300 text-xs leading-relaxed font-light">
            {t('heroDescMockup')}
          </p>

          {/* Stacked Full-Width Buttons (Matching Mockup Screenshot) */}
          <div className="space-y-3 pt-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className="w-full bg-[#C68B59] hover:bg-[#b07646] text-white py-3.5 px-5 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>{t('browseCatalog')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/15 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4.5 h-4.5 text-emerald-400 fill-emerald-400/20" />
              <span>{t('whatsAppNow')}</span>
            </button>
          </div>

          {/* Rating Row */}
          <div className="pt-2 flex items-center gap-2.5">
            <div className="flex text-amber-400 text-xs font-bold">
              <span>⭐⭐⭐⭐⭐</span>
            </div>
            <span className="text-xs text-white font-bold">4.9/5</span>
            <span className="text-[11px] text-gray-400 font-medium">• {t('trustedFamilies')}</span>
          </div>
        </div>

        {/* 2. Mobile 3-Column Stats Card (Matching Mockup Screenshot) */}
        <div className="bg-[#181A20] text-white rounded-2xl p-4 border border-white/10 shadow-lg grid grid-cols-3 gap-2 text-center divide-x divide-white/10">
          <div className="px-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1.5">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold font-heading text-white">1200+</h3>
            <p className="text-[10px] text-gray-400 font-medium">{t('projectsStat')}</p>
          </div>

          <div className="px-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold font-heading text-white">15+</h3>
            <p className="text-[10px] text-gray-400 font-medium">{t('yearsExperience')}</p>
          </div>

          <div className="px-1">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1.5">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-extrabold font-heading text-white">100%</h3>
            <p className="text-[10px] text-gray-400 font-medium">{t('genuineTeak')}</p>
          </div>
        </div>

        {/* 3. Mobile "Our Services" Grid (3x2 Light Cream Cards matching Screenshot) */}
        <div className="space-y-3.5">
          <div className="text-center">
            <h3 className="text-lg font-extrabold font-heading text-white tracking-wide">
              — {t('ourServices')} —
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {mobileServices.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTab(service.action)}
                  className="bg-stone-50 hover:bg-stone-100 p-3.5 rounded-2xl border border-stone-200 shadow-sm text-center flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-800 flex items-center justify-center mb-2">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {service.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Mobile "Featured Projects" Section (Matching Screenshot) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold font-heading text-white">{t('featuredProjectsTitle')}</h3>
            <button
              onClick={() => setActiveTab('gallery')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setActiveTab('gallery')}
              className="relative rounded-2xl overflow-hidden h-36 shadow-lg border border-white/10 group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                alt="Featured Teak Project 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>

            <div
              onClick={() => setActiveTab('gallery')}
              className="relative rounded-2xl overflow-hidden h-36 shadow-lg border border-white/10 group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
                alt="Featured Teak Project 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* 5. Fixed Bottom Sticky Action Bar (Matching Mockup Screenshot) */}
        <div className="fixed bottom-3 left-3 right-3 z-50 bg-[#16181E]/95 backdrop-blur-xl border border-white/15 py-2.5 px-4 rounded-full shadow-2xl flex items-center justify-around text-white">
          
          <button
            onClick={handleWhatsAppClick}
            className="flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-4 h-4 fill-emerald-400/20" />
            </div>
            <span className="text-[10px] font-semibold text-gray-200">{t('whatsappNav')}</span>
          </button>

          <button
            onClick={() => window.open('tel:0773769849')}
            className="flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-gray-200">{t('callNow')}</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className="flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-gray-200">{t('locationNav')}</span>
          </button>

        </div>

      </div>


      {/* ========================================================
          DESKTOP VIEW (>= 768px - Exact Desktop Layout)
         ======================================================== */}
      <div className="hidden md:block space-y-12 sm:space-y-16 pb-24">
        
        {/* 1. HERO SECTION (Desktop Dark Split Theme) */}
        <section className="relative bg-[#16181D] text-white overflow-hidden rounded-3xl mx-2 sm:mx-6 lg:mx-8 mt-3 shadow-2xl border border-amber-900/30">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,139,89,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,69,19,0.2),transparent_50%)]"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-amber-950/60 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 tracking-wide uppercase shadow-inner">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t('yearsCraftsmanship')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading leading-[1.15] text-white tracking-tight">
                {t('craftingTimeless')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D99B6A] via-[#E6B78E] to-[#C68B59]">
                  {t('woodenInteriors')}
                </span>
              </h1>

              <p className="text-gray-300 text-xs sm:text-base leading-relaxed max-w-xl font-normal">
                {t('heroDescMockup')}
              </p>

              {/* Desktop Quick Category Strip */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-white/10">
                {quickCategories.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab('catalog')}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/40 transition-all group cursor-pointer"
                    >
                      <IconComponent className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="bg-[#C68B59] hover:bg-[#b07646] text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-amber-900/40 flex items-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <span>{t('browseCatalog')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppClick}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-full font-bold text-sm transition-all flex items-center gap-2.5 backdrop-blur-md active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4.5 h-4.5 text-emerald-400 fill-emerald-400/20" />
                  <span>{t('whatsAppNow')}</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="pt-2 flex items-center gap-3.5">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#16181D]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#16181D]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#16181D]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#16181D]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="User" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span className="text-white ml-1">4.9/5</span>
                  </div>
                  <p className="text-gray-400 text-[11px] font-medium">{t('trustedFamilies')}</p>
                </div>
              </div>

            </div>

            {/* Right Column: 6-Photo Craft Collage Grid */}
            <div className="lg:col-span-6 relative mt-4 lg:mt-0">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
                
                <div className="relative rounded-2xl overflow-hidden shadow-md group h-36 sm:h-44 border border-white/10">
                  <img
                    src="/banner_crafts/door_main.jpg"
                    alt="Teak Entrance Door Frame & Panel"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-md group h-36 sm:h-44 border border-white/10">
                  <img
                    src="/banner_crafts/staircase_main.jpg"
                    alt="Polished Teak Staircase & Handrail"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-md group h-36 sm:h-44 border border-white/10 col-span-2 sm:col-span-1">
                  <img
                    src="/banner_crafts/pantry_main.jpg"
                    alt="Luxury Teak Kitchen Pantry Cupboards"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-md group h-36 sm:h-44 border border-white/10">
                  <img
                    src="/banner_crafts/carving_main.jpg"
                    alt="Intricate Hand-carved Wood Art Panel"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-md group h-36 sm:h-44 border border-white/10">
                  <img
                    src="/banner_crafts/door_detail.jpg"
                    alt="Hand-carved Door Detail"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-md group h-36 sm:h-44 border border-white/10">
                  <img
                    src="/banner_crafts/pantry_detail.jpg"
                    alt="Teak Cabinetry Detail"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

              </div>

              {/* Overlaid Floating Dark Glass Card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:translate-x-0 sm:translate-y-0 sm:bottom-6 sm:right-6 sm:top-auto sm:left-auto bg-[#1A1D24]/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/15 shadow-2xl max-w-[280px] sm:max-w-[300px]">
                <div className="space-y-2.5 text-xs text-gray-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="font-medium">{t('genuineTeakCheck')}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="font-medium">{t('customDesignsCheck')}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="font-medium">{t('skilledCraftsmenCheck')}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="font-medium">{t('longLastingQualityCheck')}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* 2. KEY STATS BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            
            <div className="flex flex-col items-center pt-2 md:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center mb-2.5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900">1200+</h3>
              <p className="text-xs text-gray-500 font-medium">{t('happyCustomers')}</p>
            </div>

            <div className="flex flex-col items-center pt-2 md:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900">15+</h3>
              <p className="text-xs text-gray-500 font-medium">{t('yearsExperience')}</p>
            </div>

            <div className="flex flex-col items-center pt-2 md:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center mb-2.5">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900">100%</h3>
              <p className="text-xs text-gray-500 font-medium">{t('genuineTeak')}</p>
            </div>

            <div className="flex flex-col items-center pt-2 md:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center mb-2.5">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-gray-900">{t('islandwideDelivery')}</h3>
              <p className="text-xs text-gray-500 font-medium">{t('islandwideDeliverySub')}</p>
            </div>

            <div className="flex flex-col items-center pt-2 md:pt-0 col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center mb-2.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-gray-900">{t('warrantyAvailable')}</h3>
              <p className="text-xs text-gray-500 font-medium">{t('warrantyAvailableSub')}</p>
            </div>

          </div>
        </section>


        {/* 3. WHAT WE SPECIALIZE IN SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-12 bg-amber-400"></div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900">
                {t('whatWeSpecializeIn')}
              </h2>
              <div className="h-[1px] w-12 bg-amber-400"></div>
            </div>
          </div>

          <div className="relative group">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
              {specializationCards.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab('catalog')}
                  className="group/card relative rounded-2xl overflow-hidden h-48 cursor-pointer shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col justify-end p-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="bg-[#1C1F26]/90 backdrop-blur-md py-1.5 px-2 rounded-xl border border-white/10 text-white text-xs font-semibold tracking-tight shadow-md">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('catalog')}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white text-gray-800 shadow-xl border border-gray-200 hidden lg:flex items-center justify-center hover:bg-[#C68B59] hover:text-white transition-colors cursor-pointer"
              title="Browse All"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </section>


        {/* 4. VALUE PROPOSITIONS & PERKS STRIP */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-amber-50/40 rounded-3xl p-6 sm:p-8 border border-amber-100/60 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white text-amber-700 shadow-sm border border-amber-100 flex items-center justify-center">
                <Ruler className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-gray-800 leading-tight">{t('freeSiteVisit')}</h4>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white text-amber-700 shadow-sm border border-amber-100 flex items-center justify-center">
                <PenTool className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-gray-800 leading-tight">{t('customMadeForSpace')}</h4>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white text-amber-700 shadow-sm border border-amber-100 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-gray-800 leading-tight">{t('premiumQualityFinishes')}</h4>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white text-amber-700 shadow-sm border border-amber-100 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-gray-800 leading-tight">{t('expertInstallation')}</h4>
            </div>

            <div className="flex flex-col items-center space-y-2 col-span-2 sm:col-span-1">
              <div className="w-12 h-12 rounded-2xl bg-white text-amber-700 shadow-sm border border-amber-100 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-gray-800 leading-tight">{t('afterSalesSupport')}</h4>
            </div>

          </div>
        </section>


        {/* 5. BOTTOM CONTACT BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <div className="bg-[#21242B] text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            <div 
              onClick={handleWhatsAppClick}
              className="flex items-center gap-4 cursor-pointer group pt-2 md:pt-0"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <MessageCircle className="w-6 h-6 fill-emerald-400/20" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{t('chatOnWhatsApp')}</h4>
                <p className="text-xs text-gray-400">{t('getQuickQuotes')}</p>
              </div>
            </div>

            <div 
              onClick={() => window.open('tel:0773769849')}
              className="flex items-center gap-4 cursor-pointer group pt-4 md:pt-0 md:pl-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">{t('callUsNow')}</h4>
                <p className="text-xs text-amber-300 font-semibold">{t('callNumber')}</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('contact')}
              className="flex items-center gap-4 cursor-pointer group pt-4 md:pt-0 md:pl-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{t('visitShowroom')}</h4>
                <p className="text-xs text-gray-400">{t('showroomAddress')}</p>
              </div>
            </div>

          </div>
        </section>

      </div>

    </div>
  );
}
