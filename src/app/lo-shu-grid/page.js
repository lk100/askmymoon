'use client';

import { useState } from 'react';
import {
  ArrowRight, Briefcase, ChevronDown, Gift, Heart, HeartPulse, RotateCcw, Sparkles, Wallet,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  calculateLoShuGrid,
  GRID_POSITIONS,
  NUMBER_MEANINGS,
  MISSING_NUMBER_REMEDIES,
} from '@/lib/loshuGrid';

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 110 }, (_, i) => String(CURRENT_YEAR - i));

const FAQS = [
  {
    question: 'How to calculate the Lo Shu grid?',
    answer:
      'Write down your complete birth date and identify which numbers 1-9 appear in it. Place these numbers in their corresponding positions on the traditional 3x3 grid pattern. Count how many times each number appears to determine strength, and identify missing numbers.',
  },
  {
    question: 'What does a number appearing multiple times mean?',
    answer:
      'A number appearing several times creates a strong concentration of that number\'s energy. For example, four 1s creates extremely strong independence and leadership energy, but may indicate excessive self-focus or difficulty working with others.',
  },
  {
    question: 'What is a good combination in the Lo Shu grid?',
    answer:
      'A balanced grid with most numbers present and none excessively repeated creates a harmonious personality. Having strong numbers 1, 5, and 9 together often indicates leadership with wisdom. Combinations including numbers 2, 6, and 8 suggest good relationship abilities with material success potential.',
  },
  {
    question: 'Is the Lo Shu grid accurate?',
    answer:
      'When properly calculated and interpreted, Lo Shu Grid analysis provides insights into personality patterns rooted in numerology tradition. Many people find descriptions resonate with their experiences. Accuracy depends on correct birth information and thoughtful interpretation.',
  },
  {
    question: 'What are the remedies for missing numbers?',
    answer:
      'Missing numbers don\'t mean something is wrong — they highlight areas where you might benefit from a little extra support. Traditional numerology offers remedies (colors, days, habits, and stones) to help build those missing traits and bring more balance into your life.',
  },
];

const USES = [
  {
    title: 'Self-awareness',
    body: 'Have you ever wondered why you shine in some situations but struggle in others? The Lo Shu Grid decodes this for you, offering insight into your natural strengths, hidden talents, and areas where you might need a bit more effort.',
  },
  {
    title: 'Career guidance',
    body: 'Not sure what career path suits you best? Your grid can point the way. For instance, strength in expression may suit media, teaching, or client-facing roles — strength in logic and structure may suit finance, operations, or government work.',
  },
  {
    title: 'Relationships and family',
    body: 'Understanding your number pattern and those of your loved ones can make your relationships smoother — helping you approach family or romantic bonds with more empathy and balance.',
  },
  {
    title: 'Decisions and life planning',
    body: 'This grid helps by aligning choices with your core strengths, making everything from career switches to life milestones easier to navigate.',
  },
];

const SELECT_CLASS =
  'w-full appearance-none rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-3.5 text-base text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100';

