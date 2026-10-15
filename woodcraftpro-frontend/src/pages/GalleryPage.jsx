import React, { useState } from 'react';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = [
    { key: 'All', label: t('all') },
    { key: t('catDoors'), label: t('catDoors'), count: 33 },
    { key: t('catPantry'), label: t('catPantry'), count: 22 },
    { key: t('catStaircases'), label: t('catStaircases'), count: 16 }
  ];

  const galleryPhotos = [
    // 33 AUTHENTIC WORKSHOP WOODEN DOORS FROM "images\wadu maduwa\Wadu maduwa"
    { id: 'd1', title: 'Carved Teak Traditional Main Entrance Door', category: t('catDoors'), image: '/images/doors/IMG_6930.PNG' },
    { id: 'd2', title: 'Solid Mahogany Fluted Arch Room Door', category: t('catDoors'), image: '/images/doors/IMG_6931.PNG' },
    { id: 'd3', title: 'Double Sash Heritage Verandah Door', category: t('catDoors'), image: '/images/doors/IMG_6932.jpg' },
    { id: 'd4', title: 'Geometric 6-Panel Solid Wood Door', category: t('catDoors'), image: '/images/doors/IMG_6934.PNG' },
    { id: 'd5', title: 'Contemporary Minimalist Teak Door', category: t('catDoors'), image: '/images/doors/IMG_6935.PNG' },
    { id: 'd6', title: 'Royal Sunburst Carved Entrance Door', category: t('catDoors'), image: '/images/doors/IMG_6936.PNG' },
    { id: 'd7', title: 'Modern Vertical Slat Villa Entrance Door', category: t('catDoors'), image: '/images/doors/IMG_6942.PNG' },
    { id: 'd8', title: 'Heritage Arch Double Entry Door', category: t('catDoors'), image: '/images/doors/IMG_6950.PNG' },
    { id: 'd9', title: 'Grand Double Teak Entrance Suite with Sidelights', category: t('catDoors'), image: '/images/doors/IMG_7104.PNG' },
    { id: 'd10', title: 'Classic 4-Panel Bedroom Timber Door', category: t('catDoors'), image: '/images/doors/IMG_7105.PNG' },
    { id: 'd11', title: 'Diamond Carved Centerpiece Door', category: t('catDoors'), image: '/images/doors/IMG_7106.PNG' },
    { id: 'd12', title: 'Modern Pivot Main Door with Glass Inserts', category: t('catDoors'), image: '/images/doors/IMG_7109.PNG' },
    { id: 'd13', title: 'Traditional Lotus Carved Temple/Villa Door', category: t('catDoors'), image: '/images/doors/IMG_7110.PNG' },
    { id: 'd14', title: 'Warm Walnut Finish Interior Room Door', category: t('catDoors'), image: '/images/doors/IMG_7111.PNG' },
    { id: 'd15', title: 'Cross-Panel Solid Teak Exterior Door', category: t('catDoors'), image: '/images/doors/IMG_7112.PNG' },
    { id: 'd16', title: 'Traditional Uluwahu Fitted Single Door', category: t('catDoors'), image: '/images/doors/IMG_7114.PNG' },
    { id: 'd17', title: 'Dual Panel Raised Moulding Bedroom Door', category: t('catDoors'), image: '/images/doors/IMG_7115.PNG' },
    { id: 'd18', title: 'Carved Kalawa & Punkalasa Motif Door', category: t('catDoors'), image: '/images/doors/IMG_7116.PNG' },
    { id: 'd19', title: 'Contemporary Linear Groove Teak Door', category: t('catDoors'), image: '/images/doors/IMG_7117.PNG' },
    { id: 'd20', title: 'Solid Heavy Timber Double Door Suite', category: t('catDoors'), image: '/images/doors/IMG_7118.PNG' },
    { id: 'd21', title: 'Natural Teak Grain Master Bedroom Door', category: t('catDoors'), image: '/images/doors/IMG_7119.PNG' },
    { id: 'd22', title: 'Arched Window-Panel Front Entrance Door', category: t('catDoors'), image: '/images/doors/IMG_7122.PNG' },
    { id: 'd23', title: 'Triple Panel Classical Room Door', category: t('catDoors'), image: '/images/doors/IMG_7123.PNG' },
    { id: 'd24', title: 'Chevron Pattern Solid Timber Door', category: t('catDoors'), image: '/images/doors/IMG_7124.PNG' },
    { id: 'd25', title: 'Bespoke Custom Carved Crest Door', category: t('catDoors'), image: '/images/doors/IMG_7125.PNG' },
    { id: 'd26', title: 'Rustic Weathered Finish Barn Style Door', category: t('catDoors'), image: '/images/doors/IMG_7126.PNG' },
    { id: 'd27', title: 'Deep Routed Architectural Panel Door', category: t('catDoors'), image: '/images/doors/IMG_7128.PNG' },
    { id: 'd28', title: 'Royal Heritage Door with Transom Window', category: t('catDoors'), image: '/images/doors/IMG_7129.PNG' },
    { id: 'd29', title: 'Hand-Polished Teak Entrance Door', category: t('catDoors'), image: '/images/doors/07889A89-9286-42DF-93E0-DC977F31C135.jpg' },
    { id: 'd30', title: 'Custom Fitted Solid Wood Room Door', category: t('catDoors'), image: '/images/doors/3AB3F8DD-DE2B-4F19-8A35-4FA1F9C2A213.JPG' },
    { id: 'd31', title: 'Crafted Solid Mahogany Front Door', category: t('catDoors'), image: '/images/doors/95881523-536A-4F48-AA1C-FEBDA96E3BED.jpg' },
    { id: 'd32', title: 'Artisan Carved Single Entrance Door', category: t('catDoors'), image: '/images/doors/D027E213-2136-4E54-84B3-658AED56AB74.jpg' },
    { id: 'd33', title: 'Modern Clean-Line Interior Door', category: t('catDoors'), image: '/images/doors/F3A24679-4C1D-45C5-A741-00C8ABBEE902.jpg' },

    // 22 AUTHENTIC WORKSHOP PANTRY CUPBOARDS FROM "images\wadu maduwa\Wadu maduwa 2"
    { id: 'p1', title: 'Modular L-Shape Teak Pantry Suite', category: t('catPantry'), image: '/images/cupboards/IMG_7175.PNG' },
    { id: 'p2', title: 'Luxury Mahogany Pantry & Wine Rack', category: t('catPantry'), image: '/images/cupboards/IMG_7176.PNG' },
    { id: 'p3', title: 'Solid Wood Pantry with Plate Rack', category: t('catPantry'), image: '/images/cupboards/IMG_7177.PNG' },
    { id: 'p4', title: 'Modern Compact Apartment Pantry', category: t('catPantry'), image: '/images/cupboards/IMG_7178.PNG' },
    { id: 'p5', title: 'Deep Pantry Drawers & Storage Units', category: t('catPantry'), image: '/images/cupboards/IMG_7179.PNG' },
    { id: 'p6', title: 'Overhead Wall-Mounted Glass Cabinets', category: t('catPantry'), image: '/images/cupboards/IMG_7180.PNG' },
    { id: 'p7', title: 'Full Wall Fitted Pantry Cupboards', category: t('catPantry'), image: '/images/cupboards/IMG_7181.PNG' },
    { id: 'p8', title: 'Bespoke Island Countertop Unit', category: t('catPantry'), image: '/images/cupboards/IMG_7182.PNG' },
    { id: 'p9', title: 'Natural Teak Grain Pantry Finish', category: t('catPantry'), image: '/images/cupboards/IMG_7183.PNG' },
    { id: 'p10', title: 'Dual-Tone Contemporary Kitchen Cabinets', category: t('catPantry'), image: '/images/cupboards/IMG_7184.PNG' },
    { id: 'p11', title: 'Custom Tall Unit Oven & Microwave Housing', category: t('catPantry'), image: '/images/cupboards/IMG_7185.PNG' },
    { id: 'p12', title: 'Corner Carousel Pantry Cabinet', category: t('catPantry'), image: '/images/cupboards/IMG_7186.PNG' },
    { id: 'p13', title: 'Solid Wood Breakfast Counter & Pantry', category: t('catPantry'), image: '/images/cupboards/IMG_7187.PNG' },
    { id: 'p14', title: 'Classic Traditional Sri Lankan Pantry', category: t('catPantry'), image: '/images/cupboards/IMG_7188.PNG' },
    { id: 'p15', title: 'Under-Sink Moisture Resistant Cabinets', category: t('catPantry'), image: '/images/cupboards/IMG_7189.PNG' },
    { id: 'p16', title: 'Open Display Shelving Kitchen Unit', category: t('catPantry'), image: '/images/cupboards/IMG_7198.PNG' },
    { id: 'p17', title: 'Integrated Cooker Hood Canopy Enclosure', category: t('catPantry'), image: '/images/cupboards/IMG_7199.PNG' },
    { id: 'p18', title: 'Premium Hardwood Pantry Assembly', category: t('catPantry'), image: '/images/cupboards/IMG_7200.PNG' },
    { id: 'p19', title: 'Matte Natural Sealed Teak Cabinets', category: t('catPantry'), image: '/images/cupboards/IMG_7201.PNG' },
    { id: 'p20', title: 'Sleek Finger-Pull Kitchen Cupboards', category: t('catPantry'), image: '/images/cupboards/IMG_7202.PNG' },
    { id: 'p21', title: 'Pantry Tall Larder Storage System', category: t('catPantry'), image: '/images/cupboards/IMG_7204.PNG' },
    { id: 'p22', title: 'High-Gloss Luxury Pantry Cupboard Finish', category: t('catPantry'), image: '/images/cupboards/IMG_7205.PNG' },

    // 16 AUTHENTIC WORKSHOP STAIRCASES & RAILINGS FROM "images\wadu maduwa\Wadu maduwa 3"
    { id: 's1', title: 'Solid Teak Floating Tread Staircase', category: t('catStaircases'), image: '/images/stairs/IMG_7160.PNG' },
    { id: 's2', title: 'Grand Curved Mahogany Staircase Suite', category: t('catStaircases'), image: '/images/stairs/IMG_7161.PNG' },
    { id: 's3', title: 'Classic Turned Baluster Timber Railing', category: t('catStaircases'), image: '/images/stairs/IMG_7162.PNG' },
    { id: 's4', title: 'Contemporary Open-Riser Hardwood Staircase', category: t('catStaircases'), image: '/images/stairs/IMG_7163.PNG' },
    { id: 's5', title: 'Heavy Timber Newel Post & Handrail Set', category: t('catStaircases'), image: '/images/stairs/IMG_7164.PNG' },
    { id: 's6', title: 'Modern Geometric Slat Balustrade', category: t('catStaircases'), image: '/images/stairs/IMG_7165.PNG' },
    { id: 's7', title: 'Luxury Duplex Teak Staircase Installation', category: t('catStaircases'), image: '/images/stairs/IMG_7166.PNG' },
    { id: 's8', title: 'Rustic Natural Grain Hardwood Treads', category: t('catStaircases'), image: '/images/stairs/IMG_7167.PNG' },
    { id: 's9', title: 'Tempered Glass & Solid Teak Cap Railing', category: t('catStaircases'), image: '/images/stairs/IMG_7168.PNG' },
    { id: 's10', title: 'Spiral Solid Timber Space-Saver Staircase', category: t('catStaircases'), image: '/images/stairs/IMG_7169.PNG' },
    { id: 's11', title: 'Under-Stair Custom Timber Storage & Cladding', category: t('catStaircases'), image: '/images/stairs/IMG_7170.PNG' },
    { id: 's12', title: 'Heritage Villa Traditional Timber Balustrade', category: t('catStaircases'), image: '/images/stairs/IMG_7171.PNG' },
    { id: 's13', title: 'Cantilever Floating Timber Tread Steps', category: t('catStaircases'), image: '/images/stairs/IMG_7172.PNG' },
    { id: 's14', title: 'High-Gloss Polished Teak Landing Cladding', category: t('catStaircases'), image: '/images/stairs/IMG_7173.PNG' },
    { id: 's15', title: 'Continuous Curved Ramp & Handrail System', category: t('catStaircases'), image: '/images/stairs/IMG_7174.PNG' },
    { id: 's16', title: 'Crafted Hardwood Interior Staircase & Railing', category: t('catStaircases'), image: '/images/stairs/IMG_7203.PNG' }
  ];

  const filteredPhotos = selectedCategory === 'All'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === selectedCategory);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DEC8] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">{t('galleryTitle')}</h1>
            <p className="text-xs sm:text-sm text-[#7A6252] mt-0.5 font-medium">{t('gallerySubtitle')}</p>
          </div>
          <div className="text-xs font-bold text-[#8B5E3C] bg-[#FAF4EB] border border-[#E8DEC8] px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
            Showing {filteredPhotos.length} {selectedCategory === 'All' ? 'Workshop Projects' : selectedCategory + ' Photos'}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-[#3D2415] text-white shadow-sm'
                    : 'bg-white text-[#2B190E] border border-[#E8DEC8] hover:bg-[#FAF4EB]'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSel ? 'bg-[#8B5E3C] text-white' : 'bg-[#FAF4EB] text-[#8B5E3C]'
                  }`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative h-56 rounded-2xl overflow-hidden border border-[#E8DEC8] bg-[#FAF4EB] cursor-pointer shadow-sm hover:shadow-md transition-all flex flex-col justify-end"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                <div className="self-end bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('view')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">{photo.category}</span>
                  <h4 className="text-xs font-bold line-clamp-2 text-white">{photo.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Interactive Lightbox Viewer Modal with Next/Prev Arrows */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#1D1109] border border-[#4A2E1B] rounded-2xl overflow-hidden shadow-2xl p-3 sm:p-4 text-white space-y-3"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#3D2415]">
              <div className="flex items-center gap-2">
                <span className="bg-[#8B5E3C] text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                  Photo {lightboxIndex + 1} of {filteredPhotos.length}
                </span>
                <span className="text-xs text-amber-300/80 uppercase font-semibold">
                  {activePhoto.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-amber-100 truncate max-w-md hidden sm:block">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image with Navigation Arrows */}
            <div className="relative flex items-center justify-center bg-black/50 rounded-xl overflow-hidden min-h-[50vh] max-h-[72vh]">
              <img 
                src={activePhoto.image} 
                alt={activePhoto.title} 
                className="w-full h-auto max-h-[72vh] object-contain" 
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                title="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                title="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Details Footer */}
            <div className="flex items-center justify-between pt-1">
              <h3 className="font-bold text-xs sm:text-sm text-amber-200">
                {activePhoto.title}
              </h3>
              <span className="text-[11px] text-gray-400">
                {activePhoto.category}
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
