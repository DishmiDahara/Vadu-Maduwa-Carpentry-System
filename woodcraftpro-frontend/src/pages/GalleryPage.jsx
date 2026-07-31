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
    { id: 1, title: 'Carved Teak Main Entrance Door', category: t('catDoors'), image: '/teak_door.png' },
    { id: 2, title: 'Fitted Modular Teak Pantry Kitchen', category: t('catPantry'), image: '/banner_crafts/card_dining.jpg' },
    { id: 3, title: 'Solid Teak Staircase & Handrail Installation', category: t('catStaircases'), image: '/banner_crafts/staircase_main.jpg' },
    { id: 4, title: 'Modern Bedroom Timber Door', category: t('catDoors'), image: '/banner_crafts/door_main.jpg' },
    { id: 5, title: 'Double Glass Wooden Window Frame', category: t('catWindows'), image: '/banner_crafts/staircase_main.jpg' },
    { id: 6, title: 'Polyurethane Polished Wooden Ceiling', category: t('catCeilings'), image: '/banner_crafts/card_bedroom.jpg' },
    { id: 7, title: 'Seasoned Teak Door Frame (Uluwahu)', category: t('catDoorFrames'), image: '/banner_crafts/door_main.jpg' },
    { id: 8, title: 'Custom Mahogany Kitchen Pantry Set', category: t('catPantry'), image: '/banner_crafts/card_dining.jpg' }
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
