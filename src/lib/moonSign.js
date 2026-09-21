// lib/moonSign.js
//
// Moon sign calculator. No API, no dependencies.
//
// Unlike the sun sign, the Moon changes sign every 2-3 days, so a lookup table
// cannot work. We compute the Moon's ecliptic longitude with the main terms of
// Meeus' lunar theory (Astronomical Algorithms, ch. 47). Accuracy is about
// 0.01 degrees, far finer than a 30-degree sign.
//
//   - "western": tropical zodiac
//   - "vedic":   sidereal zodiac (Rashi), tropical longitude minus the Lahiri ayanamsa
//
// The birth time must be converted to UTC first, which is why the birth place
// time zone (IANA name, e.g. "Asia/Kolkata") is needed.

import { SIGNS, SIGN_ORDER } from './sunSign';

export { SIGNS, SIGN_ORDER };

/* ------------------------------------------------------------------ */
/* Moon sign content                                                   */
/* ------------------------------------------------------------------ */

export const MOON_TRAITS = {
  aries: {
    tagline: 'Quick, bold feelings',
    emotions: 'With the Moon in Aries your feelings arrive fast and honest. You react in the moment, say what you feel and move on just as quickly. Emotional energy needs an outlet, and you feel best when you are active.',
    needs: 'Independence, action and the freedom to be direct.',
    love: 'You love with enthusiasm and want a partner who is straightforward. Slow or mixed signals frustrate you.',
    home: 'A lively home where you can do things your own way. You protect family fiercely.',
    wellbeing: 'Stress shows up as irritation or tension. Exercise is your best emotional reset.',
    strengths: ['Emotional courage', 'Honesty', 'Resilience', 'Spontaneity'],
    challenges: ['Quick temper', 'Impatience', 'Reacting before reflecting'],
    compatible: ['leo', 'sagittarius', 'gemini'],
  },
  taurus: {
    tagline: 'Calm, steady comfort',
    emotions: 'With the Moon in Taurus you feel safest when life is predictable. You are calm, sensual and slow to anger, but once upset you can dig in. Comfort, good food and familiar routines soothe you.',
    needs: 'Security, stability and physical comfort.',
    love: 'Loyal and affectionate. You show love through steady presence, touch and thoughtful gestures.',
    home: 'A beautiful, comfortable home is essential. You build a nest and keep it.',
    wellbeing: 'Change is your main stressor. Nature, good meals and gentle routine restore you.',
    strengths: ['Emotional stability', 'Loyalty', 'Patience', 'Grounded presence'],
    challenges: ['Stubbornness', 'Resisting change', 'Comfort eating'],
    compatible: ['cancer', 'virgo', 'capricorn'],
  },
  gemini: {
    tagline: 'Curious, talkative heart',
    emotions: 'With the Moon in Gemini you process feelings by talking and thinking about them. Your moods shift quickly and you need variety. Understanding an emotion helps you feel it less heavily.',
    needs: 'Conversation, variety and mental stimulation.',
    love: 'You bond through words, humour and shared curiosity. A partner who is also a friend suits you.',
    home: 'A busy, social home full of books, screens, visitors and chatter.',
    wellbeing: 'An overactive mind disturbs sleep. Writing, breathing exercises and time away from screens help.',
    strengths: ['Adaptability', 'Emotional wit', 'Openness', 'Communication'],
    challenges: ['Restlessness', 'Overthinking feelings', 'Avoiding depth'],
    compatible: ['libra', 'aquarius', 'aries'],
  },
  cancer: {
    tagline: 'Deep, protective feelings',
    emotions: 'The Moon is at home in Cancer, so your emotions are strong, intuitive and tied to memory. You sense the mood of a room instantly and care deeply for the people you love.',
    needs: 'Emotional safety, family and a place to retreat.',
    love: 'Devoted and tender. You need reassurance and a partner who is gentle with your feelings.',
    home: 'Home is your sanctuary. Family, food and traditions matter enormously.',
    wellbeing: 'Feelings can affect digestion and sleep. Rest, home cooking and honest sharing keep you steady.',
    strengths: ['Empathy', 'Intuition', 'Nurturing care', 'Loyalty'],
    challenges: ['Moodiness', 'Clinging to the past', 'Taking things personally'],
    compatible: ['scorpio', 'pisces', 'taurus'],
  },
  leo: {
    tagline: 'Warm, generous heart',
    emotions: 'With the Moon in Leo you feel things proudly and expressively. You need to be seen and appreciated, and you give affection generously in return. Your mood lifts when you feel valued.',
    needs: 'Recognition, warmth and room to express yourself.',
    love: 'Romantic, loyal and dramatic in the best way. You want a partner who celebrates you.',
    home: 'A warm, welcoming home where you are the generous host.',
    wellbeing: 'Feeling ignored hurts more than you show. Creative play and praise from people you trust recharge you.',
    strengths: ['Big-heartedness', 'Confidence', 'Loyalty', 'Creative spirit'],
    challenges: ['Pride', 'Need for approval', 'Wounded ego'],
    compatible: ['aries', 'sagittarius', 'libra'],
  },
  virgo: {
    tagline: 'Careful, practical feelings',
    emotions: 'With the Moon in Virgo you handle emotions by analysing and fixing. You care through practical help and often worry quietly. You are hard on yourself and notice every detail that feels off.',
    needs: 'Order, usefulness and time to process alone.',
    love: 'Shy at first, then thoughtful and devoted. You show love through small acts of service.',
    home: 'A tidy, well-organised space calms your mind.',
    wellbeing: 'Worry affects your stomach and sleep. Routine, clean eating and self-compassion help.',
    strengths: ['Attentiveness', 'Reliability', 'Helpfulness', 'Emotional discernment'],
    challenges: ['Self-criticism', 'Anxiety', 'Perfectionism'],
    compatible: ['taurus', 'capricorn', 'cancer'],
  },
  libra: {
    tagline: 'Harmonious, gentle heart',
    emotions: 'With the Moon in Libra you feel best when relationships are peaceful. You are diplomatic and sensitive to tension, and conflict drains you. You often understand both sides before you know your own.',
    needs: 'Harmony, companionship and beauty around you.',
    love: 'Romantic and partnership-minded. You are happiest when sharing life with someone.',
    home: 'A graceful, balanced home. You dislike mess and arguments.',
    wellbeing: 'Suppressed disagreements build up. Speaking up early and keeping a calm routine protect your peace.',
    strengths: ['Tact', 'Fairness', 'Charm', 'Emotional balance'],
    challenges: ['Indecision', 'Avoiding conflict', 'People-pleasing'],
    compatible: ['gemini', 'aquarius', 'leo'],
  },
  scorpio: {
    tagline: 'Intense, private feelings',
    emotions: 'With the Moon in Scorpio you feel everything deeply but show little. You read people accurately and need real emotional honesty. Trust is earned slowly, and betrayal is remembered.',
    needs: 'Trust, privacy and emotional depth.',
    love: 'All-in and loyal. You want complete honesty and a partner who can handle intensity.',
    home: 'A private, protected space. You guard your inner circle closely.',
    wellbeing: 'Bottled emotions turn into tension. Physical exercise, therapy or journaling release them.',
    strengths: ['Emotional strength', 'Insight', 'Loyalty', 'Transformation'],
    challenges: ['Jealousy', 'Secrecy', 'Holding grudges'],
    compatible: ['cancer', 'pisces', 'virgo'],
  },
  sagittarius: {
    tagline: 'Optimistic, free heart',
    emotions: 'With the Moon in Sagittarius you bounce back quickly and look for meaning in what happens. You need space and hate feeling trapped. Your mood rises with travel, learning and laughter.',
    needs: 'Freedom, adventure and a sense of purpose.',
    love: 'Honest, fun-loving and generous. You want a partner who is also a travelling companion.',
    home: 'A relaxed, open home. You may feel most at home when you are on the move.',
    wellbeing: 'Feeling confined lowers your mood. Time outdoors and new experiences lift it.',
    strengths: ['Optimism', 'Emotional openness', 'Resilience', 'Generosity'],
    challenges: ['Bluntness', 'Restlessness', 'Avoiding heavy feelings'],
    compatible: ['aries', 'leo', 'aquarius'],
  },
  capricorn: {
    tagline: 'Composed, reserved feelings',
    emotions: 'With the Moon in Capricorn you keep emotions under control and show them privately. You take responsibility early and tend to carry more than your share. Beneath the calm is real warmth.',
    needs: 'Respect, structure and a sense of achievement.',
    love: 'Slow to open up but very loyal. You show love by providing and showing up.',
    home: 'A stable, orderly home. You take family duties seriously.',
    wellbeing: 'Overwork and bottled stress affect the body. Scheduled rest and support from others matter.',
    strengths: ['Self-control', 'Dependability', 'Endurance', 'Emotional maturity'],
    challenges: ['Emotional distance', 'Pessimism', 'Being too hard on yourself'],
    compatible: ['taurus', 'virgo', 'scorpio'],
  },
  aquarius: {
    tagline: 'Independent, open mind',
    emotions: 'With the Moon in Aquarius you approach feelings with detachment and curiosity. You value friendship and freedom, and can seem cool even when you care a great deal. You feel most at ease with people who let you be yourself.',
    needs: 'Space, intellectual connection and freedom to be different.',
    love: 'Friendship comes first. You want a partner who respects your independence.',
    home: 'An unconventional home with room for ideas, friends and privacy.',
    wellbeing: 'Overthinking and isolation drain you. Community, causes and regular movement recharge you.',
    strengths: ['Objectivity', 'Originality', 'Loyalty to friends', 'Open-mindedness'],
    challenges: ['Emotional detachment', 'Stubborn views', 'Unpredictability'],
    compatible: ['gemini', 'libra', 'sagittarius'],
  },
  pisces: {
    tagline: 'Dreamy, empathic heart',
    emotions: 'With the Moon in Pisces you absorb the feelings of others like a sponge. You are compassionate, imaginative and guided by intuition. Boundaries need attention because you feel everything.',
    needs: 'Quiet time, creativity and emotional kindness.',
    love: 'Romantic, selfless and deeply devoted. You want a soulful, gentle bond.',
    home: 'A peaceful, soft space with music, art or spiritual touches.',
    wellbeing: 'Crowds and negativity exhaust you. Water, sleep, creativity and solitude restore you.',
    strengths: ['Compassion', 'Intuition', 'Imagination', 'Emotional depth'],
    challenges: ['Over-sensitivity', 'Escapism', 'Weak boundaries'],
    compatible: ['cancer', 'scorpio', 'capricorn'],
  },
};

