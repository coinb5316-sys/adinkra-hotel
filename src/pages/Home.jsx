// src/pages/Home.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLongRight,
  HiOutlineArrowLongLeft,
  HiOutlineStar,
  HiOutlineCalendarDays,
  HiOutlineUserGroup,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import {
  IoBedOutline,
  IoWifiOutline,
  IoRestaurantOutline,
  IoWaterOutline,
} from 'react-icons/io5';
import { rooms, amenities, testimonials, dining, hotelInfo } from '../data/hotelData';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <BookingBar />
      <Welcome />
      <FeaturedRooms />
      <AmenitiesSection />
      <DiningSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}

/* ----------------------------- HERO ----------------------------- */

function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[640px] -mt-20 lg:-mt-24 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2400&q=90&auto=format&fit=crop"
          alt="The Adinkra at dusk"
          className="w-full h-full object-cover animate-ken-burns"
        />
        {/* Slightly deeper overlay so navbar text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/85 via-ink-900/55 to-ink-900/85" />
      </div>

      <div className="relative z-10 container-luxe text-center text-white pt-20 lg:pt-24">
        <p className="eyebrow text-gold-300 animate-fade-in">
          Airport Residential &middot; Accra &middot; Ghana
        </p>

        <h1 className="heading-display text-[44px] sm:text-6xl md:text-7xl lg:text-[104px] mt-6 text-white animate-fade-up">
          Stillness,
          <br />
          <em className="font-serif italic font-normal text-gold-200">
            in the middle
          </em>
          <br />
          of the city.
        </h1>

        <p
          className="mt-8 mx-auto max-w-xl text-base md:text-lg text-cream-200/90 leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          An intimate retreat where Akan craftsmanship meets contemporary
          comfort &mdash; twelve minutes from Kotoka, a world away from the noise.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Link to="/booking" className="btn-ghost-light w-full sm:w-auto">
            Reserve a Stay
            <HiOutlineArrowLongRight className="w-5 h-5" />
          </Link>
          <Link
            to="/rooms"
            className="text-xs uppercase tracking-ultra-wide text-white/80 hover:text-white link-underline py-4"
          >
            Explore the Rooms
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-white/50">
        <span className="text-[10px] tracking-mega-wide uppercase">Scroll</span>
        <span className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}

/* -------------------------- BOOKING BAR -------------------------- */

function BookingBar() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [roomSlug, setRoomSlug] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Map human-readable guest options to numbers
  const guestOptions = [
    { value: '1', label: '1 Adult' },
    { value: '2', label: '2 Adults' },
    { value: '3', label: '3 Adults' },
    { value: '4', label: '4 Adults' },
  ];

  // Build the room dropdown from real data so the slug always matches
  const roomOptions = [
    { value: '', label: 'Any Room' },
    ...rooms.map((r) => ({
      value: r.id,
      label: `${r.name} — GH₵ ${r.price.toLocaleString()}/night`,
    })),
  ];

  const validate = () => {
    if (!checkIn) return 'Please choose an arrival date.';
    if (!checkOut) return 'Please choose a departure date.';
    if (checkOut <= checkIn) {
      return 'Your departure date must be after your arrival date.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    // Build query string for /booking
    const params = new URLSearchParams();
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
    params.set('guests', guests);
    if (roomSlug) params.set('room', roomSlug);

    navigate(`/booking?${params.toString()}`);
  };

  return (
    <section className="relative z-20 -mt-16 lg:-mt-20">
      <div className="container-luxe">
        <form
          onSubmit={handleSubmit}
          className="bg-cream-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] border border-ink-200/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-ink-200/60">
            <Field
              label="Arrival"
              icon={<HiOutlineCalendarDays className="w-4 h-4" />}
            >
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  // If departure is now before arrival, clear it
                  if (checkOut && e.target.value >= checkOut) {
                    setCheckOut('');
                  }
                }}
                required
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
                required
                className="w-full bg-transparent text-sm text-ink-900 focus:outline-none [color-scheme:light]"
              />
            </Field>

            <Field
              label="Guests"
              icon={<HiOutlineUserGroup className="w-4 h-4" />}
            >
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent text-sm text-ink-900 focus:outline-none cursor-pointer"
              >
                {guestOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Room" icon={<IoBedOutline className="w-4 h-4" />}>
              <select
                value={roomSlug}
                onChange={(e) => setRoomSlug(e.target.value)}
                className="w-full bg-transparent text-sm text-ink-900 focus:outline-none cursor-pointer"
              >
                {roomOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            <button
              type="submit"
              className="group flex items-center justify-center gap-3 bg-ink-900 text-cream-100 hover:bg-gold-500 hover:text-white py-5 lg:py-6 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-500"
            >
              Check Availability
              <HiOutlineArrowLongRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Inline validation message */}
          {error && (
            <div className="px-6 lg:px-8 py-4 border-t border-ink-200 bg-red-50 text-red-800 text-xs tracking-wider">
              {error}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="group flex items-center gap-4 px-6 py-5 lg:py-6 cursor-pointer hover:bg-cream-200/50 transition-colors">
      <span className="text-gold-500 group-focus-within:text-gold-600 transition-colors flex-shrink-0">
        {icon}
      </span>
      <span className="flex flex-col min-w-0 flex-1">
        <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
          {label}
        </span>
        <span className="mt-1">{children}</span>
      </span>
    </label>
  );
}

/* --------------------------- WELCOME --------------------------- */

function Welcome() {
  return (
    <section className="py-24 lg:py-32 bg-cream-100">
      <div className="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/5] max-w-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=85&auto=format&fit=crop"
              alt="Suite interior at The Adinkra"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block absolute -bottom-10 -right-4 lg:-right-12 w-48 lg:w-64 aspect-square overflow-hidden border-8 border-cream-100">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=85&auto=format&fit=crop"
              alt="Spa detail"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-6 -left-6 lg:-left-10 w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gold-500 text-white flex flex-col items-center justify-center text-center shadow-xl">
            <span className="text-[9px] uppercase tracking-ultra-wide opacity-80">
              Est.
            </span>
            <span className="font-display text-3xl lg:text-4xl leading-none mt-1">
              1994
            </span>
            <span className="text-[9px] uppercase tracking-ultra-wide opacity-80 mt-1">
              Accra
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 lg:pl-8">
          <p className="eyebrow mb-6">The House</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-ink-900">
            Three decades of
            <br />
            <em className="font-serif italic font-normal text-gold-600">
              quiet hospitality.
            </em>
          </h2>

          <div className="mt-8 space-y-5 text-ink-600 leading-relaxed max-w-xl">
            <p>
              The Adinkra was opened in 1994 by a family who believed a great
              hotel should feel less like a hotel and more like the home of a
              generous friend. That belief has not changed.
            </p>
            <p>
              Forty-two rooms. Two restaurants. A spa, a rooftop pool, and a
              concierge who knows Accra by heart &mdash; from the galleries in
              Osu to the fish market at Jamestown. Nothing more than is needed
              &mdash; nothing less than is deserved.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink-200 pt-8">
            <Stat number="42" label="Rooms & Suites" />
            <Stat number="5" label="Acres of Garden" />
            <Stat number="30" label="Years of Service" />
          </div>

          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide font-medium text-ink-900 link-underline"
          >
            Read our story
            <HiOutlineArrowLongRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <p className="font-display text-4xl lg:text-5xl text-gold-600 leading-none">
        {number}
      </p>
      <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mt-2">
        {label}
      </p>
    </div>
  );
}

/* ------------------------ FEATURED ROOMS ------------------------ */

function FeaturedRooms() {
  const featured = rooms.filter((r) => r.featured);

  return (
    <section className="py-24 lg:py-32 bg-ink-900 text-cream-100">
      <div className="container-luxe">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <p className="eyebrow text-gold-400 mb-6">Rooms & Suites</p>
            <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-cream-50 max-w-2xl">
              A room for every
              <br />
              <em className="font-serif italic font-normal text-gold-300">
                version of you.
              </em>
            </h2>
          </div>
          <Link
            to="/rooms"
            className="hidden lg:inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-cream-100/80 hover:text-gold-300 link-underline self-start lg:self-end"
          >
            View all rooms
            <HiOutlineArrowLongRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} />
          ))}
        </div>

        <div className="lg:hidden mt-12 text-center">
          <Link to="/rooms" className="btn-ghost-light">
            View all rooms
            <HiOutlineArrowLongRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room, index }) {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="group block"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-6">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent opacity-90" />

        <span className="absolute top-5 left-5 text-[10px] uppercase tracking-ultra-wide text-cream-100 bg-ink-900/50 backdrop-blur-sm px-3 py-1.5">
          {room.category}
        </span>

        <div className="absolute bottom-5 right-5 text-right text-cream-50">
          <p className="text-[10px] uppercase tracking-ultra-wide text-cream-200/70">
            From
          </p>
          <p className="font-display text-2xl">
            GH&#8373; {room.price.toLocaleString()}
          </p>
          <p className="text-[10px] tracking-widest text-cream-200/60 uppercase">
            per night
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-cream-50 group-hover:text-gold-300 transition-colors">
            {room.name}
          </h3>
          <p className="mt-2 text-sm text-cream-200/70 leading-relaxed max-w-xs">
            {room.shortDescription}
          </p>
        </div>
        <HiOutlineArrowLongRight className="w-6 h-6 flex-shrink-0 mt-2 text-gold-400 transition-transform duration-500 group-hover:translate-x-1" />
      </div>

      <div className="mt-4 flex items-center gap-5 text-[11px] uppercase tracking-widest text-cream-200/50">
        <span className="flex items-center gap-1.5">
          <IoBedOutline className="w-4 h-4" />
          {room.beds}
        </span>
        <span className="flex items-center gap-1.5">
          <HiOutlineUserGroup className="w-4 h-4" />
          Up to {room.guests}
        </span>
      </div>
    </Link>
  );
}

