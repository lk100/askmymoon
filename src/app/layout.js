import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL('https://www.askmymoon.com'),
  title: {
    default: 'AskMyMoon | Free Vedic Astrology Remedy Tool & Kundli Guidance',
    template: '%s | AskMyMoon',
  },
  description: 'Instant Vedic astrology remedy tool for birth charts, dosha analysis, mantras, and personalized spiritual guidance.',
  keywords: [
    'AskMyMoon',
    'astrology remedy tool',
    'spiritual remedy tool',
    'free Vedic astrology remedies',
    'kundli guidance tool',
    'astrology report',
    'dosha analysis',
    'Vedic remedies',
    'personalized astrology report'
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
        className="bg-slate-950 text-slate-100 antialiased overflow-x-hidden"
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
        <Analytics />
      </body>
    </html>
  );
}