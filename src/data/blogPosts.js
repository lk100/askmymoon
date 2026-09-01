const seedTopics = [
  { title: 'Love Life Astrology', keyword: 'love life astrology', category: 'Relationship Remedies' },
  { title: 'Marriage Delay Astrology', keyword: 'marriage delay astrology', category: 'Marriage Guidance' },
  { title: 'Career Growth Astrology', keyword: 'career growth astrology', category: 'Career Guidance' },
  { title: 'Kundli Dosha Remedies', keyword: 'kundli dosha remedies', category: 'Dosha Remedies' },
  { title: 'Manglik Dosha', keyword: 'manglik dosha', category: 'Dosha Remedies' },
  { title: 'Kaal Sarp Dosha', keyword: 'kaal sarp dosha', category: 'Dosha Remedies' },
  { title: 'Shani Sade Sati', keyword: 'shani sade sati', category: 'Dosha Remedies' },
  { title: 'Rahu Ketu Effects', keyword: 'rahu ketu effects', category: 'Planets' },
  { title: 'Venus Meaning', keyword: 'venus meaning', category: 'Planets' },
  { title: 'Sun Meaning', keyword: 'sun meaning', category: 'Planets' },
  { title: 'Moon Meaning', keyword: 'moon meaning', category: 'Planets' },
  { title: 'Mercury Meaning', keyword: 'mercury meaning', category: 'Planets' },
  { title: 'Mars Meaning', keyword: 'mars meaning', category: 'Planets' },
  { title: 'Jupiter Meaning', keyword: 'jupiter meaning', category: 'Planets' },
  { title: 'Saturn Meaning', keyword: 'saturn meaning', category: 'Planets' },
  { title: 'Astrology for Anxiety', keyword: 'astrology for anxiety', category: 'Health Guidance' },
  { title: 'Astrology for Money', keyword: 'astrology for money', category: 'Finance Guidance' },
  { title: 'Astrology for Business', keyword: 'astrology for business', category: 'Finance Guidance' },
  { title: 'Astrology for Job', keyword: 'astrology for job', category: 'Career Guidance' },
  { title: 'Astrology for Health', keyword: 'astrology for health', category: 'Health Guidance' },
  { title: 'Astrology for Fertility', keyword: 'astrology for fertility', category: 'Health Guidance' },
  { title: 'Astrology for Pregnancy', keyword: 'astrology for pregnancy', category: 'Health Guidance' },
  { title: 'Astrology for Education', keyword: 'astrology for education', category: 'Education Guidance' },
  { title: 'Astrology for Students', keyword: 'astrology for students', category: 'Education Guidance' },
  { title: 'Kundli Matching', keyword: 'kundli matching', category: 'Relationship Remedies' },
  { title: 'Love Marriage Astrology', keyword: 'love marriage astrology', category: 'Relationship Remedies' },
  { title: 'Arranged Marriage Astrology', keyword: 'arranged marriage astrology', category: 'Relationship Remedies' },
  { title: 'Career Astrology for Women', keyword: 'career astrology for women', category: 'Career Guidance' },
  { title: 'Career Astrology for Men', keyword: 'career astrology for men', category: 'Career Guidance' },
  { title: 'Lucky Gemstones Astrology', keyword: 'lucky gemstones astrology', category: 'Remedies' },
  { title: 'Gemstone Matching Astrology', keyword: 'gemstone matching astrology', category: 'Remedies' },
  { title: 'Mantra for Success', keyword: 'mantra for success', category: 'Spiritual Guidance' },
  { title: 'Mantra for Love', keyword: 'mantra for love', category: 'Spiritual Guidance' },
  { title: 'Mantra for Marriage', keyword: 'mantra for marriage', category: 'Spiritual Guidance' },
  { title: 'Puja for Wealth', keyword: 'puja for wealth', category: 'Spiritual Guidance' },
  { title: 'Puja for Peace', keyword: 'puja for peace', category: 'Spiritual Guidance' },
  { title: 'Temple Remedies Astrology', keyword: 'temple remedies astrology', category: 'Remedies' },
  { title: 'Fasting for Planet', keyword: 'fasting for planet', category: 'Remedies' },
  { title: 'Donation for Remedy', keyword: 'donation for remedy', category: 'Remedies' },
  { title: 'Chart Reading Astrology', keyword: 'chart reading astrology', category: 'Astrology' },
  { title: 'Horoscope Reading', keyword: 'horoscope reading', category: 'Astrology' },
  { title: 'Astrology Prediction', keyword: 'astrology prediction', category: 'Astrology' },
  { title: 'Nadi Astrology', keyword: 'nadi astrology', category: 'Astrology' },
  { title: 'Palmistry vs Astrology', keyword: 'palmistry vs astrology', category: 'Astrology' },
  { title: 'Numerology vs Astrology', keyword: 'numerology vs astrology', category: 'Astrology' },
  { title: 'Vastu vs Astrology', keyword: 'vastu vs astrology', category: 'Astrology' },
  { title: 'Zodiac Sign Compatibility', keyword: 'zodiac sign compatibility', category: 'Relationship Remedies' },
  { title: 'Moon Sign Prediction', keyword: 'moon sign prediction', category: 'Astrology' },
  { title: 'Sun Sign Prediction', keyword: 'sun sign prediction', category: 'Astrology' },
  { title: 'Rising Sign Astrology', keyword: 'rising sign astrology', category: 'Astrology' },
  { title: '7th House Astrology', keyword: '7th house astrology', category: 'Astrology' },
  { title: '10th House Astrology', keyword: '10th house astrology', category: 'Astrology' },
  { title: '5th House Astrology', keyword: '5th house astrology', category: 'Astrology' },
  { title: '8th House Astrology', keyword: '8th house astrology', category: 'Astrology' },
  { title: '12th House Astrology', keyword: '12th house astrology', category: 'Astrology' },
  { title: 'Mangal Dosha', keyword: 'mangal dosha', category: 'Dosha Remedies' },
  { title: 'Pitra Dosha Remedies', keyword: 'pitra dosha remedies', category: 'Dosha Remedies' },
  { title: 'Rahu Remedies', keyword: 'rahu remedies', category: 'Planets' },
  { title: 'Ketu Remedies', keyword: 'ketu remedies', category: 'Planets' },
  { title: 'Jupiter Remedies', keyword: 'jupiter remedies', category: 'Planets' },
  { title: 'Moon Remedies', keyword: 'moon remedies', category: 'Planets' },
  { title: 'Saturn Remedies', keyword: 'saturn remedies', category: 'Planets' },
  { title: 'Astrology for Confidence', keyword: 'astrology for confidence', category: 'Spiritual Guidance' },
  { title: 'Astrology for Focus', keyword: 'astrology for focus', category: 'Education Guidance' },
  { title: 'Astrology for Sleep', keyword: 'astrology for sleep', category: 'Health Guidance' },
  { title: 'Astrology for Relationships', keyword: 'astrology for relationships', category: 'Relationship Remedies' },
  { title: 'Astrology for Marriage', keyword: 'astrology for marriage', category: 'Marriage Guidance' }
];

