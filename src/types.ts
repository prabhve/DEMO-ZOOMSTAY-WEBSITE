export type DestinationId = 'varanasi' | 'lucknow' | string;

export interface Amenity {
  id: string;
  name: string;
  category: 'bed' | 'climate' | 'kitchen' | 'tech' | 'service' | 'connectivity' | 'dining' | 'parking' | 'general';
  iconName: string;
  description: string;
  enabled: boolean;
  order: number;
}

export interface LocationHighlight {
  label: string;
  distance: string;
  time?: string;
  url?: string;
}

export interface PropertyPricing {
  enabled: boolean;
  basePricePerNight?: number;
  currency: string;
  unit: string;
  guestBasis: string;
  specialNote?: string;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  destinationId: DestinationId;
  destinationName: string;
  propertyType: string; // e.g. "3BHK Apartment / Homestay", "2BHK Apartment"
  address: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  areaSqFt?: number | string;
  bedsDescription: string;
  kitchenDetails: string;
  livingAreaDetails: string;
  parkingDetails: string;
  caretakerDetails: string;
  balconyDetails?: string;
  buildingInfo?: string; // e.g. "6 units in the same building, ideal for large group stays"
  unitsCount?: number;
  featured: boolean;
  active: boolean;
  order: number;
  pricing: PropertyPricing;
  locationHighlights: LocationHighlight[];
  amenityIds: string[];
  mapUrl?: string;
  directionsUrl?: string;
}

export type UnitStatus = 'Available' | 'Unavailable' | 'Maintenance' | 'Occupied';

export interface Unit {
  id: string;
  propertyId: string;
  propertyName: string;
  unitName: string; // e.g. "Unit 101", "Unit 201 - Upper Deluxe"
  floor: string;
  bedrooms: number;
  bathrooms: number;
  bedsDescription: string;
  capacity: number;
  amenities: string[];
  images: string[];
  status: UnitStatus;
  notes?: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  state?: string;
  tagline: string;
  description: string;
  heroImage: string;
  coverImage: string;
  highlights: string[];
  whyStayReasons?: string[];
  travelGuide: string;
  featured: boolean;
}

export type ExploreCategory = 
  | 'Ghats' 
  | 'Temples' 
  | 'Culture' 
  | 'Food' 
  | 'Heritage' 
  | 'Shopping' 
  | 'Sports' 
  | 'Local Experiences' 
  | 'Guide' 
  | 'Travel Tip';

export interface ExploreContent {
  id: string;
  slug: string;
  destinationId: DestinationId;
  title: string;
  category: ExploreCategory;
  shortDescription: string;
  fullContent: string;
  image: string;
  distance?: string;
  travelTime?: string;
  mapUrl?: string;
  externalUrl?: string;
  featured: boolean;
  publishDate: string;
  status: 'Published' | 'Draft';
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: 'All' | 'Varanasi' | 'Lucknow' | 'Bedrooms' | 'Living' | 'Kitchen' | 'Exterior' | 'Facilities' | 'Explore';
  propertyId?: string;
  featured: boolean;
  order: number;
  alt: string;
}

export interface Review {
  id: string;
  guestName: string;
  location?: string;
  stayDate: string;
  propertyId?: string;
  propertyName?: string;
  rating: number; // 1 - 5
  comment: string;
  source: string; // e.g. "Direct Guest", "Airbnb", "Google"
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

export type BookingStatus = 'New' | 'Contacted' | 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface BookingRequest {
  id: string;
  guestName: string;
  phone: string;
  email: string;
  destinationId: string;
  propertyId: string;
  propertyName: string;
  unitId?: string;
  unitName?: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  roomsCount: number;
  specialRequest?: string;
  preferredContactMethod: 'WhatsApp' | 'Phone' | 'Email';
  agreedTerms: boolean;
  status: BookingStatus;
  adminNotes?: string;
  createdAt: string;
}

export type EnquiryType = 
  | 'General' 
  | 'Booking' 
  | 'Property' 
  | 'Group Stay' 
  | 'Long Stay' 
  | 'Events' 
  | 'Other';

export type EnquiryStatus = 'New' | 'Contacted' | 'Resolved';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  enquiryType: EnquiryType;
  message: string;
  destinationInterest?: string;
  groupSize?: number;
  approxDates?: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface CancellationTier {
  timeframe: string;
  refundPercentage: number;
  note: string;
}

export interface PolicyData {
  privacyPolicy: string;
  cancellationPolicy: {
    summary: string;
    tiers: CancellationTier[];
    noShowEarlyDepartureRules: string;
    fullText: string;
  };
  termsConditions: string;
  houseRules: string[];
  bookingPolicy: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface StaffContact {
  name: string;
  phone: string;
  isWhatsApp: boolean;
  role: string;
}

export interface ContactSettings {
  brandName: string;
  tagline: string;
  email: string;
  varanasiContacts: StaffContact[];
  lucknowContacts: StaffContact[];
  primaryWhatsAppNumber: string;
  varanasiAddress: string;
  lucknowAddress: string;
  varanasiNearby: string;
  lucknowNearby: string;
  varanasiMapEmbedUrl: string;
  lucknowMapEmbedUrl: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  date: string;
  type: 'Booking Notification' | 'Booking Acknowledgement' | 'Enquiry Notification' | 'Test Email';
  status: 'Sent' | 'Logged (Simulated)' | 'Failed';
  details?: string;
}

export interface NotificationSettings {
  emailNotificationsEnabled: boolean;
  adminNotificationEmail: string;
  customerAcknowledgementEnabled: boolean;
  whatsappCtaNumberVaranasi: string;
  whatsappCtaNumberLucknow: string;
  emailLogs: EmailLog[];
}

export interface SeoSettings {
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
  canonicalBaseUrl: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  publicPricingEnabled: boolean;
  allowDirectBookingRequests: boolean;
  currencySymbol: string;
  currencyCode: string;
  adminNotificationEmail?: string;
}

export interface AttractionItem {
  id: string;
  destinationId: 'varanasi' | 'lucknow' | string;
  destinationName: string;
  title: string;
  description: string;
  imageUrl: string;
  distanceFromZoomStay: string;
  tips?: string;
}

export interface CmsStore {
  properties: Property[];
  units: Unit[];
  amenities: Amenity[];
  destinations: Destination[];
  explore: ExploreContent[];
  attractions: AttractionItem[];
  gallery: GalleryImage[];
  reviews: Review[];
  bookings: BookingRequest[];
  enquiries: Enquiry[];
  policies: PolicyData;
  contact: ContactSettings;
  notifications: NotificationSettings;
  emailLogs?: EmailLog[];
  seo: SeoSettings;
  siteSettings: SiteSettings;
}
