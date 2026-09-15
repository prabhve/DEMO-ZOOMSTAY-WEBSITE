import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { store } = useCms();
  const contact = store.contact;

  return (
    <footer className="bg-[#181A1F] text-[#FAF8F5] pt-20 pb-12 border-t border-[#2A2E35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#2A2E35]">
          
          {/* Col 1: Brand Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-[0.14em] text-white">
                ZOOMSTAY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5B49E]" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#C5B49E]">
              {store.siteSettings.tagline || 'Comfort, Culture & Connect'}
            </p>
            <p className="text-sm text-[#9FA6B2] max-w-sm leading-relaxed pt-1">
              "Feel at home while experiencing the character of the city." Modern boutique homestays and serviced apartments designed for mindful travelers, extended families, and group pilgrimages in Varanasi and Lucknow.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-[#9FA6B2]">
              <a
                href={contact.socialLinks.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5B49E] transition"
              >
                Instagram
              </a>
              <span>•</span>
              <a
                href={contact.socialLinks.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5B49E] transition"
              >
                Facebook
              </a>
              <span>•</span>
              <a
                href={contact.socialLinks.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5B49E] transition"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a
                href={contact.socialLinks.youtube || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C5B49E] transition"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[#C5B49E]">
              EXPLORE
            </h4>
            <ul className="space-y-2 text-sm text-[#9FA6B2]">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/stays')} className="hover:text-white transition">
                  All Stays & Apartments
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/destinations/varanasi')} className="hover:text-white transition">
                  Varanasi Properties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/destinations/lucknow')} className="hover:text-white transition">
                  Lucknow Properties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/gallery')} className="hover:text-white transition">
                  Visual Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition">
                  About Our Brand
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/explore')} className="hover:text-white transition">
                  City Guides & Attractions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/reviews')} className="hover:text-white transition">
                  Guest Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Varanasi Reservations Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[#C5B49E]">
              VARANASI DESK
            </h4>
            <div className="space-y-2 text-sm text-[#9FA6B2]">
              {(contact?.varanasiContacts || []).map((c, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xs text-white font-medium">{c.name}</span>
                  <div className="flex items-center gap-2 pt-0.5">
                    <a
                      href={`tel:${c.phone}`}
                      className="hover:text-[#C5B49E] transition flex items-center gap-1 text-xs"
                    >
                      <Phone className="w-3 h-3 text-[#C5B49E]" />
                      {c.phone}
                    </a>
                    {c.isWhatsApp && (
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20I%20would%20like%20to%20enquire%20about%20ZoomStay%20Varanasi.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:opacity-80 transition"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              <div className="pt-2 text-xs text-stone-400">
                <p className="font-medium text-stone-300">Location:</p>
                <p className="leading-snug">{contact?.varanasiAddress}</p>
                <p className="text-[11px] text-stone-500 mt-1">Opposite Varuna Garden Society, Cantonment</p>
              </div>
            </div>
          </div>

          {/* Col 4: Lucknow Desk & Booking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-[#C5B49E]">
              LUCKNOW DESK & DIRECT
            </h4>
            <div className="space-y-2 text-sm text-[#9FA6B2]">
              {(contact?.lucknowContacts || []).map((c, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xs text-white font-medium">{c.name}</span>
                  <div className="flex items-center gap-2 pt-0.5">
                    <a
                      href={`tel:${c.phone}`}
                      className="hover:text-[#C5B49E] transition flex items-center gap-1 text-xs"
                    >
                      <Phone className="w-3 h-3 text-[#C5B49E]" />
                      {c.phone}
                    </a>
                    {c.isWhatsApp && (
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20I%20would%20like%20to%20enquire%20about%20ZoomStay%20Lucknow.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:opacity-80 transition"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-2 text-xs">
                <p className="font-medium text-stone-300">Central Email:</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[#C5B49E] hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Mail className="w-3 h-3" />
                  {contact.email}
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/request-booking')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#C5B49E] text-[#181A1F] text-xs font-bold hover:bg-white transition"
                >
                  <span>Request a Stay Online</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Policies & Admin */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#7D8490] gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {new Date().getFullYear()} ZOOMSTAY. All rights reserved.</span>
            <button onClick={() => onNavigate('/policies')} className="hover:text-white transition">
              Cancellation Policy
            </button>
            <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-white transition">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('/terms-conditions')} className="hover:text-white transition">
              Terms & Conditions
            </button>
            <button onClick={() => onNavigate('/policies')} className="hover:text-white transition">
              House Rules
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#C5B49E]">
              <Heart className="w-3 h-3 fill-current" />
              Crafted for Authentic Stays
            </span>
            <button
              onClick={() => onNavigate('/admin')}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 text-stone-400 hover:text-stone-200 transition text-[11px]"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
