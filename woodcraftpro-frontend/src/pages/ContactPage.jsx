import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

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

  return (
    <div className="bg-[#FBF8F3] text-[#2B190E] min-h-screen pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Header */}
        <div className="border-b border-[#E8DEC8] pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#2B190E]">Contact Us</h1>
          <p className="text-xs sm:text-sm text-[#7A6252] mt-0.5 font-medium">We're here to help you with your furniture needs</p>
        </div>

        {/* 3-Column Layout (Matching Mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Info (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-5">
            
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Address</h4>
                <p className="text-xs text-[#7A6252] leading-relaxed mt-0.5">
                  No. 123, Kurunegala Road,<br />Dambulla, Sri Lanka
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-[#E8DEC8] pt-4">
              <div className="w-9 h-9 rounded-xl bg-[#FAF4EB] text-[#8B5E3C] flex items-center justify-center shrink-0 border border-[#E8DEC8]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2B190E]">Phone</h4>
                <p className="text-xs text-[#7A6252] mt-0.5">+94 77 123 4567</p>
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

          {/* Column 2: Embedded Google Map Preview (4 Cols) */}
          <div className="lg:col-span-4 h-full min-h-[300px] bg-white border border-[#E8DEC8] rounded-2xl overflow-hidden shadow-sm relative">
            <iframe
              title="Wadu Maduwa Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5187796931754!2d78.500000!3d7.873056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTInMjMuMCIgNzjCsDMwJzAwLjAiRQ!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
              className="w-full h-full min-h-[340px] border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
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
