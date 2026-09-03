import Link from 'next/link';
import Footer from './Footer';
import Navbar from './Navbar';

export default function InfoPage({ eyebrow, title, intro, canonicalPath, children }) {
  const pageUrl = `https://www.askmymoon.com${canonicalPath}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: intro,
    url: pageUrl,
    isPartOf: { '@id': 'https://www.askmymoon.com/#website' },
    about: { '@id': 'https://www.askmymoon.com/#organization' },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar ctaLabel="Generate Report" ctaHref="/#birth-form" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <article className="bg-white border border-amber-900/15 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">{eyebrow}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">{title}</h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">{intro}</p>
          <div className="mt-8 space-y-7 text-sm sm:text-base leading-relaxed text-slate-700">{children}</div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
