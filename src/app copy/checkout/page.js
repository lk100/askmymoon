'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGeoLocation } from '@/lib/useGeoLocation';
import Footer from '../components/Footer';
import BrandLogo from '../components/BrandLogo';
import { 
  Gem, 
  BookOpen, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export default function Home() {
  const { country, loading } = useGeoLocation();

  const priceConfig = country === 'IN'
    ? { currencySymbol: '₹', price: '49', originalPrice: '499' }
    : { currencySymbol: '$', price: '1', originalPrice: '10' };

  // Simple Accordion State for FAQ
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqList = [
    {
      q: "How fast will I receive my astrological report?",
      a: "Generates instantly after completing your birth details and payment. You can download the full PDF right away."
    },
    {
      q: "What details do I need to provide?",
      a: "You only need your Full Name, Date of Birth, Exact Time of Birth, and Place of Birth for precise astrological calculation."
    },
    {
      q: "Are the remedy recommendations accurate?",
      a: "Yes, calculations follow true sidereal Vedic algorithms to suggest exact gemstone weights, mantras, yantras, and planetary corrections."
    },
    {
      q: "Is this a recurring subscription?",
      a: "No. This is a one-time payment for your single personalized report. There are no hidden fees or monthly charges."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans antialiased">
      
      {/* Top Utility Bar */}
      <div className="border-b border-amber-900/10 bg-[#FAF6F0] text-xs text-slate-600">
        <div className="max-w-6xl mx-auto px-6 h-9 flex items-center justify-between">
          <span>Support: 10:00 AM – 6:00 PM (IST)</span>
          <div className="flex gap-4">
            <span>Instant Digital Download</span>
            <span>•</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <BrandLogo />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="#offers" className="hover:text-amber-800 transition-colors">Features</Link>
          <Link href="#faq" className="hover:text-amber-800 transition-colors">FAQ</Link>
          <Link href="#pricing" className="hover:text-amber-800 transition-colors">Pricing</Link>
        </nav>

        <Link 
          href="#pricing" 
          className="bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all"
        >
          Get My Report
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-12">
        <div className="grid md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column Card */}
          <div className="md:col-span-7 bg-white border border-amber-900/10 rounded-2xl p-8 md:p-10 flex flex-col justify-between shadow-sm">
            <div>
              <div className="inline-block px-3 py-1 bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold rounded-md mb-4">
                Remedial Astrology Report
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                Astro Remedies 3.5
              </h1>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                A complete remedy-focused calculation system for gemstone suggestions, planetary corrections, dosha checks, charts, and downloadable PDF reports.
              </p>
              <p className="text-sm font-medium text-slate-500 mb-8">
                Every obstacle has a precise correction. Generate your personalized chart analysis instantaneously.
              </p>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link
                  href="#pricing"
                  className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  Generate Report
                </Link>
                <Link
                  href="#offers"
                  className="bg-[#FAF6F0] hover:bg-amber-100/60 text-slate-700 font-semibold text-sm px-5 py-3 rounded-xl border border-amber-900/10 transition-all"
                >
                  View Contents
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                {['Gemstones', 'Mantras', 'Yantras', 'Planetary Doshas', 'PDF Output'].map((pill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Card */}
          <div className="md:col-span-5 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-900/10 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="bg-white border border-amber-900/15 rounded-xl p-6 shadow-md mb-6 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">Sample Report Output</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">Vedic Math</span>
              </div>

              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-3 bg-slate-100 rounded w-5/6"></div>
              </div>

              <div className="mt-5 p-3 bg-amber-50 rounded-lg border border-amber-200/60 flex items-center justify-between text-xs font-semibold text-amber-900">
                <span>Calculated Ayanamsa:</span>
                <span>Lahiri (True Sidereal)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-900/5">
                <Gem className="w-4 h-4 text-amber-700" />
                <span>Gem Recommendation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-900/5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Mantra Repetitions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Astro Remedies 3.5 Offers (Image Section Implementation) */}
      <section id="offers" className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-[#FAF6F0] border border-amber-900/15 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-900 mb-2">
              What Astro Remedies 3.5 Offers
            </h2>
            <div className="w-12 h-1 bg-amber-700 rounded-full mb-3"></div>
            <p className="text-slate-600 text-sm md:text-base max-w-3xl">
              Astro Remedies 3.5 is designed for users who want practical remedy guidance, structured astrological analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Box 1 */}
            <div className="bg-white border border-amber-900/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
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
            <div className="bg-white border border-amber-900/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
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
            <div className="bg-white border border-amber-900/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
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
            <div className="bg-white border border-amber-900/10 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
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

      {/* Pricing Section */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white border border-amber-900/15 rounded-2xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">Single Report License</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 mb-2">Complete Astrological Remedies File</h3>
            <p className="text-slate-600 text-sm max-w-xl">
              Includes planetary longitudes, Rahu/Ketu nodes, ascendant breakdowns, gemstones, and personalized behavioral fixes.
            </p>
          </div>

          <div className="w-full md:w-auto text-center md:text-right shrink-0 bg-[#FAF6F0] p-6 rounded-xl border border-amber-900/10">
            <div className="flex items-baseline justify-center md:justify-end gap-2 mb-1">
              <span className="text-4xl font-extrabold text-slate-900">
                {loading ? '...' : `${priceConfig.currencySymbol}${priceConfig.price}`}
              </span>
              <span className="text-slate-400 text-sm line-through">
                {loading ? '' : `${priceConfig.currencySymbol}${priceConfig.originalPrice}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mb-4">One-time payment • No subscriptions</p>

            <Link
              href={`/checkout?country=${country}`}
              className="inline-flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm px-6 py-3 rounded-lg transition-all w-full"
            >
              <span>Download Report Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Simple FAQ Section */}
      <section id="faq" className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white border border-amber-900/15 rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Everything you need to know about generating your report.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqList.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-amber-900/10 rounded-xl bg-[#FAF6F0]/50 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-800 text-sm flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-xs text-slate-600 leading-relaxed border-t border-amber-900/5 pt-3 bg-white">
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