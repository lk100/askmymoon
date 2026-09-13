import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthedUser, getChartFingerprint } from '@/lib/astrologerStore';

const ALLOWED_PRICES = {
  domain_report: { INR: 4900, USD: 100 },
  ai_astrologer: { INR: 3900, USD: 49 },
  ai_astrologer_bundle_5: { INR: 12100, USD: 149 },
};

// How many career-question credits each product grants when paid for.
const CAREER_CREDITS = {
  ai_astrologer: 1,
  ai_astrologer_bundle_5: 5,
};

const PAID_QUESTION_TYPES = ['career-question', 'career-question-bundle'];

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
    // Require a logged-in user before accepting any payment — credits get
    // tied to the real account (auth.users.id), not a browser cookie, so
    // they're portable across devices and can't be spoofed by clearing
    // cookies.
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to continue.', requiresAuth: true }, { status: 401 });
    }

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
      product = 'domain_report',
      reportData,
    } = payload || {};

    const submittedEmail = email || userEmail;
    // Phone is no longer collected anywhere in the auth/checkout flow (login
    // is email-OTP based, not phone-based), so it's optional here — we still
    // store it if a caller happens to send one, but never require it.
    const submittedPhone = phone || userPhone;
    const safeEmail = isValidEmail(submittedEmail) ? submittedEmail.trim() : null;
    const safePhone = isNonEmptyString(submittedPhone) ? submittedPhone.trim() : null;
    const safeName = isNonEmptyString(userName) ? userName.trim() : 'Customer';

    const productPrices = ALLOWED_PRICES[product];

    if (
      !isNonEmptyString(paymentId) ||
      !isNonEmptyString(orderId) ||
      !isNonEmptyString(signature) ||
      !safeEmail ||
      !Number.isInteger(amount) ||
      !productPrices ||
      !Object.hasOwn(productPrices, currency) ||
      amount !== productPrices[currency]
    ) {
      // TEMPORARY DIAGNOSTIC — logs exactly which check failed instead of
      // just returning the generic message. Remove once the real cause is
      // confirmed and fixed.
      console.error('verify-payment validation failed:', {
        hasPaymentId: isNonEmptyString(paymentId),
        hasOrderId: isNonEmptyString(orderId),
        hasSignature: isNonEmptyString(signature),
        submittedEmail,
        safeEmail,
        submittedPhone,
        safePhone,
        amount,
        amountIsInteger: Number.isInteger(amount),
        currency,
        product,
        productPrices,
        expectedAmount: productPrices?.[currency],
        amountMatchesExpected: productPrices ? amount === productPrices[currency] : null,
      });
      return NextResponse.json({ error: 'Invalid payment payload.' }, { status: 400 });
    }

    if (!reportData || typeof reportData !== 'object' || Array.isArray(reportData)) {
      return NextResponse.json({ error: 'Report data is required.' }, { status: 400 });
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
    const careerCreditsTotal = CAREER_CREDITS[product] || 0;

    // Pull the chart's identity fingerprint out of reportData and store it as
    // its own indexed column, not just buried in the report_data JSONB. Kept
    // for record-keeping / auditing, even though credits are now claimed and
    // summed user-wide rather than filtered by this value.
    const chartFingerprint = reportData?.chart
      ? getChartFingerprint(reportData.chart)
      : null;

    const reportRow = {
      payment_id: paymentId,
      order_id: orderId,
      user_id: user.id,
      email: safeEmail,
      phone: safePhone,
      name: safeName,
      amount: paidAmount,
      currency,
      report_data: reportData,
      report_token: crypto.randomBytes(32).toString('hex'),
      created_at: createdAt,
      career_credits_total: careerCreditsTotal,
      career_credits_used: 0,
      chart_fingerprint: chartFingerprint,
      product,
    };

    let { error: insertError } = await supabase.from('paid_reports').upsert(reportRow, { onConflict: 'payment_id' });

    if (insertError?.code === 'PGRST204' && insertError.message.includes("'order_id' column")) {
      const { order_id: unusedOrderId, ...legacyReportRow } = reportRow;
      ({ error: insertError } = await supabase.from('paid_reports').upsert(legacyReportRow, { onConflict: 'payment_id' }));
    }

    if (insertError?.code === 'PGRST204' && insertError.message.includes("'user_id' column")) {
      const { user_id: unusedUserId, ...legacyReportRow } = reportRow;
      ({ error: insertError } = await supabase.from('paid_reports').upsert(legacyReportRow, { onConflict: 'payment_id' }));
    }

    // Some deployments may not have run the career_credits migration yet — retry
    // without those columns so payment verification still succeeds.
    if (insertError?.code === 'PGRST204' && insertError.message.includes('career_credits')) {
      const { career_credits_total: unusedTotal, career_credits_used: unusedUsed, ...legacyReportRow } = reportRow;
      ({ error: insertError } = await supabase.from('paid_reports').upsert(legacyReportRow, { onConflict: 'payment_id' }));
    }

    // Same fallback pattern for deployments that haven't run the
    // chart_fingerprint migration yet.
    if (insertError?.code === 'PGRST204' && insertError.message.includes('chart_fingerprint')) {
      const { chart_fingerprint: unusedFingerprint, ...legacyReportRow } = reportRow;
      ({ error: insertError } = await supabase.from('paid_reports').upsert(legacyReportRow, { onConflict: 'payment_id' }));
    }

    // Same fallback pattern for deployments that haven't run the
    // product-column migration yet.
    if (insertError?.code === 'PGRST204' && insertError.message.includes("'product' column")) {
      const { product: unusedProduct, ...legacyReportRow } = reportRow;
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

    const { data: savedReport, error: tokenError } = await supabase
      .from('paid_reports')
      .select('report_token')
      .eq('payment_id', paymentId)
      .maybeSingle();

    if (tokenError || !savedReport?.report_token) {
      console.error('Supabase report token lookup failed:', tokenError);
      return NextResponse.json({ error: 'Unable to create the report link.' }, { status: 500 });
    }

    // Return the DB-authoritative remaining/used question counts for this
    // logged-in user (summed across every payment, every chart, every
    // astrologer category, and every device) so the frontend's onSuccess
    // handler can use this directly instead of guessing with local
    // arithmetic or making a second request.
    let remainingPaid = null;
    let questionsUsed = null;
    {
      const { data: payments, error: sumError } = await supabase
        .from('paid_reports')
        .select('career_credits_total, career_credits_used')
        .eq('user_id', user.id)
        .in('report_data->>type', PAID_QUESTION_TYPES);

      if (!sumError && payments) {
        remainingPaid = payments.reduce(
          (sum, row) => sum + Math.max(0, (row.career_credits_total || 0) - (row.career_credits_used || 0)),
          0
        );
        questionsUsed = payments.reduce((sum, row) => sum + (row.career_credits_used || 0), 0);
      } else if (sumError) {
        console.error('Unable to compute remaining paid questions:', sumError);
      }
    }

    return NextResponse.json({
      success: true,
      reportToken: savedReport.report_token,
      remainingPaid,
      questionsUsed,
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Unable to verify payment and save the report.' }, { status: 500 });
  }
}