/* ------------------------------------------------------------------ */
/* Nakshatras (Vedic)                                                  */
/* ------------------------------------------------------------------ */

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];
const NAKSHATRA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

/* ------------------------------------------------------------------ */
/* Moon position (Meeus ch. 47, main periodic terms)                   */
/* ------------------------------------------------------------------ */

// [D, M, M', F, coefficient in 1e-6 degrees] for longitude
const LON_TERMS = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314], [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332], [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322], [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528], [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034], [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766], [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665], [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390], [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120], [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110],
];

const RAD = Math.PI / 180;
const norm360 = (x) => ((x % 360) + 360) % 360;

/** Tropical ecliptic longitude of the Moon (degrees) at a UTC timestamp in ms. */
export function moonLongitude(ms) {
  const T = (ms / 86400000 + 2440587.5 - 2451545.0) / 36525;
  const T2 = T * T;

  const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T2);
  const D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T2);
  const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T2);
  const Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T2);
  const F = norm360(93.272095 + 483202.0175233 * T - 0.0036539 * T2);
  const E = 1 - 0.002516 * T - 0.0000074 * T2;

  let sum = 0;
  for (const [d, m, mp, f, c] of LON_TERMS) {
    const e = m === 0 ? 1 : Math.abs(m) === 1 ? E : E * E;
    sum += c * e * Math.sin((d * D + m * M + mp * Mp + f * F) * RAD);
  }
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.29 * T;
  sum += 3958 * Math.sin(A1 * RAD) + 1962 * Math.sin((Lp - F) * RAD) + 318 * Math.sin(A2 * RAD);

  return norm360(Lp + sum / 1e6);
}

