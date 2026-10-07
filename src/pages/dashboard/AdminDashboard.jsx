// src/pages/dashboard/AdminDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  HiOutlineUsers,
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice2,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowLongRight,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineClock,
} from 'react-icons/hi2';
import { IoBedOutline } from 'react-icons/io5';
import { useAuth } from '../../auth/AuthContext';
import {
  getAllBookings,
  getAdminStats,
  updateBooking,
} from '../../services/bookingService';
import { formatGHS } from '../../utils/pricing';

// In production this check belongs on the server.
// For this build, only these emails can access the admin panel.
const ADMIN_EMAILS = [
  'admin@theadinkra.com',
  'demo@theadinkra.com', // so you can view it during development
];

export default function AdminDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const isAdmin = useMemo(
    () =>
      user?.email &&
      ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(
        user.email.toLowerCase(),
      ),
    [user],
  );

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      setFetching(true);
      const [all, s] = await Promise.all([getAllBookings(), getAdminStats()]);
      if (!cancelled) {
        setBookings(all);
        setStats(s);
        setFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const filtered = useMemo(() => {
    let list = [...bookings];
    if (statusFilter !== 'all') {
      list = list.filter((b) => b.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.guestName?.toLowerCase().includes(q) ||
          b.guestEmail?.toLowerCase().includes(q) ||
          b.reference?.toLowerCase().includes(q) ||
          b.roomName?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [bookings, statusFilter, search]);

  const handleStatusChange = async (reference, status) => {
    const updated = await updateBooking(reference, { status });
    setBookings((prev) =>
      prev.map((b) => (b.reference === reference ? updated : b)),
    );
    const s = await getAdminStats();
    setStats(s);
    if (selected?.reference === reference) setSelected(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink-300 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: { pathname: '/admin' } }}
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-cream-100 min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-md text-center">
          <p className="eyebrow mb-4">Restricted</p>
          <h1 className="heading-display text-4xl text-ink-900 mb-6">
            You don&rsquo;t have access.
          </h1>
          <p className="text-ink-600 leading-relaxed mb-8">
            This dashboard is reserved for The Adinkra staff. If you believe
            you should have access, please contact the administrator.
          </p>
          <Link to="/" className="btn-primary">
            Return home
            <HiOutlineArrowLongRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* TOP BAR */}
      <section className="pt-32 lg:pt-36 pb-10 bg-ink-900 text-cream-50">
        <div className="container-luxe">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="eyebrow text-gold-400 mb-4">
                Operations Console
              </p>
              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl">
                The Adinkra
                <br />
                <em className="font-serif italic font-normal text-gold-200">
                  front desk.
                </em>
              </h1>
              <p className="mt-6 text-cream-200/70 leading-relaxed max-w-xl">
                Live view of reservations, occupancy, and revenue.
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 border border-white/15 bg-white/5 backdrop-blur-sm">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-gold-400/60"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center">
                  <HiOutlineUsers className="w-5 h-5 text-gold-300" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-cream-50 truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-gold-300">
                  Administrator
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                aria-label="Sign out"
                className="ml-2 p-2 text-cream-200/60 hover:text-gold-300 transition-colors"
              >
                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-12 lg:py-16">
        <div className="container-luxe">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <KpiCard
              icon={<HiOutlineBuildingOffice2 className="w-5 h-5" />}
              label="Occupancy today"
              value={`${stats?.occupancy ?? 0}%`}
              caption={`${stats?.active ?? 0} of ${stats?.totalRooms ?? 42} rooms`}
            />
            <KpiCard
              icon={<HiOutlineCalendarDays className="w-5 h-5" />}
              label="Upcoming stays"
              value={stats?.upcoming ?? 0}
              caption={`${stats?.active ?? 0} currently in-house`}
            />
            <KpiCard
              icon={<HiOutlineBanknotes className="w-5 h-5" />}
              label="Total revenue"
              value={formatGHS(stats?.revenue ?? 0)}
              caption={`${formatGHS(stats?.recentRevenue ?? 0)} in last 30 days`}
            />
            <KpiCard
              icon={<HiOutlineUsers className="w-5 h-5" />}
              label="Total bookings"
              value={stats?.totalBookings ?? 0}
              caption={`${stats?.cancelled ?? 0} cancelled`}
            />
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="pb-24">
        <div className="container-luxe">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow mb-2">Reservations</p>
              <h2 className="heading-display text-3xl md:text-4xl text-ink-900">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'booking' : 'bookings'}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative">
                <HiOutlineMagnifyingGlass className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, reference…"
                  className="w-full sm:w-72 bg-transparent border border-ink-300 focus:border-gold-500 pl-11 pr-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border border-ink-300 px-4 py-3 text-xs uppercase tracking-widest text-ink-800 focus:outline-none"
              >
                <option value="all">All statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {fetching ? (
            <div className="h-64 bg-ink-200 animate-pulse" />
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border border-ink-200/60 bg-cream-50">
              <IoBedOutline className="w-8 h-8 text-ink-400 mx-auto mb-4" />
              <p className="font-display text-2xl text-ink-900 mb-2">
                No bookings match your filters.
              </p>
              <p className="text-sm text-ink-500">
                Try clearing the search or changing the status filter.
              </p>
            </div>
          ) : (
            <div className="bg-cream-50 border border-ink-200/60 overflow-hidden">
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 bg-cream-200/50">
                      <Th>Reference</Th>
                      <Th>Guest</Th>
                      <Th>Room</Th>
                      <Th>Dates</Th>
                      <Th>Nights</Th>
                      <Th align="right">Total</Th>
                      <Th>Status</Th>
                      <Th align="right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <tr
                        key={b.reference}
                        className="border-b border-ink-200/60 last:border-0 hover:bg-cream-200/30 transition-colors"
                      >
                        <Td>
                          <span className="font-mono text-xs text-ink-700">
                            {b.reference}
                          </span>
                        </Td>
                        <Td>
                          <div className="min-w-0">
                            <p className="text-ink-900 truncate max-w-[180px]">
                              {b.guestName}
                            </p>
                            <p className="text-xs text-ink-500 truncate max-w-[180px]">
                              {b.guestEmail}
                            </p>
                          </div>
                        </Td>
                        <Td>
                          <span className="text-ink-800">{b.roomName}</span>
                        </Td>
                        <Td>
                          <span className="text-ink-600 text-xs whitespace-nowrap">
                            {shortDate(b.checkIn)} → {shortDate(b.checkOut)}
                          </span>
                        </Td>
                        <Td>
                          <span className="text-ink-700">{b.nights}</span>
                        </Td>
                        <Td align="right">
                          <span className="text-ink-900 font-medium tabular-nums">
                            {formatGHS(b.total)}
                          </span>
                        </Td>
                        <Td>
                          <StatusPill status={b.status} />
                        </Td>
                        <Td align="right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelected(b)}
                              title="View"
                              className="p-2 text-ink-500 hover:text-gold-600 transition-colors"
                            >
                              <HiOutlineEye className="w-4 h-4" />
                            </button>
                            {b.status === 'pending' && (
                              <button
                                onClick={() =>
                                  handleStatusChange(b.reference, 'confirmed')
                                }
                                title="Confirm"
                                className="p-2 text-ink-500 hover:text-green-700 transition-colors"
                              >
                                <HiOutlineCheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {b.status === 'confirmed' && (
                              <button
                                onClick={() =>
                                  handleStatusChange(b.reference, 'completed')
                                }
                                title="Mark completed"
                                className="p-2 text-ink-500 hover:text-ink-900 transition-colors"
                              >
                                <HiOutlineCheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {b.status !== 'cancelled' &&
                              b.status !== 'completed' && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(b.reference, 'cancelled')
                                  }
                                  title="Cancel"
                                  className="p-2 text-ink-500 hover:text-red-700 transition-colors"
                                >
                                  <HiOutlineXCircle className="w-4 h-4" />
                                </button>
                              )}
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="lg:hidden divide-y divide-ink-200/60">
                {filtered.map((b) => (
                  <li key={b.reference} className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <p className="font-display text-lg text-ink-900 truncate">
                          {b.guestName}
                        </p>
                        <p className="text-xs text-ink-500 truncate mt-1">
                          {b.guestEmail}
                        </p>
                      </div>
                      <StatusPill status={b.status} />
                    </div>

                    <dl className="grid grid-cols-2 gap-y-3 text-xs mb-4">
                      <dt className="text-ink-400 uppercase tracking-widest">
                        Room
                      </dt>
                      <dd className="text-ink-800 text-right">{b.roomName}</dd>

                      <dt className="text-ink-400 uppercase tracking-widest">
                        Dates
                      </dt>
                      <dd className="text-ink-800 text-right">
                        {shortDate(b.checkIn)} → {shortDate(b.checkOut)}
                      </dd>

                      <dt className="text-ink-400 uppercase tracking-widest">
                        Nights
                      </dt>
                      <dd className="text-ink-800 text-right">{b.nights}</dd>

                      <dt className="text-ink-400 uppercase tracking-widest">
                        Total
                      </dt>
                      <dd className="text-ink-900 font-medium text-right">
                        {formatGHS(b.total)}
                      </dd>

                      <dt className="text-ink-400 uppercase tracking-widest">
                        Ref
                      </dt>
                      <dd className="text-ink-700 text-right font-mono text-[10px]">
                        {b.reference}
                      </dd>
                    </dl>

                    <div className="flex items-center gap-4 pt-4 border-t border-ink-200/60">
                      <button
                        onClick={() => setSelected(b)}
                        className="text-[10px] uppercase tracking-widest text-ink-700 hover:text-gold-600 transition-colors"
                      >
                        View details
                      </button>
                      {b.status === 'pending' && (
                        <button
                          onClick={() =>
                            handleStatusChange(b.reference, 'confirmed')
                          }
                          className="text-[10px] uppercase tracking-widest text-green-700 hover:text-green-800 transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button
                          onClick={() =>
                            handleStatusChange(b.reference, 'cancelled')
                          }
                          className="text-[10px] uppercase tracking-widest text-red-700 hover:text-red-800 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Detail drawer */}
      {selected && (
        <DetailDrawer
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

/* ================================================================
 *  SUBCOMPONENTS
 * ================================================================ */
function KpiCard({ icon, label, value, caption }) {
  return (
    <div className="p-6 lg:p-8 bg-cream-50 border border-ink-200/60">
      <div className="flex items-center gap-3 text-gold-500 mb-5">
        {icon}
        <span className="h-px flex-1 bg-ink-200" />
      </div>
      <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-2">
        {label}
      </p>
      <p className="font-display text-3xl lg:text-4xl text-ink-900 leading-none">
        {value}
      </p>
      <p className="text-[11px] text-ink-500 mt-3">{caption}</p>
    </div>
  );
}

function Th({ children, align = 'left' }) {
  return (
    <th
      className={`px-6 py-4 text-[10px] uppercase tracking-ultra-wide text-ink-500 font-medium whitespace-nowrap text-${align}`}
    >
      {children}
    </th>
  );
}

function Td({ children, align = 'left' }) {
  return (
    <td className={`px-6 py-4 text-${align}`}>
      {children}
    </td>
  );
}

function StatusPill({ status }) {
  const styles = {
    confirmed: 'bg-green-50 text-green-800 border-green-200',
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    completed: 'bg-ink-100 text-ink-700 border-ink-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  const icons = {
    confirmed: <HiOutlineCheckCircle className="w-3 h-3" />,
    pending: <HiOutlineClock className="w-3 h-3" />,
    completed: <HiOutlineCheckCircle className="w-3 h-3" />,
    cancelled: <HiOutlineXCircle className="w-3 h-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[10px] uppercase tracking-ultra-wide whitespace-nowrap ${
        styles[status] || styles.completed
      }`}
    >
      {icons[status]}
      {status}
    </span>
  );
}

function DetailDrawer({ booking, onClose, onStatusChange }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="relative w-full max-w-lg bg-cream-100 h-full overflow-y-auto">
        <div className="sticky top-0 bg-cream-100 border-b border-ink-200 px-8 h-20 flex items-center justify-between z-10">
          <div>
            <p className="eyebrow">Reservation</p>
            <p className="font-mono text-xs text-ink-700 mt-1">
              {booking.reference}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 transition-colors p-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Room */}
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={booking.roomImage}
              alt={booking.roomName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-2">
              Room
            </p>
            <p className="font-display text-2xl text-ink-900">
              {booking.roomName}
            </p>
          </div>

          {/* Guest */}
          <Section title="Guest">
            <Row label="Name" value={booking.guestName} />
            <Row label="Email" value={booking.guestEmail} />
            <Row label="Phone" value={booking.guestPhone || '—'} />
          </Section>

          {/* Stay */}
          <Section title="Stay">
            <Row label="Check-in" value={longDate(booking.checkIn)} />
            <Row label="Check-out" value={longDate(booking.checkOut)} />
            <Row label="Nights" value={booking.nights} />
            <Row label="Guests" value={booking.guests} />
          </Section>

          {/* Payment */}
          <Section title="Payment">
            <Row label="Subtotal" value={formatGHS(booking.subtotal)} />
            <Row label="Total paid" value={formatGHS(booking.total)} />
            <Row
              label="Paystack ref"
              value={
                <span className="font-mono text-xs">
                  {booking.paymentReference}
                </span>
              }
            />
          </Section>

          {/* Notes */}
          {booking.notes && (
            <Section title="Guest notes">
              <p className="text-sm text-ink-700 italic leading-relaxed">
                {booking.notes}
              </p>
            </Section>
          )}

          {/* Actions */}
          <div>
            <p className="eyebrow mb-4">Actions</p>
            <div className="flex flex-wrap gap-3">
              {booking.status === 'pending' && (
                <button
                  onClick={() =>
                    onStatusChange(booking.reference, 'confirmed')
                  }
                  className="btn-primary"
                >
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  Confirm
                </button>
              )}
              {booking.status === 'confirmed' && (
                <button
                  onClick={() =>
                    onStatusChange(booking.reference, 'completed')
                  }
                  className="btn-primary"
                >
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  Mark completed
                </button>
              )}
              {booking.status !== 'cancelled' &&
                booking.status !== 'completed' && (
                  <button
                    onClick={() =>
                      onStatusChange(booking.reference, 'cancelled')
                    }
                    className="inline-flex items-center gap-2 border border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-6 py-3 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors"
                  >
                    <HiOutlineXCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-3">
        {title}
      </p>
      <dl className="space-y-3 text-sm">{children}</dl>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink-200/60 pb-3 last:border-0 last:pb-0">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-ink-900 text-right">{value}</dd>
    </div>
  );
}

function shortDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

function longDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}