'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/numerology', label: 'Numerology' },
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
    <header className={`border-b border-amber-900/10 bg-[#FAF6F0]/95 ${className}`}>
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="flex min-h-16 items-center justify-between gap-4 sm:min-h-[72px]">
          <Link href="/" aria-label="AskMyMoon home" className="flex items-center">
            <BrandLogo />
          </Link>

          <nav className="hidden items-center gap-6 text-[13px] font-semibold text-slate-600 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative py-2 transition-colors hover:text-amber-800">
                {link.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-amber-800 transition-transform hover:scale-x-100" />
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-900/15 bg-white text-slate-800 shadow-sm transition hover:border-amber-700 md:hidden"
          >
            <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <div
          aria-hidden={!isOpen}
          className={`fixed inset-0 z-50 bg-slate-950/25 transition-opacity duration-200 md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setIsOpen(false)}
        >
          <nav
            className={`absolute right-0 top-0 flex h-full w-[min(86vw,340px)] flex-col border-l border-amber-900/10 bg-[#FAF6F0] px-4 pb-6 pt-4 shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
              <Link href="/" aria-label="AskMyMoon home" onClick={() => setIsOpen(false)}>
                <BrandLogo />
              </Link>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-900/15 bg-white text-slate-800 shadow-sm transition hover:border-amber-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 flex flex-1 flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-amber-50 hover:text-amber-800"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900"
            >
              {ctaLabel}
            </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
