import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  RotateCcw,
  Play,
  Pause,
  Upload,
  Trash2,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MoveHorizontal,
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
  Sparkles,
  Camera,
  Boxes
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ThreeCarpentryViewer from '../components/ThreeCarpentryViewer';
import { api } from '../services/api';

export default function CustomOrderPage({ setActiveTab }) {
  const { t } = useLanguage();

  // Customization Form State
  const [selectedWork, setSelectedWork] = useState('door');
  const [woodType, setWoodType] = useState('teak');
  const [finish, setFinish] = useState('natural');
  const [length, setLength] = useState(210);
  const [width, setWidth] = useState(105);
  const [height, setHeight] = useState(4);
  const [activeThumb, setActiveThumb] = useState(0);

  // Design Source: 'catalogue' (Workshop Catalogue Designs) or 'uploaded' (Customer Uploaded Design Photo)
  const [designSource, setDesignSource] = useState('catalogue');
  const [uploadedDesign, setUploadedDesign] = useState(null);

  // Sample pre-configured customer designs for 1-click 3D testing
  const sampleDesigns = [
    {
      name: 'Elephant Lotus Carved Entrance Door',
      url: '/images/doors/IMG_6930.PNG',
      desc: 'Traditional Sri Lankan temple & royal arch style'
    },
    {
      name: 'Modern Minimalist Slat Teak Door',
      url: '/images/doors/IMG_6934.PNG',
      desc: 'Contemporary architectural horizontal groove design'
    },
    {
      name: 'Classical Floral Raised Panel Door',
      url: '/images/doors/IMG_6931.PNG',
      desc: 'Master carved double-recessed moulding'
    }
  ];

  // Inspection View Mode: '3d' (Volumetric 3D Model with all angles) or 'photos' (Workshop Archive Photos)
  const [viewMode, setViewMode] = useState('3d');

  // 360 Interactive Viewer State
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

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
  const [activeModal, setActiveModal] = useState(null);

  // Uploaded Reference Images
  const [uploads, setUploads] = useState([
    { id: 1, name: 'door_sketch.jpg', url: '/images/doors/IMG_6930.PNG' },
    { id: 2, name: 'pantry_idea.jpg', url: '/images/cupboards/IMG_7175.PNG' }
  ]);

  const sriLankaDistricts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale (Dambulla)', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  // Actual Carpentry Options with real workshop photos
  const carpentryOptions = [
    { id: 'door', name: 'Wooden Door (Main / Room Door)', basePrice: 45000, img: '/images/doors/IMG_6930.PNG' },
    { id: 'uluwahu', name: 'Door Frame (Solid Uluwahu)', basePrice: 28000, img: '/images/doors/IMG_6934.PNG' },
    { id: 'window', name: 'Wooden Window Frame & Sash', basePrice: 34000, img: '/images/doors/IMG_6933.PNG' },
    { id: 'pantry', name: 'Pantry Cupboards / Kitchen Unit', basePrice: 95000, img: '/images/cupboards/IMG_7175.PNG' },
    { id: 'staircase', name: 'Staircase & Handrail Work', basePrice: 120000, img: '/images/stairs/IMG_7160.PNG' },
    { id: 'ceiling', name: 'Wooden Ceiling Panel', basePrice: 48000, img: '/images/doors/IMG_6942.PNG' },
    { id: 'general', name: 'General Carpentry & Structural Woodwork', basePrice: 30000, img: '/images/stairs/IMG_7163.PNG' }
  ];

  const woodOptions = [
    { id: 'teak', name: 'Teak Wood (තේක්ක)', multiplier: 1.4, desc: 'Water Resistant & Premium Seasoned Hardwood' },
    { id: 'mahogany', name: 'Mahogany (මහෝගනි)', multiplier: 1.15, desc: 'Rich Red Finish & Termite Proof' },
    { id: 'jackwood', name: 'Jackwood (කොස්)', multiplier: 1.1, desc: 'Traditional Yellow Wood' },
    { id: 'satinwood', name: 'Satinwood (බුරුත)', multiplier: 1.35, desc: 'Ultra Dense Heavy Hardwood' }
  ];

  const finishOptions = [
    { id: 'natural', name: 'Natural PU Polish', desc: 'Preserves original wood grain & warmth' },
    { id: 'matte', name: 'Matte Polyurethane Finish', desc: 'Modern non-reflective smooth sheen' },
    { id: 'gloss', name: 'High Gloss Finish', desc: 'High reflection mirror lacquer polish' },
    { id: 'teak_stain', name: 'Teak Stain Tint', desc: 'Golden teak timber color tint' },
    { id: 'walnut', name: 'Dark Walnut Stain', desc: 'Rich dark espresso wood stain' }
  ];

  // Dynamic Price Calculation
  const currentWork = carpentryOptions.find(f => f.id === selectedWork) || carpentryOptions[0];
  const currentWood = woodOptions.find(w => w.id === woodType) || woodOptions[0];
  const currentFinish = finishOptions.find(fo => fo.id === finish) || finishOptions[0];

  const volumeFactor = (length * width * height) / (210 * 105 * 4);
  const estimatedPrice = Math.round(currentWork.basePrice * currentWood.multiplier * (0.85 + 0.15 * volumeFactor));

  // Dynamic authentic workshop images mapped per category
  const previewImagesMap = {
    door: [
      '/images/doors/IMG_6930.PNG',
      '/images/doors/IMG_6931.PNG',
      '/images/doors/IMG_6934.PNG',
      '/images/doors/IMG_6935.PNG'
    ],
    uluwahu: [
      '/images/doors/IMG_6934.PNG',
      '/images/doors/IMG_6930.PNG',
      '/images/doors/IMG_6936.PNG',
      '/images/doors/IMG_6942.PNG'
    ],
    window: [
      '/images/doors/IMG_6933.PNG',
      '/images/doors/IMG_6930.PNG',
      '/images/doors/IMG_6931.PNG',
      '/images/doors/IMG_6935.PNG'
    ],
    pantry: [
      '/images/cupboards/IMG_7175.PNG',
      '/images/cupboards/IMG_7176.PNG',
      '/images/cupboards/IMG_7177.PNG',
      '/images/cupboards/IMG_7178.PNG'
    ],
    staircase: [
      '/images/stairs/IMG_7160.PNG',
      '/images/stairs/IMG_7161.PNG',
      '/images/stairs/IMG_7162.PNG',
      '/images/stairs/IMG_7163.PNG'
    ],
    ceiling: [
      '/images/doors/IMG_6942.PNG',
      '/images/doors/IMG_6950.PNG',
      '/images/cupboards/IMG_7175.PNG',
      '/images/doors/IMG_6930.PNG'
    ],
    general: [
      '/images/stairs/IMG_7163.PNG',
      '/images/doors/IMG_6930.PNG',
      '/images/cupboards/IMG_7175.PNG',
      '/images/stairs/IMG_7160.PNG'
    ]
  };

  const previewImages = previewImagesMap[selectedWork] || [
    currentWork.img,
    '/images/doors/IMG_6930.PNG',
    '/images/cupboards/IMG_7175.PNG',
    '/images/stairs/IMG_7160.PNG'
  ];

  // Active 3D Design Texture & Title (Works for both customer uploaded photos and catalogue designs)
  const activeDesignImage = designSource === 'uploaded' && uploadedDesign
    ? uploadedDesign.url
    : (previewImages[activeThumb] || currentWork.img);

  const activeDesignTitle = designSource === 'uploaded' && uploadedDesign
    ? (uploadedDesign.name || 'Custom Uploaded Design')
    : currentWork.name;

  // Auto-rotation timer for 360 preview
  useEffect(() => {
    let interval = null;
    if (isAutoRotating && !isDragging) {
      interval = setInterval(() => {
        setRotationAngle(prev => (prev + 1) % 360);
      }, 30);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRotating, isDragging]);

  // Pointer drag to rotate handlers (Mouse & Touch)
  const handlePointerDown = (e) => {
    // If user clicked any button, thumbnail, or interactive control, do not drag
    if (e.target.closest('button') || e.target.closest('.no-drag') || e.target.closest('input')) {
      return;
    }
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartAngle(rotationAngle);
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    const newAngle = Math.round((dragStartAngle + deltaX * 0.75) % 360 + 360) % 360;
    setRotationAngle(newAngle);
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      if (e.currentTarget.releasePointerCapture) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }
    }
  };

  const toggleAutoRotate = (e) => {
    e?.stopPropagation();
    setIsAutoRotating(prev => !prev);
  };

  const handleRotateLeft = (e) => {
    e?.stopPropagation();
    setIsAutoRotating(false);
    setRotationAngle(prev => (prev - 15 + 360) % 360);
  };

  const handleRotateRight = (e) => {
    e?.stopPropagation();
    setIsAutoRotating(false);
    setRotationAngle(prev => (prev + 15) % 360);
  };

  const handleSetAngle = (deg, e) => {
    e?.stopPropagation();
    setIsAutoRotating(false);
    setRotationAngle(deg % 360);
  };

  const handleCustomerDesignUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newDesign = {
        id: Date.now(),
        name: file.name,
        url,
        file,
        size: (file.size / 1024).toFixed(1) + ' KB'
      };
      setUploadedDesign(newDesign);
      setDesignSource('uploaded');
      setViewMode('3d');
      setUploads(prev => [newDesign, ...prev]);
    }
  };

  const handleSelectSampleDesign = (sample) => {
    setUploadedDesign({
      id: Date.now(),
      name: sample.name,
      url: sample.url,
      size: 'Sample Design'
    });
    setDesignSource('uploaded');
    setViewMode('3d');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newUpload = {
        id: Date.now(),
        name: file.name,
        url,
        file,
        size: (file.size / 1024).toFixed(1) + ' KB'
      };
      setUploads(prev => [newUpload, ...prev]);
      setUploadedDesign(newUpload);
      setDesignSource('uploaded');
      setViewMode('3d');
    }
  };

  const removeUpload = (id) => {
    setUploads(prev => prev.filter(u => u.id !== id));
    if (uploadedDesign?.id === id) {
      setUploadedDesign(null);
      setDesignSource('catalogue');
    }
  };

  // ORDER SUBMISSION VIA WHATSAPP (Handles both customer uploaded design and catalogue design)
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

    const isUploaded = designSource === 'uploaded' && uploadedDesign;
    const designLabel = isUploaded
      ? `පාරිභෝගිකයාගේ අභිරුචි ඡායාරූපයකි (Customer Uploaded: ${uploadedDesign.name})`
      : `නාමාවලි නිර්මාණය (Catalogue: ${currentWork.name})`;

    // Automatically record custom order into Admin Order Desk
    try {
      api.createCustomOrder({
        customerName: userName.trim(),
        customerPhone: userPhone.trim(),
        customerAddress: userAddress.trim(),
        customerDistrict: userDistrict,
        orderDescription: orderDescription.trim() || 'නැත',
        designTitle: activeDesignTitle,
        designImage: activeDesignImage,
        isUploadedDesign: isUploaded,
        furnitureType: currentWork.name,
        woodType: currentWood.name,
        finish: currentFinish.name,
        dimensions: `${length} x ${width} x ${height} cm`,
        length,
        width,
        height,
        estimatedPrice,
        status: 'Pending Review'
      });
    } catch (err) {
      console.warn("Could not save custom order:", err);
    }

    const message = `*වඩු මඩුව (Wadu Maduwa) - නව අභිරුචි වඩු ඇණවුම*

*පාරිභෝගික තොරතුරු:*
• *නම:* ${userName.trim()}
• *ලිපිනය:* ${userAddress.trim()}
• *දිස්ත්‍රික්කය:* ${userDistrict}
• *දුරකථන අංකය:* ${userPhone.trim()}

*සැලසුම් විස්තරය (Design Details):*
• *තෝරාගත් නිර්මාණය:* ${designLabel}
• *3D 360° පරීක්ෂාව:* පාරිභෝගිකයා විසින් සියලු පැතිවලින් (Front, Back, Lock Edge, Hinges) 3D මාදිලිය පරීක්ෂා කර ඇත
• *ලී වර්ගය:* ${currentWood.name}
• *නිමාව (Finish):* ${currentFinish.name}
• *ප්‍රමාණයන්:* ${length} (H/L) x ${width} (W) x ${height} (D) cm
• *ඇස්තමේන්තුගත මිල:* LKR ${estimatedPrice.toLocaleString()}

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
            className="flex items-center gap-1.5 bg-white border border-[#E8DEC8] text-[#2B190E] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-[#FAF4EB] transition-colors shrink-0 cursor-pointer"
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

        {/* DESIGN SOURCE SELECTOR: Catalogue vs Upload Custom Design Photo */}
        <div id="design-source-section" className="bg-white border border-[#E8DEC8] rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DEC8]/60 pb-3">
            <div>
              <h2 className="text-sm font-black text-[#2B190E] font-heading flex items-center gap-2">
                <span>Select Carpentry Design</span>
                <span className="text-[10px] bg-amber-100 text-[#8B5E3C] px-2 py-0.5 rounded-full font-bold">
                  Step 1
                </span>
              </h2>
              <p className="text-xs text-[#7A6252] mt-0.5">
                Pick a master design from our workshop catalogue or upload your own custom photo to inspect in 3D 360°
              </p>
            </div>

            {/* Source Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-[#FAF4EB] p-1 rounded-2xl border border-[#E8DEC8]">
              <button
                type="button"
                onClick={() => setDesignSource('catalogue')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  designSource === 'catalogue'
                    ? 'bg-[#23160D] text-amber-300 font-black shadow-sm'
                    : 'text-[#7A6252] hover:text-[#2B190E]'
                }`}
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Catalogue Designs</span>
              </button>

              <button
                type="button"
                onClick={() => setDesignSource('uploaded')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  designSource === 'uploaded'
                    ? 'bg-[#23160D] text-amber-300 font-black shadow-sm'
                    : 'text-[#7A6252] hover:text-[#2B190E]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Design Photo</span>
                {uploadedDesign && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* TAB CONTENT: CATALOGUE SELECTOR */}
          {designSource === 'catalogue' && (
            <div className="space-y-3">
              {/* Category selector pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {carpentryOptions.map(f => (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => {
                      setSelectedWork(f.id);
                      setActiveThumb(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      selectedWork === f.id
                        ? 'bg-[#8B5E3C] text-white shadow-sm'
                        : 'bg-[#FAF4EB] text-[#7A6252] hover:text-[#2B190E] border border-[#E8DEC8]'
                    }`}
                  >
                    {f.name.split(' (')[0]}
                  </button>
                ))}
              </div>

              {/* Thumbnail Gallery for selected category */}
              <div className="flex items-center justify-between gap-2 bg-[#FAF4EB] p-2.5 rounded-2xl border border-[#E8DEC8]">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {previewImages.map((img, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setActiveThumb(idx)}
                      className={`relative w-14 sm:w-16 h-12 sm:h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                        activeThumb === idx
                          ? 'border-[#8B5E3C] ring-2 ring-[#8B5E3C]/30 scale-105'
                          : 'border-white/80 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Catalogue thumbnail" className="w-full h-full object-cover" />
                      {activeThumb === idx && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="text-right pl-2 shrink-0">
                  <span className="text-[10px] text-[#7A6252] block">Current Model:</span>
                  <span className="text-xs font-black text-[#2B190E]">{currentWork.name.split(' (')[0]}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: UPLOAD YOUR OWN DESIGN */}
          {designSource === 'uploaded' && (
            <div className="space-y-3">
              {uploadedDesign ? (
                // Customer has uploaded an image
                <div className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#8B5E3C] shadow-sm shrink-0">
                      <img src={uploadedDesign.url} alt={uploadedDesign.name} className="w-full h-full object-cover" />
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white p-0.5 rounded-bl">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#2B190E]">{uploadedDesign.name}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          Active in 3D View
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6252]">
                        {uploadedDesign.size ? `${uploadedDesign.size} • ` : ''}Rendered directly onto 3D model below
                      </p>
                      <p className="text-[10px] text-amber-800 font-bold">
                        Rotate the 360° viewer below to inspect all sides (front, back, and edges)!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <label className="bg-[#23160D] hover:bg-[#3D2415] text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace Photo</span>
                      <input type="file" accept="image/*,.pdf" onChange={handleCustomerDesignUpload} className="hidden" />
                    </label>

                    <button
                      type="button"
                      onClick={() => setDesignSource('catalogue')}
                      className="bg-white border border-[#E8DEC8] hover:bg-gray-50 text-[#7A6252] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Catalogue
                    </button>
                  </div>
                </div>
              ) : (
                // Dropzone when no image has been uploaded yet
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-[#8B5E3C]/40 hover:border-[#8B5E3C] bg-[#FAF4EB]/60 hover:bg-[#FAF4EB] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#8B5E3C] flex items-center justify-center shadow-sm">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#2B190E]">
                        Click to Upload or Drag & Drop Your Carpentry Photo / Sketch
                      </p>
                      <p className="text-[11px] text-[#7A6252] mt-0.5">
                        Supports JPG, PNG, WEBP, HEIC • Photos of doors, windows, internet designs, or hand-drawn sketches
                      </p>
                    </div>
                    <span className="text-[10px] bg-[#8B5E3C] text-white px-3 py-1 rounded-full font-bold shadow-sm">
                      Browse Image from Device
                    </span>
                    <input type="file" accept="image/*,.pdf" onChange={handleCustomerDesignUpload} className="hidden" />
                  </label>

                  {/* 1-Click Sample Customer Designs for Instant 3D Testing */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#7A6252] uppercase tracking-wider block">
                      Or Try Sample Customer Ideas to Test 3D View Instantly:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {sampleDesigns.map((sample, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleSelectSampleDesign(sample)}
                          className="flex items-center gap-2 p-2 rounded-xl border border-[#E8DEC8] bg-[#FAF4EB] hover:border-[#8B5E3C] text-left transition-all cursor-pointer group"
                        >
                          <img src={sample.url} alt={sample.name} className="w-10 h-10 object-cover rounded-lg border border-amber-800/20 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[11px] font-bold text-[#2B190E] block truncate group-hover:text-[#8B5E3C]">
                              {sample.name}
                            </span>
                            <span className="text-[10px] text-[#7A6252] block truncate">
                              {sample.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* VIEW MODE TOGGLE BAR: 3D Model (All Angles) vs Workshop Photos */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-white border border-[#E8DEC8] p-2 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 pl-2">
            <Boxes className="w-4 h-4 text-[#8B5E3C]" />
            <span className="text-xs font-black text-[#2B190E] font-heading">Inspection Mode:</span>
            <span className="text-[11px] text-[#7A6252] hidden md:inline">
              {viewMode === '3d' ? 'Volumetric 3D model with front, back, lock edge, hinges, and tilt orbit' : 'Real high-resolution workshop archive photos'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-[#23160D] text-amber-300 shadow-md ring-2 ring-[#8B5E3C]/30 font-black'
                  : 'bg-[#FAF4EB] text-[#7A6252] hover:text-[#2B190E] hover:bg-[#F3EAD9]'
              }`}
            >
              <Boxes className="w-4 h-4 text-amber-400" />
              <span>3D Model (All Angles)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('photos')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === 'photos'
                  ? 'bg-[#23160D] text-amber-300 shadow-md ring-2 ring-[#8B5E3C]/30 font-black'
                  : 'bg-[#FAF4EB] text-[#7A6252] hover:text-[#2B190E] hover:bg-[#F3EAD9]'
              }`}
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Workshop Photos</span>
            </button>
          </div>
        </div>

        {/* 3. INTERACTIVE VIEWER (3D MODEL OR WORKSHOP PHOTOS) */}
        {viewMode === '3d' ? (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#3D2415] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3D2415]/80 via-[#1A1009] to-[#0A0503]">
            <ThreeCarpentryViewer
              woodType={woodType}
              finish={finish}
              selectedWork={selectedWork}
              activeImage={activeDesignImage}
              designTitle={activeDesignTitle}
              length={length}
              width={width}
              height={height}
              isStudio={false}
              onOpenStudio={() => setIsStudioOpen(true)}
            />
          </div>
        ) : (
          <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#3D2415] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3D2415]/70 via-[#1A1009] to-[#0A0503] min-h-[360px] sm:min-h-[440px] flex flex-col justify-between p-4 group select-none"
          >
            {/* Dedicated 360 Drag Surface (Under toolbars) */}
            <div 
              className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />

            {/* Subtle workshop ambient spotlight and lighting glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

            {/* 3D SCENE: Turntable & Rotating Carpentry Item */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ perspective: '1100px' }}>
              {/* Turntable Disc Platform */}
              <div 
                className="absolute bottom-16 sm:bottom-14 w-64 sm:w-88 h-18 sm:h-22 rounded-full border border-amber-600/40 bg-gradient-to-b from-[#2F1C10] to-[#120904] shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex items-center justify-center transition-transform"
                style={{
                  transform: `rotateX(68deg) rotateZ(${rotationAngle}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="w-52 sm:w-72 h-13 sm:h-16 rounded-full border border-amber-500/30 bg-[#23150C] flex items-center justify-center">
                  <div className="w-36 sm:w-52 h-8 sm:h-10 rounded-full border border-amber-400/20 bg-[#150A05] flex items-center justify-center">
                    <span className="text-[9px] font-mono tracking-widest text-amber-400/60 uppercase">360° TURNTABLE</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Cast Drop Shadow */}
              <div 
                className="absolute bottom-14 sm:bottom-12 w-44 sm:w-56 h-8 rounded-full bg-black/85 blur-md transition-all duration-75"
                style={{
                  transform: `scaleX(${Math.max(0.35, Math.abs(Math.cos(rotationAngle * Math.PI / 180)))}) scaleY(0.7)`
                }}
              />

              {/* 3D Rotating Carpentry Workpiece */}
              <div
                className="relative w-44 sm:w-56 h-64 sm:h-80 transition-transform duration-75"
                style={{
                  transform: `rotateY(${rotationAngle}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* FRONT FACE (0 deg) */}
                <div 
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-amber-700/60 shadow-[0_25px_50px_rgba(0,0,0,0.85)] bg-[#2A180E]"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(6px)'
                  }}
                >
                  <img
                    src={previewImages[activeThumb] || currentWork.img}
                    alt={currentWork.name}
                    className="w-full h-full object-cover select-none"
                    draggable="false"
                  />

                  {/* Timber Polish / Grain Tint based on selected woodType */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-color transition-colors duration-500"
                    style={{
                      backgroundColor: 
                        woodType === 'teak' ? 'rgba(217, 119, 6, 0.15)' :
                        woodType === 'mahogany' ? 'rgba(185, 28, 28, 0.22)' :
                        woodType === 'jackwood' ? 'rgba(234, 179, 8, 0.18)' :
                        'rgba(245, 158, 11, 0.12)'
                    }}
                  />

                  {/* Dynamic Specular Lighting Glare based on rotationAngle */}
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-75"
                    style={{
                      background: `linear-gradient(${110 + ((rotationAngle % 180) - 90) * 0.9}deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 28%, transparent 60%)`,
                      opacity: finish === 'gloss' ? 0.9 : finish === 'matte' ? 0.3 : 0.6
                    }}
                  />
                </div>

                {/* REAR / BACK FACE (180 deg) */}
                <div 
                  className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-amber-800/60 shadow-[0_25px_50px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#3D2415] via-[#2D1B0F] to-[#1C1008] p-3 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg) translateZ(6px)'
                  }}
                >
                  {/* Rear Timber Frame Rails & Stiles Architecture */}
                  <div className="w-full h-full rounded-xl border border-amber-600/40 p-2 flex flex-col justify-between bg-[#24150C]/60">
                    <div className="flex items-center justify-between border-b border-amber-700/40 pb-1.5">
                      <span className="text-[10px] font-bold text-amber-400 font-mono">100% SEASONED WOOD</span>
                      <span className="text-[10px] text-amber-200/70 font-mono">REAR PROFILE</span>
                    </div>

                    <div className="my-auto space-y-2 py-3 px-1 text-center">
                      <div className="w-8 h-8 mx-auto rounded-full border border-amber-400/50 bg-amber-950/60 flex items-center justify-center text-amber-300 font-black text-xs">
                        වම
                      </div>
                      <p className="text-xs font-bold text-amber-200 tracking-wide font-heading">වඩු මඩුව • KALUTARA</p>
                      <p className="text-[10px] text-amber-300/80 font-mono uppercase">
                        {currentWood.name.split(' ')[0]} • {length}x{width}x{height}cm
                      </p>
                      <div className="h-0.5 w-16 mx-auto bg-amber-500/30 rounded-full"></div>
                      <p className="text-[9px] text-amber-400/60">Architectural Handcrafted Timber Backing</p>
                    </div>

                    <div className="border-t border-amber-700/40 pt-1.5 flex items-center justify-between text-[9px] text-amber-400/70 font-mono">
                      <span>INTERIOR SIDE</span>
                      <span>GRADE-A TIMBER</span>
                    </div>
                  </div>

                  {/* Timber Tint Overlay for Rear */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-color"
                    style={{
                      backgroundColor: 
                        woodType === 'teak' ? 'rgba(217, 119, 6, 0.20)' :
                        woodType === 'mahogany' ? 'rgba(185, 28, 28, 0.28)' :
                        woodType === 'jackwood' ? 'rgba(234, 179, 8, 0.22)' :
                        'rgba(245, 158, 11, 0.16)'
                    }}
                  />
                </div>

                {/* 3D Timber Thickness Edges */}
                <div 
                  className="absolute top-0 bottom-0 left-0 w-3 -translate-x-full origin-right bg-[#1D1109] border-y border-amber-900/60"
                  style={{
                    transform: 'rotateY(-90deg) translateZ(0px)',
                    background: 'linear-gradient(to right, #1a0e07, #2d180c)'
                  }}
                />
                <div 
                  className="absolute top-0 bottom-0 right-0 w-3 translate-x-full origin-left bg-[#1D1109] border-y border-amber-900/60"
                  style={{
                    transform: 'rotateY(90deg) translateZ(0px)',
                    background: 'linear-gradient(to left, #1a0e07, #2d180c)'
                  }}
                />
              </div>
            </div>

            {/* TOP CONTROLS BAR: 360 Button + Presets + Maximize */}
            <div 
              className="relative z-30 flex items-center justify-between gap-2 pointer-events-auto no-drag"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {/* Interactive 360° Preview Toggle Button */}
              <button
                type="button"
                onClick={toggleAutoRotate}
                onPointerDown={(e) => e.stopPropagation()}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg backdrop-blur-md transition-all cursor-pointer ${
                  isAutoRotating 
                    ? 'bg-amber-400 text-stone-950 border-2 border-white ring-2 ring-amber-400/50 shadow-amber-400/40' 
                    : 'bg-black/70 text-amber-300 border border-white/20 hover:bg-black/90 hover:border-amber-400/60'
                }`}
                title="Click to toggle 360° Auto-Spin"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
                <span>{isAutoRotating ? '360° Spinning' : '360° Preview'}</span>
                <span className={`w-2 h-2 rounded-full ${isAutoRotating ? 'bg-emerald-500 animate-ping' : 'bg-amber-400/70'}`} />
              </button>

              {/* Quick Angle Preset Pills */}
              <div 
                className="hidden sm:flex items-center gap-1 bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-xs"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <span className="text-amber-300 font-mono font-bold text-[11px] mr-1">📐 {Math.round(rotationAngle)}°</span>
                <button 
                  type="button" 
                  onClick={(e) => handleSetAngle(0, e)} 
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${rotationAngle === 0 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'}`}
                >
                  0° Front
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleSetAngle(45, e)} 
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${rotationAngle === 45 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'}`}
                >
                  45°
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleSetAngle(90, e)} 
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${rotationAngle === 90 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'}`}
                >
                  90° Side
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleSetAngle(180, e)} 
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${rotationAngle === 180 ? 'bg-amber-400 text-stone-950 font-black' : 'text-gray-300 hover:text-white'}`}
                >
                  180° Back
                </button>
              </div>

              {/* Step Rotation & Fullscreen Studio Button */}
              <div 
                className="flex items-center gap-1.5"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleRotateLeft}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-black/90 hover:text-white flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                  title="Rotate Counter-Clockwise (-15°)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRotateRight}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-7 h-7 rounded-full bg-black/70 backdrop-blur-md text-amber-200 border border-white/20 hover:bg-black/90 hover:text-white flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                  title="Rotate Clockwise (+15°)"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsStudioOpen(true); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="bg-black/70 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-amber-400 hover:text-stone-950 transition-all cursor-pointer shadow"
                  title="Open Fullscreen 360° Studio"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DRAG HELPER PROMPT */}
            <div className="relative z-20 self-center bg-black/70 backdrop-blur-md text-white border border-white/20 px-3.5 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-2 shadow pointer-events-none select-none">
              <MoveHorizontal className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Drag horizontally to rotate 360° • Click badge to auto-spin</span>
            </div>

            {/* BOTTOM THUMBNAILS & NEXT BUTTON */}
            <div 
              className="relative z-30 flex items-center justify-between gap-2 pt-2 pointer-events-auto no-drag"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {previewImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveThumb(idx); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`w-14 sm:w-16 h-11 sm:h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                      activeThumb === idx ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105' : 'border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                <span className="sm:hidden text-[10px] font-mono text-amber-300 bg-black/60 px-2 py-1 rounded-full border border-white/20">
                  {Math.round(rotationAngle)}°
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setActiveThumb((prev) => (prev + 1) % previewImages.length); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-black/90 flex items-center justify-center shrink-0 cursor-pointer"
                  title="Next Angle Preview"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. SELECTION SUMMARY CARD */}
        <div className="bg-[#23160D] text-amber-100/90 border border-[#3D2415] rounded-3xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3D2415]">
            <div className="flex items-center gap-3">
              <img
                src={activeDesignImage}
                alt="Selected design thumbnail"
                className="w-12 h-12 object-cover rounded-xl border border-amber-600/40 shadow shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">
                  {designSource === 'uploaded' && uploadedDesign ? 'Custom Uploaded Design' : t('selectFurniture')}
                </span>
                <span className="text-sm font-bold text-white">{activeDesignTitle}</span>
              </div>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('design-source-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveModal('work');
              }}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors cursor-pointer"
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
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors cursor-pointer"
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
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors cursor-pointer"
            >
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">{t('setDimensions')}</span>
              <span className="text-sm font-bold text-white">{length} (H/L) x {width} (W) x {height} (D) cm</span>
            </div>
            <button
              onClick={() => setActiveModal('dimensions')}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors cursor-pointer"
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
              <p className="text-xs text-[#7A6252] mt-0.5">Please fill in your details to process your custom carpentry quote</p>
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
                placeholder="Any special carving details, door frame thickness, glass pane requirements or timeline targets..."
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
              <Info className="w-3.5 h-3.5 text-[#7A6252] cursor-pointer" onClick={() => setActiveModal('howItWorks')} />
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
            <p className="text-xs text-[#7A6252] mt-0.5">Share your door carving design, window drawing or pantry sketch</p>
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

            <div className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-2xl p-3.5 text-left text-xs space-y-2 text-[#2B190E]">
              <div className="flex items-center gap-3 pb-2 border-b border-[#E8DEC8]">
                <img
                  src={activeDesignImage}
                  alt={activeDesignTitle}
                  className="w-14 h-14 object-cover rounded-xl border border-amber-800/30 shadow shrink-0"
                />
                <div>
                  <span className="font-bold text-[#2B190E] block">{activeDesignTitle}</span>
                  <span className="text-[10px] text-[#7A6252] block">
                    {designSource === 'uploaded' ? 'Customer Uploaded Photo (3D Inspected)' : 'Catalogue Design'}
                  </span>
                </div>
              </div>
              <p><strong>{t('fullName')}:</strong> {userName}</p>
              <p><strong>{t('phoneField')}:</strong> {userPhone}</p>
              <p><strong>{t('districtField')}:</strong> {userDistrict}</p>
              <p><strong>{t('selectWood')}:</strong> {currentWood.name}</p>
              <p><strong>{t('setDimensions')}:</strong> {length} x {width} x {height} cm</p>
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
                {activeModal === 'work' && t('selectFurniture')}
                {activeModal === 'wood' && t('selectWood')}
                {activeModal === 'finish' && t('selectFinish')}
                {activeModal === 'dimensions' && t('setDimensions')}
                {activeModal === 'howItWorks' && 'How Custom Order Works'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Work Drawer */}
            {activeModal === 'work' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {carpentryOptions.map(f => (
                  <div
                    key={f.id}
                    onClick={() => { setSelectedWork(f.id); setActiveModal(null); }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                      selectedWork === f.id ? 'border-[#8B5E3C] bg-[#FAF4EB] font-bold' : 'border-[#E8DEC8] hover:bg-gray-50'
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
                  <input type="range" min="100" max="350" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full text-[#8B5E3C]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2B190E]">{t('widthCm')}: {width} cm</label>
                  <input type="range" min="30" max="250" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full text-[#8B5E3C]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2B190E]">{t('heightCm')}: {height} cm</label>
                  <input type="range" min="2" max="30" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full text-[#8B5E3C]" />
                </div>
                <button onClick={() => setActiveModal(null)} className="w-full bg-[#3D2415] text-white py-2.5 rounded-xl text-xs font-bold">Done</button>
              </div>
            )}

            {/* How It Works Modal */}
            {activeModal === 'howItWorks' && (
              <div className="space-y-3 text-xs text-[#7A6252]">
                <p>1. Select door, window, staircase, pantry or ceiling item & timber species.</p>
                <p>2. Enter your site dimensions or upload reference photos/sketches.</p>
                <p>3. Submit details to send an instant WhatsApp order to our master carpenter in Kalutara.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. FULLSCREEN 360° VIRTUAL INSPECTION STUDIO MODAL */}
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 bg-[#0C0603]/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 text-amber-100 select-none animate-fade-in">
          {/* Studio Header */}
          <div className="flex items-center justify-between border-b border-[#3D2415] pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <RotateCw className={`w-5 h-5 ${isAutoRotating ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-lg font-black font-heading text-white">360° Virtual Inspection Studio</h2>
                  <span className="hidden sm:inline-block text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-bold uppercase tracking-wider">
                    Interactive Turntable
                  </span>
                </div>
                <p className="text-xs text-amber-300/70 font-medium">
                  {currentWork.name} • {currentWood.name} ({currentFinish.name})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Inspection Mode Switcher */}
              <div className="flex items-center gap-1 bg-black/60 border border-white/20 p-0.5 rounded-full">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-amber-400 text-stone-950 font-black shadow'
                      : 'text-amber-200/70 hover:text-white'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>3D Model</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('photos')}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'photos'
                      ? 'bg-amber-400 text-stone-950 font-black shadow'
                      : 'text-amber-200/70 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Photos</span>
                </button>
              </div>

              {/* Zoom Controls (Photos mode) */}
              {viewMode === 'photos' && (
                <div className="hidden sm:flex items-center gap-1 bg-black/60 border border-white/20 rounded-full px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.8, Number((prev - 0.2).toFixed(1))))}
                    className="p-1 hover:text-amber-400 transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-amber-300 w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(1.8, Number((prev + 0.2).toFixed(1))))}
                    className="p-1 hover:text-amber-400 transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsStudioOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close Studio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Studio Canvas */}
          {viewMode === '3d' ? (
            <div className="relative flex-1 my-3 rounded-3xl overflow-hidden border border-[#3D2415] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2B190E] via-[#140C07] to-[#0A0503]">
              <ThreeCarpentryViewer
                woodType={woodType}
                finish={finish}
                selectedWork={selectedWork}
                activeImage={activeDesignImage}
                designTitle={activeDesignTitle}
                length={length}
                width={width}
                height={height}
                isStudio={true}
              />
            </div>
          ) : (
            <div 
              className="relative flex-1 my-3 rounded-3xl overflow-hidden border border-[#3D2415] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2B190E] via-[#140C07] to-[#0A0503] flex items-center justify-center select-none"
            >
              {/* Dedicated Drag Layer inside studio */}
              <div 
                className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              />

              {/* Studio Overhead Spotlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Architectural Dimension Calipers */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-3 rounded-2xl pointer-events-none z-20">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">HEIGHT</span>
                <div className="w-[1px] h-20 bg-amber-400/50"></div>
                <span className="text-xs font-mono font-black text-white">{length} cm</span>
                <div className="w-[1px] h-20 bg-amber-400/50"></div>
              </div>

              <div className="absolute top-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl pointer-events-none z-20">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">WIDTH</span>
                <div className="h-[1px] w-12 bg-amber-400/50"></div>
                <span className="text-xs font-mono font-black text-white">{width} cm</span>
                <div className="h-[1px] w-12 bg-amber-400/50"></div>
                <span className="text-[10px] font-mono text-amber-300/70 border-l border-white/20 pl-2">THICKNESS: {height} cm</span>
              </div>

              {/* 3D Model Assembly */}
              <div 
                className="relative flex items-center justify-center transition-transform duration-75 pointer-events-none"
                style={{ 
                  perspective: '1200px',
                  transform: `scale(${zoomLevel})`
                }}
              >
                {/* Turntable Disc Base */}
                <div 
                  className="absolute -bottom-16 w-80 sm:w-[420px] h-24 sm:h-28 rounded-full border border-amber-600/50 bg-gradient-to-b from-[#3D2415] to-[#120B06] shadow-[0_30px_60px_rgba(0,0,0,0.95)] flex items-center justify-center"
                  style={{
                    transform: `rotateX(68deg) rotateZ(${rotationAngle}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="w-64 sm:w-80 h-16 sm:h-20 rounded-full border border-amber-500/30 bg-[#25150C] flex items-center justify-center">
                    <div className="w-48 sm:w-60 h-10 sm:h-12 rounded-full border border-amber-400/20 bg-[#160A05] flex items-center justify-center">
                      <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase">360° TURNTABLE STAGE</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Cast Shadow */}
                <div 
                  className="absolute -bottom-12 w-64 sm:w-80 h-10 rounded-full bg-black/90 blur-lg transition-all duration-75"
                  style={{
                    transform: `scaleX(${Math.max(0.35, Math.abs(Math.cos(rotationAngle * Math.PI / 180)))}) scaleY(0.7)`
                  }}
                />

                {/* Rotating Workpiece */}
                <div
                  className="relative w-56 sm:w-72 h-80 sm:h-[420px] transition-transform duration-75"
                  style={{
                    transform: `rotateY(${rotationAngle}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Front Panel */}
                  <div 
                    className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-amber-600/60 shadow-[0_30px_70px_rgba(0,0,0,0.95)] bg-[#2A180E]"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(8px)'
                    }}
                  >
                    <img
                      src={previewImages[activeThumb] || currentWork.img}
                      alt={currentWork.name}
                      className="w-full h-full object-cover select-none"
                      draggable="false"
                    />
                    {/* Species Tint */}
                    <div 
                      className="absolute inset-0 pointer-events-none mix-blend-color"
                      style={{
                        backgroundColor: 
                          woodType === 'teak' ? 'rgba(217, 119, 6, 0.16)' :
                          woodType === 'mahogany' ? 'rgba(185, 28, 28, 0.24)' :
                          woodType === 'jackwood' ? 'rgba(234, 179, 8, 0.20)' :
                          'rgba(245, 158, 11, 0.14)'
                      }}
                    />
                    {/* Dynamic Specular Sheen */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(${110 + ((rotationAngle % 180) - 90) * 0.9}deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 25%, transparent 60%)`,
                        opacity: finish === 'gloss' ? 0.95 : finish === 'matte' ? 0.35 : 0.65
                      }}
                    />
                  </div>

                  {/* Rear Panel */}
                  <div 
                    className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-amber-800/60 shadow-[0_30px_70px_rgba(0,0,0,0.95)] bg-gradient-to-b from-[#3D2415] via-[#2D1B0F] to-[#1C1008] p-4 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg) translateZ(8px)'
                    }}
                  >
                    <div className="w-full h-full rounded-xl border border-amber-600/40 p-3 flex flex-col justify-between bg-[#24150C]/70">
                      <div className="flex items-center justify-between border-b border-amber-700/40 pb-2">
                        <span className="text-[11px] font-bold text-amber-400 font-mono">100% SEASONED WOOD</span>
                        <span className="text-[11px] text-amber-200/80 font-mono">REAR PROFILE</span>
                      </div>
                      <div className="my-auto space-y-2 py-4 px-2 text-center">
                        <div className="w-10 h-10 mx-auto rounded-full border border-amber-400/60 bg-amber-950/70 flex items-center justify-center text-amber-300 font-black text-sm">
                          වම
                        </div>
                        <p className="text-sm font-bold text-amber-200 font-heading">වඩු මඩුව • MASTER WORKSHOP</p>
                        <p className="text-xs text-amber-300 font-mono uppercase">
                          {currentWood.name} • {length} x {width} x {height} cm
                        </p>
                        <p className="text-[10px] text-amber-400/70">Solid Seasoned Hardwood Backing with Architectural Cross Braces</p>
                      </div>
                      <div className="border-t border-amber-700/40 pt-2 flex items-center justify-between text-[10px] text-amber-400/80 font-mono">
                        <span>KALUTARA HERITAGE</span>
                        <span>LIFETIME GUARANTEE</span>
                      </div>
                    </div>
                    <div 
                      className="absolute inset-0 pointer-events-none mix-blend-color"
                      style={{
                        backgroundColor: 
                          woodType === 'teak' ? 'rgba(217, 119, 6, 0.22)' :
                          woodType === 'mahogany' ? 'rgba(185, 28, 28, 0.30)' :
                          woodType === 'jackwood' ? 'rgba(234, 179, 8, 0.25)' :
                          'rgba(245, 158, 11, 0.18)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating Studio Toolbar at Bottom of Canvas */}
              <div 
                onPointerDown={(e) => e.stopPropagation()} 
                onClick={(e) => e.stopPropagation()} 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/85 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs shadow-2xl max-w-[95%] overflow-x-auto no-scrollbar pointer-events-auto no-drag"
              >
                <button
                  type="button"
                  onClick={toggleAutoRotate}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isAutoRotating ? 'bg-amber-400 text-stone-950 font-black' : 'bg-white/10 text-amber-300 hover:bg-white/20'
                  }`}
                >
                  {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isAutoRotating ? 'Pause Spin' : 'Auto-Spin'}</span>
                </button>

                <div className="w-[1px] h-4 bg-white/20 shrink-0"></div>

                <button
                  type="button"
                  onClick={handleRotateLeft}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="p-1 hover:text-amber-400 text-gray-300 transition-colors shrink-0 cursor-pointer"
                  title="Rotate Left 15°"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] font-mono font-bold text-amber-300 px-1 shrink-0">
                  {Math.round(rotationAngle)}°
                </span>

                <button
                  type="button"
                  onClick={handleRotateRight}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="p-1 hover:text-amber-400 text-gray-300 transition-colors shrink-0 cursor-pointer"
                  title="Rotate Right 15°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-white/20 hidden sm:block shrink-0"></div>

                <div className="hidden sm:flex items-center gap-1 shrink-0">
                  <button type="button" onClick={(e) => handleSetAngle(0, e)} onPointerDown={(e) => e.stopPropagation()} className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${rotationAngle === 0 ? 'bg-amber-400 text-black font-black' : 'hover:text-white text-gray-400'}`}>0°</button>
                  <button type="button" onClick={(e) => handleSetAngle(45, e)} onPointerDown={(e) => e.stopPropagation()} className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${rotationAngle === 45 ? 'bg-amber-400 text-black font-black' : 'hover:text-white text-gray-400'}`}>45°</button>
                  <button type="button" onClick={(e) => handleSetAngle(90, e)} onPointerDown={(e) => e.stopPropagation()} className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${rotationAngle === 90 ? 'bg-amber-400 text-black font-black' : 'hover:text-white text-gray-400'}`}>90°</button>
                  <button type="button" onClick={(e) => handleSetAngle(180, e)} onPointerDown={(e) => e.stopPropagation()} className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${rotationAngle === 180 ? 'bg-amber-400 text-black font-black' : 'hover:text-white text-gray-400'}`}>180°</button>
                </div>
              </div>
            </div>
          )}

          {/* Studio Footer: Timber Switcher + Price + Order CTA */}
          <div 
            className="border-t border-[#3D2415] pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 relative z-30 no-drag"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
              <span className="text-xs font-bold text-amber-400/80 uppercase tracking-wider shrink-0 mr-1">Timber:</span>
              {woodOptions.map(w => (
                <button
                  type="button"
                  key={w.id}
                  onClick={(e) => { e.stopPropagation(); setWoodType(w.id); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    woodType === w.id 
                      ? 'bg-amber-500 text-stone-950 shadow-md font-black' 
                      : 'bg-black/50 text-amber-200/80 border border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  {w.name.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-amber-400/70 block">Estimated Price</span>
                <span className="text-base font-black text-amber-300 font-mono">LKR {estimatedPrice.toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStudioOpen(false);
                  const el = document.getElementById('user-details-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Proceed to Order</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
