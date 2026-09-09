// ============================================================================
// astroData.js
// Static classical Vedic astrology reference data used by blogGenerators.js
// to compose factually-grounded articles. Nothing here is user/chart-specific.
// ============================================================================

export const SIGN_ORDER = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

export const SIGNS = {
  aries: { key: 'aries', name: 'Aries', sanskrit: 'Mesha', symbol: 'the Ram', element: 'Fire', quality: 'Cardinal (Chara)', ruler: 'mars', keyword: 'initiative, courage, and raw new beginnings', bodyPart: 'head' },
  taurus: { key: 'taurus', name: 'Taurus', sanskrit: 'Vrishabha', symbol: 'the Bull', element: 'Earth', quality: 'Fixed (Sthira)', ruler: 'venus', keyword: 'stability, comfort, and material security', bodyPart: 'face and throat' },
  gemini: { key: 'gemini', name: 'Gemini', sanskrit: 'Mithuna', symbol: 'the Twins', element: 'Air', quality: 'Dual (Dwiswabhava)', ruler: 'mercury', keyword: 'communication, curiosity, and duality', bodyPart: 'arms and shoulders' },
  cancer: { key: 'cancer', name: 'Cancer', sanskrit: 'Karka', symbol: 'the Crab', element: 'Water', quality: 'Cardinal (Chara)', ruler: 'moon', keyword: 'emotional security, nurturing, and home', bodyPart: 'chest' },
  leo: { key: 'leo', name: 'Leo', sanskrit: 'Simha', symbol: 'the Lion', element: 'Fire', quality: 'Fixed (Sthira)', ruler: 'sun', keyword: 'authority, self-expression, and leadership', bodyPart: 'heart and upper back' },
  virgo: { key: 'virgo', name: 'Virgo', sanskrit: 'Kanya', symbol: 'the Maiden', element: 'Earth', quality: 'Dual (Dwiswabhava)', ruler: 'mercury', keyword: 'precision, service, and analysis', bodyPart: 'abdomen' },
  libra: { key: 'libra', name: 'Libra', sanskrit: 'Tula', symbol: 'the Scales', element: 'Air', quality: 'Cardinal (Chara)', ruler: 'venus', keyword: 'balance, partnership, and fairness', bodyPart: 'lower back and kidneys' },
  scorpio: { key: 'scorpio', name: 'Scorpio', sanskrit: 'Vrishchika', symbol: 'the Scorpion', element: 'Water', quality: 'Fixed (Sthira)', ruler: 'mars', keyword: 'intensity, transformation, and hidden depth', bodyPart: 'reproductive organs' },
  sagittarius: { key: 'sagittarius', name: 'Sagittarius', sanskrit: 'Dhanu', symbol: 'the Archer', element: 'Fire', quality: 'Dual (Dwiswabhava)', ruler: 'jupiter', keyword: 'expansion, belief, and higher learning', bodyPart: 'hips and thighs' },
  capricorn: { key: 'capricorn', name: 'Capricorn', sanskrit: 'Makara', symbol: 'the Sea-Goat', element: 'Earth', quality: 'Cardinal (Chara)', ruler: 'saturn', keyword: 'discipline, ambition, and long-term structure', bodyPart: 'knees' },
  aquarius: { key: 'aquarius', name: 'Aquarius', sanskrit: 'Kumbha', symbol: 'the Water-Bearer', element: 'Air', quality: 'Fixed (Sthira)', ruler: 'saturn', keyword: 'detachment, innovation, and community', bodyPart: 'calves and ankles' },
  pisces: { key: 'pisces', name: 'Pisces', sanskrit: 'Meena', symbol: 'the Fish', element: 'Water', quality: 'Dual (Dwiswabhava)', ruler: 'jupiter', keyword: 'surrender, imagination, and spiritual merger', bodyPart: 'feet' },
};

