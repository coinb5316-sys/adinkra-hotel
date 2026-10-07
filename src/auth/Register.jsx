// src/auth/Register.jsx
import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLongRight,
  HiOutlineArrowLongLeft,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from './AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    registerWithEmail,
    loginWithGoogleProfile,
    isAuthenticated,
  } = useAuth();

  const redirectTo = location.state?.from?.pathname || '/booking';

  if (isAuthenticated) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* Password strength */
  const strength = useMemo(() => evaluatePassword(password), [password]);
  const passwordsMatch =
    confirm.length === 0 || password === confirm;

  /* ---------------- Email registration ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (strength.score < 2) {
      setError('Please choose a stronger password.');
      return;
    }
    if (!agree) {
      setError('Please accept the terms to continue.');
      return;
    }

    setSubmitting(true);
    try {
      await registerWithEmail(name, email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- Google ---------------- */
  const signUpWithGoogle = useGoogleLogin({
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
        setError(err.message || 'Google sign-up failed.');
      } finally {
        setSubmitting(false);
      }
    },
    onError: () => setError('Google sign-up was cancelled.'),
  });

  return (
    <div className="min-h-screen bg-cream-100 grid lg:grid-cols-2">
      {/* LEFT — image panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-ink-900 text-cream-50">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85&auto=format&fit=crop"
          alt="The Adinkra"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/30 to-ink-900/85" />

        <div className="relative p-12">
          <Link to="/" className="inline-block">
            <p className="font-display text-2xl">The Adinkra</p>
            <p className="text-[10px] tracking-mega-wide uppercase text-gold-300 mt-1">
              Accra &middot; Est. 1994
            </p>
          </Link>
        </div>

        <div className="relative p-12 max-w-lg">
          <p className="font-serif italic text-2xl lg:text-3xl leading-[1.4] text-cream-100">
            &ldquo;The kindest welcome is the one that already knows your
            name.&rdquo;
          </p>
          <p className="mt-6 text-[10px] uppercase tracking-mega-wide text-gold-300">
            — The Adinkra, since 1994
          </p>
        </div>
      </aside>

      {/* RIGHT — form */}
      <main className="flex flex-col">
        {/* Mobile bar */}
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
            <p className="eyebrow mb-4">Create an account</p>

            <h1 className="heading-display text-4xl md:text-5xl text-ink-900">
              Join the house.
              <br />
              <em className="font-serif italic font-normal text-gold-600">
                Stay in the know.
              </em>
            </h1>

            <p className="mt-5 text-sm text-ink-600 leading-relaxed">
              Members receive our best available rate, early access to seasonal
              offers, and a personal welcome on every return.
            </p>

            {/* Google */}
            <button
              type="button"
              onClick={() => signUpWithGoogle()}
              disabled={submitting}
              className="mt-10 w-full flex items-center justify-center gap-3 border border-ink-300 hover:border-ink-900 bg-cream-50 hover:bg-white py-4 text-[11px] uppercase tracking-ultra-wide font-medium text-ink-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FcGoogle className="w-5 h-5" />
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-ink-200" />
              <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
                or
              </span>
              <span className="h-px flex-1 bg-ink-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              <FormField
                label="Full name"
                icon={<HiOutlineUser className="w-4 h-4" />}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kwame Mensah"
                  autoComplete="name"
                  className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                  required
                />
              </FormField>

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
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
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
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                  required
                />
              </FormField>

              {/* Password strength */}
              {password && (
                <div>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 transition-colors duration-300 ${
                          i < strength.score
                            ? strength.color
                            : 'bg-ink-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-ultra-wide text-ink-500">
                    Strength: {strength.label}
                  </p>
                </div>
              )}

              <FormField
                label="Confirm password"
                icon={<HiOutlineLockClosed className="w-4 h-4" />}
                trailing={
                  confirm ? (
                    passwordsMatch ? (
                      <HiOutlineCheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <HiOutlineXCircle className="w-4 h-4 text-red-600" />
                    )
                  ) : null
                }
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                  required
                />
              </FormField>

              <label className="flex items-start gap-3 cursor-pointer group">
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-colors ${
                    agree
                      ? 'bg-gold-500 border-gold-500 text-white'
                      : 'border-ink-400 group-hover:border-ink-900'
                  }`}
                >
                  {agree && <HiOutlineCheckCircle className="w-4 h-4" />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="text-xs text-ink-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/policies" className="text-ink-900 link-underline">
                    terms of service
                  </Link>{' '}
                  and{' '}
                  <Link to="/policies" className="text-ink-900 link-underline">
                    privacy policy
                  </Link>
                  .
                </span>
              </label>

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
                {submitting ? 'Creating account…' : 'Create account'}
                {!submitting && (
                  <HiOutlineArrowLongRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <p className="mt-10 text-sm text-ink-600 text-center">
              Already have an account?{' '}
              <Link
                to="/login"
                state={{ from: location.state?.from }}
                className="text-ink-900 font-medium link-underline"
              >
                Sign in
              </Link>
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

/* ---------------- Password evaluator ---------------- */

function evaluatePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  // Length alone is not enough — require at least 8 chars to score anything
  if (pw.length < 8) score = Math.min(score, 1);

  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Excellent'];
  const colors = [
    'bg-red-500',
    'bg-red-400',
    'bg-amber-400',
    'bg-lime-500',
    'bg-green-600',
  ];

  return {
    score,
    label: labels[score],
    color: colors[score],
  };
}