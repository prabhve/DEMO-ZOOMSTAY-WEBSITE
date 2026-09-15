import React, { useState, useEffect } from 'react';
import { CmsProvider } from './context/CmsContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingConcierge } from './components/ui/WhatsAppButton';

// Public Pages
import { HomePage } from './pages/HomePage';
import { StaysPage } from './pages/StaysPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { DestinationsOverviewPage } from './pages/DestinationsOverviewPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { BookingRequestPage } from './pages/BookingRequestPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ExplorePage } from './pages/ExplorePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminPortalPage } from './pages/admin/AdminPortalPage';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (fullPath: string) => {
    const [path, search] = fullPath.split('?');
    window.history.pushState({}, '', fullPath);
    setCurrentPath(path || '/');
    setSearchParams(new URLSearchParams(search || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ROUTING DISPATCH
  const renderCurrentPage = () => {
    // Admin Routes
    if (currentPath.startsWith('/admin')) {
      return <AdminPortalPage onNavigate={navigate} />;
    }

    // Property Detail Route: /stays/:slug
    if (currentPath.startsWith('/stays/')) {
      const slug = currentPath.replace('/stays/', '');
      return <PropertyDetailPage slug={slug} onNavigate={navigate} />;
    }

    // Destinations
    if (currentPath === '/destinations/varanasi') {
      return <DestinationDetailPage destinationId="varanasi" onNavigate={navigate} />;
    }
    if (currentPath === '/destinations/lucknow') {
      return <DestinationDetailPage destinationId="lucknow" onNavigate={navigate} />;
    }
    if (currentPath === '/destinations') {
      return <DestinationsOverviewPage onNavigate={navigate} />;
    }

    // Stays list
    if (currentPath === '/stays') {
      const dest = searchParams.get('destination') || 'all';
      return <StaysPage onNavigate={navigate} initialDestination={dest} />;
    }

    // Booking Request Page
    if (currentPath === '/request-booking') {
      return (
        <BookingRequestPage
          onNavigate={navigate}
          preselectedPropertyId={searchParams.get('property') || undefined}
          preselectedUnitId={searchParams.get('unit') || undefined}
          preselectedDestination={searchParams.get('destination') || undefined}
        />
      );
    }

    // Gallery
    if (currentPath === '/gallery') {
      return <GalleryPage onNavigate={navigate} />;
    }

    // About
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    // Explore / City Guide
    if (currentPath === '/explore') {
      return <ExplorePage onNavigate={navigate} />;
    }

    // Reviews
    if (currentPath === '/reviews') {
      return <ReviewsPage onNavigate={navigate} />;
    }

    // Contact
    if (currentPath === '/contact') {
      return (
        <ContactPage
          onNavigate={navigate}
          defaultEnquiryType={searchParams.get('type') || undefined}
        />
      );
    }

    // Policies
    if (currentPath === '/policies') {
      return <PoliciesPage initialTab="policies" />;
    }
    if (currentPath === '/privacy-policy') {
      return <PoliciesPage initialTab="privacy" />;
    }
    if (currentPath === '/terms-conditions') {
      return <PoliciesPage initialTab="terms" />;
    }

    // Default Home
    return <HomePage onNavigate={navigate} />;
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1E2229] selection:bg-[#8C7355]/20 selection:text-[#181A1F] overflow-x-hidden">
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-grow">{renderCurrentPage()}</main>

      {!isAdminRoute && <Footer onNavigate={navigate} />}

      {/* Floating WhatsApp Concierge Drawer */}
      <FloatingConcierge />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <AppContent />
    </CmsProvider>
  );
}
