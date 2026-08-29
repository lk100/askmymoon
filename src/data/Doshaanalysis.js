// data/doshaAnalysis.js
//
// Detects the major doshas (afflictions) that can be worked out from a natal
// chart's planet-to-house placements, and pairs each with practical +
// spiritual + mantra remedies, including a puja recommendation where one is
// traditionally prescribed.
//
// Input shape expected everywhere: planetPositions = {
//   Sun: { sign, house }, Moon: {...}, Mars: {...}, Mercury: {...},
//   Jupiter: {...}, Venus: {...}, Saturn: {...}, Rahu: {...}, Ketu: {...}
// }
//
// NOTE: Sade Sati depends on the CURRENT transit of Saturn relative to the
// natal Moon sign, not on the natal chart alone. A best-effort check is
// included (see getSadeSati) but it requires the person's current Saturn
// transit sign as a second argument; if that isn't available it returns
// "unknown" rather than guessing.

const ALL_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function houseOf(planetPositions, planet) {
  return planetPositions?.[planet]?.house ?? null;
}

function sameHouse(planetPositions, a, b) {
  const ha = houseOf(planetPositions, a);
  const hb = houseOf(planetPositions, b);
  return ha != null && hb != null && ha === hb;
}

// Houses strictly between `from` and `to`, moving forward (1→12→1 wrap)
function housesBetween(from, to) {
  const result = [];
  let h = (from % 12) + 1;
  while (h !== to) {
    result.push(h);
    h = (h % 12) + 1;
  }
  return result;
}

// Distance from house `a` to house `b`, 1-12 (kendra check helper)
function houseDistance(a, b) {
  let d = b - a;
  if (d < 0) d += 12;
  return d + 1; // 1-indexed, so same house = 1
}

// ---------------------------------------------------------------------
// 1. MANGLIK DOSHA — Mars in houses 1, 2, 4, 7, 8, or 12
// ---------------------------------------------------------------------
const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

function getManglikDosha(planetPositions) {
  const marsHouse = houseOf(planetPositions, "Mars");
  if (!marsHouse) return notEnoughData("Manglik Dosha");

  if (!MANGLIK_HOUSES.includes(marsHouse)) {
    return {
      key: "manglik",
      name: "Manglik Dosha",
      type: "dosha",
      present: false,
      severity: "none",
      description: "Not present. Mars isn't sitting in one of the houses that typically causes this, so there's nothing here to address.",
      remedies: null
    };
  }

  const strong = [7, 8].includes(marsHouse);
  return {
    key: "manglik",
    name: "Manglik Dosha",
    type: "dosha",
    present: true,
    severity: strong ? "strong" : "mild",
    description: `Mars is placed in your ${marsHouse}${ordinal(marsHouse)} house, which traditionally brings extra intensity, impatience, or friction into close relationships and marriage. ${strong ? "Since this is one of the stronger placements, it's worth taking a little more care with remedies." : "This is a milder version and usually easy to balance out."}`,
    remedies: {
      practical: "Exercise regularly and pause before reacting during arguments.",
      spiritual: "Visit a Hanuman temple on Tuesdays and offer a red cloth or sindoor.",
      
      puja: "Perform a Mangal Shanti Puja with a qualified priest."
    }
  };
}

// ---------------------------------------------------------------------
// 2. KAAL SARP DOSHA — all 7 planets hemmed between Rahu and Ketu
// ---------------------------------------------------------------------
function getKaalSarpDosha(planetPositions) {
  const rahuHouse = houseOf(planetPositions, "Rahu");
  const ketuHouse = houseOf(planetPositions, "Ketu");
  if (!rahuHouse || !ketuHouse) return notEnoughData("Kaal Sarp Dosha");

  const houses = ALL_PLANETS.map((p) => houseOf(planetPositions, p)).filter((h) => h != null);
  if (houses.length < ALL_PLANETS.length) return notEnoughData("Kaal Sarp Dosha");

  const sideA = housesBetween(rahuHouse, ketuHouse);
  const sideB = housesBetween(ketuHouse, rahuHouse);
  const countA = houses.filter((h) => sideA.includes(h)).length;
  const countB = houses.filter((h) => sideB.includes(h)).length;
  const maxCount = Math.max(countA, countB);

  if (maxCount === 7) {
    return {
      key: "kaalsarp",
      name: "Kaal Sarp Dosha",
      type: "dosha",
      present: true,
      severity: "strong",
      description: "All seven main planets fall on one side of the Rahu-Ketu axis. This often comes with a strong sense of struggle-then-success, recurring life themes, or delays that eventually resolve — it's intense but very manageable, and many people with this placement go on to lead successful lives.",
      remedies: {
        practical: "Keep a steady routine and organise important documents carefully.",
        spiritual: "Offer milk to a Shiva lingam on Mondays.",
        
        puja: "Perform a Kaal Sarp Shanti Puja with a qualified priest."
      }
    };
  }

  if (maxCount >= 5) {
    return {
      key: "kaalsarp",
      name: "Kaal Sarp Dosha",
      type: "dosha",
      present: true,
      severity: "partial",
      description: "Most planets fall on one side of the Rahu-Ketu axis, with one or two breaking the pattern. This gives a milder version — some restlessness or recurring patterns, but nothing that needs heavy remedial work.",
      remedies: {
        practical: "Follow a steady routine and complete important decisions on time.",
        spiritual: "Offer water to a Shiva lingam on Mondays.",
        
        puja: "Perform a simple Shiva Puja with a qualified priest."
      }
    };
  }

  return {
    key: "kaalsarp",
    name: "Kaal Sarp Dosha",
    type: "dosha",
    present: false,
    severity: "none",
    description: "Absent. Planets are spread across both sides of the Rahu-Ketu axis, so this pattern doesn't apply.",
    remedies: null
  };
}

