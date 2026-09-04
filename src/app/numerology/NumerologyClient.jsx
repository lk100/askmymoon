'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Gift, Loader2, MapPin, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { calculateNumerology } from '@/lib/numerology';
import { calculateChart } from '@/lib/astrology';
import { fromZonedTime } from 'date-fns-tz';

const DEFAULT_TIME = { hour: '', minute: '', meridiem: 'AM' };

function buildTime(hour, minute, meridiem) {
  if (!hour || !minute) return '';
  let hours = Number(hour);
  if (meridiem === 'AM' && hours === 12) hours = 0;
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  return `${String(hours).padStart(2, '0')}:${minute}`;
}

export default function NumerologyClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', dob: '', time: '', place: '', lat: null, lon: null });
  const [timeParts, setTimeParts] = useState(DEFAULT_TIME);
  const [placeQuery, setPlaceQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
  const [numerologyResults, setNumerologyResults] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (placeQuery.trim().length < 3 || hasSelectedLocation) return undefined;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/location-search?q=${encodeURIComponent(placeQuery.trim())}`, { signal: controller.signal });
        const results = await response.json();
        setSuggestions(Array.isArray(results) ? results : []);
      } catch (error) {
        if (error.name !== 'AbortError') setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [placeQuery, hasSelectedLocation]);

  useEffect(() => {
    const closeSuggestions = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setSuggestions([]);
    };
    document.addEventListener('mousedown', closeSuggestions);
    return () => document.removeEventListener('mousedown', closeSuggestions);
  }, []);

  const selectLocation = (location) => {
    setFormData((current) => ({ ...current, place: location.display_name, lat: Number(location.lat), lon: Number(location.lon) }));
    setPlaceQuery(location.display_name);
    setHasSelectedLocation(true);
    setSuggestions([]);
  };

  const updateTime = (key, value) => {
    const nextParts = { ...timeParts, [key]: value };
    setTimeParts(nextParts);
    setFormData((current) => ({ ...current, time: buildTime(nextParts.hour, nextParts.minute, nextParts.meridiem) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.dob || !formData.time || !hasSelectedLocation) return;

    const normalizedName = formData.name.trim();
    const results = calculateNumerology(normalizedName, formData.dob);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateObj = fromZonedTime(`${formData.dob}T${formData.time}:00`, timeZone);
    const chartResults = calculateChart(dateObj, formData.lat, formData.lon, timeZone, 'vedic');
    localStorage.setItem('astro_numerology_data', JSON.stringify({
      ...formData,
      name: normalizedName,
      timeZone,
      ...chartResults,
      results,
    }));
    router.push('/numerology/report');
  };

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#26233D] antialiased">
      <Navbar ctaLabel="Astrology Report" ctaHref="/#birth-form" />

      <main className="mx-auto max-w-6xl px-3.5 py-6 sm:px-6 sm:py-10">
        <section className="flex flex-col gap-6 lg:gap-10">
          <div className="pt-2 sm:pt-8">
            <div className="inline-flex items-center gap-2 rounded-md border border-violet-200 bg-violet-100/80 px-3 py-1 text-[10px] font-semibold text-[#26233D] sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              Numerology insights for your next chapter
            </div>
            <h1 className="mt-5 text-[28px] font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
              Your numbers shape <span className="text-violet-700">your path.</span>
            </h1>
            <p className="mt-5 hidden max-w-xl text-sm leading-relaxed text-slate-600 sm:block sm:text-lg">
              Understand the energy behind your name and birth date across career, relationships, money, health, and life direction.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:mt-7 sm:gap-3">
              {['Life path and core strengths', 'Career and money tendencies', 'Relationship patterns', 'Personal yearly direction'].map((item) => (
                <div key={item} className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-700 sm:gap-2.5 sm:text-sm sm:leading-normal">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

          </div>

          <div id="numerology-form" className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-violet-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">Get your free preview</h2>
                <p className="mt-1 text-xs text-slate-500">Personalized numerology insights</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2 py-1.5 text-[9px] font-bold uppercase text-violet-800 sm:px-2.5 sm:text-[10px]">
                <Gift className="h-3.5 w-3.5" /> Free
              </span>
            </div>

            {numerologyResults ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-violet-700" />
                    <h3 className="font-bold text-slate-900">Your numerology preview</h3>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">Your core numbers are calculated from your name and birth date.</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    ['Root Number', numerologyResults.root],
                    ['Destiny Number', numerologyResults.destiny],
                    ['Life Path Number', numerologyResults.lifePath],
                    ['Personality Number', numerologyResults.personality],
                    ['Expression Number', numerologyResults.expression],
                    ['Soul Urge Number', numerologyResults.soulUrge],
                    ['Subconscious Self', numerologyResults.subconsciousSelf],
                  ].map(([label, result]) => (
                    <div key={label} className="rounded-xl border border-violet-100 bg-[#F8F7FC] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-sm font-black text-white">{result.number}</span>
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-700">{result.meaning}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-violet-100 bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Challenge Numbers</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {[['1st', numerologyResults.challengeOne], ['2nd', numerologyResults.challengeTwo], ['3rd', numerologyResults.challengeThree], ['4th', numerologyResults.challengeFour]].map(([label, result]) => (
                      <div key={label} className="rounded-lg bg-[#F8F7FC] p-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-semibold text-slate-500">{label}</span>
                          <span className="text-lg font-black text-violet-900">{result.number}</span>
                        </div>
                        <p className="mt-1 text-[10px] leading-relaxed text-slate-600">{result.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="button" onClick={() => setNumerologyResults(null)} className="w-full rounded-xl border border-violet-100 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-violet-500 hover:text-violet-900">
                  Recalculate with different details
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Full name
                  <input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="e.g. Rahul Sharma" className="mt-1.5 w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3.5 py-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                </label>

                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Date of birth
                  <input required type="date" value={formData.dob} onChange={(event) => setFormData({ ...formData, dob: event.target.value })} className="mt-1.5 w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                </label>

                <fieldset>
                  <legend className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Exact time of birth</legend>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {[
                      ['hour', 'HH', Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))],
                      ['minute', 'MM', Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))],
                    ].map(([key, label, options]) => (
                      <select required key={key} value={timeParts[key]} onChange={(event) => updateTime(key, event.target.value)} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-2 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100">
                        <option value="" disabled>{label}</option>
                        {options.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ))}
                    <select required value={timeParts.meridiem} onChange={(event) => updateTime('meridiem', event.target.value)} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-2 py-3 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </fieldset>

                <div ref={dropdownRef} className="relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Place of birth
                    <div className="relative mt-1.5">
                      <input required value={placeQuery} onChange={(event) => { setPlaceQuery(event.target.value); setHasSelectedLocation(false); setFormData({ ...formData, place: event.target.value, lat: null, lon: null }); }} placeholder="Type city name" className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3.5 py-3 pr-10 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{isSearching ? <Loader2 className="h-4 w-4 animate-spin text-violet-600" /> : <MapPin className="h-4 w-4" />}</span>
                    </div>
                  </label>
                  {suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-violet-100 bg-white shadow-lg">
                      {suggestions.map((location) => (
                        <li key={location.place_id}>
                          <button type="button" onClick={() => selectLocation(location)} className="flex w-full items-start gap-2.5 border-b border-violet-50 p-3 text-left text-xs text-slate-700 transition hover:bg-violet-50">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                            <span className="font-semibold">{location.display_name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(124,58,237,0.18)] transition hover:bg-violet-700 active:scale-[0.99]">
                  Calculate my preview <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-center text-[10px] font-medium text-slate-500">No payment required · Your complete report is free</p>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
