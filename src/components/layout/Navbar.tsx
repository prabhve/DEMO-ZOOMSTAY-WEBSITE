import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  MessageCircle,
  Calendar,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Image as ImageIcon,
  Compass,
  Star,
  FileText,
  Info,
  Phone,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { store, isAdmin } = useCms();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsDropdown, setDestinationsDropdown] = useState(false);
  const [discoverDropdown, setDiscoverDropdown] = useState(false);

  const destDropdownRef = useRef<HTMLDivElement>(null);
  const discoverDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        destDropdownRef.current &&
        !destDropdownRef.current.contains(event.target as Node)
      ) {
        setDestinationsDropdown(false);
      }
      if (
        discoverDropdownRef.current &&
        !discoverDropdownRef.current.contains(event.target as Node)
      ) {
        setDiscoverDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setDestinationsDropdown(false);
    setDiscoverDropdown(false);
  };

  const primaryPhone = store.contact.primaryWhatsAppNumber.replace(/[^0-9]/g, '');

  const isDestinationsActive =
    currentPath === '/destinations' || currentPath.startsWith('/destinations/');
  const isDiscoverActive =
    currentPath === '/gallery' ||
    currentPath === '/explore' ||
    currentPath === '/reviews' ||
    currentPath === '/policies';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 w-full ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(30,34,41,0.06)] border-b border-[#EBE4DC] py-2.5 sm:py-3'
          : 'bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-stone-200/40 py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Brand Identity - Logo & Subtitle */}
          <button
            onClick={() => handleLinkClick('/')}
            className="flex flex-col text-left group focus:outline-none shrink-0"
            title="ZoomStay - Home"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.12em] text-[#1E2229] group-hover:text-[#8C7355] transition-colors whitespace-nowrap">
                ZOOMSTAY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C7355]" />
            </div>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] font-medium text-[#7D756C] whitespace-nowrap">
              Comfort, Culture &amp; Connect
            </span>
          </button>

          {/* Desktop Navigation Menu (Clear, spacious, and luxury boutique hospitality focused) */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 min-w-0 mx-2 xl:mx-6">
            {/* Stays */}
            <button
              onClick={() => handleLinkClick('/stays')}
              className={`relative text-xs xl:text-sm font-semibold tracking-[0.04em] transition-all px-3 py-2 rounded-lg whitespace-nowrap ${
                currentPath.startsWith('/stays')
                  ? 'text-[#8C7355] bg-[#8C7355]/10'
                  : 'text-[#363A40] hover:text-[#8C7355] hover:bg-[#8C7355]/5'
              }`}
            >
              <span>STAYS</span>
              {currentPath.startsWith('/stays') && (
                <span className="absolute bottom-0 inset-x-3 h-0.5 bg-[#8C7355] rounded-full" />
              )}
            </button>

            {/* Destinations (With Hover & Click Dropdown) */}
            <div
              ref={destDropdownRef}
              className="relative"
              onMouseEnter={() => setDestinationsDropdown(true)}
              onMouseLeave={() => setDestinationsDropdown(false)}
            >
              <button
                onClick={() => setDestinationsDropdown(!destinationsDropdown)}
                className={`flex items-center gap-1 text-xs xl:text-sm font-semibold tracking-[0.04em] transition-all px-3 py-2 rounded-lg whitespace-nowrap ${
                  isDestinationsActive
                    ? 'text-[#8C7355] bg-[#8C7355]/10'
                    : 'text-[#363A40] hover:text-[#8C7355] hover:bg-[#8C7355]/5'
                }`}
              >
                <span>DESTINATIONS</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                    destinationsDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {destinationsDropdown && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl shadow-xl border border-[#EBE4DC] p-2 space-y-1">
                    <button
                      onClick={() => handleLinkClick('/destinations')}
                      className="w-full text-left px-3 py-2 text-[11px] font-bold text-stone-500 hover:text-[#8C7355] hover:bg-stone-50 rounded-lg transition uppercase tracking-wider flex items-center justify-between"
                    >
                      <span>All Destinations</span>
                      <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-normal">
                        2 Cities
                      </span>
                    </button>
                    <div className="border-t border-[#F0ECE4] my-1" />
                    <button
                      onClick={() => handleLinkClick('/destinations/varanasi')}
                      className="w-full text-left px-3 py-2.5 text-xs font-medium text-[#1E2229] hover:bg-[#FAF8F5] hover:text-[#8C7355] rounded-lg transition flex items-start gap-2.5"
                    >
                      <MapPin className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-stone-900">Varanasi Cantonment</div>
                        <div className="text-[11px] text-stone-500">6 Multi-unit serviced 3BHKs</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleLinkClick('/destinations/lucknow')}
                      className="w-full text-left px-3 py-2.5 text-xs font-medium text-[#1E2229] hover:bg-[#FAF8F5] hover:text-[#8C7355] rounded-lg transition flex items-start gap-2.5"
                    >
                      <MapPin className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-stone-900">Lucknow Gomti Nagar Ext</div>
                        <div className="text-[11px] text-stone-500">Near Palassio &amp; Lulu Mall</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Discover Dropdown (Organizing Gallery, City Guide, Reviews & Policies) */}
            <div
              ref={discoverDropdownRef}
              className="relative"
              onMouseEnter={() => setDiscoverDropdown(true)}
              onMouseLeave={() => setDiscoverDropdown(false)}
            >
              <button
                onClick={() => setDiscoverDropdown(!discoverDropdown)}
                className={`flex items-center gap-1 text-xs xl:text-sm font-semibold tracking-[0.04em] transition-all px-3 py-2 rounded-lg whitespace-nowrap ${
                  isDiscoverActive
                    ? 'text-[#8C7355] bg-[#8C7355]/10'
                    : 'text-[#363A40] hover:text-[#8C7355] hover:bg-[#8C7355]/5'
                }`}
              >
                <span>DISCOVER</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                    discoverDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {discoverDropdown && (
                <div className="absolute top-full left-0 pt-2 w-60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl shadow-xl border border-[#EBE4DC] p-2 space-y-1">
                    <button
                      onClick={() => handleLinkClick('/gallery')}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition flex items-center gap-2.5 ${
                        currentPath === '/gallery'
                          ? 'text-[#8C7355] font-bold bg-[#FAF8F5]'
                          : 'text-[#1E2229] hover:bg-[#FAF8F5] hover:text-[#8C7355]'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 text-[#8C7355]" />
                      <span>Photo Gallery</span>
                    </button>
                    <button
                      onClick={() => handleLinkClick('/explore')}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition flex items-center gap-2.5 ${
                        currentPath === '/explore'
                          ? 'text-[#8C7355] font-bold bg-[#FAF8F5]'
                          : 'text-[#1E2229] hover:bg-[#FAF8F5] hover:text-[#8C7355]'
                      }`}
                    >
                      <Compass className="w-4 h-4 text-[#8C7355]" />
                      <span>City &amp; Culture Guide</span>
                    </button>
                    <button
                      onClick={() => handleLinkClick('/reviews')}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition flex items-center gap-2.5 ${
                        currentPath === '/reviews'
                          ? 'text-[#8C7355] font-bold bg-[#FAF8F5]'
                          : 'text-[#1E2229] hover:bg-[#FAF8F5] hover:text-[#8C7355]'
                      }`}
                    >
                      <Star className="w-4 h-4 text-[#8C7355]" />
                      <span>Guest Reviews</span>
                    </button>
                    <div className="border-t border-[#F0ECE4] my-1" />
                    <button
                      onClick={() => handleLinkClick('/policies')}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition flex items-center gap-2.5 ${
                        currentPath === '/policies'
                          ? 'text-[#8C7355] font-bold bg-[#FAF8F5]'
                          : 'text-[#555C66] hover:bg-[#FAF8F5] hover:text-[#8C7355]'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-stone-400" />
                      <span>House &amp; Booking Policies</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* About */}
            <button
              onClick={() => handleLinkClick('/about')}
              className={`relative text-xs xl:text-sm font-semibold tracking-[0.04em] transition-all px-3 py-2 rounded-lg whitespace-nowrap ${
                currentPath === '/about'
                  ? 'text-[#8C7355] bg-[#8C7355]/10'
                  : 'text-[#363A40] hover:text-[#8C7355] hover:bg-[#8C7355]/5'
              }`}
            >
              <span>ABOUT</span>
              {currentPath === '/about' && (
                <span className="absolute bottom-0 inset-x-3 h-0.5 bg-[#8C7355] rounded-full" />
              )}
            </button>

            {/* Contact */}
            <button
              onClick={() => handleLinkClick('/contact')}
              className={`relative text-xs xl:text-sm font-semibold tracking-[0.04em] transition-all px-3 py-2 rounded-lg whitespace-nowrap ${
                currentPath === '/contact'
                  ? 'text-[#8C7355] bg-[#8C7355]/10'
                  : 'text-[#363A40] hover:text-[#8C7355] hover:bg-[#8C7355]/5'
              }`}
            >
              <span>CONTACT</span>
              {currentPath === '/contact' && (
                <span className="absolute bottom-0 inset-x-3 h-0.5 bg-[#8C7355] rounded-full" />
              )}
            </button>
          </nav>

          {/* Desktop Right Action Area - Guaranteed Inset & Clean Spacing */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* WhatsApp Quick CTA */}
            <a
              href={`https://wa.me/${primaryPhone}?text=Hello%20ZoomStay,%20I%20would%20like%20to%20enquire%20about%20your%20properties.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#25D366]/40 text-[#128C7E] bg-[#25D366]/5 text-xs font-semibold tracking-wider hover:bg-[#25D366]/15 transition-colors shrink-0"
              title="Chat with reservations on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
              <span className="hidden xl:inline">WHATSAPP</span>
            </a>

            {/* Primary Booking Request CTA */}
            <button
              onClick={() => handleLinkClick('/request-booking')}
              className="flex items-center gap-2 px-3.5 xl:px-4 py-2 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-[#FAF8F5] text-xs font-semibold tracking-[0.06em] shadow-[0_4px_16px_rgba(30,34,41,0.18)] hover:shadow-[0_6px_20px_rgba(30,34,41,0.25)] transition-all transform active:scale-95 shrink-0 whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C5B49E] shrink-0" />
              <span>REQUEST A STAY</span>
            </button>

            {/* Admin Portal Quick Access */}
            <button
              onClick={() => handleLinkClick(isAdmin ? '/admin' : '/admin/login')}
              className={`p-2 rounded-xl border transition shrink-0 ${
                isAdmin
                  ? 'border-[#8C7355] text-[#8C7355] bg-[#8C7355]/10 shadow-sm'
                  : 'border-stone-300/80 text-stone-400 hover:text-stone-700 hover:border-stone-400 bg-white/60'
              }`}
              title={isAdmin ? 'Admin Portal (Logged in)' : 'Admin Portal Access'}
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Mobile & Tablet Controls (< 1024px) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
            {/* Quick WhatsApp CTA on Mobile */}
            <a
              href={`https://wa.me/${primaryPhone}?text=Hello%20ZoomStay,%20I%20would%20like%20to%20enquire%20about%20your%20properties.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-[#25D366]/40 text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/20 transition shrink-0"
              title="Chat on WhatsApp"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </a>

            {/* Compact Request Stay CTA */}
            <button
              onClick={() => handleLinkClick('/request-booking')}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#1E2229] text-[#FAF8F5] text-[11px] sm:text-xs font-semibold whitespace-nowrap tracking-wide shrink-0 shadow-sm"
            >
              Request Stay
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1E2229] hover:bg-stone-200/60 transition focus:outline-none shrink-0"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#EBE4DC] px-5 sm:px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200 max-h-[calc(100vh-75px)] overflow-y-auto">
          <nav className="flex flex-col space-y-2.5">
            <button
              onClick={() => handleLinkClick('/')}
              className={`text-left text-sm font-semibold tracking-wider py-1.5 transition ${
                currentPath === '/' ? 'text-[#8C7355] font-bold' : 'text-[#2D3139]'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => handleLinkClick('/stays')}
              className={`text-left text-sm font-semibold tracking-wider py-1.5 transition ${
                currentPath.startsWith('/stays') ? 'text-[#8C7355] font-bold' : 'text-[#2D3139]'
              }`}
            >
              STAYS
            </button>
            <button
              onClick={() => handleLinkClick('/destinations')}
              className={`text-left text-sm font-semibold tracking-wider py-1.5 transition ${
                isDestinationsActive ? 'text-[#8C7355] font-bold' : 'text-[#2D3139]'
              }`}
            >
              DESTINATIONS
            </button>
            <div className="pl-3 border-l-2 border-[#8C7355]/40 space-y-1.5 my-1">
              <button
                onClick={() => handleLinkClick('/destinations/varanasi')}
                className="text-left text-xs font-medium text-stone-600 block py-1"
              >
                Varanasi Cantonment (6 Units)
              </button>
              <button
                onClick={() => handleLinkClick('/destinations/lucknow')}
                className="text-left text-xs font-medium text-stone-600 block py-1"
              >
                Lucknow (Palassio &amp; Lulu)
              </button>
            </div>
            <button
              onClick={() => handleLinkClick('/gallery')}
              className={`text-left text-sm font-semibold tracking-wider py-1.5 transition ${
                currentPath === '/gallery' ? 'text-[#8C7355] font-bold' : 'text-[#2D3139]'
              }`}
            >
              PHOTO GALLERY
            </button>
            <button
              onClick={() => handleLinkClick('/explore')}
              className={`text-left text-sm font-semibold tracking-wider py-1.5 transition ${
                currentPath === '/explore' ? 'text-[#8C7355] font-bold' : 'text-[#2D3139]'
              }`}
            >
              EXPLORE GUIDE
            </button>
            <button
              onClick={() => handleLinkClick('/reviews')}
              className={`text-left text-sm font-semibold tracking-wider py-1.5 transition ${
                currentPath === '/reviews' ? 'text-[#8C7355] font-bold' : 'text-[#2D3139]'
              }`}
            >
              GUEST REVIEWS
            </button>
            <button
              onClick={() => handleLinkClick('/about')}
              className={`text-left text-sm font-semibold tracking-wider py-1.5 transition ${
                currentPath === '/about' ? 'text-[#8C7355] font-bold' : 'text-[#2D3139]'
              }`}
            >
              ABOUT US
            </button>
            <button
              onClick={() => handleLinkClick('/contact')}
              className={`text-left text-sm font-semibold tracking-wider py-1.5 transition ${
                currentPath === '/contact' ? 'text-[#8C7355] font-bold' : 'text-[#2D3139]'
              }`}
            >
              CONTACT
            </button>
            <button
              onClick={() => handleLinkClick('/policies')}
              className={`text-left text-xs font-medium py-1 transition ${
                currentPath === '/policies' ? 'text-[#8C7355] font-semibold' : 'text-stone-500'
              }`}
            >
              Cancellation &amp; House Policies
            </button>
          </nav>

          <div className="pt-3 border-t border-[#EBE4DC] flex flex-col gap-2.5">
            <a
              href={`https://wa.me/${primaryPhone}?text=Hello%20ZoomStay,%20I%20would%20like%20to%20enquire%20about%20your%20stays.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white font-medium text-xs tracking-wider shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>CHAT ON WHATSAPP</span>
            </a>

            <button
              onClick={() => handleLinkClick(isAdmin ? '/admin' : '/admin/login')}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdmin ? 'Open Admin Portal' : 'Admin Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
