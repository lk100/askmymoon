export const VEDIC_NUMEROLOGY_MEANINGS = {
  1: 'Sun - Leadership, willpower, individuality. Ruled by Surya.',
  2: 'Moon - Sensitivity, diplomacy, peace. Ruled by Chandra.',
  3: 'Jupiter - Wisdom, creativity, growth. Ruled by Guru.',
  4: 'Rahu - Innovation, instability, karmic influences.',
  5: 'Mercury - Communication, adaptability, intellect. Ruled by Budh.',
  6: 'Venus - Harmony, beauty, material pleasures. Ruled by Shukra.',
  7: 'Ketu - Spirituality, isolation, mysticism.',
  8: 'Saturn - Discipline, ambition, karmic justice. Ruled by Shani.',
  9: 'Mars - Courage, passion, action. Ruled by Mangal.',
};

export const VEDIC_NUMEROLOGY_PLANETS = {
  1: 'Sun',
  2: 'Moon',
  3: 'Jupiter',
  4: 'Rahu',
  5: 'Mercury',
  6: 'Venus',
  7: 'Ketu',
  8: 'Saturn',
  9: 'Mars',
};

const CHALDEAN_MAP = {
  1: 'A',
  2: 'BCK',
  3: 'GJL',
  4: 'DM',
  5: 'ENH',
  6: 'UVWX',
  7: 'OZ',
  8: 'FP',
  9: 'IRQSTY',
};

const PYTHAGOREAN_MAP = {
  1: 'AJS',
  2: 'BKT',
  3: 'CLU',
  4: 'DMV',
  5: 'ENW',
  6: 'FOX',
  7: 'GPY',
  8: 'HQZ',
  9: 'IR',
};

const VOWEL_MAP = { A: 1, E: 5, I: 9, O: 6, U: 3, Y: 7 };
const MASTER_NUMBERS = new Set([11, 22, 33]);

function getPlanetNumber(number) {
  if (number <= 9) return number;
  return reduceToDigit(number);
}

export function getPlanetForNumber(number) {
  const planetNumber = getPlanetNumber(number);
  return VEDIC_NUMEROLOGY_PLANETS[planetNumber] || null;
}

export function reduceToDigit(value) {
  let number = Number(value);
  if (!Number.isFinite(number)) return null;

  while (number > 9 && !MASTER_NUMBERS.has(number)) {
    number = String(number).split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  return number;
}

function sumDigits(value) {
  return String(value).split('').reduce((sum, digit) => sum + Number(digit), 0);
}

function mapLetter(letter, mapping) {
  const normalizedLetter = letter.toUpperCase();
  const match = Object.entries(mapping).find(([, letters]) => letters.includes(normalizedLetter));
  return match ? Number(match[0]) : 0;
}

function parseDate(dateString) {
  const parts = dateString?.split('-').map(Number);
  if (!parts || parts.length !== 3 || parts.some((part) => !Number.isInteger(part))) return null;
  return { year: parts[0], month: parts[1], day: parts[2] };
}

export function calculateRootNumber(dateString) {
  const date = parseDate(dateString);
  return date ? reduceToDigit(date.day) : null;
}

// ✅ Destiny Number now DOB-based (total sum of date)
export function calculateDestinyNumber(dateString) {
  const date = parseDate(dateString);
  if (!date) return null;
  return reduceToDigit(sumDigits(date.year) + sumDigits(date.month) + sumDigits(date.day));
}

// Life Path remains DOB-based (same as Destiny in many traditions)
export function calculateLifePathNumber(dateString) {
  const date = parseDate(dateString);
  if (!date) return null;
  return reduceToDigit(sumDigits(date.year) + sumDigits(date.month) + sumDigits(date.day));
}

// Name Energy calculations
export function calculatePersonalityNumber(fullName) {
  const total = [...fullName].reduce((sum, character) => {
    if (!character.match(/[a-z]/i) || 'AEIOU'.includes(character.toUpperCase())) return sum;
    return sum + mapLetter(character, PYTHAGOREAN_MAP);
  }, 0);
  return reduceToDigit(total);
}

export function calculateExpressionNumber(fullName) {
  const total = [...fullName].reduce((sum, character) => (
    character.match(/[a-z]/i) ? sum + mapLetter(character, PYTHAGOREAN_MAP) : sum
  ), 0);
  return reduceToDigit(total);
}

export function calculateSoulUrgeNumber(fullName) {
  const total = [...fullName].reduce((sum, character) => {
    const value = VOWEL_MAP[character.toUpperCase()];
    return value ? sum + value : sum;
  }, 0);
  return reduceToDigit(total);
}

export function calculateSubconsciousSelfNumber(fullName) {
  const uniqueLetters = new Set([...fullName].filter((character) => character.match(/[a-z]/i)).map((character) => character.toUpperCase()));
  return reduceToDigit(uniqueLetters.size);
}

export function calculateChallengeNumbers(dateString) {
  const date = parseDate(dateString);
  if (!date) return [];

  const day = reduceToDigit(date.day);
  const month = reduceToDigit(date.month);
  const year = reduceToDigit(date.year);
  const first = Math.abs(day - month);
  const second = Math.abs(day - year);
  const third = Math.abs(month - year);
  const fourth = Math.abs(first - third);

  return [first, second, third, fourth].map(reduceToDigit);
}

export function calculateNumerology(fullName, dateString) {
  const challenges = calculateChallengeNumbers(dateString);
  const numbers = {
    root: calculateRootNumber(dateString),
    destiny: calculateDestinyNumber(dateString), // ✅ DOB-based
    lifePath: calculateLifePathNumber(dateString),
    personality: calculatePersonalityNumber(fullName),
    expression: calculateExpressionNumber(fullName),
    soulUrge: calculateSoulUrgeNumber(fullName),
    subconsciousSelf: calculateSubconsciousSelfNumber(fullName),
    challengeOne: challenges[0] ?? null,
    challengeTwo: challenges[1] ?? null,
    challengeThree: challenges[2] ?? null,
    challengeFour: challenges[3] ?? null,
  };

  return Object.fromEntries(
    Object.entries(numbers).map(([key, number]) => {
      const planetNumber = getPlanetNumber(number);
      return [key, {
        number,
        planet: getPlanetForNumber(number),
        meaning: VEDIC_NUMEROLOGY_MEANINGS[planetNumber] || 'Your number carries a unique personal influence.',
      }];
    })
  );
}
