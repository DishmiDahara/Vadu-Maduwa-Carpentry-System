import React from 'react';
import { Hammer, Wrench, Building2, Paintbrush, Truck } from 'lucide-react';

export default function ServicesPage({ onOpenInquiry }) {
  const serviceItems = [
    {
      id: 1,
      title: 'Custom Furniture Design & Build',
      desc: 'Unique & personalized furniture made for you.',
      icon: Hammer
    },
    {
      id: 2,
      title: 'Restoration & Repair',
      desc: 'We restore old furniture with care and expertise.',
      icon: Wrench
    },
    {
      id: 3,
      title: 'Architectural Woodwork',
      desc: 'Doors, windows, ceilings & interior woodwork.',
      icon: Building2
    },
    {
      id: 4,
      title: 'Polishing & Finishing',
      desc: 'High quality polish & paint finishes.',
      icon: Paintbrush
    },
    {
      id: 5,
      title: 'On-site Installation',
      desc: 'Professional installation at your location.',
      icon: Truck
    }
  ];

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#E8DEC8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">Services</h1>
          <p className="text-xs sm:text-sm text-[#7A6252] mt-0.5 font-medium">What we do best at Wadu Maduwa</p>
        </div>

        {/* 5 Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceItems.map((svc) => {
            const IconComponent = svc.icon;
            return (
              <div
                key={svc.id}
                className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF4EB] border border-[#E8DEC8] text-[#8B5E3C] flex items-center justify-center group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#2B190E]">{svc.title}</h3>
                  <p className="text-xs text-[#7A6252] leading-relaxed">{svc.desc}</p>
                </div>

                <button
                  onClick={onOpenInquiry}
                  className="w-full bg-[#3D2415] hover:bg-[#8B5E3C] text-white py-2.5 rounded-xl font-bold text-xs transition-all border border-[#3D2415]"
                >
                  Inquire Now
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
