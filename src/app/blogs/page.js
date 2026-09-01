import Link from 'next/link';
import { blogPosts, blogCategories } from '@/data/blogPosts';
import BlogCategoryExplorer from './BlogCategoryExplorer';
import Navbar from '../components/Navbar';

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
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800">
      <Navbar ctaLabel="Generate Report" ctaHref="/#birth-form" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-600 sm:text-xs sm:tracking-[0.2em]">
            Astrology insights
          </p>
          <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:mt-3 sm:text-3xl lg:text-5xl">
            Practical remedies and chart-based guidance for everyday life
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-lg">
            Explore beginner-friendly astrology resources designed to improve clarity around love, career, health, marriage timing, and spiritual balance.
          </p>
        </div>

        <BlogCategoryExplorer blogPosts={blogPosts} blogCategories={blogCategories} />
      </main>
    </div>
  );
}