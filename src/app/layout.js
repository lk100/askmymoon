import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL('https://www.askmymoon.com'),
  title: {
    default: 'AskMyMoon | Online Vedic Astrology & Remedy Tool',
    template: '%s | AskMyMoon',
  },
  description: 'Instant personalized astrology remedies, birth chart reports, and spiritual tools for Kundali and dosha analysis.',
  keywords: [
    'AskMyMoon',
    'online Vedic astrology platform',
    'instant astrology report',
    'birth chart remedy tool',
    'astrology software',
    'Kundali remedy tool',
    'dosha analysis tool',
    'mantra generator',
    'personalized spiritual guidance',
  ],
  authors: [{ name: 'AskMyMoon' }],
  creator: 'AskMyMoon',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'AskMyMoon',
    title: 'AskMyMoon | Online Vedic Astrology & Remedy Tool',
    description: 'Instant personalized astrology remedies, birth chart reports, and spiritual tools for Kundali and dosha analysis.',
    url: 'https://www.askmymoon.com',
  },
  twitter: {
    card: 'summary',
    title: 'AskMyMoon | Online Vedic Astrology & Remedy Tool',
    description: 'Instant personalized astrology remedies, birth chart reports, and spiritual tools for Kundali and dosha analysis.',
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

// src/app/layout.js

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
        {children}
        <Analytics />
      </body>
    </html>
  );
}