import HomeClient from './HomeClient';

export const metadata = {
  title: 'AskMyMoon | Precise Life Guidance & AI Astrology Chat',
  description: 'Get instant, deeply personalized insights into your career, relationship dynamics, and life direction. Chat live with AI astrologers tailored to your birth chart.',
  keywords: [
    'AskMyMoon',
    'AI astrologer chat',
    'astrology conversation',
    'career astrology consultation',
    'online Vedic astrology platform',
    'birth chart reading',
    'instant astrological insights',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'AskMyMoon',
    title: 'AskMyMoon | Instant Astrological Insights & Live AI Chat',
    description: 'Explore the deeper patterns in your chart and start a conversation with AI astrologers for personalized career, love, and life guidance.',
    url: 'https://www.askmymoon.com',
  },
  twitter: {
    card: 'summary',
    title: 'AskMyMoon | Live AI Astrology Consultation',
    description: 'Uncover hidden opportunities in your birth chart and chat directly with AI astrologers.',
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
      description: 'Interactive AI-powered astrology platform providing deep birth chart analyses and real-time chat consultations.',
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
        <h1>AskMyMoon | AI Astrology & Live Birth Chart Consultations</h1>
        <p>Uncover deep psychological and planetary insights, then start a live chat with an AI astrologer to explore your personalized career, relationship, and life guidance.</p>
      </div>
      <HomeClient />
    </>
  );
}