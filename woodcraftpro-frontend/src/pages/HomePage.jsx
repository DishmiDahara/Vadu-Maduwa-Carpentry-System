import React, { useEffect, useState } from 'react';
import { Hammer, Sparkles, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({ setActiveTab, onSelectProductForQuote, onOpenInquiry }) {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getProducts().then(res => setFeaturedProducts(res.slice(0, 4)));
    api.getCategories().then(res => setCategories(res));
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative min-h-[580px] bg-gradient-to-br from-[#121417] via-[#1C1F26] to-[#2E241E] text-white overflow-hidden rounded-3xl mx-4 sm:mx-8 mt-4 shadow-2xl border border-gray-800 flex items-center">
        
        {/* Background Overlay Image */}
        <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              {t('heroBadge')}
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-heading leading-tight tracking-tight text-white">
              {t('heroTitle1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C68B59] to-[#E5AA70]">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              {t('heroDesc')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-[#C68B59] hover:bg-[#b07646] text-white px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-lg hover:shadow-amber-900/30 flex items-center gap-2 active:scale-95"
              >
                {t('browseCatalog')}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenInquiry}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-medium text-sm backdrop-blur-md transition-all active:scale-95"
              >
                {t('requestCustomQuote')}
              </button>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-gray-800/80">
              <div>
                <span className="text-2xl font-bold font-heading text-white">{t('statYears')}</span>
                <p className="text-xs text-gray-400">{t('statYearsSub')}</p>
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-white">{t('statProjects')}</span>
                <p className="text-xs text-gray-400">{t('statProjectsSub')}</p>
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-white">{t('statTimber')}</span>
                <p className="text-xs text-gray-400">{t('statTimberSub')}</p>
              </div>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative block mt-6 lg:mt-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/20 group">

              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"
                alt="Teak Dining Set"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 glass-panel-dark rounded-2xl">
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{t('featuredCraft')}</p>
                <h3 className="text-lg font-bold font-heading text-white">6-Seater Teak Dining Suite</h3>
                <p className="text-xs text-gray-300">Kiln-dried genuine Sri Lankan timber with satin finish</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Furniture Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">{t('exploreCategories')}</span>
            <h2 className="text-3xl font-extrabold font-heading text-gray-900 mt-1">{t('workshopCollections')}</h2>
          </div>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-sm font-semibold text-[#C68B59] hover:text-[#8B4513] flex items-center gap-1.5 transition-colors"
          >
            {t('viewAll')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setActiveTab('catalog')}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
            >
              <div className="h-40 overflow-hidden bg-gray-100">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h4 className="font-bold text-gray-900 font-heading group-hover:text-[#C68B59] transition-colors">{cat.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-amber-50/50 py-16 rounded-3xl border border-amber-100/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">{t('popularChoices')}</span>
            <h2 className="text-3xl font-extrabold font-heading text-gray-900 mt-1">{t('featuredProducts')}</h2>
          </div>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-sm font-semibold text-[#C68B59] hover:text-[#8B4513] flex items-center gap-1.5 transition-colors"
          >
            {t('browseFullCatalog')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelectForQuote={(prod) => {
                onSelectProductForQuote(prod);
                onOpenInquiry();
              }}
            />
          ))}
        </div>
      </section>

      {/* Why Choose WoodCraftPro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Why {t('brandName')}</span>
          <h2 className="text-3xl font-extrabold font-heading text-gray-900 mt-1">Uncompromising Carpentry Standard</h2>
          <p className="text-sm text-gray-600 mt-2">Every piece of furniture is custom planned, material certified, and digitally tracked from quotation to installation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-[#C68B59] rounded-2xl flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-gray-900">Grade-A Seasoned Timber</h3>
            <p className="text-sm text-gray-600 leading-relaxed">We source 100% legally harvested Sri Lankan Teak, Mahogany, and Nadun timber, kiln-dried to eliminate moisture warping.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-[#C68B59] rounded-2xl flex items-center justify-center mx-auto">
              <Hammer className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-gray-900">Tailored Precision</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Our master craftsmen build according to your exact room blueprints, custom door openings, and modular pantry specifications.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-[#C68B59] rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-gray-900">Transparent Quotations</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Detailed material cost and labour cost breakdown provided upfront with formal digital bills and payment receipt tracking.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
