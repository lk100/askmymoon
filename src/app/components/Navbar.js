'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo';

const navLinks = [
  { href: '/consultation', label: 'Consultation' },
  { href: '/blogs', label: 'Blog' },
];

const toolLinks = [
  { href: '/numerology', label: 'Numerology' },
];

export default function Navbar({
  ctaLabel = 'Get My Report',
  ctaHref = '/#birth-form',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <header className={`relative z-40 w-full border-b border-violet-100 bg-[#F7F5FB]/95 backdrop-blur ${className}`}>
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div className="relative flex min-h-14 items-center justify-between gap-4 sm:min-h-[64px]">
            <Link href="/" aria-label="AskMyMoon home" className="flex items-center">
              <BrandLogo />
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-[13px] font-semibold text-slate-700 md:flex">
            <div className="relative">
              <button
                type="button"
                aria-expanded={isToolsOpen}
                aria-haspopup="menu"
                onClick={() => setIsToolsOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 py-2 transition-colors hover:text-violet-700"
              >
                Tools
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isToolsOpen && (
                <div className="absolute left-1/2 top-full z-50 mt-2 min-w-40 -translate-x-1/2 rounded-xl border border-violet-100 bg-white p-1.5 shadow-lg shadow-violet-950/10" role="menu">
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={() => setIsToolsOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="relative py-2 transition-colors hover:text-amber-800">
                {link.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-violet-600 transition-transform hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-violet-200 bg-white text-slate-800 shadow-sm transition hover:border-violet-500 md:hidden"
          >
            <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <div
          aria-hidden={!isOpen}
          className={`fixed inset-0 z-[100] bg-slate-950/25 transition-opacity duration-200 md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setIsOpen(false)}
        >
          <nav
            className={`fixed right-0 top-0 flex h-dvh w-[min(86vw,340px)] flex-col overflow-y-auto border-l border-violet-200 bg-[#EDE7FF] px-4 pb-6 pt-4 shadow-[-18px_0_50px_rgba(76,29,149,0.18)] transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-violet-100 pb-4">
              <Link href="/" aria-label="AskMyMoon home" onClick={() => setIsOpen(false)}>
                <BrandLogo />
              </Link>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white text-slate-800 shadow-sm transition hover:border-violet-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-5 flex flex-1 flex-col gap-2">
            <button
              type="button"
              aria-expanded={isToolsOpen}
              onClick={() => setIsToolsOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
            >
              Tools
              <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>
            {isToolsOpen && (
              <div className="ml-3 border-l border-violet-200 pl-3">
                {toolLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-violet-100 hover:text-violet-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
              >
                {link.label}
              </Link>
            ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
