import React, { useState } from 'react';
import { Sparkles, MapPin, Clock, Compass, Utensils, ShoppingBag, Landmark } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';

interface ExplorePageProps {
  onNavigate: (path: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate }) => {
  const { store } = useCms();
  const [activeTab, setActiveTab] = useState<'all' | 'varanasi' | 'lucknow'>('all');

  const attractions = (store.attractions || []).filter(
    (a) => activeTab === 'all' || a.destinationId === activeTab
  );

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE4DC] text-xs font-semibold tracking-widest uppercase text-[#735D43]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>LOCAL CITY GUIDE</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2229]">
            Explore Varanasi & Lucknow
          </h1>
          <p className="text-sm sm:text-base text-[#555C66]">
            Carefully curated local attractions, authentic cultural landmarks, and culinary experiences with exact travel times from your ZoomStay apartment.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${
              activeTab === 'all'
                ? 'bg-[#1E2229] text-white shadow-md'
                : 'bg-white hover:bg-stone-100 text-[#4A4238] border border-[#EBE4DC]'
            }`}
          >
            All Experiences
          </button>
          <button
            onClick={() => setActiveTab('varanasi')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${
              activeTab === 'varanasi'
                ? 'bg-[#1E2229] text-white shadow-md'
                : 'bg-white hover:bg-stone-100 text-[#4A4238] border border-[#EBE4DC]'
            }`}
          >
            Varanasi (Kashi)
          </button>
          <button
            onClick={() => setActiveTab('lucknow')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${
              activeTab === 'lucknow'
                ? 'bg-[#1E2229] text-white shadow-md'
                : 'bg-white hover:bg-stone-100 text-[#4A4238] border border-[#EBE4DC]'
            }`}
          >
            Lucknow (Awadh)
          </button>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.map((att) => (
            <FloatCard key={att.id} depth={5} elevation="md" className="flex flex-col h-full bg-white">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={att.imageUrl}
                  alt={att.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5B49E]" />
                  <span>{att.distanceFromZoomStay}</span>
                </div>
                <div className="absolute top-4 right-4 bg-[#8C7355] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
                  {att.destinationName}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1E2229] mb-2">
                    {att.title}
                  </h3>
                  <p className="text-xs text-[#555C66] leading-relaxed">
                    {att.description}
                  </p>
                </div>

                {att.tips && (
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] text-xs text-[#735D43]">
                    <strong className="block text-[#1E2229] mb-0.5">Caretaker / Local Recommendation:</strong>
                    <span>{att.tips}</span>
                  </div>
                )}
              </div>
            </FloatCard>
          ))}
        </div>

        {/* Need Help Transit CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-[#1E2229] text-white text-center max-w-2xl mx-auto space-y-4 shadow-xl">
          <Compass className="w-8 h-8 text-[#C5B49E] mx-auto" />
          <h3 className="font-serif text-2xl font-bold">
            Need Guided Itineraries or Cab Arrangements?
          </h3>
          <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
            Our on-site caretakers can connect you with trusted boatmen, experienced guides, and dependable private drivers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/contact?type=Travel+Assistance')}
              className="px-6 py-3 rounded-xl bg-[#C5B49E] hover:bg-white text-[#181A1F] text-xs font-bold tracking-wider uppercase transition"
            >
              Request Travel Assistance
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
