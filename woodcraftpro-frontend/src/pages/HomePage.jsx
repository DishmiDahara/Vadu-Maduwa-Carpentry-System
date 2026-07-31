import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  Hammer, 
  Truck, 
  Wrench, 
  Paintbrush, 
  Package
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({ setActiveTab, onSelectProductForQuote, onOpenInquiry }) {
  const { t } = useLanguage();
  const [wishlist, setWishlist] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Hero Slides Data (Carpentry & Timber Works Focus)
  const heroSlides = [
    {
      image: '/teak_door.png',
      badge: t('heroBadge1'),
      titleLine1: t('heroTitle1_1'),
      titleLine2: t('heroTitle1_2'),
      descLine1: t('heroDesc1_1'),
      descLine2: t('heroDesc1_2')
    },
    {
      image: '/banner_crafts/card_dining.jpg',
      badge: t('heroBadge2'),
      titleLine1: t('heroTitle2_1'),
      titleLine2: t('heroTitle2_2'),
      descLine1: t('heroDesc2_1'),
      descLine2: t('heroDesc2_2')
    },
    {
      image: '/banner_crafts/staircase_main.jpg',
      badge: t('heroBadge3'),
      titleLine1: t('heroTitle3_1'),
      titleLine2: t('heroTitle3_2'),
      descLine1: t('heroDesc3_1'),
      descLine2: t('heroDesc3_2')
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentSlide = heroSlides[currentSlideIndex];

  // Actual Carpentry Featured Items
  const featuredCarpentryItems = [
    {
      id: 'c1',
      title: 'Carved Solid Teak Main Door',
      price: 'Rs. 45,000',
      image: '/teak_door.png',
    },
    {
      id: 'c2',
      title: 'Fitted Teak Pantry Cupboards',
      price: 'Rs. 95,000',
      image: '/banner_crafts/card_dining.jpg',
    },
    {
      id: 'c3',
      title: 'Teak Wooden Staircase & Handrail',
      price: 'Rs. 120,000',
      image: '/banner_crafts/staircase_main.jpg',
    },
    {
      id: 'c4',
      title: 'Seasoned Teak Door Frame (Uluwahu)',
      price: 'Rs. 28,000',
      image: '/banner_crafts/door_main.jpg',
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#2B190E] font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">

        {/* 1. HERO SLIDER BANNER */}
        <section className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8DEC8] bg-[#FAF8F5] min-h-[480px] sm:min-h-[520px] flex items-center">
          <div 
            key={currentSlideIndex}
            className="absolute inset-0 bg-cover bg-right sm:bg-center bg-no-repeat transition-all duration-1000 animate-fade-in"
            style={{ backgroundImage: `url('${currentSlide.image}')` }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 sm:via-[#FAF8F5]/65 to-transparent"></div>

          <button 
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#E8DEC8] flex items-center justify-center text-[#2B190E] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button 
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#E8DEC8] flex items-center justify-center text-[#2B190E] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative z-10 max-w-xl px-6 sm:px-12 py-10 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest bg-[#F3EDE2] border border-[#E8DEC8] px-3 py-1 rounded-full shadow-sm">
              <span>🍃</span>
              <span>{currentSlide.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#2B190E] leading-tight">
              {currentSlide.titleLine1} <br />
              <span className="text-[#3D2415]">{currentSlide.titleLine2}</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#5C4535] leading-relaxed font-medium">
              {currentSlide.descLine1}<br />
              {currentSlide.descLine2}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-[#3D2415] hover:bg-[#2B190E] text-white px-7 py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-white hover:bg-[#FAF4EB] text-[#2B190E] border border-[#3D2415] px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#8B5E3C]" />
                <span>{t('customOrderBtn')}</span>
              </button>
            </div>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#E8DEC8]/60 text-[11px] text-[#5C4535]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="font-bold block text-[#2B190E]">{t('expYears')}</span>
                  <span className="text-[10px] text-gray-500">{t('expSub')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="font-bold block text-[#2B190E]">{t('premQuality')}</span>
                  <span className="text-[10px] text-gray-500">{t('premSub')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="font-bold block text-[#2B190E]">{t('customMade')}</span>
                  <span className="text-[10px] text-gray-500">{t('customSub')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="font-bold block text-[#2B190E]">{t('ontimeDelivery')}</span>
                  <span className="text-[10px] text-gray-500">{t('ontimeSub')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-6 h-2 rounded-full bg-[#3D2415]'
                    : 'w-2 h-2 rounded-full bg-[#E8DEC8] hover:bg-[#8B5E3C]'
                }`}
              />
            ))}
          </div>
        </section>

        {/* 2. CARPENTRY SERVICES QUICK ICONS BAR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-8 bg-white border border-[#E8DEC8] rounded-2xl p-3 shadow-sm flex items-center justify-around overflow-x-auto no-scrollbar gap-2">
            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2.5 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🚪</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">{t('svcDoors')}</h4>
                <p className="text-[10px] text-[#7A6252]">Main & Room Doors</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2.5 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🪟</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">{t('svcWindows')}</h4>
                <p className="text-[10px] text-[#7A6252]">Frames & Glass</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2.5 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🪜</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">{t('svcStaircases')}</h4>
                <p className="text-[10px] text-[#7A6252]">Steps & Railings</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2.5 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🗄️</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">{t('svcPantry')}</h4>
                <p className="text-[10px] text-[#7A6252]">Kitchen Cabinets</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2.5 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🪵</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">{t('svcCeilings')}</h4>
                <p className="text-[10px] text-[#7A6252]">Timber Panels</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#1D1109] text-white border border-[#3D2415] rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1.5">
              <h3 className="font-bold text-xs text-white">{t('needSomethingUnique')}</h3>
              <p className="text-[10px] text-amber-200/70">{t('designIn3D')}</p>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="mt-1 bg-[#8B5E3C] hover:bg-[#734A2E] text-white px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>{t('designNow')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-16 h-16 rounded-xl bg-[#2B190E] border border-[#4A2E1B] flex items-center justify-center text-2xl shadow shrink-0">
              🪵
            </div>
          </div>
        </section>

        {/* 2.5 ABOUT US SHOWCASE SECTION */}
        <section className="bg-white border border-[#E8DEC8] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8B5E3C] uppercase tracking-widest bg-[#FAF4EB] border border-[#E8DEC8] px-3 py-1 rounded-full">
              <span>🪵</span>
              <span>{t('aboutUs')} • {t('expYears')} {t('expSub')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#2B190E]">
              {t('aboutHeader')}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4535] leading-relaxed font-medium">
              {t('aboutSub')}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('about')}
            className="bg-[#3D2415] hover:bg-[#8B5E3C] text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
          >
            <span>{t('aboutUs')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* 3. FEATURED CARPENTRY WORKS GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-heading text-[#2B190E]">{t('catalog')}</h2>
              <span className="text-sm">🍃</span>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCarpentryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E8DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-[#FAF4EB]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlist[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-xs text-[#2B190E]">{item.title}</h3>
                  <div className="font-extrabold text-sm text-[#8B5E3C]">
                    {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. OUR 7 ACTUAL CARPENTRY SERVICES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-heading text-[#2B190E]">{t('servicesTitle')}</h2>
              <span className="text-sm">🍃</span>
            </div>
            <button
              onClick={() => setActiveTab('services')}
              className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t('services')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1D1109] border border-[#3D2415] text-white rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#2B190E] border border-[#4A2E1B] text-[#E2B784] flex items-center justify-center text-xl">🚪</div>
                <h3 className="font-bold text-xs text-white">{t('svcDoors')}</h3>
                <p className="text-[10px] text-amber-200/70">{t('svcDoorsDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('services')} className="text-[11px] font-bold text-[#E2B784] hover:underline flex items-center gap-1 pt-2">
                <span>{t('inquireNow')}</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-[#1D1109] border border-[#3D2415] text-white rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#2B190E] border border-[#4A2E1B] text-[#E2B784] flex items-center justify-center text-xl">🪟</div>
                <h3 className="font-bold text-xs text-white">{t('svcWindows')}</h3>
                <p className="text-[10px] text-amber-200/70">{t('svcWindowsDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('services')} className="text-[11px] font-bold text-[#E2B784] hover:underline flex items-center gap-1 pt-2">
                <span>{t('inquireNow')}</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-[#1D1109] border border-[#3D2415] text-white rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#2B190E] border border-[#4A2E1B] text-[#E2B784] flex items-center justify-center text-xl">🪜</div>
                <h3 className="font-bold text-xs text-white">{t('svcStaircases')}</h3>
                <p className="text-[10px] text-amber-200/70">{t('svcStaircasesDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('services')} className="text-[11px] font-bold text-[#E2B784] hover:underline flex items-center gap-1 pt-2">
                <span>{t('inquireNow')}</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-[#1D1109] border border-[#3D2415] text-white rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#2B190E] border border-[#4A2E1B] text-[#E2B784] flex items-center justify-center text-xl">🗄️</div>
                <h3 className="font-bold text-xs text-white">{t('svcPantry')}</h3>
                <p className="text-[10px] text-amber-200/70">{t('svcPantryDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('services')} className="text-[11px] font-bold text-[#E2B784] hover:underline flex items-center gap-1 pt-2">
                <span>{t('inquireNow')}</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
