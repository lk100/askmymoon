// data/planetaryData.js
// Core BPHS (Brihat Parashara Hora Shastra) reference tables used to derive:
// 1) Dignity — where the planet sits (Exalted / Own Sign / Debilitated / Neutral)
// 2) Functional Nature — whether that planet acts as benefic/malefic FOR this
//    specific Ascendant, based on which houses it rules (kendra/trikona/dusthana lordship)

export const SIGNS_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// ---------- DIGNITY TABLES ----------
export const EXALTATION_SIGN = {
  Sun: 'Aries', Moon: 'Taurus', Mars: 'Capricorn', Mercury: 'Virgo',
  Jupiter: 'Cancer', Venus: 'Pisces', Saturn: 'Libra',
  Rahu: 'Taurus', Ketu: 'Scorpio',
};

export const DEBILITATION_SIGN = {
  Sun: 'Libra', Moon: 'Scorpio', Mars: 'Cancer', Mercury: 'Pisces',
  Jupiter: 'Capricorn', Venus: 'Virgo', Saturn: 'Aries',
  Rahu: 'Scorpio', Ketu: 'Taurus',
};

export const OWN_SIGNS = {
  Sun: ['Leo'],
  Moon: ['Cancer'],
  Mars: ['Aries', 'Scorpio'],
  Mercury: ['Gemini', 'Virgo'],
  Jupiter: ['Sagittarius', 'Pisces'],
  Venus: ['Taurus', 'Libra'],
  Saturn: ['Capricorn', 'Aquarius'],
  Rahu: [],
  Ketu: [],
};


// Natural friend/enemy/neutral relationships (BPHS)
export const NATURAL_FRIENDS = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus'],
};

export const NATURAL_ENEMIES = {
  Sun: ['Venus', 'Saturn'],
  Moon: [],
  Mars: ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus: ['Sun', 'Moon'],
  Saturn: ['Sun', 'Moon', 'Mars'],
};

export const SIGN_LORD = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

// ---------- FUNCTIONAL NATURE BY ASCENDANT ----------
export const FUNCTIONAL_NATURE_BY_ASCENDANT = {
  Aries: { Sun: 'benefic', Moon: 'neutral', Mars: 'benefic', Mercury: 'malefic', Jupiter: 'malefic', Venus: 'malefic', Saturn: 'malefic' },
  Taurus: { Sun: 'malefic', Moon: 'malefic', Mars: 'malefic', Mercury: 'benefic', Jupiter: 'malefic', Venus: 'benefic', Saturn: 'benefic' },
  Gemini: { Sun: 'malefic', Moon: 'neutral', Mars: 'malefic', Mercury: 'benefic', Jupiter: 'malefic', Venus: 'benefic', Saturn: 'benefic' },
  Cancer: { Sun: 'benefic', Moon: 'benefic', Mars: 'benefic', Mercury: 'malefic', Jupiter: 'benefic', Venus: 'malefic', Saturn: 'malefic' },
  Leo: { Sun: 'benefic', Moon: 'neutral', Mars: 'benefic', Mercury: 'malefic', Jupiter: 'benefic', Venus: 'malefic', Saturn: 'malefic' },
  Virgo: { Sun: 'neutral', Moon: 'malefic', Mars: 'malefic', Mercury: 'benefic', Jupiter: 'malefic', Venus: 'benefic', Saturn: 'benefic' },
  Libra: { Sun: 'malefic', Moon: 'neutral', Mars: 'malefic', Mercury: 'benefic', Jupiter: 'malefic', Venus: 'benefic', Saturn: 'benefic' },
  Scorpio: { Sun: 'benefic', Moon: 'benefic', Mars: 'benefic', Mercury: 'malefic', Jupiter: 'benefic', Venus: 'malefic', Saturn: 'malefic' },
  Sagittarius: { Sun: 'benefic', Moon: 'neutral', Mars: 'benefic', Mercury: 'malefic', Jupiter: 'benefic', Venus: 'malefic', Saturn: 'malefic' },
  Capricorn: { Sun: 'malefic', Moon: 'malefic', Mars: 'benefic', Mercury: 'benefic', Jupiter: 'malefic', Venus: 'benefic', Saturn: 'benefic' },
  Aquarius: { Sun: 'malefic', Moon: 'neutral', Mars: 'benefic', Mercury: 'benefic', Jupiter: 'malefic', Venus: 'benefic', Saturn: 'benefic' },
  Pisces: { Sun: 'benefic', Moon: 'benefic', Mars: 'benefic', Mercury: 'malefic', Jupiter: 'benefic', Venus: 'malefic', Saturn: 'malefic' },
};


// ---------- HELPER FUNCTIONS ----------

export function getDignity(planet, sign) {
  if (!planet || !sign) return null;

  if (DEBILITATION_SIGN[planet] === sign) return 'Debilitated';
  if (EXALTATION_SIGN[planet] === sign) return 'Exalted';
  
  if (OWN_SIGNS[planet]?.includes(sign)) return 'Own Sign';

  if (planet === 'Rahu' || planet === 'Ketu') return 'Neutral';

  const lordOfSign = SIGN_LORD[sign];
  if (!lordOfSign) return 'Neutral';

  const isFriend = NATURAL_FRIENDS[planet]?.includes(lordOfSign);
  const isEnemy = NATURAL_ENEMIES[planet]?.includes(lordOfSign);

  if (lordOfSign === planet) return 'Own Sign';
  if (isFriend) return 'Friend';
  if (isEnemy) return 'Enemy';
  return 'Neutral';
}

