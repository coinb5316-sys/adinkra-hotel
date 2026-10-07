// src/pages/Booking.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLongLeft,
  HiOutlineArrowLongRight,
  HiOutlineCalendarDays,
  HiOutlineUserGroup,
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
} from 'react-icons/hi2';
import { IoBedOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../auth/AuthContext';
import { rooms, hotelInfo } from '../data/hotelData';
import { createBooking } from '../services/bookingService';
import {
  nightsBetween,
  computeBookingTotals,
  formatGHS,
} from '../utils/pricing';
import PaystackButton from '../components/PaystackButton';

export default function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithGoogleProfile } = useAuth();

  /* ----------------------------------------------------------------
   * 1. Read query params — room, checkIn, checkOut, guests
   * ---------------------------------------------------------------- */
  const initialRoomId = params.get('room') || '';
  const initialCheckIn = params.get('checkIn') || '';
  const initialCheckOut = params.get('checkOut') || '';
  const initialGuests = Number(params.get('guests')) || 2;

  const [roomId, setRoomId] = useState(initialRoomId || rooms[0].id);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  /* ----------------------------------------------------------------
   * 2. Guest details form
   * ---------------------------------------------------------------- */
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [requests, setRequests] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Prefill name/email when user signs in mid-session
  useEffect(() => {
    if (user) {
      setFullName((v) => v || user.name || '');
      setEmail((v) => v || user.email || '');
    }
  }, [user]);

  // Sync URL when the user changes stay details
  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set('room', roomId);
    if (checkIn) next.set('checkIn', checkIn);
    if (checkOut) next.set('checkOut', checkOut);
    next.set('guests', String(guests));
    navigate({ search: next.toString() }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, checkIn, checkOut, guests]);

  /* ----------------------------------------------------------------
   * 3. Derived pricing
   * ---------------------------------------------------------------- */
  const room = useMemo(() => rooms.find((r) => r.id === roomId), [roomId]);
  const nights = nightsBetween(checkIn, checkOut);
  const totals = useMemo(
    () => computeBookingTotals(room?.price || 0, nights),
    [room, nights],
  );

  const today = new Date().toISOString().split('T')[0];

  /* ----------------------------------------------------------------
   * 4. Validation state
   * ---------------------------------------------------------------- */
  const datesValid = nights > 0;
  const guestsValid = guests >= 1 && guests <= (room?.guests || 4);
  const contactValid =
    fullName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    phone.trim().length >= 6;
  const canPay =
    datesValid && guestsValid && contactValid && agreeTerms && isAuthenticated;

  /* ----------------------------------------------------------------
   * 5. Google sign-in helper
   *    Uses useGoogleLogin (access-token flow). We fetch the profile
   *    from Google's userinfo endpoint and hand it to AuthContext.
   * ---------------------------------------------------------------- */
  const signInWithGoogle = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );
        if (!res.ok) throw new Error('Could not fetch Google profile.');
        const profile = await res.json();
        loginWithGoogleProfile(profile);
      } catch (err) {
        console.error('Google sign-in failed', err);
      }
    },
    onError: () => console.error('Google sign-in cancelled'),
  });

  /* ----------------------------------------------------------------
   * 6. Paystack success handler
   * ---------------------------------------------------------------- */
  const handlePaystackSuccess = async (response) => {
  try {
    const booking = await createBooking({
      reference: response.reference,
      userId: email,
      guestName: fullName,
      guestEmail: email,
      guestPhone: phone,
      roomId: room.id,
      roomName: room.name,
      roomImage: room.image,
      checkIn,
      checkOut,
      guests,
      nights,
      subtotal: totals.subtotal,
      total: totals.total,
      paymentReference: response.reference,
      notes: requests,
    });

    navigate('/booking/success', {
      state: {
        reference: booking.reference,
        room: room.name,
        checkIn,
        checkOut,
        guests,
        nights,
        total: totals.total,
        name: fullName,
        email,
      },
    });
  } catch (err) {
    console.error('Failed to save booking', err);
  }
};

  return (
    <div className="bg-cream-100">
      {/* PAGE HEADER */}
      <section className="border-b border-ink-200/60 bg-cream-200/40">
        <div className="container-luxe py-10 lg:py-14">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-ultra-wide text-ink-500 hover:text-gold-600 transition-colors mb-6"
          >
            <HiOutlineArrowLongLeft className="w-4 h-4" />
            Continue browsing
          </Link>
          <p className="eyebrow mb-4">Reservations</p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-ink-900 max-w-3xl">
            Complete your
            <br />
            <em className="font-serif italic font-normal text-gold-600">
              reservation.
            </em>
          </h1>
          <p className="mt-6 max-w-xl text-ink-600 leading-relaxed">
            Two short steps. Choose your dates and room, tell us a little
            about your stay, and pay securely with Paystack. You will receive
            a confirmation by email within minutes.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 lg:py-20">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT — form */}
          <div className="lg:col-span-7 space-y-14">
            <StayDetails
              roomId={roomId}
              setRoomId={setRoomId}
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
              guests={guests}
              setGuests={setGuests}
              room={room}
              today={today}
              nights={nights}
            />

            <GuestDetails
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              arrivalTime={arrivalTime}
              setArrivalTime={setArrivalTime}
              requests={requests}
              setRequests={setRequests}
            />

            <AccountSection
              isAuthenticated={isAuthenticated}
              user={user}
              onGoogleSignIn={signInWithGoogle}
            />

            <TermsSection
              agreeTerms={agreeTerms}
              setAgreeTerms={setAgreeTerms}
            />
          </div>

          {/* RIGHT — summary */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <BookingSummary
                room={room}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                nights={nights}
                totals={totals}
                canPay={canPay}
                isAuthenticated={isAuthenticated}
                email={email}
                fullName={fullName}
                onSuccess={handlePaystackSuccess}
                onCancel={() => {}}
                onError={(err) => console.error('Paystack error', err)}
              />

              <div className="mt-6 flex items-start gap-3 text-xs text-ink-500 leading-relaxed">
                <HiOutlineInformationCircle className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                <p>
                  Payments are processed securely by Paystack. We never see
                  or store your card details. All prices are in Ghanaian
                  Cedis (GHS).
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

/* =================================================================
 *  SECTION 1 — Stay details
 * ================================================================ */
function StayDetails({
  roomId,
  setRoomId,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  room,
  today,
  nights,
}) {
  return (
    <section>
      <SectionHeader
        number="01"
        title="Your stay"
        description="Choose your room and dates. Prices update as you go."
      />

      <div className="mt-10 space-y-8">
        {/* Room select */}
        <Field label="Room or suite" icon={<IoBedOutline className="w-4 h-4" />}>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full bg-transparent text-sm text-ink-900 focus:outline-none appearance-none cursor-pointer"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.category} — GH&#8373; {r.price.toLocaleString()}/night
              </option>
            ))}
          </select>
        </Field>

        {/* Dates row */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Field
            label="Arrival"
            icon={<HiOutlineCalendarDays className="w-4 h-4" />}
          >
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-sm text-ink-900 focus:outline-none [color-scheme:light]"
            />
          </Field>

          <Field
            label="Departure"
            icon={<HiOutlineCalendarDays className="w-4 h-4" />}
          >
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-sm text-ink-900 focus:outline-none [color-scheme:light]"
            />
          </Field>
        </div>

        {/* Guests */}
        <Field label="Guests" icon={<HiOutlineUserGroup className="w-4 h-4" />}>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-sm text-ink-900 focus:outline-none appearance-none cursor-pointer"
          >
            {Array.from({ length: room?.guests || 4 }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ),
            )}
          </select>
        </Field>

        {/* Inline hint */}
        {nights > 0 ? (
          <p className="text-xs text-ink-500 tracking-widest uppercase">
            {nights} {nights === 1 ? 'night' : 'nights'} ·{' '}
            {room?.name}
          </p>
        ) : (
          <p className="text-xs text-gold-700 tracking-widest uppercase">
            Select arrival and departure dates to continue
          </p>
        )}
      </div>
    </section>
  );
}

