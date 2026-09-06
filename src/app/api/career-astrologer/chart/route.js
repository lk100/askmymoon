import { NextResponse } from 'next/server';
import { fetchCareerChart, getCareerChartFingerprint } from '@/lib/careerAstrology';
import { createCareerChartToken } from '@/lib/careerChartToken';
import { CAREER_VISITOR_COOKIE, getStoredChart, getVisitorId, saveChartSession } from '@/lib/careerAstrologerStore';

export async function POST(request) {
  try {
    const details = await request.json();
    const chartFingerprint = getCareerChartFingerprint(details);
    const chart = await getStoredChart(chartFingerprint) || await fetchCareerChart(details);
    const visitor = getVisitorId(request);
    const session = await saveChartSession(visitor.id, chart);
    const response = NextResponse.json({
      chart,
      chartId: chartFingerprint,
      chartToken: createCareerChartToken(chart),
      previousFreeQuestion: session.freeQuestion,
    });
    if (visitor.isNew) {
      response.cookies.set(CAREER_VISITOR_COOKIE, visitor.id, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to calculate the career chart.' }, { status: 400 });
  }
}