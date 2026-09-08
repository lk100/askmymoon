import { NextResponse } from 'next/server';
import { readCareerChartToken } from '@/lib/careerChartToken';
import { claimPaidCareerQuestion, getVisitorId, releasePaidCareerQuestion } from '@/lib/careerAstrologerStore';

// Prevent this route from being statically optimized or buffered by the platform.
// Without this, some hosts (Vercel, certain proxies) will buffer the whole
// response before sending it to the client, which makes streaming look like
// it "dumps everything at once" even though the server is sending chunks.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const fallbackAnswer = 'Your paid career question could not be completed right now. Please try again in a moment.';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';

export async function POST(request) {
    try {
        const { question, chartToken } = await request.json();
        if (!question?.trim() || !chartToken) {
            return NextResponse.json({ error: 'A question and chart token are required.' }, { status: 400 });
        }

        const chart = readCareerChartToken(chartToken);
        const visitor = getVisitorId(request);
        if (visitor.isNew) {
            return NextResponse.json({ error: 'Your paid question session could not be verified.' }, { status: 401 });
        }
        const chartFingerprint = chart._chartFingerprint;
        if (!chartFingerprint) {
            return NextResponse.json({ error: 'The chart session is invalid. Please regenerate your chart.' }, { status: 400 });
        }
        const paymentId = await claimPaidCareerQuestion(visitor.id, chartFingerprint);
        if (!paymentId) {
            return NextResponse.json({ error: 'Please complete payment before asking this question.' }, { status: 402 });
        }
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini is not configured on the server.' }, { status: 500 });
        }
        const prompt = [
            'You are an experienced Vedic astrologer talking one-on-one with a client. Answer their question directly as your first line — no greeting, no chart recap, no summary at the end.',
            'Step 1 (silent, don\'t show this): identify which house(s) in the data govern this question. Look at that house\'s "lord" and its "influences" array — each influence tells you the relation (placed_in_house, aspects_house, aspects_lord, conjunct_with_lord) and the planet\'s baladi_avastha (strength state: Bala/Kumara/Yuva = strong, Vriddha/Mrita = low energy). Pick the 2-3 influences that matter most for this question — prioritize conjunct_with_lord and placed_in_house over distant aspects, and weigh strong-state planets over low-energy ones.',
            'Step 2: if the question is about timing ("when", "at what age", "which years"), use current_mahadasha, current_antardasha, and career_dashas_after_18 to name the relevant period(s) and rough date range — don\'t give exact dates, just the dasha/antardasha window.',
            'Step 3: write the answer. Every claim must trace back to a specific placement, aspect, or dasha period found in the data, synthesized with classic Vedic outcomes from Brihat Parashara Hora Shastra (BPHS) and Saravali for house lord placements and planetary combinations — no generic textbook meanings, and never invent a placement not present in the data.',
            'Every time you name a planet or house, explain what it means in the same sentence, in plain words — e.g. "Rahu, the planet of ambition and unconventional routes, sits in your 10th house of career." Never leave an astrological term unexplained.',
            'CRITICAL RULE FOR PLANETARY STATES (BALADI AVASTHA): NEVER use Sanskrit terms (e.g. Mrita, Vriddha, Yuva, Kumara, Avastha) OR vague words like "tired" or "dead" that sound like AI jargon. Instead, describe the exact real-world impact and daily work symptoms: for low-energy states (Mrita/Vriddha), explain specific friction points like communication gaps, mental fog, delayed contract approvals, or uninspired focus; for peak-energy states (Yuva/Kumara), highlight clear execution, strong leadership, or effortless momentum.',
            'Write like a real person talking, not an essay: contractions, plain practical words, no unexplained jargon, no therapy-speak.',
            'Tone: warm and confident, like a mentor — not harsh, not overhyped, not vague.',
            'If they ask what to do, end with 1-2 concrete actions grounded in the chart\'s strengths.',
            'Only give dated timing if they ask "when" or "at what age" — and even then, name the dasha/antardasha window .',
            '100 to 150 words. Never mention being an AI.',
            'FORMATTING RULE: Never return a dense wall of text. Structure your response into 2-3 distinct paragraphs separated by double line breaks (\n\n). Use bold text for key insights or bullet points (* Item) if recommending action steps.',
            `User question: ${question.trim()}`,
            `Calculated chart data: ${JSON.stringify(chart).slice(0, 30000)}`,
        ].join('\n\n');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        maxOutputTokens: 230,
                        temperature: 0.7,
                        thinkingConfig: {
                            thinkingBudget: 0,
                        },
                    },
                }),
            }
        );
        if (!response.ok) {
            const data = await response.json().catch(() => null);
            await releasePaidCareerQuestion(paymentId);
            return NextResponse.json({ error: data?.error?.message || 'The analyst is temporarily unavailable.' }, { status: 502 });
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.enqueue(encoder.encode(`${JSON.stringify({ text: fallbackAnswer })}\n`));
                    controller.close();
                    return;
                }

                let buffer = '';
                let sentText = false;
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';

                        for (const line of lines) {
                            if (!line.startsWith('data:')) continue;
                            const payload = line.slice(5).trim();
                            if (!payload || payload === '[DONE]') continue;
                            let data;
                            try {
                                data = JSON.parse(payload);
                            } catch {
                                continue;
                            }
                            const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join('');
                            if (text) {
                                sentText = true;
                                // Enqueue immediately, chunk by chunk, so the client can
                                // render progressively instead of waiting for the full answer.
                                controller.enqueue(encoder.encode(`${JSON.stringify({ text })}\n`));
                            }
                        }

                        if (done) break;
                    }

                    if (!sentText) controller.enqueue(encoder.encode(`${JSON.stringify({ text: fallbackAnswer })}\n`));
                    controller.close();
                } catch (error) {
                    await releasePaidCareerQuestion(paymentId).catch((releaseError) => console.error('Unable to release paid career question:', releaseError));
                    controller.error(error);
                } finally {
                    reader.releaseLock();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/x-ndjson; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                // Tells reverse proxies (Nginx, some CDNs) not to buffer this response.
                'X-Accel-Buffering': 'no',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Career follow-up request failed:', error);
        return NextResponse.json({ error: 'Unable to generate the career answer right now.' }, { status: 500 });
    }
}