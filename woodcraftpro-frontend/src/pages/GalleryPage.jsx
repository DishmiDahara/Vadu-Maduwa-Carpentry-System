import React, { useEffect, useState } from 'react';
import { Calendar, Tag, Eye } from 'lucide-react';
import { api } from '../services/api';

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api.getGallery(filterCategory).then(res => setGalleryItems(res));
  }, [filterCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Craft Showcase</span>
        <h1 className="text-4xl font-extrabold font-heading text-gray-900">Completed Projects Gallery</h1>
        <p className="text-sm text-gray-600">Explore real client projects custom designed, manufactured, and installed by WoodCraftPro master carpenters.</p>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {['ALL', 'Bedroom', 'Kitchen', 'Dining', 'Doors'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterCategory === cat
                ? 'bg-[#C68B59] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat === 'ALL' ? 'All Completed Projects' : cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col card-hover"
          >
            <div className="relative h-64 overflow-hidden bg-gray-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4" /> View Showcase
                </span>
              </div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#8B4513] flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#C68B59]" />
                {item.category}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base font-heading group-hover:text-[#C68B59] transition-colors">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 pt-3 border-t border-gray-100">
                <Calendar className="w-3.5 h-3.5" />
                <span>Completed: {item.completedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full h-96 object-cover" />
            <div className="p-6 space-y-2">
              <span className="text-xs font-bold uppercase text-[#C68B59] tracking-wider">{selectedImage.category} Project</span>
              <h2 className="text-2xl font-bold font-heading text-gray-900">{selectedImage.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedImage.description}</p>
              <button
                onClick={() => setSelectedImage(null)}
                className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-gray-800"
              >
                Close Showcase
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
