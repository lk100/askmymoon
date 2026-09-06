    import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const CAREER_VISITOR_COOKIE = 'career_visitor_id';

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase is not configured.');
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getVisitorId(request) {
  const existingId = request.cookies.get(CAREER_VISITOR_COOKIE)?.value;
  if (existingId && /^[0-9a-f-]{36}$/i.test(existingId)) {
    return { id: existingId, isNew: false };
  }

  return { id: crypto.randomUUID(), isNew: true };
}

export function getChartFingerprint(chart) {
  if (chart?._chartFingerprint) return chart._chartFingerprint;
  return crypto.createHash('sha256').update(JSON.stringify(chart)).digest('hex');
}

export async function getStoredChart(chartFingerprint) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('career_chart_sessions')
    .select('chart_data')
    .eq('chart_fingerprint', chartFingerprint)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Unable to load saved career chart: ${error.message}`);
  return data?.chart_data || null;
}

export async function saveChartSession(visitorId, chart) {
  const supabase = getSupabaseAdmin();
  const chartFingerprint = getChartFingerprint(chart);
  const { data, error } = await supabase
    .from('career_chart_sessions')
    .upsert({
      visitor_id: visitorId,
      chart_fingerprint: chartFingerprint,
      chart_data: chart,
    }, { onConflict: 'visitor_id,chart_fingerprint' })
    .select('id, free_question_used')
    .single();

  if (error) throw new Error(`Unable to save chart session: ${error.message}`);

  let freeQuestion = null;
  if (data.free_question_used) {
    const { data: savedQuestion, error: questionError } = await supabase
      .from('career_questions')
      .select('question, answer')
      .eq('session_id', data.id)
      .eq('payment_status', 'free')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (questionError) throw new Error(`Unable to load previous career question: ${questionError.message}`);
    freeQuestion = savedQuestion;
  }

  return { ...data, freeQuestion };
}

export async function claimFreeQuestion(visitorId, chart) {
  const supabase = getSupabaseAdmin();
  const chartFingerprint = getChartFingerprint(chart);
  const { data: session, error: sessionError } = await supabase
    .from('career_chart_sessions')
    .select('id')
    .eq('visitor_id', visitorId)
    .eq('chart_fingerprint', chartFingerprint)
    .maybeSingle();

  if (sessionError) throw new Error(`Unable to find chart session: ${sessionError.message}`);
  if (!session) return null;

  const { data: claimed, error: claimError } = await supabase
    .from('career_chart_sessions')
    .update({ free_question_used: true, updated_at: new Date().toISOString() })
    .eq('id', session.id)
    .eq('free_question_used', false)
    .select('id')
    .maybeSingle();

  if (claimError) throw new Error(`Unable to claim free question: ${claimError.message}`);
  return claimed?.id ? session.id : null;
}

export async function releaseFreeQuestion(sessionId) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from('career_chart_sessions')
    .update({ free_question_used: false, updated_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('free_question_used', true);
}

export async function recordCareerQuestion({ sessionId, question, answer, provider }) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('career_questions').insert({
    session_id: sessionId,
    question,
    answer,
    amount: 0,
    currency: 'INR',
    payment_status: 'free',
    provider,
  });

  if (error) throw new Error(`Unable to save career question: ${error.message}`);
}