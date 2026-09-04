'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Loader2,
  Gift,
  Compass,
  X,
} from 'lucide-react';
import { calculateChart } from '@/lib/astrology';
import Footer from './components/Footer';
import BrandLogo from './components/BrandLogo';
import Navbar from './components/Navbar';
import { fromZonedTime } from 'date-fns-tz';
import { getBirthTimeZone } from '@/lib/birthTime';

const heroPills = ['Instant Remedies', 'Career', 'Finances', 'Marriage', 'Health'];
const DEFAULT_TIME_VALUE = '';

const parseTimeInputValue = (value) => {
  if (!value) {
    return { hour: '', minute: '', meridiem: 'AM' };
  }

  const [hourValue, minuteValue] = value.split(':');
  const hours = Number(hourValue);
  const minutes = Number(minuteValue);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return { hour: '', minute: '', meridiem: 'AM' };
  }

  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const normalizedHour = ((hours + 11) % 12) + 1;

  return {
    hour: String(normalizedHour).padStart(2, '0'),
    minute: String(minutes).padStart(2, '0'),
    meridiem,
  };
};

const buildTimeFromParts = (hour, minute, meridiem) => {
  if (!hour || !minute) {
    return '';
  }

  if (!meridiem) {
    meridiem = 'AM';
  }

  let hourValue = Number(hour);

  if (meridiem === 'AM' && hourValue === 12) {
    hourValue = 0;
  }

  if (meridiem === 'PM' && hourValue !== 12) {
    hourValue += 12;
  }

  return `${String(hourValue).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    time: DEFAULT_TIME_VALUE,
    place: '',
    lat: null,
    lon: null,
    system: 'vedic',
  });
  const [timeSelector, setTimeSelector] = useState(() => parseTimeInputValue(formData.time));

  const [placeQuery, setPlaceQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
  const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
  const dropdownRef = useRef(null);
  const locationCacheRef = useRef(new Map());
  const locationRequestRef = useRef(null);
  const submitCooldownRef = useRef(0);
  const SUBMIT_COOLDOWN_MS = 3000;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowBrowserPrompt(/Instagram|FBAN|FBAV|FB_IAB|FBIOS|FB4A/i.test(navigator.userAgent));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenInBrowser = () => {
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;

    if (/Android/i.test(userAgent)) {
      const browserIntent = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;action=android.intent.action.VIEW;scheme=https;category=android.intent.category.BROWSABLE;end`;
      window.location.assign(browserIntent);
      return;
    }

    const externalLink = document.createElement('a');
    externalLink.href = currentUrl;
    externalLink.target = '_blank';
    externalLink.rel = 'noopener noreferrer';
    externalLink.click();
  };

  useEffect(() => {
    if (placeQuery.trim().length < 3 || hasSelectedLocation) {
      locationRequestRef.current?.abort();
      return;
    }

    const timer = setTimeout(async () => {
      const query = placeQuery.trim();
      const normalizedQuery = query.toLowerCase();
      const cachedSuggestions = locationCacheRef.current.get(normalizedQuery);

      if (cachedSuggestions) {
        setSuggestions(cachedSuggestions);
        setShowDropdown(cachedSuggestions.length > 0);
        return;
      }

      locationRequestRef.current?.abort();
      const controller = new AbortController();
      locationRequestRef.current = controller;
      setIsSearchingLocation(true);
      try {
        const response = await fetch(`/api/location-search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        locationCacheRef.current.set(normalizedQuery, data);
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error("Geocoding fetch error:", error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        if (!controller.signal.aborted) setIsSearchingLocation(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      locationRequestRef.current?.abort();
    };
  }, [placeQuery, hasSelectedLocation]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (place) => {
    const formattedName = place.display_name;
    const latitude = parseFloat(place.lat);
    const longitude = parseFloat(place.lon);
    const timeZone = getBirthTimeZone(latitude, longitude);
    setFormData((prev) => ({
      ...prev,
      place: formattedName,
      lat: latitude,
      lon: longitude,
      timeZone,
    }));
    setPlaceQuery(formattedName);
    setHasSelectedLocation(true);
    setSuggestions([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    setTimeSelector(parseTimeInputValue(formData.time));
  }, [formData.time]);

  const handleTimeSelectorChange = (key, value) => {
    const nextSelector = {
      ...timeSelector,
      [key]: value,
    };

    setTimeSelector(nextSelector);
    setFormData((prev) => ({
      ...prev,
      time: buildTimeFromParts(nextSelector.hour, nextSelector.minute, nextSelector.meridiem),
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const now = Date.now();
    if (isSubmitting || now - submitCooldownRef.current < SUBMIT_COOLDOWN_MS) {
      return;
    }

    const trimmedName = (formData.name || '').trim();
    if (!trimmedName) {
      alert('Please enter your full name before generating the report.');
      return;
    }

    if (!formData.dob) {
      alert('Please select your date of birth before generating the report.');
      return;
    }

    if (!formData.time || !/^\d{2}:\d{2}$/.test(formData.time)) {
      alert('Please select your exact time of birth before generating the report.');
      return;
    }

    if (formData.lat === null || formData.lon === null || !hasSelectedLocation) {
      alert('Please choose your place of birth from the location suggestions so we can use accurate coordinates.');
      return;
    }

    submitCooldownRef.current = now;
    setIsSubmitting(true);

    const safeTime = formData.time;
    const latitude = formData.lat;
    const longitude = formData.lon;

    const timeZone = formData.timeZone || getBirthTimeZone(latitude, longitude);

    try {
      const dateObj = fromZonedTime(
        `${formData.dob}T${safeTime}:00`,
        timeZone
      );

      const chartResults = calculateChart(
        dateObj,
        latitude,
        longitude,
        timeZone,
        formData.system
      );

      const fullUserData = {
        ...formData,
        name: trimmedName,
        time: safeTime,
        lat: latitude,
        lon: longitude,
        timeZone,
        ...chartResults
      };

      console.log("Submitting User Payload & Chart Results:", fullUserData);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('astro_user_data', JSON.stringify(fullUserData));
        localStorage.setItem('astro_user_data', JSON.stringify(fullUserData));
      }

      window.location.assign('/report');
    } catch (error) {
      console.error("Failed to calculate chart on submit:", error);
      alert("There was an error calculating your birth chart. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const faqList = [
    {
      q: "How fast will I receive my astrological report?",
      a: "Generates instantly right after submitting your birth details. You can view and download the full report immediately."
    },
    {
      q: "What details do I need to provide?",
      a: "You only need your Full Name, Date of Birth, Exact Time of Birth, and Place of Birth for precise astrological calculation."
    },
    {
      q: "Are the remedy recommendations accurate?",
      a: "Yes, calculations follow true sidereal Vedic algorithms (Lahiri Ayanamsa) or Western Tropical placements depending on your choice to suggest exact remedies, mantras, and planetary corrections."
    },
    {
      q: "Is this completely free?",
      a: "You can generate a free preview with your core planetary insights. The complete personalized remedy report is available to unlock for ₹49."
    }
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F7F5FB] text-[#26233D] font-sans antialiased">
      {showBrowserPrompt && (
        <div className="border-b border-amber-700/20 bg-amber-50 px-3 py-3 sm:px-6" role="status">
          <aside
            aria-labelledby="browser-prompt-title"
            className="mx-auto flex max-w-6xl items-start gap-3"
          >
            <div className="min-w-0 flex-1">
              <h2 id="browser-prompt-title" className="text-xs font-bold text-amber-900 sm:text-sm">
                Open in your external browser for the best experience
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                You are viewing AskMyMoon inside Instagram. Open this page in your external browser for reliable payment and PDF downloads.
              </p>
          
            </div>
            <button type="button" onClick={() => setShowBrowserPrompt(false)} aria-label="Close browser notice" className="shrink-0 rounded-md p-1 text-amber-900 transition hover:bg-amber-200">
              <X className="h-4 w-4" />
            </button>
          </aside>
        </div>
      )}

      <Navbar />

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto overflow-hidden px-3 sm:px-6 pt-8 sm:pt-12 pb-10 sm:pb-16">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[70px] z-0 h-[390px] w-[390px] -translate-x-1/2 opacity-25 lg:bottom-0 lg:left-[-6rem] lg:top-auto lg:h-[420px] lg:w-[420px] lg:translate-x-0 lg:opacity-60">
          <div className="absolute inset-12 rounded-full border border-violet-200/80" />
          <div className="absolute inset-24 rounded-full border border-violet-200/70" />
          <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-300 to-violet-700 shadow-[0_0_45px_12px_rgba(139,92,246,0.2)] lg:h-24 lg:w-24" />
          <span className="absolute right-16 top-20 h-3 w-3 rounded-full bg-violet-400" />
          <span className="absolute left-20 top-10 h-2 w-2 rounded-full bg-violet-300" />
        </div>
        <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-center">

          {/* Left Column */}
          <div className="relative z-10 md:col-span-6 space-y-4 sm:space-y-6 min-w-0">
            <div className="relative inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-md border border-violet-200 bg-violet-100/80 px-2.5 py-1 text-[10px] font-semibold text-[#26233D] sm:px-3 sm:text-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-600 shrink-0" />
              <span className="truncate">Free preview • Full personalized report ₹49</span>
            </div>

            <h1 className="font-serif text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[4.4rem] font-normal text-[#17152B] leading-[0.98] tracking-tight">
              Ancient wisdom,
              <span className="block italic text-violet-600">personal clarity.</span>
            </h1>

            <p className="hidden max-w-xl text-[#39344F] text-sm leading-relaxed sm:block sm:text-base md:text-lg">
              Read the patterns in your birth chart and turn ancient planetary wisdom into clearer decisions for career, love, money, and health.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-[#39344F] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 shrink-0 mt-0.5 sm:mt-0" />
                <span>See your planetary patterns in a free preview</span>
              </div>

              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600 shrink-0 mt-0.5 sm:mt-0" />
                <span>Unlock the complete remedy report instantly</span>
              </div>

              <div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] font-semibold text-[#39344F] sm:text-xs">
                <span>Total visitors: <strong className="text-violet-800">1,000</strong></span>
                <span className="text-violet-300" aria-hidden="true">|</span>
                <span>Total reports generated: <strong className="text-violet-800">27</strong></span>
              </div>
            </div>

            {/* Pill Tags — auto-scrolling marquee */}
            <div
              className="pt-3 sm:pt-4 w-full max-w-full overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              }}
            >
              <div className="marquee-track flex w-max gap-2">
                {[...heroPills, ...heroPills].map((pill, i) => (
                  <span
                    key={i}
                    className="shrink-0 rounded-md border border-violet-200 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#39344F] shadow-2xs sm:px-3 sm:text-xs"
                  >
                    {pill}
                  </span>
                ))}
              </div>

            </div>
          </div>

          {/* Right Column: Direct Birth Form Card */}
          <div id="birth-form" className="relative z-10 w-full max-w-full min-w-0 md:col-span-5 md:col-start-8 bg-white border border-violet-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(63,35,99,0.10)]">
            <div className="relative mb-3 sm:mb-5 pb-3 sm:pb-4 border-b border-violet-100">
              <div className="flex flex-row items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">Get</h2>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">your personalized report</p>
                </div>
                <div className="bg-violet-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-violet-200 flex items-center gap-1 text-violet-700 font-bold text-[9px] sm:text-xs uppercase shrink-0">
                  <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="leading-tight sm:hidden">Free Preview</span>
                  <span className="hidden leading-tight sm:inline">Free Preview</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#F8F7FC] border border-violet-100 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                <div className="min-w-0 w-full">
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    style={{ minWidth: 0, width: '100%' }}
                    className="w-full max-w-full min-w-0 bg-[#F8F7FC] border border-violet-100 rounded-xl px-3 py-2.5 sm:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
                <div className="min-w-0 w-full">
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Time of Birth
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full min-w-0">
                    <select
                      required
                      value={timeSelector.hour}
                      onChange={(e) => handleTimeSelectorChange('hour', e.target.value)}
                      className="w-full min-w-0 bg-[#F8F7FC] border border-violet-100 rounded-xl px-2 py-2.5 sm:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    >
                      <option value="" disabled>HH</option>
                      {Array.from({ length: 12 }, (_, index) => {
                        const value = String(index + 1).padStart(2, '0');
                        return (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      required
                      value={timeSelector.minute}
                      onChange={(e) => handleTimeSelectorChange('minute', e.target.value)}
                      className="w-full min-w-0 bg-[#F8F7FC] border border-violet-100 rounded-xl px-2 py-2.5 sm:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    >
                      <option value="" disabled>MM</option>
                      {Array.from({ length: 60 }, (_, index) => {
                        const value = String(index).padStart(2, '0');
                        return (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      required
                      value={timeSelector.meridiem || 'AM'}
                      onChange={(e) => handleTimeSelectorChange('meridiem', e.target.value)}
                      className="w-full min-w-0 bg-[#F8F7FC] border border-violet-100 rounded-xl px-2 py-2.5 sm:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location Autocomplete Field */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Place of Birth
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Type city name (e.g. Moradabad, U.P)"
                    className="w-full bg-[#F8F7FC] border border-violet-100 rounded-xl pl-3.5 sm:pl-4 pr-10 py-2.5 sm:py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    value={placeQuery}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setPlaceQuery(nextValue);
                      setHasSelectedLocation(false);
                      setFormData((prev) => ({ ...prev, place: nextValue, lat: null, lon: null }));
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {isSearchingLocation ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                    ) : (
                      <MapPin className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Geo Suggestions Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 bg-white border border-violet-100 rounded-xl shadow-lg max-h-56 overflow-y-auto divide-y divide-violet-100">
                    {suggestions.map((item) => (
                      <li
                        key={item.place_id}
                        onClick={() => handleSelectLocation(item)}
                        className="p-3 text-xs text-slate-700 hover:bg-violet-50 hover:text-violet-800 cursor-pointer flex items-start gap-2.5 transition-colors active:bg-violet-50"
                      >
                        <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <span className="font-semibold block break-words">{item.display_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Lat: {parseFloat(item.lat).toFixed(4)}, Lon: {parseFloat(item.lon).toFixed(4)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-1.5 sm:pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-3.5 px-6 rounded-xl text-sm transition-all shadow-[0_10px_20px_rgba(124,58,237,0.18)] active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs sm:text-sm">Generating...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs sm:text-sm">Get My Free Preview</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 whitespace-nowrap pt-1 text-[9px] font-medium text-slate-500 sm:text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>No payment required • Instant results • ₹49 full report</span>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="bg-white/75 border border-violet-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-sm">
          <div className="mb-5 sm:mb-8">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-violet-900 mb-2 leading-tight">
              Birth Chart Remedy Tool & Astrology Software
            </h2>
            <div className="w-10 sm:w-12 h-1 bg-violet-500 rounded-full mb-2.5 sm:mb-3"></div>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed">
              Astro Remedies 3.5 is designed for users who want practical remedy guidance and structured astrological analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

            {/* Box 1 */}
            <div className="bg-white border border-violet-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center mb-3 sm:mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 sm:mb-2">
                  Remedies first
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focused on gemstones, rudraksha, mantras, yantras, donations, and planet-wise remedy guidance.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white border border-violet-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center mb-3 sm:mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 sm:mb-2">
                  Special dosha checks
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Includes major remedy-oriented checks such as Sadhe-Sati, Mangalik Dosha, Kaal-Sarp Yoga, and Anapatya Blemish.
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white border border-violet-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center mb-3 sm:mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 sm:mb-2">
                  Useful charts and tables
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Astrological particulars, planetary positions, kundalis, varga charts, dasha details, and more in a structured format.
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-white border border-violet-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center mb-3 sm:mb-4">
                  4
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 sm:mb-2">
                  Print-friendly output
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Good for astrologers who need clear sample-style reports, work screens, and printable remedy presentations.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        <div className="bg-white/75 border border-violet-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Everything you need to know about generating your report.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
            {faqList.map((faq, idx) => (
              <div
                key={idx}
                className="border border-violet-100 rounded-xl bg-violet-50/50 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-3.5 sm:px-6 py-3.5 sm:py-4 text-left font-semibold text-slate-800 text-xs sm:text-sm leading-relaxed flex items-center justify-between gap-3 sm:gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-3.5 sm:px-6 pb-3.5 sm:pb-4 text-xs text-slate-600 leading-relaxed border-t border-violet-100 pt-3 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}