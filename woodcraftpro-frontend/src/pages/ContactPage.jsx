import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ExternalLink } from 'lucide-react';

export default function ContactPage({ selectedProduct, onOpenInquiry }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: selectedProduct ? `I am inquiring about ${selectedProduct.productName || selectedProduct.title || 'a product'}.` : ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleMapClick = () => {
    window.open('https://maps.app.goo.gl/yzoz7pPtRuo15tSK6', '_blank');
  };

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="border-b border-[#E8DEC8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">Contact Us</h1>
          <p className="text-xs sm:text-sm text-[#7A6252] mt-0.5 font-medium">We're here to help you with your furniture needs</p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Info (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-5">
            
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Address</h4>
                <p className="text-xs text-[#7A6252] leading-relaxed mt-0.5 font-medium">
                  Rendapala, Dodangoda,<br />Kalutara, Sri Lanka
                </p>
                <button
                  onClick={handleMapClick}
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#8B5E3C] hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-[#E8DEC8] pt-4">
              <div className="w-9 h-9 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Phone / WhatsApp</h4>
                <p className="text-xs text-[#7A6252] mt-0.5 font-semibold">077 376 9849 (Hotline / WhatsApp)</p>
                <p className="text-xs text-[#7A6252] font-semibold">034 228 5162 (Office)</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-[#E8DEC8] pt-4">
              <div className="w-9 h-9 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Email</h4>
                <p className="text-xs text-[#7A6252] mt-0.5">info@wadumaduwa.lk</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-[#E8DEC8] pt-4">
              <div className="w-9 h-9 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Working Hours</h4>
                <p className="text-xs text-[#7A6252] mt-0.5">Mon - Sat : 8:00 AM - 6:00 PM</p>
                <p className="text-[10px] text-red-500 font-semibold mt-0.5">Sunday : Closed</p>
              </div>
            </div>

          </div>

          {/* Column 2: Interactive Google Map Button Card (4 Cols) */}
          <div 
            onClick={handleMapClick}
            className="lg:col-span-4 h-full min-h-[320px] bg-gradient-to-br from-[#23160D] to-[#3D2415] text-white border border-[#3D2415] rounded-2xl overflow-hidden shadow-sm p-6 flex flex-col justify-between cursor-pointer group relative"
          >
            <div className="space-y-3 z-10">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold font-heading text-white">Workshop Location</h3>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                Rendapala, Dodangoda, Kalutara
              </p>
            </div>

            <div className="z-10 pt-4">
              <button
                onClick={handleMapClick}
                className="w-full bg-[#8B5E3C] hover:bg-[#A47148] text-white py-3 rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-2 group-hover:scale-102"
              >
                <span>Open Google Directions</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 3: Send us a Message Form (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#2B190E]">Send us a Message</h3>
              <p className="text-xs text-[#7A6252] mt-0.5">Fill out your details and we will reply promptly</p>
            </div>

            {submitted ? (
              <div className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl p-4 text-center space-y-2">
                <span className="text-2xl">✅</span>
                <h4 className="font-bold text-xs text-[#2B190E]">Message Sent!</h4>
                <p className="text-[11px] text-[#7A6252]">Thank you for contacting Wadu Maduwa. We will reach out shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs text-[#8B5E3C] font-bold underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div>
                  <textarea
                    rows="3"
                    required
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none focus:border-[#8B5E3C]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#3D2415] hover:bg-[#8B5E3C] text-white py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