export const PLANETS = {
  sun: {
    key: 'sun', name: 'Sun', sanskrit: 'Surya', gender: 'Male', nature: 'malefic', guna: 'Sattva',
    element: 'Fire', colour: 'copper-red', deity: 'Surya Deva', role: 'the king',
    karakatva: 'soul, self-confidence, father, authority, government, and vitality',
    rulerOf: ['leo'], exaltation: { sign: 'aries', degree: 10 }, debilitation: { sign: 'libra', degree: 10 },
    moolatrikona: { sign: 'leo', range: "0\u00b0\u201320\u00b0" },
    friends: ['moon', 'mars', 'jupiter'], neutral: ['mercury'], enemies: ['venus', 'saturn'],
    retrogrades: false, canBeCombust: false, combustOrb: null, aspects: [7],
  },
  moon: {
    key: 'moon', name: 'Moon', sanskrit: 'Chandra', gender: 'Female', nature: 'benefic (waxing) / malefic (waning)', guna: 'Sattva',
    element: 'Water', colour: 'white', deity: 'Chandra Deva', role: 'the queen',
    karakatva: 'mind, emotions, mother, nurturing, and public perception',
    rulerOf: ['cancer'], exaltation: { sign: 'taurus', degree: 3 }, debilitation: { sign: 'scorpio', degree: 3 },
    moolatrikona: { sign: 'taurus', range: "3\u00b0\u201330\u00b0" },
    friends: ['sun', 'mercury'], neutral: ['mars', 'jupiter', 'venus', 'saturn'], enemies: [],
    retrogrades: false, canBeCombust: true, combustOrb: 12, aspects: [7],
  },
  mars: {
    key: 'mars', name: 'Mars', sanskrit: 'Mangal', gender: 'Male', nature: 'malefic', guna: 'Tamas',
    element: 'Fire', colour: 'red', deity: 'Kartikeya / Angaraka', role: 'the commander-in-chief',
    karakatva: 'courage, drive, siblings, land, and physical energy',
    rulerOf: ['aries', 'scorpio'], exaltation: { sign: 'capricorn', degree: 28 }, debilitation: { sign: 'cancer', degree: 28 },
    moolatrikona: { sign: 'aries', range: "0\u00b0\u201312\u00b0" },
    friends: ['sun', 'moon', 'jupiter'], neutral: ['venus', 'saturn'], enemies: ['mercury'],
    retrogrades: true, canBeCombust: true, combustOrb: 17, aspects: [4, 7, 8],
  },
  mercury: {
    key: 'mercury', name: 'Mercury', sanskrit: 'Budh', gender: 'Neutral', nature: 'benefic (alone) / adapts to company', guna: 'Rajas',
    element: 'Earth', colour: 'green', deity: 'Vishnu (as Budha)', role: 'the prince',
    karakatva: 'intellect, communication, commerce, and analytical skill',
    rulerOf: ['gemini', 'virgo'], exaltation: { sign: 'virgo', degree: 15 }, debilitation: { sign: 'pisces', degree: 15 },
    moolatrikona: { sign: 'virgo', range: "16\u00b0\u201320\u00b0" },
    friends: ['sun', 'venus'], neutral: ['mars', 'jupiter', 'saturn'], enemies: ['moon'],
    retrogrades: true, canBeCombust: true, combustOrb: 14, aspects: [7],
  },
  jupiter: {
    key: 'jupiter', name: 'Jupiter', sanskrit: 'Guru', gender: 'Male', nature: 'benefic', guna: 'Sattva',
    element: 'Ether', colour: 'yellow', deity: 'Brihaspati', role: 'the minister and teacher',
    karakatva: 'wisdom, expansion, wealth, children, and spiritual growth',
    rulerOf: ['sagittarius', 'pisces'], exaltation: { sign: 'cancer', degree: 5 }, debilitation: { sign: 'capricorn', degree: 5 },
    moolatrikona: { sign: 'sagittarius', range: "0\u00b0\u201310\u00b0" },
    friends: ['sun', 'moon', 'mars'], neutral: ['saturn'], enemies: ['mercury', 'venus'],
    retrogrades: true, canBeCombust: true, combustOrb: 11, aspects: [5, 7, 9],
  },
  venus: {
    key: 'venus', name: 'Venus', sanskrit: 'Shukra', gender: 'Female', nature: 'benefic', guna: 'Rajas',
    element: 'Water', colour: 'white/pastel', deity: 'Lakshmi', role: 'the minister of pleasure and diplomacy',
    karakatva: 'love, relationships, beauty, luxury, and creative refinement',
    rulerOf: ['taurus', 'libra'], exaltation: { sign: 'pisces', degree: 27 }, debilitation: { sign: 'virgo', degree: 27 },
    moolatrikona: { sign: 'libra', range: "0\u00b0\u201315\u00b0" },
    friends: ['mercury', 'saturn'], neutral: ['mars', 'jupiter'], enemies: ['sun', 'moon'],
    retrogrades: true, canBeCombust: true, combustOrb: 10, aspects: [7],
  },
  saturn: {
    key: 'saturn', name: 'Saturn', sanskrit: 'Shani', gender: 'Neutral', nature: 'malefic', guna: 'Tamas',
    element: 'Air', colour: 'dark blue/black', deity: 'Shani Deva', role: 'the servant and disciplinarian',
    karakatva: 'discipline, delay, longevity, hard work, and karmic lessons',
    rulerOf: ['capricorn', 'aquarius'], exaltation: { sign: 'libra', degree: 20 }, debilitation: { sign: 'aries', degree: 20 },
    moolatrikona: { sign: 'aquarius', range: "0\u00b0\u201320\u00b0" },
    friends: ['mercury', 'venus'], neutral: ['jupiter'], enemies: ['sun', 'moon', 'mars'],
    retrogrades: true, canBeCombust: true, combustOrb: 15, aspects: [3, 7, 10],
  },
  rahu: {
    key: 'rahu', name: 'Rahu', sanskrit: 'Rahu', gender: 'Neutral', nature: 'malefic (shadow)', guna: 'Tamas',
    element: 'Air', colour: 'smoky grey', deity: 'none classical (associated with illusion)', role: 'the outsider / foreign minister',
    karakatva: 'obsession, ambition, foreign connections, and material hunger',
    rulerOf: [], exaltation: { sign: 'gemini', degree: 20 }, debilitation: { sign: 'sagittarius', degree: 20 },
    moolatrikona: null,
    friends: ['mercury', 'venus', 'saturn'], neutral: ['jupiter'], enemies: ['sun', 'moon', 'mars'],
    retrogrades: false, canBeCombust: false, combustOrb: null, aspects: [5, 7, 9],
  },
  ketu: {
    key: 'ketu', name: 'Ketu', sanskrit: 'Ketu', gender: 'Neutral', nature: 'malefic (shadow)', guna: 'Tamas',
    element: 'Fire', colour: 'smoky', deity: 'none classical (associated with moksha)', role: 'the ascetic / renunciate',
    karakatva: 'detachment, past-life mastery, spirituality, and sudden loss or release',
    rulerOf: [], exaltation: { sign: 'sagittarius', degree: 20 }, debilitation: { sign: 'gemini', degree: 20 },
    moolatrikona: null,
    friends: ['mars', 'venus', 'saturn'], neutral: ['mercury', 'jupiter'], enemies: ['sun', 'moon'],
    retrogrades: false, canBeCombust: false, combustOrb: null, aspects: [5, 7, 9],
  },
};

