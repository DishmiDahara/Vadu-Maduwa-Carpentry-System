import React from 'react';
import { Tag, CheckCircle2, MessageSquarePlus } from 'lucide-react';

export default function ProductCard({ product, onSelectForQuote }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group card-hover">
      
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#8B4513] shadow-sm flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-[#C68B59]" />
          LKR {Number(product.basePrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        {product.available && (
          <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            In Stock / Custom Made
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold font-heading text-gray-900 group-hover:text-[#C68B59] transition-colors line-clamp-1">
            {product.productName}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider block">Estimated Price</span>
            <span className="text-base font-bold text-gray-900">
              LKR {Number(product.basePrice).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => onSelectForQuote(product)}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-[#C68B59] text-[#8B4513] hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Inquire / Quote
          </button>
        </div>
      </div>

    </div>
  );
}
