// data/zodiacPageData.js
//
// This file is generated from SIGN_TRAITS below rather than hand-typed sign by
// sign, so every sign gets distinct, on-brand copy for all six timeframes
// without 12 near-identical blocks to maintain by hand. Swap in real editorial
// content per sign/timeframe whenever you have it — just overwrite the
// relevant key in ZODIAC_PAGE_DATA; the shape stays the same either way.

// ---------------------------------------------------------------------------
// Shared, sign-level metadata (used across all timeframes for a sign)
// ---------------------------------------------------------------------------
export const ZODIAC_META = {
  Aries:       { hindiName: 'Mesh',     dateRange: 'Mar 21 – Apr 19', symbol: '♈', rulingPlanet: 'Mars' },
  Taurus:      { hindiName: 'Vrishabh', dateRange: 'Apr 20 – May 20', symbol: '♉', rulingPlanet: 'Venus' },
  Gemini:      { hindiName: 'Mithun',   dateRange: 'May 21 – Jun 20', symbol: '♊', rulingPlanet: 'Mercury' },
  Cancer:      { hindiName: 'Kark',     dateRange: 'Jun 21 – Jul 22', symbol: '♋', rulingPlanet: 'Moon' },
  Leo:         { hindiName: 'Singh',    dateRange: 'Jul 23 – Aug 22', symbol: '♌', rulingPlanet: 'Sun' },
  Virgo:       { hindiName: 'Kanya',    dateRange: 'Aug 23 – Sep 22', symbol: '♍', rulingPlanet: 'Mercury' },
  Libra:       { hindiName: 'Tula',     dateRange: 'Sep 23 – Oct 22', symbol: '♎', rulingPlanet: 'Venus' },
  Scorpio:     { hindiName: 'Vrishchik',dateRange: 'Oct 23 – Nov 21', symbol: '♏', rulingPlanet: 'Mars/Pluto' },
  Sagittarius: { hindiName: 'Dhanu',    dateRange: 'Nov 22 – Dec 21', symbol: '♐', rulingPlanet: 'Jupiter' },
  Capricorn:   { hindiName: 'Makar',    dateRange: 'Dec 22 – Jan 19', symbol: '♑', rulingPlanet: 'Saturn' },
  Aquarius:    { hindiName: 'Kumbh',    dateRange: 'Jan 20 – Feb 18', symbol: '♒', rulingPlanet: 'Saturn/Uranus' },
  Pisces:      { hindiName: 'Meen',     dateRange: 'Feb 19 – Mar 20', symbol: '♓', rulingPlanet: 'Jupiter/Neptune' },
};

