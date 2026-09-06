import { NextResponse } from 'next/server';
import { readCareerChartToken } from '@/lib/careerChartToken';
import { getVisitorId, claimFreeQuestion, releaseFreeQuestion, recordCareerQuestion } from '@/lib/careerAstrologerStore';

const fallbackAnswer = 'Your chart is ready for a focused career reading. The strongest guidance will come from connecting your ascendant and planetary placements to one specific work decision. Start with the career question that matters most right now.';

export async function POST(request) {
  try {
    const { question, chartToken } = await request.json();
    if (!question?.trim() || !chartToken) {
      return NextResponse.json({ error: 'A question and chart token are required.' }, { status: 400 });
    }
    const chart = readCareerChartToken(chartToken);
    const visitor = getVisitorId(request);
    if (visitor.isNew) return NextResponse.json({ error: 'Create the chart before asking a question.' }, { status: 400 });
    const sessionId = await claimFreeQuestion(visitor.id, chart);
    if (!sessionId) {
      return NextResponse.json({ error: 'Your free question for this chart has already been used. Please complete payment for the next question.' }, { status: 402 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      await recordCareerQuestion({ sessionId, question: question.trim(), answer: fallbackAnswer, provider: 'local' });
      return NextResponse.json({ answer: fallbackAnswer, provider: 'local' });
    }

    const prompt = [
      'You are a careful career astrologer. Interpret the provided calculated astrology data; do not recalculate planetary positions.',
      'Give practical, specific, compassionate guidance. Avoid certainty, fear, medical/legal/financial guarantees, and superstition-based pressure. Keep the answer under 220 words.',
      `User question: ${question.trim()}`,
      `Calculated astrology chart: ${JSON.stringify(chart).slice(0, 24000)}`,
    ].join('\n\n');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await response.json();
    if (!response.ok) {
      await releaseFreeQuestion(sessionId);
      return NextResponse.json({ error: data?.error?.message || 'The astrologer is temporarily unavailable.' }, { status: 502 });
    }
    const answer = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join('\n')?.trim();
    const finalAnswer = answer || fallbackAnswer;
    await recordCareerQuestion({ sessionId, question: question.trim(), answer: finalAnswer, provider: 'gemini' });
    return NextResponse.json({ answer: finalAnswer, provider: 'gemini' });
  } catch (error) {
    console.error('Career astrologer request failed:', error);
    return NextResponse.json({ error: 'Unable to generate an answer right now.' }, { status: 500 });
  }
}