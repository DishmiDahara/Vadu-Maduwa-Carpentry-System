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
  Boxes,
  Compass
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
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

  // Sample pre-configured customer designs for 1-click 3D testing across product categories
  const sampleDesigns = [
    {
      name: 'Carved Solid Teak Entrance Door',
      category: 'door',
      url: '/images/doors/IMG_6930.PNG',
      desc: '3D Door Model • Multi-part stiles, rails & arch relief'
    },
    {
      name: 'Modular Teak Pantry Cupboard',
      category: 'pantry',
      url: '/images/cupboards/IMG_7175.PNG',
      desc: '3D Pantry Model • Upper & lower cabinets, drawers & sink'
    },
    {
      name: 'Double Casement Wooden Window',
      category: 'window',
      url: '/images/doors/IMG_6933.PNG',
      desc: '3D Window Model • Frame, glass panes, mullions & sashes'
    },
    {
      name: 'Handcrafted Teak Staircase & Rail',
      category: 'staircase',
      url: '/images/stairs/IMG_7160.PNG',
      desc: '3D Staircase Model • Steps, risers, balusters & handrails'
    },
    {
      name: '3-Door Solid Teak Wardrobe',
      category: 'wardrobe',
      url: '/images/cupboards/IMG_7177.PNG',
      desc: '3D Wardrobe Model • 3 doors, drawers & interior hanging rod'
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

  // All 10 Major Carpentry Product Categories with Dedicated 3D Models
  const carpentryOptions = [
    { id: 'door', name: 'Wooden Doors (Main & Room Doors)', basePrice: 45000, img: '/images/doors/IMG_6930.PNG' },
    { id: 'pantry', name: 'Pantry Cupboards (Modular Units)', basePrice: 95000, img: '/images/cupboards/IMG_7175.PNG' },
    { id: 'kitchen_cabinet', name: 'Kitchen Cabinets (Island & Base)', basePrice: 88000, img: '/images/cupboards/IMG_7176.PNG' },
    { id: 'window', name: 'Windows (Wooden Frame & Sash)', basePrice: 34000, img: '/images/doors/IMG_6933.PNG' },
    { id: 'staircase', name: 'Staircases (Steps & Handrails)', basePrice: 120000, img: '/images/stairs/IMG_7160.PNG' },
    { id: 'wardrobe', name: 'Wardrobes (3-Door Almariya)', basePrice: 85000, img: '/images/cupboards/IMG_7177.PNG' },
    { id: 'bedroom_cupboard', name: 'Bedroom Cupboards (2-Door Chest)', basePrice: 68000, img: '/images/cupboards/IMG_7178.PNG' },
    { id: 'table', name: 'Tables (Dining & Executive Tables)', basePrice: 55000, img: '/images/cupboards/IMG_7175.PNG' },
    { id: 'chair', name: 'Chairs (Carved Solid Wood Chairs)', basePrice: 18500, img: '/images/doors/IMG_6931.PNG' },
    { id: 'custom_furniture', name: 'Custom Wooden Furniture', basePrice: 60000, img: '/images/stairs/IMG_7163.PNG' }
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
    pantry: [
      '/images/cupboards/IMG_7175.PNG',
      '/images/cupboards/IMG_7176.PNG',
      '/images/cupboards/IMG_7177.PNG',
      '/images/cupboards/IMG_7178.PNG'
    ],
    kitchen_cabinet: [
      '/images/cupboards/IMG_7176.PNG',
      '/images/cupboards/IMG_7175.PNG',
      '/images/cupboards/IMG_7178.PNG',
      '/images/cupboards/IMG_7177.PNG'
    ],
    window: [
      '/images/doors/IMG_6933.PNG',
      '/images/doors/IMG_6930.PNG',
      '/images/doors/IMG_6931.PNG',
      '/images/doors/IMG_6935.PNG'
    ],
    staircase: [
      '/images/stairs/IMG_7160.PNG',
      '/images/stairs/IMG_7161.PNG',
      '/images/stairs/IMG_7162.PNG',
      '/images/stairs/IMG_7163.PNG'
    ],
    wardrobe: [
      '/images/cupboards/IMG_7177.PNG',
      '/images/cupboards/IMG_7178.PNG',
      '/images/cupboards/IMG_7175.PNG',
      '/images/doors/IMG_6930.PNG'
    ],
    bedroom_cupboard: [
      '/images/cupboards/IMG_7178.PNG',
      '/images/cupboards/IMG_7177.PNG',
      '/images/cupboards/IMG_7176.PNG',
      '/images/doors/IMG_6931.PNG'
    ],
    table: [
      '/images/cupboards/IMG_7175.PNG',
      '/images/stairs/IMG_7160.PNG',
      '/images/doors/IMG_6934.PNG',
      '/images/cupboards/IMG_7176.PNG'
    ],
    chair: [
      '/images/doors/IMG_6931.PNG',
      '/images/doors/IMG_6930.PNG',
      '/images/stairs/IMG_7161.PNG',
      '/images/cupboards/IMG_7177.PNG'
    ],
    custom_furniture: [
      '/images/stairs/IMG_7163.PNG',
      '/images/cupboards/IMG_7175.PNG',
      '/images/doors/IMG_6930.PNG',
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

  const inferCategoryFromFilename = (filename = '') => {
    const f = filename.toLowerCase();
    if (f.includes('pantry')) return 'pantry';
    if (f.includes('kitchen') || f.includes('cabinet')) return 'kitchen_cabinet';
    if (f.includes('window')) return 'window';
    if (f.includes('stair')) return 'staircase';
    if (f.includes('wardrobe') || f.includes('almariya')) return 'wardrobe';
    if (f.includes('bedroom') || f.includes('cupboard')) return 'bedroom_cupboard';
    if (f.includes('table') || f.includes('desk')) return 'table';
    if (f.includes('chair') || f.includes('seat')) return 'chair';
    if (f.includes('door')) return 'door';
    return null;
  };

  const handleCustomerDesignUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const inferred = inferCategoryFromFilename(file.name);
      if (inferred) setSelectedWork(inferred);
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
      if (e.target) e.target.value = '';
    }
  };

  const handleSelectSampleDesign = (sample) => {
    if (sample.category) {
      setSelectedWork(sample.category);
    }
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
      const inferred = inferCategoryFromFilename(file.name);
      if (inferred) setSelectedWork(inferred);
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
      <div className="site-container space-y-5">

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
                Pick a master design from our workshop catalogue or upload your own custom photo
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

          {/* CARPENTRY PRODUCT CATEGORY SELECTOR */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#7A6252] uppercase tracking-wider">
                Select Carpentry Product Category:
              </span>
              <span className="text-[11px] font-black text-[#8B5E3C]">
                Selected: {currentWork.name.split(' (')[0]}
              </span>
            </div>
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
                      ? 'bg-[#8B5E3C] text-white shadow-sm ring-2 ring-[#8B5E3C]/30'
                      : 'bg-[#FAF4EB] text-[#7A6252] hover:text-[#2B190E] border border-[#E8DEC8]'
                  }`}
                >
                  {f.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT: CATALOGUE SELECTOR */}
          {designSource === 'catalogue' && (
            <div className="space-y-3">
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
                  <span className="text-[10px] text-[#7A6252] block">Selected Category:</span>
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
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-[#2B190E]">{uploadedDesign.name}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          Selected for {currentWork.name.split(' (')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A6252]">
                        {uploadedDesign.size ? `${uploadedDesign.size} • ` : ''}Attached to your custom order request
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
                        Supports JPG, PNG, WEBP, HEIC • Doors, Pantry Cupboards, Kitchen Cabinets, Windows, Staircases, Wardrobes, Tables & Chairs
                      </p>
                    </div>
                    <span className="text-[10px] bg-[#8B5E3C] text-white px-3 py-1 rounded-full font-bold shadow-sm">
                      Browse Image from Device
                    </span>
                    <input type="file" accept="image/*,.pdf" onChange={handleCustomerDesignUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

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
                    {designSource === 'uploaded' ? 'Customer Uploaded Photo' : 'Catalogue Design'}
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
                    <span className="text-[11px] text-[#8B5E3C] font-semibold bg-[#FAF4EB] px-2 py-0.5 rounded-full border border-[#E8DEC8]">Custom Craft</span>
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

    </div>
  );
}
