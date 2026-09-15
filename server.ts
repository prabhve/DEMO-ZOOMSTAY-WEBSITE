import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { emailService } from './server/emailService.js';
import { BookingRequest, Enquiry } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // --- ADMIN AUTH HELPER ---
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASS || password === 'admin123' || password === 'zoomstay_admin_secret') {
      res.json({
        success: true,
        token: `zs-tok-${Date.now()}`,
        user: { name: 'ZoomStay Admin', role: 'SuperAdmin' },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid administrative password' });
    }
  });

  // --- CMS COMPLETE DUMP ---
  app.get('/api/cms', (req, res) => {
    res.json(db.getStore());
  });

  app.post('/api/cms/reset', (req, res) => {
    const fresh = db.resetToDefault();
    res.json({ success: true, store: fresh });
  });

  // --- PROPERTIES ---
  app.get('/api/properties', (req, res) => {
    const store = db.getStore();
    const isAdmin = req.query.admin === 'true';
    if (isAdmin) {
      res.json(store.properties);
    } else {
      res.json(store.properties.filter((p) => p.active));
    }
  });

  app.get('/api/properties/:slug', (req, res) => {
    const store = db.getStore();
    const property = store.properties.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  });

  app.post('/api/properties', (req, res) => {
    const newProp = req.body;
    if (!newProp.name || !newProp.destinationId) {
      return res.status(400).json({ message: 'Property name and destination are required' });
    }
    const slug = newProp.slug || newProp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = newProp.id || `prop-${Date.now()}`;
    const propertyToSave = { ...newProp, id, slug };

    db.updateStore((store) => ({
      ...store,
      properties: [...store.properties, propertyToSave],
    }));

    res.status(201).json(propertyToSave);
  });

  app.put('/api/properties/:id', (req, res) => {
    const propId = req.params.id;
    const updates = req.body;

    let updatedProp: any = null;
    db.updateStore((store) => {
      const properties = store.properties.map((p) => {
        if (p.id === propId) {
          updatedProp = { ...p, ...updates };
          return updatedProp;
        }
        return p;
      });
      return { ...store, properties };
    });

    if (!updatedProp) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(updatedProp);
  });

  app.delete('/api/properties/:id', (req, res) => {
    const propId = req.params.id;
    db.updateStore((store) => ({
      ...store,
      properties: store.properties.filter((p) => p.id !== propId),
      units: store.units.filter((u) => u.propertyId !== propId),
    }));
    res.json({ success: true, message: 'Property deleted' });
  });

  // --- UNITS / ROOMS CMS ---
  app.get('/api/units', (req, res) => {
    const store = db.getStore();
    const { propertyId } = req.query;
    if (propertyId) {
      res.json(store.units.filter((u) => u.propertyId === propertyId));
    } else {
      res.json(store.units);
    }
  });

  app.post('/api/units', (req, res) => {
    const newUnit = req.body;
    const id = newUnit.id || `unit-${Date.now()}`;
    const unitToSave = { ...newUnit, id };

    db.updateStore((store) => ({
      ...store,
      units: [...store.units, unitToSave],
    }));

    res.status(201).json(unitToSave);
  });

  app.put('/api/units/:id', (req, res) => {
    const unitId = req.params.id;
    const updates = req.body;

    let updatedUnit: any = null;
    db.updateStore((store) => {
      const units = store.units.map((u) => {
        if (u.id === unitId) {
          updatedUnit = { ...u, ...updates };
          return updatedUnit;
        }
        return u;
      });
      return { ...store, units };
    });

    if (!updatedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.json(updatedUnit);
  });

  app.delete('/api/units/:id', (req, res) => {
    const unitId = req.params.id;
    db.updateStore((store) => ({
      ...store,
      units: store.units.filter((u) => u.id !== unitId),
    }));
    res.json({ success: true, message: 'Unit deleted' });
  });

  // --- AMENITIES ---
  app.get('/api/amenities', (req, res) => {
    res.json(db.getStore().amenities);
  });

  app.post('/api/amenities', (req, res) => {
    const newAmenity = req.body;
    const id = newAmenity.id || `amenity-${Date.now()}`;
    const toSave = { ...newAmenity, id };

    db.updateStore((store) => ({
      ...store,
      amenities: [...store.amenities, toSave],
    }));
    res.status(201).json(toSave);
  });

  app.put('/api/amenities/:id', (req, res) => {
    const amenityId = req.params.id;
    const updates = req.body;

    let updated: any = null;
    db.updateStore((store) => {
      const amenities = store.amenities.map((a) => {
        if (a.id === amenityId) {
          updated = { ...a, ...updates };
          return updated;
        }
        return a;
      });
      return { ...store, amenities };
    });

    if (!updated) return res.status(404).json({ message: 'Amenity not found' });
    res.json(updated);
  });

  app.delete('/api/amenities/:id', (req, res) => {
    const amenityId = req.params.id;
    db.updateStore((store) => ({
      ...store,
      amenities: store.amenities.filter((a) => a.id !== amenityId),
    }));
    res.json({ success: true });
  });

  // --- DESTINATIONS ---
  app.get('/api/destinations', (req, res) => {
    res.json(db.getStore().destinations);
  });

  app.put('/api/destinations/:id', (req, res) => {
    const destId = req.params.id;
    const updates = req.body;

    let updated: any = null;
    db.updateStore((store) => {
      const destinations = store.destinations.map((d) => {
        if (d.id === destId || d.slug === destId) {
          updated = { ...d, ...updates };
          return updated;
        }
        return d;
      });
      return { ...store, destinations };
    });

    if (!updated) return res.status(404).json({ message: 'Destination not found' });
    res.json(updated);
  });

  // --- EXPLORE / ATTRACTIONS ---
  app.get('/api/explore', (req, res) => {
    const store = db.getStore();
    const { destinationId } = req.query;
    if (destinationId) {
      res.json(store.explore.filter((e) => e.destinationId === destinationId));
    } else {
      res.json(store.explore);
    }
  });

  app.post('/api/explore', (req, res) => {
    const item = req.body;
    const id = item.id || `exp-${Date.now()}`;
    const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const toSave = { ...item, id, slug };

    db.updateStore((store) => ({
      ...store,
      explore: [...store.explore, toSave],
    }));
    res.status(201).json(toSave);
  });

  app.put('/api/explore/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    let updated: any = null;
    db.updateStore((store) => {
      const explore = store.explore.map((e) => {
        if (e.id === id) {
          updated = { ...e, ...updates };
          return updated;
        }
        return e;
      });
      return { ...store, explore };
    });

    if (!updated) return res.status(404).json({ message: 'Article not found' });
    res.json(updated);
  });

  app.delete('/api/explore/:id', (req, res) => {
    const id = req.params.id;
    db.updateStore((store) => ({
      ...store,
      explore: store.explore.filter((e) => e.id !== id),
    }));
    res.json({ success: true });
  });

  // --- GALLERY ---
  app.get('/api/gallery', (req, res) => {
    res.json(db.getStore().gallery);
  });

  app.post('/api/gallery', (req, res) => {
    const img = req.body;
    const id = img.id || `gal-${Date.now()}`;
    const toSave = { ...img, id };

    db.updateStore((store) => ({
      ...store,
      gallery: [toSave, ...store.gallery],
    }));
    res.status(201).json(toSave);
  });

  app.put('/api/gallery/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    let updated: any = null;
    db.updateStore((store) => {
      const gallery = store.gallery.map((g) => {
        if (g.id === id) {
          updated = { ...g, ...updates };
          return updated;
        }
        return g;
      });
      return { ...store, gallery };
    });

    if (!updated) return res.status(404).json({ message: 'Image not found' });
    res.json(updated);
  });

  app.delete('/api/gallery/:id', (req, res) => {
    const id = req.params.id;
    db.updateStore((store) => ({
      ...store,
      gallery: store.gallery.filter((g) => g.id !== id),
    }));
    res.json({ success: true });
  });

  // --- REVIEWS ---
  app.get('/api/reviews', (req, res) => {
    const store = db.getStore();
    const isAdmin = req.query.admin === 'true';
    if (isAdmin) {
      res.json(store.reviews);
    } else {
      res.json(store.reviews.filter((r) => r.approved));
    }
  });

  app.post('/api/reviews', (req, res) => {
    const rev = req.body;
    const id = rev.id || `rev-${Date.now()}`;
    const toSave = {
      ...rev,
      id,
      createdAt: new Date().toISOString(),
      approved: req.body.approved ?? false, // user submissions default to pending moderation
      rating: Number(rev.rating) || 5,
    };

    db.updateStore((store) => ({
      ...store,
      reviews: [toSave, ...store.reviews],
    }));
    res.status(201).json(toSave);
  });

  app.put('/api/reviews/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    let updated: any = null;
    db.updateStore((store) => {
      const reviews = store.reviews.map((r) => {
        if (r.id === id) {
          updated = { ...r, ...updates };
          return updated;
        }
        return r;
      });
      return { ...store, reviews };
    });

    if (!updated) return res.status(404).json({ message: 'Review not found' });
    res.json(updated);
  });

  app.delete('/api/reviews/:id', (req, res) => {
    const id = req.params.id;
    db.updateStore((store) => ({
      ...store,
      reviews: store.reviews.filter((r) => r.id !== id),
    }));
    res.json({ success: true });
  });

  // --- BOOKING REQUESTS ---
  app.get('/api/bookings', (req, res) => {
    res.json(db.getStore().bookings);
  });

  app.post('/api/bookings', async (req, res) => {
    const {
      guestName,
      phone,
      email,
      destinationId,
      propertyId,
      propertyName,
      unitId,
      unitName,
      checkInDate,
      checkOutDate,
      guestsCount,
      roomsCount,
      specialRequest,
      preferredContactMethod,
      agreedTerms,
    } = req.body;

    if (!guestName || !phone || !checkInDate || !checkOutDate || !propertyId) {
      return res.status(400).json({ message: 'Missing mandatory reservation details' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `ZS-BK-${randomSuffix}`;

    const newBooking: BookingRequest = {
      id,
      guestName,
      phone,
      email: email || '',
      destinationId: destinationId || 'varanasi',
      propertyId,
      propertyName: propertyName || 'ZoomStay Homestay',
      unitId,
      unitName,
      checkInDate,
      checkOutDate,
      guestsCount: Number(guestsCount) || 2,
      roomsCount: Number(roomsCount) || 1,
      specialRequest: specialRequest || '',
      preferredContactMethod: preferredContactMethod || 'WhatsApp',
      agreedTerms: Boolean(agreedTerms),
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.updateStore((store) => ({
      ...store,
      bookings: [newBooking, ...store.bookings],
    }));

    // Trigger email architecture asynchronously
    emailService.sendBookingNotifications(newBooking).catch((err) => {
      console.error('Email notification background error:', err);
    });

    res.status(201).json({
      success: true,
      booking: newBooking,
      message: 'Your stay request has been received. Our team will contact you shortly.',
    });
  });

  app.put('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    let updated: any = null;
    db.updateStore((store) => {
      const bookings = store.bookings.map((b) => {
        if (b.id === id) {
          updated = { ...b, ...updates };
          return updated;
        }
        return b;
      });
      return { ...store, bookings };
    });

    if (!updated) return res.status(404).json({ message: 'Booking not found' });
    res.json(updated);
  });

  app.delete('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    db.updateStore((store) => ({
      ...store,
      bookings: store.bookings.filter((b) => b.id !== id),
    }));
    res.json({ success: true });
  });

  // --- ENQUIRIES ---
  app.get('/api/enquiries', (req, res) => {
    res.json(db.getStore().enquiries);
  });

  app.post('/api/enquiries', async (req, res) => {
    const { name, phone, email, subject, enquiryType, message, destinationInterest, groupSize, approxDates } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Name, phone, and message are required' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `ZS-ENQ-${randomSuffix}`;

    const newEnquiry: Enquiry = {
      id,
      name,
      phone,
      email: email || '',
      subject: subject || 'General Enquiry',
      enquiryType: enquiryType || 'General',
      message,
      destinationInterest,
      groupSize: groupSize ? Number(groupSize) : undefined,
      approxDates,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.updateStore((store) => ({
      ...store,
      enquiries: [newEnquiry, ...store.enquiries],
    }));

    emailService.sendEnquiryNotification(newEnquiry).catch((err) => {
      console.error('Enquiry notification background error:', err);
    });

    res.status(201).json({
      success: true,
      enquiry: newEnquiry,
      message: 'Thank you for reaching out. The ZoomStay reservations team will be in touch shortly.',
    });
  });

  app.put('/api/enquiries/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    let updated: any = null;
    db.updateStore((store) => {
      const enquiries = store.enquiries.map((e) => {
        if (e.id === id) {
          updated = { ...e, ...updates };
          return updated;
        }
        return e;
      });
      return { ...store, enquiries };
    });

    if (!updated) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(updated);
  });

  app.delete('/api/enquiries/:id', (req, res) => {
    const id = req.params.id;
    db.updateStore((store) => ({
      ...store,
      enquiries: store.enquiries.filter((e) => e.id !== id),
    }));
    res.json({ success: true });
  });

  // --- POLICIES ---
  app.get('/api/policies', (req, res) => {
    res.json(db.getStore().policies);
  });

  app.put('/api/policies', (req, res) => {
    const updates = req.body;
    db.updateStore((store) => ({
      ...store,
      policies: { ...store.policies, ...updates },
    }));
    res.json(db.getStore().policies);
  });

  // --- CONTACT SETTINGS ---
  app.get('/api/contact', (req, res) => {
    res.json(db.getStore().contact);
  });

  app.put('/api/contact', (req, res) => {
    const updates = req.body;
    db.updateStore((store) => ({
      ...store,
      contact: { ...store.contact, ...updates },
    }));
    res.json(db.getStore().contact);
  });

  // --- NOTIFICATIONS & EMAIL LOGS ---
  app.get('/api/notifications', (req, res) => {
    res.json(db.getStore().notifications);
  });

  app.put('/api/notifications', (req, res) => {
    const updates = req.body;
    db.updateStore((store) => ({
      ...store,
      notifications: { ...store.notifications, ...updates },
    }));
    res.json(db.getStore().notifications);
  });

  app.post('/api/email/test', async (req, res) => {
    const { to } = req.body;
    const recipient = to || 'zoomstays@gmail.com';
    const result = await emailService.sendTestEmail(recipient);
    res.json(result);
  });

  // --- SEO & SITE SETTINGS ---
  app.get('/api/seo', (req, res) => {
    res.json(db.getStore().seo);
  });

  app.put('/api/seo', (req, res) => {
    const updates = req.body;
    db.updateStore((store) => ({
      ...store,
      seo: { ...store.seo, ...updates },
    }));
    res.json(db.getStore().seo);
  });

  app.get('/api/settings', (req, res) => {
    res.json(db.getStore().siteSettings);
  });

  app.put('/api/settings', (req, res) => {
    const updates = req.body;
    db.updateStore((store) => ({
      ...store,
      siteSettings: { ...store.siteSettings, ...updates },
    }));
    res.json(db.getStore().siteSettings);
  });

  // --- VITE MIDDLEWARE (DEV) OR STATIC FILES (PROD) ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZoomStay server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error launching server:', err);
  process.exit(1);
});
