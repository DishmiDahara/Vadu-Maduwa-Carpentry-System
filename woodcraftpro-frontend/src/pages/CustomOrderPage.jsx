import React, { useState } from 'react';
import {
  RotateCw,
  Upload,
  Trash2,
  ChevronRight,
  HelpCircle,
  Maximize2,
  MessageSquare,
  Info,
  X,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  User,
  Building,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CustomOrderPage({ setActiveTab }) {
  const { t } = useLanguage();

  // Active Step State
  const [activeStep, setActiveStep] = useState(1);

  // Customization Form State
  const [selectedFurniture, setSelectedFurniture] = useState('dining');
  const [woodType, setWoodType] = useState('teak');
  const [finish, setFinish] = useState('natural');
  const [length, setLength] = useState(160);
  const [width, setWidth] = useState(90);
  const [height, setHeight] = useState(75);
  const [activeThumb, setActiveThumb] = useState(0);

  // USER DETAILS STATE
  const [userName, setUserName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userDistrict, setUserDistrict] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [orderDescription, setOrderDescription] = useState('');

  // Validation & Success Modal State
  const [validationError, setValidationError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Modals / Selection Drawers
  const [activeModal, setActiveModal] = useState(null); // 'furniture', 'wood', 'finish', 'dimensions', 'breakdown', 'howItWorks'

  // Uploaded Reference Images
  const [uploads, setUploads] = useState([
    { id: 1, name: 'sketch_1.jpg', url: '/banner_crafts/card_dining.jpg' },
    { id: 2, name: 'room_idea.jpg', url: '/banner_crafts/card_furniture.jpg' },
    { id: 3, name: '3d_render.png', url: '/banner_crafts/card_bedroom.jpg' }
  ]);

  // Sri Lankan Districts List for Dropdown
  const sriLankaDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale (Dambulla)', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  // Options Catalog Data
  const furnitureOptions = [
    { id: 'dining', name: 'Dining Table', basePrice: 65000, img: '/dining_table.png' },
    { id: 'bed', name: 'Bed Set', basePrice: 85000, img: '/wooden_bed.png' },
    { id: 'wardrobe', name: 'Wardrobe / Closet', basePrice: 55000, img: '/wooden_wardrobe.png' },
    { id: 'door', name: 'Teak Wooden Door', basePrice: 30000, img: '/teak_door.png' },
    { id: 'office', name: 'Executive Office Table', basePrice: 32000, img: '/hero_armchair.png' }
  ];

  const woodOptions = [
    { id: 'teak', name: 'Teak Wood (තේක්ක)', multiplier: 1.4, desc: 'Water Resistant & Premium Hardwood' },
    { id: 'mahogany', name: 'Mahogany (මහෝගනි)', multiplier: 1.15, desc: 'Rich Red Finish & Termite Proof' },
    { id: 'jackwood', name: 'Jackwood (කොස්)', multiplier: 1.1, desc: 'Traditional Yellow Wood' },
    { id: 'satinwood', name: 'Satinwood (බුරුත)', multiplier: 1.35, desc: 'Ultra Dense Heavy Hardwood' }
  ];

  const finishOptions = [
    { id: 'natural', name: 'Natural Polish', desc: 'Preserves original wood grain & warmth' },
    { id: 'matte', name: 'Matte Finish', desc: 'Modern non-reflective smooth sheen' },
    { id: 'gloss', name: 'Gloss Finish', desc: 'High reflection mirror polish' },
    { id: 'teak_stain', name: 'Teak Stain', desc: 'Golden teak timber color tint' },
    { id: 'walnut', name: 'Dark Walnut', desc: 'Rich dark espresso wood stain' }
  ];

  // Dynamic Price Calculation
  const currentFurniture = furnitureOptions.find(f => f.id === selectedFurniture) || furnitureOptions[0];
  const currentWood = woodOptions.find(w => w.id === woodType) || woodOptions[0];
  const currentFinish = finishOptions.find(fo => fo.id === finish) || finishOptions[0];

  const volumeFactor = (length * width * height) / (160 * 90 * 75);
  const estimatedPrice = Math.round(currentFurniture.basePrice * currentWood.multiplier * (0.85 + 0.15 * volumeFactor));

  // Thumbnail previews array
  const previewImages = [
    currentFurniture.img,
    '/dining_table.png',
    '/hero_armchair.png',
    '/wooden_wardrobe.png'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploads(prev => [
        ...prev,
        { id: Date.now(), name: file.name, url: URL.createObjectURL(file) }
      ]);
    }
  };

  const removeUpload = (id) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  // ORDER SUBMISSION & WHATSAPP LOGIC
  const handleSubmitOrder = (e) => {
    e?.preventDefault();
    setValidationError('');

    if (!userName.trim() || !userAddress.trim() || !userDistrict.trim() || !userPhone.trim()) {
      setValidationError('කරුණාකර සියලුම අනිවාර්ය ක්ෂේත්‍ර (නම, ලිපිනය, දිස්ත්‍රික්කය, දුරකථන අංකය) සම්පූර්ණ කරන්න!');
      const el = document.getElementById('user-details-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setShowSuccessModal(true);

    const message = `*වඩු මඩුව (Wadu Maduwa) - නව අභිරුචි ඇණවුම*

*පාරිභෝගික තොරතුරු:*
• *නම:* ${userName.trim()}
• *ලිපිනය:* ${userAddress.trim()}
• *දිස්ත්‍රික්කය:* ${userDistrict}
• *දුරකථන අංකය:* ${userPhone.trim()}

*ඇණවුම් කළ ගෘහ භාණ්ඩය:* ${currentFurniture.name}
*ලී වර්ගය:* ${currentWood.name}
*නිමාව (Finish):* ${currentFinish.name}
*ප්‍රමාණයන්:* ${length} (L) x ${width} (W) x ${height} (H) cm
*ඇස්තමේන්තුගත මිල:* LKR ${estimatedPrice.toLocaleString()}

*විශේෂ සටහන / Description:*
${orderDescription.trim() || 'නැත'}`;

    const whatsappUrl = `https://wa.me/94779743901?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1200);
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B190E] min-h-screen pb-24 sm:pb-16 pt-4 font-sans selection:bg-[#8B5E3C] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 space-y-5">

        {/* 1. TOP HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#2B190E]">{t('customOrderHeader')}</h1>
            <p className="text-xs text-[#7A6252] mt-0.5 font-medium">{t('customOrderSub')}</p>
          </div>

          <button
            onClick={() => setActiveModal('howItWorks')}
            className="flex items-center gap-1.5 bg-white border border-[#E8DEC8] text-[#2B190E] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-[#FAF4EB] transition-colors shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>How it works</span>
          </button>
        </div>

        {/* 2. STEPPER PROGRESS BAR */}
        <div className="flex items-center justify-center gap-4 sm:gap-12 py-2 border-y border-[#E8DEC8]/60 text-xs font-bold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#23160D] text-white flex items-center justify-center text-xs font-black shadow">1</div>
            <span className="text-[#23160D]">{t('step1')}</span>
          </div>

          <div className="w-8 sm:w-16 h-[1px] bg-[#E8DEC8]"></div>

          <div className="flex items-center gap-2 opacity-80">
            <div className="w-6 h-6 rounded-full bg-[#23160D] text-white flex items-center justify-center text-xs font-black">2</div>
            <span className="text-[#23160D]">{t('step2')}</span>
          </div>

          <div className="w-8 sm:w-16 h-[1px] bg-[#E8DEC8]"></div>

          <div className="flex items-center gap-2 opacity-80">
            <div className="w-6 h-6 rounded-full bg-[#23160D] text-white flex items-center justify-center text-xs font-black">3</div>
            <span className="text-[#23160D]">{t('step3')}</span>
          </div>
        </div>

        {/* 3. 3D VIEWER CARD */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#3D2415] bg-[#1A1009] min-h-[300px] sm:min-h-[380px] flex flex-col justify-between p-4 group">
          <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url('${previewImages[activeThumb]}')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-black/60 backdrop-blur-md text-amber-300 border border-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
              <RotateCw className="w-3.5 h-3.5" />
              <span>360° View</span>
            </div>

            <button
              onClick={() => alert('3D viewer active')}
              className="bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-black transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="relative z-10 self-center bg-black/60 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow pointer-events-none">
            <span>Drag / Click to preview</span>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {previewImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveThumb(idx)}
                  className={`w-16 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    activeThumb === idx ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105' : 'border-white/30 opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveThumb((prev) => (prev + 1) % previewImages.length)}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. SUMMARY SELECTION CARD */}
        <div className="bg-[#23160D] text-amber-100/90 border border-[#3D2415] rounded-3xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3D2415]">
            <div>
              <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">{t('selectFurniture')}</span>
              <span className="text-sm font-bold text-white">{currentFurniture.name}</span>
            </div>
            <button
              onClick={() => setActiveModal('furniture')}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors"
            >
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-[#3D2415]">
            <div>
              <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">{t('selectWood')}</span>
              <span className="text-sm font-bold text-white">{currentWood.name}</span>
            </div>
            <button
              onClick={() => setActiveModal('wood')}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors"
            >
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-[#3D2415]">
            <div>
              <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">{t('selectFinish')}</span>
              <span className="text-sm font-bold text-white">{currentFinish.name}</span>
            </div>
            <button
              onClick={() => setActiveModal('finish')}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors"
            >
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">{t('setDimensions')}</span>
              <span className="text-sm font-bold text-white">{length} (L) x {width} (W) x {height} (H) cm</span>
            </div>
            <button
              onClick={() => setActiveModal('dimensions')}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors"
            >
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. MANDATORY USER DETAILS FORM */}
        <div id="user-details-section" className="bg-white border border-[#E8DEC8] rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#2B190E]">{t('customerInformation')} <span className="text-xs text-red-500 font-extrabold">*</span></h3>
              <p className="text-xs text-[#7A6252] mt-0.5">Please fill in your details to process your custom quote</p>
            </div>
            <span className="text-xs bg-amber-100 text-[#8B5E3C] font-bold px-2.5 py-1 rounded-full border border-amber-200">
              * Required
            </span>
          </div>

          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center gap-3 text-red-700 text-xs font-bold animate-pulse">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B190E] mb-1">{t('fullName')}</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Perera"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF4EB] border rounded-xl text-xs text-[#2B190E] outline-none font-medium transition-colors ${
                    validationError && !userName.trim() ? 'border-red-400 bg-red-50/30' : 'border-[#E8DEC8] focus:border-[#8B5E3C]'
                  }`}
                />
                <User className="w-4 h-4 text-[#7A6252] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B190E] mb-1">{t('phoneField')}</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="e.g. 077 123 4567"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF4EB] border rounded-xl text-xs text-[#2B190E] outline-none font-medium transition-colors ${
                    validationError && !userPhone.trim() ? 'border-red-400 bg-red-50/30' : 'border-[#E8DEC8] focus:border-[#8B5E3C]'
                  }`}
                />
                <Phone className="w-4 h-4 text-[#7A6252] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B190E] mb-1">{t('addressField')}</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. No. 45, Station Road, Kalutara"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF4EB] border rounded-xl text-xs text-[#2B190E] outline-none font-medium transition-colors ${
                    validationError && !userAddress.trim() ? 'border-red-400 bg-red-50/30' : 'border-[#E8DEC8] focus:border-[#8B5E3C]'
                  }`}
                />
                <MapPin className="w-4 h-4 text-[#7A6252] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B190E] mb-1">{t('districtField')}</label>
              <div className="relative">
                <select
                  required
                  value={userDistrict}
                  onChange={(e) => setUserDistrict(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF4EB] border rounded-xl text-xs text-[#2B190E] outline-none font-bold transition-colors cursor-pointer ${
                    validationError && !userDistrict.trim() ? 'border-red-400 bg-red-50/30' : 'border-[#E8DEC8] focus:border-[#8B5E3C]'
                  }`}
                >
                  <option value="">{t('selectDistrict')}</option>
                  {sriLankaDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <Building className="w-4 h-4 text-[#7A6252] absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2B190E] mb-1">{t('notesField')}</label>
            <div className="relative">
              <textarea
                rows="3"
                placeholder="Any special carving details, custom handles, color preference or timeline targets..."
                value={orderDescription}
                onChange={(e) => setOrderDescription(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none font-medium focus:border-[#8B5E3C]"
              ></textarea>
              <FileText className="w-4 h-4 text-[#7A6252] absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* 6. ESTIMATED PRICE CARD */}
        <div className="bg-white border border-[#E8DEC8] rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-[#7A6252] uppercase tracking-wider">{t('estimatedPriceTitle')}</span>
              <Info className="w-3.5 h-3.5 text-[#7A6252] cursor-pointer" onClick={() => setActiveModal('breakdown')} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-black text-[#2B190E] font-heading">
                Rs. {estimatedPrice.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#7A6252] mt-1">{t('disclaimerNote')}</p>
            </div>

            <button
              onClick={handleSubmitOrder}
              className="w-full sm:w-auto bg-[#23160D] hover:bg-[#3D2415] text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <span>{t('submitOrderWhatsApp')}</span>
              <MessageSquare className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>

        {/* 7. UPLOAD REFERENCE SECTION */}
        <div className="bg-white border border-[#E8DEC8] rounded-3xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#2B190E]">{t('referencePhotos')}</h3>
            <p className="text-xs text-[#7A6252] mt-0.5">Share your Pinterest reference photo or sketch</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-7 flex items-center gap-2 overflow-x-auto">
              {uploads.slice(0, 2).map((u) => (
                <div key={u.id} className="relative w-24 h-20 rounded-2xl overflow-hidden border border-[#E8DEC8] group shrink-0">
                  <img src={u.url} alt={u.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeUpload(u.id)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <label className="sm:col-span-5 border-2 border-dashed border-[#E8DEC8] hover:border-[#8B5E3C] bg-[#FAF4EB] rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-[#8B5E3C]" />
              <span className="text-xs font-bold text-[#2B190E]">{t('uploadPhoto')}</span>
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

      </div>

      {/* SUCCESS POPUP MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-[#E8DEC8] relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#2B190E] font-heading">
                {t('orderSuccessModalTitle')}
              </h3>
              <p className="text-xs text-[#7A6252] leading-relaxed">
                {t('orderSuccessModalSub')}
              </p>
            </div>

            <div className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-2xl p-3.5 text-left text-xs space-y-1 text-[#2B190E]">
              <p><strong>{t('fullName')}:</strong> {userName}</p>
              <p><strong>{t('phoneField')}:</strong> {userPhone}</p>
              <p><strong>{t('districtField')}:</strong> {userDistrict}</p>
              <p><strong>{t('selectFurniture')}:</strong> {currentFurniture.name}</p>
              <p><strong>{t('estimatedPriceTitle')}:</strong> LKR {estimatedPrice.toLocaleString()}</p>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#23160D] hover:bg-[#3D2415] text-white py-3 rounded-2xl font-bold text-xs shadow transition-all"
            >
              {t('closeModal')}
            </button>
          </div>
        </div>
      )}

      {/* DRAWERS FOR SELECTION MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8DEC8]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-bold text-base text-[#2B190E] capitalize">
                {activeModal === 'furniture' && t('selectFurniture')}
                {activeModal === 'wood' && t('selectWood')}
                {activeModal === 'finish' && t('selectFinish')}
                {activeModal === 'dimensions' && t('setDimensions')}
                {activeModal === 'breakdown' && 'Price Breakdown'}
                {activeModal === 'howItWorks' && 'How Custom Order Works'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Furniture Type Drawer */}
            {activeModal === 'furniture' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {furnitureOptions.map(f => (
                  <div
                    key={f.id}
                    onClick={() => { setSelectedFurniture(f.id); setActiveModal(null); }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                      selectedFurniture === f.id ? 'border-[#8B5E3C] bg-[#FAF4EB] font-bold' : 'border-[#E8DEC8] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs text-[#2B190E]">{f.name}</span>
                    <span className="text-xs text-[#8B5E3C] font-extrabold">From LKR {f.basePrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Wood Species Drawer */}
            {activeModal === 'wood' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {woodOptions.map(w => (
                  <div
                    key={w.id}
                    onClick={() => { setWoodType(w.id); setActiveModal(null); }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                      woodType === w.id ? 'border-[#8B5E3C] bg-[#FAF4EB] font-bold' : 'border-[#E8DEC8] hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs text-[#2B190E]">{w.name}</div>
                      <div className="text-[10px] text-[#7A6252]">{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Finish Drawer */}
            {activeModal === 'finish' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {finishOptions.map(fo => (
                  <div
                    key={fo.id}
                    onClick={() => { setFinish(fo.id); setActiveModal(null); }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                      finish === fo.id ? 'border-[#8B5E3C] bg-[#FAF4EB] font-bold' : 'border-[#E8DEC8] hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs text-[#2B190E]">{fo.name}</div>
                      <div className="text-[10px] text-[#7A6252]">{fo.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dimensions Drawer */}
            {activeModal === 'dimensions' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#2B190E]">{t('lengthCm')}: {length} cm</label>
                  <input type="range" min="50" max="300" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full text-[#8B5E3C]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2B190E]">{t('widthCm')}: {width} cm</label>
                  <input type="range" min="30" max="200" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full text-[#8B5E3C]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2B190E]">{t('heightCm')}: {height} cm</label>
                  <input type="range" min="30" max="250" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full text-[#8B5E3C]" />
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-[#3D2415] text-white py-2.5 rounded-xl text-xs font-bold">Done</button>
              </div>
            )}

            {/* How It Works Modal */}
            {activeModal === 'howItWorks' && (
              <div className="space-y-3 text-xs text-[#7A6252]">
                <p>1. Choose furniture item & timber preference.</p>
                <p>2. Enter dimensions or upload Pinterest reference photos.</p>
                <p>3. Submit your details to send automated WhatsApp inquiry to our master carpenter.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
