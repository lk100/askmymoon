'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  ChevronDown,
  PenLine,
  Star,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { ASTROLOGER_CATEGORY_LIST as categories } from '@/lib/astrologerCategories';

const testimonials = [
  {
    rating: 5,
    text: 'This app helped me get clarity on my career. I was stressed about not getting an opportunity after graduation. One prediction from an astrologer gave me a ray of hope and within a few months, I had an offer in hand.',
    name: 'Amar Thakur',
    location: 'Pune · India',
  },
  {
    rating: 5,
    text: 'I was skeptical at first, but the remedies suggested actually made a difference in how I approached a tough family decision. Quick, honest, and surprisingly accurate.',
    name: 'Sneha Rao',
    location: 'Bengaluru · India',
  },
  {
    rating: 4,
    text: 'Got answers to my business questions within minutes. The astrologer was patient and explained things in a way I could actually use.',
    name: 'Rohit Malhotra',
    location: 'Delhi · India',
  },
];

const faqs = [
  {
    question: 'How are these astrologers verified?',
    answer: 'Every astrologer on our platform goes through a screening process that checks their experience, area of specialization, and consultation quality before they go live.',
  },
  {
    question: 'Can I write a review after my consultation?',
    answer: 'Yes. After any session, you can share a rating and a written review using the "Write a review" button in this section — it helps other users pick the right guide.',
  },
  {
    question: 'Is my review public?',
    answer: 'Your first name and city are shown alongside your review, similar to the examples above. You can choose to stay anonymous when submitting.',
  },
  {
    question: "What if I'm not satisfied with my consultation?",
    answer: "Reach out to our support team within 24 hours of your session and we'll help make it right, whether that's a follow-up or a resolution on the charge.",
  },
];

export default function AstrologersPage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [freeQuestionUsed, setFreeQuestionUsed] = useState(false);

  const activeTestimonial = testimonials[testimonialIndex];

  const goPrevTestimonial = () => setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const goNextTestimonial = () => setTestimonialIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewSubmitted(false);
    setReviewRating(5);
    setReviewText('');
    setReviewError('');
    setReviewSubmitting(false);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (reviewSubmitting) return;
    setReviewError('');
    setReviewSubmitting(true);

    try {
      const response = await fetch('/api/astrologer/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, reviewText }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to save your review right now.');
      }

      setReviewSubmitted(true);
    } catch (error) {
      setReviewError(error.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/astrologer/free-status', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { freeQuestionUsed: false }))
      .then((data) => {
        if (!cancelled) setFreeQuestionUsed(Boolean(data.freeQuestionUsed));
      })
      .catch(() => {
        if (!cancelled) setFreeQuestionUsed(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#1C1A2E]">
   
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-14">

        <section id="astrologers" className="scroll-mt-24">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-500 sm:text-xs">
                ASTRO SPECIALIST
              </p>
              <h2 className="mt-2 font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Consult to
                <br />
                <span className="text-purple-600">specialized</span> guide
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:rounded-3xl sm:p-6"
                >
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.iconBg}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">{cat.title}</h3>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                        Live
                      </span>
                    </div>

                    <div>
                      <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {cat.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500 sm:text-sm">
                          <strong className="font-bold text-amber-700">
                            {freeQuestionUsed ? '' : 'Claim free chat'}
                          </strong>
                        </span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition group-hover:translate-x-0.5">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Testimonials strip */}
        <section className="mt-12 sm:mt-16">
          <div className="overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 via-white to-white sm:rounded-3xl">
            <div className="grid gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 sm:text-[11px]">
                  Testimonials
                </p>
                <h2 className="mt-1.5 font-sans text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                  Real people.
                  <br />
                  <span className="text-amber-700">Real</span> reviews.
                </h2>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-3xl font-black text-amber-700 sm:text-4xl">4.8</span>
                  <div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Based on <strong className="text-slate-700">5L+</strong> reviews
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-600 sm:text-sm"
                >
                  <PenLine className="h-4 w-4" />
                  Write a review
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < activeTestimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                  "{activeTestimonial.text}"
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-xs font-black text-violet-700">
                      {activeTestimonial.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 sm:text-sm">{activeTestimonial.name}</p>
                      <p className="text-[11px] text-slate-500">{activeTestimonial.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" onClick={goPrevTestimonial} aria-label="Previous review" className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-amber-300 hover:text-amber-700">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[11px] font-medium text-slate-400">
                      {testimonialIndex + 1}/{testimonials.length}
                    </span>
                    <button type="button" onClick={goNextTestimonial} aria-label="Next review" className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-amber-300 hover:text-amber-700">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 sm:mt-16">
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 sm:text-[11px]">
              Got questions
            </p>
            <h2 className="mt-1 font-serif text-2xl font-normal text-[#14121F] sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-violet-100 bg-white shadow-sm transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                >
                  <span className="text-xs font-bold text-slate-900 sm:text-sm">{faq.question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-violet-600 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-violet-50 px-4 pb-4 pt-3 text-xs leading-relaxed text-slate-700 sm:px-5 sm:pb-5 sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <BottomNav />

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-100 bg-white p-6 shadow-2xl sm:p-8">
            <button onClick={closeReviewModal} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>

            {!reviewSubmitted ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <PenLine className="h-6 w-6" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-black text-slate-900 sm:text-2xl">Write a review</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Tell other users about your experience consulting with our astrologers.
                  </p>
                </div>

                <form onSubmit={submitReview} className="mt-6 space-y-4">
                  <div className="flex items-center justify-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const value = i + 1;
                      return (
                        <button key={value} type="button" onClick={() => setReviewRating(value)} aria-label={`Rate ${value} stars`}>
                          <Star className={`h-7 w-7 transition ${value <= reviewRating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'}`} />
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={4}
                    placeholder="Share details of your own experience with this astrologer..."
                    className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs text-slate-700 outline-none transition focus:border-amber-400 sm:text-sm"
                  />

                  {reviewError && <p className="text-xs text-rose-700">{reviewError}</p>}

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300 sm:text-sm"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit review'}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900 sm:text-xl">Thanks for sharing!</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Your review has been submitted and will appear after a quick check.
                </p>
                <button onClick={closeReviewModal} className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-amber-300 hover:text-amber-700 sm:text-sm">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}