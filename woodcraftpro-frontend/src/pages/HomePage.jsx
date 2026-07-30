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
  Sparkles,
  Users,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function HomePage({ setActiveTab, onSelectProductForQuote, onOpenInquiry }) {
  const [wishlist, setWishlist] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Hero Slides Data
  const heroSlides = [
    {
      image: '/hero_armchair.png',
      badge: 'PREMIUM QUALITY WOODWORK',
      titleLine1: 'ඔබේ අදහසට',
      titleLine2: 'ජීවය දෙන දැව නිර්මාණ',
      descLine1: 'උළුවහු, දොර ජනෙල්, පැන්ට්‍රි කබඩ්, පඩිපෙළ අත්වැටවල් හා සියලු කැටයම් වැඩ',
      descLine2: 'ඔබේ අවශ්‍යතාවයට හා මිනුම්වලට අනුව උසස්ම නිමාවෙන්.'
    },

  ];

  // Auto-play slideshow timer (every 4.5 seconds)
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

  const featuredProducts = [
    {
      id: 'p1',
      title: 'Dining Table Set',
      price: 'Rs. 85,000',
      image: '/dining_table.png',
    },
    {
      id: 'p2',
      title: 'Teak Wooden Door',
      price: 'Rs. 45,000',
      image: '/teak_door.png',
    },
    {
      id: 'p3',
      title: 'King Size Wooden Bed',
      price: 'Rs. 120,000',
      image: '/wooden_bed.png',
    },
    {
      id: 'p4',
      title: 'Wooden Wardrobe',
      price: 'Rs. 78,000',
      image: '/wooden_wardrobe.png',
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#2B190E] font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">

        {/* ========================================================
            1. HERO SLIDER BANNER (Interactive Auto-Playing Carousel)
           ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8DEC8] bg-[#FAF8F5] min-h-[480px] sm:min-h-[520px] flex items-center">

          {/* Dynamic Background Image with Smooth Fade Transition */}
          <div
            key={currentSlideIndex}
            className="absolute inset-0 bg-cover bg-right sm:bg-center bg-no-repeat transition-all duration-1000 animate-fade-in"
            style={{ backgroundImage: `url('${currentSlide.image}')` }}
          ></div>

          {/* Gradient Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 sm:via-[#FAF8F5]/65 to-transparent"></div>

          {/* Slider Left Arrow Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#E8DEC8] flex items-center justify-center text-[#2B190E] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slider Right Arrow Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#E8DEC8] flex items-center justify-center text-[#2B190E] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Hero Content Block */}
          <div className="relative z-10 max-w-xl px-6 sm:px-12 py-10 space-y-5">

            {/* Top Leaf Sub-Badge */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest bg-[#F3EDE2] border border-[#E8DEC8] px-3 py-1 rounded-full shadow-sm">
              <span>🍃</span>
              <span>{currentSlide.badge}</span>
            </div>

            {/* Main Sinhala Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#2B190E] leading-tight">
              {currentSlide.titleLine1} <br />
              <span className="text-[#3D2415]">{currentSlide.titleLine2}</span>
            </h1>

            {/* Sinhala Subtitle */}
            <p className="text-xs sm:text-sm text-[#5C4535] leading-relaxed font-medium">
              {currentSlide.descLine1}<br />
              {currentSlide.descLine2}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-[#3D2415] hover:bg-[#2B190E] text-white px-7 py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>අපගේ නිර්මාණ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-white hover:bg-[#FAF4EB] text-[#2B190E] border border-[#3D2415] px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#8B5E3C]" />
                <span>ඔබේ නිර්මාණය ආරම්භ කරන්න</span>
              </button>
            </div>

            {/* 4 Feature Badges Row */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#E8DEC8]/60 text-[11px] text-[#5C4535]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="font-bold block text-[#2B190E]">25+ Years</span>
                  <span className="text-[10px] text-gray-500">Experience</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="font-bold block text-[#2B190E]">Premium</span>
                  <span className="text-[10px] text-gray-500">Quality Wood</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="font-bold block text-[#2B190E]">Custom Made</span>
                  <span className="text-[10px] text-gray-500">For Your Needs</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#8B5E3C]" />
                <div>
                  <span className="font-bold block text-[#2B190E]">On-time</span>
                  <span className="text-[10px] text-gray-500">Delivery</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Slide Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${currentSlideIndex === idx
                  ? 'w-6 h-2 rounded-full bg-[#3D2415]'
                  : 'w-2 h-2 rounded-full bg-[#E8DEC8] hover:bg-[#8B5E3C]'
                  }`}
              />
            ))}
          </div>

        </section>





        {/* ========================================================
            3. FEATURED PRODUCTS GRID
           ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-heading text-[#2B190E]">Featured Products</h2>
              <span className="text-sm">🍃</span>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#E8DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-[#FAF4EB]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlist[product.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-xs text-[#2B190E]">{product.title}</h3>
                  <div className="font-extrabold text-sm text-[#8B5E3C]">
                    {product.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ========================================================
            4. OUR SERVICES
           ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-heading text-[#2B190E]">Our Services</h2>
              <span className="text-sm">🍃</span>
            </div>
            <button
              onClick={() => setActiveTab('services')}
              className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Service 1 */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] border border-[#E8DEC8] text-[#8B5E3C] flex items-center justify-center">
                  <Hammer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-[#2B190E]">Custom Furniture Design & Build</h3>
                <p className="text-[10px] text-[#7A6252]">අභිරුචි ලී භාණ්ඩ</p>
              </div>
              <button
                onClick={() => setActiveTab('services')}
                className="text-[11px] font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Service 2 */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] border border-[#E8DEC8] text-[#8B5E3C] flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-[#2B190E]">Restoration & Repair</h3>
                <p className="text-[10px] text-[#7A6252]">පැරණි ලී භාණ්ඩ ප්‍රතිසංස්කරණය</p>
              </div>
              <button
                onClick={() => setActiveTab('services')}
                className="text-[11px] font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Service 3 */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] border border-[#E8DEC8] text-[#8B5E3C] flex items-center justify-center">
                  <Paintbrush className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-[#2B190E]">Polishing & Finishing</h3>
                <p className="text-[10px] text-[#7A6252]">පොලිෂි සහ නිම කිරීම</p>
              </div>
              <button
                onClick={() => setActiveTab('services')}
                className="text-[11px] font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Service 4 */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] border border-[#E8DEC8] text-[#8B5E3C] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-[#2B190E]">On-site Installation</h3>
                <p className="text-[10px] text-[#7A6252]">ස්ථානීය සවිකිරීම්</p>
              </div>
              <button
                onClick={() => setActiveTab('services')}
                className="text-[11px] font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </section>


      </div>
    </div>
  );
}

