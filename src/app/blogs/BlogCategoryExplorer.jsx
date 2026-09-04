'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function BlogCategoryExplorer({ blogPosts, blogCategories }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return blogPosts;
    return blogPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory, blogPosts]);

  return (
    <>
      <div className="mt-6 sm:mt-8">
        <label htmlFor="blog-category" className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs">
          Browse by category
        </label>

        <div className="relative mt-2 max-w-md">
          <select
            id="blog-category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full appearance-none rounded-2xl border border-amber-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          >
            <option value="All">All categories</option>
            {blogCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-amber-800">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden sm:mt-5">
        <div className="marquee-track flex w-max min-w-full items-center gap-3 py-1">
          {[...blogCategories, ...blogCategories].map((category, index) => (
            <button
              key={`${category}-${index}`}
              type="button"
              onClick={() => setSelectedCategory(category === 'All' ? 'All' : category)}
              className="marquee-pill shrink-0 rounded-full border border-[#d8ae59] bg-[#f8f0df] px-2.5 py-1 text-[11px] font-medium text-[#7a4b13] transition-colors duration-200 hover:border-[#c9953d] hover:text-[#5a340c]"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-600">
        <p>
          Showing <span className="font-semibold text-slate-900">{filteredPosts.length}</span> article{filteredPosts.length === 1 ? '' : 's'}
        </p>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No articles found in this category yet. Try another category from the dropdown above.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`${index === 0 ? 'md:col-span-2 xl:col-span-3' : ''} rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm transition-transform duration-200 sm:rounded-3xl sm:p-5 sm:hover:-translate-y-1`}
            >
              {index === 0 && (
                <div className="relative mb-5 h-32 overflow-hidden rounded-xl bg-[#11081e] sm:h-44">
                  <img src={post.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-screen" />
                  <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/80 shadow-[0_0_55px_18px_rgba(139,92,246,0.28)]" />
                  <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/20" />
                  <span className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200">Featured reading</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:text-[11px] sm:tracking-[0.12em]">
                <span>{post.category}</span>
                <span>{post.readingTime}</span>
              </div>

              <h2 className="mt-3 text-lg font-black leading-snug text-slate-900 sm:mt-4 sm:text-xl sm:leading-tight">
                <Link href={`/blogs/${post.slug}`} className="hover:text-amber-800">
                  {post.title}
                </Link>
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-3">{post.excerpt}</p>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500 sm:mt-5 sm:pt-4">
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <Link href={`/blogs/${post.slug}`} className="font-semibold text-amber-900 hover:text-orange-700">
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
