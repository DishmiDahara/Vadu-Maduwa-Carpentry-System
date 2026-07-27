import React, { useEffect, useState } from 'react';
import { PenTool, ChefHat, Sparkles, Home, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const iconMap = {
  PenTool: PenTool,
  ChefHat: ChefHat,
  Sparkles: Sparkles,
  Home: Home
};

export default function ServicesPage({ onOpenInquiry }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.getServices().then(res => setServices(res));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Our Expertise</span>
        <h1 className="text-4xl font-extrabold font-heading text-gray-900">Custom Carpentry & Woodworking Services</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          From architectural woodworking for residential luxury homes to custom furniture design and hotel fit-outs. We handle timber selection, precision milling, joint crafting, and hand polishing.
        </p>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((svc) => {
          const IconComp = iconMap[svc.iconName] || Hammer;
          return (
            <div
              key={svc.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group"
            >
              <div className="sm:w-2/5 h-56 sm:h-auto overflow-hidden relative">
                <img
                  src={svc.imageUrl}
                  alt={svc.serviceName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C68B59] flex items-center justify-center mb-3">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-gray-900 group-hover:text-[#C68B59] transition-colors">
                    {svc.serviceName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs font-medium text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Free site measurement & consultaion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Seasoned Teak / Mahogany guarantee</span>
                  </li>
                </ul>

                <button
                  onClick={onOpenInquiry}
                  className="w-full sm:w-auto self-start bg-gray-900 hover:bg-[#C68B59] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  Book Service Consultation
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
