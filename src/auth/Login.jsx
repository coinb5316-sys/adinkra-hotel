// src/auth/Login.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLongRight,
  HiOutlineExclamationTriangle,
  HiOutlineArrowLongLeft,
} from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, loginWithGoogleProfile, isAuthenticated } = useAuth();

  // Where to send the guest after successful login
  const redirectTo = location.state?.from?.pathname || '/booking';

  // If already signed in, don't show the login page — send them on.
  if (isAuthenticated) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- Email sign-in ---------------- */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- Google sign-in ---------------- */
  const signInWithGoogle = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      setError('');
      setSubmitting(true);
      try {
        const res = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        if (!res.ok) throw new Error('Could not fetch Google profile.');
        const profile = await res.json();
        loginWithGoogleProfile(profile);
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setError(err.message || 'Google sign-in failed.');
      } finally {
        setSubmitting(false);
      }
    },
    onError: () => setError('Google sign-in was cancelled.'),
  });

  return (
    <div className="min-h-screen bg-cream-100 grid lg:grid-cols-2">
      {/* LEFT — image panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-ink-900 text-cream-50">
        <img
          src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=85&auto=format&fit=crop"
          alt="The Adinkra"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/30 to-ink-900/85" />

        {/* Brand */}
        <div className="relative p-12">
          <Link to="/" className="inline-block group">
            <p className="font-display text-2xl">The Adinkra</p>
            <p className="text-[10px] tracking-mega-wide uppercase text-gold-300 mt-1">
              Accra &middot; Est. 1994
            </p>
          </Link>
        </div>

        {/* Quote */}
        <div className="relative p-12 max-w-lg">
          <p className="font-serif italic text-2xl lg:text-3xl leading-[1.4] text-cream-100">
            &ldquo;Hospitality is not what we do. It is who we are.&rdquo;
          </p>
          <p className="mt-6 text-[10px] uppercase tracking-mega-wide text-gold-300">
            — The Adinkra, since 1994
          </p>
        </div>
      </aside>

      {/* RIGHT — form */}
      <main className="flex flex-col">
        {/* Thin brand bar — mobile */}
        <div className="lg:hidden border-b border-ink-200/60">
          <div className="container-luxe flex items-center justify-between h-16">
            <Link to="/" className="flex flex-col leading-none">
              <span className="font-display text-lg text-ink-900">
                The Adinkra
              </span>
              <span className="text-[9px] tracking-mega-wide uppercase text-gold-600 mt-0.5">
                Accra &middot; Est. 1994
              </span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-[10px] uppercase tracking-ultra-wide text-ink-500 hover:text-gold-600 transition-colors"
            >
              <HiOutlineArrowLongLeft className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-14 lg:py-20">
          <div className="w-full max-w-md">
            {/* Eyebrow */}
            <p className="eyebrow mb-4">Welcome back</p>

            <h1 className="heading-display text-4xl md:text-5xl text-ink-900">
              Sign in to your
              <br />
              <em className="font-serif italic font-normal text-gold-600">
                account.
              </em>
            </h1>

            <p className="mt-5 text-sm text-ink-600 leading-relaxed">
              Access your reservations, save your preferences, and enjoy
              faster checkout on every future stay.
            </p>

            {/* Google — primary */}
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              disabled={submitting}
              className="mt-10 w-full flex items-center justify-center gap-3 border border-ink-300 hover:border-ink-900 bg-cream-50 hover:bg-white py-4 text-[11px] uppercase tracking-ultra-wide font-medium text-ink-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-ink-200" />
              <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
                or
              </span>
              <span className="h-px flex-1 bg-ink-200" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="space-y-7">
              <FormField
                label="Email address"
                icon={<HiOutlineEnvelope className="w-4 h-4" />}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                  required
                />
              </FormField>

              <FormField
                label="Password"
                icon={<HiOutlineLockClosed className="w-4 h-4" />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="text-ink-400 hover:text-ink-800 transition-colors"
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash className="w-4 h-4" />
                    ) : (
                      <HiOutlineEye className="w-4 h-4" />
                    )}
                  </button>
                }
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                  required
                />
              </FormField>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-ink-600">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-gold-500"
                  />
                  Remember me
                </label>
                <Link
                  to="/contact"
                  className="text-xs text-ink-600 hover:text-gold-600 transition-colors link-underline"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 text-red-800 text-xs leading-relaxed">
                  <HiOutlineExclamationTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full group bg-ink-900 text-cream-100 hover:bg-gold-500 hover:text-white py-5 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-500 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Signing in…' : 'Sign in'}
                {!submitting && (
                  <HiOutlineArrowLongRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-10 text-sm text-ink-600 text-center">
              New to The Adinkra?{' '}
              <Link
                to="/register"
                state={{ from: location.state?.from }}
                className="text-ink-900 font-medium link-underline"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-6 text-[11px] text-ink-400 text-center leading-relaxed">
              By signing in you agree to our{' '}
              <Link to="/policies" className="link-underline text-ink-600">
                terms of service
              </Link>{' '}
              and{' '}
              <Link to="/policies" className="link-underline text-ink-600">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Shared form field ---------------- */

function FormField({ label, icon, trailing, children }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
        {label}
      </span>
      <span className="mt-2 flex items-center gap-3 border-b border-ink-300 focus-within:border-gold-500 py-3 transition-colors">
        <span className="text-gold-500 flex-shrink-0">{icon}</span>
        {children}
        {trailing && <span className="flex-shrink-0">{trailing}</span>}
      </span>
    </label>
  );
}