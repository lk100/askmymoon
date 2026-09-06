const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

const PLANET_MATURITY_AGES = {
  Sun: 22,
  Moon: 24,
  Mars: 28,
  Mercury: 32,
  Jupiter: 16,
  Venus: 25,
  Saturn: 36,
  Rahu: 42,
  Ketu: 48,
};

const PLANET_CAREER_DIRECTIONS = {
  Sun: 'leadership, administration, public authority, or work where visibility matters',
  Moon: 'people care, hospitality, public service, communication, or work shaped by changing needs',
  Mars: 'engineering, operations, technology, competition, surgery, or decisive problem-solving',
  Mercury: 'analysis, writing, commerce, software, sales, media, or communication-heavy work',
  Jupiter: 'teaching, consulting, law, finance, advising, or work involving knowledge and growth',
  Venus: 'design, beauty, luxury, relationships, branding, arts, or client-facing work',
  Saturn: 'systems, research, compliance, infrastructure, administration, or disciplined long-term work',
  Rahu: 'digital platforms, foreign links, unconventional industries, innovation, or rapid change',
  Ketu: 'research, specialist work, investigation, spirituality, or independent problem-solving',
};

const SIGN_CAREER_DIRECTIONS = {
  Aries: 'initiative, entrepreneurship, leadership, and fast-moving decisions',
  Taurus: 'finance, assets, food, design, comfort, and steady value creation',
  Gemini: 'communication, writing, sales, data, media, and adaptable work',
  Cancer: 'care, public support, hospitality, education, and people-centered work',
  Leo: 'leadership, performance, management, visibility, and creative authority',
  Virgo: 'analysis, health, service, quality control, research, and practical systems',
  Libra: 'partnerships, negotiation, design, law, diplomacy, and client relations',
  Scorpio: 'research, investigation, risk, transformation, finance, and confidential work',
  Sagittarius: 'teaching, publishing, travel, law, consulting, and global perspectives',
  Capricorn: 'management, governance, operations, structure, and long-term achievement',
  Aquarius: 'technology, networks, social impact, innovation, and independent thinking',
  Pisces: 'healing, imagination, counseling, spirituality, service, and creative work',
};

const QUESTION_KEYS = {
  'Which career direction is most aligned with my strengths?': 'strengths',
  'What is causing blockages in my career?': 'blockages',
  'When will I get success in my career?': 'success',
  'Should I go for a job or business?': 'jobOrBusiness',
};

function getHouse(chart, number) {
  return chart?.career_houses?.[`${number}th_house`] || {};
}

function getHouseSign(chart, number) {
  const explicitSign = getHouse(chart, number).sign;
  if (explicitSign) return explicitSign;
  const ascendantSign = chart?.ascendant?.sign;
  const ascendantIndex = ZODIAC_SIGNS.indexOf(ascendantSign);
  return ascendantIndex >= 0 ? ZODIAC_SIGNS[(ascendantIndex + number - 1) % 12] : 'the relevant sign';
}

function getNamedPlanets(house) {
  return [
    ...(house.planets || []),
    ...(house.conjuncting_lord || []),
    ...(house.aspecting_planets || []),
  ].filter((planet) => planet?.name);
}

function uniqueNames(planets) {
  return [...new Set(planets.map((planet) => planet.name))];
}

