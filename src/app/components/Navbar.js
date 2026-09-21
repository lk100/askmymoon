'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Grid3x3,
  Menu,
  MessageCircle,
  Sparkles,
  User,
  Users,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import AuthModal from './AuthModal';
import { getSupabaseBrowser } from '@/lib/supabaseBrowser';

const navLinks = [
  { href: '/astrologers', label: 'Astrologers', icon: Users },
  { href: '/consultation', label: 'Consultation', icon: MessageCircle },
];

// Every tool listed here automatically appears in BOTH the desktop "Tools"
// dropdown and the mobile "Tools" card section.
const toolLinks = [
  { href: '/numerology', label: 'Numerology', icon: Sparkles },
  { href: '/lo-shu-grid', label: 'Lo Shu Grid Calculator', icon: Grid3x3 },
  {href: '/sun-sign', label: 'Sun Sign Calculator', icon: Sun},
  {href: '/moon-sign', label: 'Moon Sign Calculator', icon: Moon},
];

// Turns an email into a friendly display name, e.g.
// "rahul.sharma99@gmail.com" -> "Rahul.sharma99".
function getDisplayName(email) {
  if (!email || typeof email !== 'string') return '';
  const localPart = email.split('@')[0];
  if (!localPart) return email;
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}

// A grouped section label, e.g. "EXPLORE".
function SectionLabel({ children }) {
  return (
    <p className="mb-2 mt-5 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 first:mt-0">
      {children}
    </p>
  );
}

// One row in a card group: icon in a circle, label, chevron.
function MenuCard({ href, label, icon: Icon, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-violet-300 hover:bg-violet-50/60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm font-semibold text-slate-800">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </Link>
  );
}