const articleSuffixes = [
  { suffix: '', slugSuffix: 'astrology' },
  { suffix: 'Meaning', slugSuffix: 'meaning' },
  { suffix: 'Remedies', slugSuffix: 'remedies' },
  { suffix: 'for Marriage', slugSuffix: 'for-marriage' },
  { suffix: 'for Love Life', slugSuffix: 'for-love-life' },
  { suffix: 'for Career', slugSuffix: 'for-career' }
];

function makeSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildSections(topic) {
  const topicName = topic.title.trim();
  const keyword = topic.keyword.trim();

  return [
    {
      heading: `Why ${topicName} matters in astrology`,
      body: `People search for ${keyword} because they want clarity about recurring emotional, spiritual, and practical patterns in life. Astrology does not promise certainty in a magical sense, but it can help connect everyday experiences to larger themes in the chart. When someone keeps facing the same relationship issue, repeated financial pressure, or emotional uncertainty, ${keyword} often becomes a useful starting point for understanding timing, patterns, and underlying lessons.`
    },
    {
      heading: `How ${topicName} is interpreted`,
      body: `In Vedic astrology, the meaning of ${keyword} depends on the placement of planets, the houses they occupy, the sign energies involved, and the current dasha or planetary timing. A single keyword can look very different depending on whether the focus is relationship houses, career houses, health houses, or spiritual guidance. That is why astrology works best as a layered interpretation rather than a rigid formula. The same theme can show up differently for two people because each chart has a unique map of energy and timing.`
    },
    {
      heading: `Common patterns linked with ${topicName}`,
      body: `Many people explore ${keyword} when they notice emotional confusion, repeated mistakes, or a sense that life is asking them to work on a deeper lesson. These patterns are often tied to inner habits, unresolved tension, karmic cycles, and the way a person reacts under stress. In spiritual practice, this topic is often treated as a mirror: it reveals behavior patterns, life timing, and areas where growth is needed. The goal is not fear or dependency, but awareness and practical action.`
    },
    {
      heading: `Common remedies and practical guidance`,
      body: `Remedies connected with ${keyword} are usually a mix of spiritual, personal, and lifestyle practices. People may turn to mantra chanting, specific fasting days, gemstone recommendations, charitable acts, temple visits, or simple routines that support balance and discipline. In many cases, remedies are less about immediate miracles and more about creating alignment between intention, behavior, and cosmic timing. A practical remedy is one that helps someone feel calmer, more focused, and more aware of how to respond wisely in daily life.`
    },
    {
      heading: `When to seek a deeper reading`,
      body: `If the issue keeps repeating, the question feels emotionally intense, or your decisions are getting influenced by confusion, a personalised chart reading may bring much more clarity. ${keyword} often becomes more useful when studied in context, including the birth chart, planetary strengths, dosha patterns, and your present life cycle. A general explanation can help you start, but a detailed reading helps you understand why this pattern is active now and what next steps are most aligned with your chart.`
    },
    {
      heading: `A balanced way to use this guidance`,
      body: `Astrology works best when it supports your judgment rather than replacing it. The real value of ${keyword} lies in helping you pause, reflect, and notice patterns without becoming overly reactive. It can guide your decisions, encourage better routines, and deepen self-awareness. That said, practical wisdom, emotional maturity, and real-world effort still matter the most. Astrology is best used as a tool for reflection, direction, and healthier action.`
    }
  ];
}

