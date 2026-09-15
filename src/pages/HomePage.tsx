import React, { useState } from 'react';
import {
  ArrowRight,
  MessageCircle,
  Calendar,
  Sparkles,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Maximize2,
  CheckCircle2,
  Star,
  Compass,
  Phone,
  Car,
  ChevronRight,
  Shield,
  UtensilsCrossed,
  Wifi,
  Tv,
  Wind,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';
import { LightboxModal } from '../components/ui/LightboxModal';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { store } = useCms();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const featuredProperties = (store.properties || []).filter((p) => p.featured && p.active);
  const amenities = (store.amenities || []).filter((a) => a.enabled).slice(0, 8);
  const featuredReviews = (store.reviews || []).filter((r) => r.featured && r.approved);
  const galleryImages = (store.gallery || []).slice(0, 6);
  const contact = store.contact || {};
  const primaryPhone = (contact.primaryWhatsAppNumber || '+917905724673').replace(/[^0-9]/g, '');

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E2229]">
      {/* ========================================================
          01. HERO SECTION
          ======================================================== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#E8DFD5] via-[#FAF8F5] to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Brand Tag / Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE4DC]/80 border border-[#DDD3C7] text-xs font-semibold tracking-[0.15em] uppercase text-[#735D43]">
                <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
                <span>Boutique Homestays & Serviced Apartments</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181A1F] leading-[1.12]">
                Stay Different. <br />
                <span className="italic font-normal text-[#8C7355]">Feel at Home.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-[#555C66] max-w-xl font-normal leading-relaxed">
                Comfortable stays, thoughtful spaces and authentic local experiences in{' '}
                <strong className="font-semibold text-[#181A1F]">Varanasi</strong> and{' '}
                <strong className="font-semibold text-[#181A1F]">Lucknow</strong>. Designed for families, group pilgrimages, and discerning travelers.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/stays')}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-[#FAF8F5] font-semibold text-sm tracking-wider shadow-[0_6px_20px_rgba(30,34,41,0.2)] hover:shadow-[0_10px_25px_rgba(30,34,41,0.28)] transition-all transform active:scale-95"
                >
                  <span>EXPLORE STAYS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('/request-booking')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F2ECE3] border border-[#DDD3C7] text-[#1E2229] font-semibold text-sm tracking-wider shadow-sm transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#8C7355]" />
                  <span>REQUEST A STAY</span>
                </button>

                <WhatsAppButton
                  destination="varanasi"
                  label="WHATSAPP US"
                  variant="pill"
                  className="py-3 px-5 text-sm"
                />
              </div>

              {/* Quick Trust Signals */}
              <div className="pt-6 border-t border-[#E8DFD5] grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1E2229]">6 Units</div>
                  <div className="text-xs text-[#7D756C]">Same building in Varanasi</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1E2229]">2000 sq ft</div>
                  <div className="text-xs text-[#7D756C]">Spacious Lucknow 3BHK</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1E2229]">24/7</div>
                  <div className="text-xs text-[#7D756C]">On-premises caretakers</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual with Subtle 3D Floating Elements */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card with Perspective */}
                <FloatCard depth={7} elevation="lg" className="rounded-3xl p-2.5 bg-white">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
                    <img
                      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                      alt="ZoomStay luxury living area"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    {/* Overlay Property Detail */}
                    <div className="absolute bottom-5 inset-x-5 text-white">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#8C7355] text-[11px] font-semibold tracking-wider uppercase mb-2">
                        Varanasi Cantonment
                      </span>
                      <h3 className="font-serif text-xl font-bold leading-snug">
                        3BHK Homestay Apartment
                      </h3>
                      <p className="text-xs text-stone-200 mt-1 line-clamp-2">
                        Opposite Varuna Garden Society • 2 km to Ramada & Taj • Kashi Vishwanath ~5.5 km
                      </p>
                    </div>
                  </div>
                </FloatCard>

                {/* Floating Badge 1: Top Right */}
                <div className="absolute -top-6 -right-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#E8DFD5] animate-bounce-subtle">
                  <div className="w-10 h-10 rounded-xl bg-[#8C7355]/15 flex items-center justify-center text-[#8C7355]">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div className="pr-2">
                    <div className="text-xs font-bold text-[#1E2229]">King Size Beds</div>
                    <div className="text-[11px] text-[#7D756C]">Orthopedic Comfort</div>
                  </div>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#E8DFD5]">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center text-[#1B8040]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="pr-2">
                    <div className="text-xs font-bold text-[#1E2229]">Gated Society Security</div>
                    <div className="text-[11px] text-[#7D756C]">Peaceful Residential Enclave</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          02. BRAND STORY: COMFORT. CULTURE. CONNECTION.
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-white border-y border-[#EBE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 lg:mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
              OUR PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2229]">
              Comfort. Culture. Connection.
            </h2>
            <p className="text-sm text-[#555C66] leading-relaxed">
              Every ZoomStay residence is purposefully chosen to bridge the warmth of private residential living with the character of heritage and modern destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Comfort */}
            <FloatCard depth={5} className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F4EFEA] flex items-center justify-center text-[#8C7355] mb-6">
                  <BedDouble className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E2229] mb-3">
                  Comfort
                </h3>
                <p className="text-sm text-[#555C66] leading-relaxed">
                  Feel at home with spacious apartments, comfortable king beds, modern kitchens, private balconies, and essential amenities crafted for restorative relaxation.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#F0ECE4] text-xs font-semibold text-[#8C7355] uppercase tracking-wider">
                Private • Spacious • Homely
              </div>
            </FloatCard>

            {/* Card 2: Culture */}
            <FloatCard depth={5} className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F4EFEA] flex items-center justify-center text-[#8C7355] mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E2229] mb-3">
                  Culture
                </h3>
                <p className="text-sm text-[#555C66] leading-relaxed">
                  Discover the authentic character of Varanasi and Lucknow — from dawn boat rides on the sacred Ganga to evening strolls through regal Awadhi bazaars and heritage corridors.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#F0ECE4] text-xs font-semibold text-[#8C7355] uppercase tracking-wider">
                Ghats • Temples • Awadhi Heritage
              </div>
            </FloatCard>

            {/* Card 3: Connection */}
            <FloatCard depth={5} className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#F4EFEA] flex items-center justify-center text-[#8C7355] mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E2229] mb-3">
                  Connection
                </h3>
                <p className="text-sm text-[#555C66] leading-relaxed">
                  Create lasting memories with family, pilgrimage companions, and friends. Enjoy shared meals around the dining table and gather together in large private living salons.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#F0ECE4] text-xs font-semibold text-[#8C7355] uppercase tracking-wider">
                Family Stays • Group Pilgrimages
              </div>
            </FloatCard>
          </div>
        </div>
      </section>


      {/* ========================================================
          03. FEATURED PROPERTIES
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-14 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
                OUR ACCOMMODATIONS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2229] mt-2">
                Featured Stays in Varanasi & Lucknow
              </h2>
              <p className="text-sm text-[#555C66] max-w-xl mt-2">
                Explore our boutique apartments and homestays. Each property is maintained to pristine hospitality standards with dedicated caretakers and complete kitchens.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/stays')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8C7355] hover:text-[#1E2229] transition group"
            >
              <span>View All Accommodations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredProperties.map((prop) => {
            const showPrice = store.siteSettings.publicPricingEnabled && prop.pricing.enabled;

            return (
              <FloatCard key={prop.id} depth={6} elevation="lg" className="flex flex-col h-full group">
                {/* Property Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={prop.coverImage}
                    alt={prop.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#1E2229]/80 backdrop-blur-md text-white text-[11px] font-semibold tracking-wider uppercase">
                      {prop.destinationName}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1E2229] text-[11px] font-semibold">
                      {prop.propertyType}
                    </span>
                  </div>
                </div>

                {/* Property Content */}
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

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F0EBE3] text-xs text-[#4A4238] font-medium">
                      <div className="flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-[#8C7355]" />
                        <span>{prop.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-[#8C7355]" />
                        <span>{prop.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#8C7355]" />
                        <span>Up to {prop.maxGuests}</span>
                      </div>
                    </div>

                    {prop.buildingInfo && (
                      <div className="mt-3 text-[11px] bg-[#FAF8F5] text-[#735D43] px-3 py-1.5 rounded-lg border border-[#EDE5DB]">
                        ✨ {prop.buildingInfo}
                      </div>
                    )}
                  </div>

                  {/* Pricing and Action Buttons */}
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
        </div>
      </section>


      {/* ========================================================
          04. DESTINATIONS (SPLIT-SCREEN EDITORIAL DESIGN)
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-[#F4EFEA] border-y border-[#E2D8CC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 lg:mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
              OUR CITIES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2229]">
              Explore by Destination
            </h2>
            <p className="text-sm text-[#555C66]">
              Whether seeking the spiritual aura of ancient Kashi or the royal Awadhi elegance and modern sporting events of Lucknow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Destination 1: Varanasi */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group min-h-[440px] flex flex-col justify-end p-8 sm:p-10">
              <img
                src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80"
                alt="Varanasi Ganga Ghats"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="relative z-10 text-white space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#8C7355] text-xs font-semibold tracking-widest uppercase">
                  Varanasi
                </span>
                <h3 className="font-serif text-3xl font-bold">
                  The Spiritual Heart of India
                </h3>
                <p className="text-sm text-stone-200 leading-relaxed max-w-md">
                  ZoomStay Cantonment features 6 fully furnished 3BHK homestay units in the same building. Only 2 km to Hotel Ramada & Taj, 5.5 km to Kashi Vishwanath corridor, and 7 km to Sarnath.
                </p>

                <div className="pt-3 flex items-center gap-4">
                  <button
                    onClick={() => onNavigate('/destinations/varanasi')}
                    className="px-5 py-2.5 rounded-xl bg-white text-[#1E2229] text-xs font-bold tracking-wider hover:bg-stone-100 transition flex items-center gap-2"
                  >
                    <span>EXPLORE VARANASI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('/request-booking?destination=varanasi')}
                    className="text-xs text-stone-200 hover:text-white font-medium underline underline-offset-4"
                  >
                    Book Varanasi Stay
                  </button>
                </div>
              </div>
            </div>

            {/* Destination 2: Lucknow */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group min-h-[440px] flex flex-col justify-end p-8 sm:p-10">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                alt="Lucknow Luxury Residence"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="relative z-10 text-white space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#8C7355] text-xs font-semibold tracking-widest uppercase">
                  Lucknow
                </span>
                <h3 className="font-serif text-3xl font-bold">
                  Heritage, Sports & Luxury Shopping
                </h3>
                <p className="text-sm text-stone-200 leading-relaxed max-w-md">
                  Grand 2000 sq ft 3BHK in Spring Garden Society near Phoenix Palassio (1 km) and Ekana Stadium (2 km), plus peaceful 2BHK near Lulu Mall along Shaheed Path.
                </p>

                <div className="pt-3 flex items-center gap-4">
                  <button
                    onClick={() => onNavigate('/destinations/lucknow')}
                    className="px-5 py-2.5 rounded-xl bg-white text-[#1E2229] text-xs font-bold tracking-wider hover:bg-stone-100 transition flex items-center gap-2"
                  >
                    <span>EXPLORE LUCKNOW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('/request-booking?destination=lucknow')}
                    className="text-xs text-stone-200 hover:text-white font-medium underline underline-offset-4"
                  >
                    Book Lucknow Stay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          05. CORE AMENITIES (CMS CONTROLLED)
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-white border-b border-[#EBE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 lg:mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
              HOSPITALITY STANDARDS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2229]">
              Thoughtfully Crafted Amenities
            </h2>
            <p className="text-sm text-[#555C66]">
              Every ZoomStay property is equipped with genuine home comforts and full hotel-grade amenities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((item) => (
              <FloatCard
                key={item.id}
                depth={4}
                elevation="sm"
                className="p-6 text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC] flex items-center justify-center text-[#8C7355] shadow-sm">
                  {item.category === 'bed' && <BedDouble className="w-6 h-6" />}
                  {item.category === 'climate' && <Wind className="w-6 h-6" />}
                  {item.category === 'kitchen' && <UtensilsCrossed className="w-6 h-6" />}
                  {item.category === 'tech' && <Tv className="w-6 h-6" />}
                  {item.category === 'service' && <Users className="w-6 h-6" />}
                  {item.category === 'connectivity' && <Wifi className="w-6 h-6" />}
                  {item.category === 'dining' && <UtensilsCrossed className="w-6 h-6" />}
                  {item.category === 'parking' && <Car className="w-6 h-6" />}
                </div>
                <h4 className="font-semibold text-sm text-[#1E2229]">{item.name}</h4>
                <p className="text-xs text-[#7D756C] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </FloatCard>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================
          06. VISUAL GALLERY TEASER
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-14 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
                MOMENTS & INTERIORS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2229] mt-2">
                A Glimpse Inside ZoomStay
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/gallery')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8C7355] hover:text-[#1E2229] transition group"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={img.id}
                onClick={() => openLightbox(i)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={img.url}
                  alt={img.alt || img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                  <span className="text-white text-xs font-semibold">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================
          07. TRAVELLING WITH A GROUP? (6 UNITS IN VARANASI)
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-[#1E2229] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#8C7355]/30 border border-[#8C7355]/50 text-xs font-semibold tracking-widest uppercase text-[#E8DFD5]">
                Group Stays & Family Pilgrimages
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Travelling with a Group? <br />
                <span className="text-[#C5B49E]">Multiple 3BHK Units in the Same Building.</span>
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
                ZoomStay Varanasi offers <strong className="text-white font-semibold">6 identical 3BHK units</strong> in one standalone building in the Cantonment area. Each unit features 3 king bedrooms, 2 washrooms, a spacious living salon, fully equipped kitchen, and balcony. Perfect for extended families, wedding groups, or corporate retreats desiring communal closeness with private apartment independence.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-serif text-xl font-bold text-[#C5B49E]">Up to 48 Guests</div>
                  <div className="text-xs text-stone-400">Full Building Capacity</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-serif text-xl font-bold text-[#C5B49E]">6 Living Salons</div>
                  <div className="text-xs text-stone-400">Independent Kitchens</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-serif text-xl font-bold text-[#C5B49E]">On-Site Caretaker</div>
                  <div className="text-xs text-stone-400">Dedicated Luggage Team</div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('/contact?type=Group+Stay')}
                  className="px-6 py-3 rounded-xl bg-[#C5B49E] hover:bg-white text-[#181A1F] text-xs font-bold tracking-wider transition"
                >
                  GROUP BOOKING ENQUIRY
                </button>
                <WhatsAppButton
                  destination="varanasi"
                  customMessage="Hello ZoomStay, I am planning a group stay in Varanasi and would like to enquire about reserving multiple units in your Cantonment building."
                  label="Enquire via WhatsApp"
                  variant="secondary"
                  className="bg-transparent border-stone-500 text-stone-200 hover:bg-white/10"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
                  alt="Multi-unit building Varanasi"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          08. STAYING LONGER? (EXTENDED STAYS & WORKATIONS)
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-white border-y border-[#EBE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#FAF8F5] to-[#F2EDE7] border border-[#E8DFD5] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
                  EXTENDED STAYS & WORKATIONS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2229]">
                  Staying Longer in Varanasi or Lucknow?
                </h2>
                <p className="text-sm text-[#555C66] leading-relaxed max-w-2xl">
                  Planning a month-long workation, sabbatical, or extended medical/visiting assignment? Enjoy high-speed fiber broadband, dedicated work desks, full modular kitchenettes for daily cooking, and customized housekeeping cycles.
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#4A4238] pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#8C7355]" /> High-Speed 150+ Mbps WiFi
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#8C7355]" /> Flexible Bi-Weekly Cleaning
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#8C7355]" /> Full Functional Kitchen
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <button
                  onClick={() => onNavigate('/contact?type=Long+Stay')}
                  className="px-6 py-3.5 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider transition text-center"
                >
                  ENQUIRE FOR LONG STAY
                </button>
                <WhatsAppButton
                  destination="lucknow"
                  customMessage="Hello ZoomStay, I would like to enquire about extended long stay accommodation options and rates."
                  label="Long Stay WhatsApp"
                  variant="minimal"
                  className="justify-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          09. GUEST REVIEWS (REAL CMS TESTIMONIALS)
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 lg:mb-14">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
              VERIFIED GUEST EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2229]">
              Memories Made at ZoomStay
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredReviews.map((rev) => (
              <FloatCard key={rev.id} depth={4} className="p-8 flex flex-col justify-between h-full bg-white">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#8C7355]">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#444C57] italic leading-relaxed font-serif">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E8DFD5] flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-[#1E2229]">{rev.guestName}</div>
                    <div className="text-xs text-[#7D756C]">{rev.location || rev.source}</div>
                  </div>
                  <span className="text-[11px] text-[#8C7355] font-medium">{rev.stayDate}</span>
                </div>
              </FloatCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('/reviews')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C7355] hover:text-[#1E2229] transition"
            >
              <span>Read All Guest Reviews or Leave Yours</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* ========================================================
          10. TRAVEL ASSISTANCE ("NEED HELP GETTING AROUND?")
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-white border-y border-[#EBE4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
              LOCAL CONCIERGE & TRANSIT
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1E2229]">
              Need Help Getting Around?
            </h2>
            <p className="text-sm text-[#555C66] leading-relaxed">
              Navigating ghats, booking authentic sunrise wooden boats, or organizing reliable cabs to Lal Bahadur Shastri Airport (VNS) or Chaudhary Charan Singh Airport (LKO)? Our on-site property managers and concierge will happily connect you with trusted local drivers and share step-by-step transit guidance.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-[#4A4238]">
                <CheckCircle2 className="w-5 h-5 text-[#8C7355] shrink-0 mt-0.5" />
                <span>
                  <strong>Airport & Station Pickups:</strong> Get direct connections to dependable local taxi operators.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#4A4238]">
                <CheckCircle2 className="w-5 h-5 text-[#8C7355] shrink-0 mt-0.5" />
                <span>
                  <strong>Ghat Morning Boats:</strong> Guidance on fair rates and best timings for peaceful Dashashwamedh and Assi boat experiences.
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#4A4238]">
                <CheckCircle2 className="w-5 h-5 text-[#8C7355] shrink-0 mt-0.5" />
                <span>
                  <strong>Ekana Stadium & Plassio Access:</strong> Hassle-free routes avoiding event congestion in Lucknow.
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${contact.varanasiContacts[0]?.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-semibold tracking-wider transition"
              >
                <Phone className="w-4 h-4 text-[#C5B49E]" />
                <span>Call Concierge Desk</span>
              </a>
              <WhatsAppButton
                destination="varanasi"
                customMessage="Hello ZoomStay, I need local travel/cab advice for my upcoming visit."
                label="WhatsApp Travel Team"
                variant="secondary"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <FloatCard depth={5} className="p-8 bg-[#FAF8F5] space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                Strategic Landmarks & Travel Times
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#8C7355] uppercase tracking-wider mb-2">
                    Varanasi Cantonment Stay
                  </h4>
                  <ul className="space-y-2 text-[#4A4238]">
                    <li className="flex justify-between pb-1 border-b border-[#F0ECE4]">
                      <span>Hotel Ramada & Taj Gateway:</span>
                      <strong className="text-[#1E2229]">~2 km (5 mins)</strong>
                    </li>
                    <li className="flex justify-between pb-1 border-b border-[#F0ECE4]">
                      <span>Kashi Vishwanath Corridor:</span>
                      <strong className="text-[#1E2229]">~5.5 km (18 mins)</strong>
                    </li>
                    <li className="flex justify-between pb-1 border-b border-[#F0ECE4]">
                      <span>Ghats of Ganga:</span>
                      <strong className="text-[#1E2229]">~6–10 km (22 mins)</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Sarnath Buddhist Monument:</span>
                      <strong className="text-[#1E2229]">~7 km (20 mins)</strong>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-[#8C7355] uppercase tracking-wider mb-2">
                    Lucknow Spring Garden & Lulu
                  </h4>
                  <ul className="space-y-2 text-[#4A4238]">
                    <li className="flex justify-between pb-1 border-b border-[#F0ECE4]">
                      <span>Phoenix Palassio Luxury Mall:</span>
                      <strong className="text-[#1E2229]">1 km (3 mins)</strong>
                    </li>
                    <li className="flex justify-between pb-1 border-b border-[#F0ECE4]">
                      <span>Ekana Cricket Stadium:</span>
                      <strong className="text-[#1E2229]">2 km (5 mins)</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Lulu Mall Lucknow:</span>
                      <strong className="text-[#1E2229]">~1.2 km / 6 km</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </FloatCard>
          </div>
        </div>
        </div>
      </section>


      {/* ========================================================
          11. FINAL BOOKING CTA BANNER
          ======================================================== */}
      <section className="py-20 lg:py-24 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-16 rounded-3xl bg-[#181A1F] text-white shadow-2xl space-y-6">
            <span className="text-xs uppercase tracking-[0.24em] font-semibold text-[#C5B49E]">
              EXPERIENCE AUTHENTIC HOSPITALITY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              Ready to Feel at Home in Varanasi & Lucknow?
            </h2>
            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Book direct with ZoomStay for guaranteed availability, personal caretaker attention, and dedicated group arrangements.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('/request-booking')}
                className="px-8 py-4 rounded-xl bg-[#C5B49E] hover:bg-white text-[#181A1F] text-xs font-bold tracking-widest uppercase shadow-lg transition"
              >
                REQUEST A STAY NOW
              </button>
              <WhatsAppButton
                destination="varanasi"
                label="CHAT ON WHATSAPP"
                variant="secondary"
                className="border-white/30 text-white hover:bg-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for Gallery previews */}
      <LightboxModal
        isOpen={lightboxOpen}
        images={galleryImages}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
