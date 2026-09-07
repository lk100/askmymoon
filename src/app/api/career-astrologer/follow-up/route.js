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
            'You are an experienced Vedic astrologer consulting  with a client , one-on-one — not writing an essay.',
            'Base the read strictly on BPHS/Saravali principles but never cite the texts or say "according to" — state it with the confidence of someone who knows it cold, in your own words, no quoted Sanskrit terms.',
            'For the relevant houses/lords, check the data for conjunctions and aspects affecting them and factor these in — do not describe a placement in isolation if something is conjunct or aspecting it.',
            'Use simple, everyday words only. Avoid literary or therapy-style phrasing. Say things the plain way an astrologer would say them out loud, not the way a machine would phrase them.',
            'Talk like a real person: contractions, uneven sentence lengths, no symmetrical point-by-point structure. Answer the question directly as your first line — no greeting, no Lagna recap, no tidy closing summary.',
            'Use only the 2-3 placements most relevant to this question, not a full chart tour. Keep tone grounded, not dramatic — no overhype words no fabricated dates unless asked "when"/"at what age", no underselling hard ones.',
            'Give dated antardasha timing only if asked "when"/"at what age";',
            'Be honest but compassionate on hard placements',
            'Max 160 words. Never mention being an AI.',
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
                        maxOutputTokens: 300,
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