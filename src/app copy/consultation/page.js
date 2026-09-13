import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const consultations = [
  {
    title: 'Two-Question Consultation',
    subtitle: 'A focused founder consultation for two specific questions or life areas.',
    price: '₹999',
    scope: '2 specific questions',
    features: [
      'Personal consultation with focused guidance',
      'Birth chart + moon chart patterns',
      'Clear remedy guidance',
    ],
  },
  {
    title: 'Urgent Two-Question Consultation',
    subtitle: 'Immediate booking for two questions when you need guidance without waiting.',
    price: '₹1499',
    scope: '2 specific questions · urgent booking',
    features: [
      'Immediate booking priority',
      'Focused answers to both questions',
      'Practical remedy guidance for your situation',
    ],
  },
];

const paidHighlights = [
  'Pattern synthesis, not just data — we connect planetary placements, transits, and timing blocks together.',
  'Direct answers to your actual question — not generic astrology, but guidance specific to your life.',
  'Timing and forecasting through dasha and transit windows so you know what is coming next.',
  'A personal report you can keep and revisit instead of a one-time reading you forget.',
  'Specific remedies and practical action steps matched to your chart and current challenges.',
];

const consultationSteps = [
  { num: '01', title: 'Select a consultation', text: 'Choose the level that matches your question, life stage, and urgency.' },
  { num: '02', title: 'Share your birth details', text: 'Send your time, date, and place so we can read your chart accurately.' },
  { num: '03', title: 'Book your session', text: 'Schedule your reading and receive tailored guidance for your situation.' },
  { num: '04', title: 'Receive remedies', text: 'Get clear action steps, remedies, and the next path forward for your life.' },
];

export const metadata = {
  title: 'Consultation | Astro Remedies',
  description: 'Book a personalised Vedic astrology consultation for career, love, finance, health, and spiritual direction.',
  alternates: {
    canonical: '/consultation',
  },
};

export default function ConsultationPage() {
  const featuredCards = consultations.filter((card) => card.featured);
  const regularCards = consultations.filter((card) => !card.featured);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AskMyMoon Astrology Consultation',
    description: metadata.description,
    url: 'https://www.askmymoon.com/consultation',
    isPartOf: { '@id': 'https://www.askmymoon.com/#website' },
    about: { '@id': 'https://www.askmymoon.com/#organization' },
  };

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#26233D]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar ctaLabel="Get My Report" ctaHref="/#birth-form" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <section className="relative overflow-hidden rounded-[32px] border border-violet-100 bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f4efff_42%,_#ebe5fb_100%)] px-5 py-8 shadow-[0_18px_45px_rgba(76,29,149,0.10)] sm:px-8 lg:px-10 lg:py-12">
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 26 }).map((_, index) => (
              <span
                key={index}
                className="absolute h-1.5 w-1.5 rounded-full bg-violet-300/70"
                style={{
                  top: `${(index * 17) % 100}%`,
                  left: `${(index * 23) % 100}%`,
                  animation: `pulse 4s ease-in-out ${index * 0.25}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-600 sm:text-xs">
                Vedic astrology consultations
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Ask My Moon
                <span className="mt-2 block text-violet-900">Consultations</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Personalized one-on-one guidance for your birth chart, karmic patterns, love life, career, money, health, and spiritual direction.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/917300534975?text=Hi%2C%20I%27d%20like%20to%20book%20an%20astrology%20consultation."
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
                >
                  Book consultation
                </a>
                <Link href="/#birth-form" className="rounded-full border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-400 hover:text-violet-900">
                  Generate my report
                </Link>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3 py-2 text-xs font-medium text-slate-700 sm:text-sm">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500" />
                Flexible scheduling · 10-75 minutes · online sessions
              </div>
            </div>

            <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_14px_30px_rgba(76,29,149,0.08)] sm:p-7">
              <div className="rounded-2xl bg-[#F8F7FC] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-700">Consultation snapshot</p>
                <div className="mt-5 space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-4 border-b border-violet-100 pb-2.5">
                    <span>Focus areas</span>
                    <span className="font-semibold text-slate-900">6 domains</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-violet-100 pb-2.5">
                    <span>Best for</span>
                    <span className="font-semibold text-slate-900">Life clarity</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Delivery</span>
                    <span className="font-semibold text-slate-900">Actionable guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">What a consultation adds</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
              Beyond your free chart report
            </h2>
          </div>

          <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-sm sm:p-7">
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {paidHighlights.map((point, index) => (
                <li key={index} className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-[#F8F7FC] p-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm text-violet-800">
                    ✦
                  </span>
                  <span className="text-sm leading-relaxed text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">Choose your plan</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">Founder consultation packages</h2>
          </div>

          <div className="space-y-6">
            {featuredCards.map((card) => (
              <div key={card.title} className="rounded-[28px] border border-violet-200 bg-[linear-gradient(135deg,_#ffffff_0%,_#f4efff_100%)] p-5 shadow-[0_18px_38px_rgba(76,29,149,0.09)] sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-violet-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                    ★ {card.discount}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Most popular</span>
                </div>

                <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.subtitle}</p>

                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                      <span className="text-lg text-slate-400 line-through">{card.originalPrice}</span>
                      <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-800">
                        {card.discount}
                      </span>
                    </div>

                    <div className="mt-2 text-4xl font-black text-slate-900">{card.price}</div>
                    <p className="mt-2 text-sm font-medium text-slate-600">{card.scope}</p>
                  </div>

                  <ul className="space-y-3">
                    {card.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 rounded-2xl bg-white/80 p-3 text-sm text-slate-700">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] text-violet-800">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="grid gap-5 md:grid-cols-2">
              {regularCards.map((card) => (
                <div key={card.title} className="rounded-[26px] border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.subtitle}</p>
                    </div>
                    {card.discount && (
                      <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-violet-800">
                        {card.discount}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-base text-slate-400 line-through">{card.originalPrice}</span>
                    <span className="text-3xl font-black text-slate-900">{card.price}</span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-600">{card.scope}</p>

                  <ul className="mt-4 space-y-2.5">
                    {card.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] text-violet-800">✦</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-[28px] border border-violet-100 bg-[#F8F7FC] p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">How it works</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">A simple and thoughtful process</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {consultationSteps.map((step) => (
              <div key={step.num} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-800">
                  {step.num}
                </span>
                <h3 className="mt-4 text-lg font-black text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[28px] border border-violet-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">Reports & hard copies</p>
          <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">Premium guidance, written to keep</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
            <p>Consultation fees remain the same whether you choose a live session or a written report.</p>
            <p>Handwritten reports and physical hard copies incur an additional 42% of the consultation fee plus delivery charges.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
