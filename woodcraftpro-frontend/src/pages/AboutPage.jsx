import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Hammer, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Flame, 
  Users, 
  Clock, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import TrustProofSection from '../components/TrustProofSection';

export default function AboutPage({ setActiveTab, onOpenInquiry }) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FAF8F5] text-[#2B190E] font-sans pb-16 pt-6 selection:bg-[#8B5E3C] selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ========================================================
            1. HERO HEADER BANNER
           ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#3D2415] bg-[#1D1109] text-white p-8 sm:p-14 min-h-[380px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ backgroundImage: `url('/banner_crafts/staircase_main.jpg')` }}
          ></div>

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 uppercase tracking-widest">
              <span>🪵</span>
              <span>{t('expYears')} {t('expSub')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-heading text-white leading-tight tracking-tight">
              {t('aboutHeader')}
            </h1>

            <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed font-medium">
              {t('aboutSub')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-[#8B5E3C] hover:bg-[#734A2E] text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>{t('customOrderBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95 backdrop-blur-sm cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>{t('contact')}</span>
              </button>
            </div>
          </div>
        </section>


        {/* ========================================================
            2. OUR STORY & HERITAGE SECTION
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B5E3C] uppercase tracking-widest bg-[#F3EDE2] border border-[#E8DEC8] px-3 py-1 rounded-full">
              <span>🇱🇰</span>
              <span>Kalutara Carpentry Heritage</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#2B190E] leading-tight">
              23+ Years of Master Hand-Carving & Structural Woodwork
            </h2>

            <p className="text-xs sm:text-sm text-[#5C4535] leading-relaxed font-medium">
              Established in Rendapala, Dodangoda, Kalutara, <strong>වඩු මඩුව (Wadu Maduwa)</strong> has grown over more than two decades into Sri Lanka’s trusted workshop for solid timber doors, windows, staircases, pantry cupboards, door frames, and timber ceilings.
            </p>

            <p className="text-xs sm:text-sm text-[#5C4535] leading-relaxed font-medium">
              We combine traditional Sri Lankan hand-carving craftsmanship with modern kiln-drying, precision joinery, and 5-layer polyurethane (PU) polish treatments. Every piece of wood used in our workshop is 100% genuine Sri Lankan timber inspected for zero sapwood or defects.
            </p>

            {/* 3 Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#E8DEC8]">
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#8B5E3C] font-heading block">100%</span>
                <span className="text-xs font-bold text-[#2B190E] block">Genuine Timber</span>
                <span className="text-[10px] text-[#7A6252]">No MDF or chipboards</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#8B5E3C] font-heading block">15-Year</span>
                <span className="text-xs font-bold text-[#2B190E] block">Written Warranty</span>
                <span className="text-[10px] text-[#7A6252]">Termite & structure</span>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-black text-[#8B5E3C] font-heading block">1,200+</span>
                <span className="text-xs font-bold text-[#2B190E] block">Happy Clients</span>
                <span className="text-[10px] text-[#7A6252]">Islandwide projects</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden border border-[#E8DEC8] shadow-md h-64 bg-[#FAF4EB]">
              <img 
                src="/teak_door.png" 
                alt="Teak Door Master Craftsman Work" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="rounded-3xl overflow-hidden border border-[#E8DEC8] shadow-md h-64 bg-[#FAF4EB] mt-8">
              <img 
                src="/banner_crafts/staircase_main.jpg" 
                alt="Teak Staircase Installation" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

        </section>


        {/* ========================================================
            3. OUR 7 CORE CARPENTRY OFFERINGS
           ======================================================== */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest">Our Expertise</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">
              What We Build Best at Wadu Maduwa
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6252]">
              We specialize strictly in architectural timber construction and master carpentry work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center text-xl border border-[#E8DEC8]">🚪</div>
                <h3 className="font-bold text-sm text-[#2B190E]">{t('svcDoors')}</h3>
                <p className="text-xs text-[#7A6252] leading-relaxed">{t('svcDoorsDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('catalog')} className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>View Designs</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center text-xl border border-[#E8DEC8]">🪟</div>
                <h3 className="font-bold text-sm text-[#2B190E]">{t('svcWindows')}</h3>
                <p className="text-xs text-[#7A6252] leading-relaxed">{t('svcWindowsDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('catalog')} className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>View Designs</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center text-xl border border-[#E8DEC8]">🪜</div>
                <h3 className="font-bold text-sm text-[#2B190E]">{t('svcStaircases')}</h3>
                <p className="text-xs text-[#7A6252] leading-relaxed">{t('svcStaircasesDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('catalog')} className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>View Designs</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center text-xl border border-[#E8DEC8]">🗄️</div>
                <h3 className="font-bold text-sm text-[#2B190E]">{t('svcPantry')}</h3>
                <p className="text-xs text-[#7A6252] leading-relaxed">{t('svcPantryDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('catalog')} className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>View Designs</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center text-xl border border-[#E8DEC8]">🪵</div>
                <h3 className="font-bold text-sm text-[#2B190E]">{t('svcDoorFrames')}</h3>
                <p className="text-xs text-[#7A6252] leading-relaxed">{t('svcDoorFramesDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('catalog')} className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>View Designs</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center text-xl border border-[#E8DEC8]">🛡️</div>
                <h3 className="font-bold text-sm text-[#2B190E]">{t('svcCeilings')}</h3>
                <p className="text-xs text-[#7A6252] leading-relaxed">{t('svcCeilingsDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('catalog')} className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>View Designs</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-all sm:col-span-2">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center text-xl border border-[#E8DEC8]">🧰</div>
                <h3 className="font-bold text-sm text-[#2B190E]">{t('svcGeneralCarpentry')}</h3>
                <p className="text-xs text-[#7A6252] leading-relaxed">{t('svcGeneralCarpentryDesc')}</p>
              </div>
              <button onClick={() => setActiveTab('contact')} className="text-xs font-bold text-[#8B5E3C] flex items-center gap-1 hover:underline pt-2 cursor-pointer">
                <span>Contact Workshop</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </section>


        {/* ========================================================
            4. WORKSHOP COMMITMENTS & TIMBER STANDARDS
           ======================================================== */}
        <section className="bg-[#23160D] text-amber-100 rounded-3xl p-6 sm:p-10 border border-[#3D2415] space-y-8 shadow-xl">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Quality Guarantee</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Our Workshop Quality Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#1D1109] border border-[#3D2415] p-5 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">100% Seasoned Kiln-Dried Wood</h3>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Timber seasoned to under 12% moisture content to eliminate cracking or warping in Sri Lanka's humid climate.
              </p>
            </div>

            <div className="bg-[#1D1109] border border-[#3D2415] p-5 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">15-Year Structural Warranty</h3>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Written warranty covering termite resistance, structural joint integrity, and timber durability.
              </p>
            </div>

            <div className="bg-[#1D1109] border border-[#3D2415] p-5 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Free Site Visit & Measurements</h3>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Our master carpenters visit your location anywhere in Sri Lanka to take exact site dimensions for free.
              </p>
            </div>

          </div>
        </section>

        {/* Re-use TrustProofSection */}
        <TrustProofSection onOpenCustomOrder={() => setActiveTab('custom-order')} />

      </div>
    </div>
  );
}
