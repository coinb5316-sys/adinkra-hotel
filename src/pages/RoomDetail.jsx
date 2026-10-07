// src/pages/RoomDetail.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLongLeft,
  HiOutlineArrowLongRight,
  HiOutlineCheckCircle,
  HiOutlineCalendarDays,
  HiOutlineUserGroup,
  HiOutlineShare,
  HiOutlineHeart,
} from 'react-icons/hi2';
import {
  IoBedOutline,
  IoResizeOutline,
  IoEyeOutline,
  IoExpandOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { rooms, hotelInfo } from '../data/hotelData';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = rooms.find((r) => r.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  // Reset gallery index whenever room changes
  useEffect(() => {
    setActiveImage(0);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id]);

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!room) {
    return <NotFoundRoom />;
  }

  const gallery = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image];
  const today = new Date().toISOString().split('T')[0];

  const handleReserve = () => {
    const params = new URLSearchParams();
    params.set('room', room.id);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    params.set('guests', String(guests));
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="bg-cream-100">
      {/* BREADCRUMB */}
      <div className="border-b border-ink-200/60 bg-cream-200/40">
        <div className="container-luxe py-5 flex items-center justify-between text-[11px] uppercase tracking-ultra-wide text-ink-500">
          <Link
            to="/rooms"
            className="flex items-center gap-2 hover:text-gold-600 transition-colors"
          >
            <HiOutlineArrowLongLeft className="w-4 h-4" />
            All rooms
          </Link>
          <span className="hidden md:inline text-ink-400">
            Rooms &nbsp;/&nbsp; <span className="text-ink-800">{room.name}</span>
          </span>
        </div>
      </div>

      {/* GALLERY */}
      <section className="container-luxe pt-10 lg:pt-14">
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Main image */}
          <div className="lg:col-span-8 relative aspect-[16/11] overflow-hidden bg-ink-900">
            <img
              src={gallery[activeImage]}
              alt={room.name}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-5 right-5 flex items-center gap-2 bg-ink-900/60 backdrop-blur-sm text-cream-50 px-4 py-2.5 text-[10px] uppercase tracking-ultra-wide hover:bg-ink-900/85 transition-colors"
            >
              <IoExpandOutline className="w-4 h-4" />
              View full screen
            </button>
          </div>

          {/* Thumbnails */}
          <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-5">
            {gallery.slice(0, 3).map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-[4/3] lg:aspect-[16/11] overflow-hidden border transition-all duration-300 ${
                  activeImage === i
                    ? 'border-gold-500 ring-1 ring-gold-500'
                    : 'border-transparent hover:border-ink-300'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT + BOOKING PANEL */}
      <section className="py-16 lg:py-24">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* LEFT — content */}
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">{room.category}</p>
            <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-ink-900">
              {room.name}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-widest text-ink-500">
              <span className="flex items-center gap-2">
                <IoBedOutline className="w-4 h-4 text-gold-500" />
                {room.beds}
              </span>
              <span className="flex items-center gap-2">
                <IoResizeOutline className="w-4 h-4 text-gold-500" />
                {room.size} m&sup2;
              </span>
              <span className="flex items-center gap-2">
                <IoEyeOutline className="w-4 h-4 text-gold-500" />
                {room.view}
              </span>
              <span className="flex items-center gap-2">
                <HiOutlineUserGroup className="w-4 h-4 text-gold-500" />
                Up to {room.guests} guests
              </span>
            </div>

            <div className="mt-10 space-y-5 text-ink-700 leading-[1.75] text-[15px]">
              <p className="font-serif text-xl italic text-ink-800 leading-relaxed">
                &ldquo;{room.shortDescription}&rdquo;
              </p>
              <p>{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="mt-14">
              <h2 className="font-display text-2xl text-ink-900 mb-6">
                In this {room.category.toLowerCase().includes('room') ? 'room' : 'suite'}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {room.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-3 text-sm text-ink-700"
                  >
                    <HiOutlineCheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Good to know */}
            <div className="mt-14 border-t border-ink-200 pt-10">
              <h2 className="font-display text-2xl text-ink-900 mb-6">
                Good to know
              </h2>
              <dl className="space-y-4 text-sm">
                <Row label="Check-in" value={`From ${hotelInfo.hours.checkIn}`} />
                <Row label="Check-out" value={`Until ${hotelInfo.hours.checkOut}`} />
                <Row
                  label="Cancellation"
                  value="Free until 48 hours before arrival"
                />
                <Row label="Breakfast" value="Complimentary on all suite bookings" />
                <Row
                  label="Airport"
                  value="12 minutes from Kotoka — transfer arranged on request"
                />
              </dl>
            </div>
          </div>

          {/* RIGHT — sticky booking panel */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="bg-cream-50 border border-ink-200/60 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.15)]">
                {/* Price header */}
                <div className="px-8 py-8 border-b border-ink-200/60">
                  <p className="eyebrow text-gold-600 mb-2">From</p>
                  <div className="flex items-baseline gap-3">
                    <p className="font-display text-4xl text-ink-900 leading-none">
                      GH&#8373; {room.price.toLocaleString()}
                    </p>
                    <p className="text-[11px] uppercase tracking-widest text-ink-400">
                      / night
                    </p>
                  </div>
                  <p className="mt-3 text-xs text-ink-500">
                    Includes taxes and complimentary Wi-Fi.
                  </p>
                </div>

                {/* Date + guest inputs */}
                <div className="px-8 py-8 space-y-5">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
                      Arrival
                    </span>
                    <div className="mt-2 flex items-center gap-3 border-b border-ink-300 focus-within:border-gold-500 py-3 transition-colors">
                      <HiOutlineCalendarDays className="w-4 h-4 text-gold-500" />
                      <input
                        type="date"
                        min={today}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent text-sm text-ink-900 focus:outline-none [color-scheme:light]"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
                      Departure
                    </span>
                    <div className="mt-2 flex items-center gap-3 border-b border-ink-300 focus-within:border-gold-500 py-3 transition-colors">
                      <HiOutlineCalendarDays className="w-4 h-4 text-gold-500" />
                      <input
                        type="date"
                        min={checkIn || today}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent text-sm text-ink-900 focus:outline-none [color-scheme:light]"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
                      Guests
                    </span>
                    <div className="mt-2 flex items-center gap-3 border-b border-ink-300 focus-within:border-gold-500 py-3 transition-colors">
                      <HiOutlineUserGroup className="w-4 h-4 text-gold-500" />
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full bg-transparent text-sm text-ink-900 focus:outline-none"
                      >
                        {Array.from({ length: room.guests }, (_, i) => i + 1).map(
                          (n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </label>
                </div>

                {/* Reserve button */}
                <div className="px-8 pb-8">
                  <button
                    onClick={handleReserve}
                    className="w-full group bg-ink-900 text-cream-100 hover:bg-gold-500 hover:text-white py-5 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-500 flex items-center justify-center gap-3"
                  >
                    Reserve this {room.category.toLowerCase().includes('room') ? 'room' : 'suite'}
                    <HiOutlineArrowLongRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                  </button>

                  <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-widest text-ink-500">
                    <button className="flex items-center gap-2 hover:text-gold-600 transition-colors">
                      <HiOutlineHeart className="w-4 h-4" />
                      Save
                    </button>
                    <button className="flex items-center gap-2 hover:text-gold-600 transition-colors">
                      <HiOutlineShare className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-ink-500 leading-relaxed">
                Questions? Call us at{' '}
                <a
                  href={`tel:${hotelInfo.phone}`}
                  className="text-ink-900 link-underline"
                >
                  {hotelInfo.phoneDisplay}
                </a>
                <br />
                or email{' '}
                <a
                  href={`mailto:${hotelInfo.email}`}
                  className="text-ink-900 link-underline"
                >
                  {hotelInfo.email}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* YOU MAY ALSO LIKE */}
      <RelatedRooms currentId={room.id} />

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[80] bg-ink-900/95 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 text-cream-100 hover:text-gold-400 transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <IoCloseOutline className="w-8 h-8" />
          </button>

          <div
            className="max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[activeImage]}
              alt={room.name}
              className="w-full max-h-[80vh] object-contain"
            />

            <div className="mt-6 flex items-center justify-center gap-3">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-12 overflow-hidden border transition-all ${
                    activeImage === i
                      ? 'border-gold-400 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-90'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- HELPER ROW ---------------------------- */

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-ink-200/60 last:border-0">
      <dt className="text-[11px] uppercase tracking-widest text-ink-400 flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-ink-700 text-right">{value}</dd>
    </div>
  );
}

/* ---------------------------- RELATED ROOMS ---------------------------- */

function RelatedRooms({ currentId }) {
  const related = rooms.filter((r) => r.id !== currentId).slice(0, 3);

  return (
    <section className="bg-cream-200/60 py-20 lg:py-28">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow mb-4">You may also like</p>
            <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-ink-900 max-w-2xl">
              Other rooms
              <br />
              <em className="font-serif italic font-normal text-gold-600">
                at the house.
              </em>
            </h2>
          </div>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-ink-800 link-underline self-start md:self-end"
          >
            View all
            <HiOutlineArrowLongRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {related.map((r) => (
            <Link
              key={r.id}
              to={`/rooms/${r.id}`}
              className="group block bg-cream-50 border border-ink-200/60 hover:border-gold-400/60 transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-2">
                  {r.category}
                </p>
                <h3 className="font-display text-xl text-ink-900 group-hover:text-gold-600 transition-colors">
                  {r.name}
                </h3>
                <p className="mt-2 text-xs text-ink-500 line-clamp-2">
                  {r.shortDescription}
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-widest text-ink-500">
                  <span>GH&#8373; {r.price.toLocaleString()} / night</span>
                  <HiOutlineArrowLongRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- NOT FOUND ---------------------------- */

function NotFoundRoom() {
  return (
    <div className="container-luxe py-32 text-center">
      <p className="eyebrow mb-6">Not Found</p>
      <h1 className="heading-display text-4xl md:text-5xl text-ink-900">
        That room has moved on.
      </h1>
      <p className="mt-6 max-w-md mx-auto text-ink-600 leading-relaxed">
        The room you were looking for is no longer available. Please browse the
        current selection, or call us if you had your heart set on something
        specific.
      </p>
      <Link
        to="/rooms"
        className="mt-10 inline-flex items-center gap-3 btn-primary"
      >
        Browse all rooms
        <HiOutlineArrowLongRight className="w-5 h-5" />
      </Link>
    </div>
  );
}