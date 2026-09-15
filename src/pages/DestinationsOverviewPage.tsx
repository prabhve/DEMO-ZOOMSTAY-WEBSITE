import React from 'react';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';

interface DestinationsOverviewPageProps {
  onNavigate: (path: string) => void;
}

export const DestinationsOverviewPage: React.FC<DestinationsOverviewPageProps> = ({ onNavigate }) => {
  const { store } = useCms();
  const destinations = store.destinations || [];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE4DC] text-xs font-semibold tracking-widest uppercase text-[#735D43]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>AUTHENTIC LOCATIONS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2229]">
            Our Destinations
          </h1>
          <p className="text-sm sm:text-base text-[#555C66] leading-relaxed">
            Choose between the spiritual timelessness of Kashi and the refined hospitality, shopping, and sports arena of Lucknow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {destinations.map((dest) => {
            const propCount = (store.properties || []).filter((p) => p.active && p.destinationId === dest.id).length;
            const reasonsList = (dest.whyStayReasons && dest.whyStayReasons.length > 0)
              ? dest.whyStayReasons
              : (dest.highlights || []);

            return (
              <FloatCard key={dest.id} depth={6} elevation="lg" className="overflow-hidden group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white space-y-1">
                    <span className="text-xs uppercase tracking-widest text-[#C5B49E] font-semibold">
                      {dest.state || 'Uttar Pradesh'}
                    </span>
                    <h2 className="font-serif text-3xl font-bold">{dest.name}</h2>
                    <p className="text-xs text-stone-300">{dest.tagline}</p>
                  </div>
                </div>

                <div className="p-8 space-y-6 bg-white">
                  <p className="text-sm text-[#555C66] leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E2229]">
                      Key Highlights:
                    </span>
                    <div className="space-y-1.5">
                      {reasonsList.slice(0, 3).map((reason, i) => (
                        <div key={i} className="text-xs text-stone-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8C7355]" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0ECE4] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#8C7355]">
                      {propCount} Accommodation{propCount > 1 ? 's' : ''} Listed
                    </span>

                    <button
                      onClick={() => onNavigate(`/destinations/${dest.id}`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider uppercase transition"
                    >
                      <span>Explore {dest.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </FloatCard>
            );
          })}
        </div>

      </div>
    </div>
  );
};