export const HOUSES = {
  1: { sanskrit: 'Lagna / Tanu Bhava', significations: 'self, physical body, personality, and overall vitality', karaka: 'Sun' },
  2: { sanskrit: 'Dhana Bhava', significations: 'wealth, family, speech, and accumulated resources', karaka: 'Jupiter' },
  3: { sanskrit: 'Sahaja Bhava', significations: 'courage, siblings, short journeys, and self-effort', karaka: 'Mars' },
  4: { sanskrit: 'Sukha Bhava', significations: 'home, mother, emotional comfort, and property', karaka: 'Moon' },
  5: { sanskrit: 'Putra Bhava', significations: 'children, creativity, intelligence, and romance', karaka: 'Jupiter' },
  6: { sanskrit: 'Ripu Bhava', significations: 'obstacles, health, debts, and competition', karaka: 'Mars/Saturn' },
  7: { sanskrit: 'Kalatra Bhava', significations: 'marriage, partnership, and business relationships', karaka: 'Venus' },
  8: { sanskrit: 'Ayur Bhava', significations: 'transformation, longevity, hidden matters, and sudden events', karaka: 'Saturn' },
  9: { sanskrit: 'Dharma Bhava', significations: 'fortune, higher learning, father, and spiritual belief', karaka: 'Jupiter/Sun' },
  10: { sanskrit: 'Karma Bhava', significations: 'career, public status, and life direction', karaka: 'Sun/Mercury/Jupiter/Saturn' },
  11: { sanskrit: 'Labha Bhava', significations: 'gains, income, networks, and aspirations fulfilled', karaka: 'Jupiter' },
  12: { sanskrit: 'Vyaya Bhava', significations: 'loss, isolation, foreign lands, and spiritual liberation', karaka: 'Saturn/Ketu' },
};

