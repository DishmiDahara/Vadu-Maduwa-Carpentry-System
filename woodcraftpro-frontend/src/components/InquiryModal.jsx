import React, { useState } from 'react';
import { X, Send, CheckCircle, Hammer } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function InquiryModal({ isOpen, onClose, selectedProduct }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    message: selectedProduct ? `I am interested in getting a quotation for "${selectedProduct.productName}". Please contact me with details.` : ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createInquiry(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ customerName: '', customerPhone: '', customerEmail: '', message: '' });
      }, 2000);
    } catch (err) {
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C1F26] to-[#2D3238] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C68B59] flex items-center justify-center text-white">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading">{t('submitInquiry')}</h3>
              <p className="text-xs text-gray-300">{t('brandName')} {t('brandTag')}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Inquiry Sent Successfully!</h4>
              <p className="text-sm text-gray-600">Our master carpenter will contact you shortly to discuss your custom furniture specifications.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {selectedProduct && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center gap-3">
                  <img src={selectedProduct.imageUrl} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Selected Furniture Item</span>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{selectedProduct.productName}</p>
                    <p className="text-xs font-semibold text-[#8B4513]">Est. LKR {Number(selectedProduct.basePrice).toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('yourName')} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamal Perera"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C68B59] focus:ring-2 focus:ring-[#C68B59]/20 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('phoneNumber')} *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 077 123 4567"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C68B59] focus:ring-2 focus:ring-[#C68B59]/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('emailAddress')}</label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C68B59] focus:ring-2 focus:ring-[#C68B59]/20 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{t('projectDetails')} *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your furniture size, timber preference (Teak/Mahogany/Nadun), or custom design..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C68B59] focus:ring-2 focus:ring-[#C68B59]/20 outline-none text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C68B59] hover:bg-[#b07646] text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? t('submitting') : t('submitBtn')}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
