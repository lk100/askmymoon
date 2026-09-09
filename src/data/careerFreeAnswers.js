const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const PLANET_MATURITY_AGES = {
  Sun: 22, Moon: 24, Mars: 28, Mercury: 32,
  Jupiter: 16, Venus: 25, Saturn: 36, Rahu: 42, Ketu: 48,
};

const SIGN_CAREER_DIRECTIONS = {
  Aries: 'fast-moving leadership and direct authority',
  Taurus: 'asset management and steady value creation',
  Gemini: 'data-driven strategy and multi-stream commercial work',
  Cancer: 'organizational growth and high-impact people leadership',
  Leo: 'executive control and high-stakes decision-making',
  Virgo: 'systems optimization and precision operations',
  Libra: 'strategic partnerships and high-end client relations',
  Scorpio: 'risk transformation and deep investigative strategy',
  Sagittarius: 'global expansion and enterprise strategy',
  Capricorn: 'institutional leadership and large-scale operations',
  Aquarius: 'tech innovation and scalable modern systems',
  Pisces: 'creative strategy and intuitive leadership',
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

// Backend shape: each house has a flat "influences" array, each entry
// tagged by "relation": placed_in_house | aspects_house | aspects_lord | conjunct_with_lord
function getInfluences(house, relations) {
  return (house.influences || []).filter(
    (entry) => entry?.name && relations.includes(entry.relation)
  );
}

function hasAnyInfluence(house) {
  return getInfluences(house, [
    'placed_in_house', 'aspects_house', 'aspects_lord', 'conjunct_with_lord',
  ]).length > 0;
}

function getCurrentMahadasha(chart) {
  return chart?.current_mahadasha || null;
}

function getCurrentAntardasha(chart) {
  return chart?.current_antardasha || null;
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

// --- TEASER ANSWERS ---
// Rule for every function below: name the CATEGORY (house, sign, "a tension
// exists", "a dasha is active") — never name the specific planet/lord/date
// that resolves it. That mechanism is what the paid follow-up unlocks.

function answerStrengths(chart) {
  const tenthSign = getHouseSign(chart, 10);
  const tenthHouse = getHouse(chart, 10);
  const tenthLord = tenthHouse.lord?.name;
  const hasDirectActivation = hasAnyInfluence(tenthHouse);

  const insight = hasDirectActivation
    ? `and it's not sitting quiet — there's real planetary activity here actively shaping how far this can go`
    : `and while the house itself looks quiet, ${tenthLord || 'its ruling planet'} is doing the real work from elsewhere in your chart`;

  return `Your 10th house of career sits in **${tenthSign}**, which naturally leans toward **${SIGN_CAREER_DIRECTIONS[tenthSign]}**, ${insight}.\n\nWhether that activity is currently helping you or working against this exact strength depends on which planetary period you're in right now — the same placement can mean very different things a year apart.`;
}

function answerBlockages(chart) {
  const sixthHouse = getHouse(chart, 6);
  const tenthHouse = getHouse(chart, 10);
  const sixthSign = getHouseSign(chart, 6);
  const tenthSign = getHouseSign(chart, 10);
  const tenthLord = tenthHouse.lord?.name;

  return `Your chart shows a real conflict between two houses — your **6th house (${sixthSign})**, where you're putting in daily effort, and your **10th house (${tenthSign})**, where recognition is supposed to show up.\n\n${tenthLord || 'Your 10th house lord'} is currently caught in a planetary period that's slowing down how fast that effort turns into visible results — this is why the promotion, the raise, or the recognition keeps feeling one step away instead of arriving.`;
}

function answerSuccess(chart, dob) {
  const tenthLord = chart?.career_houses?.['10th_house']?.lord?.name;
  const maturity = getMaturityDate(dob, tenthLord);

  if (!tenthLord) {
    return 'Your primary career ruler needs deeper chart calculation. Provide your full details to unlock your primary success timeline.';
  }

  const baseline = maturity
    ? `Your career house carries a natural stabilization age of **${maturity.age}** — but this is the generic baseline every chart with your career-ruler placement shares. It's rarely when your actual breakthrough happens.`
    : `Your career house carries a natural maturity cycle, but that cycle alone rarely marks when your actual breakthrough happens.`;

  return `${baseline}\n\nThe real trigger is a specific planetary period — one most people don't even know they're currently in. Depending on which period is active for you right now, your true breakthrough window could already be open, months away, or years past.`;
}

function answerJobOrBusiness(chart) {
  const sixthHouse = getHouse(chart, 6);
  const sixthSign = getHouseSign(chart, 6);
  const sixthLord = sixthHouse.lord?.name;
  const businessSigns = ['Aries', 'Leo', 'Sagittarius', 'Aquarius'];
  const hasStrongPull = hasAnyInfluence(sixthHouse) || businessSigns.includes(sixthSign);

  const leaning = hasStrongPull
    ? `a genuine pull toward independence, with ${sixthLord || 'its ruling planet'} sitting in a house built for risk and competition`
    : `a pull toward structure over a solo leap, with ${sixthLord || 'its ruling planet'} favoring steady ground`;

  return `Your 6th house sits in **${sixthSign}**, and your chart shows ${leaning} — but the same placement that creates this pull is also caught in a timing conflict with your current planetary period, which is likely why the idea keeps circling back without you acting on it yet.`;
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