export const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'ketu', deity: 'Ashwini Kumaras', symbol: 'Horse\u2019s head', gana: 'Deva', nature: 'Swift (Kshipra)' },
  { name: 'Bharani', ruler: 'venus', deity: 'Yama', symbol: 'Yoni', gana: 'Manushya', nature: 'Fierce (Ugra)' },
  { name: 'Krittika', ruler: 'sun', deity: 'Agni', symbol: 'Razor', gana: 'Rakshasa', nature: 'Mixed (Sadharana)' },
  { name: 'Rohini', ruler: 'moon', deity: 'Brahma', symbol: 'Chariot/Cart', gana: 'Manushya', nature: 'Fixed (Dhruva)' },
  { name: 'Mrigashira', ruler: 'mars', deity: 'Soma', symbol: 'Deer\u2019s head', gana: 'Deva', nature: 'Soft (Mridu)' },
  { name: 'Ardra', ruler: 'rahu', deity: 'Rudra', symbol: 'Teardrop', gana: 'Manushya', nature: 'Sharp (Tikshna)' },
  { name: 'Punarvasu', ruler: 'jupiter', deity: 'Aditi', symbol: 'Bow and quiver', gana: 'Deva', nature: 'Moveable (Chara)' },
  { name: 'Pushya', ruler: 'saturn', deity: 'Brihaspati', symbol: 'Cow\u2019s udder', gana: 'Deva', nature: 'Light (Laghu)' },
  { name: 'Ashlesha', ruler: 'mercury', deity: 'Nagas', symbol: 'Coiled serpent', gana: 'Rakshasa', nature: 'Sharp (Tikshna)' },
  { name: 'Magha', ruler: 'ketu', deity: 'Pitrs', symbol: 'Royal throne', gana: 'Rakshasa', nature: 'Fierce (Ugra)' },
  { name: 'Purva Phalguni', ruler: 'venus', deity: 'Bhaga', symbol: 'Front legs of a bed', gana: 'Manushya', nature: 'Fierce (Ugra)' },
  { name: 'Uttara Phalguni', ruler: 'sun', deity: 'Aryaman', symbol: 'Back legs of a bed', gana: 'Manushya', nature: 'Fixed (Dhruva)' },
  { name: 'Hasta', ruler: 'moon', deity: 'Savitar', symbol: 'Palm of a hand', gana: 'Deva', nature: 'Light (Laghu)' },
  { name: 'Chitra', ruler: 'mars', deity: 'Vishwakarma', symbol: 'Bright jewel', gana: 'Rakshasa', nature: 'Soft (Mridu)' },
  { name: 'Swati', ruler: 'rahu', deity: 'Vayu', symbol: 'Young sprout', gana: 'Deva', nature: 'Moveable (Chara)' },
  { name: 'Vishakha', ruler: 'jupiter', deity: 'Indra-Agni', symbol: 'Triumphal archway', gana: 'Rakshasa', nature: 'Mixed (Sadharana)' },
  { name: 'Anuradha', ruler: 'saturn', deity: 'Mitra', symbol: 'Lotus', gana: 'Deva', nature: 'Soft (Mridu)' },
  { name: 'Jyeshtha', ruler: 'mercury', deity: 'Indra', symbol: 'Circular amulet', gana: 'Rakshasa', nature: 'Sharp (Tikshna)' },
  { name: 'Mula', ruler: 'ketu', deity: 'Nirriti', symbol: 'Bundle of roots', gana: 'Rakshasa', nature: 'Sharp (Tikshna)' },
  { name: 'Purva Ashadha', ruler: 'venus', deity: 'Apas', symbol: 'Fan/Tusk', gana: 'Manushya', nature: 'Fierce (Ugra)' },
  { name: 'Uttara Ashadha', ruler: 'sun', deity: 'Vishvadevas', symbol: 'Elephant tusk', gana: 'Manushya', nature: 'Fixed (Dhruva)' },
  { name: 'Shravana', ruler: 'moon', deity: 'Vishnu', symbol: 'Ear/Three footprints', gana: 'Deva', nature: 'Moveable (Chara)' },
  { name: 'Dhanishta', ruler: 'mars', deity: 'Vasus', symbol: 'Drum', gana: 'Rakshasa', nature: 'Moveable (Chara)' },
  { name: 'Shatabhisha', ruler: 'rahu', deity: 'Varuna', symbol: 'Empty circle', gana: 'Rakshasa', nature: 'Moveable (Chara)' },
  { name: 'Purva Bhadrapada', ruler: 'jupiter', deity: 'Aja Ekapada', symbol: 'Front of funeral cot', gana: 'Manushya', nature: 'Fierce (Ugra)' },
  { name: 'Uttara Bhadrapada', ruler: 'saturn', deity: 'Ahir Budhnya', symbol: 'Back of funeral cot', gana: 'Manushya', nature: 'Fixed (Dhruva)' },
  { name: 'Revati', ruler: 'mercury', deity: 'Pushan', symbol: 'Fish', gana: 'Deva', nature: 'Soft (Mridu)' },
];

