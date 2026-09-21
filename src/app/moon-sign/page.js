'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ChevronDown, Gift, Heart, HeartPulse, Home, Loader2, MapPin, Moon, RotateCcw, Sparkles,
} from 'lucide-react';
import Footer from '../components/Footer';
import { isValidDate, SIGNS, SIGN_ORDER } from '@/lib/sunSign';
import { calculateMoonSign } from '@/lib/moonSign';
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
  { id: 'western', label: 'Western', hint: 'Tropical zodiac. The usual moon sign.' },
  { id: 'vedic', label: 'Vedic', hint: 'Sidereal zodiac (Chandra Rashi) with your Nakshatra. Common in Indian astrology.' },
];

const FAQS = [
  {
    question: 'What is a moon sign?',
    answer:
      'Your moon sign is the zodiac sign the Moon was in when you were born. While the sun sign shows your core identity, the moon sign describes your inner emotional world: how you feel, what comforts you and how you react when you are stressed or relaxed.',
  },
  {
    question: 'Why do I need my birth time and place?',
    answer:
      'The Moon is the fastest-moving body in astrology. It changes sign every two to three days and travels about 13 degrees in a single day. Your birth time, converted to universal time using your birth place, tells us exactly where the Moon was. Without it, the sign can be off by one on many birthdays.',
  },
  {
    question: 'What if I do not know my birth time?',
    answer:
      'Tick the box and we will use 12:00 PM. In roughly 4 out of 5 cases the Moon stays in one sign for the whole day and the result is correct. When the Moon changes sign during your birth date, we will tell you which two signs are possible and at what time it switches, so you can check against a birth certificate or family record.',
  },
  {
    question: 'What is the difference between Western and Vedic moon signs?',
    answer:
      'Western astrology uses the tropical zodiac, tied to the seasons. Vedic astrology uses the sidereal zodiac, tied to the fixed stars, which sits about 24 degrees behind. Because of this, your Vedic moon sign (Chandra Rashi) is often the previous sign of your Western moon sign. Vedic astrology also names your Nakshatra, the lunar mansion the Moon was in, which is used for your janma nakshatra and naming.',
  },
  {
    question: 'How is the moon sign different from the sun and rising signs?',
    answer:
      'The sun sign is your outer identity and drive, the moon sign is your emotional nature and instincts, and the rising sign is the impression you make on others. Many people feel their moon sign describes them more truthfully in private than their sun sign does.',
  },
];

const USES = [
  {
    title: 'Understand your emotions',
    body: 'Your moon sign explains why you react the way you do, what soothes you and what quietly stresses you out.',
  },
  {
    title: 'Know what you need to feel safe',
    body: 'Some moons need space, some need closeness, some need routine. Knowing yours helps you ask for the right things.',
  },
  {
    title: 'Improve your relationships',
    body: 'Emotional compatibility often depends more on the moon than the sun. Comparing moon signs shows how you and a partner comfort each other.',
  },
  {
    title: 'Look after your wellbeing',
    body: 'Every moon sign has its own way of handling stress. Recognising your pattern makes it easier to recharge before you burn out.',
  },
];

const SELECT_CLASS =
  'w-full appearance-none rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-3.5 text-base text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100';

const DOMAINS = [
  { id: 'emotions', title: 'Emotional style', Icon: Moon },
  { id: 'love', title: 'Love', Icon: Heart },
  { id: 'home', title: 'Home and family', Icon: Home },
  { id: 'wellbeing', title: 'Stress and wellbeing', Icon: HeartPulse },
];

