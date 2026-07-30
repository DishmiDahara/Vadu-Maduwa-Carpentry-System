import React, { useState } from 'react';
import { 
  Hammer, 
  Upload, 
  Ruler, 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  Calculator,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export default function CustomOrderPage({ setActiveTab }) {
  const { t } = useLanguage();

  // Form State
  const [furnitureType, setFurnitureType] = useState('bed');
  const [timber, setTimber] = useState('teak');
  const [finish, setFinish] = useState('pu_matte');
  const [dimensions, setDimensions] = useState({ height: '', width: '', depth: '', unit: 'feet' });
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '', location: '', notes: '' });
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Furniture Categories with base prices
  const categories = [
    { id: 'door_main', name: 'Main Entrance Door (ප්‍රධාන දොර)', basePrice: 95000, icon: '🚪' },
    { id: 'bed', name: 'Bed Frame (නිදන ඇඳ)', basePrice: 135000, icon: '🛏️' },
    { id: 'dining', name: 'Dining Table Set (කෑම මේස කට්ටලය)', basePrice: 165000, icon: '🍽️' },
    { id: 'pantry', name: 'Modular Pantry Kitchen (පැන්ට්‍රි කබඩ්)', basePrice: 220000, icon: '🍳' },
    { id: 'wardrobe', name: 'Wardrobe / Closet (අල්මාරිය)', basePrice: 180000, icon: '🚪' },
    { id: 'staircase', name: 'Staircase & Railing (ලී පඩිපෙළ)', basePrice: 250000, icon: '🪜' },
    { id: 'sofa', name: 'Wooden Sofa Set (සෝෆා කට්ටලය)', basePrice: 140000, icon: '🛋️' },
    { id: 'custom_other', name: 'Custom Idea / Special Design (වෙනත් Idea)', basePrice: 100000, icon: '✨' }
  ];

  // Timber multiplier & Warranty data
  const timberOptions = [
    { id: 'teak', name: t('teakWood'), multiplier: 1.25, warranty: '15 Years', desc: '100% Genuine Treated Grade-A Teak' },
    { id: 'mahogany', name: t('mahoganyWood'), multiplier: 1.0, warranty: '10 Years', desc: 'Kiln-Dried Rich Red Mahogany' },
    { id: 'nadun', name: t('nadunWood'), multiplier: 1.15, warranty: '12 Years', desc: 'Premium Density Sri Lankan Nadun' },
    { id: 'jackwood', name: t('jackWood'), multiplier: 1.10, warranty: '15 Years', desc: 'Traditional Termite-Resistant Kos Timber' },
    { id: 'kumbuk', name: t('kumbukWood'), multiplier: 1.05, warranty: '10 Years', desc: 'Heavy Solid Kumbuk Wood' }
  ];

  // Finish Options
  const finishOptions = [
    { id: 'pu_matte', name: 'Matte Polyurethane (PU) Lacquer', desc: 'Smooth modern touch, water-resistant' },
    { id: 'gloss', name: 'High Gloss Varnish Finish', desc: 'Shiny luxurious wooden sheen' },
    { id: 'natural', name: 'Natural Teak Oil Polish', desc: 'Preserves raw timber texture & aroma' },
    { id: 'walnut_stain', name: 'Dark Walnut Stain Finish', desc: 'Deep elegant dark timber tone' }
  ];

  // Image Upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic Price Estimator Logic
  const selectedCategory = categories.find(c => c.id === furnitureType) || categories[0];
  const selectedTimber = timberOptions.find(t => t.id === timber) || timberOptions[0];

  const basePrice = selectedCategory.basePrice * selectedTimber.multiplier;
  const estimatedMin = Math.round(basePrice * 0.9 / 500) * 500;
  const estimatedMax = Math.round(basePrice * 1.2 / 500) * 500;

  // Build WhatsApp pre-filled text
  const generateWhatsAppMessage = () => {
    const text = `Hi වඩු මඩුව (Vadu Maduwa), I would like a custom quote for a custom order idea:

📌 *Furniture Type*: ${selectedCategory.name}
🪵 *Timber Selected*: ${selectedTimber.name} (${selectedTimber.warranty} Warranty)
🎨 *Finish*: ${finishOptions.find(f => f.id === finish)?.name}
📐 *Dimensions*: ${dimensions.height || 'Custom'} H x ${dimensions.width || 'Custom'} W x ${dimensions.depth || 'Custom'} D (${dimensions.unit})
📍 *Customer Name*: ${customerInfo.name || 'Customer'}
📞 *Phone*: ${customerInfo.phone || 'N/A'}
📍 *Location*: ${customerInfo.location || 'N/A'}
💬 *Custom Notes*: ${customerInfo.notes || 'Based on my uploaded idea/sketch'}

💡 *Estimated Price Guideline*: LKR ${estimatedMin.toLocaleString()} - LKR ${estimatedMax.toLocaleString()} (Subject to negotiation after measurement)`;
    return encodeURIComponent(text);
  };

  const handleWhatsAppSend = () => {
    const encoded = generateWhatsAppMessage();
    window.open(`https://wa.me/94773769849?text=${encoded}`, '_blank');
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Please provide your Name and Phone number.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        message: `[CUSTOM ORDER IDEA]
Furniture: ${selectedCategory.name}
Timber: ${selectedTimber.name}
Finish: ${finish}
Dimensions: ${dimensions.height}x${dimensions.width}x${dimensions.depth} ${dimensions.unit}
Location: ${customerInfo.location}
Estimated Range: LKR ${estimatedMin.toLocaleString()} - LKR ${estimatedMax.toLocaleString()}
Notes: ${customerInfo.notes}`,
        referenceImageUrl: imagePreview ? 'Uploaded Reference Image Attached' : ''
      };

      await api.createInquiry(payload);
      setSubmittedSuccess(true);
    } catch (err) {
      alert('Failed to submit order request. You can send it directly via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0C0E] text-white font-sans min-h-screen py-8 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER & HERO */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Customer Custom Order Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {t('customIdeaHeroTitle')}
          </h1>

          <p className="text-gray-300 text-xs sm:text-base leading-relaxed">
            {t('customIdeaHeroSub')}
          </p>
        </div>

        {/* WORKFLOW MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT FORM COLUMN (8 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: SELECT FURNITURE CATEGORY */}
            <div className="bg-[#14161D] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Select Furniture Category</h3>
                  <p className="text-xs text-gray-400">Choose what you want us to craft</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFurnitureType(cat.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all cursor-pointer ${
                      furnitureType === cat.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/50'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-bold leading-tight line-clamp-2">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: SELECT TIMBER & WOOD SPECIES */}
            <div className="bg-[#14161D] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{t('selectWoodType')}</h3>
                    <p className="text-xs text-gray-400">100% Genuine Sri Lankan Seasoned Wood</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">
                  Full Warranty
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {timberOptions.map((tOpt) => (
                  <button
                    key={tOpt.id}
                    type="button"
                    onClick={() => setTimber(tOpt.id)}
                    className={`p-4 rounded-2xl border text-left space-y-1 transition-all cursor-pointer ${
                      timber === tOpt.id
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{tOpt.name}</span>
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                        {tOpt.warranty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{tOpt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: UPLOAD REFERENCE IMAGE / SKETCH */}
            <div className="bg-[#14161D] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{t('uploadSketchPhoto')}</h3>
                  <p className="text-xs text-gray-400">Pinterest photo, Google image or hand drawing</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <label className="border-2 border-dashed border-white/20 hover:border-amber-500/50 bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                  <Upload className="w-8 h-8 text-amber-400" />
                  <span className="text-xs font-bold text-gray-200">Click to Select Image File</span>
                  <span className="text-[10px] text-gray-400">PNG, JPG, WEBP (Max 10MB)</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/50 h-36 bg-black">
                    <img src={imagePreview} alt="Reference Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setReferenceImage(null); }}
                      className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center space-y-2">
                    <ImageIcon className="w-6 h-6 text-gray-500 mx-auto" />
                    <p className="text-xs text-gray-400">No image selected yet. You can also send the image directly on WhatsApp after generating quote.</p>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 4: DIMENSIONS & SPECIFICATIONS */}
            <div className="bg-[#14161D] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{t('selectDimensions')}</h3>
                  <p className="text-xs text-gray-400">Approximate measurements (Or request free site visit)</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Height (උස)</label>
                  <input
                    type="number"
                    placeholder="e.g. 6.5"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Width (පළල)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4.0"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Depth / Length</label>
                  <input
                    type="number"
                    placeholder="e.g. 2.0"
                    value={dimensions.depth}
                    onChange={(e) => setDimensions({ ...dimensions, depth: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold text-gray-300 mb-1">Polish & Finish Style</label>
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1A1D24] border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs cursor-pointer"
                >
                  {finishOptions.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} - {f.desc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* STEP 5: YOUR CONTACT DETAILS */}
            <div className="bg-[#14161D] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your Contact Details</h3>
                  <p className="text-xs text-gray-400">Where should our master carpenter contact you?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Perera"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 077 123 4567"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">Location / Town (e.g. Nugegoda / Kalutara)</label>
                <input
                  type="text"
                  placeholder="e.g. Nawala, Rajagiriya"
                  value={customerInfo.location}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1">Additional Design Notes / Requirements</label>
                <textarea
                  rows="3"
                  placeholder="Mention any special carving details, drawer configurations, or budget targets..."
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-amber-400 text-xs"
                ></textarea>
              </div>
            </div>

          </div>


          {/* RIGHT ESTIMATOR & ACTION SUMMARY (5 COLS STICKY) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              
              {/* PRICE ESTIMATOR CARD */}
              <div className="bg-[#181A22] border-2 border-amber-500/50 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
                
                {/* Gold Glow Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Calculator className="w-5 h-5" />
                    <h3 className="font-bold text-base font-heading text-white">{t('estimatedCostRange')}</h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
                    Live Calculator
                  </span>
                </div>

                {/* Selected Item Summary Pill */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <span>Category:</span>
                    <span className="font-bold text-white">{selectedCategory.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <span>Timber Spec:</span>
                    <span className="font-bold text-amber-400">{selectedTimber.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-300">
                    <span>Warranty:</span>
                    <span className="font-bold text-emerald-400">{selectedTimber.warranty}</span>
                  </div>
                </div>

                {/* Price Range Display */}
                <div className="text-center bg-gradient-to-b from-amber-950/40 to-black/40 border border-amber-500/30 p-5 rounded-2xl space-y-1">
                  <span className="text-xs text-amber-300 uppercase tracking-widest font-bold">Estimated Cost Guideline</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading tracking-tight">
                    LKR {estimatedMin.toLocaleString()} - {estimatedMax.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Islandwide Delivery & Site Fitting Included</p>
                </div>

                {/* ⚠️ HIGHLIGHTED DISCLAIMER BOX (CRITICAL REQUIREMENT) */}
                <div className="bg-amber-900/30 border-2 border-amber-500/70 p-4 rounded-2xl space-y-2 text-amber-200">
                  <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>මිල ගණන් පිළිබඳ විශේෂ දැනුම්දීම!</span>
                  </div>
                  <p className="text-xs leading-relaxed font-normal text-amber-100/90">
                    {t('estimateDisclaimer')}
                  </p>
                </div>

                {/* DUAL SUBMISSION BUTTONS */}
                {submittedSuccess ? (
                  <div className="bg-emerald-950/60 border border-emerald-500/50 p-5 rounded-2xl text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-white">Custom Order Request Sent!</h4>
                    <p className="text-xs text-gray-300">Our master carpenter will contact you shortly to confirm design measurements.</p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    
                    {/* Instant WhatsApp Button */}
                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-xl hover:shadow-emerald-950/50 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5 fill-white/20" />
                      <span>{t('sendWhatsAppQuote')}</span>
                    </button>

                    {/* Backend Inquiry Ticket Button */}
                    <button
                      type="button"
                      onClick={handleSubmitInquiry}
                      disabled={loading}
                      className="w-full bg-[#B87A46] hover:bg-[#a06838] text-white py-3.5 px-4 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? t('submitting') : t('submitCustomOrder')}</span>
                    </button>

                  </div>
                )}

              </div>

              {/* SITE TRUST BADGES */}
              <div className="bg-[#14161D] border border-white/10 rounded-2xl p-4 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% Genuine Treated Timber - Zero MDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Free Site Visit & Measurements Islandwide</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
