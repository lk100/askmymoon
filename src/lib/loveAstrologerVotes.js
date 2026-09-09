import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const LOVE_VOTER_COOKIE = 'love_astro_voter_id';

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase is not configured.');
  }

  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getVoterId(request) {
  const existingId = request.cookies.get(LOVE_VOTER_COOKIE)?.value;
  if (existingId && /^[0-9a-f-]{36}$/i.test(existingId)) {
    return { id: existingId, isNew: false };
  }

  return { id: crypto.randomUUID(), isNew: true };
}

export async function getVoteCount() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('love_astrologer_votes')
    .select('vote_count')
    .eq('id', 1)
    .single();

  if (error) throw new Error(`Unable to load vote count: ${error.message}`);
  return data.vote_count;
}

// Atomic increment via Postgres RPC so concurrent votes never clobber each other.
// Requires the SQL function below.
export async function incrementVoteCount() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('increment_love_astrologer_votes');

  if (error) throw new Error(`Unable to record vote: ${error.message}`);
  return data;
}