import { NextResponse } from 'next/server';
import { fetchAstrologerChart, getAstrologerChartFingerprint } from '@/lib/astrologerData';
import { createAstrologerChartToken } from '@/lib/astrologerChartToken';
import { isValidCategory, getCategoryConfig } from '@/lib/astrologerCategories';
import { getStoredChart, saveChartSession, getRemainingPaidQuestions } from '@/lib/astrologerStore';
import { getAuthedUser } from '@/lib/supabaseServer';
import crypto from 'node:crypto';

function getBirthFingerprint({ dob, time, lat, lon, timeZone }) {
  return crypto.createHash('sha256')
    .update(JSON.stringify({ dob, time, lat: Number(lat), lon: Number(lon), timeZone }))
    .digest('hex');
}

export async function POST(request) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to continue.', requiresAuth: true }, { status: 401 });
    }

    const details = await request.json();
    const { category } = details;
    if (!category || !isValidCategory(category)) {
      return NextResponse.json({ error: 'A valid astrologer category is required.' }, { status: 400 });
    }
    const { lens } = getCategoryConfig(category);

    const chartFingerprint = getAstrologerChartFingerprint({ ...details, lens });
    const chart = (await getStoredChart(chartFingerprint, lens)) || (await fetchAstrologerChart({ ...details, lens }));
    chart._chartFingerprint = getBirthFingerprint(details);

    const session = await saveChartSession(user.id, chart, lens);
    // Paid credits are user-wide now, not scoped to this chart's fingerprint.
    const remainingPaid = await getRemainingPaidQuestions(user.id);

    return NextResponse.json({
      chart,
      chartId: chartFingerprint,
      chartToken: createAstrologerChartToken(chart),
      previousFreeQuestion: session.freeQuestion,
      freeQuestionUsed: session.freeQuestionUsed,
      freeQuestionUsedElsewhere: session.freeQuestionUsedElsewhere,
      remainingPaid,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to calculate the astrology chart.' }, { status: 400 });
  }
}