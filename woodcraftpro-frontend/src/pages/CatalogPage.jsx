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
    t('catDoors'),
    t('catWindows'),
    t('catStaircases'),
    t('catPantry'),
    t('catDoorFrames'),
    t('catCeilings')
  ];

  const defaultCarpentryProducts = [
    { id: '1', title: 'Carved Solid Teak Main Door', price: 45000, category: t('catDoors'), image: '/images/doors/IMG_6930.PNG' },
    { id: '2', title: 'Seasoned Mahogany Bedroom Door', price: 32000, category: t('catDoors'), image: '/images/doors/IMG_7104.PNG' },
    { id: 'd3', title: 'Heavy Timber Double Entrance Door', price: 68000, category: t('catDoors'), image: '/images/doors/IMG_6936.PNG' },
    { id: 'd4', title: 'Modern Slat Groove Flush Wooden Door', price: 38000, category: t('catDoors'), image: '/images/doors/IMG_6942.PNG' },
    { id: 'd5', title: 'Multi-Panel Classic Bedroom Teak Door', price: 42000, category: t('catDoors'), image: '/images/doors/IMG_6950.PNG' },
    { id: 'd6', title: 'Traditional Sri Lankan Floral Carved Door', price: 58000, category: t('catDoors'), image: '/images/doors/IMG_7110.PNG' },
    { id: 'd7', title: 'Pre-Hung Hardwood Internal Room Door', price: 35000, category: t('catDoors'), image: '/images/doors/IMG_7116.PNG' },
    { id: 'd8', title: 'Double Sash French Glass Panel Door', price: 62000, category: t('catDoors'), image: '/images/doors/IMG_7118.PNG' },
    { id: '3', title: 'Solid Teak Door Frame (Uluwahu)', price: 28000, category: t('catDoorFrames'), image: '/images/doors/IMG_6931.PNG' },
    { id: '4', title: 'Double Glass Wooden Window Frame', price: 34000, category: t('catWindows'), image: '/banner_crafts/staircase_main.jpg' },
    { id: '5', title: 'Modular Teak Kitchen Pantry System', price: 185000, category: t('catPantry'), image: '/images/cupboards/IMG_7175.PNG' },
    { id: '6', title: 'Crafted Hardwood Interior Staircase & Railing', price: 120000, category: t('catStaircases'), image: '/images/stairs/IMG_7203.PNG' },
    { id: 's2', title: 'Solid Teak Floating Tread Staircase', price: 145000, category: t('catStaircases'), image: '/images/stairs/IMG_7160.PNG' },
    { id: 's3', title: 'Grand Curved Mahogany Staircase Suite', price: 195000, category: t('catStaircases'), image: '/images/stairs/IMG_7161.PNG' },
    { id: 's4', title: 'Classic Turned Baluster Timber Railing', price: 65000, category: t('catStaircases'), image: '/images/stairs/IMG_7162.PNG' },
    { id: 's5', title: 'Tempered Glass & Solid Teak Cap Railing', price: 85000, category: t('catStaircases'), image: '/images/stairs/IMG_7168.PNG' },
    { id: '7', title: 'Polyurethane Polished Timber Ceiling Panel', price: 48000, category: t('catCeilings'), image: '/banner_crafts/card_bedroom.jpg' },
    { id: '8', title: 'Custom Jackwood Entrance Frame', price: 26000, category: t('catDoorFrames'), image: '/banner_crafts/card_furniture.jpg' },
    { id: '9', title: 'Solid Mahogany Pantry & Island Bar Suite', price: 240000, category: t('catPantry'), image: '/images/cupboards/IMG_7176.PNG' },
    { id: '10', title: 'Wall-Mounted Glass-Door Kitchen Wall Cabinet', price: 75000, category: t('catPantry'), image: '/images/cupboards/IMG_7180.PNG' },
    { id: '11', title: 'Custom Hardwood Kitchen Pantry with Plate Rack', price: 165000, category: t('catPantry'), image: '/images/cupboards/IMG_7177.PNG' },
    { id: '12', title: 'L-Shape Solid Wood Kitchen Cabinet Suite', price: 295000, category: t('catPantry'), image: '/images/cupboards/IMG_7185.PNG' },
    { id: '13', title: 'Classic Teak Corner Pantry & Display Shelving', price: 110000, category: t('catPantry'), image: '/images/cupboards/IMG_7189.PNG' },
    { id: '14', title: 'Modern Compact Apartment Pantry Unit', price: 135000, category: t('catPantry'), image: '/images/cupboards/IMG_7178.PNG' },
    { id: '16', title: 'Deep Pantry Storage Drawers & Spice Pull-Out', price: 88000, category: t('catPantry'), image: '/images/cupboards/IMG_7179.PNG' },
    { id: '17', title: 'Full Wall Fitted Tall Pantry Cabinets', price: 320000, category: t('catPantry'), image: '/images/cupboards/IMG_7181.PNG' },
    { id: '18', title: 'Bespoke Central Cooking Island Countertop', price: 175000, category: t('catPantry'), image: '/images/cupboards/IMG_7182.PNG' },
    { id: '19', title: 'Natural Teak Grain Moisture-Sealed Cabinets', price: 210000, category: t('catPantry'), image: '/images/cupboards/IMG_7183.PNG' },
    { id: '20', title: 'Dual-Tone Contemporary Kitchen Pantry Finish', price: 225000, category: t('catPantry'), image: '/images/cupboards/IMG_7184.PNG' },
    { id: '21', title: 'Corner Carousel Wire-Fitting Pantry Cabinet', price: 95000, category: t('catPantry'), image: '/images/cupboards/IMG_7186.PNG' },
    { id: '22', title: 'Solid Wood Breakfast Counter & Pantry Suite', price: 190000, category: t('catPantry'), image: '/images/cupboards/IMG_7187.PNG' },
    { id: '23', title: 'Classic Traditional Sri Lankan Carved Pantry', price: 260000, category: t('catPantry'), image: '/images/cupboards/IMG_7188.PNG' },
    { id: '24', title: 'Integrated Cooker Hood Canopy Wooden Housing', price: 65000, category: t('catPantry'), image: '/images/cupboards/IMG_7199.PNG' },
    { id: '25', title: 'Premium Mortise-and-Tenon Hardwood Pantry Set', price: 310000, category: t('catPantry'), image: '/images/cupboards/IMG_7200.PNG' },
    { id: '26', title: 'Matte Natural Clear Coat Teak Cupboard Suite', price: 205000, category: t('catPantry'), image: '/images/cupboards/IMG_7201.PNG' },
    { id: '27', title: 'Sleek Finger-Pull Handleless Modern Kitchen', price: 235000, category: t('catPantry'), image: '/images/cupboards/IMG_7202.PNG' },
    { id: '28', title: 'Pantry Tall Multi-Shelf Vertical Larder System', price: 155000, category: t('catPantry'), image: '/images/cupboards/IMG_7204.PNG' },
    { id: '29', title: 'High-Gloss Polyurethane Luxury Pantry Suite', price: 345000, category: t('catPantry'), image: '/images/cupboards/IMG_7205.PNG' }
  ];

  // Filtering & Sorting
  const filteredProducts = defaultCarpentryProducts
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

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">{t('catalogTitle')}</h1>
            <p className="text-xs text-[#7A6252] mt-0.5">{t('catalogSubtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar */}
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

          {/* Product Grid */}
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
                        className="bg-[#3D2415] hover:bg-[#8B5E3C] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
