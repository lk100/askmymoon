import HomeClient from './HomeClient';

export const metadata = {
  title: 'AskMyMoon | Online Vedic Astrology & Remedy Tool',
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
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.askmymoon.com/#organization',
      name: 'AskMyMoon',
      url: 'https://www.askmymoon.com',
      description: 'Online Vedic astrology platform offering instant astrology reports, birth chart remedies, dosha analysis, and personalized spiritual guidance.',
      knowsAbout: [
        'Online Vedic astrology platform',
        'Instant astrology report',
        'Birth chart remedy tool',
        'Astrology software',
        'Kundali remedy tool',
        'Dosha analysis tool',
        'Mantra generator',
        'Personalized spiritual guidance',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.askmymoon.com/#website',
      name: 'AskMyMoon',
      url: 'https://www.askmymoon.com',
      description: 'Instant personalized astrology remedies, birth chart reports, and spiritual tools for Kundali and dosha analysis.',
      publisher: { '@id': 'https://www.askmymoon.com/#organization' },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* SSR Content Header for Search Crawlers */}
      <div className="sr-only">
        <h1>AskMyMoon | Online Vedic Astrology & Spiritual Remedy Tool</h1>
        <h2>Instant Personalised Astrology Remedies, Kundali & Dosha Guidance</h2>
        <p>
          AskMyMoon provides automated chart analysis, birth chart remedy generation, 
          mantras, and practical spiritual guidance for daily balance and decision making.
        </p>
      </div>

      <HomeClient />
    </>
  );
}