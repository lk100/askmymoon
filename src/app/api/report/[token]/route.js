import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function isConfiguredSecret(value) {
  return typeof value === 'string' && value.trim() && !value.trim().startsWith('your_');
}

export async function GET(request, { params }) {
  try {
    const { token } = await params;
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json({ error: 'Invalid report link.' }, { status: 400 });
    }

    if (!process.env.SUPABASE_URL || !isConfiguredSecret(process.env.SUPABASE_SERVICE_KEY)) {
      return NextResponse.json({ error: 'Report storage is not configured.' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { data, error } = await supabase
      .from('paid_reports')
      .select('name, report_data')
      .eq('report_token', token)
      .maybeSingle();

    if (error) {
      console.error('Supabase report lookup failed:', error);
      return NextResponse.json({ error: 'Unable to load the report.' }, { status: 500 });
    }
    if (!data?.report_data || typeof data.report_data !== 'object') {
      return NextResponse.json({ error: 'Report link not found.' }, { status: 404 });
    }

    return NextResponse.json({ name: data.name, reportData: data.report_data });
  } catch (error) {
    console.error('Report lookup failed:', error);
    return NextResponse.json({ error: 'Unable to load the report.' }, { status: 500 });
  }
}