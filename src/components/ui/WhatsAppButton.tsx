import React, { useState } from 'react';
import { MessageCircle, ChevronDown, X, PhoneCall } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

interface WhatsAppButtonProps {
  destination?: 'varanasi' | 'lucknow' | string;
  propertyName?: string;
  customMessage?: string;
  variant?: 'primary' | 'secondary' | 'pill' | 'minimal';
  className?: string;
  label?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  destination = 'varanasi',
  propertyName,
  customMessage,
  variant = 'primary',
  className = '',
  label,
}) => {
  const { store } = useCms();
  const contact = store.contact;

  // Resolve telephone number based on destination
  let rawPhone = contact?.primaryWhatsAppNumber || '+917905724673';
  if (destination?.toLowerCase() === 'lucknow') {
    const lucknowList = contact?.lucknowContacts || [];
    const lko = lucknowList.find((c) => c.isWhatsApp) || lucknowList[0];
    if (lko) rawPhone = lko.phone;
  } else {
    const varanasiList = contact?.varanasiContacts || [];
    const vns = varanasiList.find((c) => c.isWhatsApp) || varanasiList[0];
    if (vns) rawPhone = vns.phone;
  }

  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  let defaultText = `Hello ZoomStay, I would like to enquire about staying in ${destination === 'lucknow' ? 'Lucknow' : 'Varanasi'}.`;
  if (propertyName) {
    defaultText = `Hello ZoomStay, I would like to enquire about ${propertyName}.`;
  }
  const messageToSend = customMessage || defaultText;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageToSend)}`;

  const buttonText = label || (propertyName ? 'Ask on WhatsApp' : 'WhatsApp Us');

  if (variant === 'pill') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#25D366]/10 text-[#1B8040] hover:bg-[#25D366]/20 transition-colors ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>{buttonText}</span>
      </a>
    );
  }

  if (variant === 'secondary') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#25D366] text-[#128C7E] font-medium hover:bg-[#25D366]/10 transition-all ${className}`}
      >
        <MessageCircle className="w-4 h-4 text-[#25D366]" />
        <span>{buttonText}</span>
      </a>
    );
  }

  if (variant === 'minimal') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-sm font-medium text-[#1B8040] hover:text-[#128C7E] transition-colors ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        <span>{buttonText}</span>
      </a>
    );
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-medium shadow-[0_4px_16px_rgba(37,211,102,0.25)] hover:bg-[#20bd5a] hover:shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition-all transform active:scale-95 ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-white" />
      <span>{buttonText}</span>
    </a>
  );
};

export const FloatingConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { store } = useCms();
  const contact = store.contact;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-[#EBE4DC] p-5 mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE3]">
            <div>
              <h4 className="font-semibold text-[#1E2229] text-sm">ZoomStay Concierge</h4>
              <p className="text-xs text-[#7D756C]">Instant direct reservations & enquiry</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              aria-label="Close concierge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="text-xs font-semibold text-[#8C7355] uppercase tracking-wider">
              Choose Destination Desk
            </div>

            {/* Varanasi Options */}
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-[#4A4238]">Varanasi Properties:</div>
              {(contact?.varanasiContacts || []).map((c, i) => (
                <a
                  key={i}
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20I%20would%20like%20to%20enquire%20about%20ZoomStay%20Varanasi.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-[#EDE7DF] transition text-left group"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#1E2229] group-hover:text-[#8C7355] transition">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-[#7D756C]">{c.role}</div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-[#1B8040] font-medium bg-[#25D366]/10 px-2 py-1 rounded-md">
                    <MessageCircle className="w-3 h-3" />
                    Chat
                  </span>
                </a>
              ))}
            </div>

            {/* Lucknow Options */}
            <div className="space-y-1.5 pt-2 border-t border-[#F0EBE3]">
              <div className="text-xs font-medium text-[#4A4238]">Lucknow Properties:</div>
              {(contact?.lucknowContacts || []).map((c, i) => (
                <a
                  key={i}
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20I%20would%20like%20to%20enquire%20about%20ZoomStay%20Lucknow.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE3] border border-[#EDE7DF] transition text-left group"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#1E2229] group-hover:text-[#8C7355] transition">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-[#7D756C]">{c.role}</div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-[#1B8040] font-medium bg-[#25D366]/10 px-2 py-1 rounded-md">
                    <MessageCircle className="w-3 h-3" />
                    Chat
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white font-medium shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all"
        aria-label="Toggle WhatsApp concierge"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="text-sm font-semibold tracking-wide pr-1">Need Help? Chat</span>
      </button>
    </div>
  );
};
