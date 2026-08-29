'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Loader2,
  Gift,
  Compass
} from 'lucide-react';
import { calculateChart } from '@/lib/astrology';
import Footer from './components/Footer';
import BrandLogo from './components/BrandLogo';
import { fromZonedTime } from 'date-fns-tz';

export default function Home() {
  const router = useRouter();

  // Form State embedded in Hero with added 'system' field
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    time: '',
    place: '',
    lat: null,
    lon: null,
    system: 'vedic', // Default system selection
  });

  // Location Autocomplete States
  const [placeQuery, setPlaceQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSelectedLocation, setHasSelectedLocation] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced Nominatim Geocoding Search
  useEffect(() => {
    if (placeQuery.trim().length < 3 || hasSelectedLocation) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeQuery)}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } catch (error) {
        console.error("Geocoding fetch error:", error);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [placeQuery, hasSelectedLocation]);

  // Click Outside Listener for Location Suggestions Dropdown
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
    setFormData((prev) => ({
      ...prev,
      place: formattedName,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    }));
    setPlaceQuery(formattedName);
    setHasSelectedLocation(true);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const latitude = formData.lat !== null ? formData.lat : 28.6139;
    const longitude = formData.lon !== null ? formData.lon : 77.2090;

    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      // Treat the form values as clock time in the selected timezone.
      // Date.UTC would incorrectly reinterpret that local time as UTC.
      const dateObj = fromZonedTime(
        `${formData.dob}T${formData.time}:00`,
        detectedTimeZone
      );

      // Pass the Date object into calculateChart
      const chartResults = calculateChart(
        dateObj,          // <-- Date object, not string
        latitude,
        longitude,
        detectedTimeZone,
        formData.system
      );

      const fullUserData = {
        ...formData,
        lat: latitude,
        lon: longitude,
        timeZone: detectedTimeZone,
        ...chartResults
      };

      console.log("Submitting User Payload & Chart Results:", fullUserData);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('astro_user_data', JSON.stringify(fullUserData));
        localStorage.setItem('astro_user_data', JSON.stringify(fullUserData));
      }

      router.push('/report');
    } catch (error) {
      console.error("Failed to calculate chart on submit:", error);
      alert("There was an error calculating your birth chart. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // FAQ Accordion State
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
      a: "Yes! You can currently generate your complete personalized remedy report for free with no credit card or subscription required."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans antialiased">

      {/* Top Utility Bar */}
      <div className="border-b border-amber-900/10 bg-[#FAF6F0] text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-3">
          <span className="truncate">Support: 10:00 AM – 6:00 PM (IST)</span>
          <div className="hidden sm:flex shrink-0 gap-4">
            <span className="font-semibold text-emerald-700">100% Free Access</span>
            <span>•</span>
            <span>Instant PDF Download</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-0 sm:h-20 flex items-center justify-between gap-3">
        <BrandLogo />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="#offers" className="hover:text-amber-800 transition-colors">Features</Link>
          <Link href="#faq" className="hover:text-amber-800 transition-colors">FAQ</Link>
        </nav>

     
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-10 sm:pb-12">
        <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-center">

          {/* Left Column */}
          <div className="md:col-span-6 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Vedic & Western Engine • Free Generation</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
              India&apos;s first spiritual <span className="text-amber-800">remedial tool</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
              Get instant practical Vedic remedies , dosha analysis, and lifelong energy balance measures.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
                <span>Instant detailed Kundli & planet-wise remedies</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
                <span>Downloadable PDF report generated under 12 seconds</span>
              </div>
            </div>

            {/* Pill Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {['Core Afflictions', 'Practical Remedies', 'Dosha'].map((pill, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-amber-900/10 text-slate-600 text-xs font-medium rounded-md shadow-2xs">
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Direct Birth Form Card */}
          <div id="birth-form" className="md:col-span-5 md:col-start-8 bg-white border border-amber-900/15 rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm">
            <div className="flex flex-row items-center justify-between gap-3 pb-4 border-b border-amber-900/10 mb-6">
              <div>
                <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight">Get your</h2>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">remedy file immediately</p>
              </div>
              <div className="bg-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] sm:text-xs uppercase shrink-0">
                <Gift className="w-3.5 h-3.5" />
                <span className="leading-tight sm:hidden">Free</span>
                <span className="hidden leading-tight sm:inline">Free Access</span>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#FAF6F0] border border-amber-900/15 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-800 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full bg-[#FAF6F0] border border-amber-900/15 rounded-xl px-3 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-800 transition-all"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Time of Birth
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full bg-[#FAF6F0] border border-amber-900/15 rounded-xl px-3 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-800 transition-all"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              {/* Location Autocomplete Field */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Place of Birth
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Type city name (e.g. Moradabad, U.P)"
                    className="w-full bg-[#FAF6F0] border border-amber-900/15 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-800 transition-all"
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
                  <ul className="absolute z-50 w-full mt-1 bg-white border border-amber-900/15 rounded-xl shadow-lg max-h-56 overflow-y-auto divide-y divide-amber-900/5">
                    {suggestions.map((item) => (
                      <li
                        key={item.place_id}
                        onClick={() => handleSelectLocation(item)}
                        className="p-3 text-xs text-slate-700 hover:bg-[#FAF6F0] hover:text-amber-900 cursor-pointer flex items-start gap-2.5 transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block">{item.display_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Lat: {parseFloat(item.lat).toFixed(4)}, Lon: {parseFloat(item.lon).toFixed(4)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

             

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 disabled:bg-amber-700 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-sm active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs sm:text-sm">Generating...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs sm:text-sm">Generate Free Astro Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-500 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No credit card required • Instant PDF output</span>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="bg-[#FAF6F0] border border-amber-900/15 rounded-3xl p-4 sm:p-8 md:p-10 shadow-sm">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-900 mb-2 leading-tight">
              What Astro Remedies 3.5 Offers
            </h2>
            <div className="w-12 h-1 bg-amber-700 rounded-full mb-3"></div>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed">
              Astro Remedies 3.5 is designed for users who want practical remedy guidance and structured astrological analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Box 1 */}
            <div className="bg-white border border-amber-900/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Remedies first
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focused on gemstones, rudraksha, mantras, yantras, donations, and planet-wise remedy guidance.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-white border border-amber-900/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Special dosha checks
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Includes major remedy-oriented checks such as Sadhe-Sati, Mangalik Dosha, Kaal-Sarp Yoga, and Anapatya Blemish.
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white border border-amber-900/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  Useful charts and tables
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Astrological particulars, planetary positions, kundalis, varga charts, dasha details, and more in a structured format.
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-white border border-amber-900/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center mb-4">
                  4
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
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
      <section id="faq" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white border border-amber-900/15 rounded-3xl p-4 sm:p-8 md:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-7 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Everything you need to know about generating your report.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqList.map((faq, idx) => (
              <div
                key={idx}
                className="border border-amber-900/10 rounded-xl bg-[#FAF6F0]/50 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-4 sm:px-6 py-4 text-left font-semibold text-slate-800 text-xs sm:text-sm leading-relaxed flex items-center justify-between gap-3 sm:gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-6 pb-4 text-xs text-slate-600 leading-relaxed border-t border-amber-900/5 pt-3 bg-white">
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