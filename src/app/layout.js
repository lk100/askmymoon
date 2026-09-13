import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import BottomNav from './components/BottomNav';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL('https://www.askmymoon.com'),
  title: {
    default: 'AskMyMoon | Free Vedic Astrology Remedy Tool & Kundli Guidance',
    template: '%s | AskMyMoon',
  },
  description: 'Instant Vedic astrology remedy tool for birth charts, dosha analysis, mantras, and personalized spiritual guidance.',
  keywords: [
    // Brand
    'AskMyMoon',
    'AskMyMoon astrology',

    // Core / generic astrology
    'Vedic astrology',
    'astrology tool',
    'online astrology',
    'astrology app',
    'astrology website',
    'AI astrology',
    'AI astrologer chat',
    'astrology consultation online',
    'spiritual guidance',
    'spiritual remedy tool',

    // Free / remedy focused
    'free Vedic astrology remedies',
    'free astrology consultation',
    'free kundli reading',
    'kundli guidance tool',
    'astrology report',
    'personalized astrology report',
    'Vedic remedies',
    'astrological remedies',
    'mantra remedies',
    'gemstone remedies astrology',

    // Birth chart / kundli
    'birth chart reading',
    'kundli analysis',
    'janam kundli',
    'natal chart reading',
    'free kundli online',
    'kundli matching',
    'kundli by date of birth',
    'birth chart remedies',

    // Dosha analysis
    'dosha analysis',
    'mangal dosha',
    'kaal sarp dosha',
    'shani dosha',
    'nadi dosha',
    'dosha remedies',

    // Category-specific: career
    'career astrology',
    'career astrology consultation',
    'job astrology prediction',
    'career horoscope',

    // Category-specific: love & marriage
    'love astrology',
    'marriage astrology',
    'relationship compatibility astrology',
    'love marriage prediction',
    'partner compatibility kundli',

    // Category-specific: business & money
    'business astrology',
    'money astrology',
    'wealth astrology prediction',
    'financial astrology guidance',

    // Category-specific: health & family
    'health astrology',
    'family astrology guidance',
    'astrology for family wellbeing',

    // Astrologer / consultation intent
    'talk to astrologer online',
    'chat with astrologer',
    'live astrology chat',
    'instant astrological insights',
    'online Vedic astrology platform',
    'astrology predictions online',

    // Planetary / dasha
    'planetary positions astrology',
    'mahadasha antardasha',
    'dasha analysis',
    'navgraha remedies',

    // Numerology (if this is on your site, per your file tree)
    'numerology reading',
    'numerology calculator',
    'name numerology',

    // India-specific search intent
    'astrology India',
    'Indian astrology online',
    'Hindi astrology guidance',
  ],
  authors: [{ name: 'AskMyMoon' }],
  creator: 'AskMyMoon',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'AskMyMoon',
    title: 'AskMyMoon | Free Vedic Astrology Remedy Tool & Kundli Guidance',
    description: 'Instant Vedic astrology remedy tool for birth charts, dosha analysis, mantras, and personalized spiritual guidance.',
    url: 'https://www.askmymoon.com',
  },
  twitter: {
    card: 'summary',
    title: 'AskMyMoon | Free Vedic Astrology Remedy Tool & Kundli Guidance',
    description: 'Instant Vedic astrology remedy tool for birth charts, dosha analysis, mantras, and personalized spiritual guidance.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {googleAnalyticsId && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}
      <body
        className={`${displayFont.variable} ${bodyFont.variable} bg-slate-950 text-slate-100 antialiased overflow-x-hidden pb-16 sm:pb-0`}
        suppressHydrationWarning={true}
      >
        {/* Overrides standard framework fallback text for Googlebot */}
        <noscript>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>AskMyMoon - Online Vedic Astrology & Spiritual Remedy Tool</h1>
            <p>Generate instant astrology reports, birth chart remedies, dosha analysis, and spiritual guidance.</p>
          </div>
        </noscript>
        {children}
        <BottomNav />
        <Analytics />
      </body>
    </html>
  );
}