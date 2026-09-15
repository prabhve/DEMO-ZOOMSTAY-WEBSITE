import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CmsStore,
  Property,
  Unit,
  Amenity,
  Destination,
  ExploreContent,
  GalleryImage,
  Review,
  BookingRequest,
  Enquiry,
  PolicyData,
  ContactSettings,
  NotificationSettings,
  SeoSettings,
  SiteSettings,
} from '../types';
import { initialCmsData } from '../data/initialData';

interface CmsContextType {
  store: CmsStore;
  isLoading: boolean;
  error: string | null;
  refreshCms: () => Promise<void>;
  refreshStore: () => Promise<void>;
  
  // Admin Auth
  isAdmin: boolean;
  adminToken: string | null;
  loginAdmin: (password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;

  // Public Submissions
  submitBooking: (bookingData: Partial<BookingRequest>) => Promise<{ success: boolean; booking?: BookingRequest; message?: string }>;
  submitEnquiry: (enquiryData: Partial<Enquiry>) => Promise<{ success: boolean; enquiry?: Enquiry; message?: string }>;
  submitReview: (reviewData: Partial<Review>) => Promise<{ success: boolean; message?: string }>;
  addReview: (reviewData: Partial<Review>) => Promise<{ success: boolean; message?: string }>;

  // Admin Mutations
  createProperty: (prop: Partial<Property>) => Promise<Property>;
  updateProperty: (id: string, prop: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<void>;

  createUnit: (unit: Partial<Unit>) => Promise<Unit>;
  addUnit: (unit: Partial<Unit>) => Promise<Unit>;
  updateUnit: (id: string, unit: Partial<Unit>) => Promise<Unit>;
  deleteUnit: (id: string) => Promise<void>;

  createAmenity: (amenity: Partial<Amenity>) => Promise<Amenity>;
  updateAmenity: (id: string, amenity: Partial<Amenity>) => Promise<Amenity>;
  deleteAmenity: (id: string) => Promise<void>;

  updateDestination: (id: string, dest: Partial<Destination>) => Promise<Destination>;

  createExplore: (article: Partial<ExploreContent>) => Promise<ExploreContent>;
  updateExplore: (id: string, article: Partial<ExploreContent>) => Promise<ExploreContent>;
  deleteExplore: (id: string) => Promise<void>;

  createGalleryImage: (img: Partial<GalleryImage>) => Promise<GalleryImage>;
  addGalleryImage: (img: Partial<GalleryImage>) => Promise<GalleryImage>;
  updateGalleryImage: (id: string, img: Partial<GalleryImage>) => Promise<GalleryImage>;
  deleteGalleryImage: (id: string) => Promise<void>;

  updateReviewStatus: (id: string, updates: Partial<Review>) => Promise<Review>;
  updateReview: (id: string, updates: Partial<Review>) => Promise<Review>;
  deleteReview: (id: string) => Promise<void>;

  updateBookingStatus: (id: string, updates: Partial<BookingRequest>) => Promise<BookingRequest>;
  deleteBooking: (id: string) => Promise<void>;

  updateEnquiryStatus: (id: string, updates: Partial<Enquiry>) => Promise<Enquiry>;
  deleteEnquiry: (id: string) => Promise<void>;

  updateContact: (settings: Partial<ContactSettings>) => Promise<ContactSettings>;
  updatePolicies: (policies: Partial<PolicyData>) => Promise<PolicyData>;
  updateNotifications: (settings: Partial<NotificationSettings>) => Promise<NotificationSettings>;
  sendTestEmail: (toEmail: string) => Promise<any>;
  testEmailNotification: (toEmail: string) => Promise<any>;
  updateSeo: (seo: Partial<SeoSettings>) => Promise<SeoSettings>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<SiteSettings>;
  resetToDefault: () => Promise<void>;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<CmsStore>(initialCmsData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('zoomstay_admin_token');
  });
  const isAdmin = Boolean(adminToken);

  const fetchCmsData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/cms');
      if (!res.ok) throw new Error('Failed to fetch CMS data');
      const data = await res.json();
      const mergedStore: CmsStore = {
        ...initialCmsData,
        ...data,
        properties: data.properties || initialCmsData.properties || [],
        units: data.units || initialCmsData.units || [],
        amenities: data.amenities || initialCmsData.amenities || [],
        destinations: (data.destinations || initialCmsData.destinations || []).map((d: any) => {
          const initD = initialCmsData.destinations.find((id) => id.id === d.id);
          return {
            ...initD,
            ...d,
            state: d.state || initD?.state || 'Uttar Pradesh',
            whyStayReasons: d.whyStayReasons && d.whyStayReasons.length ? d.whyStayReasons : (initD?.whyStayReasons || d.highlights || []),
            highlights: d.highlights || initD?.highlights || [],
          };
        }),
        explore: data.explore || initialCmsData.explore || [],
        attractions: data.attractions || initialCmsData.attractions || [],
        gallery: data.gallery || initialCmsData.gallery || [],
        reviews: data.reviews || initialCmsData.reviews || [],
        bookings: data.bookings || initialCmsData.bookings || [],
        enquiries: data.enquiries || initialCmsData.enquiries || [],
        emailLogs: data.emailLogs || data.notifications?.emailLogs || initialCmsData.notifications?.emailLogs || [],
        contact: { ...initialCmsData.contact, ...(data.contact || {}) },
        policies: { ...initialCmsData.policies, ...(data.policies || {}) },
        notifications: {
          ...initialCmsData.notifications,
          ...(data.notifications || {}),
          emailLogs: data.notifications?.emailLogs || data.emailLogs || initialCmsData.notifications?.emailLogs || [],
        },
        seo: { ...initialCmsData.seo, ...(data.seo || {}) },
        siteSettings: { ...initialCmsData.siteSettings, ...(data.siteSettings || {}) },
      };
      setStore(mergedStore);
      setError(null);
    } catch (err: any) {
      console.warn('API error, falling back to local dataset:', err);
      setError(err.message || 'Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCmsData();
  }, [fetchCmsData]);

