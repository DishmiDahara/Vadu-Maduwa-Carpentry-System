import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function CatalogPage({ onSelectProductForQuote, onOpenInquiry }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState('default');
  const [woodFilter, setWoodFilter] = useState('ALL');

  useEffect(() => {
    fetchCatalogData();
  }, [selectedCategory, searchQuery]);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        api.getCategories(),
        api.getProducts({ categoryId: selectedCategory, search: searchQuery })
      ]);
      setCategories(catsRes);
      setProducts(prodsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Logic
  const getFilteredProducts = () => {
    let filtered = [...products];

    if (woodFilter === 'TEAK') {
      filtered = filtered.filter(p => p.productName.toLowerCase().includes('teak') || p.description.toLowerCase().includes('teak'));
    } else if (woodFilter === 'MAHOGANY') {
      filtered = filtered.filter(p => p.productName.toLowerCase().includes('mahogany') || p.description.toLowerCase().includes('mahogany'));
    } else if (woodFilter === 'NADUN') {
      filtered = filtered.filter(p => p.productName.toLowerCase().includes('nadun') || p.description.toLowerCase().includes('nadun'));
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.productName.localeCompare(b.productName));
    }

    return filtered;
  };

  const displayedProducts = getFilteredProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C1F26] to-[#2E241E] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-800">
        <div>
          <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Handcrafted Furniture</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-1">{t('catalog')}</h1>
          <p className="text-gray-300 text-sm mt-2 max-w-xl">
            Browse our ready-made timber designs or select any item to request custom dimensions and wood species.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setWoodFilter('ALL');
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === null
              ? 'bg-[#C68B59] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Furniture ({products.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#C68B59] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Quick Filter & Sort Options Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Timber Wood Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#C68B59]" /> Timber Species:
          </span>
          <button
            onClick={() => setWoodFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              woodFilter === 'ALL'
                ? 'bg-amber-100 text-[#8B4513] border border-amber-300 shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Timber
          </button>
          <button
            onClick={() => setWoodFilter('TEAK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              woodFilter === 'TEAK'
                ? 'bg-amber-100 text-[#8B4513] border border-amber-300 shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Teak Wood (තේක්ක)
          </button>
          <button
            onClick={() => setWoodFilter('MAHOGANY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              woodFilter === 'MAHOGANY'
                ? 'bg-amber-100 text-[#8B4513] border border-amber-300 shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Mahogany (මහෝගනි)
          </button>
          <button
            onClick={() => setWoodFilter('NADUN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              woodFilter === 'NADUN'
                ? 'bg-amber-100 text-[#8B4513] border border-amber-300 shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Nadun (නදුන්)
          </button>
        </div>

        {/* Sort By Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#C68B59] transition-colors"
          >
            <option value="default">Featured / Default</option>
            <option value="price-low">Price: Low to High (ලෙස අඩු සිට වැඩි)</option>
            <option value="price-high">Price: High to Low (ලෙස වැඩි සිට අඩු)</option>
            <option value="name">Name (A - Z)</option>
          </select>
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-[#C68B59] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading Furniture Catalog...</p>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 space-y-3">
          <Filter className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Furniture Found</h3>
          <p className="text-xs text-gray-500">Try changing the timber filter or selecting another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectForQuote={(p) => {
                onSelectProductForQuote(p);
                onOpenInquiry();
              }}
            />
          ))}
        </div>
      )}


    </div>
  );
}
