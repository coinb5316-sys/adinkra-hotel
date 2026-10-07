// src/pages/Rooms.jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowLongRight,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineXMark,
  HiOutlineUserGroup,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import {
  IoBedOutline,
  IoResizeOutline,
  IoEyeOutline,
} from 'react-icons/io5';
import { rooms, hotelInfo } from '../data/hotelData';

const CATEGORIES = ['All', 'Room', 'Suite', 'Signature Suite', 'Deluxe Suite', 'Penthouse'];

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price — Low to High' },
  { value: 'price-desc', label: 'Price — High to Low' },
  { value: 'size-desc', label: 'Largest first' },
];

export default function Rooms() {
  const [category, setCategory] = useState('All');
  const [guests, setGuests] = useState('any');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sort, setSort] = useState('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...rooms];

    if (category !== 'All') {
      list = list.filter((r) => r.category === category);
    }

    if (guests !== 'any') {
      const min = parseInt(guests, 10);
      list = list.filter((r) => r.guests >= min);
    }

    list = list.filter((r) => r.price <= maxPrice);

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'size-desc':
        list.sort((a, b) => b.size - a.size);
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [category, guests, maxPrice, sort]);

  const resetFilters = () => {
    setCategory('All');
    setGuests('any');
    setMaxPrice(20000);
    setSort('recommended');
  };

  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-ink-900 text-cream-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=2400&q=85&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/90 via-ink-900/80 to-ink-900" />
        </div>

        <div className="relative container-luxe">
          <p className="eyebrow text-gold-400 mb-6 animate-fade-in">
            Rooms & Suites
          </p>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl max-w-3xl animate-fade-up">
            Forty-two ways
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              to be at ease.
            </em>
          </h1>
          <p
            className="mt-8 max-w-xl text-cream-200/80 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Every room at {hotelInfo.name} is designed around a single idea:
            that a great hotel room should feel like the quietest, most
            considered room you have ever slept in. Choose the one that suits
            the version of you travelling today.
          </p>
        </div>
      </section>

      {/* TOOLBAR */}
      <section className="sticky top-20 lg:top-24 z-30 bg-cream-100/95 backdrop-blur-md border-y border-ink-200/60">
        <div className="container-luxe py-5 flex flex-wrap items-center gap-4">
          {/* Category pills — desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 text-[11px] uppercase tracking-ultra-wide transition-all duration-300 border ${
                  category === cat
                    ? 'bg-ink-900 text-cream-100 border-ink-900'
                    : 'bg-transparent text-ink-700 border-ink-300 hover:border-ink-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Category select — mobile */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="lg:hidden flex-1 bg-transparent border border-ink-300 px-4 py-2 text-xs uppercase tracking-ultra-wide text-ink-800 focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent border border-ink-300 px-4 py-2 text-xs uppercase tracking-ultra-wide text-ink-800 focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Filters drawer trigger */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 border border-ink-300 px-4 py-2 text-xs uppercase tracking-ultra-wide text-ink-800 hover:border-ink-900 transition-colors"
          >
            <HiOutlineAdjustmentsHorizontal className="w-4 h-4" />
            Refine
          </button>

          <p className="hidden xl:block text-xs text-ink-500 tracking-widest uppercase ml-auto">
            {filtered.length} {filtered.length === 1 ? 'room' : 'rooms'}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-16 lg:py-24">
        <div className="container-luxe">
          {filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 lg:gap-x-8 lg:gap-y-20">
              {filtered.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Filters drawer */}
      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        guests={guests}
        setGuests={setGuests}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onReset={resetFilters}
        count={filtered.length}
      />
    </div>
  );
}

/* ---------------------------- ROOM CARD ---------------------------- */

