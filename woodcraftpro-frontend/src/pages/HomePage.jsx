import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  Award, 
  Sparkles, 
  Hammer, 
  ShieldCheck, 
  Wrench, 
  Paintbrush, 
  Building2, 
  Truck 
} from 'lucide-react';

export default function HomePage({ setActiveTab, onSelectProductForQuote, onOpenInquiry }) {
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const featuredProducts = [
    {
      id: 'p1',
      title: 'Teak Wood Dining Table',
      price: 'Rs. 85,000',
      rating: 4.8,
      reviews: 32,
      image: '/banner_crafts/card_dining.jpg',
      wood: 'Teak Wood'
    },
    {
      id: 'p2',
      title: 'Modern Wooden Door',
      price: 'Rs. 45,000',
      rating: 4.6,
      reviews: 18,
      image: '/banner_crafts/door_main.jpg',
      wood: 'Mahogany'
    },
    {
      id: 'p3',
      title: 'King Size Wooden Bed',
      price: 'Rs. 120,000',
      rating: 4.9,
      reviews: 27,
      image: '/banner_crafts/card_bedroom.jpg',
      wood: 'Teak Wood'
    },
    {
      id: 'p4',
      title: 'Wooden Wardrobe',
      price: 'Rs. 78,000',
      rating: 4.7,
      reviews: 21,
      image: '/banner_crafts/card_furniture.jpg',
      wood: 'Teak Wood'
    }
  ];

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] font-sans pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-6">

        {/* ========================================================
            1. HERO BANNER (Dark Wood Background matching Mockup)
           ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#4A2E1B] bg-[#2B190E] min-h-[460px] sm:min-h-[520px] flex items-center">
          {/* Hero Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: `url('/hero_staircase_bg.png')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D1109] via-[#2B190E]/90 to-transparent"></div>

          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10 space-y-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white leading-tight">
              ලියෙන් නිර්මාණය වන <br />
              <span className="text-amber-400">ඔබේ සිහින...</span>
            </h1>
            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              අභිරුචි ශ්‍රී ලාංකීය නිර්මාණය, විශ්වසනීයත්වය, උසස් නිමාව සහ සවිකිරීම් සඳහා වඩු මඩුව ඔබ සතූයි.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-[#8B5E3C] hover:bg-[#734A2E] text-white px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 border border-amber-500/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Get Started</span>
              </button>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-transparent hover:bg-white/10 text-white border border-amber-200/40 px-7 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
              >
                Custom Order
              </button>
            </div>
          </div>

          {/* Circular 25+ Years Experience Badge (Mockup Match) */}
          <div className="hidden lg:flex absolute right-12 bottom-12 w-32 h-32 rounded-full border-2 border-dashed border-amber-400/60 p-2 items-center justify-center text-center bg-[#1D1109]/80 backdrop-blur-md shadow-2xl">
            <div>
              <span className="block text-2xl font-black text-amber-400 font-heading leading-none">25+</span>
              <span className="block text-[9px] uppercase tracking-widest text-amber-200 font-bold mt-1">YEARS OF<br/>EXPERIENCE</span>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. FEATURE HIGHLIGHTS BAR (Light Cream Box matching Mockup)
           ======================================================== */}
        <section className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-2xl p-4 sm:p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#2B190E]">Premium Quality Wood</h4>
              <p className="text-[11px] text-[#7A6252]">Handpicked & Seasoned</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center shrink-0">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#2B190E]">Custom Made</h4>
              <p className="text-[11px] text-[#7A6252]">Tailored to Your Needs</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#2B190E]">Expert Craftsmanship</h4>
              <p className="text-[11px] text-[#7A6252]">Skilled & Experienced Team</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#2B190E]">Trusted Service</h4>
              <p className="text-[11px] text-[#7A6252]">On-time Delivery & Support</p>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. FEATURED PRODUCTS GRID (Matching Mockup)
           ======================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#2B190E]">Featured Products</h2>
            <button
              onClick={() => setActiveTab('catalog')}
              className="bg-[#3D2415] hover:bg-[#2B190E] text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-[#E8DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden bg-[#FAF4EB]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow"
                  >
                    <Heart className={`w-4 h-4 ${wishlist[product.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-[#2B190E] group-hover:text-[#8B5E3C] transition-colors">{product.title}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#8B5E3C] text-base">{product.price}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectProductForQuote(product)}
                    className="w-full mt-2 bg-[#F3EDE2] hover:bg-[#8B5E3C] text-[#2B190E] hover:text-white font-bold py-2 rounded-xl text-xs transition-all border border-[#E8DEC8]"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            4. OUR SERVICES (Dark Wood Section matching Mockup)
           ======================================================== */}
        <section className="bg-[#2B190E] text-white rounded-3xl p-6 sm:p-10 border border-[#4A2E1B] shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#4A2E1B] pb-4">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">Our Services</h2>
            <button
              onClick={() => setActiveTab('services')}
              className="bg-[#8B5E3C] hover:bg-[#734A2E] text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              View All Services
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div 
              onClick={() => setActiveTab('services')}
              className="bg-[#1D1109] border border-[#4A2E1B] hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Hammer className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-white">Custom Furniture</h3>
              <p className="text-[10px] text-amber-200/60 mt-1">Design & Build</p>
            </div>

            <div 
              onClick={() => setActiveTab('services')}
              className="bg-[#1D1109] border border-[#4A2E1B] hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-white">Restoration</h3>
              <p className="text-[10px] text-amber-200/60 mt-1">Repair & Polish</p>
            </div>

            <div 
              onClick={() => setActiveTab('services')}
              className="bg-[#1D1109] border border-[#4A2E1B] hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-white">Architectural</h3>
              <p className="text-[10px] text-amber-200/60 mt-1">Woodwork</p>
            </div>

            <div 
              onClick={() => setActiveTab('services')}
              className="bg-[#1D1109] border border-[#4A2E1B] hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Paintbrush className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-white">Polishing &</h3>
              <p className="text-[10px] text-amber-200/60 mt-1">Finishing</p>
            </div>

            <div 
              onClick={() => setActiveTab('services')}
              className="bg-[#1D1109] border border-[#4A2E1B] hover:border-amber-500/50 p-4 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 col-span-2 md:col-span-1"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-white">On-site</h3>
              <p className="text-[10px] text-amber-200/60 mt-1">Installation</p>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. WHAT OUR CUSTOMERS SAY (Testimonials matching Mockup)
           ======================================================== */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#2B190E]">What Our Customers Say</h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Rating Box */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex text-amber-500 text-lg mb-2">★★★★★</div>
                <h3 className="text-3xl font-extrabold text-[#2B190E] font-heading">4.8/5</h3>
                <p className="text-xs text-[#7A6252] mt-1">Based on 120+ reviews</p>
              </div>
              <button
                onClick={() => setActiveTab('contact')}
                className="w-full bg-[#3D2415] hover:bg-[#2B190E] text-white py-2 rounded-xl text-xs font-semibold transition-all"
              >
                View All Reviews
              </button>
            </div>

            {/* Testimonial Card 1 */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 flex flex-col justify-between space-y-3">
              <p className="text-xs text-[#4A3B32] italic leading-relaxed">
                "Excellent craftsmanship and high quality work. Very happy with my custom wardrobe."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#F3EDE2]">
                <div className="w-8 h-8 rounded-full bg-[#8B5E3C] text-white font-bold flex items-center justify-center text-xs">DP</div>
                <div>
                  <h4 className="text-xs font-bold text-[#2B190E]">Dinesh Perera</h4>
                  <p className="text-[10px] text-[#7A6252]">Colombo</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 flex flex-col justify-between space-y-3">
              <p className="text-xs text-[#4A3B32] italic leading-relaxed">
                "ඉතාම උසස් මට්ටමේ මේසෙ. මිල ගණන් ද ඉතා සාධාරණයි. මෙලෙසම ඉදිරියටත් සාර්ථක වෙන්න!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#F3EDE2]">
                <div className="w-8 h-8 rounded-full bg-[#8B5E3C] text-white font-bold flex items-center justify-center text-xs">NF</div>
                <div>
                  <h4 className="text-xs font-bold text-[#2B190E]">Nimal Fernando</h4>
                  <p className="text-[10px] text-[#7A6252]">Kandy</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 3 */}
            <div className="bg-white border border-[#E8DEC8] rounded-2xl p-5 flex flex-col justify-between space-y-3">
              <p className="text-xs text-[#4A3B32] italic leading-relaxed">
                "மிகவும் சிறந்த சேவை! மற்றும் தரமான பொருட்கள்."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#F3EDE2]">
                <div className="w-8 h-8 rounded-full bg-[#8B5E3C] text-white font-bold flex items-center justify-center text-xs">SA</div>
                <div>
                  <h4 className="text-xs font-bold text-[#2B190E]">S. Aravinth</h4>
                  <p className="text-[10px] text-[#7A6252]">Jaffna</p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