/** Lahiri ayanamsa in degrees (linear approximation, good to about 0.01 degrees). */
function lahiriAyanamsa(ms) {
  const years = (ms - Date.UTC(2000, 0, 1, 12)) / (365.25 * 86400000);
  return 23.853 + 0.013969 * years;
}

function longitudeFor(ms, system) {
  const trop = moonLongitude(ms);
  return system === 'vedic' ? norm360(trop - lahiriAyanamsa(ms)) : trop;
}

/* ------------------------------------------------------------------ */
/* Time zone helpers                                                   */
/* ------------------------------------------------------------------ */

function tzOffsetMs(ms, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
  }).formatToParts(new Date(ms));
  const v = {};
  parts.forEach((p) => { v[p.type] = p.value; });
  const asUtc = Date.UTC(+v.year, +v.month - 1, +v.day, +v.hour % 24, +v.minute, +v.second);
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/** Local wall-clock time in the birth place -> UTC ms. Falls back to longitude if no zone. */
export function localToUtc(y, m, d, hh, mm, timeZone, lon = 0) {
  const naive = Date.UTC(y, m - 1, d, hh, mm);
  if (timeZone) {
    try {
      const first = naive - tzOffsetMs(naive, timeZone);
      return naive - tzOffsetMs(first, timeZone);
    } catch (e) {
      // invalid zone name: fall through to the longitude estimate
    }
  }
  return naive - (lon / 15) * 3600000;
}

