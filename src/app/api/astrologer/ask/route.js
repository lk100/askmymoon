import { NextResponse } from 'next/server';
import { readAstrologerChartToken } from '@/lib/astrologerChartToken';
import {
  getAuthedUser,
  getChartFingerprint,
  claimFreeQuestion,
  releaseFreeQuestion,
  claimPaidQuestion,
  releasePaidQuestion,
  recordQuestion,
  getSessionIdForChart,
  getQuestionUsageForChart,
  getRemainingPaidQuestions,
} from '@/lib/astrologerStore';

const FALLBACK_ANSWERS = {
  career: 'Your chart is ready for a focused career reading. The strongest guidance will come from connecting your ascendant and planetary placements to one specific work decision. Start with the career question that matters most right now.',
  'love-marriage': 'Your chart is ready for a focused relationship reading. The clearest guidance comes from connecting your 7th house and Venus placements to one specific relationship question at a time.',
  'business-money': 'Your chart is ready for a focused money reading. The clearest guidance comes from connecting your wealth and growth houses to one specific financial decision right now.',
  'health-family': 'Your chart is ready for a focused health and family reading. The clearest guidance comes from connecting your relevant houses to one specific situation at home right now.',
};

const LENS_LABELS = {
  career: 'career',
  'love-marriage': 'relationship',
  'business-money': 'business and money',
  'health-family': 'health and family',
};

function buildPrompt(question, chart, lens) {
  const lensLabel = LENS_LABELS[lens] || 'astrology';
  return [
    `You are an experienced Vedic astrologer talking one-on-one with a client about their ${lensLabel} question. Answer their question directly as your first line — no greeting, no chart recap, no summary at the end.`,
    `Step 1 (silent, don't show this): identify which house(s) in the data govern this ${lensLabel} question. Look at that house's "lord" and its "influences" array — each influence tells you the relation (placed_in_house, aspects_house, aspects_lord, conjunct_with_lord) and the planet's baladi_avastha (strength state: Bala/Kumara/Yuva = strong, Vriddha/Mrita = low energy). Pick the 2-3 influences that matter most for this question — prioritize conjunct_with_lord and placed_in_house over distant aspects, and weigh strong-state planets over low-energy ones.`,
    'Step 2: if the question is about timing ("when", "at what age", "which years"), use current_mahadasha, current_antardasha, and any dasha timeline fields present in the data to name the relevant period(s) — don\'t give exact dates, just the dasha/antardasha window.',
    `Step 3: write the answer. Every claim must trace back to a specific placement, aspect, or dasha period found in the data, synthesized with classic Vedic outcomes from Brihat Parashara Hora Shastra (BPHS) and Saravali for house lord placements and planetary combinations — no generic textbook meanings, and never invent a placement not present in the data.`,
    'Every time you name a planet or house, explain what it means in the same sentence, in plain words — e.g. "Rahu, the planet of ambition and unconventional routes, sits in your 10th house of career." Never leave an astrological term unexplained.',
    'CRITICAL RULE FOR PLANETARY STATES (BALADI AVASTHA): NEVER use Sanskrit terms (e.g. Mrita, Vriddha, Yuva, Kumara, Avastha) OR vague words like "tired" or "dead" that sound like AI jargon. Instead, describe the exact real-world impact in terms relevant to this topic: for low-energy states (Mrita/Vriddha), explain specific friction points; for peak-energy states (Yuva/Kumara), highlight clear momentum and strength.',
    'Write like a real person talking, not an essay: contractions, plain practical words, no unexplained jargon, no therapy-speak.',
    'Tone: warm and confident, like a mentor — not harsh, not overhyped, not vague.',
    'If they ask what to do, end with 1-2 concrete actions grounded in the chart\'s strengths.',
    'Only give dated timing if they ask "when" or "at what age" — and even then, name the dasha/antardasha window, not exact dates.',
    'Avoid certainty, fear, medical/legal/financial guarantees, and superstition-based pressure.',
    '100 to 220 words. Never mention being an AI.',
    'FORMATTING RULE: Never return a dense wall of text. Structure your response into 2-3 distinct paragraphs separated by double line breaks (\\n\\n). Use bold text for key insights or bullet points (* Item) if recommending action steps.',
    `User question: ${question}`,
    `Calculated astrology chart: ${JSON.stringify(chart).slice(0, 24000)}`,
  ].join('\n\n');
}

