import './globals.css';
import Script from 'next/script';

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  metadataBase: new URL('https://www.askmymoon.com'),
  title: {
    default: 'AskMyMoon | Free Vedic Astrology Remedies & Kundli Guidance',
    template: '%s | AskMyMoon',
  },
  description: 'Get trusted Vedic astrology remedies, kundli guidance, and dosha analysis with an instant astrology report designed to help improve life decisions and daily balance.',
  keywords: ['AskMyMoon', 'free Vedic astrology remedies', 'kundli guidance', 'astrology report', 'dosha analysis', 'Vedic remedies', 'personalized astrology report'],
  authors: [{ name: 'AskMyMoon' }],
  creator: 'AskMyMoon',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'AskMyMoon',
    title: 'AskMyMoon | Free Vedic Astrology Remedies & Kundli Guidance',
    description: 'Discover trusted Vedic astrology remedies, kundli guidance, and dosha analysis in a fast, free astrology report.',
    url: 'https://www.askmymoon.com',
  },
  twitter: {
    card: 'summary',
    title: 'AskMyMoon | Free Vedic Astrology Remedies & Kundli Guidance',
    description: 'Discover trusted Vedic astrology remedies, kundli guidance, and dosha analysis in a fast, free astrology report.',
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
      </body>
    </html>
  );
}