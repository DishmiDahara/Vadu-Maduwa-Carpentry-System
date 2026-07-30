import React, { useState } from 'react';
import { Star, MessageSquare, ShieldCheck, Users, Hammer, CheckCircle2, Send, Heart } from 'lucide-react';

export default function FeedbackPage() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Dinesh Perera',
      location: 'Colombo',
      rating: 5,
      date: '2024-05-12',
      comment: 'Excellent craftsmanship and high quality work. Very happy with my custom wardrobe. Highly recommended!',
      verified: true
    },
    {
      id: 2,
      name: 'Nimal Fernando',
      location: 'Kandy',
      rating: 5,
      date: '2024-05-28',
      comment: 'වඩු මඩුවේ වැඩ නිමාව ඉතාමත් සුපිරි. තේක්ක කෑම මේසය ඉතා උසස් ප්‍රමිතියෙන් සාදා දුන්නා. නීර්දේශ කරනවා!',
      verified: true
    },
    {
      id: 3,
      name: 'S. Aravinth',
      location: 'Jaffna',
      rating: 5,
      date: '2024-06-02',
      comment: 'மிகவும் சிறந்த சேவை மற்றும் தரமான வேலை. நன்றி!',
      verified: true
    },
    {
      id: 4,
      name: 'Kasun Wickramasinghe',
      location: 'Galle',
      rating: 5,
      date: '2024-06-15',
      comment: 'Our main teak entrance door was crafted with precision. The carving and polish finish exceeded our expectations.',
      verified: true
    },
    {
      id: 5,
      name: 'Kumari Jayawardena',
      location: 'Kurunegala',
      rating: 5,
      date: '2024-06-20',
      comment: 'කාමරයේ ඇඳ සහ අල්මාරිය ඉතාම ලස්සනට සකසා දුන්නා. මිල ගණන්ද ඉතා සාධාරණයි. ස්තූතියි වඩු මඩුව!',
      verified: true
    },
    {
      id: 6,
      name: 'Anura Bandara',
      location: 'Dambulla',
      rating: 4,
      date: '2024-07-01',
      comment: 'On-time installation and professional service. Very friendly team.',
      verified: true
    }
  ]);

  // Submit Feedback Form State
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: ''
  });

  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!newFeedback.name.trim() || !newFeedback.comment.trim()) {
      alert('කරුණාකර නම සහ ඔබගේ අදහස් ඇතුළත් කරන්න.');
      return;
    }

    const createdReview = {
      id: Date.now(),
      name: newFeedback.name.trim(),
      location: newFeedback.location.trim() || 'Sri Lanka',
      rating: Number(newFeedback.rating),
      date: new Date().toISOString().split('T')[0],
      comment: newFeedback.comment.trim(),
      verified: true
    };

    setReviews([createdReview, ...reviews]);
    setSubmittedMessage(true);
    setNewFeedback({ name: '', location: '', rating: 5, comment: '' });
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2B190E] min-h-screen pb-16 pt-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-[#E8DEC8] pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-widest bg-[#F3EDE2] border border-[#E8DEC8] px-3 py-1 rounded-full">
              🍃 CLIENT TESTIMONIALS
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-[#2B190E] mt-2">
            Customer Feedback (පාරිභෝගික අදහස්)
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6252] mt-1 font-medium">
            Read real client reviews or share your feedback about Wadu Maduwa's woodwork and craftsmanship.
          </p>
        </div>

        {/* Banner Stats Card (Dark Wood matching app theme) */}
        <div className="bg-[#1D1109] text-white border border-[#3D2415] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#3D2415]">
            
            <div className="p-2 space-y-1">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-lg">
                ★★★★★
              </div>
              <h3 className="text-3xl font-extrabold font-heading text-white">4.8 / 5</h3>
              <p className="text-xs text-amber-200/70">Overall Rating Score</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-extrabold font-heading text-white">1,000+</h3>
              <p className="text-xs text-amber-200/70">Happy Homeowners</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1">
                <Hammer className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-extrabold font-heading text-white">1,500+</h3>
              <p className="text-xs text-amber-200/70">Completed Projects</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-extrabold font-heading text-white">99%</h3>
              <p className="text-xs text-amber-200/70">Client Satisfaction</p>
            </div>

          </div>
        </div>

        {/* Main Content Grid: Submit Feedback Form + Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Submit New Feedback Form (4 Cols) */}
          <div className="lg:col-span-4 bg-white border border-[#E8DEC8] rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-base text-[#2B190E]">Leave Your Feedback</h3>
              <p className="text-xs text-[#7A6252] mt-0.5">ඔබගේ අදහස් සහ ප්‍රතිචාර අප වෙත ලබා දෙන්න</p>
            </div>

            {submittedMessage ? (
              <div className="bg-[#FAF4EB] border border-[#E8DEC8] rounded-2xl p-4 text-center space-y-2">
                <span className="text-3xl">🎉</span>
                <h4 className="font-bold text-sm text-[#2B190E]">ඔබගේ අදහස සාර්ථකව ඇතුළත් විය!</h4>
                <p className="text-xs text-[#7A6252]">ස්තූතියි! ඔබගේ අදහස අපගේ Feedback පිටුවේ පළ කරන ලදී.</p>
                <button
                  onClick={() => setSubmittedMessage(false)}
                  className="mt-2 text-xs font-bold text-[#8B5E3C] underline cursor-pointer"
                >
                  තවත් අදහසක් ඇතුළත් කරන්න
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B190E] mb-1">Your Name (ඔබගේ නම)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ruwan Perera"
                    value={newFeedback.name}
                    onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B190E] mb-1">Location / City (නගරය)</label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo, Kandy, Galle"
                    value={newFeedback.location}
                    onChange={(e) => setNewFeedback({ ...newFeedback, location: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none focus:border-[#8B5E3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B190E] mb-1">Star Rating (තරු අගය)</label>
                  <select
                    value={newFeedback.rating}
                    onChange={(e) => setNewFeedback({ ...newFeedback, rating: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs font-bold text-[#2B190E] outline-none"
                  >
                    <option value="5">★★★★★ (5 Stars - Excellent)</option>
                    <option value="4">★★★★☆ (4 Stars - Very Good)</option>
                    <option value="3">★★★☆☆ (3 Stars - Good)</option>
                    <option value="2">★★☆☆☆ (2 Stars - Average)</option>
                    <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B190E] mb-1">Review Comment (ඔබගේ අදහස)</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Write your experience about our woodworking quality, service, or craftsmanship..."
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#FAF4EB] border border-[#E8DEC8] rounded-xl text-xs text-[#2B190E] outline-none focus:border-[#8B5E3C]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#23160D] hover:bg-[#3D2415] text-white py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Submit Feedback</span>
                </button>
              </form>
            )}
          </div>

          {/* Customer Reviews Grid (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-bold text-base text-[#2B190E]">
                All Customer Reviews ({reviews.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-[#E8DEC8] rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500 text-xs font-bold">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </div>
                      <span className="text-[10px] text-[#7A6252]">{rev.date}</span>
                    </div>

                    <p className="text-xs text-[#2B190E] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#FAF4EB]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#8B5E3C] text-white font-bold flex items-center justify-center text-xs shadow">
                        {rev.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#2B190E]">{rev.name}</h4>
                        <span className="text-[10px] text-[#7A6252]">{rev.location}</span>
                      </div>
                    </div>

                    {rev.verified && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        ✓ Verified Client
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
