import RemedyClient from './RemedyClient';

export const metadata = {
  title: 'Birth Chart Remedy Report | AskMyMoon',
  description: 'Instant personalized astrology remedies, birth chart reports, and spiritual tools for Kundali and dosha analysis.',
  keywords: [
    'birth chart remedy tool',
    'astrology software',
    'Kundali remedy tool',
    'dosha analysis tool',
    'mantra generator',
    'personalized spiritual guidance',
  ],
  alternates: {
    canonical: '/astrologers/remedy',
  },
  openGraph: {
    type: 'website',
    siteName: 'AskMyMoon',
    title: 'Birth Chart Remedy Report | AskMyMoon',
    description: 'Instant personalized astrology remedies, birth chart reports, and spiritual tools for Kundali and dosha analysis.',
    url: 'https://www.askmymoon.com/astrologers/remedy',
  },
  twitter: {
    card: 'summary',
    title: 'Birth Chart Remedy Report | AskMyMoon',
    description: 'Instant personalized astrology remedies, birth chart reports, and spiritual tools for Kundali and dosha analysis.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.askmymoon.com/astrologers/remedy#webpage',
  name: 'Birth Chart Remedy Report',
  url: 'https://www.askmymoon.com/astrologers/remedy',
  description: 'Automated chart analysis, birth chart remedy generation, mantras, and practical spiritual guidance for daily balance and decision making.',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://www.askmymoon.com/#website',
  },
};

export default function RemedyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* SSR Content Header for Search Crawlers */}
      <div className="sr-only">
        <h1>Birth Chart Remedy Report | Vedic Astrology & Spiritual Remedy Tool</h1>
        <h2>Instant Personalised Astrology Remedies, Kundali & Dosha Guidance</h2>
        <p>
          AskMyMoon provides automated chart analysis, birth chart remedy generation,
          mantras, and practical spiritual guidance for daily balance and decision making.
        </p>
      </div>

      <RemedyClient />
    </>
  );
}