import React, { useState } from 'react';
import { RotateCw, Upload, Trash2, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function CustomOrderPage({ setActiveTab }) {
  // Form State
  const [selectedFurniture, setSelectedFurniture] = useState('dining');
  const [length, setLength] = useState(160);
  const [width, setWidth] = useState(90);
  const [height, setHeight] = useState(75);
  const [woodType, setWoodType] = useState('teak');
  const [finish, setFinish] = useState('natural');
  const [rotation, setRotation] = useState(0);

  // Uploaded files state
  const [uploads, setUploads] = useState([
    { id: 1, name: 'custom_table.jpg', url: '/banner_crafts/card_dining.jpg' },
    { id: 2, name: 'room_idea.jpg', url: '/banner_crafts/card_furniture.jpg' }
  ]);

  const furnitureOptions = [
    { id: 'dining', name: 'Dining Table', basePrice: 65000, img: '/banner_crafts/card_dining.jpg' },
    { id: 'bed', name: 'Bed Set', basePrice: 85000, img: '/banner_crafts/card_bedroom.jpg' },
    { id: 'wardrobe', name: 'Wardrobe / Cupboard', basePrice: 55000, img: '/banner_crafts/card_furniture.jpg' },
    { id: 'door', name: 'Wooden Door', basePrice: 30000, img: '/banner_crafts/door_main.jpg' },
    { id: 'office', name: 'Office Table', basePrice: 32000, img: '/banner_crafts/staircase_main.jpg' }
  ];

  const woodOptions = [
    { id: 'teak', name: 'Teak Wood (තේක්ක)', multiplier: 1.4 },
    { id: 'mahogany', name: 'Mahogany (මහෝගනි)', multiplier: 1.15 },
    { id: 'jackwood', name: 'Jackwood (කොස්)', multiplier: 1.1 },
    { id: 'satinwood', name: 'Satinwood (බුරුත)', multiplier: 1.35 },
    { id: 'rubberwood', name: 'Rubberwood (රබර්)', multiplier: 0.9 }
  ];

  const finishOptions = [
    { id: 'natural', name: 'Natural Polish' },
    { id: 'matte', name: 'Matte Finish' },
    { id: 'gloss', name: 'Gloss Finish' },
    { id: 'teak_stain', name: 'Teak Stain' },
    { id: 'walnut', name: 'Dark Walnut' }
  ];

  // Dynamic Price Calculation
  const currentFurniture = furnitureOptions.find(f => f.id === selectedFurniture) || furnitureOptions[0];
  const currentWood = woodOptions.find(w => w.id === woodType) || woodOptions[0];
  const volumeFactor = (length * width * height) / (160 * 90 * 75);
  const estimatedPrice = Math.round(currentFurniture.basePrice * currentWood.multiplier * (0.8 + 0.2 * volumeFactor));

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

  const handleAddToInquiry = () => {
    const inquiryData = {
      furniture: currentFurniture.name,
      dimensions: `${length} x ${width} x ${height} cm`,
      wood: currentWood.name,
      finish: finishOptions.find(f => f.id === finish)?.name,
      estimatedPrice: `Rs. ${estimatedPrice.toLocaleString()}`
    };
    setActiveTab('contact');
  };

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Page Header */}
        <div className="border-b border-[#E8DEC8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">Custom Furniture Order</h1>
          <p className="text-xs sm:text-sm text-[#7A6252] mt-1 font-medium">Design your dream furniture in 3D & get instant price estimates</p>
        </div>

        {/* Main 3-Column Grid Matching Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================
              LEFT COLUMN: CONTROL PANEL (4 Cols)
             ======================================================== */}
          <div className="lg:col-span-4 bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-5">
            
            {/* 1. Select Furniture */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2B190E] uppercase tracking-wider">1. Select Furniture</label>
              <select
                value={selectedFurniture}
                onChange={(e) => setSelectedFurniture(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs font-bold text-[#2B190E] outline-none focus:border-[#8B5E3C]"
              >
                {furnitureOptions.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* 2. Dimensions (cm) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2B190E] uppercase tracking-wider">2. Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="block text-[10px] text-[#7A6252] font-semibold mb-1">Length</span>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF4EB] border border-[#E8DEC8] rounded-lg text-xs font-bold text-center text-[#2B190E] outline-none"
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-[#7A6252] font-semibold mb-1">Width</span>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF4EB] border border-[#E8DEC8] rounded-lg text-xs font-bold text-center text-[#2B190E] outline-none"
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-[#7A6252] font-semibold mb-1">Height</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#FAF4EB] border border-[#E8DEC8] rounded-lg text-xs font-bold text-center text-[#2B190E] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Wood Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2B190E] uppercase tracking-wider">3. Wood Type</label>
              <select
                value={woodType}
                onChange={(e) => setWoodType(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs font-bold text-[#2B190E] outline-none focus:border-[#8B5E3C]"
              >
                {woodOptions.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>

            {/* 4. Finish */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2B190E] uppercase tracking-wider">4. Finish</label>
              <select
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs font-bold text-[#2B190E] outline-none focus:border-[#8B5E3C]"
              >
                {finishOptions.map(fo => (
                  <option key={fo.id} value={fo.id}>{fo.name}</option>
                ))}
              </select>
            </div>

            {/* 5. Estimated Price & Button */}
            <div className="pt-3 border-t border-[#E8DEC8] space-y-3">
              <span className="block text-[11px] font-bold text-[#7A6252] uppercase tracking-wider">5. Estimated Price</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#8B5E3C] font-heading">
                Rs. {estimatedPrice.toLocaleString()}
              </div>

              <button
                onClick={handleAddToInquiry}
                className="w-full bg-[#8B5E3C] hover:bg-[#734A2E] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Add to Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>


          {/* ========================================================
              CENTER COLUMN: 3D VIEWER CANVAS & CONTROLS (5 Cols)
             ======================================================== */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 3D Canvas Box */}
            <div className="relative bg-[#FAF4EB] border border-[#E8DEC8] rounded-2xl h-80 sm:h-96 flex flex-col items-center justify-center p-4 overflow-hidden shadow-sm">
              
              {/* Top-Right 360° Badge */}
              <div className="absolute top-3 right-3 bg-[#3D2415] text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1 shadow">
                <RotateCw className="w-3 h-3" />
                <span>360°</span>
              </div>

              {/* 3D Model Display / Image with Rotation */}
              <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-300"
                style={{ transform: `rotateY(${rotation}deg)` }}
              >
                <img
                  src={currentFurniture.img}
                  alt={currentFurniture.name}
                  className="max-h-64 sm:max-h-72 object-contain drop-shadow-2xl"
                />
              </div>

              {/* Rotation / Control Bar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-[#E8DEC8] px-3 py-1.5 rounded-full flex items-center gap-2 shadow text-xs">
                <button 
                  onClick={() => setRotation(r => r - 45)}
                  className="p-1 text-[#2B190E] hover:text-[#8B5E3C]"
                  title="Rotate Left"
                >
                  ↺
                </button>
                <button 
                  onClick={() => setRotation(0)}
                  className="px-2 font-bold text-[11px] text-[#2B190E]"
                >
                  Reset View
                </button>
                <button 
                  onClick={() => setRotation(r => r + 45)}
                  className="p-1 text-[#2B190E] hover:text-[#8B5E3C]"
                  title="Rotate Right"
                >
                  ↻
                </button>
              </div>

            </div>

            {/* Thumbnail selector row below 3D Viewer */}
            <div className="grid grid-cols-4 gap-2">
              {furnitureOptions.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFurniture(f.id)}
                  className={`h-16 rounded-xl border overflow-hidden cursor-pointer transition-all ${
                    selectedFurniture === f.id ? 'border-[#8B5E3C] ring-2 ring-[#8B5E3C]/30' : 'border-[#E8DEC8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

          </div>


          {/* ========================================================
              RIGHT COLUMN: UPLOAD REFERENCE IMAGES (3 Cols)
             ======================================================== */}
          <div className="lg:col-span-3 bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-4">
            
            <div>
              <h3 className="font-bold text-xs text-[#2B190E] uppercase tracking-wider">Upload Reference</h3>
              <p className="text-[11px] text-[#7A6252] mt-0.5">Share your drawing or idea photo</p>
            </div>

            {/* File Upload Button */}
            <label className="border-2 border-dashed border-[#E8DEC8] hover:border-[#8B5E3C] bg-[#FAF4EB] rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-[#8B5E3C]" />
              <span className="text-xs font-bold text-[#8B5E3C]">Upload Image</span>
              <span className="text-[9px] text-[#7A6252]">JPG, PNG up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Recent Uploads Grid */}
            <div className="space-y-2 pt-2 border-t border-[#E8DEC8]">
              <span className="block text-[11px] font-bold text-[#7A6252]">Recent Uploads</span>
              <div className="grid grid-cols-2 gap-2">
                {uploads.map((u) => (
                  <div key={u.id} className="relative h-20 rounded-xl overflow-hidden border border-[#E8DEC8] group">
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
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
