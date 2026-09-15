import React, { useState } from 'react';
import { Sparkles, Star, MessageSquare, CheckCircle2, User, Send } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';

interface ReviewsPageProps {
  onNavigate: (path: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = () => {
  const { store, addReview } = useCms();
  const [filterDestination, setFilterDestination] = useState<string>('all');
  
  // Submit Review Form state
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [propertyId, setPropertyId] = useState<string>(store.properties?.[0]?.id || '');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [stayDate, setStayDate] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const approvedReviews = (store.reviews || []).filter((r) => r.approved);

  const filteredReviews = approvedReviews.filter((r) => {
    if (filterDestination === 'all') return true;
    const prop = (store.properties || []).find((p) => p.id === r.propertyId);
    return prop?.destinationId === filterDestination;
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    const selectedProp = (store.properties || []).find((p) => p.id === propertyId);

    await addReview({
      guestName: guestName.trim(),
      location: location.trim() || 'Verified Traveler',
      rating,
      comment: comment.trim(),
      stayDate: stayDate.trim() || 'Recent Stay',
      propertyId,
      propertyName: selectedProp?.name || 'ZoomStay Homestay',
      approved: false, // Goes to Admin for moderation!
      featured: false,
      source: 'Direct Website Review',
    });

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE4DC] text-xs font-semibold tracking-widest uppercase text-[#735D43]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>TESTIMONIALS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2229]">
            Guest Impressions
          </h1>
          <p className="text-sm sm:text-base text-[#555C66]">
            Read authentic stories and feedback from families, pilgrims, corporate professionals, and travelers who made ZoomStay their home in Varanasi and Lucknow.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider uppercase transition shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-[#C5B49E]" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setFilterDestination('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              filterDestination === 'all'
                ? 'bg-[#1E2229] text-white'
                : 'bg-white text-stone-700 border border-[#EBE4DC]'
            }`}
          >
            All Reviews ({approvedReviews.length})
          </button>
          <button
            onClick={() => setFilterDestination('varanasi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              filterDestination === 'varanasi'
                ? 'bg-[#1E2229] text-white'
                : 'bg-white text-stone-700 border border-[#EBE4DC]'
            }`}
          >
            Varanasi
          </button>
          <button
            onClick={() => setFilterDestination('lucknow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              filterDestination === 'lucknow'
                ? 'bg-[#1E2229] text-white'
                : 'bg-white text-stone-700 border border-[#EBE4DC]'
            }`}
          >
            Lucknow
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((rev) => (
            <FloatCard key={rev.id} depth={4} className="p-8 flex flex-col justify-between h-full bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#8C7355]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8C7355] font-semibold uppercase tracking-wider">
                    {rev.stayDate}
                  </span>
                </div>

                <p className="text-sm text-[#3E4550] italic leading-relaxed font-serif">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F0ECE4]">
                <div className="font-bold text-sm text-[#1E2229]">{rev.guestName}</div>
                <div className="text-xs text-[#7D756C] flex items-center justify-between mt-0.5">
                  <span>{rev.location || rev.source}</span>
                  {rev.propertyName && (
                    <span className="text-[11px] text-stone-500 font-medium">{rev.propertyName}</span>
                  )}
                </div>
              </div>
            </FloatCard>
          ))}
        </div>

      </div>

      {/* Leave a Review Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-[#EBE4DC] animate-in fade-in zoom-in-95 duration-200">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E2229]">
                  Thank You for Your Feedback!
                </h3>
                <p className="text-xs text-stone-600">
                  Your review has been submitted for moderation and will appear on the website once approved by our hospitality team.
                </p>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmitted(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1E2229] text-white text-xs font-bold tracking-wider uppercase mt-4"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                  <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                    Share Your Experience
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="text-stone-400 hover:text-stone-700 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="e.g. Ananya Sen"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#8C7355]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Origin City
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bangalore"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#8C7355]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Month of Stay
                    </label>
                    <input
                      type="text"
                      value={stayDate}
                      onChange={(e) => setStayDate(e.target.value)}
                      placeholder="e.g. October 2024"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#8C7355]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Property Visited
                  </label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#8C7355]"
                  >
                    {(store.properties || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.destinationName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition ${star <= rating ? 'text-[#8C7355]' : 'text-stone-300'}`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Tell us about the cleanliness, beds, kitchen, caretaker support, or peaceful surroundings..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#8C7355]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl bg-[#1E2229] text-white text-xs font-bold tracking-wider uppercase transition hover:bg-stone-800"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
