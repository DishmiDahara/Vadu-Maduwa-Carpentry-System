import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  const categories = [
    'All',
    'Living Room',
    'Bedroom',
    'Dining',
    'Doors & Windows',
    'Office'
  ];

  const galleryPhotos = [
    { id: 1, title: 'Luxury Bedroom Bed Set', category: 'Bedroom', image: '/banner_crafts/card_bedroom.jpg' },
    { id: 2, title: 'Solid Teak Dining Table', category: 'Dining', image: '/banner_crafts/card_dining.jpg' },
    { id: 3, title: 'Modern Wooden Door', category: 'Doors & Windows', image: '/banner_crafts/door_main.jpg' },
    { id: 4, title: 'Custom Wardrobe', category: 'Bedroom', image: '/banner_crafts/card_furniture.jpg' },
    { id: 5, title: 'Wooden Staircase & Railing', category: 'Living Room', image: '/banner_crafts/staircase_main.jpg' },
    { id: 6, title: 'Executive Office Desk', category: 'Office', image: '/banner_crafts/card_furniture.jpg' },
    { id: 7, title: 'Living Room Furniture Set', category: 'Living Room', image: '/banner_crafts/card_dining.jpg' },
    { id: 8, title: 'Carved Main Entrance Door', category: 'Doors & Windows', image: '/banner_crafts/door_main.jpg' }
  ];

  const filteredPhotos = selectedCategory === 'All'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Page Header */}
        <div className="border-b border-[#E8DEC8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">Gallery</h1>
          <p className="text-xs sm:text-sm text-[#7A6252] mt-0.5 font-medium">Browse our completed carpentry & furniture installation projects</p>
        </div>

        {/* Category Pills (Mockup Match) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
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

        {/* 8 Photo Grid */}
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
                  <span>View</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Photos Button */}
        <div className="text-center pt-4">
          <button
            onClick={() => alert('All gallery photos loaded!')}
            className="bg-[#3D2415] hover:bg-[#8B5E3C] text-white px-8 py-3 rounded-xl font-bold text-xs transition-all shadow"
          >
            View More Photos
          </button>
        </div>

      </div>

      {/* Lightbox Viewer Modal */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="bg-white border border-[#E8DEC8] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-80 sm:h-96">
              <img src={lightboxImg.image} alt={lightboxImg.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-[#FAF4EB]">
              <span className="text-[10px] font-bold text-[#8B5E3C] uppercase">{lightboxImg.category}</span>
              <h3 className="text-base font-bold text-[#2B190E]">{lightboxImg.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