/** Format a UTC timestamp as a local clock time ("3:42 PM") in the birth place. */
export function formatClock(ms, timeZone, lon = 0) {
  try {
    if (timeZone) {
      return new Intl.DateTimeFormat('en-US', {
        timeZone, hour: 'numeric', minute: '2-digit', hour12: true,
      }).format(new Date(ms));
    }
  } catch (e) {
    // fall through
  }
  const shifted = new Date(ms + (lon / 15) * 3600000);
  const h = shifted.getUTCHours();
  return `${h % 12 || 12}:${String(shifted.getUTCMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Finds the Moon sign for a birth moment.
 * @param {string} dob  ISO date, e.g. "2003-07-13"
 * @param {object} opts { time: "HH:MM" (24h local), timeZone: IANA name, lon, system, timeAssumed }
 * @returns {null | {
 *   key, sign, traits, system, degree, degreeLabel, nakshatra,
 *   boundary,  // null, or { keys: [before, after], changeAt } when the Moon changed sign
 *              // during the birth day and the birth time is assumed
 *   cusp       // null, or { key, sign } when the exact time is known but the Moon
 *              // was within about 0.35 degrees (~40 min) of a sign edge
 * }}
 */
export function calculateMoonSign(dob, opts = {}) {
  const { time = '12:00', timeZone, lon = 0, system = 'western', timeAssumed = false } = opts;
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const [y, m, d] = dob.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  if ([y, m, d, hh, mm].some(Number.isNaN)) return null;

  const utc = localToUtc(y, m, d, hh, mm, timeZone, lon);
  const sid = longitudeFor(utc, system);
  const idx = Math.floor(sid / 30);
  const key = SIGN_ORDER[idx];
  const within = sid - idx * 30;
  const deg = Math.floor(within);
  const min = Math.floor((within - deg) * 60);

  // Nakshatra (only meaningful for the sidereal zodiac)
  const span = 360 / 27;
  const nIdx = Math.floor(sid / span);
  const nakshatra = system === 'vedic'
    ? {
        name: NAKSHATRAS[nIdx],
        pada: Math.floor((sid - nIdx * span) / (span / 4)) + 1,
        lord: NAKSHATRA_LORDS[nIdx % 9],
      }
    : null;

  // Did the Moon change sign at some point during the birth day?
  let boundary = null;
  if (timeAssumed) {
    const start = localToUtc(y, m, d, 0, 0, timeZone, lon);
    const end = localToUtc(y, m, d + 1, 0, 0, timeZone, lon);
    const s0 = Math.floor(longitudeFor(start, system) / 30);
    const s1 = Math.floor(longitudeFor(end - 1, system) / 30);
    if (s0 !== s1) {
      let lo = start;
      let hi = end;
      while (hi - lo > 30000) {
        const mid = Math.floor((lo + hi) / 2);
        if (Math.floor(longitudeFor(mid, system) / 30) === s0) lo = mid;
        else hi = mid;
      }
      boundary = { keys: [SIGN_ORDER[s0], SIGN_ORDER[s1]], changeAt: formatClock(hi, timeZone, lon) };
    }
  }

  // Exact time known but very close to a sign edge
  let cusp = null;
  if (!timeAssumed) {
    if (within < 0.35) {
      const k = SIGN_ORDER[(idx + 11) % 12];
      cusp = { key: k, sign: SIGNS[k] };
    } else if (within > 29.65) {
      const k = SIGN_ORDER[(idx + 1) % 12];
      cusp = { key: k, sign: SIGNS[k] };
    }
  }

  return {
    key,
    sign: SIGNS[key],
    traits: MOON_TRAITS[key],
    system,
    degree: within,
    degreeLabel: `${deg}\u00B0${String(min).padStart(2, '0')}\u2032`,
    nakshatra,
    boundary,
    cusp,
  };
}