// components/AuthModal.jsx
'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { getSupabaseBrowser } from '@/lib/supabaseBrowser';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({ onSuccess, onClose }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    const supabase = getSupabaseBrowser();

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      setIsSubmitting(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Passes the newly created user object (including user.id UUID)
      onSuccess?.(data.user);
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setIsSubmitting(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Passes the authenticated user object (including user.id UUID)
      onSuccess?.(data.user);
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#14171F]/35 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="relative w-full max-w-[340px] rounded-[22px] border border-violet-100 bg-white p-5 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xl leading-none text-slate-500 hover:bg-violet-50"
          aria-label="Close"
        >
          ×
        </button>

        <h3 className="text-center text-lg font-bold text-slate-900">
          {mode === 'signin' ? 'Welcome back' : 'Create an account'}
        </h3>
        <p className="mt-1 text-center text-xs text-slate-500">
          {mode === 'signin'
            ? 'Enter your email and password to sign in.'
            : 'Enter your email and create a password.'}
        </p>

        <form onSubmit={handleAuth} className="mt-4 space-y-3">
          <div>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-4 py-3 text-sm outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-4 py-3 text-sm outline-none focus:border-violet-500"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-4 py-3 text-sm outline-none focus:border-violet-500"
              />
            </div>
          )}

          {error && <p className="text-xs text-rose-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white hover:bg-violet-800 disabled:opacity-60"
          >
            {isSubmitting
              ? mode === 'signin' ? 'Signing in...' : 'Creating account...'
              : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              resetForm();
            }}
            className="w-full text-center text-xs font-semibold text-violet-700 hover:underline"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modal, document.body);
}