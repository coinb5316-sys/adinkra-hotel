// src/pages/dashboard/GuestDashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  HiOutlineArrowLongRight,
  HiOutlineCalendarDays,
  HiOutlineUserGroup,
  HiOutlineMapPin,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineCreditCard,
  HiOutlineChatBubbleLeftEllipsis,
} from 'react-icons/hi2';
import { IoBedOutline } from 'react-icons/io5';
import { useAuth } from '../../auth/AuthContext';
import {
  getBookingsForUser,
  cancelBooking,
} from '../../services/bookingService';
import { hotelInfo } from '../../data/hotelData';
import { formatGHS } from '../../utils/pricing';

export default function GuestDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [tab, setTab] = useState('overview');
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    (async () => {
      setFetching(true);
      const data = await getBookingsForUser(user.email);
      if (!cancelled) {
        setBookings(data);
        setFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const stats = useMemo(() => {
    const now = new Date().toISOString().split('T')[0];
    const upcoming = bookings.filter(
      (b) =>
        b.status !== 'cancelled' &&
        b.status !== 'completed' &&
        b.checkIn >= now,
    );
    const past = bookings.filter(
      (b) => b.status === 'completed' || b.checkOut < now,
    );
    const totalNights = bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.nights || 0), 0);
    return { upcoming, past, totalNights };
  }, [bookings]);

  const nextStay = stats.upcoming[0] || null;

  if (loading) return <DashboardSkeleton />;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: '/account' } }} replace />;
  }

  const handleCancel = async (reference) => {
    await cancelBooking(reference);
    setBookings((prev) =>
      prev.map((b) =>
        b.reference === reference ? { ...b, status: 'cancelled' } : b,
      ),
    );
    setCancelTarget(null);
  };

  return (
    <div className="bg-cream-100 min-h-screen">
      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-14 lg:pb-16 bg-ink-900 text-cream-50">
        <div className="container-luxe">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="eyebrow text-gold-400 mb-4 animate-fade-in">
                Your Account
              </p>
              <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl max-w-3xl animate-fade-up">
                Good to see you,
                <br />
                <em className="font-serif italic font-normal text-gold-200">
                  {user?.name?.split(' ')[0] || 'friend'}.
                </em>
              </h1>
              <p className="mt-6 text-cream-200/75 leading-relaxed max-w-xl">
                Everything about your stay, in one quiet place.
              </p>
            </div>

            {/* User chip */}
            <div className="flex items-center gap-4 p-4 border border-white/15 bg-white/5 backdrop-blur-sm self-start lg:self-end">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-gold-400/60"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gold-500/20 border border-gold-400/40 flex items-center justify-center">
                  <HiOutlineUserCircle className="w-6 h-6 text-gold-300" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-cream-50 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-cream-200/60 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                aria-label="Sign out"
                className="ml-2 p-2 text-cream-200/60 hover:text-gold-300 transition-colors"
                title="Sign out"
              >
                <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="border-b border-ink-200/60 bg-cream-100">
        <div className="container-luxe">
          <nav className="flex items-center gap-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'stays', label: 'My Stays' },
              { id: 'profile', label: 'Profile' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative whitespace-nowrap py-5 text-[11px] uppercase tracking-ultra-wide transition-colors ${
                  tab === t.id
                    ? 'text-ink-900'
                    : 'text-ink-500 hover:text-ink-800'
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 lg:py-16">
        <div className="container-luxe">
          {fetching ? (
            <ContentSkeleton />
          ) : tab === 'overview' ? (
            <OverviewTab
              user={user}
              stats={stats}
              nextStay={nextStay}
              bookings={bookings}
              onGoToStays={() => setTab('stays')}
            />
          ) : tab === 'stays' ? (
            <StaysTab
              bookings={bookings}
              onCancelClick={(b) => setCancelTarget(b)}
            />
          ) : (
            <ProfileTab user={user} />
          )}
        </div>
      </section>

      {/* Cancel confirmation */}
      {cancelTarget && (
        <CancelDialog
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={() => handleCancel(cancelTarget.reference)}
        />
      )}
    </div>
  );
}

/* ================================================================
 *  OVERVIEW TAB
 * ================================================================ */
function OverviewTab({ user, stats, nextStay, bookings, onGoToStays }) {
  return (
    <div className="space-y-16">
      {/* Welcome band */}
      <div>
        <h2 className="font-display text-3xl md:text-4xl text-ink-900 mb-3">
          Welcome back to The Adinkra.
        </h2>
        <p className="text-ink-600 leading-relaxed max-w-2xl">
          {nextStay
            ? `Your next stay begins on ${formatDateLong(nextStay.checkIn)}. We're already preparing for it.`
            : 'No upcoming stays at the moment. When you\'re ready, we would be glad to host you again.'}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 border-y border-ink-200 py-10">
        <StatBlock
          label="Upcoming stays"
          value={stats.upcoming.length}
        />
        <StatBlock label="Past stays" value={stats.past.length} />
        <StatBlock label="Nights with us" value={stats.totalNights} />
        <StatBlock
          label="Member since"
          value={user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
        />
      </div>

      {/* Next stay card */}
      {nextStay ? (
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="eyebrow mb-3">Your next stay</p>
              <h3 className="heading-display text-3xl md:text-4xl text-ink-900">
                We&rsquo;ll see you{' '}
                <em className="font-serif italic font-normal text-gold-600">
                  soon.
                </em>
              </h3>
            </div>
            <button
              onClick={onGoToStays}
              className="hidden lg:inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-ink-800 link-underline"
            >
              All stays
              <HiOutlineArrowLongRight className="w-4 h-4" />
            </button>
          </div>

          <NextStayCard booking={nextStay} />
        </div>
      ) : (
        <div className="p-10 lg:p-14 border border-ink-200/60 bg-cream-50 text-center">
          <p className="eyebrow mb-4">No upcoming stays</p>
          <h3 className="heading-display text-2xl md:text-3xl text-ink-900 mb-4">
            Ready when you are.
          </h3>
          <p className="text-ink-600 leading-relaxed max-w-md mx-auto mb-8">
            Reserve a room and we'll take care of everything else.
          </p>
          <Link to="/rooms" className="btn-primary">
            Browse rooms
            <HiOutlineArrowLongRight className="w-5 h-5" />
          </Link>
        </div>
      )}

      {/* Recent activity */}
      {bookings.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8">
            <h3 className="heading-display text-2xl md:text-3xl text-ink-900">
              Recent activity
            </h3>
            <button
              onClick={onGoToStays}
              className="text-xs uppercase tracking-ultra-wide text-ink-500 hover:text-gold-600 transition-colors lg:hidden"
            >
              View all
            </button>
          </div>

          <ul className="border-t border-ink-200">
            {bookings.slice(0, 4).map((b) => (
              <ActivityRow key={b.reference} booking={b} />
            ))}
          </ul>
        </div>
      )}

      {/* Contact CTA */}
      <div className="p-8 lg:p-12 bg-ink-900 text-cream-100">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="eyebrow text-gold-400 mb-4">Concierge</p>
            <h3 className="font-display text-2xl md:text-3xl text-cream-50">
              Anything you need for your stay,
              <br />
              <em className="font-serif italic font-normal text-gold-300">
                we can arrange.
              </em>
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
            <a
              href={`tel:${hotelInfo.phone}`}
              className="text-sm text-gold-300 link-underline"
            >
              {hotelInfo.phoneDisplay}
            </a>
            <a
              href={`mailto:${hotelInfo.email}`}
              className="text-sm text-gold-300 link-underline"
            >
              {hotelInfo.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div>
      <p className="font-display text-4xl lg:text-5xl text-gold-600 leading-none">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mt-3">
        {label}
      </p>
    </div>
  );
}

function NextStayCard({ booking }) {
  return (
    <div className="bg-cream-50 border border-ink-200/60 overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
          <img
            src={booking.roomImage}
            alt={booking.roomName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-2">
                  {statusLabel(booking.status)}
                </p>
                <h4 className="font-display text-2xl text-ink-900">
                  {booking.roomName}
                </h4>
              </div>
              <StatusPill status={booking.status} />
            </div>

            <dl className="space-y-4 text-sm">
              <DetailRow
                icon={<HiOutlineCalendarDays className="w-4 h-4" />}
                label="Arrival"
                value={formatDateLong(booking.checkIn)}
              />
              <DetailRow
                icon={<HiOutlineCalendarDays className="w-4 h-4" />}
                label="Departure"
                value={formatDateLong(booking.checkOut)}
              />
              <DetailRow
                icon={<HiOutlineUserGroup className="w-4 h-4" />}
                label="Guests"
                value={`${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`}
              />
              <DetailRow
                icon={<HiOutlineCreditCard className="w-4 h-4" />}
                label="Total paid"
                value={formatGHS(booking.total)}
              />
              <DetailRow
                icon={<HiOutlineMapPin className="w-4 h-4" />}
                label="Reference"
                value={booking.reference}
              />
            </dl>

            {booking.notes && (
              <div className="mt-6 pt-6 border-t border-ink-200">
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-2">
                  Your notes
                </p>
                <p className="text-sm text-ink-700 italic leading-relaxed">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-ultra-wide text-ink-800 hover:text-gold-600 transition-colors"
            >
              <HiOutlineChatBubbleLeftEllipsis className="w-4 h-4" />
              Message concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-200/60 pb-4 last:border-0 last:pb-0">
      <dt className="flex items-center gap-2 text-ink-500">
        <span className="text-gold-500">{icon}</span>
        {label}
      </dt>
      <dd className="text-ink-900 font-medium text-right">{value}</dd>
    </div>
  );
}

function ActivityRow({ booking }) {
  return (
    <li className="flex items-center justify-between gap-6 py-5 border-b border-ink-200/60">
      <div className="flex items-center gap-5 min-w-0">
        <div className="w-14 h-14 flex-shrink-0 overflow-hidden">
          <img
            src={booking.roomImage}
            alt={booking.roomName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg text-ink-900 truncate">
            {booking.roomName}
          </p>
          <p className="text-xs text-ink-500 truncate mt-1">
            {formatDateShort(booking.checkIn)} — {formatDateShort(booking.checkOut)}
            <span className="mx-2 text-ink-300">·</span>
            {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
          </p>
        </div>
      </div>
      <StatusPill status={booking.status} />
    </li>
  );
}

/* ================================================================
 *  STAYS TAB
 * ================================================================ */
function StaysTab({ bookings, onCancelClick }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full border border-ink-300 flex items-center justify-center mb-6">
          <IoBedOutline className="w-6 h-6 text-ink-500" />
        </div>
        <h3 className="font-display text-3xl text-ink-900">
          No stays yet.
        </h3>
        <p className="mt-4 text-ink-600 leading-relaxed">
          When you make your first reservation, it will appear here along with
          all your past stays.
        </p>
        <Link to="/rooms" className="mt-8 inline-flex btn-primary">
          Browse rooms
          <HiOutlineArrowLongRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="eyebrow mb-3">Reservations</p>
          <h2 className="heading-display text-3xl md:text-4xl text-ink-900">
            {bookings.length} {bookings.length === 1 ? 'stay' : 'stays'}{' '}
            <em className="font-serif italic font-normal text-gold-600">
              with us.
            </em>
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {bookings.map((b) => (
          <StayCard
            key={b.reference}
            booking={b}
            onCancelClick={() => onCancelClick(b)}
          />
        ))}
      </div>
    </div>
  );
}

function StayCard({ booking, onCancelClick }) {
  const canCancel =
    booking.status !== 'cancelled' && booking.status !== 'completed';

  return (
    <article className="bg-cream-50 border border-ink-200/60 overflow-hidden">
      <div className="grid md:grid-cols-12">
        {/* Image */}
        <div className="md:col-span-4 aspect-[4/3] md:aspect-auto md:min-h-[260px] overflow-hidden">
          <img
            src={booking.roomImage}
            alt={booking.roomName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="md:col-span-8 p-7 lg:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-6 mb-5">
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-2">
                  {statusLabel(booking.status)}
                </p>
                <h3 className="font-display text-2xl text-ink-900">
                  {booking.roomName}
                </h3>
              </div>
              <StatusPill status={booking.status} />
            </div>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-1">
                  Dates
                </p>
                <p className="text-ink-800">
                  {formatDateShort(booking.checkIn)} →{' '}
                  {formatDateShort(booking.checkOut)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-1">
                  Guests
                </p>
                <p className="text-ink-800">
                  {booking.guests}{' '}
                  {booking.guests === 1 ? 'guest' : 'guests'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-1">
                  Total
                </p>
                <p className="text-ink-800 font-medium">
                  {formatGHS(booking.total)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-1">
                  Reference
                </p>
                <p className="text-ink-800 font-mono text-xs">
                  {booking.reference}
                </p>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-5 pt-5 border-t border-ink-200/60">
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-1">
                  Notes
                </p>
                <p className="text-sm text-ink-600 italic leading-relaxed">
                  {booking.notes}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-ink-200/60 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to={`/rooms/${booking.roomId}`}
              className="text-[11px] uppercase tracking-ultra-wide text-ink-800 link-underline"
            >
              View room
            </Link>
            {canCancel && (
              <button
                onClick={onCancelClick}
                className="text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-red-700 transition-colors"
              >
                Cancel reservation
              </button>
            )}
            <Link
              to="/contact"
              className="text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-gold-600 transition-colors ml-auto"
            >
              Message concierge
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ================================================================
 *  PROFILE TAB
 * ================================================================ */
function ProfileTab({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // In production: PATCH /users/me
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-7">
        <p className="eyebrow mb-3">Profile</p>
        <h2 className="heading-display text-3xl md:text-4xl text-ink-900 mb-10">
          Your details,{' '}
          <em className="font-serif italic font-normal text-gold-600">
            kept up to date.
          </em>
        </h2>

        <form onSubmit={handleSave} className="space-y-8">
          <FormField label="Full name">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent text-sm text-ink-900 focus:outline-none"
            />
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-transparent text-sm text-ink-500 cursor-not-allowed focus:outline-none"
            />
            <p className="mt-2 text-[11px] text-ink-400">
              Signed in via {user?.provider === 'google' ? 'Google' : 'email'}.
              Email cannot be changed here.
            </p>
          </FormField>

          <FormField label="Phone">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 ..."
              className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
            />
          </FormField>

          <FormField label="Preferences (optional)">
            <textarea
              rows={3}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="High floor, quiet room, dietary notes…"
              className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none resize-none"
            />
          </FormField>

          <div className="flex items-center gap-6">
            <button type="submit" className="btn-primary">
              Save changes
              <HiOutlineArrowLongRight className="w-5 h-5" />
            </button>
            {saved && (
              <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-700">
                <HiOutlineCheckCircle className="w-4 h-4" />
                Saved
              </p>
            )}
          </div>
        </form>
      </div>

      <aside className="lg:col-span-5 space-y-6">
        <div className="p-8 bg-cream-50 border border-ink-200/60">
          <p className="eyebrow mb-5">Account</p>
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-ink-200/60 pb-4">
              <dt className="text-ink-500">Provider</dt>
              <dd className="text-ink-900 capitalize">{user?.provider || 'email'}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-ink-200/60 pb-4">
              <dt className="text-ink-500">Member status</dt>
              <dd className="text-ink-900">Active</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-500">Member since</dt>
              <dd className="text-ink-900">2024</dd>
            </div>
          </dl>
        </div>

        <div className="p-8 bg-cream-50 border border-ink-200/60">
          <p className="eyebrow mb-5">Sign out</p>
          <p className="text-sm text-ink-600 leading-relaxed mb-6">
            You will need to sign in again to view your reservations or book a
            new stay.
          </p>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full inline-flex items-center justify-center gap-3 border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-cream-100 py-4 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-300"
          >
            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
            Sign out
          </button>
        </div>

        <div className="p-8 bg-ink-900 text-cream-100">
          <p className="eyebrow text-gold-400 mb-5">Need help?</p>
          <p className="text-sm text-cream-200/80 leading-relaxed mb-6">
            Our concierge team is available around the clock for anything you
            might need.
          </p>
          <a
            href={`tel:${hotelInfo.phone}`}
            className="text-sm text-gold-300 link-underline"
          >
            {hotelInfo.phoneDisplay}
          </a>
        </div>
      </aside>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
        {label}
      </span>
      <span className="mt-2 flex flex-col border-b border-ink-300 focus-within:border-gold-500 py-3 transition-colors">
        {children}
      </span>
    </label>
  );
}

/* ================================================================
 *  SHARED BITS
 * ================================================================ */

function StatusPill({ status }) {
  const styles = {
    confirmed: 'bg-green-50 text-green-800 border-green-200',
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    completed: 'bg-ink-100 text-ink-700 border-ink-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  const icons = {
    confirmed: <HiOutlineCheckCircle className="w-3.5 h-3.5" />,
    pending: <HiOutlineClock className="w-3.5 h-3.5" />,
    completed: <HiOutlineCheckCircle className="w-3.5 h-3.5" />,
    cancelled: <HiOutlineXCircle className="w-3.5 h-3.5" />,
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

function statusLabel(status) {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'pending':
      return 'Awaiting confirmation';
    case 'completed':
      return 'Past stay';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

function formatDateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateLong(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* ================================================================
 *  CANCEL DIALOG
 * ================================================================ */
function CancelDialog({ booking, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-cream-50 border border-ink-200 p-8 shadow-2xl">
        <p className="eyebrow mb-4">Confirm cancellation</p>
        <h3 className="font-display text-2xl text-ink-900 mb-4">
          Cancel this reservation?
        </h3>
        <p className="text-sm text-ink-600 leading-relaxed">
          You are about to cancel{' '}
          <span className="text-ink-900 font-medium">{booking.roomName}</span>{' '}
          for {formatDateShort(booking.checkIn)}. Cancellations within 48 hours
          of arrival are charged the first night. Please contact us if you
          need help.
        </p>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 border border-ink-300 text-ink-800 hover:border-ink-900 py-3 text-[11px] uppercase tracking-ultra-wide transition-colors"
          >
            Keep reservation
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-700 text-white hover:bg-red-800 py-3 text-[11px] uppercase tracking-ultra-wide transition-colors"
          >
            Cancel reservation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
 *  LOADING SKELETONS
 * ================================================================ */
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="h-72 bg-ink-900" />
      <div className="container-luxe py-16 space-y-8">
        <div className="h-6 w-40 bg-ink-200 animate-pulse" />
        <div className="h-12 w-2/3 bg-ink-200 animate-pulse" />
        <div className="h-64 bg-ink-200 animate-pulse" />
      </div>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-1/3 bg-ink-200 animate-pulse" />
      <div className="h-24 bg-ink-200 animate-pulse" />
      <div className="h-64 bg-ink-200 animate-pulse" />
    </div>
  );
}