/* =================================================================
 *  SECTION 2 — Guest details
 * ================================================================ */
function GuestDetails({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  arrivalTime,
  setArrivalTime,
  requests,
  setRequests,
}) {
  return (
    <section>
      <SectionHeader
        number="02"
        title="Guest details"
        description="We use this to prepare your room and send your confirmation."
      />

      <div className="mt-10 space-y-8">
        <Field label="Full name" icon={<HiOutlineUserCircle className="w-4 h-4" />}>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="As it appears on your ID"
            className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-6">
          <Field
            label="Email"
            icon={<HiOutlineInformationCircle className="w-4 h-4" />}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
            />
          </Field>

          <Field
            label="Phone"
            icon={<HiOutlineInformationCircle className="w-4 h-4" />}
          >
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 ..."
              className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
            />
          </Field>
        </div>

        <Field
          label="Estimated arrival time (optional)"
          icon={<HiOutlineCalendarDays className="w-4 h-4" />}
        >
          <input
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            className="w-full bg-transparent text-sm text-ink-900 focus:outline-none [color-scheme:light]"
          />
        </Field>

        <label className="block">
          <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
            Special requests (optional)
          </span>
          <textarea
            rows={4}
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            placeholder="High floor, quiet room, dietary notes, celebrations…"
            className="mt-2 w-full bg-transparent border-b border-ink-300 focus:border-gold-500 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none resize-none transition-colors"
          />
        </label>
      </div>
    </section>
  );
}

