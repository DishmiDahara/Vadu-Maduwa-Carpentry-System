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
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function CustomOrderPage({ setActiveTab }) {
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

  // Modals / Selection Drawers
  const [activeModal, setActiveModal] = useState(null); // 'furniture', 'wood', 'finish', 'dimensions', 'breakdown', 'howItWorks'

  // Uploaded Reference Images
  const [uploads, setUploads] = useState([
    { id: 1, name: 'sketch_1.jpg', url: '/banner_crafts/card_dining.jpg' },
    { id: 2, name: 'room_idea.jpg', url: '/banner_crafts/card_furniture.jpg' },
    { id: 3, name: '3d_render.png', url: '/banner_crafts/card_bedroom.jpg' }
  ]);

  // Options Catalog Data
  const furnitureOptions = [
    { id: 'dining', name: 'Dining Table', icon: '🪑', basePrice: 65000, img: '/dining_table.png' },
    { id: 'bed', name: 'Bed Set', icon: '🛏️', basePrice: 85000, img: '/wooden_bed.png' },
    { id: 'wardrobe', name: 'Wardrobe / Closet', icon: '🚪', basePrice: 55000, img: '/wooden_wardrobe.png' },
    { id: 'door', name: 'Teak Wooden Door', icon: '🚪', basePrice: 30000, img: '/teak_door.png' },
    { id: 'office', name: 'Executive Office Table', icon: '🪑', basePrice: 32000, img: '/hero_armchair.png' }
  ];

  const woodOptions = [
    { id: 'teak', name: 'Teak Wood (තේක්ක)', multiplier: 1.4, desc: 'Water Resistant & Premium Hardwood' },
    { id: 'mahogany', name: 'Mahogany (මහෝගනි)', multiplier: 1.15, desc: 'Rich Red Finish & Termite Proof' },
    { id: 'jackwood', name: 'Jackwood (කොස්)', multiplier: 1.1, desc: 'Traditional Yellow Wood' },
    { id: 'satinwood', name: 'Satinwood (බුරුත)', multiplier: 1.35, desc: 'Ultra Dense Heavy Hardwood' },
    { id: 'rubberwood', name: 'Rubberwood (රබර්)', multiplier: 0.9, desc: 'Budget Friendly Light Wood' }
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

  const handleSubmitOrder = () => {
    setActiveTab('contact');
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B190E] min-h-screen pb-24 sm:pb-16 pt-4 font-sans selection:bg-[#8B5E3C] selection:text-white">
      <div className="max-w-4xl mx-auto px-4 space-y-5">

        {/* ========================================================
            1. TOP HEADER & HOW IT WORKS BUTTON (Matching Mobile Mockup)
           ======================================================== */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#2B190E]">Custom Furniture Order</h1>
            <p className="text-xs text-[#7A6252] mt-0.5 font-medium">Design your dream furniture in 3D <br className="sm:hidden"/>& get instant price estimate</p>
          </div>

          <button
            onClick={() => setActiveModal('howItWorks')}
            className="flex items-center gap-1.5 bg-white border border-[#E8DEC8] text-[#2B190E] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-[#FAF4EB] transition-colors shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>How it works</span>
          </button>
        </div>

        {/* ========================================================
            2. STEPPER PROGRESS BAR (1. Customize -> 2. Preview -> 3. Review)
           ======================================================== */}
        <div className="flex items-center justify-center gap-4 sm:gap-12 py-2 border-y border-[#E8DEC8]/60 text-xs font-bold">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#23160D] text-white flex items-center justify-center text-xs font-black shadow">
              1
            </div>
            <span className="text-[#23160D]">Customize</span>
          </div>

          <div className="w-8 sm:w-16 h-[1px] bg-[#E8DEC8]"></div>

          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-[#E8DEC8] text-[#7A6252] flex items-center justify-center text-xs font-black">
              2
            </div>
            <span className="text-[#7A6252]">Preview</span>
          </div>

          <div className="w-8 sm:w-16 h-[1px] bg-[#E8DEC8]"></div>

          <div className="flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-[#E8DEC8] text-[#7A6252] flex items-center justify-center text-xs font-black">
              3
            </div>
            <span className="text-[#7A6252]">Review</span>
          </div>

        </div>

        {/* ========================================================
            3. 3D INTERACTIVE HERO VIEWER CARD (Mobile Screen Spec)
           ======================================================== */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#3D2415] bg-[#1A1009] min-h-[300px] sm:min-h-[380px] flex flex-col justify-between p-4 group">
          
          {/* Main 3D Model Image */}
          <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url('${previewImages[activeThumb]}')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

          {/* Top Control Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="bg-black/60 backdrop-blur-md text-amber-300 border border-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
              <RotateCw className="w-3.5 h-3.5" />
              <span>360°</span>
            </div>

            <button 
              onClick={() => alert('Full screen 3D viewer opened')}
              className="bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-black transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Center Drag Pill */}
          <div className="relative z-10 self-center bg-black/60 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow pointer-events-none">
            <span>👆</span>
            <span>Drag to rotate</span>
          </div>

          {/* Bottom Thumbnail Strip */}
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

        {/* ========================================================
            4. DARK CUSTOMIZATION SUMMARY CARD (Exact Mockup Match)
           ======================================================== */}
        <div className="bg-[#23160D] text-amber-100/90 border border-[#3D2415] rounded-3xl p-5 shadow-md space-y-4">
          
          {/* Item 1: Furniture Type */}
          <div className="flex items-center justify-between pb-3 border-b border-[#3D2415]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3D2415] text-amber-300 flex items-center justify-center text-lg shrink-0">
                🪑
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">Furniture Type</span>
                <span className="text-sm font-bold text-white">{currentFurniture.name}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('furniture')}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors"
            >
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item 2: Wood Type */}
          <div className="flex items-center justify-between pb-3 border-b border-[#3D2415]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3D2415] text-amber-300 flex items-center justify-center text-lg shrink-0">
                🪵
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">Wood Type</span>
                <span className="text-sm font-bold text-white">{currentWood.name}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('wood')}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors"
            >
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item 3: Finish */}
          <div className="flex items-center justify-between pb-3 border-b border-[#3D2415]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3D2415] text-amber-300 flex items-center justify-center text-lg shrink-0">
                🫙
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">Finish</span>
                <span className="text-sm font-bold text-white">{currentFinish.name}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('finish')}
              className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#3D2415]/60 hover:bg-[#3D2415] transition-colors"
            >
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item 4: Dimensions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3D2415] text-amber-300 flex items-center justify-center text-lg shrink-0">
                📐
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-300/70 block uppercase tracking-wider">Dimensions (cm)</span>
                <span className="text-sm font-bold text-white">{length} (L) x {width} (W) x {height} (H)</span>
              </div>
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

        {/* ========================================================
            5. ESTIMATED PRICE CARD (With "Submit Order" Button)
           ======================================================== */}
        <div className="bg-white border border-[#E8DEC8] rounded-3xl p-5 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-[#7A6252] uppercase tracking-wider">Estimated Price</span>
              <Info className="w-3.5 h-3.5 text-[#7A6252] cursor-pointer" onClick={() => setActiveModal('breakdown')} />
            </div>

            {/* Percentage change green badge matching mockup */}
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 12% from last selection</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-black text-[#2B190E] font-heading">
                Rs. {estimatedPrice.toLocaleString()}
              </div>
              <button 
                onClick={() => setActiveModal('breakdown')}
                className="text-xs font-bold text-[#8B5E3C] hover:underline flex items-center gap-1 mt-1"
              >
                <span>View Price Breakdown</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </button>
            </div>

            {/* Main Action Button (Text changed to "Submit Order" as requested!) */}
            <button
              onClick={handleSubmitOrder}
              className="w-full sm:w-auto bg-[#23160D] hover:bg-[#3D2415] text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <span>Submit Order</span>
              <MessageSquare className="w-4 h-4 text-amber-300" />
            </button>
          </div>

        </div>

        {/* ========================================================
            6. UPLOAD REFERENCE (OPTIONAL) SECTION
           ======================================================== */}
        <div className="bg-white border border-[#E8DEC8] rounded-3xl p-5 shadow-sm space-y-4">
          
          <div>
            <h3 className="font-bold text-sm text-[#2B190E]">Upload Reference <span className="text-xs font-normal text-[#7A6252]">(Optional)</span></h3>
            <p className="text-xs text-[#7A6252] mt-0.5">Share your drawing or idea photo</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Thumbnail Preview Stack (7 Cols) */}
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

              {/* +3 Counter Badge matching mockup */}
              {uploads.length > 2 && (
                <div className="w-20 h-20 rounded-2xl bg-[#23160D] text-white font-black text-sm flex items-center justify-center border border-[#3D2415] shrink-0 shadow">
                  +{uploads.length - 2}
                </div>
              )}
            </div>

            {/* Dotted Upload Dropzone Box (5 Cols) */}
            <label className="sm:col-span-5 border-2 border-dashed border-[#E8DEC8] hover:border-[#8B5E3C] bg-[#FAF4EB] rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-[#8B5E3C]" />
              <span className="text-xs font-bold text-[#2B190E]">Upload Image</span>
              <span className="text-[10px] text-[#7A6252]">JPG, PNG or PDF (Max 10MB)</span>
              <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
            </label>

          </div>

        </div>

      </div>

      {/* ========================================================
          7. MODAL DRAWERS FOR "CHANGE >" BUTTONS
         ======================================================== */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#E8DEC8]" onClick={e => e.stopPropagation()}>
            
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-bold text-base text-[#2B190E] capitalize">
                {activeModal === 'furniture' && 'Select Furniture Type'}
                {activeModal === 'wood' && 'Select Wood Species'}
                {activeModal === 'finish' && 'Select Finish & Polish'}
                {activeModal === 'dimensions' && 'Adjust Dimensions (cm)'}
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
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedFurniture === f.id ? 'border-[#8B5E3C] bg-[#FAF4EB] font-bold' : 'border-[#E8DEC8] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{f.icon}</span>
                      <span className="text-xs text-[#2B190E]">{f.name}</span>
                    </div>
                    {selectedFurniture === f.id && <span className="text-xs text-[#8B5E3C] font-bold">✓ Selected</span>}
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
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      woodType === w.id ? 'border-[#8B5E3C] bg-[#FAF4EB] font-bold' : 'border-[#E8DEC8] hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs text-[#2B190E]">{w.name}</h4>
                      <p className="text-[10px] text-[#7A6252]">{w.desc}</p>
                    </div>
                    {woodType === w.id && <span className="text-xs text-[#8B5E3C] font-bold">✓ Selected</span>}
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
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      finish === fo.id ? 'border-[#8B5E3C] bg-[#FAF4EB] font-bold' : 'border-[#E8DEC8] hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs text-[#2B190E]">{fo.name}</h4>
                      <p className="text-[10px] text-[#7A6252]">{fo.desc}</p>
                    </div>
                    {finish === fo.id && <span className="text-xs text-[#8B5E3C] font-bold">✓ Selected</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Dimensions Drawer */}
            {activeModal === 'dimensions' && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#2B190E] mb-1">
                    <span>Length (cm)</span>
                    <span className="text-[#8B5E3C]">{length} cm</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="300"
                    value={length}
                    onChange={e => setLength(Number(e.target.value))}
                    className="w-full accent-[#8B5E3C]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#2B190E] mb-1">
                    <span>Width (cm)</span>
                    <span className="text-[#8B5E3C]">{width} cm</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={width}
                    onChange={e => setWidth(Number(e.target.value))}
                    className="w-full accent-[#8B5E3C]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#2B190E] mb-1">
                    <span>Height (cm)</span>
                    <span className="text-[#8B5E3C]">{height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={height}
                    onChange={e => setHeight(Number(e.target.value))}
                    className="w-full accent-[#8B5E3C]"
                  />
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-[#23160D] text-white py-2.5 rounded-xl font-bold text-xs"
                >
                  Apply Dimensions
                </button>
              </div>
            )}

            {/* Price Breakdown Drawer */}
            {activeModal === 'breakdown' && (
              <div className="space-y-2 text-xs text-[#2B190E]">
                <div className="flex justify-between py-1.5 border-b border-[#E8DEC8]">
                  <span>Base Item ({currentFurniture.name}):</span>
                  <span className="font-bold">Rs. {currentFurniture.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E8DEC8]">
                  <span>Timber ({currentWood.name}):</span>
                  <span className="font-bold">x{currentWood.multiplier}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#E8DEC8]">
                  <span>Dimension Volume Factor:</span>
                  <span className="font-bold">{length}x{width}x{height} cm</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-black border-t border-[#2B190E]">
                  <span>Estimated Total:</span>
                  <span className="text-[#8B5E3C]">Rs. {estimatedPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* How it Works Drawer */}
            {activeModal === 'howItWorks' && (
              <div className="space-y-3 text-xs text-[#5C4535] leading-relaxed">
                <p><strong>1. Customize:</strong> Select your furniture item, hardwood species, polish finish and exact dimensions.</p>
                <p><strong>2. Preview:</strong> Inspect the 3D model, rotate 360°, and view thumbnail variations.</p>
                <p><strong>3. Review & Submit:</strong> Get an instant estimated quote and submit your order directly to our master carpenters.</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