function formatList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getMaturityDate(dob, planetName) {
  const maturityAge = PLANET_MATURITY_AGES[planetName];
  if (!maturityAge || !/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return null;
  const date = new Date(`${dob}T00:00:00`);
  date.setFullYear(date.getFullYear() + maturityAge);
  return { age: maturityAge, date: formatDate(date) };
}

function answerStrengths(chart) {
  const tenthHouse = getHouse(chart, 10);
  const tenthSign = getHouseSign(chart, 10);
  const planets = uniqueNames(getNamedPlanets(tenthHouse));
  const directions = [SIGN_CAREER_DIRECTIONS[tenthSign]];
  planets.forEach((planet) => directions.push(PLANET_CAREER_DIRECTIONS[planet]));
  const usefulDirections = directions.filter(Boolean);
  const planetText = planets.length ? ` The active planetary pattern includes ${formatList(planets)}, which adds ${formatList(planets.map((planet) => PLANET_CAREER_DIRECTIONS[planet]).filter(Boolean))}.` : '';
  return `Your 10th house carries ${tenthSign} themes: ${SIGN_CAREER_DIRECTIONS[tenthSign] || 'a career path that should be read through its ruling planet'}. This points toward ${usefulDirections[0] || 'work that combines your natural strengths with consistent responsibility'}.${planetText}`;
}

function answerBlockages(chart) {
  const sixthHouse = getHouse(chart, 6);
  const tenthHouse = getHouse(chart, 10);
  const sixthLord = sixthHouse.lord?.name || 'the 6th-house lord';
  const tenthLord = tenthHouse.lord?.name || 'the 10th-house lord';
  const sixthPlacement = sixthHouse.lord?.sign ? ` in ${sixthHouse.lord.sign}` : '';
  const tenthPlacement = tenthHouse.lord?.sign ? ` in ${tenthHouse.lord.sign}` : '';
  return `The main blockage is likely a two-part pattern: the 6th-house lord, ${sixthLord}${sixthPlacement}, points to the daily-work problem of managing pressure, routines, competition, or unresolved service issues. The 10th-house lord, ${tenthLord}${tenthPlacement}, points to the professional direction that needs clearer structure and ownership. Focus first on consistent routines and then on one measurable career priority instead of scattering effort.`;
}

function answerSuccess(chart, dob) {
  const tenthLord = chart?.career_houses?.['10th_house']?.lord?.name;
  const maturity = getMaturityDate(dob, tenthLord);
  if (!tenthLord) return 'Your 10th-house lord is not available in the chart data, so the career maturity date cannot be calculated yet.';
  if (!maturity) return `Your 10th-house lord is ${tenthLord}. Its planetary maturity is the timing marker to watch, but a birth date is needed to calculate the calendar date.`;
  return `Your 10th-house lord is ${tenthLord}. Its traditional planetary maturity point is around age ${maturity.age}, which places the maturity date around ${maturity.date}. Treat this as a period of stronger career responsibility and clarity, not a guaranteed single event.`;
}

function answerJobOrBusiness(chart) {
  const sixthHouse = getHouse(chart, 6);
  const sixthSign = getHouseSign(chart, 6);
  const sixthLord = sixthHouse.lord?.name;
  const lordPlacement = sixthHouse.lord?.sign;
  const businessPlanets = ['Sun', 'Mars', 'Jupiter', 'Rahu'];
  const pattern = uniqueNames(getNamedPlanets(sixthHouse));
  const supportsEmployment = ['Virgo', 'Capricorn', 'Taurus', 'Cancer'].includes(sixthSign) || Boolean(sixthLord);
  const supportsBusiness = pattern.some((planet) => businessPlanets.includes(planet)) || ['Aries', 'Leo', 'Sagittarius', 'Aquarius'].includes(sixthSign);
  const direction = supportsBusiness && !supportsEmployment ? 'business or independent work' : supportsEmployment && !supportsBusiness ? 'structured employment' : 'a staged approach: stable employment while building an independent option';
  return `The 6th house is in ${sixthSign}, and its lord is ${sixthLord || 'not available'}${lordPlacement ? ` in ${lordPlacement}` : ''}. The 6th-house pattern supports ${direction}. Your practical next step is to test the preferred direction with a small, measurable responsibility before making a complete switch.`;
}

export function getCareerFreeAnswer(question, chart, dob) {
  const key = QUESTION_KEYS[question];
  if (!key || !chart) return null;
  if (key === 'strengths') return answerStrengths(chart);
  if (key === 'blockages') return answerBlockages(chart);
  if (key === 'success') return answerSuccess(chart, dob);
  return answerJobOrBusiness(chart);
}

export { QUESTION_KEYS };
