import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthedUser } from '@/lib/supabaseServer';

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase is not configured.');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { rating, reviewText } = await request.json();

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'A rating between 1 and 5 is required.' }, { status: 400 });
    }
    if (!reviewText || !reviewText.trim()) {
      return NextResponse.json({ error: 'Review text is required.' }, { status: 400 });
    }
    if (reviewText.trim().length > 2000) {
      return NextResponse.json({ error: 'Review text is too long.' }, { status: 400 });
    }

    // Reviews are allowed anonymously too — user_id is nullable. If logged
    // in, we attach it so we know who wrote it; not required to submit.
    const user = await getAuthedUser().catch(() => null);

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('astrologer_reviews').insert({
      user_id: user?.id || null,
      rating: numericRating,
      review_text: reviewText.trim(),
      status: 'pending',
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save review:', error);
    return NextResponse.json({ error: 'Unable to save your review right now.' }, { status: 500 });
  }
}