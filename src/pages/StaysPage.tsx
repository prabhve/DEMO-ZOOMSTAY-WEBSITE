import React, { useState, useMemo } from 'react';
import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  Maximize2,
  Filter,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

interface StaysPageProps {
  onNavigate: (path: string) => void;
  initialDestination?: string;
}

export const StaysPage: React.FC<StaysPageProps> = ({
  onNavigate,
  initialDestination = 'all',
}) => {
  const { store } = useCms();
  const [selectedDestination, setSelectedDestination] = useState<string>(initialDestination);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('all');
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const properties = store.properties.filter((p) => p.active);
  const amenitiesList = store.amenities.filter((a) => a.enabled);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Destination filter
      if (selectedDestination !== 'all' && p.destinationId !== selectedDestination) {
        return false;
      }
      // Bedrooms filter
      if (selectedBedrooms !== 'all') {
        const beds = parseInt(selectedBedrooms, 10);
        if (p.bedrooms !== beds) return false;
      }
      // Guest capacity
      if (minCapacity > 0 && p.maxGuests < minCapacity) {
        return false;
      }
      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every((amenityId) => p.amenityIds.includes(amenityId));
        if (!hasAll) return false;
      }
      return true;
    });
  }, [properties, selectedDestination, selectedBedrooms, minCapacity, selectedAmenities]);

  const clearFilters = () => {
    setSelectedDestination('all');
    setSelectedBedrooms('all');
    setMinCapacity(0);
    setSelectedAmenities([]);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE4DC] text-xs font-semibold tracking-widest uppercase text-[#735D43]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>DISCOVER ZOOMSTAY</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2229]">
            Our Accommodations
          </h1>
          <p className="text-sm sm:text-base text-[#555C66] leading-relaxed">
            Spacious, fully equipped 2BHK and 3BHK homestay residences in Varanasi Cantonment and Lucknow. Each offering private kitchens, living salons, and dedicated caretakers.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm mb-12 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE4]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C7355]">
              <Filter className="w-4 h-4" />
              <span>Filter Accommodations</span>
            </div>
            {(selectedDestination !== 'all' || selectedBedrooms !== 'all' || minCapacity > 0 || selectedAmenities.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-xs text-stone-500 hover:text-[#8C7355] font-medium underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Destination Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#4A4238] uppercase tracking-wider mb-2">
                Destination
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#8C7355]"
              >
                <option value="all">All Cities (Varanasi & Lucknow)</option>
                <option value="varanasi">Varanasi</option>
                <option value="lucknow">Lucknow</option>
              </select>
            </div>

            {/* Bedroom Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#4A4238] uppercase tracking-wider mb-2">
                Bedrooms
              </label>
              <select
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#8C7355]"
              >
                <option value="all">Any Layout</option>
                <option value="2">2 BHK Apartments</option>
                <option value="3">3 BHK Apartments</option>
              </select>
            </div>

            {/* Capacity Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#4A4238] uppercase tracking-wider mb-2">
                Minimum Guests
              </label>
              <select
                value={minCapacity}
                onChange={(e) => setMinCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:outline-none focus:ring-2 focus:ring-[#8C7355]"
              >
                <option value={0}>Any Group Size</option>
                <option value={4}>4+ Guests</option>
                <option value={6}>6+ Guests</option>
                <option value={8}>8+ Guests</option>
              </select>
            </div>
          </div>

          {/* Amenities Filter Pills */}
          <div className="pt-2">
            <span className="block text-xs font-semibold text-[#4A4238] uppercase tracking-wider mb-2">
              Must-Have Amenities
            </span>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? 'bg-[#8C7355] text-white shadow-sm'
                        : 'bg-[#FAF8F5] hover:bg-[#F2ECE3] text-[#4A4238] border border-[#EBE4DC]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{amenity.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EBE4DC] p-8">
            <h3 className="font-serif text-xl font-bold text-[#1E2229] mb-2">
              No stays match your current filters.
            </h3>
            <p className="text-xs text-[#7D756C] mb-6">
              Try resetting your filters or reach out directly to our reservations team.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-xl bg-[#1E2229] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => {
              const showPrice = store.siteSettings.publicPricingEnabled && prop.pricing.enabled;

              return (
                <FloatCard key={prop.id} depth={5} elevation="lg" className="flex flex-col h-full group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={prop.coverImage}
                      alt={prop.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#1E2229]/85 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase">
                        {prop.destinationName}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1E2229] text-[11px] font-semibold">
                        {prop.propertyType}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1E2229] mb-1.5 group-hover:text-[#8C7355] transition-colors">
                        {prop.name}
                      </h3>
                      <p className="text-xs text-[#7D756C] flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#8C7355] shrink-0" />
                        <span className="truncate">{prop.address}</span>
                      </p>
                      <p className="text-xs text-[#555C66] line-clamp-2 leading-relaxed mb-4">
                        {prop.shortDescription}
                      </p>

                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F0EBE3] text-xs text-[#4A4238] font-medium">
                        <div className="flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-[#8C7355]" />
                          <span>{prop.bedrooms} Bed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-4 h-4 text-[#8C7355]" />
                          <span>{prop.bathrooms} Bath</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#8C7355]" />
                          <span>Max {prop.maxGuests}</span>
                        </div>
                      </div>

                      {prop.buildingInfo && (
                        <div className="mt-3 text-[11px] bg-[#FAF8F5] text-[#735D43] px-3 py-1.5 rounded-lg border border-[#EDE5DB]">
                          ✨ {prop.buildingInfo}
                        </div>
                      )}
                    </div>

                    <div className="pt-5 mt-4 border-t border-[#F0EBE3] flex items-center justify-between gap-3">
                      <div>
                        {showPrice ? (
                          <div>
                            <span className="font-serif text-lg font-bold text-[#1E2229]">
                              {prop.pricing.currency} {prop.pricing.basePricePerNight?.toLocaleString()}
                            </span>
                            <span className="text-xs text-stone-500"> / {prop.pricing.unit}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-[#8C7355] tracking-wide uppercase">
                            Available on Request
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <WhatsAppButton
                          destination={prop.destinationId}
                          propertyName={prop.name}
                          variant="minimal"
                        />
                        <button
                          onClick={() => onNavigate(`/stays/${prop.slug}`)}
                          className="px-4 py-2 rounded-lg bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-semibold tracking-wider transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </FloatCard>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
