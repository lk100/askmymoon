'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  ZODIAC_META,
  COMPATIBILITY_PAIRS,
  getGenericFaqs,
  getZodiacPageData,
} from '@/data/zodiacPageData';

const TIMEFRAMES = [
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'today', label: 'Daily' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

const CATEGORY_META = {
  love: { label: 'Love', icon: '💗', card: 'bg-rose-50 border-rose-100', bar: 'bg-rose-400' },
  finance: { label: 'Finance', icon: '💰', card: 'bg-emerald-50 border-emerald-100', bar: 'bg-emerald-400' },
  career: { label: 'Career', icon: '💼', card: 'bg-violet-50 border-violet-100', bar: 'bg-violet-500' },
  health: { label: 'Health', icon: '🛡️', card: 'bg-sky-50 border-sky-100', bar: 'bg-sky-400' },
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
  const [timeframeMenuOpen, setTimeframeMenuOpen] = useState(false);

  if (!signName) {
    return (
      <div className="min-h-screen bg-[#F7F5FB] text-[#26233D] antialiased">
        <Navbar ctaLabel="Astrologers" ctaHref="/" />
        <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-2 py-16 text-center sm:px-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-violet-600">Sign not found</p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
            We couldn&apos;t find that zodiac sign
          </h1>
          <p className="mt-3 text-sm text-slate-500">Pick a sign below to see its horoscope.</p>
          <div className="mt-8 grid grid-cols-4 gap-2">
            {SIGN_NAMES.map((s) => (
              <Link
                key={s}
                href={`/horoscope/${s.toLowerCase()}`}
                className="rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-violet-400 hover:text-violet-800"
              >
                {s}
              </Link>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = ZODIAC_META[signName];
  const reading = getZodiacPageData(signName, activeTimeframe);
  const faqs = useMemo(() => getGenericFaqs(signName), [signName]);
  const isDaily = ['yesterday', 'today', 'tomorrow'].includes(activeTimeframe);
  const activeTimeframeLabel = TIMEFRAMES.find((t) => t.key === activeTimeframe)?.label;
  const todayLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  function goToTimeframe(tfKey) {
    router.push(`/horoscope/${signName.toLowerCase()}?timeframe=${tfKey}`);
  }

  function goToSign(nextSign) {
    setSignMenuOpen(false);
    router.push(`/horoscope/${nextSign.toLowerCase()}?timeframe=${activeTimeframe}`);
  }

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#26233D] antialiased">
      <Navbar ctaLabel="Astrologers" ctaHref="/" />

      <main className="mx-auto max-w-6xl px-2.5 py-4 sm:px-3 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-3 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:mb-4 sm:gap-1.5 sm:text-[11px]">
          <Link href="/" className="hover:text-violet-700">Home</Link>
          <span>›</span>
          <Link href="/horoscope" className="hover:text-violet-700">
            {activeTimeframeLabel ? `${activeTimeframeLabel}'s Horoscope` : 'Horoscope'}
          </Link>
          <span>›</span>
          <span className="text-violet-700">{signName}</span>
        </nav>

        {/* ------------------------------------------------------------ */}
        {/* Identity card                                                 */}
        {/* ------------------------------------------------------------ */}
        <section className="rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-5">
          <div className="flex items-start justify-between gap-2 sm:hidden">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-violet-50 text-xl text-violet-700">
                {meta.symbol}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-black leading-tight tracking-tight text-slate-900">
                  {signName} Horoscope {isDaily && activeTimeframe !== 'today' ? activeTimeframeLabel : ''}
                </h1>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] font-medium text-slate-500">
                  {meta.hindiName}
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-violet-100 text-[11px] text-violet-700">
                    {meta.symbol}
                  </span>
                  <span className="text-slate-300">·</span>
                  {meta.dateRange}
                </p>
              </div>
            </div>

            {/* Change sign dropdown - mobile */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setSignMenuOpen((v) => !v)}
                aria-label="Change sign"
                className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-[11px] font-bold text-violet-800 shadow-sm transition hover:border-violet-400"
              >
                {signName}
                <ChevronDown className={`h-3 w-3 transition-transform ${signMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {signMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 grid w-56 grid-cols-3 gap-1 rounded-xl border border-violet-100 bg-white p-2 shadow-xl">
                  {SIGN_NAMES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => goToSign(s)}
                      className={`flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-medium ${
                        s === signName ? 'bg-violet-50 text-violet-800' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">{ZODIAC_META[s].symbol}</span>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-violet-50 text-4xl text-violet-700">
                {meta.symbol}
              </div>
              <div>
                <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900">
                  {signName} Horoscope {isDaily && activeTimeframe !== 'today' ? activeTimeframeLabel : ''}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm font-medium text-slate-500">
                  {meta.hindiName}
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-violet-100 text-[13px] text-violet-700">
                    {meta.symbol}
                  </span>
                  <span className="text-slate-300">·</span>
                  {meta.dateRange}
                </p>
              </div>
            </div>

            {/* Change sign dropdown - desktop */}
            <div className="relative shrink-0 self-center">
              <p className="mb-1 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Change sign</p>
              <button
                type="button"
                onClick={() => setSignMenuOpen((v) => !v)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-800 shadow-sm transition hover:border-violet-400"
              >
                {signName}
                <ChevronDown className={`h-4 w-4 transition-transform ${signMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {signMenuOpen && (
                <div className="absolute right-0 z-20 mt-2 grid w-64 grid-cols-3 gap-1 rounded-xl border border-violet-100 bg-white p-2.5 shadow-xl">
                  {SIGN_NAMES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => goToSign(s)}
                      className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[11px] font-medium ${
                        s === signName ? 'bg-violet-50 text-violet-800' : 'text-slate-600 hover:bg-slate-50'
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
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Timeframe pill tabs                                           */}
        {/* ------------------------------------------------------------ */}
        {/* Timeframe: dropdown on mobile */}
        <div className="relative mt-4 sm:hidden">
          <button
            type="button"
            onClick={() => setTimeframeMenuOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-bold text-violet-800 shadow-sm"
          >
            {activeTimeframeLabel}
            <ChevronDown className={`h-4 w-4 text-violet-500 transition-transform ${timeframeMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {timeframeMenuOpen && (
            <div className="absolute left-0 right-0 z-20 mt-1.5 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-xl">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.key}
                  type="button"
                  onClick={() => {
                    setTimeframeMenuOpen(false);
                    goToTimeframe(tf.key);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-semibold ${
                    activeTimeframe === tf.key ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timeframe: pill tabs on larger screens */}
        <div className="mt-5 hidden sm:block">
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                type="button"
                onClick={() => goToTimeframe(tf.key)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                  activeTimeframe === tf.key
                    ? 'border-violet-600 bg-violet-600 text-white shadow-sm'
                    : 'border-violet-100 bg-white text-slate-600 hover:border-violet-300'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Reading + lucky sidebar                                       */}
        {/* ------------------------------------------------------------ */}
        <section className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-[1fr_300px]">
          <div className="rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-5">
            {isDaily && (
              <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700 sm:px-3 sm:text-xs">
                {todayLabel}
              </span>
            )}
            {!reading ? (
              <p className="mt-3 rounded-xl border border-dashed border-violet-200 bg-[#F8F7FC] p-5 text-center text-sm text-slate-500 sm:mt-4 sm:p-6">
                No reading available for this timeframe yet.
              </p>
            ) : (
              <>
                <p className="mt-3 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:mt-4 sm:text-[10px]">
                  {signName} Horoscope {activeTimeframeLabel}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700 sm:mt-2 sm:text-[13px]">{reading.text}</p>
              </>
            )}
          </div>

          {isDaily && reading?.lucky && (
            <aside className="h-fit rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-5">
              <h3 className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 text-violet-600 sm:h-4 sm:w-4" /> Lucky today
              </h3>
              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-3 sm:gap-2.5">
                <div className="rounded-xl bg-[#F8F7FC] p-2.5 sm:p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400 sm:text-[9px]">Lucky colour</p>
                  <div className="mt-1 flex items-center gap-1.5 sm:mt-1.5">
                    {reading.lucky.colors.map((c) => (
                      <span key={c.hex} title={c.name} className="h-3.5 w-3.5 rounded-full border border-white shadow-sm sm:h-4 sm:w-4" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-[#F8F7FC] p-2.5 sm:p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400 sm:text-[9px]">Lucky number</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-800 sm:mt-1 sm:text-sm">{reading.lucky.number}</p>
                </div>
                <div className="rounded-xl bg-[#F8F7FC] p-2.5 sm:p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400 sm:text-[9px]">Auspicious time</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-800 sm:mt-1 sm:text-sm">{reading.lucky.auspiciousTime}</p>
                </div>
                <div className="rounded-xl bg-[#F8F7FC] p-2.5 sm:p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400 sm:text-[9px]">Mood</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-slate-800 sm:mt-1 sm:text-sm">
                    <span>{reading.lucky.mood.emoji}</span>{reading.lucky.mood.label}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F8F7FC] p-2.5 sm:p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400 sm:text-[9px]">Ruling planet</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-800 sm:mt-1 sm:text-sm">{meta.rulingPlanet}</p>
                </div>
                <div className="rounded-xl bg-[#F8F7FC] p-2.5 sm:p-3">
                  <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400 sm:text-[9px]">Symbol</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-800 sm:mt-1 sm:text-sm">{meta.symbol}</p>
                </div>
              </div>
            </aside>
          )}
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Areas of life + "More for [Sign]" sidebar                     */}
        {/* ------------------------------------------------------------ */}
        {reading?.areas && (
          <section className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-[1fr_260px]">
            <div className="rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-5">
              <h2 className="text-base font-extrabold leading-tight text-slate-900 sm:text-xl">
                {activeTimeframeLabel} by area of life
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 sm:mt-1.5 sm:text-sm">
                How {activeTimeframe === 'today' ? 'today' : `this ${activeTimeframe}`} scores across your four key areas — love, finance, career and health.
              </p>

              <div className="mt-3 grid gap-2.5 sm:mt-4 sm:gap-3 sm:grid-cols-2">
                {Object.entries(reading.areas).map(([category, data]) => {
                  const c = CATEGORY_META[category];
                  return (
                    <div key={category} className={`rounded-xl border p-3 sm:p-4 ${c.card}`}>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-sm sm:h-8 sm:w-8 sm:text-sm">{c.icon}</span>
                        <span className="text-xs font-bold text-slate-800 sm:text-sm">{signName} {c.label}</span>
                        <span className="ml-auto text-xs font-black text-slate-700 sm:text-sm">{data.percent}%</span>
                      </div>
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/70 sm:mt-3">
                        <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${data.percent}%` }} />
                      </div>
                      <p className="mt-2.5 text-[11px] leading-relaxed text-slate-600 sm:mt-3 sm:text-xs">{data.blurb}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-5">
              <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">More for {signName}</p>
              <div className="mt-1.5 divide-y divide-violet-50 sm:mt-2">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.key}
                    type="button"
                    onClick={() => goToTimeframe(tf.key)}
                    className={`flex w-full items-center justify-between gap-2 py-2 text-left text-xs font-semibold transition sm:py-2.5 sm:text-sm ${
                      activeTimeframe === tf.key ? 'text-violet-700' : 'text-slate-700 hover:text-violet-700'
                    }`}
                  >
                    {tf.label}'s Horoscope
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 sm:h-4 sm:w-4" />
                  </button>
                ))}
              </div>
            </aside>
          </section>
        )}

        {/* ------------------------------------------------------------ */}
        {/* Compatibility                                                 */}
        {/* ------------------------------------------------------------ */}
        <section className="mt-4 rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:mt-5 sm:rounded-3xl sm:p-5">
          <h2 className="text-base font-extrabold leading-tight text-slate-900 sm:text-xl">{signName} compatibility</h2>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-sm">Tap any pair to see how {signName} matches up.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-2.5 sm:grid-cols-4">
            {COMPATIBILITY_PAIRS.map((s) => (
              <Link
                key={s}
                href={`/compatibility/${signName.toLowerCase()}/${s.toLowerCase()}`}
                className="flex items-center justify-between gap-1.5 rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-2.5 text-[11px] font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-800 sm:px-3.5 sm:py-3 sm:text-sm"
              >
                {signName} and {s}
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 sm:h-4 sm:w-4" />
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Other zodiac signs                                            */}
        {/* ------------------------------------------------------------ */}
        <section className="mt-4 sm:mt-5">
          <h2 className="text-base font-extrabold leading-tight text-slate-900 sm:text-xl">Other Zodiac Signs</h2>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-sm">
            Read {activeTimeframe === 'today' ? "today's" : `${activeTimeframe}'s`} prediction for all 12 rashis
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
            {SIGN_NAMES.map((s) => (
              <Link
                key={s}
                href={`/horoscope/${s.toLowerCase()}?timeframe=${activeTimeframe}`}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center transition sm:gap-2 sm:p-4 ${
                  s === signName
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-violet-100 bg-white shadow-sm hover:border-violet-300'
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-base text-violet-700 sm:h-11 sm:w-11 sm:text-xl">
                  {ZODIAC_META[s].symbol}
                </span>
                <span className="text-xs font-bold text-slate-900 sm:text-sm">{s}</span>
                <span className="text-[9px] text-slate-400 sm:text-[10px]">{ZODIAC_META[s].dateRange}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* Know more (personality / man / woman / in love)               */}
        {/* ------------------------------------------------------------ */}
        <section className="mt-4 sm:mt-5">
          <h2 className="text-base font-extrabold leading-tight text-slate-900 sm:text-xl">Know more about {signName}</h2>
          <p className="mt-1 text-[11px] text-slate-500 sm:text-sm">Explore every side of the {signName} personality.</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: `${signName} Characteristics & Personality`, href: `/horoscope/${signName.toLowerCase()}/personality` },
              { label: `${signName} Man`, href: `/horoscope/${signName.toLowerCase()}/man` },
              { label: `${signName} Woman`, href: `/horoscope/${signName.toLowerCase()}/woman` },
              { label: `${signName} In Love`, href: `/horoscope/${signName.toLowerCase()}/love` },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between gap-2 rounded-xl border border-violet-100 bg-white px-3 py-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-800 sm:px-4 sm:py-3.5 sm:text-sm"
              >
                {item.label}
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 sm:h-4 sm:w-4" />
              </Link>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* FAQ                                                           */}
        {/* ------------------------------------------------------------ */}
        <section className="mt-4 mb-4 rounded-2xl border border-violet-100 bg-white p-3 shadow-sm sm:mt-5 sm:rounded-3xl sm:p-5">
          <h2 className="text-base font-extrabold leading-tight text-slate-900 sm:text-xl">Frequently asked questions</h2>
          <div className="mt-3 divide-y divide-violet-50 sm:mt-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-3 py-3 text-left text-[13px] font-medium text-slate-800 sm:gap-4 sm:py-3.5 sm:text-sm"
                  >
                    {faq.question}
                    <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-violet-500 transition-transform sm:h-4 sm:w-4 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <p className="pb-3 text-[13px] leading-relaxed text-slate-600 sm:pb-4 sm:text-sm">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}