/* --------------------------- AMENITIES --------------------------- */

function AmenitiesSection() {
  const icons = [
    <IoWaterOutline key="1" className="w-6 h-6" />,
    <IoRestaurantOutline key="2" className="w-6 h-6" />,
    <IoWaterOutline key="3" className="w-6 h-6" />,
    <IoWifiOutline key="4" className="w-6 h-6" />,
    <IoBedOutline key="5" className="w-6 h-6" />,
    <HiOutlineMapPin key="6" className="w-6 h-6" />,
  ];

  return (
    <section className="py-24 lg:py-32 bg-cream-200">
      <div className="container-luxe">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="eyebrow mb-6">Amenities</p>
          <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-ink-900">
            Everything you need.
            <br />
            <em className="font-serif italic font-normal text-gold-600">
              Nothing you don't.
            </em>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
          {amenities.map((item, i) => (
            <div key={item.id} className="group">
              <div className="flex items-center gap-4 mb-5">
                <span className="text-gold-500 transition-transform duration-500 group-hover:scale-110">
                  {icons[i]}
                </span>
                <span className="h-px flex-1 bg-ink-300/60" />
                <span className="font-display text-2xl text-ink-400/70">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-2xl text-ink-900 mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-ink-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- DINING ---------------------------- */

function DiningSection() {
  return (
    <section className="py-24 lg:py-32 bg-cream-100">
      <div className="container-luxe">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <p className="eyebrow mb-6">Dining</p>
            <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-ink-900 max-w-2xl">
              Three rooms.
              <br />
              <em className="font-serif italic font-normal text-gold-600">
                One obsession.
              </em>
            </h2>
          </div>
          <p className="text-sm text-ink-600 max-w-sm leading-relaxed">
            From jollof cooked over firewood to a Mediterranean grill on the
            terrace &mdash; our kitchens are the soul of the house.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {dining.map((place) => (
            <Link
              key={place.id}
              to="/dining"
              className="group block bg-cream-50 overflow-hidden border border-ink-200/60 hover:border-gold-400/60 transition-colors duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <p className="text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-3">
                  {place.cuisine}
                </p>
                <h3 className="font-display text-2xl text-ink-900 group-hover:text-gold-600 transition-colors">
                  {place.name}
                </h3>
                <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                  {place.description}
                </p>
                <p className="mt-5 text-[11px] uppercase tracking-widest text-ink-400">
                  {place.hours}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- TESTIMONIALS -------------------------- */

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];

  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-24 lg:py-32 bg-ink-800 text-cream-100 relative overflow-hidden">
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 font-display text-[400px] leading-none text-gold-500/10 select-none pointer-events-none">
        &ldquo;
      </div>

      <div className="container-luxe relative">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow text-gold-400 mb-10">In Their Words</p>

          <blockquote key={t.id} className="animate-fade-in">
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl italic text-cream-100 leading-[1.4]">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="mt-10 flex items-center justify-center gap-1 text-gold-400">
              {[...Array(5)].map((_, i) => (
                <HiOutlineStar key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>

            <div className="mt-6">
              <p className="font-display text-xl text-cream-50">{t.name}</p>
              <p className="text-xs uppercase tracking-ultra-wide text-cream-300/60 mt-2">
                {t.title} &middot; {t.location}
              </p>
            </div>
          </blockquote>

          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-12 h-12 rounded-full border border-cream-300/30 flex items-center justify-center text-cream-200 hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all duration-300"
            >
              <HiOutlineArrowLongLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1 transition-all duration-500 ${
                    i === current
                      ? 'w-10 bg-gold-400'
                      : 'w-4 bg-cream-300/30 hover:bg-cream-300/60'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-12 h-12 rounded-full border border-cream-300/30 flex items-center justify-center text-cream-200 hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all duration-300"
            >
              <HiOutlineArrowLongRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CTA ------------------------------ */

function CtaSection() {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=2400&q=85&auto=format&fit=crop"
          alt="The Adinkra terrace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ink-900/75" />
      </div>

      <div className="relative container-luxe text-center text-cream-50">
        <p className="eyebrow text-gold-300 mb-6">Reservations</p>
        <h2 className="heading-display text-4xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
          Your stay begins
          <br />
          <em className="font-serif italic font-normal text-gold-200">
            with a single word.
          </em>
        </h2>
        <p className="mt-8 mx-auto max-w-md text-cream-200/85 leading-relaxed">
          Call our reservations team, or reserve online in under two minutes.
          Direct bookings always receive our best rate.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking" className="btn-ghost-light">
            Reserve Online
            <HiOutlineArrowLongRight className="w-5 h-5" />
          </Link>
          <a
            href={`tel:${hotelInfo.phone}`}
            className="text-xs uppercase tracking-ultra-wide text-cream-100/80 hover:text-cream-50 link-underline py-4"
          >
            Or call {hotelInfo.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}