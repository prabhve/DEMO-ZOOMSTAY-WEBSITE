import React, { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  Home,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { FloatCard } from '../components/ui/FloatCard';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { BookingRequest } from '../types';

interface BookingRequestPageProps {
  onNavigate: (path: string) => void;
  preselectedPropertyId?: string;
  preselectedUnitId?: string;
  preselectedDestination?: string;
}

export const BookingRequestPage: React.FC<BookingRequestPageProps> = ({
  onNavigate,
  preselectedPropertyId,
  preselectedUnitId,
  preselectedDestination,
}) => {
  const { store, submitBooking } = useCms();

  // Multi-step state: 1 = Accommodation, 2 = Dates & Party, 3 = Guest Details & Submit
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'stepped' | 'all'>('stepped');

  const [destination, setDestination] = useState<string>(preselectedDestination || 'varanasi');
  const [propertyId, setPropertyId] = useState<string>(preselectedPropertyId || '');
  const [unitId, setUnitId] = useState<string>(preselectedUnitId || '');
  const [guestName, setGuestName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(4);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [specialRequest, setSpecialRequest] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Phone' | 'Email'>('WhatsApp');
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: ToastMessage['type'], title: string, description?: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      title,
      description,
    });
  };

  // Available properties for selected destination
  const availableProperties = store.properties.filter(
    (p) => p.active && (destination === 'all' || p.destinationId === destination)
  );

  useEffect(() => {
    if (preselectedPropertyId) {
      setPropertyId(preselectedPropertyId);
      const prop = store.properties.find((p) => p.id === preselectedPropertyId);
      if (prop) setDestination(prop.destinationId);
    } else if (availableProperties.length > 0 && !propertyId) {
      setPropertyId(availableProperties[0].id);
    }
  }, [destination, preselectedPropertyId, store.properties]);

  const selectedProperty = store.properties.find((p) => p.id === propertyId);
  const availableUnits = store.units.filter((u) => u.propertyId === propertyId);

  // Calculate nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  // Step Completion Validation Flags
  const isStep1Complete = Boolean(propertyId);
  const isStep2Complete = Boolean(checkInDate && checkOutDate && nights > 0);
  const isStep3Complete = Boolean(guestName.trim() && phone.trim().length >= 8 && agreedTerms);

  // Overall Progress Percentage
  const calculateProgress = () => {
    let completed = 0;
    if (isStep1Complete) completed += 1;
    if (isStep2Complete) completed += 1;
    if (isStep3Complete) completed += 1;
    return Math.round((completed / 3) * 100);
  };

  const progressPercent = confirmedBooking ? 100 : calculateProgress();

  // Step Navigation Validation
  const validateStep1 = () => {
    if (!propertyId) {
      const msg = 'Please select an accommodation property.';
      setErrorMessage(msg);
      showToast('error', 'Accommodation Required', msg);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (!checkInDate || !checkOutDate) {
      const msg = 'Please select both check-in and check-out dates.';
      setErrorMessage(msg);
      showToast('error', 'Dates Required', msg);
      return false;
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      const msg = 'Check-out date must be after check-in date.';
      setErrorMessage(msg);
      showToast('error', 'Invalid Date Range', msg);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const goToStep = (step: number) => {
    if (step > currentStep) {
      if (currentStep === 1 && !validateStep1()) return;
      if (currentStep === 2 && !validateStep2()) return;
    }
    setErrorMessage(null);
    setCurrentStep(step);
    window.scrollTo({ top: 200, behavior: 'smooth' });

    if (step === 2) {
      showToast('info', 'Step 2: Dates & Party', `Configuring stay for ${selectedProperty?.name || 'Selected Property'}`);
    } else if (step === 3) {
      showToast('info', 'Step 3: Contact & Notes', `${nights} night stay • ${guestsCount} guests`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Final Validation
    if (!guestName.trim()) {
      const msg = 'Please enter your full name.';
      setErrorMessage(msg);
      showToast('error', 'Name Required', msg);
      setCurrentStep(3);
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      const msg = 'Please provide a valid contact phone number.';
      setErrorMessage(msg);
      showToast('error', 'Phone Required', msg);
      setCurrentStep(3);
      return;
    }
    if (!propertyId) {
      const msg = 'Please select an accommodation.';
      setErrorMessage(msg);
      showToast('error', 'Property Required', msg);
      setCurrentStep(1);
      return;
    }
    if (!checkInDate || !checkOutDate || nights <= 0) {
      const msg = 'Please select valid check-in and check-out dates.';
      setErrorMessage(msg);
      showToast('error', 'Dates Required', msg);
      setCurrentStep(2);
      return;
    }
    if (!agreedTerms) {
      const msg = 'Please accept the contact agreement to proceed.';
      setErrorMessage(msg);
      showToast('error', 'Agreement Required', msg);
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep('Verifying inventory & property calendar...');
    showToast('loading', 'Submitting Stay Request', 'Verifying dates and notifying coordinator...');

    // Small cinematic multi-step status feedback
    setTimeout(() => {
      setSubmissionStep('Registering booking in reservations system...');
    }, 600);

    const selectedUnit = availableUnits.find((u) => u.id === unitId);

    const result = await submitBooking({
      guestName: guestName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      destinationId: destination,
      propertyId: selectedProperty?.id || propertyId,
      propertyName: selectedProperty?.name || 'ZoomStay Homestay',
      unitId: selectedUnit?.id,
      unitName: selectedUnit?.unitName,
      checkInDate,
      checkOutDate,
      guestsCount,
      roomsCount,
      specialRequest: specialRequest.trim(),
      preferredContactMethod: preferredContact,
      agreedTerms,
    });

    setIsSubmitting(false);
    setSubmissionStep('');

    if (result.success && result.booking) {
      setConfirmedBooking(result.booking);
      showToast(
        'success',
        'Request Recorded!',
        `Reference ID: ${result.booking.id}. Coordinator has been alerted.`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const errorText = result.message || 'Failed to submit stay request. Please try again.';
      setErrorMessage(errorText);
      showToast('error', 'Submission Failed', errorText);
    }
  };

  // SUCCESS CONFIRMATION VOUCHER VIEW
  if (confirmedBooking) {
    const cleanPhone = store.contact.primaryWhatsAppNumber.replace(/[^0-9]/g, '');
    const waText = `Hello ZoomStay, I just submitted booking request ${confirmedBooking.id} for ${confirmedBooking.propertyName} (${confirmedBooking.checkInDate} to ${confirmedBooking.checkOutDate}). Please confirm availability.`;

    return (
      <div className="min-h-screen pt-28 sm:pt-32 pb-24 bg-[#FAF8F5]">
        <Toast toast={toast} onClose={() => setToast(null)} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Indicator - 100% Completed */}
          <div className="mb-6 p-4 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-Step Request Completed</span>
              </span>
              <span className="text-stone-500 font-mono">100% DONE</span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full transition-all duration-500 w-full" />
            </div>
          </div>

          <FloatCard depth={3} elevation="lg" className="p-6 sm:p-10 bg-white text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
                RESERVATION REQUEST RECORDED
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1E2229]">
                Your Stay Request has been Received
              </h1>
              <p className="text-xs sm:text-sm text-[#555C66] max-w-lg mx-auto">
                Thank you, <strong>{confirmedBooking.guestName}</strong>. Our reservations coordinator has received your request and is reviewing property availability.
              </p>
            </div>

            {/* Voucher Details Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC] text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
                <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Booking Reference ID</span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#8C7355]">{confirmedBooking.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Accommodation</span>
                  <span className="font-bold text-[#1E2229] text-sm">{confirmedBooking.propertyName}</span>
                  {confirmedBooking.unitName && (
                    <span className="text-stone-600 block text-[11px]">{confirmedBooking.unitName}</span>
                  )}
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Dates of Stay</span>
                  <span className="font-bold text-[#1E2229]">
                    {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Party Size</span>
                  <span className="font-bold text-[#1E2229]">
                    {confirmedBooking.guestsCount} Guests ({confirmedBooking.roomsCount} Unit/s)
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Contact Channel</span>
                  <span className="font-bold text-[#1E2229]">
                    {confirmedBooking.preferredContactMethod} ({confirmedBooking.phone})
                  </span>
                </div>
              </div>

              {confirmedBooking.specialRequest && (
                <div className="pt-3 border-t border-[#E8DFD5] text-xs">
                  <span className="text-stone-500 block font-medium text-[11px]">Special Requests:</span>
                  <p className="text-stone-700 italic mt-0.5">{confirmedBooking.specialRequest}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-xs tracking-wider uppercase shadow-md transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Continue on WhatsApp with Request ID</span>
              </a>

              <button
                onClick={() => onNavigate('/')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
              >
                Return to Home
              </button>
            </div>

            <p className="text-[11px] text-stone-400">
              An instant notification has been registered in the ZoomStay property log. No advance payment required for request.
            </p>
          </FloatCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-24 bg-[#FAF8F5]">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold text-[#8C7355]">
            DIRECT RESERVATION INQUIRY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2229]">
            Request Your Stay
          </h1>
          <p className="text-xs sm:text-sm text-[#555C66] max-w-xl mx-auto">
            Share your preferred dates and party details. Our dedicated reservation team will verify availability, provide custom rates, and assist with caretaker check-in.
          </p>
        </div>

        {/* PROGRESS INDICATOR & STEP TRACKER */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
          {/* Top Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8C7355] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E2229]">
                Submission Status: {progressPercent}% Complete
              </span>
              {nights > 0 && (
                <span className="text-[11px] bg-[#8C7355]/10 text-[#8C7355] px-2 py-0.5 rounded-md font-semibold">
                  {nights} Night{nights > 1 ? 's' : ''} Stay
                </span>
              )}
            </div>

            {/* View Mode Switcher: Step-by-Step vs All Fields */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-400 hidden sm:inline">View Mode:</span>
              <div className="inline-flex p-1 bg-stone-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('stepped')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    viewMode === 'stepped'
                      ? 'bg-white text-[#1E2229] shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Guided Steps
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    viewMode === 'all'
                      ? 'bg-white text-[#1E2229] shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  All Sections
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-[#8C7355] to-[#A38865] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive Multi-Step Indicator Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => goToStep(1)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all relative ${
                currentStep === 1
                  ? 'border-[#8C7355] bg-[#FAF8F5] shadow-xs'
                  : isStep1Complete
                  ? 'border-emerald-200 bg-emerald-50/40 text-stone-700'
                  : 'border-stone-200 bg-stone-50/50 text-stone-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isStep1Complete
                      ? 'bg-emerald-600 text-white'
                      : currentStep === 1
                      ? 'bg-[#8C7355] text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isStep1Complete ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 hidden sm:inline">
                  {isStep1Complete ? 'Completed' : 'Step 1'}
                </span>
              </div>
              <div className="text-xs font-bold text-[#1E2229] truncate">Accommodation</div>
              <div className="text-[10px] text-stone-500 truncate hidden sm:block">
                {selectedProperty?.name ? selectedProperty.name : 'Select City & Property'}
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => goToStep(2)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all relative ${
                currentStep === 2
                  ? 'border-[#8C7355] bg-[#FAF8F5] shadow-xs'
                  : isStep2Complete
                  ? 'border-emerald-200 bg-emerald-50/40 text-stone-700'
                  : 'border-stone-200 bg-stone-50/50 text-stone-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isStep2Complete
                      ? 'bg-emerald-600 text-white'
                      : currentStep === 2
                      ? 'bg-[#8C7355] text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isStep2Complete ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 hidden sm:inline">
                  {isStep2Complete ? 'Completed' : 'Step 2'}
                </span>
              </div>
              <div className="text-xs font-bold text-[#1E2229] truncate">Dates &amp; Party</div>
              <div className="text-[10px] text-stone-500 truncate hidden sm:block">
                {checkInDate && checkOutDate ? `${nights}n • ${guestsCount} guests` : 'Dates & Guest Count'}
              </div>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => goToStep(3)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all relative ${
                currentStep === 3
                  ? 'border-[#8C7355] bg-[#FAF8F5] shadow-xs'
                  : isStep3Complete
                  ? 'border-emerald-200 bg-emerald-50/40 text-stone-700'
                  : 'border-stone-200 bg-stone-50/50 text-stone-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isStep3Complete
                      ? 'bg-emerald-600 text-white'
                      : currentStep === 3
                      ? 'bg-[#8C7355] text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isStep3Complete ? <Check className="w-3 h-3 stroke-[3]" /> : '3'}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 hidden sm:inline">
                  {isStep3Complete ? 'Ready' : 'Step 3'}
                </span>
              </div>
              <div className="text-xs font-bold text-[#1E2229] truncate">Guest Details</div>
              <div className="text-[10px] text-stone-500 truncate hidden sm:block">
                {guestName ? guestName : 'Name, Phone & Submit'}
              </div>
            </button>
          </div>
        </div>

        {/* Error Notification Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form Card */}
        <FloatCard depth={3} className="p-6 sm:p-10 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Destination & Accommodation Selection */}
            {(viewMode === 'all' || currentStep === 1) && (
              <div className="animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>1. Select Location &amp; Accommodation</span>
                  </h3>
                  {isStep1Complete && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Destination City *
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        const propsInDest = store.properties.filter(
                          (p) => p.active && (e.target.value === 'all' || p.destinationId === e.target.value)
                        );
                        if (propsInDest.length > 0) setPropertyId(propsInDest[0].id);
                        showToast('info', 'Destination Updated', `Selected ${e.target.value === 'varanasi' ? 'Varanasi' : 'Lucknow'}`);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    >
                      <option value="varanasi">Varanasi (Cantonment Area)</option>
                      <option value="lucknow">Lucknow (Gomti Nagar Extension)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Property *
                    </label>
                    <select
                      value={propertyId}
                      onChange={(e) => {
                        setPropertyId(e.target.value);
                        const prop = store.properties.find((p) => p.id === e.target.value);
                        if (prop) {
                          showToast('info', 'Property Chosen', prop.name);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                      required
                    >
                      {availableProperties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.propertyType})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Unit Selection */}
                {availableUnits.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Specific Building Unit (Optional)
                    </label>
                    <select
                      value={unitId}
                      onChange={(e) => setUnitId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    >
                      <option value="">Any Available Unit (Assigned by Caretaker)</option>
                      {availableUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.unitName} ({u.floor} • {u.status})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Ideal if you require ground-floor step-free access or specific balcony views.
                    </p>
                  </div>
                )}

                {/* Stepped Next Button */}
                {viewMode === 'stepped' && (
                  <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-semibold tracking-wider uppercase transition shadow-sm"
                    >
                      <span>Continue to Dates &amp; Guests</span>
                      <ArrowRight className="w-4 h-4 text-[#C5B49E]" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. Travel Dates & Party */}
            {(viewMode === 'all' || currentStep === 2) && (
              <div className={`animate-in fade-in duration-200 ${viewMode === 'all' ? 'pt-6 border-t border-[#F0ECE4]' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>2. Travel Dates &amp; Guests</span>
                  </h3>
                  {isStep2Complete && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> {nights} Night{nights > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => {
                        setCheckInDate(e.target.value);
                        if (checkOutDate && new Date(checkOutDate) > new Date(e.target.value)) {
                          const diff = Math.ceil((new Date(checkOutDate).getTime() - new Date(e.target.value).getTime()) / (1000 * 60 * 60 * 24));
                          showToast('info', 'Check-in Updated', `${diff} nights stay scheduled`);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => {
                        setCheckOutDate(e.target.value);
                        if (checkInDate && new Date(e.target.value) > new Date(checkInDate)) {
                          const diff = Math.ceil((new Date(e.target.value).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
                          showToast('info', 'Dates Confirmed', `${diff} nights stay scheduled`);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Total Guests *
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 24, 30, 48].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Units Needed
                    </label>
                    <select
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Unit{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stepped Navigation Controls */}
                {viewMode === 'stepped' && (
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Accommodation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-semibold tracking-wider uppercase transition shadow-sm"
                    >
                      <span>Continue to Contact</span>
                      <ArrowRight className="w-4 h-4 text-[#C5B49E]" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. Guest Contact Information */}
            {(viewMode === 'all' || currentStep === 3) && (
              <div className={`animate-in fade-in duration-200 ${viewMode === 'all' ? 'pt-6 border-t border-[#F0ECE4]' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>3. Guest Contact Details</span>
                  </h3>
                  {isStep3Complete && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Ready to submit
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Phone Number (WhatsApp Preferred) *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                      Preferred Contact Channel
                    </label>
                    <select
                      value={preferredContact}
                      onChange={(e: any) => setPreferredContact(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                    >
                      <option value="WhatsApp">WhatsApp (Fastest response)</option>
                      <option value="Phone">Direct Phone Call</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-[#4A4238] mb-1.5">
                    Special Requests, Elderly Assistance, or Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Arriving early morning by train; require ground floor unit; need assistance with sunrise Ganga boat ride..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3C7] bg-[#FAF8F5] text-sm text-[#1E2229] focus:ring-2 focus:ring-[#8C7355] outline-none"
                  />
                </div>

                {/* Stepped Back Button */}
                {viewMode === 'stepped' && (
                  <div className="mt-4 flex items-center justify-start">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Dates &amp; Guests</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submission Status Feedback Bar when isSubmitting is true */}
            {isSubmitting && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#8C7355]/40 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#8C7355] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8C7355] animate-ping" />
                    <span>{submissionStep || 'Submitting request...'}</span>
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">Contacting Coordinator</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div className="h-full bg-[#8C7355] rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {/* Consent & Submit Button Area */}
            {(viewMode === 'all' || currentStep === 3) && (
              <div className="pt-6 border-t border-[#F0ECE4] space-y-4">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-[#8C7355] focus:ring-[#8C7355]"
                  />
                  <span className="text-xs text-[#555C66]">
                    I agree to be contacted by the ZoomStay reservations desk regarding my stay request.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white font-semibold text-xs tracking-widest uppercase shadow-lg transition-all transform active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'PROCESSING YOUR REQUEST...' : 'SUBMIT BOOKING REQUEST'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C5B49E]" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#8C7355]" />
                  <span>Zero advance commitment required to submit request. Direct coordinator confirmation.</span>
                </div>
              </div>
            )}

          </form>
        </FloatCard>

      </div>
    </div>
  );
};
