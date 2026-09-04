import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(_request, { params }) {
  const { token } = params;
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid link.' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data, error } = await supabase
    .from('paid_reports')
    .select('name, report_data, created_at')
    .eq('report_token', token)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  }

  return NextResponse.json({ name: data.name, reportData: data.report_data, createdAt: data.created_at });
}