export default function MoonSignPage() {
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

  // Debounced place search (same endpoint the sun sign / numerology pages use)
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
    const moon = calculateMoonSign(dob, {
      time, timeZone: location.timeZone, lon: location.lon, system, timeAssumed: timeUnknown,
    });
    if (!moon) {
      setError('Something went wrong reading your birth details. Please check them and try again.');
      return;
    }
    setResult({
      ...moon, name: name.trim(), dob, time, timeAssumed: timeUnknown, place: location.place,
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

  const vedic = result?.system === 'vedic';
  const nameOf = (key) => (vedic ? SIGNS[key].vedicName : SIGNS[key].name);
  const firstName = result ? result.name.split(' ')[0] : '';
  const signLabel = result ? nameOf(result.key) : '';

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
                    Moon Sign Calculator: <span className="text-violet-700">find your moon sign by date, time and place of birth</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-slate-700 sm:text-lg">
                    Enter your birth details to see which zodiac sign the Moon was in when you were born, and what it says about your emotions, love life, home and wellbeing.
                  </p>
                </div>
              </div>

              <div id="moonsign-form" className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
                <div className="mb-5 flex items-start justify-between gap-3 border-b border-violet-100 pb-4">
                  <div>
                    <h2 className="text-base font-extrabold leading-tight text-slate-900 sm:text-xl">Find your moon sign</h2>
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
                    Find my moon sign <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-3 text-center text-[11px] text-slate-500 sm:text-xs">
                    No payment required. Your moon sign is free.
                  </p>
                </form>
              </div>
            </section>

            {/* Explainer content */}
            <section className="mt-10 sm:mt-14">
              <div className="max-w-2xl">
                <h2 className="text-xl font-black leading-tight tracking-tight sm:text-4xl">
                  Your moon sign: the heart of your inner world
                </h2>
                <p className="mt-4 text-[13px] leading-relaxed text-slate-600 sm:text-base">
                  The Moon circles the zodiac roughly every 27 days, spending only two to three days in each sign. The sign it was in at the moment of your birth is your moon sign.
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600 sm:text-base">
                  Where your sun sign shows who you are becoming, your moon sign shows how you feel, what comforts you and how you respond when nobody is watching. In Vedic astrology it is even more important, and it is the basis of your Rashi and Nakshatra.
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
                <h2 className="text-xl font-black tracking-tight sm:text-3xl">The twelve moon signs</h2>
                <p className="mt-2 text-[13px] text-slate-600 sm:text-sm">
                  The Moon changes sign every two to three days, so there are no fixed date ranges. Your exact birth time and place decide your sign.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                  {SIGN_ORDER.map((key) => (
                    <div key={key} className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white p-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-700 sm:h-11 sm:w-11 sm:text-2xl">
                        {glyph(key)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold leading-tight sm:text-sm">{SIGNS[key].name}</p>
                        <p className="text-[11px] text-slate-500 sm:text-xs">{SIGNS[key].vedicName} &middot; {SIGNS[key].element}</p>
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
                  <Moon className="h-3.5 w-3.5 text-violet-600" />
                  Your moon sign
                </div>
                <h1 className="mt-4 max-w-2xl text-[21px] font-black leading-[1.1] tracking-tight text-slate-900 sm:text-4xl">
                  {firstName}, your Moon is in <span className="text-violet-700">{signLabel}</span>
                </h1>
                <p className="mt-2 text-[13px] font-medium text-slate-700 sm:text-base">
                  Born {formatDob(result.dob)}, {formatTime(result.time)}{result.timeAssumed ? ' (assumed)' : ''} &middot; {result.place.split(',')[0]} &middot; {vedic ? 'Vedic (sidereal)' : 'Western (tropical)'}
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
                    {vedic && (
                      <span className="text-xs font-semibold text-violet-500 sm:text-sm">{result.sign.name}</span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-violet-700 sm:text-sm">{result.traits.tagline}</p>
                    <h2 className="mt-1 text-xl font-extrabold sm:text-3xl">
                      Moon in {signLabel}
                    </h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-700 sm:text-sm">
                      {result.traits.emotions}
                    </p>
                    <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                      {[
                        ['Element', result.sign.element],
                        ['Quality', result.sign.modality],
                        ['Sign ruler', result.sign.ruler],
                        ['Moon position', `${result.degreeLabel} ${signLabel}`],
                        ...(result.nakshatra
                          ? [
                              ['Nakshatra', `${result.nakshatra.name} (pada ${result.nakshatra.pada})`],
                              ['Nakshatra lord', result.nakshatra.lord],
                            ]
                          : [
                              ['Lucky colour', result.sign.colour],
                              ['Lucky number', String(result.sign.number)],
                            ]),
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-violet-50 p-3">
                          <dt className="text-[11px] font-semibold text-violet-800 sm:text-xs">{label}</dt>
                          <dd className="mt-0.5 text-[13px] font-bold leading-snug text-violet-900 sm:text-sm">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* Unknown time: the Moon changed sign during the birth day */}
                {result.boundary && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                    <h3 className="text-base font-bold sm:text-lg">The Moon changed sign on your birthday</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700 sm:text-sm">
                      On {formatDob(result.dob)} the Moon moved from {nameOf(result.boundary.keys[0])} to {nameOf(result.boundary.keys[1])} at about {result.boundary.changeAt} local time. Because your birth time is unknown, we used 12:00 PM, which gives {signLabel}. If you were born {result.boundary.keys[0] === result.key ? 'after' : 'before'} {result.boundary.changeAt}, your moon sign is {nameOf(result.boundary.keys[0] === result.key ? result.boundary.keys[1] : result.boundary.keys[0])} instead. A birth certificate or family record can settle it.
                    </p>
                  </div>
                )}

                {/* Known time: very close to a sign edge */}
                {result.cusp && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                    <h3 className="text-base font-bold sm:text-lg">
                      Your Moon was close to {nameOf(result.cusp.key)}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700 sm:text-sm">
                      The Moon was within a few minutes of a sign change when you were born. If your recorded birth time is off by even 30 to 40 minutes, your moon sign could be {nameOf(result.cusp.key)}. You may also recognise some of its traits: {result.cusp.sign.strengths.slice(0, 3).join(', ').toLowerCase()}. Your moon sign here remains {signLabel}.
                    </p>
                  </div>
                )}

                {/* Strengths / challenges */}
                <div className="grid gap-3 md:grid-cols-2">
                  <article className="rounded-2xl border border-violet-100 bg-white p-4 sm:p-5">
                    <h3 className="text-base font-bold sm:text-lg">Your emotional strengths</h3>
                    <p className="mt-2 text-[12px] text-slate-600 sm:text-[13px]">
                      <span className="font-semibold text-slate-800">You need:</span> {result.traits.needs}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.traits.strengths.map((s) => (
                        <span key={s} className="rounded-full bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white sm:text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                    <h3 className="text-base font-bold sm:text-lg">Watch out for</h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.traits.challenges.map((c) => (
                        <span key={c} className="rounded-full border border-dashed border-amber-500 bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-amber-900 sm:text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </article>
                </div>

                {/* Life domains */}
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">Emotions, love, home and wellbeing</h3>
                  <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
                    What having the Moon in {signLabel} suggests for the way you feel and connect.
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
                        <p className="mt-3 text-[13px] leading-relaxed text-slate-700 sm:text-sm">{result.traits[id]}</p>
                      </article>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500 sm:text-xs">
                    These are general astrological tendencies, not medical or psychological advice.
                  </p>
                </div>

                {/* Compatibility */}
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">Emotionally compatible moon signs</h3>
                  <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
                    Moons that tend to understand how you feel and comfort you naturally.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                    {result.traits.compatible.map((key) => (
                      <div key={key} className="flex flex-col items-center rounded-2xl border border-violet-100 bg-white p-3 text-center sm:p-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-2xl text-violet-700 sm:h-12 sm:w-12 sm:text-3xl">
                          {glyph(key)}
                        </span>
                        <p className="mt-2 text-[13px] font-bold sm:text-sm">{nameOf(key)}</p>
                        <p className="text-[11px] text-slate-500 sm:text-xs">{SIGNS[key].element}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All signs */}
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">Where your Moon sits in the zodiac</h3>
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
                            {nameOf(key)}
                          </p>
                          <p className="text-[10px] text-slate-500">{SIGNS[key].element}</p>
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
                  Check another birth
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