export function getFunctionalNature(planet, ascendantSign) {
  if (planet === 'Rahu' || planet === 'Ketu') return 'malefic';
  return FUNCTIONAL_NATURE_BY_ASCENDANT[ascendantSign]?.[planet] || 'neutral';
}

const HOUSE_LIFE_AREAS = {
  1: 'identity, body, self-expression',
  2: 'wealth, family, speech, values',
  3: 'courage, communication, skills, siblings',
  4: 'home, emotional foundations, mother, property',
  5: 'education, creativity, children, romance, intelligence',
  6: 'health, daily work, service, debts, obstacles',
  7: 'marriage, partnerships, clients, public dealings',
  8: 'transformation, shared resources, inheritance, hidden matters',
  9: 'higher learning, beliefs, fortune, father, long journeys',
  10: 'career, reputation, authority, major actions',
  11: 'income, gains, networks, fulfilment, elder siblings',
  12: 'expenses, sleep, foreign places, retreat, spirituality',
};

const PLANET_ENERGY = {
  Sun: 'confidence, identity, leadership, vitality, authority',
  Moon: 'emotions, care, intuition, comfort, adaptability',
  Mars: 'action, courage, drive, initiative, decisive effort',
  Mercury: 'thinking, communication, learning, analysis, practical skill',
  Jupiter: 'wisdom, growth, faith, guidance, opportunity',
  Venus: 'love, beauty, harmony, pleasure, connection',
  Saturn: 'discipline, responsibility, patience, structure, endurance',
  Rahu: 'ambition, desire, innovation, intensity, unconventional thinking',
  Ketu: 'detachment, insight, spirituality, intuition, release',
};

function getHouseFromSign(sign, ascendantSign) {
  const ascendantIndex = SIGNS_ORDER.indexOf(ascendantSign);
  const signIndex = SIGNS_ORDER.indexOf(sign);
  if (ascendantIndex === -1 || signIndex === -1) return null;
  return ((signIndex - ascendantIndex + 12) % 12) + 1;
}

export function getPlanetLifeAreas(planet, ascendantSign, occupiedHouse) {
  const ownedSigns = OWN_SIGNS[planet] || [];
  const houses = ownedSigns
    .map((sign) => getHouseFromSign(sign, ascendantSign))
    .filter(Boolean)
    .sort((first, second) => first - second);

  if (houses.length === 0 && occupiedHouse) {
    return `Your ${HOUSE_LIFE_AREAS[occupiedHouse]} are influenced through ${PLANET_ENERGY[planet]}.`;
  }

  if (houses.length === 0) return '';

  const areas = houses.map((house) => HOUSE_LIFE_AREAS[house]);
  const areaText = areas.join('; ');

  return `Your ${areaText} are influenced through ${PLANET_ENERGY[planet]}.`;
}

// OUTSIDE THE BOX: Strictly Planet + Sign + House expression & behavioral energy
const DIGNITY_BLURB = {
  Exalted: (p) => `${p} expresses its strongest and clearest potential.`,
  'Own Sign': (p) => `${p} feels stable, natural, and self-assured here.`,
  Friend: (p) => `${p} adapts easily and expresses steady support here.`,
  Neutral: (p) => `${p} acts independently, shaped by its house placement.`,
  Enemy: (p) => `${p} faces tension, creating guarded or strained behavior.`,
  Debilitated: (p, s) => `${p} feels blocked or vulnerable in ${s}, needing conscious redirection.`,
};

// INSIDE THE BOX: Strictly BPHS Functional Nature — what the planet is actively causing/delivering
const FUNCTIONAL_BLURB = {
  // yogakaraka: (p) => `As a supreme Yogakaraka ruling both Kendra and Trikona houses, ${p} actively causes major career elevations, status amplification, and powerful Raja Yoga results.`,
  benefic: (p) => `Acting as a functional benefic through auspicious house lordships, ${p} consistently delivers protective grace, growth opportunities, and constructive life outcomes.`,
  malefic: (p) => `Functioning as a malefic via challenging house lordships, ${p} triggers structural hurdles, friction, and tests of endurance that demand deliberate effort and management.`,
  neutral: (p) => `Holding a neutral functional standing, ${p} produces mixed or conditional results, letting situational house placement and conjunctions dictate its primary output.`,
};

/** Builds the separated descriptive text. */
export function getPlanetExplanation(planet, planetSign, ascendantSign, planetHouse) {
  const dignity = getDignity(planet, planetSign);
  const nature = getFunctionalNature(planet, ascendantSign);

  return {
    dignity,
    nature,
    dignityText: DIGNITY_BLURB[dignity]?.(planet, planetSign, planetHouse) || '',
    natureText: FUNCTIONAL_BLURB[nature]?.(planet) || '',
  };
}