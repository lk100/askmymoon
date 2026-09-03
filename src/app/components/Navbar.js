'use client';

import Link from 'next/link';
import { useState } from 'react';
import BrandLogo from './BrandLogo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blog' },
  { href: '/consultation', label: 'Consultation' },
  { href: '/about', label: 'About' },

];

export default function Navbar({
  ctaLabel = 'Get My Report',
  ctaHref = '/#birth-form',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`border-b border-amber-900/10 bg-[#FAF6F0] ${className}`}>
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="AskMyMoon home" className="flex items-center">
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-amber-800">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-full bg-amber-800 px-3.5 py-2 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-amber-900 sm:px-4 sm:text-xs"
            >
              {ctaLabel}
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-900/15 bg-white text-slate-800 shadow-sm transition hover:border-amber-700 md:hidden"
          >
            <span className="sr-only">Open menu</span>
            <div className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-slate-800 transition ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-slate-800 transition ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-slate-800 transition ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>

        {isOpen && (
          <nav className="mt-3 space-y-2 rounded-2xl border border-amber-900/10 bg-white p-3 shadow-sm md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-800"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900"
            >
              {ctaLabel}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