function RoomCard({ room, index }) {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden mb-6">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />

        <span className="absolute top-5 left-5 text-[10px] uppercase tracking-ultra-wide text-cream-50 bg-ink-900/60 backdrop-blur-sm px-3 py-1.5">
          {room.category}
        </span>

        {room.featured && (
          <span className="absolute top-5 right-5 flex items-center gap-1.5 text-[10px] uppercase tracking-ultra-wide text-ink-900 bg-gold-300 px-3 py-1.5">
            <HiOutlineSparkles className="w-3 h-3" />
            Featured
          </span>
        )}

        <div className="absolute bottom-5 left-5 right-5 text-cream-50">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-ultra-wide text-cream-200/70">
                From
              </p>
              <p className="font-display text-2xl lg:text-3xl leading-none mt-1">
                GH&#8373; {room.price.toLocaleString()}
              </p>
              <p className="text-[10px] tracking-widest text-cream-200/60 uppercase mt-1">
                per night
              </p>
            </div>
            <HiOutlineArrowLongRight className="w-6 h-6 text-gold-300 transition-transform duration-500 group-hover:translate-x-1" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-3">
        <span className="h-px w-8 bg-gold-500" />
        <span>{room.view}</span>
      </div>

      <h3 className="font-display text-2xl text-ink-900 group-hover:text-gold-600 transition-colors">
        {room.name}
      </h3>

      <p className="mt-3 text-sm text-ink-600 leading-relaxed">
        {room.shortDescription}
      </p>

      <div className="mt-5 pt-5 border-t border-ink-200 flex items-center gap-5 text-[11px] uppercase tracking-widest text-ink-500">
        <span className="flex items-center gap-1.5">
          <IoBedOutline className="w-4 h-4" />
          {room.beds}
        </span>
        <span className="flex items-center gap-1.5">
          <IoResizeOutline className="w-4 h-4" />
          {room.size} m&sup2;
        </span>
        <span className="flex items-center gap-1.5">
          <HiOutlineUserGroup className="w-4 h-4" />
          {room.guests}
        </span>
      </div>
    </Link>
  );
}

/* ---------------------------- EMPTY STATE ---------------------------- */

function EmptyState({ onReset }) {
  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="w-16 h-16 mx-auto rounded-full border border-ink-300 flex items-center justify-center mb-6">
        <IoEyeOutline className="w-6 h-6 text-ink-500" />
      </div>
      <h3 className="font-display text-3xl text-ink-900">
        No rooms match your filters.
      </h3>
      <p className="mt-4 text-ink-600 leading-relaxed">
        Try widening your dates or removing a filter. Our reservations team is
        also happy to help by phone if you have something specific in mind.
      </p>
      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-ink-900 link-underline"
      >
        Clear all filters
        <HiOutlineArrowLongRight className="w-5 h-5" />
      </button>
    </div>
  );
}

/* --------------------------- FILTERS DRAWER --------------------------- */

function FiltersDrawer({
  open,
  onClose,
  guests,
  setGuests,
  maxPrice,
  setMaxPrice,
  onReset,
  count,
}) {
  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-500 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-cream-100 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-8 h-20 border-b border-ink-200">
          <div>
            <p className="eyebrow">Refine</p>
            <p className="font-display text-xl text-ink-900 mt-1">
              Narrow the house
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 hover:text-gold-600 transition-colors"
          >
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10">
          {/* Guests */}
          <div>
            <label className="eyebrow block mb-4">Guests</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { v: 'any', l: 'Any' },
                { v: '1', l: '1' },
                { v: '2', l: '2' },
                { v: '3', l: '3+' },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => setGuests(v)}
                  className={`py-3 text-xs uppercase tracking-widest border transition-colors ${
                    guests === v
                      ? 'bg-ink-900 text-cream-100 border-ink-900'
                      : 'border-ink-300 text-ink-700 hover:border-ink-900'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="eyebrow">Nightly budget</label>
              <span className="font-display text-lg text-ink-900">
                GH&#8373; {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={20000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold-500"
            />
            <div className="flex justify-between mt-2 text-[10px] uppercase tracking-widest text-ink-400">
              <span>GH&#8373; 2,000</span>
              <span>GH&#8373; 20,000</span>
            </div>
          </div>

          <div className="border-t border-ink-200 pt-8 text-sm text-ink-600 leading-relaxed">
            Our reservations team can arrange connecting rooms, cribs, and
            accessible layouts on request. Please call us at{' '}
            <span className="text-ink-900">{hotelInfo.phoneDisplay}</span>.
          </div>
        </div>

        <div className="border-t border-ink-200 px-8 py-6 flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex-1 text-xs uppercase tracking-ultra-wide text-ink-600 hover:text-ink-900 transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-ink-900 text-cream-100 hover:bg-gold-500 hover:text-white px-6 py-4 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-500"
          >
            Show {count} {count === 1 ? 'room' : 'rooms'}
          </button>
        </div>
      </aside>
    </div>
  );
}