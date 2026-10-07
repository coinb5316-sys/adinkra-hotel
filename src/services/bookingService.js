// src/services/bookingService.js
/**
 * Booking service — single source of truth for reservation data.
 *
 * TODAY: persists to localStorage so the app works end-to-end.
 * LATER: swap the bodies of these functions for fetch() calls to your API.
 *        The signatures must not change — the UI depends on them.
 */

const STORAGE_KEY = 'adinkra_bookings';

/* ---------------- internal helpers ---------------- */

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedIfEmpty();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return seedIfEmpty();
    return parsed;
  } catch {
    return seedIfEmpty();
  }
}

function writeAll(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function makeId() {
  return `ADK-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

/* ---------------- demo seed data ---------------- */

function seedIfEmpty() {
  const today = new Date();
  const iso = (d) => d.toISOString().split('T')[0];
  const addDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return iso(d);
  };

  const demo = [
    {
      id: 'ADK-DEMO-0001',
      reference: 'ADK-DEMO-0001',
      userId: 'demo@theadinkra.com',
      guestName: 'Akosua Boateng',
      guestEmail: 'demo@theadinkra.com',
      guestPhone: '+233 24 555 0101',
      roomId: 'atlantic-suite',
      roomName: 'The Atlantic Suite',
      roomImage:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop',
      checkIn: addDays(12),
      checkOut: addDays(15),
      guests: 2,
      nights: 3,
      subtotal: 21600,
      total: 29376,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      paymentReference: 'ADK-DEMO-PAY-0001',
      notes: 'Honeymoon — please prepare a small welcome amenity.',
    },
    {
      id: 'ADK-DEMO-0002',
      reference: 'ADK-DEMO-0002',
      userId: 'demo@theadinkra.com',
      guestName: 'Akosua Boateng',
      guestEmail: 'demo@theadinkra.com',
      guestPhone: '+233 24 555 0101',
      roomId: 'aburi-suite',
      roomName: 'The Aburi Suite',
      roomImage:
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80&auto=format&fit=crop',
      checkIn: addDays(-40),
      checkOut: addDays(-37),
      guests: 1,
      nights: 3,
      subtotal: 14550,
      total: 19788,
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      paymentReference: 'ADK-DEMO-PAY-0002',
      notes: '',
    },
    {
      id: 'ADK-DEMO-0003',
      reference: 'ADK-DEMO-0003',
      userId: 'kwame@example.com',
      guestName: 'Kwame Mensah',
      guestEmail: 'kwame@example.com',
      guestPhone: '+233 20 444 0202',
      roomId: 'penthouse',
      roomName: 'The Osu Penthouse',
      roomImage:
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80&auto=format&fit=crop',
      checkIn: addDays(5),
      checkOut: addDays(8),
      guests: 4,
      nights: 3,
      subtotal: 55500,
      total: 75480,
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      paymentReference: 'ADK-DEMO-PAY-0003',
      notes: 'Requires airport pickup at 22:40.',
    },
    {
      id: 'ADK-DEMO-0004',
      reference: 'ADK-DEMO-0004',
      userId: 'amara@example.com',
      guestName: 'Amara Okafor',
      guestEmail: 'amara@example.com',
      guestPhone: '+234 803 555 0303',
      roomId: 'executive-suite',
      roomName: 'Executive Suite',
      roomImage:
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80&auto=format&fit=crop',
      checkIn: addDays(2),
      checkOut: addDays(4),
      guests: 1,
      nights: 2,
      subtotal: 12800,
      total: 17408,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      paymentReference: 'ADK-DEMO-PAY-0004',
      notes: 'Early check-in requested (11 AM).',
    },
    {
      id: 'ADK-DEMO-0005',
      reference: 'ADK-DEMO-0005',
      userId: 'james@example.com',
      guestName: 'James Whitfield',
      guestEmail: 'james@example.com',
      guestPhone: '+44 7700 900 505',
      roomId: 'twin-room',
      roomName: 'The Twin',
      roomImage:
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80&auto=format&fit=crop',
      checkIn: addDays(-5),
      checkOut: addDays(-3),
      guests: 2,
      nights: 2,
      subtotal: 5900,
      total: 8024,
      status: 'cancelled',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      paymentReference: 'ADK-DEMO-PAY-0005',
      notes: 'Guest had to cancel due to flight change.',
    },
  ];

  writeAll(demo);
  return demo;
}

/* ---------------- public API ---------------- */

/**
 * Create a new booking.
 * Called from Booking.jsx on Paystack success.
 */
export async function createBooking(booking) {
  const all = readAll();
  const record = {
    id: makeId(),
    reference: booking.reference || makeId(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    ...booking,
  };
  all.unshift(record);
  writeAll(all);
  return record;
}

/**
 * Get all bookings for a specific user (matched by email).
 */
export async function getBookingsForUser(email) {
  if (!email) return [];
  const all = readAll();
  return all
    .filter((b) => b.guestEmail?.toLowerCase() === email.toLowerCase())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get a single booking by reference.
 */
export async function getBookingByReference(reference) {
  const all = readAll();
  return all.find((b) => b.reference === reference) || null;
}

/**
 * Update a booking (status, notes, etc).
 */
export async function updateBooking(reference, patch) {
  const all = readAll();
  const idx = all.findIndex((b) => b.reference === reference);
  if (idx === -1) throw new Error('Booking not found');
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  writeAll(all);
  return all[idx];
}

/**
 * Cancel a booking (soft cancel — sets status).
 */
export async function cancelBooking(reference) {
  return updateBooking(reference, { status: 'cancelled' });
}

/* ---------------- admin only ---------------- */

/**
 * Get every booking in the system.
 * In production this would be behind admin auth on your backend.
 */
export async function getAllBookings() {
  const all = readAll();
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Aggregate stats for the admin dashboard.
 */
export async function getAdminStats() {
  const all = readAll();
  const now = new Date();
  const todayIso = now.toISOString().split('T')[0];

  const upcoming = all.filter(
    (b) => b.status !== 'cancelled' && b.checkIn >= todayIso,
  );
  const active = all.filter(
    (b) =>
      b.status === 'confirmed' &&
      b.checkIn <= todayIso &&
      b.checkOut >= todayIso,
  );
  const completed = all.filter((b) => b.status === 'completed');
  const cancelled = all.filter((b) => b.status === 'cancelled');

  const revenue = all
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent = all.filter(
    (b) => new Date(b.createdAt) >= thirtyDaysAgo && b.status !== 'cancelled',
  );
  const recentRevenue = recent.reduce((sum, b) => sum + (b.total || 0), 0);

  // Occupancy: rooms booked today / total rooms
  const TOTAL_ROOMS = 42;
  const occupancy = Math.round((active.length / TOTAL_ROOMS) * 100);

  return {
    totalBookings: all.length,
    upcoming: upcoming.length,
    active: active.length,
    completed: completed.length,
    cancelled: cancelled.length,
    revenue,
    recentRevenue,
    occupancy,
    totalRooms: TOTAL_ROOMS,
  };
}