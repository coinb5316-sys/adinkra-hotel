// src/pages/Gallery.jsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  HiOutlineXMark,
  HiOutlineArrowLongLeft,
  HiOutlineArrowLongRight,
  HiOutlineCamera,
} from 'react-icons/hi2';
import { IoCloseOutline } from 'react-icons/io5';
import { galleryImages } from '../data/hotelData';

const CATEGORIES = ['All', 'Rooms', 'Spaces', 'Dining', 'Wellness'];

export default function Gallery() {
  const [category, setCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = useMemo(() => {
    if (category === 'All') return galleryImages;
    return galleryImages.filter((img) => img.category === category);
  }, [category]);

  const close = useCallback(() => setLightboxIndex(null), []);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + filtered.length) % filtered.length,
    );
  }, [filtered.length]);

  // Keyboard controls for the lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    // Lock body scroll while lightbox is open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, close, next, prev]);

  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-14 lg:pb-20 bg-ink-900 text-cream-50">
        <div className="container-luxe">
          <p className="eyebrow text-gold-400 mb-6 animate-fade-in">
            Gallery
          </p>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl max-w-3xl animate-fade-up">
            The house,
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              as it really is.
            </em>
          </h1>
          <p
            className="mt-8 max-w-xl text-cream-200/80 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Photographs made on quiet mornings. No styling team, no models.
            Just the light as it falls on the rooms, the food, and the garden.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-20 lg:top-24 z-30 bg-cream-100/95 backdrop-blur-md border-b border-ink-200/60">
        <div className="container-luxe py-5 flex items-center gap-3 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 text-[11px] uppercase tracking-ultra-wide transition-all duration-300 border ${
                category === cat
                  ? 'bg-ink-900 text-cream-100 border-ink-900'
                  : 'bg-transparent text-ink-700 border-ink-300 hover:border-ink-900'
              }`}
            >
              {cat}
            </button>
          ))}
          <p className="hidden md:block ml-auto text-xs text-ink-500 tracking-widest uppercase">
            {filtered.length} {filtered.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-12 lg:py-16">
        <div className="container-luxe">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px]">
            {filtered.map((img, i) => (
              <GalleryTile
                key={img.src + i}
                image={img}
                index={i}
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="fixed inset-0 z-[90] bg-ink-900/97 flex flex-col animate-fade-in">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 py-5 text-cream-200">
            <p className="text-[11px] uppercase tracking-ultra-wide">
              {lightboxIndex + 1} / {filtered.length}
              <span className="ml-4 text-cream-400/60">
                {filtered[lightboxIndex].category}
              </span>
            </p>
            <button
              onClick={close}
              aria-label="Close gallery"
              className="p-2 hover:text-gold-400 transition-colors"
            >
              <IoCloseOutline className="w-7 h-7" />
            </button>
          </div>

          {/* Image */}
          <div
            className="flex-1 flex items-center justify-center px-4 pb-4"
            onClick={close}
          >
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-center gap-6 pb-8 text-cream-200">
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="w-12 h-12 rounded-full border border-cream-300/30 flex items-center justify-center hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all"
            >
              <HiOutlineArrowLongLeft className="w-5 h-5" />
            </button>
            <p className="text-[11px] uppercase tracking-ultra-wide min-w-[200px] text-center">
              {filtered[lightboxIndex].alt}
            </p>
            <button
              onClick={next}
              aria-label="Next photo"
              className="w-12 h-12 rounded-full border border-cream-300/30 flex items-center justify-center hover:bg-gold-500 hover:border-gold-500 hover:text-white transition-all"
            >
              <HiOutlineArrowLongRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Tile layout: some images span 2 columns/rows to create a magazine feel */
function GalleryTile({ image, index, onClick }) {
  // Every 7th tile spans wide; every 5th spans tall — creates visual rhythm
  const spanWide = index % 7 === 0;
  const spanTall = index % 5 === 0 && !spanWide;

  const span = spanWide
    ? 'col-span-2 row-span-1'
    : spanTall
    ? 'col-span-1 row-span-2'
    : 'col-span-1 row-span-1';

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden bg-ink-200 ${span}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/40 transition-colors duration-500" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <HiOutlineCamera className="w-7 h-7 text-cream-50" />
      </div>
      <span className="absolute top-3 left-3 text-[9px] uppercase tracking-ultra-wide text-cream-50/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {image.category}
      </span>
    </button>
  );
}