export const KARAKAS = [
  { key: 'atmakaraka', name: 'Atmakaraka', meaning: 'significator of the soul', desc: 'the planet with the highest degree in its sign, representing the core soul purpose of the incarnation' },
  { key: 'amatyakaraka', name: 'Amatyakaraka', meaning: 'significator of career and counsel', desc: 'the planet with the second-highest degree, representing career direction and trusted advisors' },
  { key: 'bhratrikaraka', name: 'Bhratrikaraka', meaning: 'significator of siblings', desc: 'the planet with the third-highest degree, representing siblings and courage' },
  { key: 'matrikaraka', name: 'Matrikaraka', meaning: 'significator of mother', desc: 'the planet with the fourth-highest degree, representing the mother and emotional foundation' },
  { key: 'putrakaraka', name: 'Putrakaraka', meaning: 'significator of children', desc: 'the planet with the fifth-highest degree, representing children and creative intelligence' },
  { key: 'gnatikaraka', name: 'Gnatikaraka', meaning: 'significator of obstacles and relatives', desc: 'the planet with the sixth-highest degree, representing rivals, obstacles, and extended relatives' },
  { key: 'darakaraka', name: 'Darakaraka', meaning: 'significator of the spouse', desc: 'the planet with the lowest degree, representing marriage and the life partner' },
];

export const YOGAS = [
  { name: 'Raja Yoga', desc: 'a lord of a Kendra house (1, 4, 7, 10) and a lord of a Trikona house (1, 5, 9) join by conjunction, mutual aspect, or exchange of signs, producing power, status, and authority' },
  { name: 'Dhana Yoga', desc: 'lords of wealth-related houses (2nd and 11th) combine favourably with each other or with the 1st, 5th, or 9th lords, producing financial prosperity' },
  { name: 'Gajakesari Yoga', desc: 'the Moon and Jupiter are placed in mutual Kendra positions (1st, 4th, 7th, or 10th from each other), producing intelligence, respect, and steady fortune' },
  { name: 'Panch Mahapurusha Yoga', desc: 'Mars, Mercury, Jupiter, Venus, or Saturn occupies a Kendra house in its own sign or exaltation, producing five distinct categories of exceptional personal strength' },
  { name: 'Neechabhanga Raja Yoga', desc: 'a debilitated planet\u2019s weakness is cancelled by specific supporting conditions (such as its dispositor being in a Kendra from the Lagna or Moon), turning apparent weakness into eventual strength' },
  { name: 'Chandra Mangal Yoga', desc: 'the Moon and Mars are conjunct in the same sign, producing entrepreneurial drive and material resourcefulness' },
  { name: 'Vipreet Raja Yoga', desc: 'lords of the 6th, 8th, or 12th houses are placed in another Dusthana house, producing success that emerges specifically from adversity or crisis' },
];

export const DOSHAS = [
  { name: 'Manglik Dosha (Kuja Dosha)', desc: 'Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Ascendant, Moon, or Venus, traditionally associated with friction or delay in marriage' },
  { name: 'Kaal Sarp Dosha', desc: 'all seven classical planets are hemmed between Rahu and Ketu on one side of the chart, traditionally associated with a life that feels externally blocked despite effort' },
  { name: 'Pitra Dosha', desc: 'the Sun is afflicted by Rahu, Ketu, or Saturn in the 9th house or its lord, traditionally linked to unresolved ancestral karma' },
  { name: 'Shani Sade Sati', desc: 'Saturn transits the 12th, 1st, and 2nd houses counted from the natal Moon sign, a roughly seven-and-a-half-year period of intensified discipline and restructuring' },
  { name: 'Grahan Dosha (Eclipse Dosha)', desc: 'the Sun or Moon is conjunct Rahu or Ketu in the birth chart, traditionally associated with clouded confidence or emotional clarity in that planet\u2019s domain' },
];

export const ASPECT_MEANINGS = {
  3: 'effort, initiative, and courage directed at the target house',
  4: 'disruption, sudden change, or forceful restructuring of the target house',
  5: 'wisdom, intelligence, and creative or strategic insight applied to the target house',
  7: 'direct opposition and partnership-like engagement — a full, mirrored influence on the target house',
  8: 'transformation, hidden tension, and intensity affecting the target house',
  9: 'fortune, guidance, and higher-purpose support for the target house',
  10: 'discipline, delay, and long-term structural pressure on the target house',
};