export default function Navbar({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [authedEmail, setAuthedEmail] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const toolsRef = useRef(null);
  const headerRef = useRef(null);

  // Flip once the page scrolls past a small threshold — drives the
  // transparent -> frosted-glass swap on every breakpoint.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Publish the real rendered header height as a CSS var so the layout can
  // reserve exactly that much space (the header is `fixed`).
  useEffect(() => {
    const setVar = () => {
      document.documentElement.style.setProperty(
        '--navbar-height',
        `${headerRef.current?.offsetHeight || 0}px`
      );
    };
    setVar();
    window.addEventListener('resize', setVar);
    return () => window.removeEventListener('resize', setVar);
  }, []);

  // Site-wide auth state — Supabase Auth cookies are shared across every
  // page on the domain, so signing in here (or on any astrologer page)
  // updates the navbar everywhere.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      setAuthedEmail(data?.user?.email || null);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthedEmail(session?.user?.email || null);
    });
    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // Close the desktop Tools dropdown on outside click.
  useEffect(() => {
    if (!isToolsOpen) return;
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isToolsOpen]);

  // Close the desktop profile dropdown on outside click.
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Same for the mobile-menu profile dropdown (separate state/ref since both
  // buttons exist in the DOM at once, just shown/hidden responsively).
  useEffect(() => {
    if (!isMobileProfileOpen) return;
    const handleClickOutside = (event) => {
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target)) {
        setIsMobileProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileProfileOpen]);

  // Escape closes every open menu.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsToolsOpen(false);
        setIsProfileOpen(false);
        setIsMobileProfileOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    if (authedEmail) {
      setIsProfileOpen((prev) => !prev);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    setIsMobileProfileOpen(false);
    // Remaining state cleanup happens in the onAuthStateChange listener.
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-violet-100/80 bg-white/80 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-transparent backdrop-blur-0'
      } ${className}`}
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="relative flex min-h-14 items-center justify-between gap-4 sm:min-h-[64px]">
          <Link href="/" aria-label="AskMyMoon home" className="flex items-center gap-2">
            <BrandLogo />
            <span className="font-sans text-lg font-bold tracking-tight text-slate-600 sm:text-xl">
              AskMyMoon
            </span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-[13px] font-semibold text-slate-700 md:flex">
            {/* Tools dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                type="button"
                aria-expanded={isToolsOpen}
                aria-haspopup="menu"
                onClick={() => setIsToolsOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 py-2 transition-colors hover:text-violet-700"
              >
                Tools
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isToolsOpen && (
                <div
                  className="absolute left-1/2 top-full z-50 mt-2 min-w-52 -translate-x-1/2 rounded-xl border border-violet-100 bg-white p-1.5 shadow-lg shadow-violet-950/10"
                  role="menu"
                >
                  {toolLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        role="menuitem"
                        onClick={() => setIsToolsOpen(false)}
                        className="flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-violet-500" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative py-2 transition-colors hover:text-violet-700"
              >
                {link.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-violet-600 transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
            <Link
              href="/blogs"
              className="group relative py-2 transition-colors hover:text-violet-700"
            >
              Blog
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-violet-600 transition-transform group-hover:scale-x-100" />
            </Link>
          </nav>

          {/* Desktop: compact profile icon with dropdown */}
          <div className="relative hidden items-center md:flex" ref={profileRef}>
            <button
              type="button"
              onClick={handleProfileClick}
              aria-label={authedEmail ? 'Account menu' : 'Sign in'}
              aria-expanded={authedEmail ? isProfileOpen : undefined}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                authedEmail
                  ? 'border-violet-200 bg-violet-100 text-violet-700 hover:bg-violet-200'
                  : 'border-violet-200 bg-white text-slate-600 hover:border-violet-500 hover:text-violet-700'
              }`}
            >
              <User className="h-4 w-4" />
            </button>
            {authedEmail && isProfileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-violet-100 bg-white p-1.5 shadow-lg shadow-violet-950/10">
                <div className="truncate px-3 py-2 text-sm font-semibold text-slate-800">
                  {getDisplayName(authedEmail)}
                </div>
                <div className="my-1 h-px bg-violet-50" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>

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

        {/* Mobile slide-out menu — grouped card sections */}
        <div
          aria-hidden={!isOpen}
          className={`fixed inset-0 z-[100] bg-slate-950/25 transition-opacity duration-200 md:hidden ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        >
          <nav
            className={`fixed right-0 top-0 flex h-dvh w-[min(86vw,340px)] flex-col overflow-y-auto border-l border-violet-200 bg-[#F7F5FB] px-4 pb-6 pt-4 shadow-[-18px_0_50px_rgba(76,29,149,0.18)] transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header row: logo + profile + close */}
            <div className="flex items-center justify-between border-b border-violet-100 pb-4">
              <Link
                href="/"
                aria-label="AskMyMoon home"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <BrandLogo />
                <span className="font-sans font-bold text-slate-900">AskMyMoon</span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="relative" ref={mobileProfileRef}>
                  <button
                    type="button"
                    onClick={() => {
                      if (authedEmail) {
                        setIsMobileProfileOpen((prev) => !prev);
                      } else {
                        setIsOpen(false);
                        setShowAuthModal(true);
                      }
                    }}
                    aria-label={authedEmail ? 'Account menu' : 'Sign in'}
                    aria-expanded={authedEmail ? isMobileProfileOpen : undefined}
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                      authedEmail
                        ? 'border-violet-200 bg-violet-100 text-violet-700 hover:bg-violet-200'
                        : 'border-violet-200 bg-white text-slate-600 hover:border-violet-500'
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </button>
                  {authedEmail && isMobileProfileOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-violet-100 bg-white p-1.5 shadow-lg shadow-violet-950/10">
                      <div className="truncate px-3 py-2 text-sm font-semibold text-slate-800">
                        {getDisplayName(authedEmail)}
                      </div>
                      <div className="my-1 h-px bg-violet-50" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white text-slate-800 shadow-sm transition hover:border-violet-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <SectionLabel>Explore</SectionLabel>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <MenuCard key={link.href} {...link} onClick={() => setIsOpen(false)} />
              ))}
            </div>

            <SectionLabel>Tools</SectionLabel>
            <div className="space-y-2">
              {toolLinks.map((link) => (
                <MenuCard key={link.href} {...link} onClick={() => setIsOpen(false)} />
              ))}
            </div>

            <SectionLabel>More</SectionLabel>
            <div className="space-y-2">
              <MenuCard
                href="/blogs"
                label="Blog"
                icon={MessageCircle}
                onClick={() => setIsOpen(false)}
              />
            </div>
          </nav>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setAuthedEmail(user?.email || null);
            setShowAuthModal(false);
            // Plain navbar login — no chart to resume here. If the person
            // came from an astrologer page mid-flow, that page's own
            // AuthModal instance handles generateChart().
          }}
        />
      )}
    </header>
  );
}