function LineCard({ line, counts }) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        line.isComplete ? 'border-violet-200 bg-violet-50/60' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[13px] sm:text-[15px] font-bold leading-snug">{line.name}</h4>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            line.isComplete ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {line.isComplete ? 'Present' : 'Not present'}
        </span>
      </div>
      <p className="mt-1 text-[11px] sm:text-xs text-slate-500">{line.about}</p>
      <div className="mt-3 flex items-center gap-1.5">
        {line.numbers.map((n) => (
          <span
            key={n}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-[15px] sm:text-base font-bold ${
              counts[n] > 0
                ? 'bg-violet-600 text-white'
                : 'border-2 border-dashed border-amber-400 bg-amber-50 text-amber-800'
            }`}
          >
            {n}
          </span>
        ))}
        {!line.isComplete && (
          <span className="ml-2 text-[11px] sm:text-xs font-medium text-amber-800">
            Missing {line.missingInLine.join(', ')}
          </span>
        )}
      </div>
      <p className="mt-3 text-[13px] sm:text-sm leading-relaxed text-slate-600">{line.text}</p>
    </article>
  );
}

const DOMAIN_ICONS = { career: Briefcase, health: HeartPulse, finances: Wallet, love: Heart };

function LineSelector({ title, hint, lines, counts }) {
  const [selected, setSelected] = useState(lines[0].id);
  const presentTotal = lines.filter((l) => l.isComplete).length;
  const visible = selected === 'all' ? lines : lines.filter((l) => l.id === selected);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] sm:text-xs font-bold text-violet-800">
          {presentTotal} of {lines.length} present
        </span>
      </div>
      <p className="mt-1 text-[13px] sm:text-sm text-slate-600">{hint}</p>
      <div className="relative mt-3">
        <select
          aria-label={`Choose from ${title.toLowerCase()}`}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full appearance-none rounded-xl border border-violet-100 bg-[#F8F7FC] px-3.5 py-3.5 pr-10 text-base font-medium text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        >
          {lines.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.numbers.join('-')}) {l.isComplete ? '- present' : '- not present'}
            </option>
          ))}
          <option value="all">Show all</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />
      </div>
      <div className={`mt-3 grid gap-3 ${visible.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {visible.map((line) => (
          <LineCard key={line.id} line={line} counts={counts} />
        ))}
      </div>
    </div>
  );
}

export default function LoShuGridPage() {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleCalculate = (event) => {
    event.preventDefault();
    if (!name.trim() || !day || !month || !year) return;
    const dob = `${year}-${month}-${day}`;
    setResult({ ...calculateLoShuGrid(dob), name: name.trim(), dob });
  };

  const handleReset = () => {
    setResult(null);
    setName('');
    setDay('');
    setMonth('');
    setYear('');
  };

  const formatDob = (iso) => {
    const [y, m, d] = iso.split('-');
    return `${Number(d)} ${MONTH_LABELS[Number(m) - 1]} ${y}`;
  };

  const firstName = result ? result.name.split(' ')[0] : '';

  const presentEntries = result
    ? Object.entries(result.counts).filter(([, count]) => count > 0)
    : [];

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#26233D] antialiased">


      <main className="mx-auto max-w-6xl px-3.5 py-6 sm:px-6 sm:py-10">
        {!result ? (
          <>
        <section className="flex flex-col gap-6 lg:gap-10">
          <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-violet-100 sm:rounded-3xl">
            {/* Lo Shu grid as banner background */}
            <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {GRID_POSITIONS.flat().map((n) => (
                <span
                  key={n}
                  className="flex items-center justify-center border border-violet-200/80 text-5xl font-black text-violet-300/70 sm:text-8xl lg:text-9xl"
                >
                  {n}
                </span>
              ))}
            </div>
            {/* soft tint so the text stays readable */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-violet-50/95 via-violet-50/80 to-violet-50/20 sm:from-violet-50/95 sm:via-violet-50/75 sm:to-transparent"
            />

            <div className="relative p-5 sm:p-10 lg:py-14">
              <div className="inline-flex items-center gap-2 rounded-md border border-violet-200 /8bg-0 px-3 py-1 text-[10px] font-semibold text-[#26233D] sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                Free numerology tool
              </div>
              <h1 className="mt-5 max-w-2xl text-[22px] font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
                Lo Shu Grid Calculator: <span className="text-violet-700">free predictions by date of birth</span>
              </h1>
              <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-slate-700 sm:text-lg">
                Have you ever felt like you're doing everything right, yet life just isn't going your way? That's exactly where a Lo Shu Grid Calculator can help — it decodes your birth date to reveal hidden patterns affecting your personality, career, and life path.
              </p>
            </div>
          </div>

          <div id="loshu-form" className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-violet-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold leading-tight text-slate-900 sm:text-xl">Calculate your Lo Shu Grid</h2>
                <p className="mt-1 text-[11px] sm:text-xs text-slate-500">Enter your name and date of birth to see your grid</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2 py-1.5 text-[9px] font-bold uppercase text-violet-800 sm:px-2.5 sm:text-[10px]">
                <Gift className="h-3.5 w-3.5" /> Free
              </span>
            </div>
              <form onSubmit={handleCalculate} className="mx-auto max-w-xl">
                <div>

                  <label className="mb-4 block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Full name
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      autoComplete="name"
                      className="mt-1.5 w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3.5 py-3.5 text-base font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                  </label>

                  <fieldset>
                    <legend className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Date of birth
                    </legend>
                    <div className="grid grid-cols-[1fr_1.6fr_1.2fr] gap-2 sm:gap-3">
                      <select
                        required
                        aria-label="Day"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>Day</option>
                        {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select
                        required
                        aria-label="Month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>Month</option>
                        {MONTHS.map((m, i) => <option key={m} value={m}>{MONTH_LABELS[i]}</option>)}
                      </select>
                      <select
                        required
                        aria-label="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>Year</option>
                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 text-[15px] sm:text-base font-bold text-white shadow-[0_10px_20px_rgba(124,58,237,0.18)] transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 active:scale-[0.99]"
                  >
                    Calculate my Lo Shu Grid <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-3 text-center text-[11px] sm:text-xs text-slate-500">
                    No payment required. Your grid is free.
                  </p>
                </div>
              </form>
          </div>
        </section>

        {/* Explainer content */}
        <section className="mt-10 sm:mt-14">
          <div className="max-w-2xl">
            <h2 className="text-xl font-black leading-tight tracking-tight sm:text-4xl">
              Lo Shu Grid Calculator: a map to success and harmony
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-slate-600 sm:text-base">
              Think of it like your personal energy blueprint. Based on your date of birth, the Lo Shu Grid maps out your strengths and the areas where you might need a little support.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600 sm:text-base">
              Lo Shu Grid Calculators aren't just for the spiritually curious — they're practical tools that can help you understand yourself better and make decisions in areas like your career, relationships, and personal growth, all based on your unique birth numbers.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
            {USES.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-violet-100 border-l-4 border-l-violet-600 bg-white p-4 sm:p-5"
              >
                <h3 className="text-base sm:text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-[13px] sm:text-sm leading-relaxed text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
          </>
        ) : (
        <section className="flex flex-col gap-6 sm:gap-8">
          <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-violet-100 sm:rounded-3xl">
            <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {GRID_POSITIONS.flat().map((n) => (
                <span
                  key={n}
                  className="flex items-center justify-center border border-violet-200/80 text-4xl font-black text-violet-300/70 sm:text-7xl"
                >
                  {n}
                </span>
              ))}
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-violet-50/95 via-violet-50/80 to-violet-50/30 sm:via-violet-50/75 sm:to-transparent" />
            <div className="relative p-5 sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-md border border-violet-200 bg-white/80 px-3 py-1 text-[10px] font-semibold text-[#26233D] sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                Your Lo Shu report
              </div>
              <h1 className="mt-4 max-w-2xl text-[21px] font-black leading-[1.1] tracking-tight text-slate-900 sm:text-4xl">
                <span className="text-violet-700">{result.name}</span>&apos;s Lo Shu Grid
              </h1>
              <p className="mt-2 text-[13px] font-medium text-slate-700 sm:text-base">
                Born {formatDob(result.dob)}
              </p>
            </div>
          </div>

          <div className="p-4  sm:rounded-3xl sm:p-7">
              <div className="space-y-8">
                {/* Grid + summary */}
                <div className="grid gap-6 md:grid-cols-[minmax(0,360px)_1fr] md:items-center md:gap-10">
                  <div className="mx-auto w-full max-w-[320px] md:max-w-none">
                    <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-violet-100 bg-white p-1.5 sm:gap-2 sm:p-2">
                      {GRID_POSITIONS.flat().map((positionNumber) => {
                        const count = result.counts[positionNumber];
                        const isPresent = count > 0;
                        return (
                          <div
                            key={positionNumber}
                            className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl ${
                              isPresent
                                ? 'border-2 border-violet-400 bg-violet-50 text-violet-700'
                                : 'border-2 border-dashed border-slate-200 bg-[#F8F7FC] text-slate-300'
                            }`}
                          >
                            <span
                              className={`absolute left-1.5 top-1 text-[10px] font-semibold sm:text-xs ${
                                isPresent ? 'text-violet-400' : 'text-slate-300'
                              }`}
                            >
                              {positionNumber}
                            </span>
                            {isPresent ? (
                              <span
                                className={`font-bold leading-none tracking-tight ${
                                  count > 3 ? 'text-lg sm:text-2xl' : count > 1 ? 'text-xl sm:text-3xl' : 'text-3xl sm:text-5xl'
                                }`}
                              >
                                {String(positionNumber).repeat(count)}
                              </span>
                            ) : (
                              <span className="text-lg sm:text-xl font-bold">—</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-extrabold sm:text-3xl">Grid at a glance</h2>
                    <p className="mt-2 text-[13px] sm:text-sm leading-relaxed text-slate-600">
                      Hi {result.name.split(' ')[0]}, filled boxes are the numbers found in your birth date. Dashed boxes are the numbers missing from it.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs font-semibold text-violet-800">
                      <span className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5">
                        Driver number: {result.driver}
                      </span>
                      <span className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1.5">
                        Conductor number: {result.conductor}
                      </span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-violet-50 p-3">
                        <dt className="text-[11px] sm:text-xs font-semibold text-violet-800">Present</dt>
                        <dd className="mt-1 text-xl sm:text-2xl font-bold text-violet-900">
                          {presentEntries.length}
                          <span className="text-[13px] sm:text-sm font-medium text-violet-700"> of 9</span>
                        </dd>
                      </div>
                      <div className="rounded-xl bg-amber-50 p-3">
                        <dt className="text-[11px] sm:text-xs font-semibold text-amber-800">Missing</dt>
                        <dd className="mt-1 text-xl sm:text-2xl font-bold text-amber-900">
                          {result.missingNumbers.length}
                          <span className="text-[13px] sm:text-sm font-medium text-amber-700"> of 9</span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Numbers present */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Numbers present and what they indicate</h3>
                  <p className="mt-1 text-[13px] sm:text-sm text-slate-600">
                    These are the energies you carry naturally.
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {presentEntries.map(([num, count]) => (
                      <article key={num} className="rounded-2xl border border-violet-100 bg-white p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-lg sm:text-xl font-bold text-white">
                            {num}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-[15px] sm:text-base font-bold leading-snug">{NUMBER_MEANINGS[num].title}</h4>
                            {count > 1 && (
                              <p className="text-[11px] sm:text-xs font-semibold text-violet-700">Appears {count} times</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {NUMBER_MEANINGS[num].keywords.map((k) => (
                            <span key={k} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-800">
                              {k}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-[13px] sm:text-sm leading-relaxed text-slate-700">{NUMBER_MEANINGS[num].present}</p>
                        {count > 1 && (
                          <p className="mt-3 rounded-xl bg-violet-50 p-3 text-[13px] sm:text-sm leading-relaxed text-violet-900">
                            {NUMBER_MEANINGS[num].repeated}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>

                {/* Numbers absent */}
                {result.missingNumbers.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Numbers absent and what they indicate</h3>
                    <p className="mt-1 text-[13px] sm:text-sm text-slate-600">
                      Missing numbers aren't flaws, {firstName}. They show where growth will feel most rewarding.
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {result.missingNumbers.map((num) => (
                        <article key={num} className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                          <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-amber-500 text-lg sm:text-xl font-bold text-amber-800">
                              {num}
                            </span>
                            <h4 className="min-w-0 pt-2 text-[15px] sm:text-base font-bold leading-snug">{NUMBER_MEANINGS[num].title}</h4>
                          </div>
                          <p className="mt-3 text-[13px] sm:text-sm leading-relaxed text-slate-700">{NUMBER_MEANINGS[num].missing}</p>
                        
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* Life domains */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Career, health, finances and love</h3>
                  <p className="mt-1 text-[13px] sm:text-sm text-slate-600">
                    What your present and absent numbers suggest for the four main areas of life.
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {(result.analysis?.domains ?? []).map((d) => {
                      const Icon = DOMAIN_ICONS[d.id];
                      const tone =
                        d.level === 'high'
                          ? 'bg-violet-600 text-white'
                          : d.level === 'mid'
                            ? 'bg-violet-100 text-violet-800'
                            : 'bg-amber-100 text-amber-800';
                      return (
                        <article key={d.id} className="flex flex-col rounded-2xl border border-violet-100 bg-white p-4 sm:p-5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                                <Icon className="h-5 w-5" />
                              </span>
                              <h4 className="text-[15px] sm:text-base font-bold">{d.title}</h4>
                            </div>
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${tone}`}>
                              {d.label}
                            </span>
                          </div>
                          <p className="mt-3 text-[13px] sm:text-sm leading-relaxed text-slate-700">{d.summary}</p>
                          {d.strengths.length > 0 && (
                            <div className="mt-3">
                              <p className="text-[11px] sm:text-xs font-bold text-violet-800">Working in your favour</p>
                              <ul className="mt-1.5 space-y-1.5">
                                {d.strengths.map((item) => (
                                  <li key={item.n} className="flex items-start gap-2 text-[13px] sm:text-sm leading-relaxed text-slate-600">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-600 text-[11px] font-bold text-white">{item.n}</span>
                                    <span>{item.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {d.growth.length > 0 && (
                            <div className="mt-3">
                              <p className="text-[11px] sm:text-xs font-bold text-amber-800">Needs attention</p>
                              <ul className="mt-1.5 space-y-1.5">
                                {d.growth.map((item) => (
                                  <li key={item.n} className="flex items-start gap-2 text-[13px] sm:text-sm leading-relaxed text-slate-600">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-dashed border-amber-500 text-[11px] font-bold text-amber-800">{item.n}</span>
                                    <span>{item.text}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {d.note && <p className="mt-3 text-[11px] sm:text-xs text-slate-500">{d.note}</p>}
                        </article>
                      );
                    })}
                  </div>
                </div>

                {/* Lines and planes */}
                <LineSelector
                  title="Lines and planes"
                  hint="A line is present when all three of its numbers are in your grid. Choose one to read about it."
                  lines={[...result.analysis.rows, ...result.analysis.columns]}
                  counts={result.counts}
                />

                {/* Diagonals */}
                <LineSelector
                  title="Diagonals (yogs)"
                  hint="Diagonals pass through the centre number 5 and are considered special combinations."
                  lines={result.analysis.diagonals}
                  counts={result.counts}
                />

                {/* Overall nature */}
                <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-100 via-violet-50 to-white p-4 sm:p-6">
                  <div className="inline-flex items-center gap-2 rounded-md border border-violet-200 bg-white/80 px-3 py-1 text-[10px] font-semibold text-[#26233D] sm:text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                    Overall nature of your grid
                  </div>
                  <h3 className="mt-3 text-xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
                    {result.analysis.overall.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-700 sm:text-base">
                    {result.analysis.overall.summary}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {result.analysis.overall.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-[13px] sm:text-sm leading-relaxed text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[13px] sm:text-sm font-semibold text-slate-800 transition hover:border-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:mx-auto sm:w-auto sm:px-8"
                >
                  <RotateCcw className="h-4 w-4" />
                  Calculate a different date
                </button>
              </div>
          </div>
        </section>
        )}

        {/* FAQ */}
        <section className="mt-10 mb-4 sm:mt-14">
          <h2 className="text-xl font-black tracking-tight sm:text-4xl">FAQs</h2>
          <div className="mt-4 divide-y divide-violet-100 overflow-hidden rounded-2xl border border-violet-100 bg-white sm:mt-6">
            {FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={faq.question} className={isOpen ? 'bg-violet-50/50' : ''}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-[13px] sm:text-[15px] font-semibold leading-snug focus:outline-none focus-visible:bg-violet-50 sm:px-6 sm:py-5"
                  >
                    {faq.question}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-5 text-[13px] sm:text-sm leading-relaxed text-slate-600 sm:px-6">
                      {faq.answer}
                    </p>
                  )}
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