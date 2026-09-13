import { BriefcaseBusiness, Link2, TrendingUp, HeartHandshake } from 'lucide-react';

// `lens` MUST match the Flask LENS_CONFIG keys: career, love-marriage, business-money, health-family
export const ASTROLOGER_CATEGORIES = {
  'career-n-job': {
    lens: 'career',
    title: 'Career',
    shortLabel: 'career',
    description: 'STRESSED? Get answers about your next career breakthrough.',
    icon: BriefcaseBusiness,
    iconBg: 'bg-emerald-50 text-emerald-700',
    arrowBg: 'bg-emerald-100 text-emerald-700',
    heading: 'A clearer question for your working life.',
    subheading: 'Enter your details once. We calculate your astrology chart once, then use it for every career question.',
    suggestedQuestions: [
      'Which career direction is most aligned with my strengths?',
      'What is causing blockages in my career?',
      'When will I get success in my career?',
      'Should I go for a job or business?',
    ],
  },
  'love-n-marriage': {
    lens: 'love-marriage',
    title: 'Love & Marriage',
    shortLabel: 'relationship',
    description: 'Get answers about your future partner and relationship path.',
    icon: Link2,
    iconBg: 'bg-amber-50 text-amber-700',
    arrowBg: 'bg-amber-100 text-amber-700',
    heading: 'A clearer question for your love life.',
    subheading: 'Enter your details once. We calculate your astrology chart once, then use it for every relationship question.',
    suggestedQuestions: [
      'When am I likely to get married?',
      'Is my current relationship heading toward marriage?',
      'What is delaying my marriage?',
      'How compatible are we long-term?',
    ],
  },
  'business-n-money': {
    lens: 'business-money',
    title: 'Business & Money',
    shortLabel: 'business',
    description: 'Discover your energy to invest, grow money, and avoid losses.',
    icon: TrendingUp,
    iconBg: 'bg-sky-50 text-sky-700',
    arrowBg: 'bg-sky-100 text-sky-700',
    heading: 'A clearer question for your money and business.',
    subheading: 'Enter your details once. We calculate your astrology chart once, then use it for every business question.',
    suggestedQuestions: [
      'Is this a good time to start a business?',
      'What is blocking financial growth for me?',
      'Should I invest or wait?',
      'When will my income improve?',
    ],
  },
  'health-n-family': {
    lens: 'health-family',
    title: 'Health & Family',
    shortLabel: 'health & family',
    description: 'Get practical remedies for family wellbeing and upcoming health cycles.',
    icon: HeartHandshake,
    iconBg: 'bg-pink-50 text-pink-600',
    arrowBg: 'bg-pink-100 text-pink-600',
    heading: 'A clearer question for your health and family.',
    subheading: 'Enter your details once. We calculate your astrology chart once, then use it for every health & family question.',
    suggestedQuestions: [
      'What health patterns should I watch for?',
      'Is this a good period for family harmony?',
      'What remedies help my family right now?',
      'When will things settle at home?',
    ],
  },
};

export const ASTROLOGER_CATEGORY_LIST = Object.entries(ASTROLOGER_CATEGORIES).map(
  ([key, value]) => ({ key, ...value, href: `/astrologers/${key}`, live: true })
);

export function getCategoryConfig(key) {
  return ASTROLOGER_CATEGORIES[key] || null;
}

export function isValidCategory(key) {
  return Object.prototype.hasOwnProperty.call(ASTROLOGER_CATEGORIES, key);
}