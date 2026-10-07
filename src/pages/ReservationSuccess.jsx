// src/pages/ReservationSuccess.jsx
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineArrowLongRight,
  HiOutlineCalendarDays,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlinePrinter,
} from 'react-icons/hi2';
import { IoBedOutline } from 'react-icons/io5';
import { hotelInfo } from '../data/hotelData';
import { formatGHS } from '../utils/pricing';

export default function ReservationSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If someone lands here without a state (e.g. refreshes the page),
  // send them home. In production you'd fetch the booking by reference
  // from your backend instead.
  useEffect(() => {
    if (!state?.reference) {
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state?.reference) return null;

  const {
    reference,
    room,
    checkIn,
    checkOut,
    guests,
    nights,
    total,
    name,
    email,
  } = state;

  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 bg-ink-900 text-cream-50 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=2400&q=85&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/90 via-ink-900/80 to-ink-900" />
        </div>

        <div className="relative container-luxe text-center">
          <div className="w-20 h-20 mx-auto rounded-full border border-gold-400 flex items-center justify-center mb-8 animate-fade-in">
            <HiOutlineCheckCircle className="w-10 h-10 text-gold-300" />
          </div>

          <p className="eyebrow text-gold-400 mb-6 animate-fade-in">
            Reservation Confirmed
          </p>

          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl max-w-3xl mx-auto animate-fade-up">
            We'll see you
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              very soon, {name?.split(' ')[0] || 'friend'}.
            </em>
          </h1>

          <p
            className="mt-8 max-w-lg mx-auto text-cream-200/85 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            A confirmation has been sent to{' '}
            <span className="text-gold-300">{email}</span>. Keep your reference
            number handy — you'll need it at check-in.
          </p>

          <div
            className="mt-10 inline-flex flex-col items-center gap-2 px-8 py-5 border border-gold-400/40 bg-ink-900/40 backdrop-blur-sm animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            <span className="text-[10px] uppercase tracking-mega-wide text-gold-300">
              Booking Reference
            </span>
            <span className="font-display text-2xl md:text-3xl text-cream-50 tracking-wider">
              {reference}
            </span>
          </div>
        </div>
      </section>

      {/* RESERVATION CARD */}
      <section className="py-16 lg:py-24">
        <div className="container-luxe max-w-4xl mx-auto">
          <div className="bg-cream-50 border border-ink-200/60 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] overflow-hidden">
            {/* Header strip */}
            <div className="px-8 lg:px-12 py-8 border-b border-ink-200 bg-cream-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-gold-600 mb-2">Reservation Details</p>
                <h2 className="font-display text-2xl text-ink-900">
                  The Adinkra &middot; Accra
                </h2>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-ultra-wide text-ink-700 hover:text-gold-600 transition-colors self-start sm:self-auto"
              >
                <HiOutlinePrinter className="w-4 h-4" />
                Print
              </button>
            </div>

            {/* Body */}
            <div className="px-8 lg:px-12 py-10 grid sm:grid-cols-2 gap-x-12 gap-y-8">
              <DetailBlock
                icon={<IoBedOutline className="w-5 h-5" />}
                label="Room"
                value={room}
              />
              <DetailBlock
                icon={<HiOutlineCalendarDays className="w-5 h-5" />}
                label="Arrival"
                value={checkIn}
              />
              <DetailBlock
                icon={<HiOutlineCalendarDays className="w-5 h-5" />}
                label="Departure"
                value={checkOut}
              />
              <DetailBlock
                icon={<HiOutlineCheckCircle className="w-5 h-5" />}
                label="Nights & Guests"
                value={`${nights} ${nights === 1 ? 'night' : 'nights'} · ${guests} ${
                  guests === 1 ? 'guest' : 'guests'
                }`}
              />

              <div className="sm:col-span-2 pt-6 border-t border-ink-200">
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-2">
                  Total Paid
                </p>
                <p className="font-display text-4xl text-ink-900 leading-none">
                  {formatGHS(total)}
                </p>
                <p className="mt-2 text-xs text-ink-500">
                  Inclusive of VAT, NHIL, GETFund, COVID-19 Levy, and service charge.
                </p>
              </div>
            </div>

            {/* Next steps */}
            <div className="px-8 lg:px-12 py-10 bg-cream-200/40 border-t border-ink-200">
              <p className="eyebrow text-gold-600 mb-6">What happens next</p>
              <ul className="space-y-4">
                <NextStep
                  number="1"
                  text={`A confirmation email is on its way to ${email}. If you don't see it within ten minutes, please check your spam folder.`}
                />
                <NextStep
                  number="2"
                  text="Our concierge team will reach out within 24 hours to confirm arrival details and any special requests."
                />
                <NextStep
                  number="3"
                  text={`On the day of arrival, check-in begins at ${hotelInfo.hours.checkIn}. Your room will be ready and waiting.`}
                />
              </ul>
            </div>
          </div>

          {/* Contact card */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <ContactCard
              icon={<HiOutlinePhone className="w-5 h-5" />}
              label="Call us"
              value={hotelInfo.phoneDisplay}
              href={`tel:${hotelInfo.phone}`}
            />
            <ContactCard
              icon={<HiOutlineEnvelope className="w-5 h-5" />}
              label="Email us"
              value={hotelInfo.email}
              href={`mailto:${hotelInfo.email}`}
            />
            <ContactCard
              icon={<HiOutlineMapPin className="w-5 h-5" />}
              label="Find us"
              value="Airport Residential, Accra"
              href={`https://maps.google.com/?q=${encodeURIComponent(
                hotelInfo.address,
              )}`}
            />
          </div>

          {/* CTAs */}
          <div className="mt-16 text-center">
            <p className="text-sm text-ink-500 max-w-md mx-auto leading-relaxed">
              While you're here, why not reserve a table at Akwaaba for your
              first evening, or book a treatment at the spa?
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dining" className="btn-primary">
                Reserve a table
                <HiOutlineArrowLongRight className="w-5 h-5" />
              </Link>
              <Link
                to="/"
                className="text-xs uppercase tracking-ultra-wide text-ink-700 link-underline py-4"
              >
                Return home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------------------------------------------------------- */

function DetailBlock({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gold-500 mb-2">
        {icon}
        <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
          {label}
        </p>
      </div>
      <p className="font-display text-xl text-ink-900 leading-snug">{value}</p>
    </div>
  );
}

function NextStep({ number, text }) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex-shrink-0 w-7 h-7 rounded-full border border-gold-500 text-gold-600 font-display text-sm flex items-center justify-center mt-0.5">
        {number}
      </span>
      <span className="text-sm text-ink-700 leading-relaxed">{text}</span>
    </li>
  );
}

function ContactCard({ icon, label, value, href }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="group block p-6 border border-ink-200/60 bg-cream-50 hover:border-gold-400/60 transition-colors"
    >
      <div className="flex items-center gap-2 text-gold-500 mb-3">
        {icon}
        <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
          {label}
        </p>
      </div>
      <p className="text-sm text-ink-800 group-hover:text-gold-600 transition-colors">
        {value}
      </p>
    </a>
  );
}