// ---------------------------------------------------------------------------
// Per-sign personality inputs the generator below uses to keep every sign's
// copy distinct instead of interchangeable filler.
// ---------------------------------------------------------------------------
const SIGN_TRAITS = {
  Aries:       { element: 'fire',  transitPlanet: 'Mars',    focus: 'a burst of initiative', caution: 'impatience with slower colleagues', strength: 'decisive action', colors: [{ hex: '#DC2626', name: 'Red' }, { hex: '#F97316', name: 'Orange' }], numbers: [9, 1] },
  Taurus:      { element: 'earth', transitPlanet: 'Venus',   focus: 'steady, grounded progress', caution: 'digging in out of stubbornness', strength: 'patience and follow-through', colors: [{ hex: '#16A34A', name: 'Green' }, { hex: '#EAB308', name: 'Gold' }], numbers: [6, 2] },
  Gemini:      { element: 'air',   transitPlanet: 'Mercury', focus: 'conversations and quick thinking', caution: 'scattering your energy across too much', strength: 'adaptability', colors: [{ hex: '#FACC15', name: 'Yellow' }, { hex: '#38BDF8', name: 'Sky Blue' }], numbers: [5, 3] },
  Cancer:      { element: 'water', transitPlanet: 'the Moon',focus: 'home, family and emotional security', caution: 'withdrawing instead of speaking up', strength: 'intuition', colors: [{ hex: '#E5E7EB', name: 'Silver' }, { hex: '#BFDBFE', name: 'Pale Blue' }], numbers: [2, 7] },
  Leo:         { element: 'fire',  transitPlanet: 'the Sun', focus: 'confidence and recognition', caution: 'letting pride crowd out compromise', strength: 'warmth and leadership', colors: [{ hex: '#EAB308', name: 'Yellow' }, { hex: '#DC2626', name: 'Red' }], numbers: [1, 3] },
  Virgo:       { element: 'earth', transitPlanet: 'Mercury', focus: 'organisation and practical fixes', caution: 'over-analysing small details', strength: 'precision', colors: [{ hex: '#16A34A', name: 'Green' }, { hex: '#A16207', name: 'Earthy Brown' }], numbers: [5, 6] },
  Libra:       { element: 'air',   transitPlanet: 'Venus',   focus: 'balance and partnership', caution: 'avoiding a decision to keep the peace', strength: 'diplomacy', colors: [{ hex: '#F9A8D4', name: 'Pastel Pink' }, { hex: '#93C5FD', name: 'Powder Blue' }], numbers: [6, 9] },
  Scorpio:     { element: 'water', transitPlanet: 'Mars',    focus: 'depth and transformation', caution: 'holding onto old grudges', strength: 'resolve', colors: [{ hex: '#7F1D1D', name: 'Maroon' }, { hex: '#000000', name: 'Black' }], numbers: [8, 4] },
  Sagittarius: { element: 'fire',  transitPlanet: 'Jupiter', focus: 'expansion and honesty', caution: 'overpromising in the moment', strength: 'optimism', colors: [{ hex: '#7C3AED', name: 'Purple' }, { hex: '#2563EB', name: 'Royal Blue' }], numbers: [3, 9] },
  Capricorn:   { element: 'earth', transitPlanet: 'Saturn',  focus: 'discipline and long-term goals', caution: 'working so hard you skip rest', strength: 'reliability', colors: [{ hex: '#1F2937', name: 'Charcoal' }, { hex: '#A16207', name: 'Brown' }], numbers: [8, 10] },
  Aquarius:    { element: 'air',   transitPlanet: 'Saturn',  focus: 'fresh ideas and community', caution: 'detaching from those closest to you', strength: 'originality', colors: [{ hex: '#0891B2', name: 'Turquoise' }, { hex: '#6366F1', name: 'Electric Blue' }], numbers: [4, 11] },
  Pisces:      { element: 'water', transitPlanet: 'Neptune', focus: 'imagination and compassion', caution: 'avoiding a hard conversation', strength: 'empathy', colors: [{ hex: '#22D3EE', name: 'Sea Green' }, { hex: '#C4B5FD', name: 'Lavender' }], numbers: [7, 12] },
};

const AREA_TEMPLATES = {
  love: (t) => `${t.transitPlanet} draws your attention toward how well you're really listening in your closest relationship today. If you're partnered, naming what you need beats hoping it's noticed; if you're single, an honest conversation goes further than a grand gesture.`,
  finance: (t) => `Money matters ask for the same ${t.strength} you'd bring anywhere else — a quick check of where things actually stand now saves a bigger headache later. Avoid a purchase driven purely by mood.`,
  career: (t) => `At work, lean into ${t.focus} rather than trying to prove everything at once. A small, well-timed offer to help a colleague builds goodwill that pays off soon.`,
  health: (t) => `Physically, watch for ${t.caution} showing up as tension in the body. A short walk or a proper night's sleep does more for you today than pushing through.`,
};

function pct(base, offset) {
  const v = base + offset;
  return Math.max(40, Math.min(100, v));
}

function buildAreas(traits, seed) {
  return {
    love:    { percent: pct(70, ((seed * 7) % 4) * 10),  blurb: AREA_TEMPLATES.love(traits) },
    finance: { percent: pct(60, ((seed * 3) % 5) * 8),   blurb: AREA_TEMPLATES.finance(traits) },
    career:  { percent: pct(65, ((seed * 5) % 4) * 9),   blurb: AREA_TEMPLATES.career(traits) },
    health:  { percent: pct(55, ((seed * 2) % 6) * 7),   blurb: AREA_TEMPLATES.health(traits) },
  };
}

const MOODS = [
  { emoji: '😍', label: 'Romantic' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '💪', label: 'Motivated' },
  { emoji: '🤔', label: 'Reflective' },
  { emoji: '😄', label: 'Cheerful' },
];

