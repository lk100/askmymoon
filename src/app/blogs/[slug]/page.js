import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blogPosts';
import Navbar from '../../components/Navbar';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blogs/${post.slug}` },
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.askmymoon.com/blogs/${post.slug}`,
      type: 'article',
      article: {
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: ['AskMyMoon'],
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AskMyMoon',
    url: 'https://www.askmymoon.com',
    logo: 'https://www.askmymoon.com/logo.png',
    sameAs: [
      'https://www.askmymoon.com',
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'AskMyMoon',
      logo: { '@type': 'ImageObject', url: 'https://www.askmymoon.com/logo.png' },
    },
    image: 'https://www.askmymoon.com/og-image.jpg',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.askmymoon.com/blogs/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    inLanguage: 'en',
  };

  const structuredData = [articleSchema, faqSchema, organizationSchema];

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#15152B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar ctaLabel="Generate Report" ctaHref="/#birth-form" />

      <main className="mx-auto max-w-4xl px-3 py-8 sm:px-6 lg:py-16">
        <article className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-8 lg:p-12">
          {/* Meta row — wraps cleanly, smaller text on mobile */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:gap-3 sm:text-[11px] sm:tracking-[0.18em]">
            <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-900">{post.category}</span>
            <span>{post.readingTime}</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Title — scales down for small screens, tighter line-height */}
          <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight text-[#14171F] sm:mt-5 sm:text-3xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-lg">
            {post.excerpt}
          </p>

          {/* CTA banner — full width, readable on small screens */}
          <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-3 text-xs leading-relaxed text-violet-950 sm:mt-8 sm:rounded-2xl sm:p-4 sm:text-sm">
            Looking for a personalised reading? Use the AskMyMoon report generator to get chart-based remedies tailored to your birth details.
          </div>

          {/* Sections — reduced spacing on mobile */}
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700 sm:mt-10 sm:space-y-8 sm:text-base">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-black leading-snug tracking-tight text-[#14171F] sm:text-2xl">
                  {section.heading}
                </h2>
                <p className="mt-2 sm:mt-3">{section.body}</p>
              </section>
            ))}
          </div>

          {/* FAQ block */}
          <div className="mt-10 rounded-2xl border border-violet-100 bg-[#F8F7FC] p-4 sm:mt-12 sm:rounded-3xl sm:p-6">
            <h3 className="text-xl font-black text-[#14171F] sm:text-2xl">
              Frequently asked questions
            </h3>
            <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
              {post.faqs.map((faq) => (
                <div key={faq.question}>
                  <h4 className="text-base font-bold leading-snug text-[#14171F] sm:text-lg">
                    {faq.question}
                  </h4>
                  <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA — stacks vertically on mobile, full-width button */}
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:p-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-violet-700 sm:text-xs sm:tracking-[0.18em]">
                Personalised guidance
              </p>
              <h3 className="mt-1.5 text-xl font-black text-[#14171F] sm:mt-2 sm:text-2xl">
                Get your birth chart remedies
              </h3>
            </div>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800 sm:w-auto"
            >
              Generate report
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}