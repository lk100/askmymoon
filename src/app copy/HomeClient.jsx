'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNav from './components/BottomNav';
import { HOROSCOPE_DATA, CATEGORY_LABELS } from '@/data/horoscopeData';
import {
  ArrowRight,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const heroPills = ['Career', 'Finances', 'Marriage', 'Health'];

const CATEGORY_GRADIENTS = {
  emotions: 'from-rose-200 to-rose-500',
  love: 'from-pink-200 to-pink-500',
  career: 'from-purple-200 to-purple-500',
  travel: 'from-sky-200 to-sky-500',
  luck: 'from-violet-200 to-violet-500',
  health: 'from-emerald-200 to-emerald-500',
  money: 'from-orange-200 to-orange-500',
};

function getScoreLabel(score) {
  if (score <= 2) return 'Poor';
  if (score <= 4) return 'Weak';
  if (score <= 6) return 'Fair';
  if (score <= 8) return 'Good';
  return 'Strong';
}
const SIGN_SYMBOLS = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓',
};

const SIGN_SANSKRIT = {
  Aries: 'Mesh',
  Taurus: 'Vrishabh',
  Gemini: 'Mithun',
  Cancer: 'Kark',
  Leo: 'Singh',
  Virgo: 'Kanya',
  Libra: 'Tula',
  Scorpio: 'Vrishchik',
  Sagittarius: 'Dhanu',
  Capricorn: 'Makar',
  Aquarius: 'Kumbh',
  Pisces: 'Meen',
};

const faqs = [
  {
    question: 'How does a career AI astrologer work?',
    answer:
      'Our career AI astrologer combines your exact birth details (date, time, and location) with traditional astrological principles and numerology. Instead of generic daily horoscopes, it provides personalized insights specifically targeted at your professional growth, upcoming periods, and career doubts.',
  },
  {
    question: 'What kind of career doubt can I ask during my session?',
    answer:
      'You can resolve any pressing career doubt—from choosing between a stable job vs. business, evaluating job changes or promotions, finding your ideal domain alignment, to understanding why you might be experiencing temporary workplace blockages.',
  },
  {
    question: 'Is an AI astrologer consultation as accurate as a human astrologer?',
    answer:
      'Our AI astrologer operates with total mathematical precision on your birth chart without human error or bias. It acts as an instant, focused consultation tool that interprets house lordships, planetary transits, and numerology cycles specifically through a career lens.',
  },
  {
    question: 'How much does a career astrologer consultation cost?',
    answer:
      'Every user gets 1 free question to test out the career astrologer. Additional follow-up questions for deeper consultation are available for just ₹49 per question.',
  },
  {
    question: 'Does the career AI astrologer keep my birth details saved for follow-up questions?',
    answer:
      'Yes, your birth chart and numerology calculations are calculated once and stored securely for your session. This ensures every follow-up career doubt you ask is answered using the same personalized astrological context.',
  },
];

