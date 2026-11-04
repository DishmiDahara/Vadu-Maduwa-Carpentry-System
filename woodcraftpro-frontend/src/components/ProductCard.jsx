import React from 'react';
import { CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product, onSelectForQuote }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group card-hover">
      
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.available && (
          <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {t('inStock')}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold font-heading text-gray-900 group-hover:text-[#8B5E3C] transition-colors line-clamp-1">
            {product.productName}
          </h3>
          <p className="text-sm text-[#7A6252] mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-end">
          <button
            onClick={() => onSelectForQuote(product)}
            className="w-full flex items-center justify-center gap-2 bg-[#3D2415] hover:bg-[#8B5E3C] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer active:scale-98"
          >
            <MessageSquarePlus className="w-4 h-4" />
            {t('inquireQuote')}
          </button>
        </div>
      </div>

    </div>
  );
}