function buildFaqs(topic) {
  const topicName = topic.title.trim();
  const keyword = topic.keyword.trim();

  return [
    {
      question: `What does ${topicName} mean in astrology?`,
      answer: `${topicName} usually points to a recurring karmic pattern or an energetic theme in the chart. In practical terms, it helps explain why someone experiences certain life challenges, relationship cycles, or professional blocks. The meaning depends on the planet involved, the sign and house placement, and the timing of the relevant dasha or transit.`
    },
    {
      question: `Are ${keyword} remedies effective?`,
      answer: `They can be helpful when used consistently and with realistic expectations. Remedies support inner balance, spiritual focus, and stronger decision-making, but they work best when paired with self-awareness and practical action. They are most effective as a supportive practice, not as a substitute for action or professional advice when needed.`
    },
    {
      question: `Can ${keyword} help me understand my life situation?`,
      answer: `Yes, many people use ${keyword} as a way to understand repeating life themes, emotional patterns, and timing. Astrology can offer insight into what may be influencing your decisions, but it should be used to support reflection, not to create fear or dependency. The best outcomes come when you use the guidance with patience and practical thinking.`
    },
    {
      question: `Should I get a personal chart reading for this topic?`,
      answer: `If the topic is affecting your decisions or recurring across a long period, a personal chart reading may provide much deeper clarity. A general article can help you understand the theme, but a personalised reading explains how it works specifically in your birth chart, which matters greatly for timing, intensity, and corrective action.`
    }
  ];
}

function buildPost(seed, suffixObj, index) {
  const title = suffixObj.suffix ? `${seed.title} ${suffixObj.suffix}` : seed.title;
  const slug = `${makeSlug(seed.title)}-${suffixObj.slugSuffix}`;
  const cleanSlug = slug.replace(/-+/g, '-');
  const category = seed.category;
  const keyword = `${seed.keyword}${suffixObj.suffix ? ` ${suffixObj.suffix.toLowerCase()}` : ''}`.trim();
  const keywords = [
    keyword,
    `${seed.keyword} astrology`,
    `${seed.keyword} remedies`,
    `${seed.keyword} meaning`,
    `${seed.keyword} for marriage`,
    `${seed.keyword} for career`
  ].filter(Boolean);

  const cleanTitle = title.replace(/\s+for\s+(Marriage|Love Life|Career)$/i, '').trim();

  return {
    slug: cleanSlug,
    title,
    category,
    excerpt: `Understand ${keyword} in a practical, chart-based way and learn how this astrology topic connects to real life, remedies, and decision-making with deeper context, timing, and everyday guidance.`,
    description: `Explore ${keyword} with detailed chart-based guidance, practical remedies, beginner-friendly explanations, and real-life examples built for stronger search visibility and reader trust.`,
    publishedAt: '2026-08-30',
    updatedAt: '2026-08-30',
    readingTime: `${Math.max(5, 6 + (index % 7))} min read`,
    author: 'AskMyMoon',
    keywords,
    heroImage: 'https://www.askmymoon.com/og-image.jpg',
    sections: buildSections({ title: cleanTitle, keyword }),
    faqs: buildFaqs({ title: cleanTitle, keyword })
  };
}

const generatedBlogPosts = seedTopics.flatMap((seed, seedIndex) =>
  articleSuffixes.map((suffixObj, suffixIndex) => buildPost(seed, suffixObj, seedIndex * articleSuffixes.length + suffixIndex))
);

export const blogPosts = generatedBlogPosts;
export const blogCategories = [...new Set(blogPosts.map((post) => post.category))];
