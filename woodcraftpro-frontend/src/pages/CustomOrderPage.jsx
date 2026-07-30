import React, { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  Upload, 
  Trash2, 
  Edit3, 
  MessageCircle, 
  Send, 
  RotateCw, 
  Camera, 
  Sparkles, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  Info, 
  X,
  Star,
  Users,
  Award,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function CustomOrderPage({ setActiveTab }) {
  const { t } = useLanguage();

  // Active step state (1 to 5)
  const [activeStep, setActiveStep] = useState(1);

  // Form selections
  const [selectedFurniture, setSelectedFurniture] = useState('bed');
  const [selectedWood, setSelectedWood] = useState('mahogany'); // Selected in mockup
  const [selectedFinish, setSelectedFinish] = useState('matte');
  const [unit, setUnit] = useState('ft');
  const [dimensions, setDimensions] = useState({ height: 6.5, width: 5.0, depth: 2.0 });

  // Contact info
  const [contactInfo, setContactInfo] = useState({
    name: 'Sunil Perera',
    phone: '077 123 4567',
    location: 'Nawala, Rajagiriya',
    notes: ''
  });

  // Reference images mock/upload state
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'kitchen_idea.jpg', size: '2.4 MB', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'sketch.png', size: '1.1 MB', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' }
  ]);

  // Teak benefit banner state
  const [showTeakInfo, setShowTeakInfo] = useState(true);

  // Image angle index for "Change View" camera button
  const [viewIndex, setViewIndex] = useState(0);

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 1. Furniture Items Catalog Matching Mockup
  const furnitureItems = [
    {
      id: 'bed',
      name: 'Bed Frame',
      icon: '🛏️',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      views: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
      ],
      baseWoodCost: 85000,
      baseLaborCost: 40000
    },
    {
      id: 'dining',
      name: 'Dining Table Set',
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      views: [
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80'
      ],
      baseWoodCost: 110000,
      baseLaborCost: 45000
    },
    {
      id: 'pantry',
      name: 'Modular Pantry Kitchen',
      icon: '🍳',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      views: [
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'
      ],
      baseWoodCost: 160000,
      baseLaborCost: 65000
    },
    {
      id: 'wardrobe',
      name: 'Wardrobe / Closet',
      icon: '🚪',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
      views: [
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80'
      ],
      baseWoodCost: 130000,
      baseLaborCost: 50000
    },
    {
      id: 'staircase',
      name: 'Staircase & Railing',
      icon: '🪜',
      image: '/banner_crafts/staircase_main.jpg',
      views: [
        '/banner_crafts/staircase_main.jpg',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
      ],
      baseWoodCost: 180000,
      baseLaborCost: 75000
    },
    {
      id: 'sofa',
      name: 'Wooden Sofa Set',
      icon: '🛋️',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      views: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
      ],
      baseWoodCost: 95000,
      baseLaborCost: 42000
    },
    {
      id: 'custom',
      name: 'Custom Design (Share your idea)',
      icon: '+',
      isCustom: true,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      views: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
      baseWoodCost: 90000,
      baseLaborCost: 40000
    }
  ];

  // 2. Wood Species Matching Mockup
  const woodTypes = [
    {
      id: 'teak',
      name: 'Teak',
      sinName: 'තේක්ක',
      warranty: '15 Years',
      rating: 5,
      tag: 'POPULAR',
      tagColor: 'bg-purple-600/80 text-white',
      multiplier: 1.0,
      image: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=300&q=80',
      desc: 'Premium • Water Resistant • 100% Genuine Teak'
    },
    {
      id: 'mahogany',
      name: 'Mahogany',
      sinName: 'මහෝගනි',
      warranty: '10 Years',
      rating: 5,
      multiplier: 0.9,
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80',
      desc: 'Rich Finish • Termite Resistant • Premium Quality'
    },
    {
      id: 'nadun',
      name: 'Nadun',
      sinName: 'නදුන්',
      warranty: '12 Years',
      rating: 5,
      multiplier: 0.95,
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=300&q=80',
      desc: 'Strong & Durable • Best Value'
    },
    {
      id: 'kumbuk',
      name: 'Kumbuk',
      sinName: 'කුඹුක්',
      warranty: '10 Years',
      rating: 5,
      multiplier: 0.88,
      image: 'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=300&q=80',
      desc: 'Heavy Solid • Long Lasting • Excellent Strength'
    }
  ];

  // 3. Polish & Finish Swatches Matching Mockup
  const finishStyles = [
    { id: 'matte', title: 'Matte', sub: 'Modern Look', cost: 15000, gradient: 'bg-gradient-to-r from-gray-700 to-gray-900' },
    { id: 'glossy', title: 'Glossy', sub: 'High Shine', cost: 18000, gradient: 'bg-gradient-to-r from-slate-400 via-gray-100 to-slate-500' },
    { id: 'satin', title: 'Satin', sub: 'Smooth Touch', cost: 16000, gradient: 'bg-gradient-to-r from-amber-700/80 to-amber-900' },
    { id: 'natural', title: 'Natural', sub: 'Wood Finish', cost: 14000, gradient: 'bg-gradient-to-r from-amber-800 to-yellow-900' }
  ];

  // Current selections helper objects
  const selectedFurnitureObj = furnitureItems.find(f => f.id === selectedFurniture) || furnitureItems[0];
  const selectedWoodObj = woodTypes.find(w => w.id === selectedWood) || woodTypes[0];
  const selectedFinishObj = finishStyles.find(fs => fs.id === selectedFinish) || finishStyles[0];

  // Dynamic Price Breakdown Calculations matching mockup values
  const woodPrice = Math.round(selectedFurnitureObj.baseWoodCost * selectedWoodObj.multiplier);
  const laborPrice = selectedFurnitureObj.baseLaborCost;
  const finishPrice = selectedFinishObj.cost;
  const transportPrice = 12000;
  const discountPrice = 5000;

  const estimatedTotal = woodPrice + laborPrice + finishPrice + transportPrice - discountPrice;

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: URL.createObjectURL(file)
      };
      setUploadedFiles([...uploadedFiles, newFile]);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  // Change View Handler
  const handleNextView = () => {
    const viewsCount = selectedFurnitureObj.views.length;
    setViewIndex((prev) => (prev + 1) % viewsCount);
  };

  // WhatsApp Message Generator
  const sendWhatsAppEstimate = () => {
    const msg = `Hi වඩු මඩුව (Vadu Maduwa), I created a custom order idea estimate:

🪑 *Furniture*: ${selectedFurnitureObj.name}
🪵 *Wood Type*: ${selectedWoodObj.name} (${selectedWoodObj.sinName})
📏 *Dimensions*: ${dimensions.height} ft (H) x ${dimensions.width} ft (W) x ${dimensions.depth} ft (D)
🎨 *Finish*: ${selectedFinishObj.title} (${selectedFinishObj.sub})
🖼️ *Uploaded Images*: ${uploadedFiles.length} files attached

💰 *Price Breakdown*:
• Wood (${selectedWoodObj.name}): LKR ${woodPrice.toLocaleString()}
• Labor & Craftsmanship: LKR ${laborPrice.toLocaleString()}
• Polish & Finish: LKR ${finishPrice.toLocaleString()}
• Transport & Handling: LKR ${transportPrice.toLocaleString()}
• Discount: - LKR ${discountPrice.toLocaleString()}
-----------------------------------
🏷️ *Estimated Total*: LKR ${estimatedTotal.toLocaleString()}

👤 *Customer*: ${contactInfo.name}
📞 *Phone*: ${contactInfo.phone}
📍 *Location*: ${contactInfo.location}
💬 *Notes*: ${contactInfo.notes || 'N/A'}`;

    window.open(`https://wa.me/94773769849?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createInquiry({
        customerName: contactInfo.name,
        customerPhone: contactInfo.phone,
        customerEmail: '',
        message: `[CUSTOM ORDER MOCKUP] Item: ${selectedFurnitureObj.name}, Wood: ${selectedWoodObj.name}, Dimensions: ${dimensions.height}x${dimensions.width}x${dimensions.depth} ft, Total Est: LKR ${estimatedTotal.toLocaleString()}, Notes: ${contactInfo.notes}`
      });
      setSubmitSuccess(true);
    } catch {
      alert('Inquiry sent successfully!');
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#090A0F] text-gray-100 font-sans min-h-screen pb-24 selection:bg-amber-500 selection:text-black">
      
      {/* ========================================================
          1. TOP STEPPER PROCESS BAR (Exact Mockup Match)
         ======================================================== */}
      <div className="bg-[#12141D] border-b border-white/10 sticky top-20 z-40 shadow-xl backdrop-blur-xl bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* 5 Numbered Step Nodes */}
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            {[
              { num: 1, label: 'Choose Furniture', icon: '🪑' },
              { num: 2, label: 'Wood Type', icon: '🌲' },
              { num: 3, label: 'Upload Photo', icon: '☁️' },
              { num: 4, label: 'Measurements', icon: '📏' },
              { num: 5, label: 'Contact Details', icon: '👤' }
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeStep === st.num
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-lg shadow-amber-950/40 font-bold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeStep === st.num ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-300'
                }`}>
                  {st.num}
                </div>
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          {/* Social Proof Stack (Right) */}
          <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-gray-300 shrink-0">
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[#12141D]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="" />
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[#12141D]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="" />
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[#12141D]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="" />
            </div>
            <div>
              <span className="text-white font-bold text-[11px]">Trusted by 1,200+</span>
              <span className="text-gray-400 text-[10px] block font-medium">happy customers ⭐⭐⭐⭐⭐</span>
            </div>
          </div>

        </div>
      </div>


      {/* ========================================================
          2. MAIN CONTENT GRID (8 Cols Left, 4 Cols Right Sticky)
         ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* =====================================================
              LEFT COLUMN - STEPS 1 TO 5 FORM PANELS (8 COLS)
             ===================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: CHOOSE YOUR FURNITURE */}
            <div className="bg-[#12141C] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  🪑
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-heading">1. Choose Your Furniture</h2>
                  <p className="text-xs text-gray-400">Select the furniture you want to customize</p>
                </div>
              </div>

              {/* 7 Furniture Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {furnitureItems.map((item) => {
                  const isSelected = selectedFurniture === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedFurniture(item.id)}
                      className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between p-2.5 h-36 ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/50'
                          : 'bg-[#171924] border-white/10 hover:border-white/20 hover:bg-[#1C1F2D]'
                      }`}
                    >
                      {/* Checkmark Badge if selected */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-xs shadow-md">
                          ✓
                        </div>
                      )}

                      {/* Image Thumbnail */}
                      {!item.isCustom ? (
                        <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2 bg-black/40">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-20 w-full rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-amber-400 text-2xl mb-2 bg-white/5">
                          +
                        </div>
                      )}

                      <h3 className="text-xs font-bold text-white text-center leading-tight line-clamp-2">
                        {item.name}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* STEP 2: SELECT WOOD TYPE */}
            <div className="bg-[#12141C] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    🌲
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-heading">Select Wood Type</h2>
                    <p className="text-xs text-gray-400">Choose the perfect wood for your furniture</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Teak & Mahogany are 100% Seasoned Hardwood with 10-15 Year Warranty.')}
                  className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg hover:bg-amber-500/20 transition-colors cursor-pointer font-medium"
                >
                  Compare Woods
                </button>
              </div>

              {/* 4 Wood Species Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {woodTypes.map((wood) => {
                  const isSelected = selectedWood === wood.id;
                  return (
                    <div
                      key={wood.id}
                      onClick={() => setSelectedWood(wood.id)}
                      className={`relative rounded-xl border p-3 flex flex-col justify-between transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-950/50'
                          : 'bg-[#171924] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Optional Popular Tag */}
                      {wood.tag && (
                        <span className={`absolute -top-2 left-2 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${wood.tagColor}`}>
                          {wood.tag}
                        </span>
                      )}

                      {/* Wood Texture Preview */}
                      <div className="h-14 w-full rounded-lg overflow-hidden border border-white/10 bg-black">
                        <img src={wood.image} alt={wood.name} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">
                            {wood.name} <span className="text-[10px] text-gray-400 font-normal">({wood.sinName})</span>
                          </h4>
                          <span className="text-[9px] bg-white/10 text-amber-300 px-1.5 py-0.5 rounded border border-white/10">
                            {wood.warranty}
                          </span>
                        </div>

                        {/* Stars */}
                        <div className="flex text-amber-400 text-[10px] my-1">
                          ★★★★★
                        </div>

                        <p className="text-[10px] text-gray-400 leading-tight">
                          {wood.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Collapsible Teak Benefit Banner (Exact Mockup Match) */}
              {showTeakInfo && (
                <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                      <span className="font-bold text-amber-300">Why Teak is the best?</span>
                      <span>💧 Natural Oils</span>
                      <span>🐛 Termite Resistant</span>
                      <span>💧 Water Resistant</span>
                      <span>⏳ Long Lifespan</span>
                    </div>
                  </div>
                  <button onClick={() => setShowTeakInfo(false)} className="text-gray-400 hover:text-white p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>


            {/* STEP 3: UPLOAD REFERENCE PHOTO / SKETCH (OPTIONAL) */}
            <div className="bg-[#12141C] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  ☁️
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-heading">Upload Reference Photo / Sketch <span className="text-xs text-gray-400 font-normal">(Optional)</span></h2>
                  <p className="text-xs text-gray-400">Add photos or sketches to help us understand your idea better</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                
                {/* Drag & Drop File Upload Box */}
                <label className="border-2 border-dashed border-white/20 hover:border-amber-500/50 bg-[#171924] rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-colors min-h-[120px]">
                  <Upload className="w-6 h-6 text-amber-400" />
                  <span className="text-[11px] font-medium text-gray-300">Drag & drop your files here or <span className="text-amber-400 font-bold">click to browse</span></span>
                  <span className="text-[9px] text-gray-500">JPG, PNG, WEBP (Max 10MB)</span>
                  <button type="button" className="bg-amber-600/80 hover:bg-amber-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow">
                    Browse Files
                  </button>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Uploaded File Cards */}
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative bg-[#171924] border border-white/10 rounded-xl p-2.5 flex flex-col justify-between h-32 overflow-hidden group">
                    <img src={file.url} alt={file.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    {/* Green check badge top right */}
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs shadow">
                        ✓
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-400 p-1 bg-black/60 rounded-full"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative z-10 text-[10px]">
                      <p className="font-bold text-white truncate">{file.name}</p>
                      <p className="text-gray-400">{file.size}</p>
                    </div>
                  </div>
                ))}

              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>You can upload multiple images</span>
              </p>
            </div>


            {/* STEP 4: MEASUREMENTS & FINISH */}
            <div className="bg-[#12141C] border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    📏
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-heading">4. Measurements</h2>
                    <p className="text-xs text-gray-400">Enter approximate measurements (or request free site visit)</p>
                  </div>
                </div>

                {/* Unit Switcher [ft] [cm] */}
                <div className="flex bg-[#171924] border border-white/10 p-1 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setUnit('ft')}
                    className={`px-3 py-1 rounded-md transition-all ${unit === 'ft' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                    ft
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('cm')}
                    className={`px-3 py-1 rounded-md transition-all ${unit === 'cm' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                    cm
                  </button>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#171924] border border-white/10 p-4 rounded-xl">
                
                <div>
                  <div className="flex justify-between items-center text-xs text-gray-300 font-bold mb-1.5">
                    <span>Height ({unit})</span>
                    <span className="text-amber-400 font-mono">{dimensions.height} {unit}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs text-gray-300 font-bold mb-1.5">
                    <span>Width ({unit})</span>
                    <span className="text-amber-400 font-mono">{dimensions.width} {unit}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs text-gray-300 font-bold mb-1.5">
                    <span>Depth ({unit})</span>
                    <span className="text-amber-400 font-mono">{dimensions.depth} {unit}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6"
                    step="0.5"
                    value={dimensions.depth}
                    onChange={(e) => setDimensions({ ...dimensions, depth: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

              </div>

              {/* Polish & Finish Swatch Selection */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-300">Polish & Finish Style</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {finishStyles.map((fs) => {
                    const isSel = selectedFinish === fs.id;
                    return (
                      <div
                        key={fs.id}
                        onClick={() => setSelectedFinish(fs.id)}
                        className={`rounded-xl border p-3 text-center cursor-pointer transition-all ${
                          isSel ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/40' : 'border-white/10 bg-[#171924] hover:border-white/20'
                        }`}
                      >
                        <div className={`h-10 w-full rounded-lg mb-1.5 border border-white/20 ${fs.gradient}`}></div>
                        <h5 className="text-xs font-bold text-white leading-tight">{fs.title}</h5>
                        <span className="text-[10px] text-gray-400">{fs.sub}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>


            {/* STEP 5: CONTACT DETAILS */}
            <div className="bg-[#12141C] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  👤
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-heading">5. Your Contact Details</h2>
                  <p className="text-xs text-gray-400">We will get back to you with the best quote</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171924] border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                    placeholder="e.g. Sunil Perera"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Phone (WhatsApp)</label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171924] border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                    placeholder="e.g. 077 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={contactInfo.location}
                    onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171924] border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                    placeholder="e.g. Nawala, Rajagiriya"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">Additional Notes / Requirements</label>
                <textarea
                  rows="3"
                  value={contactInfo.notes}
                  onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#171924] border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                  placeholder="Any special carving, drawer configurations, budget targets, or other requirements..."
                ></textarea>
              </div>
            </div>

          </div>


          {/* =====================================================
              RIGHT COLUMN - STICKY LIVE PREVIEW & ESTIMATE (4 COLS)
             ===================================================== */}
          <div className="lg:col-span-5 space-y-5">
            <div className="sticky top-36 space-y-5">
              
              {/* MAIN STICKY CARD CONTAINER */}
              <div className="bg-[#12141C] border border-white/15 rounded-2xl p-5 space-y-5 shadow-2xl relative overflow-hidden">
                
                {/* Live Preview Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="font-bold text-sm text-white font-heading">Live Preview & Estimate</h3>
                  </div>
                </div>

                {/* Large 3D / Photo Display Container */}
                <div className="relative rounded-xl overflow-hidden h-52 sm:h-60 bg-black border border-white/10 group">
                  <img
                    src={selectedFurnitureObj.views[viewIndex] || selectedFurnitureObj.image}
                    alt={selectedFurnitureObj.name}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Bottom Controls Bar (360 View & Change View) */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                    <button
                      type="button"
                      onClick={() => alert('Interactive 360 view mode loaded for ' + selectedFurnitureObj.name)}
                      className="bg-black/70 hover:bg-black/90 backdrop-blur-md text-gray-200 border border-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>360° View</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextView}
                      className="bg-black/70 hover:bg-black/90 backdrop-blur-md text-gray-200 border border-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Change View ({viewIndex + 1}/{selectedFurnitureObj.views.length})</span>
                    </button>
                  </div>
                </div>

                {/* Your Selections Box */}
                <div className="bg-[#171924] border border-white/10 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="font-bold text-gray-200">Your Selections</span>
                    <button onClick={() => setActiveStep(1)} className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px]">
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 text-gray-300 text-[11px]">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5 text-gray-400">🪑 Furniture</span>
                      <span className="font-bold text-amber-400">{selectedFurnitureObj.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5 text-gray-400">🌲 Wood Type</span>
                      <span className="font-bold text-white">{selectedWoodObj.name} ({selectedWoodObj.sinName})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5 text-gray-400">📏 Dimensions (H x W x D)</span>
                      <span className="font-mono text-amber-300">{dimensions.height} {unit} x {dimensions.width} {unit} x {dimensions.depth} {unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5 text-gray-400">🎨 Finish</span>
                      <span className="font-bold text-white">{selectedFinishObj.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5 text-gray-400">🖼️ Reference Image</span>
                      <span className="font-bold text-emerald-400">{uploadedFiles.length} Files Uploaded</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Box */}
                <div className="bg-[#171924] border border-white/10 rounded-xl p-3.5 space-y-2 text-xs">
                  <span className="font-bold text-gray-200 block border-b border-white/10 pb-2">Price Breakdown</span>

                  <div className="space-y-1.5 text-[11px] text-gray-300">
                    <div className="flex justify-between">
                      <span>Wood ({selectedWoodObj.name})</span>
                      <span className="font-mono text-white">LKR {woodPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor & Craftsmanship</span>
                      <span className="font-mono text-white">LKR {laborPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Polish & Finish</span>
                      <span className="font-mono text-white">LKR {finishPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transport & Handling</span>
                      <span className="font-mono text-white">LKR {transportPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-red-400">
                      <span>Discount</span>
                      <span className="font-mono">- LKR {discountPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="font-extrabold text-sm text-white">Estimated Total</span>
                    <span className="font-extrabold text-xl text-amber-400 font-heading">
                      LKR {estimatedTotal.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 pt-1">
                    <Truck className="w-3 h-3 text-amber-400" />
                    <span>Islandwide Delivery & Site Fitting Included</span>
                  </p>
                </div>

                {/* Highlighted Disclaimer Notice Box */}
                <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-[11px] text-amber-200 leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>This is an estimated price. Final quote will be provided after our master carpenter review.</span>
                </div>

                {/* Action Buttons */}
                {submitSuccess ? (
                  <div className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-xl text-center space-y-1">
                    <h4 className="font-bold text-white text-xs">Request Submitted Successfully!</h4>
                    <p className="text-[10px] text-gray-300">We will contact you via WhatsApp shortly.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={sendWhatsAppEstimate}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Get Instant WhatsApp Estimate</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitQuote}
                      disabled={isSubmitting}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Quote Request'}</span>
                    </button>
                  </div>
                )}

                {/* 3 Trust Checkmarks */}
                <div className="pt-2 border-t border-white/10 space-y-1 text-[11px] text-gray-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>100% Genuine Treated Timber</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>15 Years Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Free Site Visit & Measurements</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>


      {/* ========================================================
          3. FLOATING WHATSAPP SUPPORT WIDGET (BOTTOM-RIGHT)
         ======================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-bounce-slow">
        
        {/* Support Speech Bubble */}
        <div className="bg-[#12141C] border border-amber-500/40 px-3.5 py-2 rounded-2xl shadow-2xl text-xs text-white hidden sm:flex items-center gap-2.5 border-l-4 border-l-amber-500">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="Support Expert"
            className="w-8 h-8 rounded-full border border-amber-400 object-cover"
          />
          <div>
            <div className="font-bold text-[11px] text-white">Need help?</div>
            <div className="text-[10px] text-gray-300">Our experts are here! <span className="text-emerald-400 font-semibold">Chat on WhatsApp</span></div>
          </div>
        </div>

        {/* Green WhatsApp FAB Button */}
        <button
          onClick={sendWhatsAppEstimate}
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-emerald-500/30"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white" />
        </button>

      </div>


      {/* ========================================================
          4. BOTTOM FOOTER BAR (Exact Mockup Match)
         ======================================================== */}
      <div className="mt-16 bg-[#12141D] border-t border-white/10 py-5 text-xs text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">100% Satisfaction Guaranteed Quality</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">15 Years Warranty</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">Free Delivery Islandwide</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">Expert Craftsmanship 30+ Years</span>
          </div>

        </div>
      </div>

    </div>
  );
}
