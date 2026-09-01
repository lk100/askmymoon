import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const consultationSteps = [
  {
    title: 'Share your life context',
    text: 'Tell us the area you want clarity on such as career, marriage, health, finance, or spiritual direction.',
  },
  {
    title: 'Understand the chart lens',
    text: 'We review your birth details, planetary patterns, and the timing blocks that influence your current path.',
  },
  {
    title: 'Receive actionable guidance',
    text: 'Get practical steps, remedies, and an honest view of what may help you move forward with confidence.',
  },
];

const focusAreas = [
  'Career guidance',
  'Relationship clarity',
  'Health & energy balance',
  'Marriage timing',
  'Wealth direction',
  'Spiritual growth',
];

export const metadata = {
  title: 'Consultation | AskMyMoon',
  description: 'Book a personalised astrology consultation for career, love, finance, and life guidance from AskMyMoon.',
  alternates: {
    canonical: '/consultation',
  },
};

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800">
      <Navbar ctaLabel="Generate Report" ctaHref="/#birth-form" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600 sm:text-xs">
              Personal guidance
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Speak with a consultation lens for your life path.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Whether you are facing uncertainty in marriage, work, finances, health, or spiritual direction, our consultation approach helps you understand the pattern and the practical next steps.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#birth-form" className="rounded-full bg-amber-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-900">
                Generate my report
              </Link>
              <Link href="/blogs" className="rounded-full border border-amber-900/15 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-amber-700 hover:text-amber-900">
                Explore blog guides
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-900/15 bg-white p-6 shadow-sm sm:p-8">
            <div className="rounded-2xl bg-[#FAF6F0] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800">Consultation snapshot</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-4 border-b border-amber-900/10 pb-2">
                  <span>Focus areas</span>
                  <span className="font-semibold text-slate-900">6 domains</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-amber-900/10 pb-2">
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
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">How it works</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">A simple and thoughtful consultation flow</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {consultationSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-900">
                  0{index + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-amber-900/15 bg-[#FAF6F0] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">Focus areas</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Topics we address in consultation</h2>
            </div>
            <Link href="/about" className="text-sm font-semibold text-amber-800 hover:text-amber-900">
              Learn about the brand →
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-amber-900/15 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">Ready to begin?</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Start with a birth report or read real guidance in the blog.</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#birth-form" className="rounded-full bg-amber-800 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-900">
              Start with your chart
            </Link>
            <Link href="/blogs" className="rounded-full border border-amber-900/15 bg-[#FAF6F0] px-5 py-3 text-sm font-semibold text-slate-700 hover:border-amber-700 hover:text-amber-900">
              Read remedy articles
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
