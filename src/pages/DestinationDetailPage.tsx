import React from 'react';
import {
  MapPin,
  Clock,
  Compass,
  BedDouble,
  Users,
  Bath,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Phone,
  MessageCircle,
  Building,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

interface DestinationDetailPageProps {
  destinationId: 'varanasi' | 'lucknow';
  onNavigate: (path: string) => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  destinationId,
  onNavigate,
}) => {
  const { store } = useCms();
  const destination = store.destinations.find((d) => d.id === destinationId);

  if (!destination) {
    return (
      <div className="min-h-screen pt-40 text-center px-4 bg-[#FAF8F5]">
        <h2 className="font-serif text-3xl font-bold">Destination Not Found</h2>
      </div>
    );
  }

  const destinationProperties = (store.properties || []).filter(
    (p) => p.active && p.destinationId === destinationId
  );
  const attractions = (store.attractions || []).filter(
    (a) => a.destinationId === destinationId
  );

  const isVaranasi = destinationId === 'varanasi';
  const whyStayList = (destination.whyStayReasons && destination.whyStayReasons.length > 0)
    ? destination.whyStayReasons
    : (destination.highlights || []);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FAF8F5]">
      
      {/* Hero Banner with Rich Context */}
      <div className="relative h-[480px] overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

        <div className="absolute bottom-12 inset-x-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#8C7355] text-xs font-semibold tracking-widest uppercase">
              {destination.state || 'Uttar Pradesh'}, India
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold">
              {destination.name}
            </h1>
            <p className="text-sm sm:text-base text-stone-200 max-w-2xl font-light">
              {destination.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Destination Overview & Why Stay */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
              DESTINATION GUIDE
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1E2229]">
              Experience {destination.name} with ZoomStay
            </h2>
            <p className="text-sm sm:text-base text-[#555C66] leading-relaxed">
              {destination.description}
            </p>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E2229] mb-3">
                Why Discerning Guests Choose Our {destination.name} Residences:
              </h4>
              <div className="space-y-2.5">
                {whyStayList.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#444C57]">
                    <span className="w-5 h-5 rounded-full bg-[#8C7355]/15 text-[#8C7355] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate(`/request-booking?destination=${destinationId}`)}
                className="px-6 py-3 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-semibold tracking-wider transition"
              >
                REQUEST A STAY IN {destination.name.toUpperCase()}
              </button>
              <WhatsAppButton
                destination={destinationId}
                label={`WhatsApp ${destination.name} Desk`}
                variant="secondary"
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <FloatCard depth={5} className="p-6 bg-white space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                {destination.name} Quick Travel Index
              </h3>

              <div className="space-y-3 text-xs">
                {isVaranasi ? (
                  <>
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4]">
                      <strong className="block text-[#8C7355]">Standalone Building:</strong>
                      <span>6 Identical 3BHK homestay apartments in Cantonment</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4]">
                      <strong className="block text-[#8C7355]">Kashi Vishwanath Corridor:</strong>
                      <span>~5.5 km (18 mins easy drive)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4]">
                      <strong className="block text-[#8C7355]">Luxury Cantonment Enclave:</strong>
                      <span>2 km to Hotel Ramada & Taj Gateway; peaceful night sleep</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4]">
                      <strong className="block text-[#8C7355]">Phoenix Palassio Mall:</strong>
                      <span>1 km (3 mins from Spring Garden Society)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4]">
                      <strong className="block text-[#8C7355]">Ekana International Cricket Stadium:</strong>
                      <span>2 km (5 mins drive)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4]">
                      <strong className="block text-[#8C7355]">Shaheed Path Corridor:</strong>
                      <span>Smooth airport connectivity (Chaudhary Charan Singh Airport)</span>
                    </div>
                  </>
                )}
              </div>
            </FloatCard>
          </div>
        </div>

        {/* Accommodations in this City */}
        <div className="space-y-8 pt-6 border-t border-[#EBE4DC]">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
              AVAILABLE PROPERTIES
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1E2229] mt-1">
              ZoomStay Accommodations in {destination.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinationProperties.map((prop) => (
              <FloatCard key={prop.id} depth={5} elevation="md" className="flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={prop.coverImage}
                    alt={prop.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1E2229] text-[11px] font-semibold">
                    {prop.propertyType}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1E2229] mb-1">
                      {prop.name}
                    </h3>
                    <p className="text-xs text-[#7D756C] flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                      <span className="truncate">{prop.address}</span>
                    </p>
                    <p className="text-xs text-[#555C66] line-clamp-2 mb-4">
                      {prop.shortDescription}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F0EBE3] text-xs font-medium text-[#4A4238]">
                      <div className="flex items-center gap-1">
                        <BedDouble className="w-4 h-4 text-[#8C7355]" />
                        <span>{prop.bedrooms} Bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-[#8C7355]" />
                        <span>{prop.bathrooms} Bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#8C7355]" />
                        <span>Max {prop.maxGuests}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#F0EBE3] flex items-center justify-between">
                    <WhatsAppButton
                      destination={destinationId}
                      propertyName={prop.name}
                      variant="minimal"
                    />
                    <button
                      onClick={() => onNavigate(`/stays/${prop.slug}`)}
                      className="px-4 py-2 rounded-lg bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </FloatCard>
            ))}
          </div>
        </div>

        {/* Attractions & Experiences in this City */}
        {attractions.length > 0 && (
          <div className="space-y-8 pt-6 border-t border-[#EBE4DC]">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
                LOCAL ATTRACTIONS & EXPERIENCES
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#1E2229] mt-1">
                Explore Around {destination.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {attractions.map((att) => (
                <FloatCard key={att.id} depth={4} className="flex flex-col h-full bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={att.imageUrl}
                      alt={att.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{att.distanceFromZoomStay}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1E2229] mb-2">
                        {att.title}
                      </h3>
                      <p className="text-xs text-[#555C66] leading-relaxed mb-4">
                        {att.description}
                      </p>
                    </div>

                    {att.tips && (
                      <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#F0ECE4] text-[11px] text-[#735D43]">
                        <strong>Local Tip:</strong> {att.tips}
                      </div>
                    )}
                  </div>
                </FloatCard>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
