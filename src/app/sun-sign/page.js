'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Briefcase, ChevronDown, Gift, Heart, HeartPulse, Loader2, MapPin, RotateCcw, Sparkles, Wallet,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  calculateSunSign,
  isValidDate,
  SIGNS,
  SIGN_ORDER,
  getSignDates,
} from '@/lib/sunSign';
import { getBirthTimeZone } from '@/lib/birthTime';

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 110 }, (_, i) => String(CURRENT_YEAR - i));

// \uFE0E forces the plain text glyph instead of a coloured emoji on phones
const glyph = (key) => `${SIGNS[key].glyph}\uFE0E`;

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// 12-hour picker values -> "HH:MM" in 24-hour time
function buildTime(hour, minute, meridiem) {
  if (!hour || !minute) return '';
  let hours = Number(hour);
  if (meridiem === 'AM' && hours === 12) hours = 0;
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  return `${String(hours).padStart(2, '0')}:${minute}`;
}

const SYSTEMS = [
  { id: 'western', label: 'Western', hint: 'Tropical zodiac. The usual sun sign.' },
  { id: 'vedic', label: 'Vedic', hint: 'Sidereal zodiac (Surya Rashi). Common in Indian astrology.' },
];

const FAQS = [
  {
    question: 'What is a sun sign?',
    answer:
      'Your sun sign is the zodiac sign the Sun was in when you were born. It is the most widely known part of astrology and describes your core personality, motivations and the way you approach life.',
  },
  {
    question: 'How do I find my sun sign?',
    answer:
      'Your date of birth is what matters. Each zodiac sign covers about 30 days, so your birthday points to one sign. Birth time and place only matter if you were born on the day the Sun changes sign. That is why we ask for them, and if you do not know your birth time you can tick the box and we will use 12:00 PM.',
  },
  {
    question: 'What is the difference between Western and Vedic sun signs?',
    answer:
      'Western astrology uses the tropical zodiac, which is tied to the seasons. Vedic astrology uses the sidereal zodiac, which is tied to the fixed stars. The two differ by about 23 to 24 degrees, so many people get a different sign in each system. For example, a mid-July birthday is Cancer in Western astrology and Gemini in Vedic astrology.',
  },
  {
    question: 'What if my birthday is on the cusp?',
    answer:
      'If you were born within a day of a sign change, you may feel traits of both neighbouring signs. On the exact day the Sun changes sign, your birth time and place decide which side you fall on, so an accurate time gives the most accurate result. The neighbouring sign can still add extra colour to your personality.',
  },
  {
    question: 'Is my sun sign the same as my moon sign or rising sign?',
    answer:
      'No. Your sun sign shows your core identity, your moon sign shows your emotional nature, and your rising sign shows how others first see you. Moon and rising signs need your exact birth time and place.',
  },
];

const USES = [
  {
    title: 'Know your core nature',
    body: 'Your sun sign sums up your basic character: what drives you, what energises you and how you tend to react when life gets busy.',
  },
  {
    title: 'Understand your strengths',
    body: 'Each sign comes with natural talents. Knowing yours helps you lean on what already works instead of forcing yourself into someone else\'s mould.',
  },
  {
    title: 'See how you connect with others',
    body: 'Signs share elements and styles. Comparing yours with a partner, friend or colleague explains why some people feel effortless and others take patience.',
  },
  {
    title: 'Plan with more awareness',
    body: 'Love, career, money and wellbeing all have sign-based tendencies. They will not decide your life, but they are a useful mirror when you make choices.',
  },
];

const SELECT_CLASS =
  'w-full appearance-none rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-3.5 text-base text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100';

const DOMAINS = [
  { id: 'love', title: 'Love', Icon: Heart },
  { id: 'career', title: 'Career', Icon: Briefcase },
  { id: 'money', title: 'Money', Icon: Wallet },
  { id: 'health', title: 'Health', Icon: HeartPulse },
];

