import React, { useState } from 'react';
import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  Maximize2,
  Calendar,
  Phone,
  MessageCircle,
  CheckCircle2,
  Share2,
  ExternalLink,
  Shield,
  Clock,
  Car,
  UtensilsCrossed,
  Tv,
  Wifi,
  Wind,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';
import { LightboxModal } from '../components/ui/LightboxModal';

interface PropertyDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const { store } = useCms();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const property = store.properties.find((p) => p.slug === slug || p.id === slug);

  if (!property) {
    return (
      <div className="min-h-screen pt-40 pb-24 text-center px-4 bg-[#FAF8F5]">
        <h2 className="font-serif text-3xl font-bold text-[#1E2229] mb-4">
          Accommodation Not Found
        </h2>
        <p className="text-sm text-[#7D756C] mb-8">
          The requested property may have moved or is no longer listed.
        </p>
        <button
          onClick={() => onNavigate('/stays')}
          className="px-6 py-3 rounded-xl bg-[#1E2229] text-white text-xs font-semibold tracking-wider"
        >
          Back to All Stays
        </button>
      </div>
    );
  }

  const propertyUnits = (store.units || []).filter((u) => u.propertyId === property.id);
  const propertyAmenities = (store.amenities || []).filter((a) =>
    (property.amenityIds || []).includes(a.id)
  );
  const propertyReviews = (store.reviews || []).filter(
    (r) => r.approved && (r.propertyId === property.id || r.propertyName?.includes(property.name))
  );

  const propertyImagesList = Array.isArray(property.images) ? property.images : [];

  const allImages = [
    { url: property.coverImage || '', title: property.name, alt: property.tagline },
    ...propertyImagesList.map((imgUrl, i) => ({
      url: imgUrl,
      title: `${property.name} - View ${i + 1}`,
      alt: `${property.name} interior`,
    })),
  ];

  const showPrice = store.siteSettings.publicPricingEnabled && property.pricing.enabled;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.name,
        text: property.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back and Breadcrumb */}
        <div className="flex items-center justify-between py-4 mb-2">
          <button
            onClick={() => onNavigate('/stays')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C7355] hover:text-[#1E2229] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Stays</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EBE4DC] bg-white text-xs font-medium text-[#4A4238] hover:bg-[#FAF8F5] transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Stay</span>
          </button>
        </div>

        {/* Title & Location Header */}
        <div className="mb-8 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C7355]">
            <span>{property.destinationName}</span>
            <span>•</span>
            <span>{property.propertyType}</span>
            {property.unitsCount && property.unitsCount > 1 && (
              <>
                <span>•</span>
                <span className="text-[#1B8040] bg-[#25D366]/10 px-2.5 py-0.5 rounded-full">
                  {property.unitsCount} Units in Same Building
                </span>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E2229]">
            {property.name}
          </h1>
          <p className="text-sm text-[#7D756C] flex items-center gap-1.5 pt-1">
            <MapPin className="w-4 h-4 text-[#8C7355] shrink-0" />
            <span>{property.address}</span>
          </p>
        </div>

        {/* Hero Gallery Grid (Interactive) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden mb-12 shadow-sm">
          {/* Main Large Image */}
          <div
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden cursor-pointer group"
          >
            <img
              src={property.coverImage}
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium">
              View Cover Photo
            </div>
          </div>

          {/* Secondary Grid Images */}
          {propertyImagesList.slice(0, 4).map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => {
                setLightboxIndex(idx + 1);
                setLightboxOpen(true);
              }}
              className="relative aspect-[4/3] overflow-hidden cursor-pointer group hidden md:block"
            >
              <img
                src={imgUrl}
                alt={`${property.name} view ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />
              {idx === 3 && propertyImagesList.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-sm">
                  +{propertyImagesList.length - 4} More Photos
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Layout: Main Details Left, Sticky Booking Action Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Specs Overview */}
            <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Bedrooms</div>
                <div className="font-serif text-2xl font-bold text-[#1E2229] mt-1">{property.bedrooms}</div>
                <div className="text-[11px] text-stone-600">King Size Beds</div>
              </div>
              <div>
                <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Bathrooms</div>
                <div className="font-serif text-2xl font-bold text-[#1E2229] mt-1">{property.bathrooms}</div>
                <div className="text-[11px] text-stone-600">Modern Sanitaryware</div>
              </div>
              <div>
                <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Max Capacity</div>
                <div className="font-serif text-2xl font-bold text-[#1E2229] mt-1">{property.maxGuests}</div>
                <div className="text-[11px] text-stone-600">Guests Included</div>
              </div>
              <div>
                <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Floor Area</div>
                <div className="font-serif text-2xl font-bold text-[#1E2229] mt-1">
                  {property.areaSqFt || 'Spacious'}
                </div>
                <div className="text-[11px] text-stone-600">Private Apartment</div>
              </div>
            </div>

            {/* Overview & Story */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#1E2229]">
                About this Residence
              </h2>
              <p className="text-sm sm:text-base text-[#444C57] leading-relaxed">
                {property.longDescription}
              </p>
            </div>

            {/* Spatial Details: Kitchen, Living, Balcony, Caretaker */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                Spaces & Thoughtful Appointments
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-white border border-[#EBE4DC] space-y-2">
                  <div className="flex items-center gap-2 text-[#8C7355] font-semibold text-sm">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Fully Functional Kitchen</span>
                  </div>
                  <p className="text-xs text-[#555C66] leading-relaxed">
                    {property.kitchenDetails}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#EBE4DC] space-y-2">
                  <div className="flex items-center gap-2 text-[#8C7355] font-semibold text-sm">
                    <Tv className="w-4 h-4" />
                    <span>Living & Dining Salon</span>
                  </div>
                  <p className="text-xs text-[#555C66] leading-relaxed">
                    {property.livingAreaDetails}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#EBE4DC] space-y-2">
                  <div className="flex items-center gap-2 text-[#8C7355] font-semibold text-sm">
                    <Users className="w-4 h-4" />
                    <span>24/7 Dedicated Caretaker</span>
                  </div>
                  <p className="text-xs text-[#555C66] leading-relaxed">
                    {property.caretakerDetails}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#EBE4DC] space-y-2">
                  <div className="flex items-center gap-2 text-[#8C7355] font-semibold text-sm">
                    <Car className="w-4 h-4" />
                    <span>Parking & Security</span>
                  </div>
                  <p className="text-xs text-[#555C66] leading-relaxed">
                    {property.parkingDetails}
                  </p>
                </div>
              </div>
            </div>

            {/* Units in the Same Building (Varanasi / Lucknow) */}
            {propertyUnits.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#F4EFEA] border border-[#E5DCD1] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                      Building Units Available ({propertyUnits.length})
                    </h3>
                    <p className="text-xs text-[#735D43]">
                      Individual standalone units available for private or simultaneous group booking.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#8C7355] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#DDD3C7]">
                    Multiple Units Under One Roof
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {propertyUnits.map((unit) => (
                    <div
                      key={unit.id}
                      className="p-4 rounded-xl bg-white border border-[#DDD3C7] shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-[#1E2229]">{unit.unitName}</h4>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              unit.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {unit.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {unit.floor} • {unit.bedrooms} Bedrooms • {unit.bathrooms} Baths • Up to {unit.capacity} Guests
                        </p>
                        {unit.notes && (
                          <p className="text-[11px] text-stone-600 mt-2 italic bg-[#FAF8F5] p-2 rounded border border-[#F0ECE4]">
                            "{unit.notes}"
                          </p>
                        )}
                      </div>
                      <div className="pt-3 mt-3 border-t border-[#F0ECE4] flex items-center justify-between">
                        <span className="text-[11px] text-[#8C7355] font-semibold">{unit.bedsDescription}</span>
                        <button
                          onClick={() => onNavigate(`/request-booking?property=${property.id}&unit=${unit.id}`)}
                          className="text-xs font-semibold text-[#1E2229] hover:text-[#8C7355] underline"
                        >
                          Select Unit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Amenities Matrix */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                All Amenities & Services
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propertyAmenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="p-3.5 rounded-xl bg-white border border-[#EBE4DC] flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#8C7355] shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#8C7355]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1E2229]">{amenity.name}</div>
                      <div className="text-[11px] text-[#7D756C] line-clamp-1">{amenity.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Highlights with Distances */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                Location & Nearby Landmarks
              </h3>

              <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(property.locationHighlights || []).map((lh, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] text-xs"
                    >
                      <span className="font-medium text-[#1E2229]">{lh.label}</span>
                      <div className="text-right">
                        <span className="font-bold text-[#8C7355]">{lh.distance}</span>
                        {lh.time && <span className="text-stone-500 ml-1">({lh.time})</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#7D756C]">Precise directions provided upon booking approval.</span>
                  {property.directionsUrl && (
                    <a
                      href={property.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#8C7355] hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews for this stay */}
            {propertyReviews.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                  Guest Reviews
                </h3>

                <div className="space-y-3">
                  {propertyReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-xl bg-white border border-[#EBE4DC] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1E2229]">{rev.guestName}</span>
                        <span className="text-[11px] text-stone-500">{rev.stayDate}</span>
                      </div>
                      <p className="text-xs text-[#555C66] italic font-serif">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Booking Sidebar Right */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <FloatCard depth={4} elevation="lg" className="p-6 bg-white space-y-6">
                <div>
                  <div className="text-xs font-semibold text-[#8C7355] uppercase tracking-wider">
                    RESERVATION DESK
                  </div>
                  <div className="mt-2">
                    {showPrice ? (
                      <div>
                        <span className="font-serif text-3xl font-bold text-[#1E2229]">
                          {property.pricing.currency} {property.pricing.basePricePerNight?.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-500"> / {property.pricing.unit}</span>
                        <div className="text-xs text-stone-600 mt-1">{property.pricing.guestBasis}</div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-serif text-2xl font-bold text-[#1E2229]">
                          Rates on Request
                        </span>
                        <p className="text-xs text-stone-500 mt-1">
                          Direct pricing based on travel dates, group size, and unit selection.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => onNavigate(`/request-booking?property=${property.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider uppercase transition shadow-md"
                  >
                    <Calendar className="w-4 h-4 text-[#C5B49E]" />
                    <span>REQUEST THIS STAY</span>
                  </button>

                  <WhatsAppButton
                    destination={property.destinationId}
                    propertyName={property.name}
                    label="Ask on WhatsApp"
                    className="w-full"
                  />
                </div>

                <div className="pt-4 border-t border-[#F0ECE4] space-y-2.5 text-xs text-[#555C66]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0" />
                    <span>Instant confirmation from reservation desk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0" />
                    <span>Transparent cancellation framework</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0" />
                    <span>Caretaker assistance with luggage & check-in</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE4DC] text-xs space-y-1">
                  <div className="font-semibold text-[#1E2229]">Need immediate assistance?</div>
                  <div className="text-[#7D756C]">Call our reservations team:</div>
                  <a
                    href={`tel:${store.contact.varanasiContacts[0]?.phone}`}
                    className="font-bold text-[#8C7355] block hover:underline pt-0.5"
                  >
                    {property.destinationId === 'lucknow'
                      ? store.contact.lucknowContacts[0]?.phone
                      : store.contact.varanasiContacts[0]?.phone}
                  </a>
                </div>
              </FloatCard>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox for full screen viewing */}
      <LightboxModal
        isOpen={lightboxOpen}
        images={allImages}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
