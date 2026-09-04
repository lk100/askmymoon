'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { NUMEROLOGY_CONTENT, NUMEROLOGY_NUMBER_LABELS } from '@/data/numerologyContent';
import { getFunctionalNature } from '@/data/planetaryData';

const CORE_NUMBER_DESCRIPTIONS = {
  root: 'Your natural drive and day-to-day energy.',
  destiny: 'The name-based direction you express in life.',
  lifePath: 'The larger pattern and lessons of your journey.',
  personality: 'The energy others notice first in you.',
  expression: 'Your abilities and natural way of acting.',
  soulUrge: 'Your inner motivations and emotional needs.',
  subconsciousSelf: 'Your instinctive resources under pressure.',
};

const CHALLENGE_LABELS = [
  ['challengeOne', 'First challenge'],
  ['challengeTwo', 'Second challenge'],
  ['challengeThree', 'Main challenge'],
  ['challengeFour', 'Life challenge'],
];

export default function NumerologyReportClient() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('astro_numerology_data');
    if (stored) setReport(JSON.parse(stored));
  }, []);

  if (!report?.results) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-slate-800">
        <Navbar ctaLabel="Start Numerology" ctaHref="/numerology" />
        <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-black text-slate-900">No numerology report found</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your birth details to create your personalized preview.</p>
          <Link href="/numerology" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-800 px-5 py-3 text-sm font-bold text-white hover:bg-amber-900">
            <ArrowLeft className="h-4 w-4" /> Back to numerology
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 antialiased">
      <Navbar ctaLabel="New Calculation" ctaHref="/numerology" />
      <main className="mx-auto max-w-6xl px-3.5 py-6 sm:px-6 sm:py-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="/numerology" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-amber-900">
            <ArrowLeft className="h-4 w-4" /> New calculation
          </Link>
          <span className="text-xs text-slate-500">Free numerology preview</span>
        </div>

        <section className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">Personal number profile</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">{report.name}</h1>
          <p className="mt-2 text-sm text-slate-600">Born {report.dob} {report.place ? `· ${report.place}` : ''}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(NUMEROLOGY_NUMBER_LABELS).map(([key, label]) => {
              const result = report.results[key];
              return (
                <article key={key} className="rounded-2xl border border-amber-900/10 bg-[#FAF6F0] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900">{label}</h2>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{CORE_NUMBER_DESCRIPTIONS[key]}</p>
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-amber-800">Planet: {result.planet}</p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-800 text-lg font-black text-white">{result.number}</span>
                  </div>
                  <p className="mt-4 border-t border-amber-900/10 pt-3 text-xs leading-relaxed text-slate-700">{result.meaning}</p>
                </article>
              );
            })}
          </div>
        </section>

        {report.planetPositions && (
          <section className="mt-5 rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">Personal birth chart</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">All planetary positions</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Your planets are calculated from your birth date, exact time, and place.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(report.planetPositions).map(([planet, position]) => {
                const nature = getFunctionalNature(planet, report.ascendant);
                const natureClass = nature === 'benefic'
                  ? 'bg-emerald-100 text-emerald-800'
                  : nature === 'malefic'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-700';

                return (
                  <article key={planet} className="rounded-xl border border-amber-900/10 bg-[#FAF6F0] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-black text-slate-900">{planet}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${natureClass}`}>{nature}</span>
                    </div>
                    <div className="mt-3 flex gap-2 text-xs text-slate-600">
                      <span className="rounded-lg bg-white px-2.5 py-1.5 font-semibold">{position.sign}</span>
                      <span className="rounded-lg bg-white px-2.5 py-1.5 font-semibold">House {position.house}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {['lifePath', 'personality', 'expression'].map((key) => {
          const number = report.results[key]?.number;
          const content = NUMEROLOGY_CONTENT[number];
          if (!content) return null;

          return (
            <section key={key} className="mt-5 rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">{NUMEROLOGY_NUMBER_LABELS[key]} insight</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{content.title} · Number {number}</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Your pattern</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{content.intro}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">How it shows up</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{content.personality}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Work and direction</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{content.career}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-800">Strengths</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">{content.strengths.map((item) => <li key={item}>• {item}</li>)}</ul>
                </div>
                <div className="rounded-xl bg-amber-50 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-amber-900">Growth edges</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">{content.challenges.map((item) => <li key={item}>• {item}</li>)}</ul>
                </div>
              </div>
            </section>
          );
        })}

        <section className="mt-5 rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">Growth patterns</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Your Challenge Numbers</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">These numbers highlight the lessons and patterns that may ask for more awareness throughout your life.</p>
            </div>
            <CheckCircle2 className="hidden h-6 w-6 shrink-0 text-amber-700 sm:block" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {CHALLENGE_LABELS.map(([key, label]) => {
              const result = report.results[key];
              return (
                <article key={key} className="rounded-xl border border-amber-900/10 bg-[#FAF6F0] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-black text-white">{result.number}</span>
                    <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-700">{result.meaning}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:rounded-3xl sm:p-8">
          <h2 className="text-xl font-black text-slate-900">Your complete numerology report is free</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">Review your numbers, strengths, growth edges, and challenge patterns above. You can start a new calculation whenever you like.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
