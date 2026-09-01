import Link from 'next/link';
import BrandLogo from './BrandLogo';

export default function Navbar({
  ctaLabel = 'Get My Report',
  ctaHref = '/#birth-form',
  className = '',
}) {
  return (
    <header className={`border-b border-amber-900/10 bg-[#FAF6F0] ${className}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4">
        <Link href="/" aria-label="AskMyMoon home" className="flex items-center">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/" className="transition-colors hover:text-amber-800">
            Home
          </Link>
          <Link href="/blogs" className="transition-colors hover:text-amber-800">
            Blog
          </Link>
          <Link href="/consultation" className="transition-colors hover:text-amber-800">
            Consultation
          </Link>
          <Link href="/about" className="transition-colors hover:text-amber-800">
            About
          </Link>
          <Link href="/terms" className="transition-colors hover:text-amber-800">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-amber-800">
            Privacy
          </Link>
        </nav>

        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full bg-amber-800 px-3.5 py-2 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-amber-900 sm:px-4 sm:text-xs"
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
