'use client';

import { useEffect, useState } from 'react';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function getClientCountry() {
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
  const [details, setDetails] = useState({
    email: '',
    phone: '',
  });
  const [isPaying, setIsPaying] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

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
    if (!pricing || isPaying) return;
    if (!details.email.trim() || !details.phone.trim() || reportData === undefined) {
      setStatus({ type: 'error', message: 'Please enter your email and phone number.' });
      return;
    }
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setStatus({ type: 'error', message: 'Payment is not configured yet.' });
      return;
    }

    setIsPaying(true);
    setStatus({ type: '', message: '' });

    try {
      const clientCountry = getClientCountry();
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-client-country': clientCountry },
        body: JSON.stringify({ amount: pricing.amount, currency: pricing.currency }),
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
        prefill: { name: userName, email: details.email, contact: details.phone },
        handler: async (response) => {
          try {
            const verificationResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                userEmail: details.email,
                userName,
                userPhone: details.phone,
                amount: pricing.amount,
                currency: pricing.currency,
              }),
            });
            const result = await verificationResponse.json();
            if (!verificationResponse.ok) throw new Error(result.error || 'Payment verification failed.');

            setShowDetailsForm(false);
            setStatus({ type: 'success', message: 'Payment confirmed. Your full report is now unlocked.' });
            onSuccess?.({ ...result, contact: details });
          } catch (error) {
            setStatus({ type: 'error', message: error.message });
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
        theme: { color: '#92400e' },
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

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setShowDetailsForm(true)}
        disabled={isLoadingPricing || isPaying || !pricing}
        className="w-full rounded-xl bg-amber-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPaying ? 'Processing payment...' : isLoadingPricing ? 'Loading price...' : `Get Full Report · ${pricing?.displayPrice || ''}`}
      </button>
      {showDetailsForm && !isPaying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-labelledby="payment-details-title">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-900/15 bg-white p-5 shadow-2xl sm:p-6">
            <button
              type="button"
              onClick={() => setShowDetailsForm(false)}
              className="absolute right-4 top-3 text-2xl leading-none text-slate-400 hover:text-slate-700"
              aria-label="Close payment details"
            >
              ×
            </button>
            <h3 id="payment-details-title" className="text-lg font-bold text-slate-900">Unlock your full report</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">Enter your contact details to receive the report after payment.</p>
            <form onSubmit={handlePayment} className="mt-5 space-y-3">
              <input
                required
                type="email"
                placeholder="Email address"
                value={details.email}
                onChange={(event) => setDetails({ ...details, email: event.target.value })}
                className="w-full rounded-lg border border-amber-900/15 bg-[#FAF6F0] px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-800"
              />
              <input
                required
                type="tel"
                placeholder="Phone number"
                value={details.phone}
                onChange={(event) => setDetails({ ...details, phone: event.target.value })}
                className="w-full rounded-lg border border-amber-900/15 bg-[#FAF6F0] px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-800"
              />
              <button type="submit" disabled={!pricing} className="w-full rounded-xl bg-amber-800 px-5 py-3 text-sm font-bold text-white hover:bg-amber-900 disabled:opacity-60">
                Continue to secure payment · {pricing?.displayPrice || ''}
              </button>
            </form>
          </div>
        </div>
      )}
      {status.message && (
        <p role="status" className={`text-xs leading-relaxed ${status.type === 'error' ? 'text-rose-700' : 'text-emerald-700'}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
