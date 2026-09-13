// lib/supabaseServer.js
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // ignore when called from a context that can't set cookies
          }
        },
      },
    }
  );
}

// Returns the logged-in user, or null.
export async function getAuthedUser() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}