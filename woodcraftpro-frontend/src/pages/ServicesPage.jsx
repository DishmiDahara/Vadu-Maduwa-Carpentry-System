import React from 'react';
import { DoorOpen, LayoutGrid, Layers, Columns3, Box, ShieldCheck, Wrench } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ServicesPage({ onOpenInquiry }) {
  const { t } = useLanguage();

  const serviceItems = [
    {
      id: 1,
      title: t('svcDoors'),
      desc: t('svcDoorsDesc'),
      icon: DoorOpen,
      badge: 'Teak & Mahogany'
    },
    {
      id: 2,
      title: t('svcWindows'),
      desc: t('svcWindowsDesc'),
      icon: LayoutGrid,
      badge: 'Glass & Frames'
    },
    {
      id: 3,
      title: t('svcStaircases'),
      desc: t('svcStaircasesDesc'),
      icon: Layers,
      badge: 'Custom Handrails'
    },
    {
      id: 4,
      title: t('svcPantry'),
      desc: t('svcPantryDesc'),
      icon: Columns3,
      badge: 'Fitted Kitchens'
    },
    {
      id: 5,
      title: t('svcDoorFrames'),
      desc: t('svcDoorFramesDesc'),
      icon: Box,
      badge: 'Seasoned Uluwahu'
    },
    {
      id: 6,
      title: t('svcCeilings'),
      desc: t('svcCeilingsDesc'),
      icon: ShieldCheck,
      badge: 'PU Polished Timber'
    },
    {
      id: 7,
      title: t('svcGeneralCarpentry'),
      desc: t('svcGeneralCarpentryDesc'),
      icon: Wrench,
      badge: 'On-site Fitting'
    }
  ];

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#E8DEC8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">{t('servicesTitle')}</h1>
          <p className="text-xs sm:text-sm text-[#7A6252] mt-0.5 font-medium">{t('servicesSubtitle')}</p>
        </div>

        {/* 7 Carpentry Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceItems.map((svc) => {
            const IconComponent = svc.icon;
            return (
              <div
                key={svc.id}
                className="bg-white border border-[#E8DEC8] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF4EB] border border-[#E8DEC8] text-[#8B5E3C] flex items-center justify-center group-hover:bg-[#8B5E3C] group-hover:text-white transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-[#8B5E3C] bg-[#FAF4EB] px-2.5 py-1 rounded-full border border-[#E8DEC8]">
                      {svc.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#2B190E]">{svc.title}</h3>
                  <p className="text-xs text-[#7A6252] leading-relaxed">{svc.desc}</p>
                </div>

                <button
                  onClick={onOpenInquiry}
                  className="w-full bg-[#3D2415] hover:bg-[#8B5E3C] text-white py-2.5 rounded-xl font-bold text-xs transition-all border border-[#3D2415] cursor-pointer"
                >
                  {t('inquireNow')}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
