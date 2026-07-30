import React, { useState } from 'react';
import {
  Heart,
  ArrowRight,
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

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">

        {/* ========================================================
            1. HERO STATIC BANNER (Dark Warm Woodcraft Theme - Image 1)
           ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#3E2616] bg-[#20120A] min-h-[500px] sm:min-h-[540px] flex items-center">

          {/* Background Image on Right / Full Mobile Backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-right sm:bg-center bg-no-repeat opacity-60 sm:opacity-90"
            style={{ backgroundImage: `url('/hero_armchair.png')` }}
          ></div>

          {/* Dark Rich Gradient Overlay for High Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#20120A] via-[#20120A]/95 sm:via-[#20120A]/85 to-transparent"></div>

          {/* Hero Content Panel */}
          <div className="relative z-10 max-w-xl px-6 sm:px-12 py-10 sm:py-12 space-y-6">

            {/* Top Leaf Sub-Badge */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#E2B784] uppercase tracking-widest bg-[#382012] border border-[#52331F] px-3.5 py-1 rounded-full shadow-sm">
              <span>🪓</span>
              <span>PREMIUM QUALITY WOODWORK</span>
            </div>

            {/* Main Sinhala Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white leading-tight">
              ඔබේ අදහසට <br />
              ජීවය දෙන <br />
              <span className="text-[#E2B784]">දැව නිර්මාණ</span>
            </h1>

            {/* Sinhala Subtitle */}
            <p className="text-xs sm:text-sm text-[#D1C3B7] leading-relaxed font-normal max-w-lg">
              ඔබගේ අවශ්‍යතාවය, රුචිකත්වය සහ ඉඩකඩට ගැලපෙන පරිදි උසස් තත්ත්වයේ <span className="font-semibold text-white">Custom Furniture</span> නිර්මාණය කර දෙන්නෙමු.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-[#A46E43] hover:bg-[#8F5D34] text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>එකතුව බලන්න</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95 backdrop-blur-sm cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#E2B784]" />
                <span>ඔබේ නිර්මාණය අරඹන්න</span>
              </button>
            </div>

            {/* 4 Feature Badges Row */}
            <div className="pt-6 mt-4 border-t border-[#3E2616] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#D1C3B7]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#331E12] text-[#E2B784] border border-[#482B1B] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white text-[11px] sm:text-xs">25+ Years</span>
                  <span className="text-[10px] text-[#A69485]">Experience</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#331E12] text-[#E2B784] border border-[#482B1B] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white text-[11px] sm:text-xs">Premium</span>
                  <span className="text-[10px] text-[#A69485]">Quality Wood</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#331E12] text-[#E2B784] border border-[#482B1B] shrink-0">
                  <Hammer className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white text-[11px] sm:text-xs">Custom Made</span>
                  <span className="text-[10px] text-[#A69485]">For Your Needs</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#331E12] text-[#E2B784] border border-[#482B1B] shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white text-[11px] sm:text-xs">Islandwide</span>
                  <span className="text-[10px] text-[#A69485]">Delivery</span>
                </div>
              </div>
            </div>

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

