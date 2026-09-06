import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Astrologers | Astro Remedies',
  description: 'Choose an AI astrologer for focused, chart-based guidance.',
};

export default function AstrologersPage() {
  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#26233D]">
      <Navbar ctaLabel="Meet an astrologer" ctaHref="/astrologers" />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <section className="relative overflow-hidden rounded-[32px] border border-violet-100 bg-[radial-gradient(circle_at_top_right,_#ffffff_0%,_#f4efff_48%,_#ebe5fb_100%)] px-5 py-7 shadow-[0_18px_45px_rgba(76,29,149,0.10)] sm:px-10 sm:py-10 lg:py-14">
          <div className="relative max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-600">AskMyMoon astrologers</p>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:mt-4 sm:text-6xl">Choose the right lens for your next question.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:mt-5 sm:text-lg sm:leading-relaxed">Start with one free, chart-based question. Your birth chart and numerology profile stay together for every answer.</p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">Available now</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Meet your astrologer</h2>
            </div>
            <span className="hidden text-sm text-slate-500 sm:block">More specialists coming soon</span>
          </div>

          <Link href="/astrologers/career" className="group block rounded-[28px] border border-violet-200 bg-white p-6 shadow-[0_18px_38px_rgba(76,29,149,0.09)] transition hover:-translate-y-1 hover:border-violet-400 sm:p-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-800"><BriefcaseBusiness className="h-8 w-8" /></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900">Career Astrologer</h3>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">Live</span>
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">Understand your work strengths, timing, career direction, and the next practical move through astrology and numerology.</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-violet-800">
                    <span className="rounded-full bg-violet-50 px-3 py-1.5"><Sparkles className="mr-1 inline h-3.5 w-3.5" />1 free question</span>
                    <span className="rounded-full bg-orange-50 px-3 py-1.5 text-orange-800">₹99 per question after</span>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 group-hover:text-violet-900">Start session <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </div>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}