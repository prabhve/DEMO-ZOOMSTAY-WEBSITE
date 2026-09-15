import React from 'react';
import { Sparkles, Heart, Shield, Users, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { store } = useCms();

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE4DC] text-xs font-semibold tracking-widest uppercase text-[#735D43]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>OUR STORY & PHILOSOPHY</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2229]">
            The Soul of ZoomStay
          </h1>
          <p className="text-base sm:text-lg text-[#555C66] italic font-serif">
            "Feel at home while experiencing the character of the city."
          </p>
        </div>

        {/* Narrative Section with 3D Float Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-serif text-3xl font-bold text-[#1E2229]">
              Reimagining Hospitality in Varanasi & Lucknow
            </h2>
            <div className="space-y-4 text-sm text-[#555C66] leading-relaxed">
              <p>
                Traveling with family, elders, or large groups often poses a dilemma: either split into disconnected, cramped hotel rooms with high dining expenses, or risk unpredictable vacation rentals without dedicated caretakers.
              </p>
              <p>
                <strong>ZoomStay was created to solve this very dilemma.</strong> We curate premium, fully serviced 2BHK and 3BHK homestay apartments in peaceful, upscale residential pockets—such as Varanasi’s Cantonment enclave (opposite Varuna Garden Society) and Lucknow’s prestigious Shaheed Path corridor (near Phoenix Palassio and Lulu Mall).
              </p>
              <p>
                Every stay combines the warmth and privacy of an authentic home—featuring king-sized beds, spacious living salons, and fully equipped modular kitchens—with the reliability of round-the-clock on-site caretakers, spotless housekeeping, and personalized concierge guidance.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => onNavigate('/stays')}
                className="px-6 py-3.5 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider uppercase transition shadow-md"
              >
                DISCOVER OUR STAYS
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3.5 rounded-xl border border-[#DCD3C7] hover:bg-[#F2ECE3] text-[#1E2229] text-xs font-bold tracking-wider uppercase transition"
              >
                CONNECT WITH US
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <FloatCard depth={6} elevation="lg" className="p-3 bg-white">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="ZoomStay interior comfort"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-wider text-[#C5B49E] font-semibold">
                    The ZoomStay Standard
                  </span>
                  <p className="font-serif text-lg font-bold mt-1">
                    Spacious Living Salons & Authentic Care
                  </p>
                </div>
              </div>
            </FloatCard>
          </div>
        </div>

        {/* The 4 Pillars */}
        <div className="pt-8 border-t border-[#EBE4DC]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
              CORE COMMITMENTS
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#1E2229] mt-2">
              What Defines the ZoomStay Experience
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FloatCard depth={4} className="p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#8C7355] flex items-center justify-center border border-[#EBE4DC]">
                <Home className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1E2229]">True Residential Freedom</h4>
              <p className="text-xs text-[#7D756C] leading-relaxed">
                Full private apartments with separate bedrooms, private washrooms, and large balconies—not a tiny hotel bedroom.
              </p>
            </FloatCard>

            <FloatCard depth={4} className="p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#8C7355] flex items-center justify-center border border-[#EBE4DC]">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1E2229]">24/7 On-Site Caretaker</h4>
              <p className="text-xs text-[#7D756C] leading-relaxed">
                A personal on-premises host ready to assist with luggage, check-in, water refills, and local recommendations.
              </p>
            </FloatCard>

            <FloatCard depth={4} className="p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#8C7355] flex items-center justify-center border border-[#EBE4DC]">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1E2229]">Gated Society Peace</h4>
              <p className="text-xs text-[#7D756C] leading-relaxed">
                Located in quiet, secure residential societies with lift access and round-the-clock guards.
              </p>
            </FloatCard>

            <FloatCard depth={4} className="p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#8C7355] flex items-center justify-center border border-[#EBE4DC]">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#1E2229]">Group & Family Harmony</h4>
              <p className="text-xs text-[#7D756C] leading-relaxed">
                Up to 6 multi-unit apartments in the same building in Varanasi—bringing up to 48 family members together seamlessly.
              </p>
            </FloatCard>
          </div>
        </div>

      </div>
    </div>
  );
};

function Home(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
