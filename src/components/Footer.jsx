// src/components/Footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaPinterestP,
} from 'react-icons/fa6';
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineArrowLongRight,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { hotelInfo } from '../data/hotelData';

// Import the logo
import AdinkraLogo from '../assets/Adinkra.png';

const footerNav = {
  stay: [
    { name: 'Rooms & Suites', path: '/rooms' },
    { name: 'The Osu Penthouse', path: '/rooms/penthouse' },
    { name: 'Offers & Packages', path: '/rooms' },
    { name: 'Reservations', path: '/booking' },
  ],
  experience: [
    { name: 'Dining', path: '/dining' },
    { name: 'The Spa', path: '/about' },
    { name: 'Rooftop Pool', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
  ],
  about: [
    { name: 'Our Story', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Careers', path: '/about' },
  ],
  legal: [
    { name: 'Policies', path: '/policies' },
    { name: 'Privacy', path: '/policies' },
    { name: 'Terms', path: '/policies' },
    { name: 'Accessibility', path: '/policies' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-cream-200">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-luxe py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow text-gold-400 mb-4">The Adinkra Journal</p>
            <h3 className="heading-display text-3xl md:text-4xl lg:text-5xl text-cream-50 max-w-lg">
              Letters from Accra, four times a year.
            </h3>
            <p className="mt-4 text-cream-300/70 max-w-md text-sm leading-relaxed">
              Private offers, restaurant openings, and stories from the house.
              No noise, ever.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:max-w-md lg:ml-auto">
            <div className="flex items-center border-b border-white/30 focus-within:border-gold-400 transition-colors">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent py-4 text-cream-100 placeholder:text-cream-300/40 text-sm focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="p-4 text-gold-400 hover:text-gold-300 transition-colors"
              >
                <HiOutlineArrowLongRight className="w-6 h-6" />
              </button>
            </div>
            {subscribed && (
              <p className="mt-3 flex items-center gap-2 text-xs text-gold-300 tracking-widest uppercase">
                <HiOutlineCheckCircle className="w-4 h-4" />
                Welcome to the house.
              </p>
            )}
            <p className="mt-3 text-[11px] text-cream-300/40 tracking-wider">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-luxe py-16 lg:py-24 grid lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-4">
          {/* Logo + wordmark */}
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img
              src={AdinkraLogo}
              alt=""
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-105"
            />
            <span className="flex flex-col items-start">
              <span className="font-display text-2xl lg:text-3xl text-cream-50 leading-none">
                The Adinkra
              </span>
              <span className="text-[10px] tracking-mega-wide uppercase text-gold-400 mt-1">
                Accra &middot; Est. 1994
              </span>
            </span>
          </Link>

          <p className="mt-6 text-sm text-cream-300/70 leading-relaxed max-w-sm">
            {hotelInfo.shortDescription}
          </p>

          <address className="not-italic mt-8 space-y-4">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(hotelInfo.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 text-sm text-cream-300/80 hover:text-gold-300 transition-colors group"
            >
              <HiOutlineMapPin className="w-5 h-5 mt-0.5 text-gold-400 flex-shrink-0" />
              <span className="group-hover:underline">{hotelInfo.address}</span>
            </a>
            <a
              href={`tel:${hotelInfo.phone}`}
              className="flex items-center gap-3 text-sm text-cream-300/80 hover:text-gold-300 transition-colors group"
            >
              <HiOutlinePhone className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <span className="group-hover:underline">{hotelInfo.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${hotelInfo.email}`}
              className="flex items-center gap-3 text-sm text-cream-300/80 hover:text-gold-300 transition-colors group"
            >
              <HiOutlineEnvelope className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <span className="group-hover:underline">{hotelInfo.email}</span>
            </a>
          </address>
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterColumn title="Stay" links={footerNav.stay} />
          <FooterColumn title="Experience" links={footerNav.experience} />
          <FooterColumn title="The House" links={footerNav.about} />
          <FooterColumn title="Legal" links={footerNav.legal} />
        </div>
      </div>

      {/* Awards strip */}
      <div className="border-t border-white/10">
        <div className="container-luxe py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-[10px] uppercase tracking-ultra-wide text-cream-300/50">
          <span>Condé Nast Traveler &mdash; Gold List 2024</span>
          <span className="hidden md:inline text-gold-500/50">&bull;</span>
          <span>Forbes Travel Guide &mdash; Recommended</span>
          <span className="hidden md:inline text-gold-500/50">&bull;</span>
          <span>Tatler &mdash; Best City Hotel, West Africa</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-luxe py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] tracking-widest text-cream-300/50">
          <p>
            &copy; {year} {hotelInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href={hotelInfo.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-gold-300 transition-colors"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href={hotelInfo.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-gold-300 transition-colors"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href={hotelInfo.social.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="hover:text-gold-300 transition-colors"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
            <a
              href={hotelInfo.social.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-gold-300 transition-colors"
            >
              <FaLinkedinIn className="w-4 h-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="hover:text-gold-300 transition-colors"
            >
              <FaPinterestP className="w-4 h-4" />
            </a>
          </div>
          <p className="text-cream-300/30">Crafted in Accra</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-ultra-wide text-gold-400 mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="text-sm text-cream-300/70 hover:text-cream-50 transition-colors link-underline"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}