// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'adinkra_auth_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.expiresAt && parsed.expiresAt > Date.now()) {
          setUser(parsed.user);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (err) {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  // Persist session helper
  const persist = (userData, days = 7) => {
    const session = {
      user: userData,
      expiresAt: Date.now() + days * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(userData);
  };

  /**
   * Sign in with a Google profile (already fetched from Google's userinfo endpoint).
   * Shape expected: { sub, name, email, picture }
   */
  const loginWithGoogleProfile = (profile) => {
    if (!profile?.email) throw new Error('Google profile missing email');
    const userData = {
      id: profile.sub || `google_${Date.now()}`,
      name: profile.name || profile.email.split('@')[0],
      email: profile.email,
      picture: profile.picture || null,
      provider: 'google',
    };
    persist(userData);
    return userData;
  };

  /**
   * Email/password sign-in.
   * Mock implementation — replace the body of this function with a call
   * to your backend when you build it. For now it accepts anything with a
   * valid-looking email + 6+ char password so you can test the flow.
   */
  const loginWithEmail = async (email, password) => {
    await new Promise((r) => setTimeout(r, 700));

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const userData = {
      id: `email_${email}`,
      name: email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      picture: null,
      provider: 'email',
    };

    persist(userData);
    return userData;
  };

  /**
   * Email/password registration.
   * Also mock. Backend integration comes later.
   */
  const registerWithEmail = async (name, email, password) => {
    await new Promise((r) => setTimeout(r, 900));

    if (!name || name.trim().length < 2) {
      throw new Error('Please enter your full name.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    const userData = {
      id: `email_${email}`,
      name: name.trim(),
      email,
      picture: null,
      provider: 'email',
    };

    persist(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginWithGoogleProfile,
    loginWithEmail,
    registerWithEmail,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}