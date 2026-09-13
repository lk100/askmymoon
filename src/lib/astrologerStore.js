import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseServer } from '@/lib/supabaseServer';

const CHART_SESSIONS_TABLE = 'astrologer_chart_sessions';
const QUESTIONS_TABLE = 'astrologer_questions';
const FREE_CLAIMS_TABLE = 'astrologer_free_claims';

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase is not configured.');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Returns the logged-in Supabase Auth user for this request, or null if not
 * signed in. Identity is a real account (email OTP), not a browser cookie —
 * free-question status and paid credits are correctly shared across devices
 * for the same person.
 */
export async function getAuthedUser() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

const SHA256_HEX_RE = /^[0-9a-f]{64}$/i;

export function getChartFingerprint(chart) {
  // Only trust an existing _chartFingerprint if it actually looks like a
  // sha256 hex digest. Guards against bad data upstream (e.g. a lens/category
  // string like "career" ending up in this field) causing a UUID column
  // error or, worse, silently merging distinct charts' fingerprints.
  if (typeof chart?._chartFingerprint === 'string' && SHA256_HEX_RE.test(chart._chartFingerprint)) {
    return chart._chartFingerprint;
  }
  return crypto.createHash('sha256').update(JSON.stringify(chart)).digest('hex');
}

export async function getStoredChart(chartFingerprint, astrologer) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(CHART_SESSIONS_TABLE)
    .select('chart_data')
    .eq('chart_fingerprint', chartFingerprint)
    .eq('astrologer', astrologer)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Unable to load saved chart: ${error.message}`);
  return data?.chart_data || null;
}

/**
 * Saves/updates the per-astrologer chart session (chat thread) and reports
 * whether the GLOBAL free question (one per logged-in user — NOT per birth
 * chart — shared across all charts, all 4 astrologers, and all devices) has
 * already been used.
 *
 * Returns:
 *   - id: this astrologer's chart_sessions row id
 *   - freeQuestionUsed: true if the free question has been used anywhere
 *   - freeQuestionUsedElsewhere: true if it was used under a DIFFERENT
 *       chart_session than the one being loaded right now (could be a
 *       different chart, a different astrologer, or both) — so the frontend
 *       shouldn't try to show that Q&A here
 *   - freeQuestion: { question, answer } if it was used on THIS exact
 *       chart_session (same chart + same astrologer)
 */
export async function saveChartSession(userId, chart, astrologer) {
  const supabase = getSupabaseAdmin();
  const chartFingerprint = getChartFingerprint(chart);

  const { data, error } = await supabase
    .from(CHART_SESSIONS_TABLE)
    .upsert({
      user_id: userId,
      chart_fingerprint: chartFingerprint,
      chart_data: chart,
      astrologer,
    }, { onConflict: 'user_id,astrologer,chart_fingerprint' })
    .select('id')
    .single();

  if (error) throw new Error(`Unable to save chart session: ${error.message}`);

  // Free question is scoped to the USER only (one per logged-in account,
  // no matter how many birth charts they create or which astrologer they
  // ask). Lookup is by user_id alone, not chart_fingerprint.
  const { data: claim, error: claimError } = await supabase
    .from(FREE_CLAIMS_TABLE)
    .select('session_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (claimError) throw new Error(`Unable to check free question status: ${claimError.message}`);

  let freeQuestion = null;
  let freeQuestionUsedElsewhere = false;

  if (claim) {
    if (claim.session_id === data.id) {
      const { data: savedQuestion, error: questionError } = await supabase
        .from(QUESTIONS_TABLE)
        .select('question, answer')
        .eq('session_id', data.id)
        .eq('payment_status', 'free')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (questionError) throw new Error(`Unable to load previous question: ${questionError.message}`);
      freeQuestion = savedQuestion;
    } else {
      // Used on a different chart_session — could be a different chart, a
      // different astrologer, or both. Either way, not shown here.
      freeQuestionUsedElsewhere = true;
    }
  }

  return {
    id: data.id,
    freeQuestionUsed: Boolean(claim),
    freeQuestionUsedElsewhere,
    freeQuestion,
  };
}

export async function getSessionIdForChart(userId, chart, astrologer) {
  const supabase = getSupabaseAdmin();
  const chartFingerprint = getChartFingerprint(chart);
  const { data, error } = await supabase
    .from(CHART_SESSIONS_TABLE)
    .select('id')
    .eq('user_id', userId)
    .eq('astrologer', astrologer)
    .eq('chart_fingerprint', chartFingerprint)
    .maybeSingle();

  if (error) throw new Error(`Unable to find chart session: ${error.message}`);
  return data?.id || null;
}

/**
 * Claims the single global free question for this logged-in user, regardless
 * of which chart, astrologer/category, or device is asking.
 *
 * IMPORTANT: this does NOT rely solely on a DB unique constraint anymore.
 * We first explicitly check for an existing claim row for this user_id and
 * bail out if one exists — this is what actually enforces "one free
 * question per user" at the application level. The insert's `23505` handler
 * below is kept only as a fallback for the rare concurrent-request race; the
 * real correctness guarantee should come from a `unique (user_id)`
 * constraint on astrologer_free_claims (see migration notes). Do NOT assume
 * that constraint is scoped to (user_id, chart_fingerprint) — if it is, this
 * whole scheme breaks, because a new chart gets a new fingerprint and the
 * insert will silently succeed a second time.
 *
 * `chartFingerprint` is still stored on the claim row for reference (which
 * chart the free question was spent on), but is NOT part of the uniqueness
 * check — the check is on user_id alone.
 *
 * `sessionId` is the chart_sessions row id for the astrologer currently
 * asking; stored so a later visit to that same chart+astrologer can show
 * the free Q&A back to the user.
 *
 * Returns the free-claim row id on success, or null if already claimed
 * (by this user, on any chart, astrologer, or device).
 */
export async function claimFreeQuestion(userId, chartFingerprint, sessionId) {
  const supabase = getSupabaseAdmin();

  // Explicit application-level check — this is the real guard now.
  const { data: existing, error: existingError } = await supabase
    .from(FREE_CLAIMS_TABLE)
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingError) throw new Error(`Unable to check free question status: ${existingError.message}`);
  if (existing) return null; // already claimed by this user — any chart, any device

  const { data, error } = await supabase
    .from(FREE_CLAIMS_TABLE)
    .insert({ user_id: userId, chart_fingerprint: chartFingerprint, session_id: sessionId })
    .select('id')
    .maybeSingle();

  if (error) {
    // Fallback safety net for a concurrent-request race between the select
    // above and this insert. Only correct if the unique constraint is on
    // user_id alone — see migration notes.
    if (error.code === '23505') return null;
    throw new Error(`Unable to claim free question: ${error.message}`);
  }
  return data?.id || null;
}

/**
 * Releases this user's free-question claim (e.g. if generating the answer
 * failed after the claim was taken). Scoped to user_id only — there is at
 * most one claim row per user.
 */
export async function releaseFreeQuestion(userId) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from(FREE_CLAIMS_TABLE)
    .delete()
    .eq('user_id', userId);

  if (error) throw new Error(`Unable to release free question: ${error.message}`);
}

export async function recordQuestion({ sessionId, question, answer, provider, astrologer, paymentStatus = 'free' }) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(QUESTIONS_TABLE).insert({
    session_id: sessionId,
    question,
    answer,
    amount: 0,
    currency: 'INR',
    payment_status: paymentStatus,
    provider,
    astrologer,
  });

  if (error) throw new Error(`Unable to save question: ${error.message}`);
}

const PAID_QUESTION_TYPES = ['career-question', 'career-question-bundle'];

/**
 * Claims one credit from the oldest payment for this logged-in user that
 * still has unused credits. Scoped to the USER only (not chart_fingerprint
 * or astrologer/lens) — a bundle bought under any chart or category can be
 * spent on any other chart or category too, and is portable across devices.
 */
export async function claimPaidQuestion(userId) {
  const supabase = getSupabaseAdmin();
  const { data: payments, error: paymentError } = await supabase
    .from('paid_reports')
    .select('id, career_credits_total, career_credits_used')
    .eq('user_id', userId)
    .in('report_data->>type', PAID_QUESTION_TYPES)
    .order('created_at', { ascending: true });

  if (paymentError) throw new Error(`Unable to load paid questions: ${paymentError.message}`);

  const payment = payments?.find((item) => item.career_credits_used < item.career_credits_total);
  if (!payment) return null;

  const { data: claimed, error: claimError } = await supabase
    .from('paid_reports')
    .update({ career_credits_used: payment.career_credits_used + 1 })
    .eq('id', payment.id)
    .eq('career_credits_used', payment.career_credits_used)
    .select('id')
    .maybeSingle();

  if (claimError) throw new Error(`Unable to claim paid question: ${claimError.message}`);
  return claimed?.id ? payment.id : null;
}

export async function releasePaidQuestion(paymentId) {
  const supabase = getSupabaseAdmin();
  const { data: payment, error: fetchError } = await supabase
    .from('paid_reports')
    .select('career_credits_used')
    .eq('id', paymentId)
    .maybeSingle();

  if (fetchError) throw new Error(`Unable to load payment to release: ${fetchError.message}`);
  if (!payment || payment.career_credits_used <= 0) return;

  const { error } = await supabase
    .from('paid_reports')
    .update({ career_credits_used: payment.career_credits_used - 1 })
    .eq('id', paymentId)
    .eq('career_credits_used', payment.career_credits_used);

  if (error) throw new Error(`Unable to release paid question: ${error.message}`);
}

/**
 * Total questions asked for this birth chart, across ALL astrologer
 * categories (career, love-marriage, business-money, health-family) —
 * i.e. every astrologer_questions row whose session belongs to any
 * chart_sessions row sharing this (user, chart_fingerprint). This is a
 * per-chart DISPLAY stat only — it does not gate access to anything, so it's
 * left scoped to the chart rather than made user-wide.
 *
 * Returns { total, free, paid } counts.
 */
export async function getQuestionUsageForChart(userId, chartFingerprint) {
  const supabase = getSupabaseAdmin();

  const { data: sessions, error: sessionsError } = await supabase
    .from(CHART_SESSIONS_TABLE)
    .select('id')
    .eq('user_id', userId)
    .eq('chart_fingerprint', chartFingerprint);

  if (sessionsError) throw new Error(`Unable to load chart sessions: ${sessionsError.message}`);

  const sessionIds = (sessions || []).map((row) => row.id);
  if (sessionIds.length === 0) return { total: 0, free: 0, paid: 0 };

  const { data: questions, error: questionsError } = await supabase
    .from(QUESTIONS_TABLE)
    .select('payment_status')
    .in('session_id', sessionIds);

  if (questionsError) throw new Error(`Unable to load question usage: ${questionsError.message}`);

  const total = questions?.length || 0;
  const free = questions?.filter((q) => q.payment_status === 'free').length || 0;
  const paid = total - free;

  return { total, free, paid };
}

/**
 * Total paid credits remaining for this logged-in user, summed across every
 * payment (single questions and bundles), regardless of which chart,
 * astrologer/category, or device they were purchased on. Useful for showing
 * an accurate "X questions remaining" figure anywhere in the app.
 */
export async function getRemainingPaidQuestions(userId) {
  const supabase = getSupabaseAdmin();
  const { data: payments, error } = await supabase
    .from('paid_reports')
    .select('career_credits_total, career_credits_used')
    .eq('user_id', userId)
    .in('report_data->>type', PAID_QUESTION_TYPES);

  if (error) throw new Error(`Unable to load paid questions: ${error.message}`);

  return (payments || [])
    .reduce((sum, item) => sum + Math.max(0, item.career_credits_total - item.career_credits_used), 0);
}