const AUSPICIOUS_TIMES = ['09:10 AM – 10:40 AM', '11:15 AM – 12:45 PM', '02:30 PM – 04:00 PM', '04:52 PM – 06:25 PM', '06:40 PM – 08:10 PM'];

function dailyText(signName, traits, tone) {
  return `${traits.transitPlanet}'s influence today points you toward ${traits.focus}, and it's a good day to trust ${traits.strength}. ${tone} A friend or colleague could bring news that shifts your mood, and small conversations carry more weight than they first appear to.`;
}

function buildDailyBlock(signName, traits, seed, tone) {
  return {
    date: null, // computed at render time with new Date()
    text: dailyText(signName, traits, tone),
    lucky: {
      colors: traits.colors,
      number: traits.numbers[seed % 2],
      auspiciousTime: AUSPICIOUS_TIMES[seed % AUSPICIOUS_TIMES.length],
      mood: MOODS[seed % MOODS.length],
    },
    areas: buildAreas(traits, seed),
  };
}

function buildLongBlock(signName, traits, seed, span) {
  return {
    text: `Over the ${span} ahead, ${traits.transitPlanet} keeps the spotlight on ${traits.focus} for ${signName}. The main thing to watch is ${traits.caution} — catch it early and the period runs far more smoothly. Lean on ${traits.strength} when a decision needs making, and don't be afraid to revisit a plan that isn't working instead of forcing it through.`,
    areas: buildAreas(traits, seed + 11),
  };
}

function generateSignData(signName) {
  const traits = SIGN_TRAITS[signName];
  const seed = signName.length + signName.charCodeAt(0);
  return {
    yesterday: buildDailyBlock(signName, traits, seed + 1, `Looking back, that same energy was already building.`),
    today:     buildDailyBlock(signName, traits, seed + 2, `Be mindful not to overcommit just because things feel like they're flowing.`),
    tomorrow:  buildDailyBlock(signName, traits, seed + 3, `Use today to prepare, since tomorrow will ask you to act on it.`),
    weekly:    buildLongBlock(signName, traits, seed + 4, 'week'),
    monthly:   buildLongBlock(signName, traits, seed + 5, 'month'),
    yearly:    buildLongBlock(signName, traits, seed + 6, 'year'),
  };
}

export const ZODIAC_PAGE_DATA = Object.keys(ZODIAC_META).reduce((acc, sign) => {
  acc[sign] = generateSignData(sign);
  return acc;
}, {});

// ---------------------------------------------------------------------------
// Compatibility + FAQs
// ---------------------------------------------------------------------------
export const COMPATIBILITY_PAIRS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// Generate FAQ text programmatically so all 12 signs stay consistent.
export function getGenericFaqs(signName) {
  return [
    {
      question: `How is the ${signName} zodiac daily horoscope different from the monthly?`,
      answer: `A ${signName} sign daily horoscope focuses on planetary influence affecting a single day, while a monthly horoscope examines broader themes, recurring patterns, and longer-term opportunities. Reading both gives you a clearer picture of immediate events and future possibilities.`,
    },
    {
      question: `Is ${signName} astrology today based on your Sun sign or Moon sign?`,
      answer: `Your ${signName} daily horoscope is based on your Sun sign — the sign you most commonly know as your zodiac sign, based on your date of birth.`,
    },
    {
      question: `What does the ${signName} daily horoscope tell you?`,
      answer: `It highlights the day's key influences across love, career, finance and health, along with the lucky color, number and auspicious time for ${signName}.`,
    },
    {
      question: `How accurate is ${signName} horoscope today?`,
      answer: `Horoscopes offer general guidance based on planetary transits and work best as a reflective tool rather than a precise prediction.`,
    },
  ];
}

// Kept for backward compatibility with any code importing a fixed FAQ map —
// now just resolves through the generator above for every sign.
export const ZODIAC_FAQS = Object.keys(ZODIAC_META).reduce((acc, sign) => {
  acc[sign] = getGenericFaqs(sign);
  return acc;
}, {});

export function getZodiacPageData(signName, timeframe) {
  return ZODIAC_PAGE_DATA[signName]?.[timeframe] || null;
}