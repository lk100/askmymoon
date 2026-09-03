import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_PRICES = {
  INR: 4900,
  USD: 100,
};

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isConfiguredSecret(value) {
  return isNonEmptyString(value) && !value.trim().startsWith('your_');
}

function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function hasValidSignature(paymentId, orderId, signature) {
  if (!isNonEmptyString(process.env.RAZORPAY_KEY_SECRET)) return false;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const expected = Buffer.from(expectedSignature, 'utf8');
  const received = Buffer.from(signature, 'utf8');
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const {
      paymentId,
      orderId,
      signature,
      email,
      userEmail,
      userName,
      phone,
      userPhone,
      amount,
      currency,
    } = payload || {};

    const submittedEmail = email || userEmail;
    const submittedPhone = phone || userPhone;
    const safeEmail = isValidEmail(submittedEmail) ? submittedEmail.trim() : null;
    const safePhone = isNonEmptyString(submittedPhone) ? submittedPhone.trim() : null;
    const safeName = isNonEmptyString(userName) ? userName.trim() : 'Customer';

    if (
      !isNonEmptyString(paymentId) ||
      !isNonEmptyString(orderId) ||
      !isNonEmptyString(signature) ||
      !safeEmail ||
      !safePhone ||
      !Number.isInteger(amount) ||
      !Object.hasOwn(ALLOWED_PRICES, currency) ||
      amount !== ALLOWED_PRICES[currency]
    ) {
      return NextResponse.json({ error: 'Invalid payment payload.' }, { status: 400 });
    }

    if (!hasValidSignature(paymentId, orderId, signature)) {
      return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 });
    }

    if (!isValidHttpUrl(process.env.SUPABASE_URL) || !isConfiguredSecret(process.env.SUPABASE_SERVICE_KEY)) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.local.' },
        { status: 500 }
      );
    }
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const createdAt = new Date().toISOString();
    const paidAmount = amount / 100;
    const reportRow = {
      payment_id: paymentId,
      order_id: orderId,
      email: safeEmail,
      phone: safePhone,
      name: safeName,
      amount: paidAmount,
      currency,
      report_data: {},
      created_at: createdAt,
    };
    let { error: insertError } = await supabase.from('paid_reports').upsert(reportRow, { onConflict: 'payment_id' });

    if (insertError?.code === 'PGRST204' && insertError.message.includes("'order_id' column")) {
      const { order_id: unusedOrderId, ...legacyReportRow } = reportRow;
      ({ error: insertError } = await supabase.from('paid_reports').upsert(legacyReportRow, { onConflict: 'payment_id' }));
    }

    if (insertError) {
      console.error('Supabase paid_reports insert failed:', insertError);
      return NextResponse.json(
        {
          error: process.env.NODE_ENV === 'development'
            ? `Supabase insert failed: ${insertError.message}`
            : 'Unable to save the verified payment.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Unable to verify payment and save the report.' }, { status: 500 });
  }
}
