// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowLongRight,
  HiOutlineHome,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import { IoBedOutline } from 'react-icons/io5';
import { PiForkKnifeBold } from 'react-icons/pi';
import { rooms, hotelInfo } from '../data/hotelData';

export default function NotFound() {
  // Suggest three rooms as a "you may like" nudge
  const suggestions = rooms.slice(0, 3);

  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-ink-900 text-cream-50 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=2400&q=85&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/95 via-ink-900/85 to-ink-900" />
        </div>

        <div className="relative container-luxe text-center">
          <p className="eyebrow text-gold-400 mb-8 animate-fade-in">
            404
          </p>
          <h1 className="heading-display text-6xl md:text-7xl lg:text-8xl max-w-4xl mx-auto animate-fade-up">
            A wrong turn
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              down a quiet corridor.
            </em>
          </h1>
          <p
            className="mt-8 max-w-xl mx-auto text-cream-200/80 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            The page you were looking for has either moved, been renamed, or
            never existed. Happens to the best of us.
          </p>

          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Link to="/" className="btn-ghost-light">
              <HiOutlineHome className="w-4 h-4" />
              Return home
            </Link>
            <Link
              to="/contact"
              className="text-xs uppercase tracking-ultra-wide text-cream-100/80 hover:text-cream-50 link-underline py-4"
            >
              Tell us what you were looking for
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="py-16 lg:py-20">
        <div className="container-luxe">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <QuickLink
              to="/rooms"
              icon={<IoBedOutline className="w-6 h-6" />}
              title="Browse rooms"
              description="Forty-two rooms and suites, each with its own character."
            />
            <QuickLink
              to="/dining"
              icon={<PiForkKnifeBold className="w-6 h-6" />}
              title="Visit the restaurants"
              description="Akwaaba, Soleil, and The Library Bar."
            />
            <QuickLink
              to="/contact"
              icon={<HiOutlineMapPin className="w-6 h-6" />}
              title="Find us"
              description="Directions, contact details, and a live map."
            />
          </div>
        </div>
      </section>

      {/* ROOM SUGGESTIONS */}
      <section className="pb-24 lg:pb-32">
        <div className="container-luxe">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow mb-4">You may like</p>
              <h2 className="heading-display text-3xl md:text-4xl text-ink-900 max-w-xl">
                Some rooms
                <br />
                <em className="font-serif italic font-normal text-gold-600">
                  worth turning back for.
                </em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {suggestions.map((room) => (
              <Link
                key={room.id}
                to={`/rooms/${room.id}`}
                className="group block bg-cream-50 border border-ink-200/60 hover:border-gold-400/60 transition-colors"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-2">
                    {room.category}
                  </p>
                  <h3 className="font-display text-xl text-ink-900 group-hover:text-gold-600 transition-colors">
                    {room.name}
                  </h3>
                  <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-widest text-ink-500">
                    <span>GH&#8373; {room.price.toLocaleString()} / night</span>
                    <HiOutlineArrowLongRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickLink({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="group block p-8 border border-ink-200/60 bg-cream-50 hover:border-gold-400/60 transition-colors"
    >
      <div className="flex items-center gap-3 text-gold-500 mb-4">
        {icon}
        <span className="h-px flex-1 bg-ink-200 group-hover:bg-gold-400/60 transition-colors" />
      </div>
      <h3 className="font-display text-2xl text-ink-900 group-hover:text-gold-600 transition-colors">
        {title}
      </h3>
      <p className="mt-3 text-sm text-ink-600 leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-ultra-wide text-ink-500 group-hover:text-gold-600 transition-colors">
        Explore
        <HiOutlineArrowLongRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
      </div>
    </Link>
  );
}