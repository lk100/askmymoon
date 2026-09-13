import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthedUser } from '@/lib/supabaseServer';

// Force this route to always run fresh — never cached by Next.js's Data
// Cache or by Vercel's edge/CDN. Without this, a logged-in user's
// free-question status can get cached and served to other requests/users,
// or served stale after they claim it.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase is not configured.');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Lightweight check: has this logged-in user EVER claimed their one global
// free question, across any chart/astrologer/device? Does not create or
// touch any chart — purely a read, safe to call from a listing page.
export async function GET() {
  const user = await getAuthedUser();

  if (!user) {
    return NextResponse.json(
      { freeQuestionUsed: false },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('astrologer_free_claims')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { freeQuestionUsed: Boolean(data) },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('free-status check failed:', error);
    // Fail safe: if the check itself breaks, don't block the page —
    // just fall back to showing the free badge.
    return NextResponse.json(
      { freeQuestionUsed: false },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}