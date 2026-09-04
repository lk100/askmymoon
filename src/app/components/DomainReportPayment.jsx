'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/; // 10-digit Indian mobile number

function getClientCountry() {
  if (typeof window === 'undefined') return 'IN';
  const queryCountry = new URLSearchParams(window.location.search).get('country');
  return (queryCountry || localStorage.getItem('user_country') || 'IN').toUpperCase();
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Unable to load Razorpay.'));
    document.body.appendChild(script);
  });
}

export default function DomainReportPayment({ userName, reportData, onSuccess }) {
  const [pricing, setPricing] = useState(null);
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [mounted, setMounted] = useState(false);

  // Contact details collected in the modal, required before payment starts.
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState({ email: false, phone: false });

  const isEmailValid = EMAIL_PATTERN.test(email.trim());
  const isPhoneValid = PHONE_PATTERN.test(phone.trim());
  const isContactValid = isEmailValid && isPhoneValid;

  // Needed because createPortal touches document.body, which only exists client-side.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock page scroll while the modal is open, and restore it on close/unmount.
  useEffect(() => {
    if (!showDetailsForm) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showDetailsForm]);

  useEffect(() => {
    let isMounted = true;

    async function loadPricing() {
      try {
        const clientCountry = getClientCountry();
        const response = await fetch('/api/geo-pricing', {
          cache: 'no-store',
          headers: { 'x-client-country': clientCountry },
        });
        if (!response.ok) throw new Error('Unable to load localized pricing.');
        const data = await response.json();
        if (isMounted) setPricing(data);
      } catch (error) {
        if (isMounted) setStatus({ type: 'error', message: error.message });
      } finally {
        if (isMounted) setIsLoadingPricing(false);
      }
    }

    loadPricing();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handlePayment(event) {
    event?.preventDefault();
    setTouched({ email: true, phone: true });
    if (!pricing || isPaying || !isContactValid) return;
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setStatus({ type: 'error', message: 'Payment is not configured yet.' });
      return;
    }

    setIsPaying(true);
    setStatus({ type: '', message: '' });

    const contact = { email: email.trim(), phone: phone.trim() };

    try {
      const clientCountry = getClientCountry();
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-client-country': clientCountry },
        body: JSON.stringify({ amount: pricing.amount, currency: pricing.currency, ...contact }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || 'Unable to create payment order.');

      await loadRazorpayScript();

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Astro Remedies',
        description: 'Personalized domain report',
        prefill: {
          email: contact.email,
          contact: contact.phone,
        },
        handler: async (response) => {
          try {
            const verificationResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: pricing.amount,
                currency: pricing.currency,
                userName,
                reportData,
                ...contact,
              }),
            });
            const result = await verificationResponse.json();
            if (!verificationResponse.ok) throw new Error(result.error || 'Payment verification failed.');

            setShowDetailsForm(false);
            setStatus({ type: 'success', message: 'Payment confirmed. Your full report is now unlocked.' });
            onSuccess?.({ ...result, contact });
          } catch (error) {
            setStatus({ type: 'error', message: error.message });
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
        theme: { color: '#7C3AED' },
      });

      razorpay.on('payment.failed', (response) => {
        setStatus({ type: 'error', message: response.error?.description || 'Payment could not be completed.' });
        setIsPaying(false);
      });
      razorpay.open();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
      setIsPaying(false);
    }
  }

  // Fallbacks so the UI never shows a blank price while pricing is loading/missing.
  const displayPrice = pricing?.displayPrice || '₹49';
  const displayOriginalPrice = pricing?.displayOriginalPrice || '₹99';

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#14171F]/35 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-details-title"
      onClick={(e) => {
        // Close when clicking the backdrop itself, not the card.
        if (e.target === e.currentTarget) setShowDetailsForm(false);
      }}
    >
      <div className="relative w-full max-w-[340px] max-h-[90vh] overflow-y-auto overscroll-contain rounded-[22px] border border-[#E7E2D8] bg-[#FAF8F4] p-4 shadow-[0_16px_40px_rgba(20,23,31,0.18)]">
        <button
          type="button"
          onClick={() => setShowDetailsForm(false)}
          className="sticky top-0 right-0 float-right -mt-1 -mr-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8F4] text-2xl leading-none text-[#14171F] transition hover:bg-[#E7E2D8] z-10"
          aria-label="Close payment details"
        >
          ×
        </button>

        <div className="pt-2 text-center clear-both">
          <h3 id="payment-details-title" className="font-serif text-[17px] font-semibold text-[#14171F] leading-[1.2]">
            Where should we send your report?
          </h3>
          <p className="text-[11px] text-[#78715F] mt-1">
            We'll unlock it here and email a copy too.
          </p>
        </div>

        <form className="mt-4 space-y-3" onSubmit={handlePayment} noValidate>
          <div className="text-left">
            <label htmlFor="report-email" className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#78715F] mb-1">
              Email address
            </label>
            <input
              id="report-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="you@example.com"
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-[13px] text-[#14171F] placeholder:text-[#A9A290] focus:outline-none focus:ring-2 transition ${
                touched.email && !isEmailValid
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-[#E7E2D8] focus:ring-[#B4571F]/25'
              }`}
            />
            {touched.email && !isEmailValid && (
              <p className="mt-1 text-[11px] text-rose-600">Enter a valid email address.</p>
            )}
          </div>

          <div className="text-left">
            <label htmlFor="report-phone" className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#78715F] mb-1">
              Phone number
            </label>
            <div className={`flex items-center rounded-xl border bg-white px-3.5 focus-within:ring-2 transition ${
              touched.phone && !isPhoneValid
                ? 'border-rose-400 focus-within:ring-rose-200'
                : 'border-[#E7E2D8] focus-within:ring-[#B4571F]/25'
            }`}>
              <span className="text-[13px] text-[#78715F] pr-2 border-r border-[#E7E2D8] mr-2">+91</span>
              <input
                id="report-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                placeholder="98765 43210"
                className="w-full py-2.5 text-[13px] text-[#14171F] placeholder:text-[#A9A290] focus:outline-none bg-transparent"
              />
            </div>
            {touched.phone && !isPhoneValid && (
              <p className="mt-1 text-[11px] text-rose-600">Enter a valid 10-digit mobile number.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!pricing || isPaying}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-[15px] font-bold text-white shadow-[0_8px_18px_rgba(124,58,237,0.2)] transition hover:bg-violet-700 disabled:opacity-60"
          >
            {isPaying ? (
              'Processing...'
            ) : (
              <>
                <span>Unlock now</span>
                <span className="line-through opacity-70 font-normal text-[13px]">{displayOriginalPrice}</span>
                <span>{displayPrice}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setShowDetailsForm(true)}
        disabled={isLoadingPricing || isPaying || !pricing}
        className="min-h-[48px] w-full rounded-xl bg-violet-600 px-4 py-3 text-[13px] font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
      >
        {isPaying
          ? 'Processing payment...'
          : isLoadingPricing
          ? 'Loading price...'
          : (
            <span className="inline-flex items-center gap-1.5">
              <span>Get Full Report</span>
              <span className="line-through opacity-70 font-normal">{displayOriginalPrice}</span>
              <span>{displayPrice}</span>
            </span>
          )}
      </button>

      {mounted && showDetailsForm && !isPaying && createPortal(modal, document.body)}

      {status.message && (
        <p role="status" className={`text-xs leading-relaxed ${status.type === 'error' ? 'text-rose-700' : 'text-emerald-700'}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}