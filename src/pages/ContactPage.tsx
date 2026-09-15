import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  defaultEnquiryType?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  defaultEnquiryType,
}) => {
  const { store, submitEnquiry } = useCms();
  const contact = store.contact;

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [enquiryType, setEnquiryType] = useState<string>(defaultEnquiryType || 'General Enquiry');
  const [destination, setDestination] = useState<string>('Varanasi');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const res = await submitEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      enquiryType,
      destination,
      message: message.trim(),
    });

    setIsSubmitting(false);

    if (res.success && res.enquiry) {
      setSubmittedId(res.enquiry.id);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE4DC] text-xs font-semibold tracking-widest uppercase text-[#735D43]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>DIRECT CONNECT</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2229]">
            Contact ZoomStay
          </h1>
          <p className="text-sm sm:text-base text-[#555C66]">
            Reach out directly to our reservation managers in Varanasi and Lucknow for rates, group bookings, workations, and custom travel arrangements.
          </p>
        </div>

        {/* Contact Desks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Desk 1: Varanasi Desk */}
          <FloatCard depth={5} elevation="md" className="p-8 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                <span className="text-xs uppercase font-bold tracking-widest text-[#8C7355]">
                  VARANASI DESK
                </span>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  Direct Line
                </span>
              </div>

              <div className="space-y-3">
                {(contact?.varanasiContacts || []).map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] space-y-1">
                    <div className="text-xs font-bold text-[#1E2229]">{c.name}</div>
                    <div className="text-[11px] text-stone-500">{c.role}</div>
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={`tel:${c.phone}`}
                        className="text-xs font-semibold text-[#8C7355] hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {c.phone}
                      </a>
                      {c.isWhatsApp && (
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20I%20would%20like%20to%20enquire%20about%20ZoomStay%20Varanasi.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-[#1B8040] bg-[#25D366]/10 px-2 py-0.5 rounded-md hover:bg-[#25D366]/20 transition flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Chat
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-[#1E2229] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C7355]" />
                  <span>Varanasi Property Enclave</span>
                </div>
                <p className="pl-4 leading-relaxed">{contact?.varanasiAddress}</p>
                <p className="pl-4 text-stone-500 text-[11px]">Opposite Varuna Garden Society, Cantonment</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#F0ECE4]">
              <WhatsAppButton
                destination="varanasi"
                label="WhatsApp Varanasi Team"
                className="w-full"
              />
            </div>
          </FloatCard>

          {/* Desk 2: Lucknow Desk */}
          <FloatCard depth={5} elevation="md" className="p-8 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                <span className="text-xs uppercase font-bold tracking-widest text-[#8C7355]">
                  LUCKNOW DESK
                </span>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  Direct Line
                </span>
              </div>

              <div className="space-y-3">
                {(contact?.lucknowContacts || []).map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] space-y-1">
                    <div className="text-xs font-bold text-[#1E2229]">{c.name}</div>
                    <div className="text-[11px] text-stone-500">{c.role}</div>
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={`tel:${c.phone}`}
                        className="text-xs font-semibold text-[#8C7355] hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {c.phone}
                      </a>
                      {c.isWhatsApp && (
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.name)},%20I%20would%20like%20to%20enquire%20about%20ZoomStay%20Lucknow.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-[#1B8040] bg-[#25D366]/10 px-2 py-0.5 rounded-md hover:bg-[#25D366]/20 transition flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Chat
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-[#1E2229] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C7355]" />
                  <span>Lucknow Properties</span>
                </div>
                <p className="pl-4 leading-relaxed">{contact.lucknowAddress}</p>
                <p className="pl-4 text-stone-500 text-[11px]">Near Phoenix Palassio, Ekana Stadium & Lulu Mall</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#F0ECE4]">
              <WhatsAppButton
                destination="lucknow"
                label="WhatsApp Lucknow Team"
                className="w-full"
              />
            </div>
          </FloatCard>

          {/* Desk 3: Central Email & Direct Hours */}
          <FloatCard depth={5} elevation="md" className="p-8 bg-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
                <span className="text-xs uppercase font-bold tracking-widest text-[#8C7355]">
                  DIRECT EMAIL & HOURS
                </span>
                <Clock className="w-4 h-4 text-[#8C7355]" />
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] space-y-1">
                  <div className="text-xs text-stone-500 font-medium">Official Inquiries:</div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm font-bold text-[#8C7355] hover:underline block pt-1"
                  >
                    {contact.email}
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] space-y-1 text-xs text-[#555C66]">
                  <div className="font-bold text-[#1E2229]">Operating Hours:</div>
                  <p>Guest Check-ins: 24/7 (with on-site caretaker notification)</p>
                  <p>Reservation Desk: 8:00 AM – 10:30 PM daily</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] space-y-1 text-xs text-[#555C66]">
                  <div className="font-bold text-[#1E2229]">Need Special Assistance?</div>
                  <p>Elderly step-free access, late night station pickups, and whole-building bookings.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#F0ECE4]">
              <button
                onClick={() => onNavigate('/request-booking')}
                className="w-full py-3 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider uppercase transition shadow-md"
              >
                Request a Stay Online
              </button>
            </div>
          </FloatCard>

        </div>

        {/* General Enquiry Form */}
        <div className="max-w-3xl mx-auto">
          <FloatCard depth={3} className="p-8 sm:p-10 bg-white">
            {submittedId ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E2229]">
                  Enquiry Transmitted Successfully
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Reference: <strong>{submittedId}</strong>. Our guest relations manager has received your message and will reply shortly via your preferred channel.
                </p>
                <button
                  onClick={() => setSubmittedId(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1E2229] text-white text-xs font-bold tracking-wider uppercase"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1E2229]">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs text-[#7D756C] mt-1">
                    Have a specific question regarding our properties, amenities, or local travel?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Vikram Singhania"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Destination City
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    >
                      <option value="Varanasi">Varanasi</option>
                      <option value="Lucknow">Lucknow</option>
                      <option value="Both">Both / General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nature of Inquiry
                  </label>
                  <select
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                  >
                    <option value="General Enquiry">General Stay Enquiry</option>
                    <option value="Group Stay">Group Stay (Multiple Units in Same Building)</option>
                    <option value="Long Stay">Extended Long Stay / Workation</option>
                    <option value="Travel Assistance">Local Travel & Cab Assistance</option>
                    <option value="Corporate">Corporate / Sabbatical Booking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Message or Question *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Provide any specific details regarding dates, party count, or assistance required..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C5B49E]" />
                  <span>{isSubmitting ? 'TRANSMITTING...' : 'SEND INQUIRY'}</span>
                </button>
              </form>
            )}
          </FloatCard>
        </div>

      </div>
    </div>
  );
};