  const loginAdmin = async (password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        localStorage.setItem('zoomstay_admin_token', data.token);
        return { success: true };
      }
      return { success: false, message: data.message || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    localStorage.removeItem('zoomstay_admin_token');
  };

  const submitBooking = async (bookingData: Partial<BookingRequest>) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking submission failed');
      await fetchCmsData();
      return { success: true, booking: data.booking, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const submitEnquiry = async (enquiryData: Partial<Enquiry>) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Enquiry submission failed');
      await fetchCmsData();
      return { success: true, enquiry: data.enquiry, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const submitReview = async (reviewData: Partial<Review>) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Review submission failed');
      await fetchCmsData();
      return { success: true, message: 'Thank you! Your review has been submitted for moderation.' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // Property mutations
  const createProperty = async (prop: Partial<Property>) => {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prop),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updateProperty = async (id: string, prop: Partial<Property>) => {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prop),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const deleteProperty = async (id: string) => {
    await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    await fetchCmsData();
  };

  // Unit mutations
  const createUnit = async (unit: Partial<Unit>) => {
    const res = await fetch('/api/units', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unit),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updateUnit = async (id: string, unit: Partial<Unit>) => {
    const res = await fetch(`/api/units/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unit),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const deleteUnit = async (id: string) => {
    await fetch(`/api/units/${id}`, { method: 'DELETE' });
    await fetchCmsData();
  };

  // Amenities
  const createAmenity = async (amenity: Partial<Amenity>) => {
    const res = await fetch('/api/amenities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(amenity),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updateAmenity = async (id: string, amenity: Partial<Amenity>) => {
    const res = await fetch(`/api/amenities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(amenity),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const deleteAmenity = async (id: string) => {
    await fetch(`/api/amenities/${id}`, { method: 'DELETE' });
    await fetchCmsData();
  };

  // Destination
  const updateDestination = async (id: string, dest: Partial<Destination>) => {
    const res = await fetch(`/api/destinations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dest),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  // Explore
  const createExplore = async (article: Partial<ExploreContent>) => {
    const res = await fetch('/api/explore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updateExplore = async (id: string, article: Partial<ExploreContent>) => {
    const res = await fetch(`/api/explore/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const deleteExplore = async (id: string) => {
    await fetch(`/api/explore/${id}`, { method: 'DELETE' });
    await fetchCmsData();
  };

  // Gallery
  const createGalleryImage = async (img: Partial<GalleryImage>) => {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(img),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updateGalleryImage = async (id: string, img: Partial<GalleryImage>) => {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(img),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const deleteGalleryImage = async (id: string) => {
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    await fetchCmsData();
  };

  // Reviews
  const updateReviewStatus = async (id: string, updates: Partial<Review>) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const deleteReview = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    await fetchCmsData();
  };

  // Bookings
  const updateBookingStatus = async (id: string, updates: Partial<BookingRequest>) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const deleteBooking = async (id: string) => {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    await fetchCmsData();
  };

  // Enquiries
  const updateEnquiryStatus = async (id: string, updates: Partial<Enquiry>) => {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const deleteEnquiry = async (id: string) => {
    await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    await fetchCmsData();
  };

  // Settings & Policies
  const updateContact = async (settings: Partial<ContactSettings>) => {
    const res = await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updatePolicies = async (policies: Partial<PolicyData>) => {
    const res = await fetch('/api/policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policies),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updateNotifications = async (settings: Partial<NotificationSettings>) => {
    const res = await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const sendTestEmail = async (toEmail: string) => {
    const res = await fetch('/api/email/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: toEmail }),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updateSeo = async (seo: Partial<SeoSettings>) => {
    const res = await fetch('/api/seo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seo),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    await fetchCmsData();
    return data;
  };

  const resetToDefault = async () => {
    await fetch('/api/cms/reset', { method: 'POST' });
    await fetchCmsData();
  };

  return (
    <CmsContext.Provider
      value={{
        store,
        isLoading,
        error,
        refreshCms: fetchCmsData,
        refreshStore: fetchCmsData,
        isAdmin,
        adminToken,
        loginAdmin,
        logoutAdmin,
        submitBooking,
        submitEnquiry,
        submitReview,
        addReview: submitReview,
        createProperty,
        updateProperty,
        deleteProperty,
        createUnit,
        addUnit: createUnit,
        updateUnit,
        deleteUnit,
        createAmenity,
        updateAmenity,
        deleteAmenity,
        updateDestination,
        createExplore,
        updateExplore,
        deleteExplore,
        createGalleryImage,
        addGalleryImage: createGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
        updateReviewStatus,
        updateReview: updateReviewStatus,
        deleteReview,
        updateBookingStatus,
        deleteBooking,
        updateEnquiryStatus,
        deleteEnquiry,
        updateContact,
        updatePolicies,
        updateNotifications,
        sendTestEmail,
        testEmailNotification: sendTestEmail,
        updateSeo,
        updateSiteSettings,
        resetToDefault,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