export async function POST(request) {
  try {
    const { question, chartToken, lens } = await request.json();
    if (!question?.trim() || !chartToken || !lens) {
      return NextResponse.json({ error: 'A question, chart token, and category are required.' }, { status: 400 });
    }

    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to continue.', requiresAuth: true }, { status: 401 });
    }

    const chart = readAstrologerChartToken(chartToken);
    const chartFingerprint = getChartFingerprint(chart);

    const sessionId = await getSessionIdForChart(user.id, chart, lens);
    if (!sessionId) {
      return NextResponse.json({ error: 'Create the chart before asking a question.' }, { status: 400 });
    }

    // The free question is global: one per logged-in user, shared across all
    // charts, astrologers/categories, and devices. Paid credits are likewise
    // shared user-wide now, across every chart and category.
    let isPaid = false;
    let freeClaimed = false;
    let paymentId = null;

    const freeClaimId = await claimFreeQuestion(user.id, chartFingerprint, sessionId);
    if (freeClaimId) {
      freeClaimed = true;
    } else {
      paymentId = await claimPaidQuestion(user.id);
      if (!paymentId) {
        return NextResponse.json(
          { error: 'No free or paid questions remaining. Please purchase more questions.' },
          { status: 402 }
        );
      }
      isPaid = true;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const fallbackAnswer = FALLBACK_ANSWERS[lens] || FALLBACK_ANSWERS.career;

    // No API key configured — return the fallback as a single "chunk" stream.
    if (!apiKey) {
      await recordQuestion({
        sessionId,
        question: question.trim(),
        answer: fallbackAnswer,
        provider: 'local',
        astrologer: lens,
        paymentStatus: isPaid ? 'paid' : 'free',
      });
      const usage = await getQuestionUsageForChart(user.id, chartFingerprint);
      const remainingPaid = await getRemainingPaidQuestions(user.id);
      const encoder = new TextEncoder();
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(JSON.stringify({ text: fallbackAnswer }) + '\n'));
          controller.enqueue(encoder.encode(JSON.stringify({ usage, remainingPaid }) + '\n'));
          controller.close();
        },
      });
      return new NextResponse(body, { headers: { 'Content-Type': 'application/x-ndjson' } });
    }

    const prompt = buildPrompt(question.trim(), chart, lens);
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!geminiResponse.ok || !geminiResponse.body) {
      const errData = await geminiResponse.json().catch(() => null);
      if (isPaid) await releasePaidQuestion(paymentId);
      else if (freeClaimed) await releaseFreeQuestion(user.id);
      return NextResponse.json(
        { error: errData?.error?.message || 'The astrologer is temporarily unavailable.' },
        { status: 502 }
      );
    }

    // Proxy Gemini's SSE stream, re-emitting as newline-delimited JSON { text } chunks
    // the frontend already knows how to parse. Accumulate the full answer to save once done.
    let fullAnswer = '';
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiResponse.body.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const jsonStr = trimmed.slice(5).trim();
              if (!jsonStr || jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const textPiece = parsed?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('') || '';
                if (textPiece) {
                  fullAnswer += textPiece;
                  controller.enqueue(encoder.encode(JSON.stringify({ text: textPiece }) + '\n'));
                }
              } catch {
                // ignore malformed SSE fragments
              }
            }
          }

          const finalAnswer = fullAnswer.trim() || fallbackAnswer;
          await recordQuestion({
            sessionId,
            question: question.trim(),
            answer: finalAnswer,
            provider: `gemini:${model}`,
            astrologer: lens,
            paymentStatus: isPaid ? 'paid' : 'free',
          });

          // Final line, separate from the {text} chunks: lets the frontend
          // show "X questions used" / "Y remaining" without a second request.
          const usage = await getQuestionUsageForChart(user.id, chartFingerprint);
          const remainingPaid = await getRemainingPaidQuestions(user.id);
          controller.enqueue(encoder.encode(JSON.stringify({ usage, remainingPaid }) + '\n'));
        } catch (streamError) {
          console.error('Gemini stream error:', streamError);
          if (isPaid) await releasePaidQuestion(paymentId);
          else if (freeClaimed) await releaseFreeQuestion(user.id);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, { headers: { 'Content-Type': 'application/x-ndjson' } });
  } catch (error) {
    console.error('Astrologer ask request failed:', error);
    return NextResponse.json({ error: 'Unable to generate an answer right now.' }, { status: 500 });
  }
}