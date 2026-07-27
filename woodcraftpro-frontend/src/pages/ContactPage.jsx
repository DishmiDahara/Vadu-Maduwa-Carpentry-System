import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function ContactPage({ onOpenInquiry }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Connect With Us</span>
        <h1 className="text-4xl font-extrabold font-heading text-gray-900">Visit Our Workshop or Request Call</h1>
        <p className="text-sm text-gray-600">Have questions regarding timber selection, custom designs, or project timelines? Our carpentry team is here to assist.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 font-heading text-base">Workshop Address</h3>
              <p className="text-sm text-gray-600 mt-1">No. 142, WoodCraft Industry Zone, Galle Road, Colombo, Sri Lanka</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 font-heading text-base">Direct Phone Lines</h3>
              <p className="text-sm text-gray-600 mt-1">+94 (077) 123 4567 (Hotline / WhatsApp)</p>
              <p className="text-sm text-gray-600">+94 (011) 234 5678 (Workshop Office)</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 font-heading text-base">Email Inquiry</h3>
              <p className="text-sm text-gray-600 mt-1">info@woodcraftpro.lk</p>
              <p className="text-sm text-gray-600">quotes@woodcraftpro.lk</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C68B59] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 font-heading text-base">Working Hours</h3>
              <p className="text-sm text-gray-600 mt-1">Mon - Sat: 8:30 AM - 6:00 PM</p>
              <p className="text-xs text-amber-600 font-semibold">Sunday & Public Holidays: By Appointment</p>
            </div>
          </div>

        </div>

        {/* Action Hero Box */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#1C1F26] via-[#2D3238] to-[#121417] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col justify-between space-y-8 border border-gray-800">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#C68B59] uppercase tracking-widest">Online Request</span>
            <h2 className="text-3xl font-extrabold font-heading text-white">Need a Quote for Custom Timber Work?</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Submit your inquiry online with your required dimensions, timber species (Teak, Mahogany, Nadun, Jackwood), and project photos. Our team will review and contact you with a customized quotation.
            </p>
          </div>

          <button
            onClick={onOpenInquiry}
            className="w-full sm:w-auto bg-[#C68B59] hover:bg-[#b07646] text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            Open Inquiry Form Now
          </button>
        </div>

      </div>

    </div>
  );
}