/* =================================================================
 *  SECTION 3 — Account / sign-in gate
 * ================================================================ */
function AccountSection({ isAuthenticated, user, onGoogleSignIn }) {
  if (isAuthenticated) {
    return (
      <section>
        <SectionHeader
          number="03"
          title="Your account"
          description="You're signed in. Your booking will be saved to this account."
        />

        <div className="mt-8 flex items-center gap-4 p-5 border border-ink-200/60 bg-cream-50">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover ring-1 ring-gold-500/60"
            />
          ) : (
            <HiOutlineUserCircle className="w-12 h-12 text-ink-500" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-ink-500 truncate">{user?.email}</p>
          </div>
          <HiOutlineCheckCircle className="w-6 h-6 text-gold-500 ml-auto flex-shrink-0" />
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        number="03"
        title="Sign in to complete"
        description="We ask you to sign in before payment so we can attach this reservation to your account and send a receipt."
      />

      <div className="mt-8 p-6 border border-ink-200/60 bg-cream-50">
        <button
          type="button"
          onClick={onGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 border border-ink-300 hover:border-ink-900 py-4 text-[11px] uppercase tracking-ultra-wide font-medium text-ink-800 transition-colors duration-300"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-4 text-[10px] uppercase tracking-ultra-wide text-ink-400">
          <span className="h-px flex-1 bg-ink-200" />
          or
          <span className="h-px flex-1 bg-ink-200" />
        </div>

        <Link
          to="/login"
          state={{ from: { pathname: '/booking' } }}
          className="block w-full text-center border border-ink-900 bg-ink-900 text-cream-100 hover:bg-gold-500 hover:border-gold-500 py-4 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-300"
        >
          Sign in with email
        </Link>
      </div>
    </section>
  );
}

/* =================================================================
 *  SECTION 4 — Terms
 * ================================================================ */
function TermsSection({ agreeTerms, setAgreeTerms }) {
  return (
    <section>
      <SectionHeader
        number="04"
        title="Before you pay"
        description="A quick confirmation — then you're on your way."
      />

      <label className="mt-8 flex items-start gap-4 cursor-pointer group">
        <span
          className={`mt-0.5 flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-colors ${
            agreeTerms
              ? 'bg-gold-500 border-gold-500 text-white'
              : 'border-ink-400 group-hover:border-ink-900'
          }`}
        >
          {agreeTerms && <HiOutlineCheckCircle className="w-4 h-4" />}
        </span>
        <input
          type="checkbox"
          className="sr-only"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
        />
        <span className="text-sm text-ink-600 leading-relaxed">
          I have read and agree to the{' '}
          <Link to="/policies" className="text-ink-900 link-underline">
            reservation and cancellation policies
          </Link>
          , including the 48-hour cancellation window and the fact that
          the first night is non-refundable within that period.
        </span>
      </label>
    </section>
  );
}

/* =================================================================
 *  SUMMARY PANEL
 * ================================================================ */
function BookingSummary({
  room,
  checkIn,
  checkOut,
  guests,
  nights,
  totals,
  canPay,
  isAuthenticated,
  email,
  fullName,
  onSuccess,
  onCancel,
  onError,
}) {
  return (
    <div className="bg-cream-50 border border-ink-200/60 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)]">
      {/* Room preview */}
      {room && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-cream-50">
            <p className="text-[10px] uppercase tracking-ultra-wide text-gold-300">
              {room.category}
            </p>
            <p className="font-display text-2xl mt-1">{room.name}</p>
          </div>
        </div>
      )}

      <div className="px-7 py-7">
        <p className="eyebrow text-gold-600 mb-5">Your reservation</p>

        {/* Stay summary */}
        <dl className="space-y-3 text-sm">
          <SummaryRow label="Arrival" value={checkIn || '—'} />
          <SummaryRow label="Departure" value={checkOut || '—'} />
          <SummaryRow
            label="Guests"
            value={`${guests} ${guests === 1 ? 'Guest' : 'Guests'}`}
          />
          <SummaryRow
            label="Nights"
            value={nights > 0 ? String(nights) : '—'}
          />
        </dl>

        {/* Price breakdown */}
        {nights > 0 && room && (
          <>
            <div className="mt-7 pt-7 border-t border-ink-200">
              <p className="eyebrow text-ink-500 mb-5">Price breakdown</p>

              <dl className="space-y-3 text-sm">
                <SummaryRow
                  label={`${formatGHS(room.price)} × ${nights} ${
                    nights === 1 ? 'night' : 'nights'
                  }`}
                  value={formatGHS(totals.subtotal)}
                />
                <SummaryRow
                  label="Service charge (10%)"
                  value={formatGHS(totals.service)}
                />
                <SummaryRow
                  label="VAT (15%)"
                  value={formatGHS(totals.vat)}
                />
                <SummaryRow
                  label="NHIL (2.5%)"
                  value={formatGHS(totals.nhil)}
                />
                <SummaryRow
                  label="GETFund (2.5%)"
                  value={formatGHS(totals.getfund)}
                />
                <SummaryRow
                  label="COVID-19 Levy (1%)"
                  value={formatGHS(totals.covid)}
                />
              </dl>

              <div className="mt-6 pt-6 border-t border-ink-300 flex items-baseline justify-between">
                <p className="text-[11px] uppercase tracking-ultra-wide text-ink-500">
                  Total due today
                </p>
                <p className="font-display text-3xl text-ink-900 leading-none">
                  {formatGHS(totals.total)}
                </p>
              </div>
            </div>

            {/* Paystack button */}
            <div className="mt-7 space-y-4">
              {!isAuthenticated && (
                <p className="text-[11px] uppercase tracking-widest text-gold-700 text-center">
                  Sign in above to enable payment
                </p>
              )}

              <PaystackButton
                email={email || 'guest@example.com'}
                amountGHS={totals.total}
                disabled={!canPay}
                label={
                  canPay
                    ? `Reserve & Pay · ${formatGHS(totals.total)}`
                    : 'Complete the form to pay'
                }
                metadata={{
                  bookingType: 'Hotel Reservation',
                  roomId: room.id,
                  roomName: room.name,
                  checkIn,
                  checkOut,
                  nights,
                  guests,
                  customerName: fullName,
                }}
                onSuccess={onSuccess}
                onCancel={onCancel}
                onError={onError}
              />

              <p className="text-[11px] text-ink-500 text-center leading-relaxed">
                By paying you confirm your reservation. Free cancellation
                until 48 hours before arrival.
              </p>
            </div>
          </>
        )}

        {nights === 0 && (
          <div className="mt-7 pt-7 border-t border-ink-200 text-sm text-ink-500 leading-relaxed">
            Add your dates above to see the full price breakdown and enable
            payment.
          </div>
        )}
      </div>
    </div>
  );
}

/* =================================================================
 *  Small shared components
 * ================================================================ */

function SectionHeader({ number, title, description }) {
  return (
    <div className="flex items-start gap-5 pb-6 border-b border-ink-200">
      <span className="font-display text-3xl text-gold-500 leading-none mt-1">
        {number}
      </span>
      <div>
        <h2 className="font-display text-2xl md:text-3xl text-ink-900">
          {title}
        </h2>
        <p className="mt-2 text-sm text-ink-500 leading-relaxed max-w-xl">
          {description}
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
        {label}
      </span>
      <span className="mt-2 flex items-center gap-3 border-b border-ink-300 focus-within:border-gold-500 py-3 transition-colors">
        <span className="text-gold-500 flex-shrink-0">{icon}</span>
        {children}
      </span>
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-ink-900 tabular-nums font-medium">{value}</dd>
    </div>
  );
}