// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa6';
import { IoCallOutline } from 'react-icons/io5';
import { useAuth } from '../auth/AuthContext';
import { hotelInfo } from '../data/hotelData';

// Logo — imported so Vite fingerprints and optimizes it
import AdinkraLogo from '../assets/Adinkra.png';

const navLinks = [
  { name: 'Stay', path: '/rooms' },
  { name: 'Dining', path: '/dining' },
  { name: 'Wellness', path: '/about#wellness' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Journal', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

/**
 * Emails that can access the Admin Console.
 * In production, this check must live on the backend.
 */
const ADMIN_EMAILS = ['admin@theadinkra.com', 'demo@theadinkra.com'];

function isAdminUser(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isHomePage = location.pathname === '/';
  const transparent = isHomePage && !scrolled;
  const userIsAdmin = isAdminUser(user?.email);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top announcement bar — always dark, always visible */}
      <div className="hidden lg:block w-full bg-ink-900 border-b border-ink-800 text-cream-200">
        <div className="container-luxe flex items-center justify-between h-10 text-[11px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <IoCallOutline className="w-3.5 h-3.5 text-gold-400" />
            <a
              href={`tel:${hotelInfo.phone}`}
              className="link-underline hover:text-gold-300 transition-colors"
            >
              {hotelInfo.phoneDisplay}
            </a>
          </div>
          <p className="text-gold-300">
            Reserve directly &mdash; complimentary breakfast on all suites
          </p>
          <div className="flex items-center gap-5">
            <a
              href={hotelInfo.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-gold-300 transition-colors"
            >
              <FaInstagram className="w-3.5 h-3.5" />
            </a>
            <a
              href={hotelInfo.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-gold-300 transition-colors"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a
              href={hotelInfo.social.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-gold-300 transition-colors"
            >
              <FaLinkedinIn className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          transparent
            ? 'bg-gradient-to-b from-ink-900/70 via-ink-900/30 to-transparent text-white'
            : 'bg-cream-100/95 backdrop-blur-md text-ink-900 border-b border-ink-200/60 shadow-[0_1px_0_rgba(0,0,0,0.04)]'
        }`}
      >
        <nav className="container-luxe flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 lg:gap-4 leading-none group"
            aria-label="The Adinkra — Home"
          >
            <img
              src={AdinkraLogo}
              alt=""
              className={`h-10 w-10 lg:h-12 lg:w-12 object-contain transition-all duration-500 group-hover:scale-105 ${
                transparent ? 'brightness-0 invert' : ''
              }`}
            />
            <span className="flex flex-col items-start">
              <span
                className={`font-display text-xl lg:text-2xl tracking-tight transition-colors duration-500 ${
                  transparent ? 'text-white' : 'text-ink-900'
                }`}
              >
                Golden Race 
              </span>
              <span
                className={`hidden sm:block text-[8px] lg:text-[9px] tracking-mega-wide uppercase mt-0.5 transition-colors duration-500 ${
                  transparent ? 'text-gold-300' : 'text-gold-600'
                }`}
              >
                Accra &middot; Est. 1994
              </span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `link-underline text-[12px] uppercase tracking-ultra-wide font-medium transition-colors duration-300 ${
                      transparent
                        ? 'text-white hover:text-gold-200'
                        : isActive
                        ? 'text-gold-600'
                        : 'text-ink-800 hover:text-gold-600'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side — desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-3 focus:outline-none"
                  aria-label="Account menu"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-gold-500/60"
                    />
                  ) : (
                    <HiOutlineUserCircle
                      className={`w-7 h-7 ${
                        transparent ? 'text-white' : 'text-ink-800'
                      }`}
                    />
                  )}
                  <span
                    className={`text-[11px] uppercase tracking-ultra-wide ${
                      transparent ? 'text-white' : 'text-ink-800'
                    }`}
                  >
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-4 w-60 bg-cream-100 border border-ink-200 shadow-xl py-2 animate-fade-in">
                    <div className="px-5 py-4 border-b border-ink-200">
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-ink-500 truncate mt-1">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/account"
                      className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-widest text-ink-700 hover:bg-cream-200 hover:text-gold-600 transition-colors"
                    >
                      <HiOutlineUserCircle className="w-4 h-4" />
                      My Account
                    </Link>

                    <Link
                      to="/account"
                      state={{ tab: 'stays' }}
                      className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-widest text-ink-700 hover:bg-cream-200 hover:text-gold-600 transition-colors"
                    >
                      <HiOutlineCalendarDays className="w-4 h-4" />
                      My Reservations
                    </Link>

                    {userIsAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-widest text-gold-700 hover:bg-cream-200 transition-colors border-t border-ink-200/60 mt-1 pt-3"
                      >
                        <HiOutlineBuildingOffice2 className="w-4 h-4" />
                        Admin Console
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-widest text-ink-700 hover:bg-cream-200 hover:text-gold-600 transition-colors border-t border-ink-200/60 mt-1 pt-3"
                    >
                      <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-[12px] uppercase tracking-ultra-wide font-medium transition-colors ${
                  transparent
                    ? 'text-white hover:text-gold-200'
                    : 'text-ink-800 hover:text-gold-600'
                }`}
              >
                Sign In
              </Link>
            )}

            <Link
              to="/booking"
              className={`px-6 py-3 text-[11px] uppercase tracking-ultra-wide font-medium transition-all duration-500 ${
                transparent
                  ? 'bg-white text-ink-900 hover:bg-gold-500 hover:text-white'
                  : 'bg-ink-900 text-cream-100 hover:bg-gold-500 hover:text-white'
              }`}
            >
              Reserve
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2"
            aria-label="Open menu"
          >
            <HiOutlineBars3
              className={`w-7 h-7 ${transparent ? 'text-white' : 'text-ink-900'}`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-cream-100 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 h-20 border-b border-ink-200">
            <div className="flex items-center gap-3">
              <img
                src={AdinkraLogo}
                alt=""
                className="h-9 w-9 object-contain"
              />
              <span className="font-display text-xl text-ink-900">Menu</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="p-2"
            >
              <HiOutlineXMark className="w-6 h-6 text-ink-800" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-1">
              {navLinks.map((link, i) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="group flex items-center justify-between py-4 border-b border-ink-200/60"
                  >
                    <span className="font-display text-2xl text-ink-800 group-hover:text-gold-600 transition-colors">
                      {link.name}
                    </span>
                    <span className="text-[10px] tracking-ultra-wide text-ink-400">
                      0{i + 1}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 p-4 bg-cream-200">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <HiOutlineUserCircle className="w-10 h-10 text-ink-700" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-ink-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/account"
                    className="flex items-center justify-center gap-3 w-full border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-cream-100 py-4 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-300"
                  >
                    <HiOutlineUserCircle className="w-4 h-4" />
                    My Account
                  </Link>

                  {userIsAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center justify-center gap-3 w-full bg-gold-500 text-white hover:bg-gold-600 py-4 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-300"
                    >
                      <HiOutlineBuildingOffice2 className="w-4 h-4" />
                      Admin Console
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 border border-ink-300 text-ink-700 hover:border-ink-900 hover:text-ink-900 py-4 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-300"
                  >
                    <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block w-full btn-outline">
                    Sign In
                  </Link>
                  <Link to="/register" className="block w-full btn-primary">
                    Create Account
                  </Link>
                </>
              )}

              <Link to="/booking" className="block w-full btn-primary mt-4">
                Reserve a Stay
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-ink-200">
              <p className="eyebrow mb-3">Reservations</p>
              <a
                href={`tel:${hotelInfo.phone}`}
                className="block font-serif text-2xl text-ink-800 hover:text-gold-600 transition-colors"
              >
                {hotelInfo.phoneDisplay}
              </a>
              <p className="mt-4 text-sm text-ink-500 leading-relaxed">
                {hotelInfo.address}
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href={hotelInfo.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-ink-600 hover:text-gold-500 transition-colors"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a
                  href={hotelInfo.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="text-ink-600 hover:text-gold-500 transition-colors"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a
                  href={hotelInfo.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-ink-600 hover:text-gold-500 transition-colors"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}