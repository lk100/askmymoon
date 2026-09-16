'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ZODIAC_META,
  COMPATIBILITY_PAIRS,
  getGenericFaqs,
  getZodiacPageData,
} from '@/data/zodiacPageData';

// ---------------------------------------------------------------------------
// Local display config (kept in the page, not the data file — swap freely
// without touching content).
// ---------------------------------------------------------------------------
const TIMEFRAMES = [
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'today', label: 'Daily' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

const CATEGORY_LABELS = { love: 'Love', finance: 'Finance', career: 'Career', health: 'Health' };

// One accent bar color per category instead of four different gradients —
// quieter, and easier to scan at a glance.
const CATEGORY_DOTS = {
  love: 'bg-rose-400',
  finance: 'bg-amber-400',
  career: 'bg-violet-400',
  health: 'bg-emerald-400',
};

const SIGN_NAMES = Object.keys(ZODIAC_META);

function normalizeSign(rawSign) {
  if (!rawSign) return null;
  const decoded = decodeURIComponent(rawSign).toLowerCase();
  return SIGN_NAMES.find((s) => s.toLowerCase() === decoded) || null;
}

function normalizeTimeframe(rawTimeframe) {
  const found = TIMEFRAMES.find((t) => t.key === rawTimeframe);
  return found ? found.key : 'today';
}

export default function HoroscopePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const signName = normalizeSign(params?.sign);
  const activeTimeframe = normalizeTimeframe(searchParams.get('timeframe'));
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [signMenuOpen, setSignMenuOpen] = useState(false);

  if (!signName) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
          Sign not found
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900">
          We couldn&apos;t find that zodiac sign
        </h1>
        <p className="mt-3 text-sm text-slate-500">Pick a sign below to see its horoscope.</p>
        <div className="mt-8 grid grid-cols-4 gap-2">
          {SIGN_NAMES.map((s) => (
            <Link
              key={s}
              href={`/horoscope/${s.toLowerCase()}`}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:border-amber-400 hover:text-amber-800"
            >
              {s}
            </Link>
          ))}
        </div>
      </main>
    );
  }

  const meta = ZODIAC_META[signName];
  const reading = getZodiacPageData(signName, activeTimeframe);
  const faqs = useMemo(() => getGenericFaqs(signName), [signName]);
  const isDaily = ['yesterday', 'today', 'tomorrow'].includes(activeTimeframe);
  const todayLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  function goToTimeframe(tfKey) {
    router.push(`/horoscope/${signName.toLowerCase()}?timeframe=${tfKey}`);
  }

  function goToSign(nextSign) {
    setSignMenuOpen(false);
    router.push(`/horoscope/${nextSign.toLowerCase()}?timeframe=${activeTimeframe}`);
  }

  return (
    <main className="bg-[#FAF8F4]">
      {/* ---------------------------------------------------------------- */}
      {/* Hero band — the one bold moment on the page. Everything below    */}
      {/* stays quiet on a light cream background.                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-[#1B1330]">
        {/* faint constellation texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 10% 20%, #fff 100%, transparent), radial-gradient(1px 1px at 80% 30%, #fff 100%, transparent), radial-gradient(1.5px 1.5px at 60% 70%, #fff 100%, transparent), radial-gradient(1px 1px at 30% 80%, #fff 100%, transparent), radial-gradient(1px 1px at 90% 85%, #fff 100%, transparent)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-6 sm:px-5">
          <nav className="flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/" className="hover:text-amber-300">Home</Link>
            <span>/</span>
            <Link href="/horoscope" className="hover:text-amber-300">Horoscope</Link>
            <span>/</span>
            <span className="text-white/80">{signName}</span>
          </nav>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-white/5 text-3xl text-amber-300">
              {meta.symbol}
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                {signName} Horoscope
              </h1>
              <p className="mt-1 text-sm text-white/60">
                {meta.hindiName} &nbsp;·&nbsp; {meta.dateRange} &nbsp;·&nbsp; Ruled by {meta.rulingPlanet}
              </p>
            </div>

            <div className="relative ml-auto shrink-0">
              <button
                type="button"
                onClick={() => setSignMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/80 hover:border-amber-300/50 hover:text-amber-200"
              >
                Change sign
                <span className={`transition-transform ${signMenuOpen ? 'rotate-180' : ''}`}>⌄</span>
              </button>
              {signMenuOpen && (
                <div className="absolute right-0 z-10 mt-2 grid w-60 grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl">
                  {SIGN_NAMES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => goToSign(s)}
                      className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[11px] font-medium ${
                        s === signName ? 'bg-amber-50 text-amber-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">{ZODIAC_META[s].symbol}</span>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Timeframe tabs */}
          <div className="mt-6 -mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
            <div className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-full bg-white/5 p-1">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.key}
                  type="button"
                  onClick={() => goToTimeframe(tf.key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    activeTimeframe === tf.key
                      ? 'bg-amber-300 text-[#1B1330]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Body                                                              */}
      {/* ---------------------------------------------------------------- */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-5">
        {!reading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No reading available for this timeframe yet.
          </div>
        ) : (
          <>
            {/* Reading + lucky panel */}
            <section className="grid gap-5 lg:grid-cols-[1fr_260px]">
              <div>
                <div className="flex items-baseline justify-between">
                  <h2 className="font-serif text-xl font-bold text-slate-900">
                    {TIMEFRAMES.find((t) => t.key === activeTimeframe)?.label} reading
                  </h2>
                  {isDaily && <span className="text-xs font-medium text-slate-400">{todayLabel}</span>}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{reading.text}</p>
              </div>

              {isDaily && reading.lucky && (
                <aside className="h-fit rounded-xl border border-amber-200/60 bg-amber-50/50 p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Lucky today
                  </h3>
                  <dl className="mt-3 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Mood</dt>
                      <dd className="flex items-center gap-1.5 font-medium text-slate-800">
                        <span>{reading.lucky.mood.emoji}</span>{reading.lucky.mood.label}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Colors</dt>
                      <dd className="flex items-center gap-1.5">
                        {reading.lucky.colors.map((c) => (
                          <span
                            key={c.hex}
                            title={c.name}
                            className="h-4 w-4 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-slate-500">Number</dt>
                      <dd className="font-medium text-slate-800">{reading.lucky.number}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-slate-500">Time</dt>
                      <dd className="text-right font-medium text-slate-800">{reading.lucky.auspiciousTime}</dd>
                    </div>
                  </dl>
                </aside>
              )}
            </section>

            {/* Areas of life */}
            {reading.areas && (
              <section className="mt-10">
                <h2 className="font-serif text-xl font-bold text-slate-900">By area of life</h2>
                <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {Object.entries(reading.areas).map(([category, data]) => (
                    <div key={category} className="p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOTS[category]}`} />
                        <span className="text-sm font-semibold text-slate-800">{CATEGORY_LABELS[category]}</span>
                        <span className="ml-auto text-xs font-medium text-slate-400">{data.percent}%</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{data.blurb}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Compatibility */}
        <section className="mt-10">
          <h2 className="font-serif text-xl font-bold text-slate-900">{signName} compatibility</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {COMPATIBILITY_PAIRS.filter((s) => s !== signName).map((s) => (
              <Link
                key={s}
                href={`/horoscope/${s.toLowerCase()}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:border-amber-300 hover:text-amber-800"
              >
                <span>{ZODIAC_META[s].symbol}</span>{s}
              </Link>
            ))}
          </div>
        </section>

        {/* Other signs */}
        <section className="mt-10">
          <h2 className="font-serif text-xl font-bold text-slate-900">Explore other signs</h2>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {SIGN_NAMES.map((s) => (
              <Link
                key={s}
                href={`/horoscope/${s.toLowerCase()}`}
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center text-[11px] font-medium transition ${
                  s === signName
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-800'
                }`}
              >
                <span className="text-base">{ZODIAC_META[s].symbol}</span>
                {s}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 mb-4">
          <h2 className="font-serif text-xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-medium text-slate-800 sm:px-5"
                  >
                    {faq.question}
                    <span className={`shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-4 text-sm leading-relaxed text-slate-600 sm:px-5">{faq.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}