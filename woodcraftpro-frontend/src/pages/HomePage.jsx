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
  Package,
  Eye,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage({ setActiveTab, onSelectProductForQuote, onOpenInquiry }) {
  const { t } = useLanguage();
  const [wishlist, setWishlist] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [pantryLightboxIndex, setPantryLightboxIndex] = useState(null);
  const [showAllPantryPhotos, setShowAllPantryPhotos] = useState(false);
  const [doorLightboxIndex, setDoorLightboxIndex] = useState(null);
  const [showAllDoorPhotos, setShowAllDoorPhotos] = useState(false);

  // All 33 authentic wooden door photos from "images\wadu maduwa\Wadu maduwa"
  const allWoodenDoorPhotos = [
    { id: 1, src: '/images/doors/IMG_6930.PNG', title: 'Carved Teak Traditional Main Entrance Door', desc: 'Handcrafted traditional Sri Lankan floral carving with raised border mouldings' },
    { id: 2, src: '/images/doors/IMG_6931.PNG', title: 'Solid Mahogany Fluted Arch Room Door', desc: 'Sleek fluted timber panels with durable polyurethane polish' },
    { id: 3, src: '/images/doors/IMG_6932.jpg', title: 'Double Sash Heritage Verandah Door', desc: 'Classic bungalow style twin doors with solid brass fittings' },
    { id: 4, src: '/images/doors/IMG_6934.PNG', title: 'Geometric 6-Panel Solid Wood Door', desc: 'Seasoned timber construction with clean bevelled panel details' },
    { id: 5, src: '/images/doors/IMG_6935.PNG', title: 'Contemporary Minimalist Teak Door', desc: 'Smooth horizontal grain finish with subtle shadow line grooves' },
    { id: 6, src: '/images/doors/IMG_6936.PNG', title: 'Royal Sunburst Carved Entrance Door', desc: 'Intricate radial ray carving on heavy duty seasoned teak' },
    { id: 7, src: '/images/doors/IMG_6942.PNG', title: 'Modern Vertical Slat Villa Entrance Door', desc: 'Full height solid teak batten door with concealed pivot system' },
    { id: 8, src: '/images/doors/IMG_6950.PNG', title: 'Heritage Arch Double Entry Door', desc: 'Hand-shaped arched top rail with classical Sri Lankan motif' },
    { id: 9, src: '/images/doors/IMG_7104.PNG', title: 'Grand Double Teak Entrance Suite with Sidelights', desc: 'Luxury arched header with matching glass sidelight frames' },
    { id: 10, src: '/images/doors/IMG_7105.PNG', title: 'Classic 4-Panel Bedroom Timber Door', desc: 'Mortise & tenon joinery in seasoned mahogany for indoor bedrooms' },
    { id: 11, src: '/images/doors/IMG_7106.PNG', title: 'Diamond Carved Centerpiece Door', desc: 'Hand carved center diamond rosette on solid timber core' },
    { id: 12, src: '/images/doors/IMG_7109.PNG', title: 'Modern Pivot Main Door with Glass Inserts', desc: 'Heavy solid wood pivot door with frosted security glass panels' },
    { id: 13, src: '/images/doors/IMG_7110.PNG', title: 'Traditional Lotus Carved Temple/Villa Door', desc: 'Sacred lotus flower carving with deep relief wood craftsmanship' },
    { id: 14, src: '/images/doors/IMG_7111.PNG', title: 'Warm Walnut Finish Interior Room Door', desc: 'Rich stained dark walnut finish with modern matte lacquer' },
    { id: 15, src: '/images/doors/IMG_7112.PNG', title: 'Cross-Panel Solid Teak Exterior Door', desc: 'Weatherproof exterior PU sealant designed for Sri Lankan monsoon climate' },
    { id: 16, src: '/images/doors/IMG_7114.PNG', title: 'Traditional Uluwahu Fitted Single Door', desc: 'Precision fitted to seasoned 4x3 teak door frame' },
    { id: 17, src: '/images/doors/IMG_7115.PNG', title: 'Dual Panel Raised Moulding Bedroom Door', desc: 'Quiet soft-closing timber door with acoustic rubber seal edge' },
    { id: 18, src: '/images/doors/IMG_7116.PNG', title: 'Carved Kalawa & Punkalasa Motif Door', desc: 'Prosperity punkalasa traditional wood carving for main front entrance' },
    { id: 19, src: '/images/doors/IMG_7117.PNG', title: 'Contemporary Linear Groove Teak Door', desc: 'Machined precision grooves with satin clear polyurethane coating' },
    { id: 20, src: '/images/doors/IMG_7118.PNG', title: 'Solid Heavy Timber Double Door Suite', desc: 'Pair of matching solid entrance doors with long brass pull handles' },
    { id: 21, src: '/images/doors/IMG_7119.PNG', title: 'Natural Teak Grain Master Bedroom Door', desc: 'Preserves the golden natural grain pattern of premium timber' },
    { id: 22, src: '/images/doors/IMG_7122.PNG', title: 'Arched Window-Panel Front Entrance Door', desc: 'Semi-glazed entrance door allowing daylight into the foyer' },
    { id: 23, src: '/images/doors/IMG_7123.PNG', title: 'Triple Panel Classical Room Door', desc: 'Balanced 3-tier vertical panels for hallway and guest bedrooms' },
    { id: 24, src: '/images/doors/IMG_7124.PNG', title: 'Chevron Pattern Solid Timber Door', desc: 'Artisan hand-assembled solid timber door' },
    { id: 25, src: '/images/doors/IMG_7125.PNG', title: 'Bespoke Custom Carved Crest Door', desc: 'Custom insignia or family crest carving on entrance door' },
    { id: 26, src: '/images/doors/IMG_7126.PNG', title: 'Rustic Weathered Finish Barn Style Door', desc: 'Sliding barn door hardware on thick solid timber slab' },
    { id: 27, src: '/images/doors/IMG_7128.PNG', title: 'Deep Routed Architectural Panel Door', desc: 'Heavy bevel architectural profiles for luxury residences' },
    { id: 28, src: '/images/doors/IMG_7129.PNG', title: 'Royal Heritage Door with Transom Window', desc: 'Full entrance ensemble with top fanlight ventilation transom' },
    { id: 29, src: '/images/doors/07889A89-9286-42DF-93E0-DC977F31C135.jpg', title: 'Hand-Polished Teak Entrance Door', desc: 'Mirror PU finish showing exquisite grain and golden tones' },
    { id: 30, src: '/images/doors/3AB3F8DD-DE2B-4F19-8A35-4FA1F9C2A213.JPG', title: 'Custom Fitted Solid Wood Room Door', desc: 'Installed on site with mortise lock and premium hinges' },
    { id: 31, src: '/images/doors/95881523-536A-4F48-AA1C-FEBDA96E3BED.jpg', title: 'Crafted Solid Mahogany Front Door', desc: 'Heavy duty timber core with termite-proof treatment' },
    { id: 32, src: '/images/doors/D027E213-2136-4E54-84B3-658AED56AB74.jpg', title: 'Artisan Carved Single Entrance Door', desc: 'Detailed hand chiseled floral ornamentation by master carpenters' },
    { id: 33, src: '/images/doors/F3A24679-4C1D-45C5-A741-00C8ABBEE902.jpg', title: 'Modern Clean-Line Interior Door', desc: 'Minimalist aesthetic for modern apartment or hotel interiors' }
  ];

  // All 23 authentic project photos from "images\wadu maduwa\Wadu maduwa 2"
  const allPantryCupboardPhotos = [
    { id: 1, src: '/images/cupboards/IMG_7175.PNG', title: 'Modular L-Shape Teak Pantry Suite', desc: 'Granite countertop with overhead glass display cupboards' },
    { id: 2, src: '/images/cupboards/IMG_7176.PNG', title: 'Luxury Mahogany Pantry & Wine Rack', desc: 'Hanging wine glass rack with solid timber island counter' },
    { id: 3, src: '/images/cupboards/IMG_7177.PNG', title: 'Solid Wood Pantry with Plate Rack', desc: 'Integrated stainless steel drainage rack and seasoning cabinets' },
    { id: 4, src: '/images/cupboards/IMG_7178.PNG', title: 'Modern Compact Apartment Pantry', desc: 'Space-saving modular cupboards with soft-close hinges' },
    { id: 5, src: '/images/cupboards/IMG_7179.PNG', title: 'Deep Pantry Drawers & Storage Units', desc: 'Heavy-duty soft close drawer runners and spice pull-out' },
    { id: 6, src: '/images/cupboards/IMG_7180.PNG', title: 'Overhead Wall-Mounted Glass Cabinets', desc: 'Frosted glass doors with built-in LED ambient under-lighting' },
    { id: 7, src: '/images/cupboards/IMG_7181.PNG', title: 'Full Wall Fitted Pantry Cupboards', desc: 'Floor-to-ceiling storage units with solid teak handles' },
    { id: 8, src: '/images/cupboards/IMG_7182.PNG', title: 'Bespoke Island Countertop Unit', desc: 'Central cooking island with breakfast bar seating overhang' },
    { id: 9, src: '/images/cupboards/IMG_7183.PNG', title: 'Natural Teak Grain Pantry Finish', desc: 'Moisture resistant polyurethane sealed natural teak grain' },
    { id: 10, src: '/images/cupboards/IMG_7184.PNG', title: 'Dual-Tone Contemporary Kitchen Cabinets', desc: 'Modern minimalist finish with flush cabinetry panels' },
    { id: 11, src: '/images/cupboards/IMG_7185.PNG', title: 'Custom Tall Unit Oven & Microwave Housing', desc: 'Built-in appliance column with upper and lower storage' },
    { id: 12, src: '/images/cupboards/IMG_7186.PNG', title: 'Corner Carousel Pantry Cabinet', desc: 'Maximum corner accessibility with revolving wire basket fittings' },
    { id: 13, src: '/images/cupboards/IMG_7187.PNG', title: 'Solid Wood Breakfast Counter & Pantry', desc: 'Warm mahogany breakfast bar adjoining main pantry unit' },
    { id: 14, src: '/images/cupboards/IMG_7188.PNG', title: 'Classic Traditional Sri Lankan Pantry', desc: 'Handcrafted timber mouldings and fluted wooden pillars' },
    { id: 15, src: '/images/cupboards/IMG_7189.PNG', title: 'Under-Sink Moisture Resistant Cabinets', desc: 'Specially treated water-resistant teak carcass for sink area' },
    { id: 16, src: '/images/cupboards/IMG_7198.PNG', title: 'Open Display Shelving Kitchen Unit', desc: 'Decorative solid timber floating spice and cup shelves' },
    { id: 17, src: '/images/cupboards/IMG_7199.PNG', title: 'Integrated Cooker Hood Canopy Enclosure', desc: 'Timber framed extraction hood housing matching cupboard finish' },
    { id: 18, src: '/images/cupboards/IMG_7200.PNG', title: 'Premium Hardwood Pantry Assembly', desc: 'Precision mortise and tenon joinery on solid cabinet frames' },
    { id: 19, src: '/images/cupboards/IMG_7201.PNG', title: 'Matte Natural Sealed Teak Cabinets', desc: 'Scratch resistant PU matte clear coat preserving authentic texture' },
    { id: 20, src: '/images/cupboards/IMG_7202.PNG', title: 'Sleek Finger-Pull Kitchen Cupboards', desc: 'Handle-less modern profile groove doors in solid teak' },
    { id: 21, src: '/images/cupboards/IMG_7204.PNG', title: 'Pantry Tall Larder Storage System', desc: 'Multi-shelf vertical storage for dry goods and kitchenware' },
    { id: 22, src: '/images/cupboards/IMG_7205.PNG', title: 'High-Gloss Luxury Pantry Cupboard Finish', desc: 'Mirror finish polyurethane gloss polish with granite counters' }
  ];

  // Hero Slides Data using images from /images/home/
  const heroSlides = [
    {
      image: '/images/home/IMG_7211.PNG',
      badge: t('heroBadge1'),
      titleLine1: t('heroTitle1_1'),
      titleLine2: t('heroTitle1_2'),
      descLine1: t('heroDesc1_1'),
      descLine2: t('heroDesc1_2')
    },
    {
      image: '/images/cupboards/IMG_7175.PNG',
      badge: t('heroBadge2'),
      titleLine1: t('heroTitle2_1'),
      titleLine2: t('heroTitle2_2'),
      descLine1: t('heroDesc2_1'),
      descLine2: t('heroDesc2_2')
    },
    {
      image: '/images/home/IMG_7215.PNG',
      badge: t('heroBadge3'),
      titleLine1: t('heroTitle3_1'),
      titleLine2: t('heroTitle3_2'),
      descLine1: t('heroDesc3_1'),
      descLine2: t('heroDesc3_2')
    },
    {
      image: '/images/home/IMG_7216.PNG',
      badge: t('heroBadge4'),
      titleLine1: t('heroTitle4_1'),
      titleLine2: t('heroTitle4_2'),
      descLine1: t('heroDesc4_1'),
      descLine2: t('heroDesc4_2')
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
      image: '/images/cupboards/IMG_7176.PNG',
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
        <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8DEC8] bg-[#1C120C] min-h-[500px] sm:min-h-[540px] flex items-center">
          {/* Full background image without box clipping */}
          <div 
            key={currentSlideIndex}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 animate-fade-in"
            style={{ backgroundImage: `url('${currentSlide.image}')` }}
          ></div>

          {/* Premium dark gradient overlay ensuring 100% image visibility while keeping text crisp */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/50 sm:to-black/20"></div>

          <button 
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-4 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/30 text-white backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button 
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-4 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/30 text-white backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative z-10 max-w-xl px-6 sm:px-12 py-10 space-y-5 text-white">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-950/80 border border-amber-500/40 px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-md">
              <span>🍃</span>
              <span>{currentSlide.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white leading-tight drop-shadow-md">
              {currentSlide.titleLine1} <br />
              <span className="text-amber-400">{currentSlide.titleLine2}</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium drop-shadow-sm">
              {currentSlide.descLine1}<br />
              {currentSlide.descLine2}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('catalog')}
                className="bg-amber-700 hover:bg-amber-600 text-white px-7 py-3 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer border border-amber-500/40"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/40 px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-md backdrop-blur-md active:scale-95 cursor-pointer"
              >
                <Package className="w-4 h-4 text-amber-300" />
                <span>{t('customOrderBtn')}</span>
              </button>
            </div>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-white/20 text-[11px] text-gray-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">{t('expYears')}</span>
                  <span className="text-[10px] text-gray-300">{t('expSub')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">{t('premQuality')}</span>
                  <span className="text-[10px] text-gray-300">{t('premSub')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">{t('customMade')}</span>
                  <span className="text-[10px] text-gray-300">{t('customSub')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block text-white">{t('ontimeDelivery')}</span>
                  <span className="text-[10px] text-gray-300">{t('ontimeSub')}</span>
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
                    ? 'w-6 h-2 rounded-full bg-amber-400'
                    : 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </section>

        {/* 2. CARPENTRY SERVICES QUICK ICONS BAR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-8 bg-white border border-[#E8DEC8] rounded-2xl p-3 shadow-sm flex items-center justify-around overflow-x-auto no-scrollbar gap-2">
            <div 
              onClick={() => {
                const el = document.getElementById('doors-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('catalog');
                }
              }}
              className="flex items-center gap-2.5 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0 group border border-transparent hover:border-[#E8DEC8]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] group-hover:bg-[#8B5E3C] group-hover:text-white text-[#8B5E3C] flex items-center justify-center font-bold text-lg transition-colors">🚪</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#2B190E]">{t('svcDoors')}</h4>
                  <span className="text-[9px] font-extrabold bg-[#8B5E3C] text-white px-1.5 py-0.2 rounded-full">33</span>
                </div>
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
              onClick={() => {
                const el = document.getElementById('pantry-cupboard-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('catalog');
                }
              }}
              className="flex items-center gap-2.5 p-2 hover:bg-[#FAF4EB] rounded-xl cursor-pointer transition-colors shrink-0 group border border-transparent hover:border-[#E8DEC8]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FAF4EB] group-hover:bg-[#8B5E3C] group-hover:text-white text-[#8B5E3C] flex items-center justify-center font-bold text-lg transition-colors">🗄️</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#2B190E]">{t('svcPantry')}</h4>
                  <span className="text-[9px] font-extrabold bg-[#8B5E3C] text-white px-1.5 py-0.2 rounded-full">22</span>
                </div>
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

        {/* 2.7 DEDICATED WOODEN DOORS SHOWCASE SECTION (33 REAL WORKSHOP PHOTOS) */}
        <section id="doors-section" className="scroll-mt-20 bg-white border border-[#E8DEC8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider bg-[#FAF4EB] border border-[#E8DEC8] px-3.5 py-1 rounded-full">
                <span>🚪</span>
                <span>{t('svcDoors')} • 33 Real Workshop Photos</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#2B190E] flex items-center gap-2">
                <span>{t('svcDoors')}</span>
                <span className="text-xs font-semibold text-[#8B5E3C] bg-[#FAF4EB] border border-[#E8DEC8] px-2.5 py-0.5 rounded-full">
                  33 Photos
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6252] max-w-2xl font-medium leading-relaxed">
                Handcrafted solid Teak, Mahogany, and Nadun timber main entrance doors, interior bedroom doors, and double arch doors with traditional Sri Lankan hand carvings.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowAllDoorPhotos(prev => !prev)}
                className="bg-[#FAF4EB] hover:bg-[#E8DEC8] text-[#2B190E] border border-[#E8DEC8] px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showAllDoorPhotos ? 'Show Top 8 Photos' : 'View All 33 Photos'}</span>
              </button>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-[#3D2415] hover:bg-[#8B5E3C] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Custom Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 33 Door Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(showAllDoorPhotos ? allWoodenDoorPhotos : allWoodenDoorPhotos.slice(0, 8)).map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setDoorLightboxIndex(index)}
                className="group relative rounded-2xl overflow-hidden border border-[#E8DEC8] bg-[#FAF4EB] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden bg-[#FAF4EB]">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>View Photo</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    #{index + 1}
                  </div>
                </div>

                <div className="p-3 bg-white space-y-0.5 border-t border-[#E8DEC8]">
                  <h4 className="text-xs font-bold text-[#2B190E] line-clamp-1 group-hover:text-[#8B5E3C] transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-[10px] text-[#7A6252] line-clamp-1">
                    {photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Expand Bar */}
          {!showAllDoorPhotos && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowAllDoorPhotos(true)}
                className="bg-[#FAF4EB] hover:bg-[#8B5E3C] hover:text-white text-[#2B190E] border border-[#E8DEC8] px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse All 33 Real Workshop Photos</span>
                <span className="bg-[#8B5E3C] text-white text-[10px] px-2 py-0.5 rounded-full">33</span>
              </button>
            </div>
          )}
        </section>

        {/* 2.8 DEDICATED PANTRY CUPBOARDS & KITCHEN CABINETS SHOWCASE SECTION (22 REAL WORKSHOP PHOTOS) */}
        <section id="pantry-cupboard-section" className="scroll-mt-20 bg-white border border-[#E8DEC8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DEC8] pb-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider bg-[#FAF4EB] border border-[#E8DEC8] px-3.5 py-1 rounded-full">
                <span>🗄️</span>
                <span>{t('svcPantry')} • 22 Real Workshop Photos</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-[#2B190E] flex items-center gap-2">
                <span>{t('svcPantry')}</span>
                <span className="text-xs font-semibold text-[#8B5E3C] bg-[#FAF4EB] border border-[#E8DEC8] px-2.5 py-0.5 rounded-full">
                  22 Photos
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6252] max-w-2xl font-medium leading-relaxed">
                Handcrafted modular kitchen pantries, teak cupboards, wall cabinets, and custom island units manufactured right in our workshop.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowAllPantryPhotos(prev => !prev)}
                className="bg-[#FAF4EB] hover:bg-[#E8DEC8] text-[#2B190E] border border-[#E8DEC8] px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showAllPantryPhotos ? 'Show Top 8 Photos' : 'View All 22 Photos'}</span>
              </button>
              <button
                onClick={() => setActiveTab('custom-order')}
                className="bg-[#3D2415] hover:bg-[#8B5E3C] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Custom Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 22 Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(showAllPantryPhotos ? allPantryCupboardPhotos : allPantryCupboardPhotos.slice(0, 8)).map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setPantryLightboxIndex(index)}
                className="group relative rounded-2xl overflow-hidden border border-[#E8DEC8] bg-[#FAF4EB] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative h-44 sm:h-48 overflow-hidden bg-[#FAF4EB]">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>View Photo</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    #{index + 1}
                  </div>
                </div>

                <div className="p-3 bg-white space-y-0.5 border-t border-[#E8DEC8]">
                  <h4 className="text-xs font-bold text-[#2B190E] line-clamp-1 group-hover:text-[#8B5E3C] transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-[10px] text-[#7A6252] line-clamp-1">
                    {photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Expand Bar */}
          {!showAllPantryPhotos && (
            <div className="text-center pt-2">
              <button
                onClick={() => setShowAllPantryPhotos(true)}
                className="bg-[#FAF4EB] hover:bg-[#8B5E3C] hover:text-white text-[#2B190E] border border-[#E8DEC8] px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse All 22 Real Workshop Photos</span>
                <span className="bg-[#8B5E3C] text-white text-[10px] px-2 py-0.5 rounded-full">22</span>
              </button>
            </div>
          )}
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
              <button 
                onClick={() => {
                  const el = document.getElementById('doors-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-[11px] font-bold text-[#E2B784] hover:underline flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>View 33 Workshop Photos</span> <ArrowRight className="w-3 h-3" />
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
              <button 
                onClick={() => {
                  const el = document.getElementById('pantry-cupboard-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-[11px] font-bold text-[#E2B784] hover:underline flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>View 22 Workshop Photos</span> <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Interactive 33-Photo Wooden Doors Lightbox */}
      {doorLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setDoorLightboxIndex(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#1D1109] border border-[#4A2E1B] rounded-2xl overflow-hidden shadow-2xl p-3 sm:p-4 text-white space-y-3"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#3D2415]">
              <div className="flex items-center gap-2">
                <span className="bg-[#8B5E3C] text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                  Door Photo {doorLightboxIndex + 1} of {allWoodenDoorPhotos.length}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-amber-200">
                  {allWoodenDoorPhotos[doorLightboxIndex].title}
                </h3>
              </div>
              <button
                onClick={() => setDoorLightboxIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image with Navigation Arrows */}
            <div className="relative flex items-center justify-center bg-black/50 rounded-xl overflow-hidden min-h-[50vh] max-h-[70vh]">
              <img
                src={allWoodenDoorPhotos[doorLightboxIndex].src}
                alt={allWoodenDoorPhotos[doorLightboxIndex].title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDoorLightboxIndex(prev => (prev === 0 ? allWoodenDoorPhotos.length - 1 : prev - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDoorLightboxIndex(prev => (prev === allWoodenDoorPhotos.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Footer details & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <p className="text-xs text-gray-300">
                {allWoodenDoorPhotos[doorLightboxIndex].desc}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const selected = allWoodenDoorPhotos[doorLightboxIndex];
                    setDoorLightboxIndex(null);
                    if (onSelectProductForQuote) {
                      onSelectProductForQuote({
                        productName: selected.title,
                        basePrice: 55000,
                        imageUrl: selected.src
                      });
                    } else {
                      setActiveTab('contact');
                    }
                  }}
                  className="bg-[#8B5E3C] hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Request Quotation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {pantryLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setPantryLightboxIndex(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#1D1109] border border-[#4A2E1B] rounded-2xl overflow-hidden shadow-2xl p-3 sm:p-4 text-white space-y-3"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#3D2415]">
              <div className="flex items-center gap-2">
                <span className="bg-[#8B5E3C] text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                  Photo {pantryLightboxIndex + 1} of {allPantryCupboardPhotos.length}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-amber-200">
                  {allPantryCupboardPhotos[pantryLightboxIndex].title}
                </h3>
              </div>
              <button
                onClick={() => setPantryLightboxIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image with Navigation Arrows */}
            <div className="relative flex items-center justify-center bg-black/50 rounded-xl overflow-hidden min-h-[50vh] max-h-[70vh]">
              <img
                src={allPantryCupboardPhotos[pantryLightboxIndex].src}
                alt={allPantryCupboardPhotos[pantryLightboxIndex].title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPantryLightboxIndex(prev => (prev === 0 ? allPantryCupboardPhotos.length - 1 : prev - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPantryLightboxIndex(prev => (prev === allPantryCupboardPhotos.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Footer details & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <p className="text-xs text-gray-300">
                {allPantryCupboardPhotos[pantryLightboxIndex].desc}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const selected = allPantryCupboardPhotos[pantryLightboxIndex];
                    setPantryLightboxIndex(null);
                    if (onSelectProductForQuote) {
                      onSelectProductForQuote({
                        productName: selected.title,
                        basePrice: 250000,
                        imageUrl: selected.src
                      });
                    } else {
                      setActiveTab('contact');
                    }
                  }}
                  className="bg-[#8B5E3C] hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Request Quotation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
