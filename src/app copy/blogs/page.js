import Link from 'next/link';
import { blogPosts, blogCategories } from '@/data/blogPosts';
import BlogCategoryExplorer from './BlogCategoryExplorer';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Astrology Blog & Remedies Guides',
  description: 'Explore astrology blog articles on love life, dosha remedies, career guidance, and spiritual wellness written for practical, chart-based insights.',
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: 'Astrology Blog & Remedies Guides | AskMyMoon',
    description: 'Practical astrology articles and remedies guides for love, career, marriage, and daily life balance.',
    url: 'https://www.askmymoon.com/blogs',
  },
};

export default function BlogIndexPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AskMyMoon Astrology Blog',
    description: metadata.description,
    url: 'https://www.askmymoon.com/blogs',
    isPartOf: { '@id': 'https://www.askmymoon.com/#website' },
    about: { '@id': 'https://www.askmymoon.com/#organization' },
  };

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#15152B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar ctaLabel="Generate Report" ctaHref="/#birth-form" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <section className="border-b border-[#E8E0F5] pb-8 sm:pb-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-700 sm:text-[11px]">AskMyMoon astrology journal</p>
              <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[0.98] tracking-tight text-[#14171F] sm:text-6xl lg:text-7xl">
                Ancient wisdom,
                <span className="block italic text-[#4C1D95]">real-life meaning.</span>
              </h1>
            </div>
            <div className="hidden max-w-[180px] text-right sm:block">
              <span className="font-serif text-5xl leading-none text-[#14171F]">{blogPosts.length}</span>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-violet-700">articles to explore</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 sm:hidden">
            <span className="text-xs text-[#6B6480]">Chart-based guidance for real life.</span>
            <span className="font-serif text-3xl text-[#14171F]">{blogPosts.length}</span>
          </div>
        </section>

        <BlogCategoryExplorer blogPosts={blogPosts} blogCategories={blogCategories} />
      </main>
      <Footer />
    </div>
  );
}