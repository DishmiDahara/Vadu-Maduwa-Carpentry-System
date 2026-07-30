import React, { useState } from 'react';
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
  Building2, 
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">

        {/* ========================================================
            1. HERO SLIDER BANNER (Matching Mockup Screenshot 100%)
           ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8DEC8] bg-[#FAF8F5] min-h-[480px] sm:min-h-[520px] flex items-center">
          
          {/* Generated High-Res Living Room Armchair Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-right sm:bg-center bg-no-repeat transition-transform duration-700"
            style={{ backgroundImage: `url('/hero_armchair.png')` }}
          ></div>

          {/* Subtle vignette gradient overlay allowing image on right to shine through */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/75 sm:via-[#FAF8F5]/60 to-transparent"></div>

          {/* Slider Left / Right Navigation Controls */}
          <button className="absolute left-4 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#E8DEC8] flex items-center justify-center text-[#2B190E] hover:bg-white hover:scale-105 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="absolute right-4 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md border border-[#E8DEC8] flex items-center justify-center text-[#2B190E] hover:bg-white hover:scale-105 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Hero Content Block */}
          <div className="relative z-10 max-w-xl px-6 sm:px-12 py-10 space-y-5">
            
            {/* Top Leaf Sub-Badge */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest bg-[#F3EDE2] border border-[#E8DEC8] px-3 py-1 rounded-full">
              <span>🍃</span>
              <span>PREMIUM QUALITY WOODWORK</span>
            </div>

            {/* Main Sinhala Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#2B190E] leading-tight">
              ඔබේ නිවසට <br />
              <span className="text-[#3D2415]">වටිනාකමක් එකතු කරන්න</span>
            </h1>

            {/* Sinhala Subtitle */}
            <p className="text-xs sm:text-sm text-[#5C4535] leading-relaxed font-medium">
              අවුරුදු 25කට අධික පළපුරුද්ද සහිත වඩු මඩුව,<br />
              ඔබේ සිහින ලී නිර්මාණය වාසනාව කරගැනීමට ඔබ සමඟයි.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-[#3D2415] hover:bg-[#2B190E] text-white px-7 py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-white hover:bg-[#FAF4EB] text-[#2B190E] border border-[#3D2415] px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
              >
                <Package className="w-4 h-4 text-[#8B5E3C]" />
                <span>Custom Order</span>
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

          {/* Slider Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            <span className="w-3 h-1.5 rounded-full bg-[#3D2415]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8DEC8]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8DEC8]"></span>
          </div>

        </section>


        {/* ========================================================
            2. CATEGORY BAR + NEED SOMETHING UNIQUE CARD (Mockup Match)
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Category Icons Strip (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-[#E8DEC8] rounded-2xl p-3 shadow-sm flex items-center justify-around overflow-x-auto no-scrollbar gap-2">
            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-3 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🛋️</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Living Room</h4>
                <p className="text-[10px] text-[#7A6252]">සාලයට</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-3 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🛏️</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Bedroom</h4>
                <p className="text-[10px] text-[#7A6252]">කාමරයට</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-3 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🍽️</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Dining Room</h4>
                <p className="text-[10px] text-[#7A6252]">කෑම කාමරයට</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-3 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🪑</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Office</h4>
                <p className="text-[10px] text-[#7A6252]">කාර්යාලයට</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-3 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center font-bold text-lg">🚪</div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Doors & Windows</h4>
                <p className="text-[10px] text-[#7A6252]">දොර / ජනෙල්</p>
              </div>
            </div>
          </div>

          {/* Need Something Unique Banner Box (4 Cols) */}
          <div className="lg:col-span-4 bg-[#1D1109] text-white border border-[#3D2415] rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="space-y-1.5">
              <h3 className="font-bold text-xs text-white">Need Something Unique?</h3>
              <p className="text-[10px] text-amber-200/70">Design your own furniture in 3D</p>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="mt-1 bg-[#8B5E3C] hover:bg-[#734A2E] text-white px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5"
              >
                <span>Start Custom Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-16 h-16 rounded-xl bg-[#2B190E] border border-[#4A2E1B] flex items-center justify-center text-2xl shadow shrink-0">
              🪑
            </div>
          </div>

        </section>


        {/* ========================================================
            3. FEATURED PRODUCTS GRID (Matching Mockup 100%)
           ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-heading text-[#2B190E]">Featured Products</h2>
              <span className="text-sm">🍃</span>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1"
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
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
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
            4. OUR SERVICES (Light Cream Cards matching Mockup)
           ======================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold font-heading text-[#2B190E]">Our Services</h2>
              <span className="text-sm">🍃</span>
            </div>
            <button
              onClick={() => setActiveTab('services')}
              className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1"
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
                className="text-[11px] font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 pt-2"
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
                className="text-[11px] font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 pt-2"
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
                className="text-[11px] font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 pt-2"
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
                className="text-[11px] font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 pt-2"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </section>


        {/* ========================================================
            5. WHAT OUR CUSTOMERS SAY (Dark Wood Bottom Banner matching Mockup)
           ======================================================== */}
        <section className="bg-[#1D1109] text-white rounded-3xl p-6 sm:p-8 border border-[#3D2415] shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#3D2415] pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-heading text-white">What Our Customers Say</h2>
              <span className="text-sm">🍃</span>
            </div>
            <button
              onClick={() => setActiveTab('contact')}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              View All Reviews
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* 3 Review Cards Grid (7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Review 1 */}
              <div className="bg-[#2B190E] border border-[#4A2E1B] rounded-2xl p-4 flex flex-col justify-between space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="text-amber-400 text-xs">★★★★★</div>
                  <p className="text-[11px] text-amber-100/80 italic leading-relaxed">
                    "Excellent craftsmanship and high quality work. Very happy with my custom wardrobe."
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#4A2E1B]">
                  <div className="w-6 h-6 rounded-full bg-[#8B5E3C] text-white font-bold flex items-center justify-center text-[10px]">DP</div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">Dinesh Perera</h4>
                    <p className="text-[9px] text-amber-300/60">Colombo</p>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-[#2B190E] border border-[#4A2E1B] rounded-2xl p-4 flex flex-col justify-between space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="text-amber-400 text-xs">★★★★★</div>
                  <p className="text-[11px] text-amber-100/80 italic leading-relaxed">
                    "වඩු මඩුවේ වැඩ නිමාව ඉතාමත් සුපිරි. නීර්දේශ කරනවා!"
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#4A2E1B]">
                  <div className="w-6 h-6 rounded-full bg-[#8B5E3C] text-white font-bold flex items-center justify-center text-[10px]">NF</div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">Nimal Fernando</h4>
                    <p className="text-[9px] text-amber-300/60">Kandy</p>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-[#2B190E] border border-[#4A2E1B] rounded-2xl p-4 flex flex-col justify-between space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="text-amber-400 text-xs">★★★★★</div>
                  <p className="text-[11px] text-amber-100/80 italic leading-relaxed">
                    "மிகவும் சிறந்த சேவை மற்றும் தரமான வேலை. நன்றி!"
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-[#4A2E1B]">
                  <div className="w-6 h-6 rounded-full bg-[#8B5E3C] text-white font-bold flex items-center justify-center text-[10px]">SA</div>
                  <div>
                    <h4 className="font-bold text-white text-[11px]">S. Aravinth</h4>
                    <p className="text-[9px] text-amber-300/60">Jaffna</p>
                  </div>
                </div>
              </div>

            </div>

            {/* 4 Stat Columns Stack (5 Cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-l border-[#3D2415] pl-0 lg:pl-6">
              <div>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-white font-heading">25+</h3>
                <p className="text-[10px] text-amber-200/60 font-medium">Years of Experience</p>
              </div>

              <div>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-white font-heading">1000+</h3>
                <p className="text-[10px] text-amber-200/60 font-medium">Happy Customers</p>
              </div>

              <div>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1">
                  <Hammer className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-white font-heading">1500+</h3>
                <p className="text-[10px] text-amber-200/60 font-medium">Projects Completed</p>
              </div>

              <div>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-extrabold text-white font-heading">99%</h3>
                <p className="text-[10px] text-amber-200/60 font-medium">Customer Satisfaction</p>
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}