export default function SunSignPage() {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [timeParts, setTimeParts] = useState({ hour: '', minute: '', meridiem: 'AM' });
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [placeQuery, setPlaceQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [location, setLocation] = useState(null); // { place, lat, lon, timeZone }
  const [system, setSystem] = useState('western');
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const [result, setResult] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Debounced place search (same endpoint the numerology page uses)
  useEffect(() => {
    if (placeQuery.trim().length < 3 || location) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/location-search?q=${encodeURIComponent(placeQuery.trim())}`, { signal: controller.signal });
        const results = await response.json();
        setSuggestions(Array.isArray(results) ? results : []);
      } catch (err) {
        if (err.name !== 'AbortError') setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [placeQuery, location]);

  // Close the suggestion list when clicking elsewhere
  useEffect(() => {
    const closeSuggestions = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setSuggestions([]);
    };
    document.addEventListener('mousedown', closeSuggestions);
    return () => document.removeEventListener('mousedown', closeSuggestions);
  }, []);

  const selectLocation = (item) => {
    const lat = Number(item.lat);
    const lon = Number(item.lon);
    setLocation({ place: item.display_name, lat, lon, timeZone: getBirthTimeZone(lat, lon) });
    setPlaceQuery(item.display_name);
    setSuggestions([]);
    setError('');
  };

  const updateTime = (key, value) => {
    setTimeParts((current) => ({ ...current, [key]: value }));
    setError('');
  };

  const handleUnknownTime = (checked) => {
    setTimeUnknown(checked);
    setError('');
    // Unknown birth time defaults to 12:00 PM
    setTimeParts(checked ? { hour: '12', minute: '00', meridiem: 'PM' } : { hour: '', minute: '', meridiem: 'AM' });
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    if (!name.trim() || !day || !month || !year) return;
    if (!isValidDate(Number(year), Number(month), Number(day))) {
      setError(`${Number(day)} ${MONTH_LABELS[Number(month) - 1]} ${year} is not a real date. Please check the day.`);
      return;
    }
    const time = timeUnknown ? '12:00' : buildTime(timeParts.hour, timeParts.minute, timeParts.meridiem);
    if (!time) {
      setError('Please enter your birth time, or tick the box if you do not know it.');
      return;
    }
    if (!location) {
      setError('Please choose your birth place from the suggestions.');
      return;
    }
    setError('');
    const dob = `${year}-${month}-${day}`;
    const sun = calculateSunSign(dob, system, { time, timeZone: location.timeZone, lon: location.lon });
    setResult({
      ...sun, name: name.trim(), dob, time, timeAssumed: timeUnknown, place: location.place,
    });
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setName('');
    setDay('');
    setMonth('');
    setYear('');
    setTimeParts({ hour: '', minute: '', meridiem: 'AM' });
    setTimeUnknown(false);
    setPlaceQuery('');
    setSuggestions([]);
    setLocation(null);
  };

  const formatTime = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const formatDob = (iso) => {
    const [y, m, d] = iso.split('-');
    return `${Number(d)} ${MONTH_LABELS[Number(m) - 1]} ${y}`;
  };

  const firstName = result ? result.name.split(' ')[0] : '';
  const signLabel = result ? (result.system === 'vedic' ? result.sign.vedicName : result.sign.name) : '';

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#26233D] antialiased">


      <main className="mx-auto max-w-6xl px-3.5 py-6 sm:px-6 sm:py-10">
        {!result ? (
          <>
            <section className="flex flex-col gap-6 lg:gap-10">
              <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-violet-100 sm:rounded-3xl">
                {/* zodiac glyphs as banner background */}
                <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4 grid-rows-3">
                  {SIGN_ORDER.map((key) => (
                    <span
                      key={key}
                      className="flex items-center justify-center border border-violet-200/80 text-4xl font-black text-violet-300/70 sm:text-7xl lg:text-8xl"
                    >
                      {glyph(key)}
                    </span>
                  ))}
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-violet-50/95 via-violet-50/80 to-violet-50/20 sm:via-violet-50/75 sm:to-transparent"
                />

                <div className="relative p-5 sm:p-10 lg:py-14">
                  <div className="inline-flex items-center gap-2 rounded-md border border-violet-200 bg-white/80 px-3 py-1 text-[10px] font-semibold text-[#26233D] sm:text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                    Free astrology tool
                  </div>
                  <h1 className="mt-5 max-w-2xl text-[22px] font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
                    Sun Sign Calculator: <span className="text-violet-700">find your zodiac sign by date of birth</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-slate-700 sm:text-lg">
                    Enter your birth date, time and place to see which zodiac sign the Sun was in when you were born, and what it says about your personality, love life, career, money and wellbeing.
                  </p>
                </div>
              </div>

              <div id="sunsign-form" className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-3 border-b border-violet-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold leading-tight text-slate-900 sm:text-xl">Find your sun sign</h2>
                    <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">Enter your birth details</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2 py-1.5 text-[9px] font-bold uppercase text-violet-800 sm:px-2.5 sm:text-[10px]">
                    <Gift className="h-3.5 w-3.5" /> Free
                  </span>
                </div>

                <form onSubmit={handleCalculate} className="mx-auto max-w-xl">
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
                        onChange={(e) => { setDay(e.target.value); setError(''); }}
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>Day</option>
                        {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select
                        required
                        aria-label="Month"
                        value={month}
                        onChange={(e) => { setMonth(e.target.value); setError(''); }}
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>Month</option>
                        {MONTHS.map((m, i) => <option key={m} value={m}>{MONTH_LABELS[i]}</option>)}
                      </select>
                      <select
                        required
                        aria-label="Year"
                        value={year}
                        onChange={(e) => { setYear(e.target.value); setError(''); }}
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>Year</option>
                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </fieldset>

                  <fieldset className="mt-4">
                    <legend className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Time of birth
                    </legend>
                    <div className={`grid grid-cols-3 gap-2 sm:gap-3 ${timeUnknown ? 'opacity-50' : ''}`}>
                      <select
                        required={!timeUnknown}
                        disabled={timeUnknown}
                        aria-label="Hour"
                        value={timeParts.hour}
                        onChange={(e) => updateTime('hour', e.target.value)}
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>HH</option>
                        {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <select
                        required={!timeUnknown}
                        disabled={timeUnknown}
                        aria-label="Minute"
                        value={timeParts.minute}
                        onChange={(e) => updateTime('minute', e.target.value)}
                        className={SELECT_CLASS}
                      >
                        <option value="" disabled>MM</option>
                        {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <select
                        disabled={timeUnknown}
                        aria-label="AM or PM"
                        value={timeParts.meridiem}
                        onChange={(e) => updateTime('meridiem', e.target.value)}
                        className={SELECT_CLASS}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    <label className="mt-2.5 flex cursor-pointer items-start gap-2.5 text-[12px] leading-snug text-slate-600 sm:text-[13px]">
                      <input
                        type="checkbox"
                        checked={timeUnknown}
                        onChange={(e) => handleUnknownTime(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-violet-300 accent-violet-600"
                      />
                      <span>I don&apos;t know my birth time. Use 12:00 PM.</span>
                    </label>
                  </fieldset>

                  <div ref={dropdownRef} className="relative mt-4">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Place of birth
                      <div className="relative mt-1.5">
                        <input
                          required
                          value={placeQuery}
                          onChange={(e) => {
                            setPlaceQuery(e.target.value);
                            setLocation(null);
                            setError('');
                          }}
                          placeholder="Type city name"
                          autoComplete="off"
                          className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3.5 py-3.5 pr-10 text-base font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {isSearching ? <Loader2 className="h-4 w-4 animate-spin text-violet-600" /> : <MapPin className="h-4 w-4" />}
                        </span>
                      </div>
                    </label>
                    {suggestions.length > 0 && (
                      <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-violet-100 bg-white shadow-lg">
                        {suggestions.map((item) => (
                          <li key={item.place_id}>
                            <button
                              type="button"
                              onClick={() => selectLocation(item)}
                              className="flex w-full items-start gap-2.5 border-b border-violet-50 p-3 text-left text-xs text-slate-700 transition hover:bg-violet-50"
                            >
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                              <span className="font-semibold">{item.display_name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <fieldset className="mt-4">
                    <legend className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Zodiac system
                    </legend>
                    <div role="radiogroup" className="grid grid-cols-2 gap-2 rounded-xl border border-violet-100 bg-[#F8F7FC] p-1">
                      {SYSTEMS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          role="radio"
                          aria-checked={system === s.id}
                          onClick={() => setSystem(s.id)}
                          className={`rounded-lg px-3 py-2.5 text-[13px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:text-sm ${
                            system === s.id
                              ? 'bg-violet-600 text-white shadow-sm'
                              : 'text-slate-700 hover:bg-violet-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">
                      {SYSTEMS.find((s) => s.id === system).hint}
                    </p>
                  </fieldset>

                  {error && (
                    <p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[13px] text-amber-900 sm:text-sm">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 text-[15px] font-bold text-white shadow-[0_10px_20px_rgba(124,58,237,0.18)] transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 active:scale-[0.99] sm:text-base"
                  >
                    Find my sun sign <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-3 text-center text-[11px] text-slate-500 sm:text-xs">
                    No payment required. Your sign is free.
                  </p>
                </form>
              </div>
            </section>

            {/* Explainer content */}
            <section className="mt-10 sm:mt-14">
              <div className="max-w-2xl">
                <h2 className="text-xl font-black leading-tight tracking-tight sm:text-4xl">
                  Your sun sign: the core of your personality
                </h2>
                <p className="mt-4 text-[13px] leading-relaxed text-slate-600 sm:text-base">
                  In astrology, the Sun moves through the twelve zodiac signs over the course of a year, spending about a month in each. The sign it was in on the day you were born is your sun sign.
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600 sm:text-base">
                  It is the part of astrology most people know, and for good reason. It describes your identity, your drive and the qualities you are most likely to show when you are being yourself.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                {USES.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-violet-100 border-l-4 border-l-violet-600 bg-white p-4 sm:p-5"
                  >
                    <h3 className="text-base font-bold sm:text-lg">{item.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-600 sm:text-sm">{item.body}</p>
                  </article>
                ))}
              </div>

              {/* All twelve signs at a glance */}
              <div className="mt-8 sm:mt-10">
                <h2 className="text-xl font-black tracking-tight sm:text-3xl">The twelve zodiac signs</h2>
                <p className="mt-2 text-[13px] text-slate-600 sm:text-sm">
                  Western (tropical) date ranges. Switch to Vedic in the calculator to see the sidereal sign.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                  {SIGN_ORDER.map((key) => (
                    <div key={key} className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white p-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-700 sm:h-11 sm:w-11 sm:text-2xl">
                        {glyph(key)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold leading-tight sm:text-sm">{SIGNS[key].name}</p>
                        <p className="text-[11px] text-slate-500 sm:text-xs">{getSignDates(key, 'western')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="flex flex-col gap-6 sm:gap-8">
            <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-violet-100 sm:rounded-3xl">
              <div aria-hidden="true" className="absolute inset-0 grid grid-cols-4 grid-rows-3">
                {SIGN_ORDER.map((key) => (
                  <span
                    key={key}
                    className={`flex items-center justify-center border border-violet-200/80 text-3xl font-black sm:text-6xl ${
                      key === result.key ? 'text-violet-400/80' : 'text-violet-300/60'
                    }`}
                  >
                    {glyph(key)}
                  </span>
                ))}
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-violet-50/95 via-violet-50/80 to-violet-50/30 sm:via-violet-50/75 sm:to-transparent" />
              <div className="relative p-5 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-md border border-violet-200 bg-white/80 px-3 py-1 text-[10px] font-semibold text-[#26233D] sm:text-xs">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  Your sun sign
                </div>
                <h1 className="mt-4 max-w-2xl text-[21px] font-black leading-[1.1] tracking-tight text-slate-900 sm:text-4xl">
                  {firstName}, you are a <span className="text-violet-700">{signLabel}</span>
                </h1>
                <p className="mt-2 text-[13px] font-medium text-slate-700 sm:text-base">
                  Born {formatDob(result.dob)}, {formatTime(result.time)}{result.timeAssumed ? ' (assumed)' : ''} &middot; {result.place.split(',')[0]} &middot; {result.system === 'vedic' ? 'Vedic (sidereal)' : 'Western (tropical)'}
                </p>
              </div>
            </div>

            <div className="p-4 sm:rounded-3xl sm:p-7">
              <div className="space-y-8">
                {/* Sign header + quick facts */}
                <div className="grid gap-6 md:grid-cols-[minmax(0,300px)_1fr] md:items-center md:gap-10">
                  <div className="mx-auto flex aspect-square w-full max-w-[240px] flex-col items-center justify-center rounded-3xl border-2 border-violet-400 bg-violet-50 text-violet-700 md:max-w-none">
                    <span className="text-[88px] leading-none sm:text-[120px]">{glyph(result.key)}</span>
                    <span className="mt-2 text-lg font-black sm:text-2xl">{signLabel}</span>
                    {result.system === 'vedic' && (
                      <span className="text-xs font-semibold text-violet-500 sm:text-sm">{result.sign.name}</span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-violet-700 sm:text-sm">{result.sign.tagline}</p>
                    <h2 className="mt-1 text-xl font-extrabold sm:text-3xl">
                      {signLabel} ({result.dates})
                    </h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-700 sm:text-sm">
                      {result.sign.personality}
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                      {[
                        ['Element', result.sign.element],
                        ['Quality', result.sign.modality],
                        ['Ruling planet', result.sign.ruler],
                        ['Lucky colour', result.sign.colour],
                        ['Lucky number', String(result.sign.number)],
                        ['Sun position', `${result.degreeLabel} ${signLabel}`],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-violet-50 p-3">
                          <dt className="text-[11px] font-semibold text-violet-800 sm:text-xs">{label}</dt>
                          <dd className="mt-0.5 text-[13px] font-bold leading-snug text-violet-900 sm:text-sm">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* Sign-change day / cusp notes */}
                {result.boundaryDay && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                    <h3 className="text-base font-bold sm:text-lg">The Sun changed sign on your birthday</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700 sm:text-sm">
                      {result.timeAssumed ? (
                        <>
                          You were born on the day the Sun moved from {result.system === 'vedic' ? SIGNS[result.boundarySigns[0]].vedicName : SIGNS[result.boundarySigns[0]].name} to{' '}
                          {result.system === 'vedic' ? SIGNS[result.boundarySigns[1]].vedicName : SIGNS[result.boundarySigns[1]].name}. Because your birth time is unknown, we used 12:00 PM, which gives {signLabel}. Your exact birth time could change this, so check it with a family record if you can.
                        </>
                      ) : (
                        <>
                          You were born on the day the Sun moved from {result.system === 'vedic' ? SIGNS[result.boundarySigns[0]].vedicName : SIGNS[result.boundarySigns[0]].name} to{' '}
                          {result.system === 'vedic' ? SIGNS[result.boundarySigns[1]].vedicName : SIGNS[result.boundarySigns[1]].name}. Using your birth time and place, the Sun was in {signLabel} when you were born.
                        </>
                      )}
                    </p>
                  </div>
                )}
                {!result.boundaryDay && result.cusp && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                    <h3 className="text-base font-bold sm:text-lg">
                      You are on the cusp of {result.system === 'vedic' ? result.cusp.sign.vedicName : result.cusp.sign.name}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700 sm:text-sm">
                      The Sun was very close to a sign change when you were born, so you may also recognise traits of{' '}
                      {result.system === 'vedic' ? result.cusp.sign.vedicName : result.cusp.sign.name}: {result.cusp.sign.strengths.slice(0, 3).join(', ').toLowerCase()}.
                      Your sun sign remains {signLabel}.
                    </p>
                  </div>
                )}

                {/* Strengths / challenges */}
                <div className="grid gap-3 md:grid-cols-2">
                  <article className="rounded-2xl border border-violet-100 bg-white p-4 sm:p-5">
                    <h3 className="text-base font-bold sm:text-lg">Your strengths</h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.sign.strengths.map((s) => (
                        <span key={s} className="rounded-full bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white sm:text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                    <h3 className="text-base font-bold sm:text-lg">Watch out for</h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.sign.challenges.map((c) => (
                        <span key={c} className="rounded-full border border-dashed border-amber-500 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-amber-900 sm:text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>

                {/* Life domains */}
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">Love, career, money and health</h3>
                  <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
                    What being a {signLabel} suggests for the four main areas of life.
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {DOMAINS.map(({ id, title, Icon }) => (
                      <article key={id} className="rounded-2xl border border-violet-100 bg-white p-4 sm:p-5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                            <Icon className="h-5 w-5" />
                          </span>
                          <h4 className="text-[15px] font-bold sm:text-base">{title}</h4>
                        </div>
                        <p className="mt-3 text-[13px] leading-relaxed text-slate-700 sm:text-sm">{result.sign[id]}</p>
                      </article>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500 sm:text-xs">
                    These are general astrological tendencies, not medical or financial advice.
                  </p>
                </div>

                {/* Compatibility */}
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">Most compatible signs</h3>
                  <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
                    Signs that tend to share your energy and understand your pace.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                    {result.sign.compatible.map((key) => (
                      <div key={key} className="flex flex-col items-center rounded-2xl border border-violet-100 bg-white p-3 text-center sm:p-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-2xl text-violet-700 sm:h-12 sm:w-12 sm:text-3xl">
                          {glyph(key)}
                        </span>
                        <p className="mt-2 text-[13px] font-bold sm:text-sm">
                          {result.system === 'vedic' ? SIGNS[key].vedicName : SIGNS[key].name}
                        </p>
                        <p className="text-[11px] text-slate-500 sm:text-xs">{SIGNS[key].element}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All signs */}
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">Where you sit in the zodiac</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
                    {SIGN_ORDER.map((key) => {
                      const mine = key === result.key;
                      return (
                        <div
                          key={key}
                          className={`flex flex-col items-center rounded-2xl border p-2.5 text-center sm:p-3 ${
                            mine ? 'border-2 border-violet-500 bg-violet-50' : 'border-violet-100 bg-white'
                          }`}
                        >
                          <span className={`text-2xl sm:text-3xl ${mine ? 'text-violet-700' : 'text-slate-400'}`}>{glyph(key)}</span>
                          <p className={`mt-1 text-[11px] font-bold sm:text-xs ${mine ? 'text-violet-900' : 'text-slate-700'}`}>
                            {result.system === 'vedic' ? SIGNS[key].vedicName : SIGNS[key].name}
                          </p>
                          <p className="text-[10px] text-slate-500">{getSignDates(key, result.system)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[13px] font-semibold text-slate-800 transition hover:border-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:mx-auto sm:w-auto sm:px-8 sm:text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  Check another date
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
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold leading-snug focus:outline-none focus-visible:bg-violet-50 sm:px-6 sm:py-5 sm:text-[15px]"
                  >
                    {faq.question}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-5 text-[13px] leading-relaxed text-slate-600 sm:px-6 sm:text-sm">
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