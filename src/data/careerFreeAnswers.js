const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const PLANET_MATURITY_AGES = {
  Sun: 22, Moon: 24, Mars: 28, Mercury: 32,
  Jupiter: 16, Venus: 25, Saturn: 36, Rahu: 42, Ketu: 48,
};

const PLANET_CAREER_DIRECTIONS = {
  Sun: 'leadership, administration, or high-visibility roles',
  Moon: 'people care, public-facing service, or dynamic environments',
  Mars: 'engineering, technology, strategy, or high-stakes problem-solving',
  Mercury: 'commerce, analytics, media, or tech-driven communications',
  Jupiter: 'advising, high-level consulting, finance, or executive wisdom',
  Venus: 'design, luxury, brand equity, or client-relationship management',
  Saturn: 'complex systems, research, corporate compliance, or long-term infrastructure',
  Rahu: 'digital platforms, global markets, disruptive innovation, or foreign links',
  Ketu: 'niche investigation, specialized research, or independent mastery',
};

const SIGN_CAREER_DIRECTIONS = {
  Aries: 'fast-moving leadership, pioneering projects, and direct authority',
  Taurus: 'asset management, steady value creation, and luxury/financial markets',
  Gemini: 'data-driven strategy, media, trading, and multi-stream commercial work',
  Cancer: 'organizational growth, public relations, and high-impact people leadership',
  Leo: 'executive control, brand authority, and high-stakes decision-making',
  Virgo: 'systems optimization, analytical research, and precision operations',
  Libra: 'strategic partnerships, corporate law, negotiation, and high-end client relations',
  Scorpio: 'risk transformation, confidential operations, and deep investigative strategy',
  Sagittarius: 'global expansion, advisory roles, publishing, and enterprise strategy',
  Capricorn: 'corporate hierarchy, large-scale operations, and institutional leadership',
  Aquarius: 'tech innovation, network building, and scalable modern systems',
  Pisces: 'creative strategy, global advisory, specialized consulting, and intuitive leadership',
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

// --- OPTIMIZED FOR CONVERSION & CURIOSITY ---

function answerStrengths(chart) {
  const tenthHouse = getHouse(chart, 10);
  const tenthSign = getHouseSign(chart, 10);
  const planets = uniqueNames(getNamedPlanets(tenthHouse));
  const planetText = planets.length 
    ? `**${formatList(planets)}** is directly activating this zone, blending ${formatList(planets.map((p) => PLANET_CAREER_DIRECTIONS[p]).filter(Boolean))} into your profile.` 
    : 'While no major planets sit here directly, its ruling planet governs how fast you rise.';

  return `Your 10th house of career rests in **${tenthSign}**, pointing toward a high-potential path in **${SIGN_CAREER_DIRECTIONS[tenthSign]}**.\n\n${planetText}\n\n**The Hidden Friction:** However, sitting on powerful potential without knowing your active **Dasha timing** can feel like driving with the handbrake on. Ask below to decode your current Dasha phase and exact industry placement.`;
}

function answerBlockages(chart) {
  const sixthHouse = getHouse(chart, 6);
  const tenthHouse = getHouse(chart, 10);
  const sixthLord = sixthHouse.lord?.name || 'your 6th-house lord';
  const tenthLord = tenthHouse.lord?.name || 'your 10th-house lord';
  const sixthPlacement = sixthHouse.lord?.sign ? ` in ${sixthHouse.lord.sign}` : '';
  const tenthPlacement = tenthHouse.lord?.sign ? ` in ${tenthHouse.lord.sign}` : '';

  return `Your chart shows a conflict between immediate effort and long-term recognition.\n\n* **Daily Friction:** Driven by **${sixthLord}${sixthPlacement}**, creating unexpected friction, workplace dynamics, or burnout.\n* **Growth Hold-Up:** Controlled by **${tenthLord}${tenthPlacement}**, which delays the exact promotion or public standing you deserve.\n\n**The Unlock:** Is this blockage caused by a temporary transit or an alignment mismatch? Ask a follow-up question below to reveal the specific astrological remedy to clear this obstacle.`;
}

function answerSuccess(chart, dob) {
  const tenthLord = chart?.career_houses?.['10th_house']?.lord?.name;
  const maturity = getMaturityDate(dob, tenthLord);

  if (!tenthLord) {
    return 'Your primary career ruler needs deeper chart calculation. Provide your full details to unlock your primary success timeline.';
  }

  if (!maturity) {
    return `Your primary career activation planet is **${tenthLord}**. Its maturity cycle marks your foundational career shift.\n\nTo map this to an exact calendar date and see your upcoming major career breakthrough window, unlock your full reading below.`;
  }

  return `Your career governor **${tenthLord}** reaches structural maturity around **Age ${maturity.age}** (roughly **${maturity.date}**). This is your baseline timeline for major professional stabilization.\n\n**However:** Breakthroughs usually trigger *before* this age during specific planetary Dashas.\n\nWant to know if your **current year** contains a hidden career promotion or job switch window? Ask your specific follow-up question below.`;
}

function answerJobOrBusiness(chart) {
  const sixthHouse = getHouse(chart, 6);
  const sixthSign = getHouseSign(chart, 6);
  const sixthLord = sixthHouse.lord?.name;
  const businessPlanets = ['Sun', 'Mars', 'Jupiter', 'Rahu'];
  const pattern = uniqueNames(getNamedPlanets(sixthHouse));

  const supportsBusiness = pattern.some((p) => businessPlanets.includes(p)) || ['Aries', 'Leo', 'Sagittarius', 'Aquarius'].includes(sixthSign);
  const PrimaryType = supportsBusiness ? 'Independent Business / Consulting' : 'Corporate Employment / Structured Hierarchy';
  const AlternateType = supportsBusiness ? 'Corporate Jobs' : 'Solopreneurship';

  return `Your 6th house in **${sixthSign}** (ruled by ${sixthLord || 'its planetary lord'}) shows a strong structural pull toward **${PrimaryType}** over pure ${AlternateType}.\n\n* **Risk Factor:** Transitioning too early without checking your 11th house (Gains) can result in cash-flow instability.\n* **Optimal Strategy:** A phased transition is likely indicated in your chart.\n\nShould you build a side-business now or switch jobs first? Ask your follow-up question below to map out your safest transition step.`;
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