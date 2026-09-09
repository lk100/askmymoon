import HomeClient from './HomeClient';

export const metadata = {
  title: 'AskMyMoon | Chat with an AI Astrologer',
  description: 'Get instant, personalized astrology guidance from AI astrologers. Start with one free chart-based question on career, love, and more.',
  keywords: [
    'AskMyMoon',
    'AI astrologer',
    'career astrology consultation',
    'online Vedic astrology platform',
    'birth chart guidance',
    'instant astrology answers',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'AskMyMoon',
    title: 'AskMyMoon | Chat with an AI Astrologer',
    description: 'Get instant, personalized astrology guidance from AI astrologers. Start with one free chart-based question.',
    url: 'https://www.askmymoon.com',
  },
  twitter: {
    card: 'summary',
    title: 'AskMyMoon | Chat with an AI Astrologer',
    description: 'Get instant, personalized astrology guidance from AI astrologers.',
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
      description: 'AI-powered astrology platform offering chart-based career, love, and life guidance from AI astrologers.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.askmymoon.com/#website',
      name: 'AskMyMoon',
      url: 'https://www.askmymoon.com',
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
      <div className="sr-only">
        <h1>AskMyMoon | Chat with an AI Astrologer</h1>
        <p>Ask career, love, and life questions and get instant answers rooted in your birth chart.</p>
      </div>
      <HomeClient />
    </>
  );
}