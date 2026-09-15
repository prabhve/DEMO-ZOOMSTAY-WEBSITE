import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Home,
  Layers,
  CalendarCheck,
  MessageSquare,
  Image as ImageIcon,
  Star,
  Settings,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Phone,
  MessageCircle,
  Send,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { Property, Unit, BookingRequest, Review, GalleryImage } from '../../types';

interface AdminPortalPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onNavigate }) => {
  const {
    store,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    updateProperty,
    updateUnit,
    addUnit,
    deleteUnit,
    updateBookingStatus,
    updateEnquiryStatus,
    addGalleryImage,
    deleteGalleryImage,
    updateReview,
    deleteReview,
    updateSiteSettings,
    updateContact,
    testEmailNotification,
    refreshStore,
  } = useCms();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'bookings'
    | 'enquiries'
    | 'properties'
    | 'units'
    | 'gallery'
    | 'reviews'
    | 'settings'
    | 'emailLogs'
  >('dashboard');

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Property editing modal state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // New unit form state
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitPropertyId, setNewUnitPropertyId] = useState(store.properties[0]?.id || '');
  const [newUnitFloor, setNewUnitFloor] = useState('1st Floor');
  const [newUnitBedrooms, setNewUnitBedrooms] = useState(3);
  const [newUnitBathrooms, setNewUnitBathrooms] = useState(2);
  const [newUnitCapacity, setNewUnitCapacity] = useState(8);
  const [newUnitBeds, setNewUnitBeds] = useState('3 King Size Beds');
  const [newUnitNotes, setNewUnitNotes] = useState('');

  // Gallery add modal state
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'living' | 'bedroom' | 'kitchen' | 'exterior' | 'view'>('living');
  const [newPhotoDest, setNewPhotoDest] = useState<'varanasi' | 'lucknow'>('varanasi');

  // Search and filter states
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');

  // Test email state
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAdmin) {
    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      const ok = await loginAdmin(passwordInput);
      if (!ok) {
        setLoginError('Invalid administrative passphrase. Please verify your credentials.');
      }
    };

    return (
      <div className="min-h-screen pt-36 pb-24 flex items-center justify-center px-4 bg-[#FAF8F5]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#EBE4DC] shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#EBE4DC] flex items-center justify-center text-[#8C7355] mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#8C7355]">
              MANAGEMENT ACCESS
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1E2229]">
              ZoomStay Admin Portal
            </h1>
            <p className="text-xs text-stone-500">
              Enter the master passphrase to manage properties, bookings, gallery, and settings.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Admin Passphrase
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter passphrase"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#8C7355] outline-none"
                required
              />
              <p className="text-[11px] text-stone-600 mt-1">
                Default configured passphrase: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">zoomstay_admin_secret</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider uppercase transition shadow-md"
            >
              Sign In to Management Console
            </button>
          </form>

          <div className="pt-2 border-t border-[#F0ECE4]">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PENDING METRICS & LOGS
  const pendingBookings = (store.bookings || []).filter((b) => b.status === 'Pending').length;
  const newEnquiries = (store.enquiries || []).filter((e) => e.status === 'New').length;
  const pendingReviews = (store.reviews || []).filter((r) => !r.approved).length;
  const emailLogsList = store.emailLogs || store.notifications?.emailLogs || [];

  const handleTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailResult(null);
    const targetEmail =
      store.siteSettings?.adminNotificationEmail ||
      store.notifications?.adminNotificationEmail ||
      'admin@zoomstay.in';
    const res = await testEmailNotification(targetEmail);
    setIsSendingTestEmail(false);
    setTestEmailResult(res);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-[#F5F2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#E2D8CC] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-[#1E2229]">
                ZoomStay Administration
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Live CMS Connected
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Live database state synced with server storage. Real email dispatch active.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshStore}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DDD3C7] text-xs font-semibold text-[#1E2229] hover:bg-stone-50 transition shadow-sm"
              title="Refresh database state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Data</span>
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#DDD3C7] text-xs font-semibold text-[#1E2229] hover:bg-stone-50 transition shadow-sm"
            >
              View Public Website
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-[#EBE4DC] shadow-sm">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'bookings', label: 'Booking Requests', icon: CalendarCheck, badge: pendingBookings },
            { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, badge: newEnquiries },
            { id: 'properties', label: 'Properties & Pricing', icon: Home },
            { id: 'units', label: 'Building Units', icon: Layers },
            { id: 'gallery', label: 'Gallery Manager', icon: ImageIcon },
            { id: 'reviews', label: 'Reviews Moderation', icon: Star, badge: pendingReviews },
            { id: 'settings', label: 'Site Settings & Desks', icon: Settings },
            { id: 'emailLogs', label: 'Email Dispatch Logs', icon: Mail, badge: emailLogsList.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition uppercase ${
                  isActive
                    ? 'bg-[#1E2229] text-white shadow'
                    : 'text-[#4A4238] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#8C7355] text-white' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pending Bookings</span>
                <div className="font-serif text-3xl font-bold text-[#8C7355] mt-2">{pendingBookings}</div>
                <div className="text-[11px] text-stone-500 mt-1">{store.bookings.length} Total Requests</div>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">New Enquiries</span>
                <div className="font-serif text-3xl font-bold text-stone-800 mt-2">{newEnquiries}</div>
                <div className="text-[11px] text-stone-500 mt-1">{store.enquiries.length} Total Logged</div>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Properties</span>
                <div className="font-serif text-3xl font-bold text-stone-800 mt-2">
                  {store.properties.filter((p) => p.active).length}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">{store.units.length} Building Units</div>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Public Pricing</span>
                <div className="font-serif text-2xl font-bold text-stone-800 mt-2">
                  {store.siteSettings.publicPricingEnabled ? 'Enabled' : 'Hidden'}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">Rates on request toggle</div>
              </div>
            </div>

            {/* Quick Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                    Recent Stay Requests
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-[#8C7355] hover:underline"
                  >
                    View All ({(store.bookings || []).length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(store.bookings || []).slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#1E2229]">{b.guestName}</div>
                        <div className="text-stone-500">
                          {b.propertyName} • {b.checkInDate} ({b.guestsCount} guests)
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                    Recent General Enquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs font-bold text-[#8C7355] hover:underline"
                  >
                    View All ({(store.enquiries || []).length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(store.enquiries || []).slice(0, 4).map((e) => (
                    <div
                      key={e.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-[#1E2229]">{e.name} ({e.destination})</div>
                        <div className="text-stone-500 line-clamp-1">{e.message}</div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          e.status === 'New'
                            ? 'bg-blue-100 text-blue-800'
                            : e.status === 'In Progress'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKING REQUESTS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EBE4DC]">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search by Guest Name, ID, or Phone..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#8C7355] outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-semibold">Filter:</span>
                {['all', 'Pending', 'Confirmed', 'Cancelled', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      bookingFilterStatus === st
                        ? 'bg-[#1E2229] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all' ? 'All Requests' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {store.bookings
                .filter((b) => {
                  if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
                  if (bookingSearch.trim()) {
                    const q = bookingSearch.toLowerCase();
                    return (
                      b.guestName.toLowerCase().includes(q) ||
                      b.id.toLowerCase().includes(q) ||
                      b.phone.includes(q)
                    );
                  }
                  return true;
                })
                .map((b) => {
                  const cleanPhone = b.phone.replace(/[^0-9]/g, '');
                  const waReply = `Hello ${b.guestName}, this is ZoomStay reservations regarding your request ${b.id} for ${b.propertyName}. We are pleased to confirm availability for ${b.checkInDate} to ${b.checkOutDate}.`;

                  return (
                    <div
                      key={b.id}
                      className="p-6 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0ECE4] gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#8C7355]">{b.id}</span>
                          <span className="text-xs text-stone-500">
                            Received {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-500">Status:</span>
                          <select
                            value={b.status}
                            onChange={(e: any) => updateBookingStatus(b.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none ${
                              b.status === 'Pending'
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : b.status === 'Confirmed'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : b.status === 'Cancelled'
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-stone-100 border-stone-200 text-stone-800'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-stone-500 block">Guest Name</span>
                          <span className="font-bold text-[#1E2229] text-sm">{b.guestName}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <a href={`tel:${b.phone}`} className="text-[#8C7355] hover:underline">
                              {b.phone}
                            </a>
                            {b.email && <span className="text-stone-400">({b.email})</span>}
                          </div>
                        </div>

                        <div>
                          <span className="text-stone-500 block">Property & Unit</span>
                          <span className="font-bold text-[#1E2229]">{b.propertyName}</span>
                          <span className="text-stone-500 block mt-0.5">
                            {b.unitName || 'Any Available Unit'}
                          </span>
                        </div>

                        <div>
                          <span className="text-stone-500 block">Travel Dates</span>
                          <span className="font-bold text-[#1E2229]">
                            {b.checkInDate} → {b.checkOutDate}
                          </span>
                          <span className="text-stone-500 block mt-0.5">
                            {b.guestsCount} Guests ({b.roomsCount} Unit/s)
                          </span>
                        </div>

                        <div>
                          <span className="text-stone-500 block">Preferred Contact</span>
                          <span className="font-bold text-[#1E2229]">{b.preferredContactMethod}</span>
                          <div className="pt-2">
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waReply)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white font-medium text-[11px] hover:bg-[#20bd5a] transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>Reply on WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {b.specialRequest && (
                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] text-xs">
                          <strong className="text-stone-700">Special Request / Notes:</strong>
                          <p className="text-stone-600 mt-0.5 italic">{b.specialRequest}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {store.enquiries.map((enq) => {
              const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
              const waReply = `Hello ${enq.name}, this is ZoomStay regarding your inquiry (${enq.id}). How may we assist you today?`;

              return (
                <div key={enq.id} className="p-6 rounded-2xl bg-white border border-[#EBE4DC] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0ECE4] gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#8C7355]">{enq.id}</span>
                      <span className="text-xs font-bold text-[#1E2229]">{enq.name}</span>
                      <span className="text-xs text-stone-500">
                        {enq.destination} • {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={enq.status}
                        onChange={(e: any) => updateEnquiryStatus(enq.id, e.target.value)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-200 outline-none"
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-stone-500 block">Contact</span>
                      <span className="font-bold text-[#1E2229]">{enq.phone}</span>
                      {enq.email && <span className="text-stone-500 block">{enq.email}</span>}
                    </div>

                    <div>
                      <span className="text-stone-500 block">Inquiry Type</span>
                      <span className="font-bold text-[#1E2229]">{enq.enquiryType}</span>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waReply)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] text-white font-medium text-xs hover:bg-[#20bd5a] transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] text-xs text-[#444C57]">
                    <strong>Message:</strong>
                    <p className="mt-1 leading-relaxed">{enq.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: PROPERTIES & PRICING */}
        {activeTab === 'properties' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Global Pricing Toggle Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#EBE4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                  Public Pricing Visibility Toggle
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  When turned OFF, all public cards and detail views hide numbers and state "Rates on Request".
                </p>
              </div>

              <button
                onClick={() =>
                  updateSiteSettings({
                    publicPricingEnabled: !store.siteSettings.publicPricingEnabled,
                  })
                }
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition ${
                  store.siteSettings.publicPricingEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-300 text-stone-800'
                }`}
              >
                {store.siteSettings.publicPricingEnabled ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Public Pricing: ENABLED</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Public Pricing: HIDDEN</span>
                  </>
                )}
              </button>
            </div>

            {/* Properties List */}
            <div className="space-y-4">
              {store.properties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-6 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm flex flex-col md:flex-row gap-6"
                >
                  <img
                    src={prop.coverImage}
                    alt={prop.name}
                    className="w-full md:w-56 h-40 object-cover rounded-xl shrink-0"
                  />

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-xl font-bold text-[#1E2229]">{prop.name}</h4>
                        <p className="text-xs text-stone-500">
                          {prop.destinationName} • {prop.propertyType} • {prop.bedrooms} BHK
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProperty(prop)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-semibold"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2">{prop.shortDescription}</p>

                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0ECE4] flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="text-stone-500 block">Base Price Per Night:</span>
                        <span className="font-bold text-sm text-[#1E2229]">
                          {prop.pricing.currency} {prop.pricing.basePricePerNight?.toLocaleString()} / night
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-500 block">Property Pricing Active:</span>
                        <span className="font-semibold text-[#8C7355]">
                          {prop.pricing.enabled ? 'Yes' : 'Rates on Request'}
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-500 block">Featured on Home:</span>
                        <button
                          onClick={() => updateProperty(prop.id, { featured: !prop.featured })}
                          className={`font-semibold underline ${prop.featured ? 'text-emerald-700' : 'text-stone-400'}`}
                        >
                          {prop.featured ? 'Featured (Yes)' : 'Standard (No)'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BUILDING UNITS */}
        {activeTab === 'units' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EBE4DC]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                  Specific Building Units ({store.units.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Manage individual standalone units (e.g. Unit 101, 102 in Varanasi multi-unit building).
                </p>
              </div>

              <button
                onClick={() => setShowAddUnitModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2229] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333942] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Unit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {store.units.map((unit) => {
                const parentProp = store.properties.find((p) => p.id === unit.propertyId);

                return (
                  <div key={unit.id} className="p-5 rounded-2xl bg-white border border-[#EBE4DC] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-bold text-[#1E2229]">{unit.unitName}</h4>
                      <select
                        value={unit.status}
                        onChange={(e: any) => updateUnit(unit.id, { status: e.target.value })}
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border outline-none ${
                          unit.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : unit.status === 'Occupied'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Reserved">Reserved</option>
                      </select>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1">
                      <div>Property: <strong className="text-stone-900">{parentProp?.name}</strong></div>
                      <div>Floor: <strong className="text-stone-900">{unit.floor}</strong></div>
                      <div>Specs: {unit.bedrooms} Bed • {unit.bathrooms} Bath • Max {unit.capacity} Guests</div>
                      <div className="text-[#8C7355] font-medium">{unit.bedsDescription}</div>
                      {unit.notes && <p className="italic text-[11px] text-stone-500 pt-1">"{unit.notes}"</p>}
                    </div>

                    <div className="pt-2 border-t border-[#F0ECE4] flex items-center justify-end">
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${unit.unitName}?`)) deleteUnit(unit.id);
                        }}
                        className="text-stone-400 hover:text-red-600 p-1 transition"
                        title="Delete unit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#EBE4DC]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                  Visual Gallery Photographs ({store.gallery.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Add or remove photos displayed in the public gallery and property views.
                </p>
              </div>

              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E2229] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333942] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {store.gallery.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-2xl overflow-hidden group border border-stone-200 bg-white"
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                    <span className="text-xs font-bold">{img.title}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Remove photo "${img.title}"?`)) deleteGalleryImage(img.id);
                      }}
                      className="self-end p-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-white border border-[#EBE4DC]">
              <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                Guest Reviews Moderation ({store.reviews.length})
              </h3>
              <p className="text-xs text-stone-500">
                Approve public reviews submitted by guests before they appear live on the site.
              </p>
            </div>

            <div className="space-y-4">
              {store.reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-white border border-[#EBE4DC] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F0ECE4]">
                    <div>
                      <span className="font-bold text-sm text-[#1E2229]">{rev.guestName}</span>
                      <span className="text-xs text-stone-500 ml-2">
                        ({rev.location}) • {rev.stayDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateReview(rev.id, { approved: !rev.approved })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                          rev.approved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.approved ? 'Approved (Live)' : 'Pending Approval'}
                      </button>

                      <button
                        onClick={() => updateReview(rev.id, { featured: !rev.featured })}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                          rev.featured
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {rev.featured ? 'Featured' : 'Standard'}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Delete this review permanently?')) deleteReview(rev.id);
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#444C57] italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS & DESKS */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Site Info & Notification Email */}
            <div className="p-8 rounded-2xl bg-white border border-[#EBE4DC] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                Notification & Communication Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Central Official Email (Displayed on site)
                  </label>
                  <input
                    type="email"
                    value={store.contact.email}
                    onChange={(e) => updateContact({ email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Admin Notification Email (Receives copy of all bookings)
                  </label>
                  <input
                    type="email"
                    value={store.siteSettings.adminNotificationEmail}
                    onChange={(e) =>
                      updateSiteSettings({ adminNotificationEmail: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleTestEmail}
                  disabled={isSendingTestEmail}
                  className="px-4 py-2 rounded-xl bg-[#1E2229] hover:bg-[#333942] text-white text-xs font-bold tracking-wider uppercase transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#C5B49E]" />
                  <span>{isSendingTestEmail ? 'Testing...' : 'Test Email Dispatch'}</span>
                </button>

                {testEmailResult && (
                  <span
                    className={`text-xs font-semibold ${
                      testEmailResult.success ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {testEmailResult.message}
                  </span>
                )}
              </div>
            </div>

            {/* Direct Phone Numbers (Varanasi & Lucknow) */}
            <div className="p-8 rounded-2xl bg-white border border-[#EBE4DC] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                Desk Coordinators & WhatsApp Numbers
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] mb-2">
                    Varanasi Desk Numbers
                  </h4>
                  <div className="space-y-2">
                    {(store.contact?.varanasiContacts || []).map((c, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <span className="w-28 font-bold text-[#1E2229]">{c.name} ({c.role}):</span>
                        <input
                          type="text"
                          value={c.phone}
                          onChange={(e) => {
                            const updated = [...(store.contact?.varanasiContacts || [])];
                            updated[idx].phone = e.target.value;
                            updateContact({ varanasiContacts: updated });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs w-52"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0ECE4]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C7355] mb-2">
                    Lucknow Desk Numbers
                  </h4>
                  <div className="space-y-2">
                    {(store.contact?.lucknowContacts || []).map((c, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <span className="w-28 font-bold text-[#1E2229]">{c.name} ({c.role}):</span>
                        <input
                          type="text"
                          value={c.phone}
                          onChange={(e) => {
                            const updated = [...(store.contact?.lucknowContacts || [])];
                            updated[idx].phone = e.target.value;
                            updateContact({ lucknowContacts: updated });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs w-52"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: EMAIL DISPATCH LOGS */}
        {activeTab === 'emailLogs' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-white border border-[#EBE4DC]">
              <h3 className="font-serif text-lg font-bold text-[#1E2229]">
                Live Email Dispatch Register ({emailLogsList.length})
              </h3>
              <p className="text-xs text-stone-500">
                Audit trail of all booking vouchers, enquiries, and admin notifications.
              </p>
            </div>

            <div className="space-y-3">
              {emailLogsList.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-2xl border border-[#EBE4DC]">
                  No email dispatches recorded yet.
                </div>
              ) : (
                emailLogsList.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-white border border-[#EBE4DC] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
                  >
                    <div>
                      <div className="font-bold text-[#1E2229]">{log.subject}</div>
                      <div className="text-stone-500">
                        Recipient: <strong>{log.to}</strong> • {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        log.status === 'Sent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: EDIT PROPERTY */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-[#EBE4DC] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <h3 className="font-serif text-xl font-bold text-[#1E2229]">
                Edit {editingProperty.name}
              </h3>
              <button
                onClick={() => setEditingProperty(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Property Name</label>
                <input
                  type="text"
                  value={editingProperty.name}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingProperty.tagline}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingProperty.coverImage}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, coverImage: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Base Price / Night (INR)</label>
                  <input
                    type="number"
                    value={editingProperty.pricing.basePricePerNight || 0}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        pricing: {
                          ...editingProperty.pricing,
                          basePricePerNight: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Show Price Publicly</label>
                  <select
                    value={editingProperty.pricing.enabled ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        pricing: {
                          ...editingProperty.pricing,
                          enabled: e.target.value === 'true',
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  >
                    <option value="true">Yes, show rate</option>
                    <option value="false">No, rates on request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProperty.shortDescription}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={editingProperty.longDescription}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, longDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F0ECE4]">
              <button
                onClick={() => setEditingProperty(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateProperty(editingProperty.id, editingProperty);
                  setEditingProperty(null);
                }}
                className="px-6 py-2 rounded-xl bg-[#1E2229] text-white text-xs font-bold uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD UNIT */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EBE4DC] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <h3 className="font-serif text-lg font-bold text-[#1E2229]">Add Building Unit</h3>
              <button onClick={() => setShowAddUnitModal(false)} className="text-stone-400">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Unit Name</label>
                <input
                  type="text"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="e.g. Unit 302 - Executive Balcony"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Belongs to Property</label>
                <select
                  value={newUnitPropertyId}
                  onChange={(e) => setNewUnitPropertyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                >
                  {store.properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Floor</label>
                  <input
                    type="text"
                    value={newUnitFloor}
                    onChange={(e) => setNewUnitFloor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newUnitCapacity}
                    onChange={(e) => setNewUnitCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Beds Specification</label>
                <input
                  type="text"
                  value={newUnitBeds}
                  onChange={(e) => setNewUnitBeds(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes / Accessibility</label>
                <input
                  type="text"
                  value={newUnitNotes}
                  onChange={(e) => setNewUnitNotes(e.target.value)}
                  placeholder="e.g. Lift access, road-facing balcony"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-[#F0ECE4]">
              <button
                onClick={() => setShowAddUnitModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newUnitName.trim()) return;
                  await addUnit({
                    propertyId: newUnitPropertyId,
                    unitName: newUnitName.trim(),
                    floor: newUnitFloor,
                    bedrooms: newUnitBedrooms,
                    bathrooms: newUnitBathrooms,
                    capacity: newUnitCapacity,
                    bedsDescription: newUnitBeds,
                    status: 'Available',
                    notes: newUnitNotes.trim(),
                  });
                  setShowAddUnitModal(false);
                  setNewUnitName('');
                }}
                className="px-5 py-2 rounded-xl bg-[#1E2229] text-white text-xs font-bold uppercase tracking-wider"
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD GALLERY PHOTO */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EBE4DC] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <h3 className="font-serif text-lg font-bold text-[#1E2229]">Add Photo to Gallery</h3>
              <button onClick={() => setShowAddPhotoModal(false)} className="text-stone-400">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Caption / Title</label>
                <input
                  type="text"
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="e.g. Master Bedroom Suite"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newPhotoCategory}
                    onChange={(e: any) => setNewPhotoCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  >
                    <option value="living">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="exterior">Exterior / Balcony</option>
                    <option value="view">City Landmark</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Destination</label>
                  <select
                    value={newPhotoDest}
                    onChange={(e: any) => setNewPhotoDest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  >
                    <option value="varanasi">Varanasi</option>
                    <option value="lucknow">Lucknow</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-[#F0ECE4]">
              <button
                onClick={() => setShowAddPhotoModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newPhotoUrl.trim()) return;
                  await addGalleryImage({
                    url: newPhotoUrl.trim(),
                    title: newPhotoTitle.trim() || 'ZoomStay Residence',
                    alt: newPhotoTitle.trim(),
                    category: newPhotoCategory,
                    destinationId: newPhotoDest,
                  });
                  setShowAddPhotoModal(false);
                  setNewPhotoUrl('');
                  setNewPhotoTitle('');
                }}
                className="px-5 py-2 rounded-xl bg-[#1E2229] text-white text-xs font-bold uppercase tracking-wider"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
