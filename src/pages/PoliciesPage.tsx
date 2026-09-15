import React, { useState } from 'react';
import { Sparkles, Shield, Clock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { FloatCard } from '../components/ui/FloatCard';

interface PoliciesPageProps {
  initialTab?: 'policies' | 'privacy' | 'terms';
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ initialTab = 'policies' }) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'privacy' | 'terms'>(initialTab);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE4DC] text-xs font-semibold tracking-widest uppercase text-[#735D43]">
            <Shield className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>TRANSPARENCY & GUEST TRUST</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-[#1E2229]">
            Policies & House Guidelines
          </h1>
          <p className="text-sm text-[#555C66]">
            Transparent guidelines designed to protect guest comfort, caretaker safety, and the peaceful residential character of our communities.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 border-b border-[#EBE4DC] pb-4">
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${
              activeTab === 'policies'
                ? 'bg-[#1E2229] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cancellation & House Rules
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${
              activeTab === 'privacy'
                ? 'bg-[#1E2229] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${
              activeTab === 'terms'
                ? 'bg-[#1E2229] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Terms & Conditions
          </button>
        </div>

        {/* Tab 1: Cancellation & House Rules */}
        {activeTab === 'policies' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Check-in & Check-out Times */}
            <FloatCard depth={3} className="p-8 bg-white space-y-4">
              <div className="flex items-center gap-2 text-[#8C7355] font-bold text-sm uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Check-in & Check-out Standards</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4]">
                  <span className="font-bold text-sm text-[#1E2229] block">Check-in Time: 1:00 PM onwards</span>
                  <p className="text-stone-600 mt-1">
                    Early check-in from 8:00 AM is subject to unit availability and prior guest departure. Luggage drop-off with our on-site caretaker is always welcome.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4]">
                  <span className="font-bold text-sm text-[#1E2229] block">Check-out Time: 11:00 AM</span>
                  <p className="text-stone-600 mt-1">
                    Late check-out up to 1:00 PM may be accommodated upon prior coordinator request if subsequent guests are not scheduled.
                  </p>
                </div>
              </div>
            </FloatCard>

            {/* Cancellation Policy Framework */}
            <FloatCard depth={3} className="p-8 bg-white space-y-4">
              <div className="flex items-center gap-2 text-[#8C7355] font-bold text-sm uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Transparent Cancellation & Refund Framework</span>
              </div>
              <div className="space-y-3 text-xs text-[#555C66] leading-relaxed">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] space-y-1">
                  <span className="font-bold text-[#1E2229] text-xs">More than 7 Days Prior to Check-in:</span>
                  <p>100% full refund or free rescheduling to any open date within 6 months.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] space-y-1">
                  <span className="font-bold text-[#1E2229] text-xs">3 to 7 Days Prior to Check-in:</span>
                  <p>50% refund, or 75% credit applied towards a rescheduled booking.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] space-y-1">
                  <span className="font-bold text-[#1E2229] text-xs">Less than 72 Hours / No-Show:</span>
                  <p>Non-refundable as units are reserved exclusively and other group enquiries are declined.</p>
                </div>
              </div>
            </FloatCard>

            {/* House Rules & Residential Etiquette */}
            <FloatCard depth={3} className="p-8 bg-white space-y-4">
              <div className="flex items-center gap-2 text-[#8C7355] font-bold text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>House Rules & Society Etiquette</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#555C66]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                  <span><strong>Quiet Hours (10:30 PM – 7:00 AM):</strong> As our residences are located in peaceful residential societies (Varuna Garden / Spring Garden), guests are requested to keep hallway noise and balcony conversations gentle.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                  <span><strong>Non-Smoking Indoors:</strong> Smoking is strictly restricted to designated open balconies. Burning cigarettes inside bedrooms or salons incurs a deep cleaning restoration fee.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                  <span><strong>Kitchen Usage:</strong> Guests are invited to use the induction/gas hob, refrigerator, and utensils. Please leave cookware washed or request caretaker assistance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
                  <span><strong>Government Photo ID:</strong> All adult guests must provide valid government photo identification (Aadhaar, Passport, Voter ID) at check-in as mandated by local authorities.</span>
                </li>
              </ul>
            </FloatCard>
          </div>
        )}

        {/* Tab 2: Privacy Policy */}
        {activeTab === 'privacy' && (
          <FloatCard depth={3} className="p-8 bg-white space-y-4 text-xs text-[#555C66] leading-relaxed animate-in fade-in duration-200">
            <h3 className="font-serif text-xl font-bold text-[#1E2229] mb-3">Privacy Commitment</h3>
            <p>
              ZoomStay respects your personal privacy. When you request a stay or submit an inquiry, we collect your name, phone number, email address, and stay details exclusively to coordinate reservations, communicate booking status, and facilitate on-site hospitality.
            </p>
            <p>
              We do not sell, rent, or trade your contact details with any third-party marketing companies. Government identification documents provided during physical check-in are kept strictly secure as per local law enforcement compliance.
            </p>
            <p>
              You may request deletion or modification of your contact details by contacting our central desk at <strong>zoomstays@gmail.com</strong>.
            </p>
          </FloatCard>
        )}

        {/* Tab 3: Terms & Conditions */}
        {activeTab === 'terms' && (
          <FloatCard depth={3} className="p-8 bg-white space-y-4 text-xs text-[#555C66] leading-relaxed animate-in fade-in duration-200">
            <h3 className="font-serif text-xl font-bold text-[#1E2229] mb-3">Booking Terms & Conditions</h3>
            <p>
              1. <strong>Direct Reservation Requests:</strong> Submitting a stay request on this website creates a pending inquiry. Confirmation is subject to calendar availability and direct coordinator agreement via WhatsApp or Phone.
            </p>
            <p>
              2. <strong>Occupancy Limits:</strong> Total occupants must not exceed the declared guest count without prior authorization. Additional bedding charges may apply for extra guests.
            </p>
            <p>
              3. <strong>Property Care:</strong> Guests agree to maintain furnishings, appliances, and fixtures in good condition. Unreasonable damages or loss of property keys will be billed at actual replacement cost.
            </p>
          </FloatCard>
        )}

      </div>
    </div>
  );
};
