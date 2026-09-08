'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  Heart,
  Sparkles,
  X,
  CheckCircle2,
  ThumbsUp,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

export default function AstrologersPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(1316);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleVote = () => {
    if (!hasVoted) {
      setVoteCount((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#26233D]">
      <Navbar ctaLabel="Meet an astrologer" ctaHref="/astrologers" />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:py-14">
        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-2xl border border-violet-100 bg-[radial-gradient(circle_at_top_right,_#ffffff_0%,_#f4efff_48%,_#ebe5fb_100%)] p-5 shadow-[0_12px_30px_rgba(76,29,149,0.08)] sm:rounded-[32px] sm:p-8 lg:p-12">
          <div className="relative max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 sm:text-[11px]">
              AskMyMoon astrologers
            </p>
            <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:mt-3 sm:text-4xl lg:text-5xl">
              Choose the right lens for your next question.
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-600 sm:mt-4 sm:text-base sm:leading-relaxed">
              Start with one free, chart-based question. Your birth chart and numerology profile stay together for every answer.
            </p>
          </div>
        </section>

        {/* Astrologers Section */}
        <section className="mt-8 sm:mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 sm:text-[11px]">
                Available now
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                Meet your astrologer
              </h2>
            </div>
            <span className="hidden text-xs text-slate-500 sm:block">
              More specialists coming soon
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Career Card */}
            <Link
              href="/astrologers/career"
              className="group block rounded-2xl border border-violet-200 bg-white p-4 shadow-[0_10px_25px_rgba(76,29,149,0.06)] transition hover:-translate-y-0.5 hover:border-violet-400 sm:rounded-3xl sm:p-6"
            >
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-800 sm:h-12 sm:w-12 sm:rounded-2xl">
                    <BriefcaseBusiness className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 sm:text-xl">
                        Career Astrologer
                      </h3>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 sm:text-[10px]">
                        Live
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:mt-1.5 sm:text-sm">
                      Understand your work strengths, timing, career direction, and the next practical move through astrology and numerology.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">
                        <Sparkles className="h-3 w-3" />
                        1 free question
                      </span>
                      <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-orange-800">
                        ₹49 per question after
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 group-hover:text-violet-900 sm:text-sm">
                    Start session
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Love & Marriage Card (Triggers Modal) */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="group cursor-pointer rounded-2xl border border-rose-100 bg-white p-4 shadow-[0_10px_25px_rgba(244,63,94,0.05)] transition hover:-translate-y-0.5 hover:border-rose-300 sm:rounded-3xl sm:p-6"
            >
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 sm:h-12 sm:w-12 sm:rounded-2xl">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 sm:text-xl">
                        Love & Marriage Astrologer
                      </h3>
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-700 sm:text-[10px]">
                        Coming Soon
                      </span>
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:mt-1.5 sm:text-sm">
                      Decode relationship timing, partner compatibility, marriage prospects, and emotional harmony with chart guidance.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">
                        <Sparkles className="h-3 w-3" />
                        Most Requested
                      </span>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                        Launch Vote Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:text-rose-800 sm:text-sm">
                    Vote to Launch
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 sm:mt-16">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 sm:text-[11px]">
              Got questions?
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
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
                    className={`h-4 w-4 shrink-0 text-violet-600 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-violet-50 px-4 pb-4 pt-3 text-xs leading-relaxed text-slate-600 sm:px-5 sm:pb-5 sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {/* Coming Soon Voting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Heart className="h-6 w-6" />
            </div>

            <div className="mt-4 text-center">
              <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Coming Soon
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
                Love & Marriage Astrologer
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
                We are currently training our specialized love and compatibility engine. Help us prioritize this feature!
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-rose-50/50 p-4 border border-rose-100 text-center">
              <p className="text-xs font-bold text-slate-700">
                Should we release this next?
              </p>
              
              {!hasVoted ? (
                <button
                  onClick={handleVote}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-rose-700 sm:text-sm"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Yes, launch this next!
                </button>
              ) : (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Vote recorded! Thanks for your input.
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>Total Community Votes</span>
                <span className="text-rose-600 font-bold">{voteCount.toLocaleString()} votes</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-500 w-[88%]" />
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}