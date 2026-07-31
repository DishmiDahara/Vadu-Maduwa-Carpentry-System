import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CatalogPage({ onSelectProductForQuote, onOpenInquiry }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-low');

  const categories = [
    t('allProducts'),
    t('livingRoom'),
    t('bedroom'),
    t('diningRoom'),
    t('office'),
    t('doorsWindows')
  ];

  const defaultProducts = [
    { id: '1', title: 'Sofa Set', price: 61000, category: t('livingRoom'), image: '/banner_crafts/card_furniture.jpg' },
    { id: '2', title: 'Dining Table Set', price: 65000, category: t('diningRoom'), image: '/banner_crafts/card_dining.jpg' },
    { id: '3', title: 'Executive Office Table', price: 44000, category: t('office'), image: '/banner_crafts/staircase_main.jpg' },
    { id: '4', title: 'King Size Bed Set', price: 120000, category: t('bedroom'), image: '/banner_crafts/card_bedroom.jpg' },
    { id: '5', title: 'Teak Wooden Wardrobe', price: 78000, category: t('bedroom'), image: '/banner_crafts/card_furniture.jpg' },
    { id: '6', title: 'Carved Teak Door', price: 31000, category: t('doorsWindows'), image: '/banner_crafts/door_main.jpg' }
  ];

  // Filtering & Sorting
  const filteredProducts = defaultProducts
    .filter(p => {
      const matchesCat = selectedCategory === 'All' || selectedCategory === t('allProducts') || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Catalog Page Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">{t('catalogTitle')}</h1>
            <p className="text-xs text-[#7A6252] mt-0.5">{t('catalogSubtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none focus:border-[#8B5E3C]"
              />
              <Search className="w-4 h-4 text-[#7A6252] absolute left-3 top-2.5" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7A6252]">
              <span>{t('sortBy')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#E8DEC8] text-[#2B190E] text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-[#8B5E3C]"
              >
                <option value="price-low">{t('priceLowHigh')}</option>
                <option value="price-high">{t('priceHighLow')}</option>
                <option value="name">{t('nameAZ')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar + Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Sidebar Category Filters */}
          <div className="md:col-span-3 bg-white border border-[#E8DEC8] rounded-2xl p-4 space-y-1 shadow-sm">
            <h3 className="text-xs font-bold text-[#7A6252] uppercase tracking-wider px-3 py-2 mb-1">{t('categories')}</h3>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat || (cat === t('allProducts') && selectedCategory === 'All');
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === t('allProducts') ? 'All' : cat)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FAF4EB] text-[#8B5E3C] border border-[#E8DEC8]'
                      : 'text-[#2B190E] hover:bg-[#FAF4EB]/60'
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C]"></span>}
                </button>
              );
            })}
          </div>

          {/* Right Product Grid */}
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <div key={p.id} className="bg-white border border-[#E8DEC8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="h-44 bg-[#FAF4EB] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-[#8B5E3C] bg-[#FAF4EB] px-2 py-0.5 rounded-md">{p.category}</span>
                    <h3 className="font-bold text-sm text-[#2B190E]">{p.title}</h3>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8DEC8]">
                      <span className="font-extrabold text-sm text-[#8B5E3C]">Rs. {p.price.toLocaleString()}</span>
                      <button
                        onClick={onOpenInquiry}
                        className="bg-[#3D2415] hover:bg-[#8B5E3C] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        {t('inquireQuote')}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white border border-[#E8DEC8] rounded-2xl p-8 text-center text-xs text-[#7A6252]">
                {t('noProductsFound')}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