// ---------------------------------------------------------------------
// 3. GURU CHANDAL DOSHA — Jupiter conjunct Rahu or Ketu (same house)
// ---------------------------------------------------------------------
function getGuruChandalDosha(planetPositions) {
  const withRahu = sameHouse(planetPositions, "Jupiter", "Rahu");
  const withKetu = sameHouse(planetPositions, "Jupiter", "Ketu");
  if (houseOf(planetPositions, "Jupiter") == null) return notEnoughData("Guru Chandal Dosha");

  if (!withRahu && !withKetu) {
    return {
      key: "guruchandal",
      name: "Guru Chandal Dosha",
      type: "dosha",
      present: false,
      severity: "none",
      description: "Not present. Jupiter isn't sharing a house with Rahu or Ketu.",
      remedies: null
    };
  }

  const withWhich = withRahu ? "Rahu" : "Ketu";
  return {
    key: "guruchandal",
    name: "Guru Chandal Dosha",
    type: "dosha",
    present: true,
    severity: "moderate",
    description: `Jupiter shares a house with ${withWhich}. This can cloud judgment, wisdom, or guidance from teachers/mentors, and sometimes brings unconventional beliefs or a wavering sense of ethics — though it also often gives sharp, unusual intelligence.`,
    remedies: {
      practical: "Seek trusted advice before major decisions and avoid shortcuts.",
      spiritual: "Donate turmeric, chana dal, or yellow items on Thursdays.",
      
      puja: "Perform a Guru Shanti Puja with a qualified priest."
    }
  };
}

// ---------------------------------------------------------------------
// 4. GRAHAN DOSHA — Sun or Moon conjunct Rahu/Ketu (eclipse-like affliction)
// ---------------------------------------------------------------------
function getGrahanDosha(planetPositions) {
  const sunRahu = sameHouse(planetPositions, "Sun", "Rahu");
  const sunKetu = sameHouse(planetPositions, "Sun", "Ketu");
  const moonRahu = sameHouse(planetPositions, "Moon", "Rahu");
  const moonKetu = sameHouse(planetPositions, "Moon", "Ketu");

  if (houseOf(planetPositions, "Sun") == null || houseOf(planetPositions, "Moon") == null) {
    return notEnoughData("Grahan Dosha");
  }

  if (!sunRahu && !sunKetu && !moonRahu && !moonKetu) {
    return {
      key: "grahan",
      name: "Grahan Dosha",
      type: "dosha",
      present: false,
      severity: "none",
      description: "Not present. Neither the Sun nor the Moon shares a house with Rahu or Ketu.",
      remedies: null
    };
  }

  const involvesSun = sunRahu || sunKetu;
  const involvesMoon = moonRahu || moonKetu;
  const focus = involvesSun && involvesMoon
    ? "both the Sun and Moon"
    : involvesSun
      ? "the Sun"
      : "the Moon";

  return {
    key: "grahan",
    name: "Grahan Dosha",
    type: "dosha",
    present: true,
    severity: "moderate",
    description: `${focus === "both the Sun and Moon" ? "Both the Sun and Moon" : focus[0].toUpperCase() + focus.slice(1)} share${focus === "both the Sun and Moon" ? "" : "s"} a house with Rahu or Ketu — an eclipse-like combination. This can show up as clouded self-confidence or clarity of thought (Sun) and/or emotional ups and downs or restless sleep (Moon), depending on which is involved.`,
    remedies: {
      practical: "Maintain regular sleep and get gentle morning sunlight.",
      spiritual: "Offer water to the rising sun each morning.",
      
      puja: "Perform a Navagraha Shanti Puja with a qualified priest."
    }
  };
}