export default function HomeClient() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSign, setActiveSign] = useState('Leo');
  const [activeTimeframe, setActiveTimeframe] = useState('today');
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#1C1A2E]">
      <Navbar ctaLabel="Birth chart remedies" ctaHref="/astrologers/remedy" />
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-10 lg:py-14">

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-4 pb-0 sm:pt-6">
          {/* Decorative background circles (desktop only) */}
          <div aria-hidden="true" className="pointer-events-none absolute right-[-6rem] top-[20%] z-0 hidden h-[420px] w-[420px] opacity-30 lg:block lg:h-[500px] lg:w-[500px]">
            <div className="absolute inset-10 rounded-full border border-purple-200/80" />
            <div className="absolute inset-24 rounded-full border border-purple-200/70" />
            <div className="absolute inset-40 rounded-full border border-purple-200/60" />
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-8">
            {/* Left column — copy, stats */}
            <div className="max-w-xl">
              {/* Live status pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-sm sm:gap-2.5 sm:px-4 sm:py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                <span className="text-[10px] font-semibold text-slate-500 sm:text-sm">
                  6k+ user guided
                </span>
                <div className="flex -space-x-2">
                  {['from-red-300 to-red-500', 'from-green-300 to-green-500', 'from-blue-300 to-blue-500'].map((grad, i) => (
                    <div key={i} className={`h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br ${grad} sm:h-4 sm:w-4`} />
                  ))}
                </div>
              </div>

              {/* Headline */}
              <h1 className="mt-4 font-sans text-[2rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:mt-5 sm:text-6xl sm:leading-[1.02] lg:text-7xl xl:text-[4.5rem]">
                Precise life guidance
                <span className="block text-purple-700">astrology system</span>
              </h1>

              {/* Checklist */}
              <div className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3">
                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700 sm:gap-3 sm:text-base">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-600" strokeWidth={2.4} />
                  <span>ASK your first question FREE</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700 sm:gap-3 sm:text-base">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-600" strokeWidth={2.4} />
                  <span>Average reply under <strong>20 seconds</strong></span>
                </div>
              </div>

              {/* Stats row — desktop */}
              <div className="order-3 mt-6 hidden grid-cols-4 gap-2 border-t border-slate-200/70 pt-5 sm:mt-8 sm:pt-6 lg:grid">
                {[
                  ['6k+', 'Users guided'],
                  ['100%', 'Personalized'],
                  ['NO', 'Time Limit'],
                  ['24/7', 'Availability'],
                ].map(([num, label], i) => (
                  <div key={i} className={i > 0 ? 'border-l border-slate-200/70 pl-3' : ''}>
                    <p className="text-xl font-extrabold text-slate-900 sm:text-2xl">{num}</p>
                    <p className="text-[11px] font-medium text-purple-700/80 sm:text-xs">{label}</p>
                  </div>
                ))}
              </div>

              {/* CTA — desktop */}
              <div className="mt-6 hidden sm:mt-8 lg:block">
                <Link
                  href="/astrologers/career"
                  className="inline-flex items-center gap-2 rounded-full bg-purple-300 px-7 py-4 text-sm font-bold text-slate-900 shadow-[0_10px_25px_rgba(217,169,32,0.35)] transition hover:-translate-y-0.5 hover:bg-purple-400 sm:text-base"
                >
                  Start Chat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Mobile-only: stats row */}
            <div className="grid grid-cols-4 gap-1.5 lg:hidden">
              {[
                ['6k+', 'Users guided'],
                ['100%', 'Personalized'],
                ['NO', 'Time Limit'],
                ['24/7', 'Availability'],
              ].map(([num, label], i) => (
                <div key={i} className={i > 0 ? 'border-l border-slate-200/70 pl-2' : ''}>
                  <p className="text-base font-extrabold text-slate-900">{num}</p>
                  <p className="text-[9px] font-medium leading-tight text-purple-700/80">{label}</p>
                </div>
              ))}
            </div>



            {/* Mobile-only CTA */}
            <div className="sm:hidden">
              <Link
                href="/astrologers/career"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-300 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-[0_8px_20px_rgba(217,169,32,0.3)] transition active:scale-[0.98]"
              >
                Start Chat
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Live activity ticker — desktop only */}
          <div className="relative z-10 mt-8 hidden border-t border-slate-200/70 py-3 lg:block">
            <div className="overflow-hidden" style={{
              maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            }}>
              <div className="ticker-track flex w-max items-center gap-2 whitespace-nowrap text-xs text-slate-600">
                {[
                  <>Priya from Mumbai booked Saturn puja with <strong className="text-purple-700">Pt. Ram Naresh</strong> · just now</>,
                  <>Neha from Hyderabad got her Kundli read by <strong className="text-purple-700">Saanvi Sharma</strong> · 4 min ago</>,
                  <>Amit from Delhi consulted about career with <strong className="text-purple-700">Guru Devraj</strong> · 7 min ago</>,
                ].flatMap((item, i) => [
                  <span key={`item-${i}`} className="inline-flex items-center gap-2 px-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    {item}
                  </span>,
                  <span key={`sep-${i}`} className="text-slate-300">+</span>,
                ])}
              </div>
            </div>
          </div>
        </section>

        {/* Horoscope Section */}
        <section className="mt-12 sm:mt-16">
          <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-700 sm:text-xs">
                CHECK HOROSCOPE
              </p>
              <h2 className="mt-2 font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
                Your daily
                <br />
                <span className="text-purple-700">horoscope</span> reading
              </h2>
              <p className="mt-3 text-sm text-slate-500 sm:text-base">Pick your rashi to see today's pillars at a glance.</p>
            </div>

            {/* Timeframe tabs wrapper */}
            <div className="max-w-full overflow-x-auto no-scrollbar py-1">
              <div className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                {[
                  { key: 'today', label: 'Today' },
                  { key: 'tomorrow', label: 'Tomorrow' },
                  { key: 'monthly', label: 'Monthly' },

                ].map((tf) => (
                  <button
                    key={tf.key}
                    type="button"
                    onClick={() => setActiveTimeframe(tf.key)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition sm:px-3.5 sm:py-1.5 sm:text-xs ${activeTimeframe === tf.key
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-purple-700'
                      }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign picker */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2 sm:mb-8 sm:grid sm:grid-cols-6 sm:gap-3 sm:overflow-visible lg:grid-cols-12">
            {Object.keys(HOROSCOPE_DATA).map((sign) => {
              const sanskrit = SIGN_SANSKRIT[sign];
              const isActive = activeSign === sign;
              const symbol = SIGN_SYMBOLS[sign] || sign.slice(0, 2);

              return (
                <button
                  key={sign}
                  type="button"
                  onClick={() => setActiveSign(sign)}
                  className={`flex w-28 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 p-3 text-center transition sm:w-auto sm:shrink ${isActive
                    ? 'border-amber-400 bg-amber-50/80 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-amber-200'
                    }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-all ${isActive
                      ? 'bg-amber-300/60 text-amber-950 scale-105'
                      : 'bg-slate-100 text-slate-700'
                      }`}
                  >
                    {symbol}
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-900 sm:text-sm">
                      {sign}
                    </span>
                    {sanskrit && (
                      <span className="block text-[10px] text-slate-500 sm:text-[11px]">
                        {sanskrit}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reading card */}
          {(() => {
            const reading = HOROSCOPE_DATA[activeSign]?.[activeTimeframe];
            if (!reading) return null;
            const hasDailyExtras = activeTimeframe === 'today' || activeTimeframe === 'tomorrow';
            const todayLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    {/* Circular badge displaying the zodiac glyph */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-xl font-black text-violet-700">
                      {SIGN_SYMBOLS[activeSign] || activeSign.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 sm:text-lg">{activeSign}</h3>
                      <p className="text-[11px] text-slate-500 sm:text-xs">
                        {activeTimeframe === 'today' && 'Today'}
                        {activeTimeframe === 'tomorrow' && 'Tomorrow'}
                        {activeTimeframe === 'monthly' && 'This month'}
                        {activeTimeframe === 'yearly' && 'This year'}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full border border-slate-200 px-3.5 py-1.5 text-[11px] font-semibold text-slate-600 sm:text-xs">
                    {activeTimeframe === 'today' && `Today · ${todayLabel}`}
                    {activeTimeframe === 'tomorrow' && `Tomorrow · ${todayLabel}`}
                    {activeTimeframe === 'monthly' && 'This month'}
                    {activeTimeframe === 'yearly' && 'This year'}
                  </span>
                </div>

                <div className="flex flex-col gap-6 pt-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* Reading Text & Extras - Left Side on Desktop */}
                  <div className="w-full lg:w-7/12 lg:order-1">
                    <p className="text-[13px] leading-snug text-slate-700 sm:text-base sm:leading-relaxed">
                      {reading.text}
                    </p>

                    {hasDailyExtras && (
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">{reading.mood.emoji}</span>
                          <span className="font-semibold text-slate-700">
                            {reading.mood.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-violet-700">{reading.lucky}</span>
                          <span className="text-slate-500">lucky</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-slate-200"
                            style={{ backgroundColor: reading.color.hex }}
                          />
                          <span className="text-slate-500">{reading.color.name}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Score Box - Right Side on Desktop */}
                  <div className="w-full lg:w-5/12 lg:order-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="space-y-4">
                        {Object.entries(reading.scores).map(([category, score]) => (
                          <div key={category}>
                            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold sm:text-xs">
                              <span className="uppercase tracking-wide text-slate-500">
                                {CATEGORY_LABELS[category]}
                              </span>
                              <span className="text-slate-700">{getScoreLabel(score)}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.career
                                  } transition-all duration-500`}
                                style={{ width: `${score * 10}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>


        {/* FAQ Section */}
        <section className="mt-12 sm:mt-16">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 sm:text-[11px]">
              Got questions
            </p>
            <h2 className="mt-1 font-serif text-2xl font-normal text-[#14121F] sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-violet-100 bg-white shadow-sm transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                >
                  <span className="text-xs font-bold text-slate-900 sm:text-sm">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-violet-600 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-violet-50 px-4 pb-4 pt-3 text-xs leading-relaxed text-slate-700 sm:px-5 sm:pb-5 sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}