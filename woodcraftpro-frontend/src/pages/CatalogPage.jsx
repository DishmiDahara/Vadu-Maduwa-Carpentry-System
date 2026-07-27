import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

export default function CatalogPage({ onSelectProductForQuote, onOpenInquiry }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C1F26] to-[#2E241E] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-800">
        <div>
          <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Handcrafted Furniture</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-1">Furniture Product Catalog</h1>
          <p className="text-gray-300 text-sm mt-2 max-w-xl">
            Browse our ready-made timber designs or select any item to request custom dimensions and wood species.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search bed, table, wardrobe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/10 text-white placeholder-gray-400 rounded-2xl border border-white/20 focus:border-[#C68B59] focus:outline-none text-sm backdrop-blur-md"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
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

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-[#C68B59] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading Furniture Catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 space-y-3">
          <Filter className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Furniture Found</h3>
          <p className="text-xs text-gray-500">Try searching for a different keyword or select another category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