// ---------------------------------------------------------------------
// 5. PITRA DOSHA — Sun conjunct Rahu/Ketu/Saturn, especially in 9th house
// ---------------------------------------------------------------------
function getPitraDosha(planetPositions) {
  const sunHouse = houseOf(planetPositions, "Sun");
  if (sunHouse == null) return notEnoughData("Pitra Dosha");

  const sunWithRahu = sameHouse(planetPositions, "Sun", "Rahu");
  const sunWithKetu = sameHouse(planetPositions, "Sun", "Ketu");
  const sunWithSaturn = sameHouse(planetPositions, "Sun", "Saturn");
  const inNinth = sunHouse === 9;

  const flagged = sunWithRahu || sunWithKetu || sunWithSaturn;

  if (!flagged) {
    return {
      key: "pitra",
      name: "Pitra Dosha",
      type: "dosha",
      present: false,
      severity: "none",
      description: "Not present. The Sun isn't sharing a house with Saturn, Rahu, or Ketu.",
      remedies: null
    };
  }

  return {
    key: "pitra",
    name: "Pitra Dosha",
    type: "dosha",
    present: true,
    severity: inNinth ? "strong" : "moderate",
    description: `The Sun shares a house with ${sunWithSaturn ? "Saturn" : sunWithRahu ? "Rahu" : "Ketu"}${inNinth ? ", and this falls in the 9th house — traditionally linked to father, ancestry, and family patterns" : ""}. This is often associated with unresolved family patterns, a strained relationship with father figures, or a sense of carrying forward old family burdens.`,
    remedies: {
      practical: "Resolve family disputes and make peace with your family history.",
      spiritual: "Offer water to a Peepal tree on Saturdays and feed crows or cows.",
      
      puja: "Perform Shraddha or a Pitra Shanti Puja with a qualified priest."
    }
  };
}

// ---------------------------------------------------------------------
// 6. SHRAPIT DOSHA — Saturn conjunct Rahu (same house)
// ---------------------------------------------------------------------
function getShrapitDosha(planetPositions) {
  if (houseOf(planetPositions, "Saturn") == null || houseOf(planetPositions, "Rahu") == null) {
    return notEnoughData("Shrapit Dosha");
  }
  const present = sameHouse(planetPositions, "Saturn", "Rahu");

  if (!present) {
    return {
      key: "shrapit",
      name: "Shrapit Dosha",
      type: "dosha",
      present: false,
      severity: "none",
      description: "Not present. Saturn and Rahu aren't sharing a house.",
      remedies: null
    };
  }

  return {
    key: "shrapit",
    name: "Shrapit Dosha",
    type: "dosha",
    present: true,
    severity: "strong",
    description: "Saturn and Rahu share a house. This combination is considered one of the more intense ones — often bringing long delays, a feeling of being stuck, or repeated setbacks despite hard work. It usually improves significantly with consistent remedy and patience over time.",
    remedies: {
      practical: "Take steady steps, avoid shortcuts, and stay organised.",
      spiritual: "Feed stray dogs and crows on Saturdays and keep spaces clean.",
      
      puja: "Perform a Shani-Rahu Shanti Puja with a qualified priest."
    }
  };
}

// ---------------------------------------------------------------------
// 7. ANGARAK DOSHA — Mars conjunct Rahu (same house)
// ---------------------------------------------------------------------
function getAngarakDosha(planetPositions) {
  if (houseOf(planetPositions, "Mars") == null || houseOf(planetPositions, "Rahu") == null) {
    return notEnoughData("Angarak Dosha");
  }
  const present = sameHouse(planetPositions, "Mars", "Rahu");

  if (!present) {
    return {
      key: "angarak",
      name: "Angarak Dosha",
      type: "dosha",
      present: false,
      severity: "none",
      description: "Not present. Mars and Rahu aren't sharing a house.",
      remedies: null
    };
  }

  return {
    key: "angarak",
    name: "Angarak Dosha",
    type: "dosha",
    present: true,
    severity: "moderate",
    description: "Mars shares a house with Rahu. This tends to amplify impulsiveness, sudden anger, or reckless risk-taking — useful for bold action when channelled well, but can lead to accidents or conflict if left unchecked.",
    remedies: {
      practical: "Pause before reacting and exercise regularly to release tension.",
      spiritual: "Donate red lentils or jaggery on Tuesdays.",
      
      puja: "Perform a Mangal-Rahu Shanti Puja with a qualified priest."
    }
  };
}

function notEnoughData(name) {
  return {
    key: name.toLowerCase().replace(/\s+/g, ""),
    name,
    type: "dosha",
    present: false,
    severity: "unknown",
    description: "Not enough placement data available yet to check this.",
    remedies: null
  };
}

/**
 * Run every dosha check and return a flat array, in a sensible display order.
 * @param {Object} planetPositions
 * @returns {Array} list of dosha result objects
 */
export function getAllDoshaAnalysis(planetPositions) {
  if (!planetPositions) return [];
  return [
    getManglikDosha(planetPositions),
    getKaalSarpDosha(planetPositions),
    getGuruChandalDosha(planetPositions),
    getGrahanDosha(planetPositions),
    getPitraDosha(planetPositions),
    getShrapitDosha(planetPositions),
    getAngarakDosha(planetPositions)
  ];
}

// Convenience: only the doshas that are actually present in this chart
export function getActiveDoshaAnalysis(planetPositions) {
  return getAllDoshaAnalysis(planetPositions).filter((d) => d.present);
}

export {
  getManglikDosha,
  getKaalSarpDosha,
  getGuruChandalDosha,
  getGrahanDosha,
  getPitraDosha,
  getShrapitDosha,
  getAngarakDosha
};