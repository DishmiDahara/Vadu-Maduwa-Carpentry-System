import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  const categories = [
    t('all'),
    t('catDoors'),
    t('catWindows'),
    t('catStaircases'),
    t('catPantry'),
    t('catDoorFrames'),
    t('catCeilings')
  ];

  const galleryPhotos = [
    { id: 1, title: 'Carved Teak Traditional Main Entrance Door', category: t('catDoors'), image: '/images/doors/IMG_6930.PNG' },
    { id: 2, title: 'Modular L-Shape Teak Pantry Suite', category: t('catPantry'), image: '/images/cupboards/IMG_7175.PNG' },
    { id: 3, title: 'Solid Teak Staircase & Handrail Installation', category: t('catStaircases'), image: '/images/cupboards/IMG_7203.PNG' },
    { id: 4, title: 'Grand Double Teak Entrance Suite with Sidelights', category: t('catDoors'), image: '/images/doors/IMG_7104.PNG' },
    { id: 5, title: 'Double Glass Wooden Window Frame', category: t('catWindows'), image: '/banner_crafts/staircase_main.jpg' },
    { id: 6, title: 'Polyurethane Polished Wooden Ceiling', category: t('catCeilings'), image: '/banner_crafts/card_bedroom.jpg' },
    { id: 7, title: 'Seasoned Teak Door Frame (Uluwahu)', category: t('catDoorFrames'), image: '/banner_crafts/door_main.jpg' },
    { id: 8, title: 'Luxury Mahogany Pantry with Glass Display', category: t('catPantry'), image: '/images/cupboards/IMG_7176.PNG' },
    { id: 9, title: 'Solid Wood Pantry with Plate Rack', category: t('catPantry'), image: '/images/cupboards/IMG_7177.PNG' },
    { id: 10, title: 'Modern Compact Apartment Pantry', category: t('catPantry'), image: '/images/cupboards/IMG_7178.PNG' },
    { id: 11, title: 'Deep Pantry Drawers & Storage Units', category: t('catPantry'), image: '/images/cupboards/IMG_7179.PNG' },
    { id: 12, title: 'Contemporary Overhead Kitchen Pantry Cabinets', category: t('catPantry'), image: '/images/cupboards/IMG_7180.PNG' },
    { id: 13, title: 'Full Wall Fitted Pantry Cupboards', category: t('catPantry'), image: '/images/cupboards/IMG_7181.PNG' },
    { id: 14, title: 'Bespoke Island Countertop Unit', category: t('catPantry'), image: '/images/cupboards/IMG_7182.PNG' },
    { id: 15, title: 'Natural Teak Grain Pantry Finish', category: t('catPantry'), image: '/images/cupboards/IMG_7183.PNG' },
    { id: 16, title: 'Dual-Tone Contemporary Kitchen Cabinets', category: t('catPantry'), image: '/images/cupboards/IMG_7184.PNG' },
    { id: 17, title: 'Custom Teak Kitchen Island & Pantry Tall Units', category: t('catPantry'), image: '/images/cupboards/IMG_7185.PNG' },
    { id: 18, title: 'Corner Carousel Pantry Cabinet', category: t('catPantry'), image: '/images/cupboards/IMG_7186.PNG' },
    { id: 19, title: 'Solid Wood Breakfast Counter & Pantry', category: t('catPantry'), image: '/images/cupboards/IMG_7187.PNG' },
    { id: 20, title: 'Classic Traditional Sri Lankan Pantry', category: t('catPantry'), image: '/images/cupboards/IMG_7188.PNG' },
    { id: 21, title: 'Modern Minimalist Wooden Cupboard Finish', category: t('catPantry'), image: '/images/cupboards/IMG_7189.PNG' },
    { id: 22, title: 'Open Display Shelving Kitchen Unit', category: t('catPantry'), image: '/images/cupboards/IMG_7198.PNG' },
    { id: 23, title: 'Integrated Cooker Hood Canopy Enclosure', category: t('catPantry'), image: '/images/cupboards/IMG_7199.PNG' },
    { id: 24, title: 'Premium Hardwood Pantry Assembly', category: t('catPantry'), image: '/images/cupboards/IMG_7200.PNG' },
    { id: 25, title: 'Matte Natural Sealed Teak Cabinets', category: t('catPantry'), image: '/images/cupboards/IMG_7201.PNG' },
    { id: 26, title: 'Sleek Finger-Pull Kitchen Cupboards', category: t('catPantry'), image: '/images/cupboards/IMG_7202.PNG' },
    { id: 27, title: 'Pantry Tall Larder Storage System', category: t('catPantry'), image: '/images/cupboards/IMG_7204.PNG' },
    { id: 28, title: 'Crafted Timber Pantry with Granite Fittings', category: t('catPantry'), image: '/images/cupboards/IMG_7205.PNG' },
    { id: 29, title: 'Solid Mahogany Fluted Arch Room Door', category: t('catDoors'), image: '/images/doors/IMG_6931.PNG' },
    { id: 30, title: 'Royal Sunburst Carved Entrance Door', category: t('catDoors'), image: '/images/doors/IMG_6936.PNG' },
    { id: 31, title: 'Modern Vertical Slat Villa Entrance Door', category: t('catDoors'), image: '/images/doors/IMG_6942.PNG' },
    { id: 32, title: 'Heritage Arch Double Entry Door', category: t('catDoors'), image: '/images/doors/IMG_6950.PNG' },
    { id: 33, title: 'Traditional Lotus Carved Temple/Villa Door', category: t('catDoors'), image: '/images/doors/IMG_7110.PNG' },
    { id: 34, title: 'Carved Kalawa & Punkalasa Motif Door', category: t('catDoors'), image: '/images/doors/IMG_7116.PNG' },
    { id: 35, title: 'Solid Heavy Timber Double Door Suite', category: t('catDoors'), image: '/images/doors/IMG_7118.PNG' },
    { id: 36, title: 'Royal Heritage Door with Transom Window', category: t('catDoors'), image: '/images/doors/IMG_7129.PNG' }
  ];

  const filteredPhotos = selectedCategory === 'All' || selectedCategory === t('all')
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Page Header */}
        <div className="border-b border-[#E8DEC8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">{t('galleryTitle')}</h1>
          <p className="text-xs sm:text-sm text-[#7A6252] mt-0.5 font-medium">{t('gallerySubtitle')}</p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat || (cat === t('all') && selectedCategory === 'All');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === t('all') ? 'All' : cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'bg-[#3D2415] text-white shadow-sm'
                    : 'bg-white text-[#2B190E] border border-[#E8DEC8] hover:bg-[#FAF4EB]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightboxImg(photo)}
              className="group relative h-48 rounded-2xl overflow-hidden border border-[#E8DEC8] bg-[#FAF4EB] cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('view')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Photos Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => alert('All carpentry installation photos loaded!')}
            className="bg-[#3D2415] hover:bg-[#8B5E3C] text-white px-8 py-3 rounded-xl font-bold text-xs transition-all shadow cursor-pointer"
          >
            {t('viewMorePhotos')}
          </button>
        </div>

      </div>

      {/* Lightbox Viewer Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImg.image} alt={lightboxImg.title} className="w-full h-auto max-h-[75vh] object-contain rounded-xl" />
            <div className="p-3 text-center">
              <h3 className="font-bold text-sm text-[#2B190E]">{lightboxImg.title}</h3>
              <p className="text-xs text-[#7A6252]">{lightboxImg.category}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
