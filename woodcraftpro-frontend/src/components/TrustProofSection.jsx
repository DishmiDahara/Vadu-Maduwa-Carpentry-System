import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Flame, 
  BadgePercent,
  Truck,
  Star
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TrustProofSection({ onOpenCustomOrder }) {
  const { t } = useLanguage();

  const timberTypes = [
    {
      name: 'Teak Wood (තේක්ක / தேக்கு)',
      grade: 'Grade-A Seasoned Sri Lankan Teak',
      warranty: '15 Year Termite & Structural Warranty',
      features: ['Natural Oils Resist Water & Moisture', 'Zero Warping in Doors & Frames', 'Rich Golden Grain Finish'],
      badge: 'Most Popular',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      bgImage: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Mahogany (මහෝගනි / மகோகனி)',
      grade: 'Kiln-Dried Premium Mahogany',
      warranty: '10 Year Structural Warranty',
      features: ['Deep Reddish-Brown Polish Finish', 'Smooth Carving Texture for Doors', 'High Structural Strength'],
      badge: 'Classic Choice',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      bgImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Nadun & Jackwood (නදුන් / කොස් / நதுன்)',
      grade: 'Selected Hardwood Timber',
      warranty: '12 Year Termite Warranty',
      features: ['Traditional Warm Golden Hue', 'Heavy Density Solid Wood', 'Ideal for Heavy Uluwahu & Frames'],
      badge: 'Heritage Hardwood',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      bgImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const processSteps = [
    { step: '01', title: t('step1Title'), desc: t('step1Desc') },
    { step: '02', title: t('step2Title'), desc: t('step2Desc') },
    { step: '03', title: t('step3Title'), desc: t('step3Desc') },
    { step: '04', title: t('step4Title'), desc: t('step4Desc') },
    { step: '05', title: t('step5Title'), desc: t('step5Desc') }
  ];

  const clientReviews = [
    {
      name: 'Dr. Ruwan Wickramasinghe',
      location: 'Nawala, Rajagiriya',
      project: 'Teak Main Door & Staircase Rails',
      rating: 5,
      comment: 'Vadu Maduwa executed my custom entrance door idea straight from a reference photo. The teak finish and carving quality are unmatched!',
      date: 'July 2026'
    },
    {
      name: 'Chaminda & Dilini Perera',
      location: 'Colombo 07',
      project: 'Fitted Modular Pantry Kitchen',
      rating: 5,
      comment: 'They provided clear estimated pricing beforehand and allowed us to adjust details to fit our budget. Very transparent team.',
      date: 'June 2026'
    },
    {
      name: 'Eng. Nishantha Fernando',
      location: 'Kalutara South',
      project: 'Teak Uluwahu & Door Frames',
      rating: 5,
      comment: '100% genuine seasoned teak timber used. You can inspect the raw unvarnished wood at their Dodangoda workshop before final polish.',
      date: 'May 2026'
    }
  ];

  return (
    <section className="space-y-12 py-6 text-white">
      
      {/* 1. WHY TRUST US */}
      <div className="bg-[#14161D]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t('guaranteedTimberStandard')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            {t('whyTrustUsTitle')}
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            {t('trustDesc')}
          </p>
        </div>

        {/* 4 Trust Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Kiln-Dried Timber</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Seasoned wood to moisture level under 12%. Prevents cracking or warping in doors & frames.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">10-15 Year Warranty</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Written warranty against termite infestation and structural failures in doors & staircases.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BadgePercent className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Negotiable Guidelines</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Get an estimated range and tailor door, window or pantry specs to fit your budget.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">{t('ontimeDelivery')}</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Direct workshop installation with free site measurement across Sri Lanka.
            </p>
          </div>
        </div>

      </div>

      {/* 2. TIMBER SPECIFICATION CARDS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-400">{t('timberGuaranteesTitle')}</span>
            <h2 className="text-xl sm:text-3xl font-extrabold font-heading text-white">
              Genuine Sri Lankan Seasoned Wood
            </h2>
          </div>
          {onOpenCustomOrder && (
            <button
              onClick={onOpenCustomOrder}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md self-start sm:self-auto cursor-pointer"
            >
              {t('customOrderBtn')} ➔
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {timberTypes.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-[#16181E] rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={item.bgImage} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16181E] via-black/40 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">{item.grade}</p>
                  
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{item.warranty}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-gray-300">
                  {item.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STEP-BY-STEP WORKSHOP CRAFT PROCESS */}
      <div className="bg-[#14161D]/90 rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t('fiveStepProcessTitle')}</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            From Site Measurement to Professional Fitting
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {processSteps.map((step, idx) => (
            <div key={idx} className="relative bg-white/5 border border-white/10 rounded-2xl p-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 font-bold text-sm flex items-center justify-center mx-auto">
                {step.step}
              </div>
              <h4 className="text-sm font-bold text-white">{step.title}</h4>
              <p className="text-[11px] text-gray-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. VERIFIED CUSTOMER REVIEWS */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-lg">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            <span className="text-white font-extrabold text-sm ml-2">4.9 / 5.0 Rating</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {t('clientReviewsTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {clientReviews.map((rev, idx) => (
            <div key={idx} className="bg-[#16181E] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-xs">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                </div>
                <p className="text-xs text-gray-200 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.name}</h4>
                  <p className="text-[10px] text-amber-400">{rev.location}</p>
                </div>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  {rev.project}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
