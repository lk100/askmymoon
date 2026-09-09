// ============================================================================
// blogGenerators.js
// One function per content category. Each pulls concrete facts from
// astroData.js and composes them into an article. Because the facts differ
// per combination (exaltation degree, karakatva, deity, friendships...),
// the resulting prose differs meaningfully, not just by keyword swap.
// ============================================================================

import { PLANETS, SIGNS, SIGN_ORDER, HOUSES, NAKSHATRAS, KARAKAS, YOGAS, DOSHAS, ASPECT_MEANINGS } from '../data/astroData';

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const friendshipLabel = (planetA, planetB) => {
  const a = PLANETS[planetA];
  if (a.friends.includes(planetB)) return 'natural friend';
  if (a.enemies.includes(planetB)) return 'natural enemy';
  return 'neutral';
};

// ---------------------------------------------------------------------------
// 1. Planet in House
// ---------------------------------------------------------------------------
export function planetInHouse(planetKey, houseNum) {
  const p = PLANETS[planetKey];
  const h = HOUSES[houseNum];
  const title = `${p.name} in the ${ordinal(houseNum)} House: Meaning and Effects`;
  const slug = `${p.key}-in-${houseNum}th-house`;

  const content = [
    {
      heading: `What ${p.name} in the ${ordinal(houseNum)} House Signifies`,
      body: `${p.name} (${p.sanskrit}) naturally signifies ${p.karakatva}. When it occupies the ${ordinal(houseNum)} House — the house of ${h.significations} — its energy gets channeled directly into that domain. This placement is read by looking at how ${p.name}'s core nature blends with, supports, or complicates the affairs the ${ordinal(houseNum)} House governs.`,
    },
    {
      heading: 'How This Placement Typically Expresses',
      body: `Because ${p.name} carries a ${p.nature} temperament and belongs to the ${p.guna} guna, its influence on the ${ordinal(houseNum)} House tends to be felt through ${p.karakatva.split(',')[0].trim()} colouring how this house's matters unfold. A well-placed ${p.name} here (in its own sign, exaltation, or a friendly sign) strengthens the native's ability to handle ${h.significations} with confidence. If ${p.name} is debilitated, combust, or heavily afflicted here, the same themes tend to surface as delay, overcorrection, or recurring lessons before they stabilise.`,
    },
    {
      heading: 'Strength Factors to Check',
      body: `${p.name} is exalted in ${SIGNS[p.exaltation.sign].name} at ${p.exaltation.degree}° and debilitated in ${SIGNS[p.debilitation.sign].name} at ${p.debilitation.degree}°. Its Moolatrikona zone is ${p.moolatrikona ? `${SIGNS[p.moolatrikona.sign].name} (${p.moolatrikona.range})` : 'not applicable, as a shadow planet'}. When judging ${p.name} in the ${ordinal(houseNum)} House, an astrologer checks whether it sits in one of these dignified zones, whether it is aspected by its friends (${p.friends.map(f => PLANETS[f].name).join(', ') || 'none'}) or afflicted by its enemies (${p.enemies.map(e => PLANETS[e].name).join(', ') || 'none'}), and whether it is retrograde or combust at the time of birth.`,
    },
    {
      heading: 'Practical Guidance',
      body: `Rather than treating this placement as fixed fate, use it as a map: ${p.name} in the ${ordinal(houseNum)} House shows where ${p.karakatva.split(',')[0].trim()} needs to be consciously directed into ${h.significations}. Strengthening this planet through its ${p.element.toLowerCase()}-element remedies (colour, day of the week, and associated practices tied to ${p.deity}) can support the house's positive expression, but the deeper work is behavioural — aligning daily choices with what this house is asking of you.`,
    },
  ];

  return {
    slug, title, category: 'Planet in House',
    excerpt: `${p.name} in the ${ordinal(houseNum)} House blends ${p.karakatva.split(',')[0].trim()} with the themes of ${h.significations}. Here's how to read the placement.`,
    keywords: [`${p.key} in ${houseNum}th house`, `${p.name.toLowerCase()} ${ordinal(houseNum)} house astrology`, `${p.name.toLowerCase()} house meaning`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 2. Planet in Nakshatra
// ---------------------------------------------------------------------------
export function planetInNakshatra(planetKey, nakshatraIndex) {
  const p = PLANETS[planetKey];
  const n = NAKSHATRAS[nakshatraIndex];
  const rulerPlanet = PLANETS[n.ruler];
  const title = `${p.name} in ${n.name} Nakshatra: Meaning and Effects`;
  const slug = `${p.key}-in-${slugify(n.name)}-nakshatra`;

  const content = [
    {
      heading: `${n.name}: The Nakshatra's Core Nature`,
      body: `${n.name} is ruled by ${rulerPlanet.name} and presided over by the deity ${n.deity}, symbolised by the ${n.symbol}. It belongs to the ${n.gana} gana and carries a ${n.nature} quality. Any planet placed here absorbs some of this underlying texture before expressing its own significations.`,
    },
    {
      heading: `How ${p.name} Filters Through ${n.name}`,
      body: `${p.name} signifies ${p.karakatva}. Placed in ${n.name}, this energy is expressed through the nakshatra's ${n.nature} lens — meaning the native experiences ${p.karakatva.split(',')[0].trim()} in a way that is noticeably shaped by ${n.deity}'s symbolic domain and the ${n.symbol.toLowerCase()} imagery associated with this star. Since ${n.name} is ruled by ${rulerPlanet.name}, the relationship between ${p.name} and ${rulerPlanet.name} (${friendshipLabel(p.key, n.ruler)}) also matters: a friendly dispositor relationship tends to smooth this placement's expression, while an enemy relationship can create internal tension between what ${p.name} wants and how the nakshatra prefers to express it.`,
    },
    {
      heading: 'Pada-Level Nuance',
      body: `Each nakshatra spans 13°20' and divides into four padas (quarters) of 3°20' each, with each pada falling into a different zodiac sign. The exact pada ${p.name} occupies within ${n.name} shifts the flavour further, since that pada's sign lord adds its own influence. A precise reading always checks the exact degree, not just the nakshatra name.`,
    },
    {
      heading: 'Practical Takeaway',
      body: `${p.name} in ${n.name} is best understood as this planet's core significations — ${p.karakatva.split(',')[0].trim()} — being asked to operate through a ${n.gana}-gana, ${n.nature} temperament. Working consciously with this combination means honouring both what ${p.name} wants to achieve and the emotional and symbolic style ${n.name} insists on using to get there.`,
    },
  ];

  return {
    slug, title, category: 'Planet in Nakshatra',
    excerpt: `${p.name} in ${n.name} nakshatra blends this planet's significations with ${n.deity}'s symbolic domain and a ${n.gana}-gana temperament.`,
    keywords: [`${p.key} in ${n.name.toLowerCase()} nakshatra`, `${p.name.toLowerCase()} nakshatra meaning`, `${n.name.toLowerCase()} nakshatra ${p.name.toLowerCase()}`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 3. Planet in Sign
// ---------------------------------------------------------------------------
export function planetInSign(planetKey, signKey) {
  const p = PLANETS[planetKey];
  const s = SIGNS[signKey];
  const rulerPlanet = PLANETS[s.ruler];
  const dignity = p.exaltation.sign === signKey ? 'exalted'
    : p.debilitation.sign === signKey ? 'debilitated'
    : p.rulerOf.includes(signKey) ? 'in its own sign'
    : p.moolatrikona?.sign === signKey ? 'in its Moolatrikona'
    : 'in a sign it does not own';

  const title = `${p.name} in ${s.name}: Meaning and Effects`;
  const slug = `${p.key}-in-${s.key}`;

  const content = [
    {
      heading: `${s.name}'s Core Nature`,
      body: `${s.name} (${s.sanskrit}) is a ${s.quality} ${s.element} sign ruled by ${rulerPlanet.name}, associated with ${s.keyword} and governing the ${s.bodyPart} in the physical body. Any planet placed here operates through this elemental and qualitative filter.`,
    },
    {
      heading: `${p.name}'s Dignity Here`,
      body: `In this sign, ${p.name} is ${dignity}${dignity === 'exalted' ? ` (peaking at ${p.exaltation.degree}°)` : dignity === 'debilitated' ? ` (deepest fall at ${p.debilitation.degree}°)` : ''}. ${dignity === 'exalted' ? `This is one of the strongest placements ${p.name} can have — its significations of ${p.karakatva.split(',')[0].trim()} express with confidence and relatively little friction.` : dignity === 'debilitated' ? `This is ${p.name}'s most challenged placement — the native often has to work harder and mature through repeated lessons before ${p.karakatva.split(',')[0].trim()} stabilises. A Neechabhanga (debilitation-cancellation) in the full chart can significantly soften this.` : dignity === 'in its own sign' ? `${p.name} is comfortable and confident here, expressing ${p.karakatva.split(',')[0].trim()} on its own terms.` : `${p.name} here depends heavily on ${rulerPlanet.name}'s own strength and placement, since ${rulerPlanet.name} is the sign's dispositor.`}`,
    },
    {
      heading: 'Elemental Blend',
      body: `${p.name}'s natural element is ${p.element}, while ${s.name} is a ${s.element} sign. ${p.element === s.element ? `Since both share the ${p.element} element, this placement tends to feel natural and undiluted.` : `This creates a ${p.element}-meets-${s.element} blend, meaning ${p.name}'s significations get tempered — sometimes productively, sometimes with friction — by ${s.name}'s ${s.keyword}.`}`,
    },
    {
      heading: 'Practical Guidance',
      body: `Read ${p.name} in ${s.name} as: ${p.karakatva.split(',')[0].trim()}, expressed through the lens of ${s.keyword}. The dispositor ${rulerPlanet.name}'s own house, sign, and aspects should always be checked next, since a sign's ruling planet significantly modifies how the placed planet ultimately plays out.`,
    },
  ];

  return {
    slug, title, category: 'Planet in Sign',
    excerpt: `${p.name} in ${s.name} is ${dignity} — here's what that means for ${p.karakatva.split(',')[0].trim()} in daily life.`,
    keywords: [`${p.key} in ${s.key}`, `${p.name.toLowerCase()} in ${s.name.toLowerCase()} meaning`, `${p.name.toLowerCase()} ${dignity.replace('in its ', '').replace(' sign', '')}`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 4. Functional Nature of Planets as per Ascendant
// ---------------------------------------------------------------------------
export function functionalNatureByAscendant(ascendantKey) {
  const asc = SIGNS[ascendantKey];
  const idx = SIGN_ORDER.indexOf(ascendantKey);

  const houseOfSign = (signKey) => ((SIGN_ORDER.indexOf(signKey) - idx + 12) % 12) + 1;

  const rows = Object.values(PLANETS).filter(p => !['rahu', 'ketu'].includes(p.key)).map((p) => {
    const ownedHouses = p.rulerOf.filter(s => SIGN_ORDER.includes(s)).map(houseOfSign);
    const isKendraTrikonaLord = ownedHouses.some(h => [1, 4, 5, 7, 9, 10].includes(h));
    const isDusthanaLord = ownedHouses.some(h => [6, 8, 12].includes(h));
    let role = 'neutral';
    if (ownedHouses.includes(1)) role = 'yogakaraka or strong functional benefic (owns the Ascendant itself)';
    else if (isKendraTrikonaLord && (ownedHouses.some(h => [5, 9].includes(h)) && ownedHouses.some(h => [4, 7, 10].includes(h)))) role = 'yogakaraka (owns both a Kendra and a Trikona)';
    else if (isKendraTrikonaLord && !isDusthanaLord) role = 'functional benefic';
    else if (isDusthanaLord && !isKendraTrikonaLord) role = 'functional malefic';
    else if (isDusthanaLord && isKendraTrikonaLord) role = 'mixed — benefic and malefic tendencies both active';
    return { planet: p.name, houses: ownedHouses, role };
  });

  const content = [
    {
      heading: `Why Functional Nature Changes by Ascendant`,
      body: `In Vedic astrology, a planet's effect on a chart is not fixed — it depends on which houses it rules from the Ascendant. A planet ruling Kendra houses (1, 4, 7, 10) and Trikona houses (1, 5, 9) tends to act as a functional benefic for that Ascendant, while a planet ruling Dusthana houses (6, 8, 12) tends to act as a functional malefic, regardless of its general reputation as benefic or malefic. This is why, for example, Saturn — a natural malefic — can become one of the most auspicious planets for certain Ascendants.`,
    },
    {
      heading: `Functional Roles for ${asc.name} Ascendant`,
      body: rows.map(r => `${r.planet} rules house${r.houses.length > 1 ? 's' : ''} ${r.houses.join(' and ')} from ${asc.name} Ascendant, making it a ${r.role} for this Ascendant.`).join(' '),
    },
    {
      heading: 'Yogakaraka Planets',
      body: `A yogakaraka is a planet that rules both a Kendra and a Trikona house simultaneously — this is considered the single most powerful kind of functional benefic, since it has the authority of a Kendra lord combined with the auspiciousness of a Trikona lord. ${rows.find(r => r.role.includes('yogakaraka (owns both')) ? `For ${asc.name} Ascendant, this role is held by ${rows.find(r => r.role.includes('yogakaraka (owns both')).planet}.` : `${asc.name} Ascendant does not produce a classic dual Kendra-Trikona yogakaraka among the seven classical planets, though the Ascendant lord itself still carries elevated importance.`}`,
    },
    {
      heading: 'Using This in Practice',
      body: `When evaluating any chart with ${asc.name} rising, prioritise strengthening functional benefics through their dashas and transits, and treat functional malefic periods as times for discipline and reduced risk-taking rather than expansion — even if the planet involved has a generally benevolent natural reputation like Jupiter or Venus.`,
    },
  ];

  return {
    slug: `functional-nature-of-planets-for-${asc.key}-ascendant`,
    title: `Functional Nature of Planets for ${asc.name} Ascendant`,
    category: 'Functional Nature by Ascendant',
    excerpt: `How each planet's benefic or malefic role shifts specifically for ${asc.name} rising, based on which houses it rules.`,
    keywords: [`${asc.key} ascendant functional benefic malefic`, `${asc.name.toLowerCase()} lagna planet nature`, 'yogakaraka planets by ascendant'],
    content,
  };
}

// ---------------------------------------------------------------------------
// 5. Meaning of X House
// ---------------------------------------------------------------------------
export function houseMeaning(houseNum) {
  const h = HOUSES[houseNum];
  const isKendra = [1, 4, 7, 10].includes(houseNum);
  const isTrikona = [1, 5, 9].includes(houseNum);
  const isDusthana = [6, 8, 12].includes(houseNum);
  const isUpachaya = [3, 6, 10, 11].includes(houseNum);

  const content = [
    {
      heading: `Core Significations of the ${ordinal(houseNum)} House`,
      body: `The ${ordinal(houseNum)} House (${h.sanskrit}) governs ${h.significations}. Its natural karaka (significator) is ${h.karaka}, meaning this planet's condition in the chart also colours how this house's affairs unfold, independent of what actually occupies the house.`,
    },
    {
      heading: 'Classification in the House Wheel',
      body: `${isKendra ? `This is a Kendra (angular) house, one of the four pillars of the chart (1, 4, 7, 10) that carries the most structural weight and stability.` : ''} ${isTrikona ? `This is also a Trikona (trinal) house (1, 5, 9), associated with fortune, dharma, and past-life merit — planets ruling these houses are considered auspicious.` : ''} ${isDusthana ? `This is a Dusthana (difficult) house (6, 8, 12), associated with obstacles, transformation, or loss — but also, paradoxically, with the deepest growth when navigated consciously.` : ''} ${isUpachaya ? `It is also an Upachaya house (3, 6, 10, 11), meaning its results tend to improve with time and effort rather than being fixed from birth.` : ''}`,
    },
    {
      heading: 'How This House Is Read in Practice',
      body: `To assess the ${ordinal(houseNum)} House, astrologers look at three layers: the sign on its cusp, which planets (if any) sit inside it, and where its ruling lord is placed elsewhere in the chart. A well-placed lord in a friendly house strengthens the ${ordinal(houseNum)} House's themes; an afflicted or poorly placed lord tends to create delay or extra effort in the areas of ${h.significations}.`,
    },
    {
      heading: 'What Strengthens This House',
      body: `Benefic aspects (from Jupiter or Venus) onto the ${ordinal(houseNum)} House, a strong and well-placed ${h.karaka}, and a friendly relationship between this house's lord and the Ascendant lord all tend to support its significations of ${h.significations}. Afflictions from malefics, especially Saturn, Mars, Rahu, or Ketu without other mitigating factors, tend to introduce the harder lessons associated with this house.`,
    },
  ];

  return {
    slug: `${ordinal(houseNum)}-house-meaning-astrology`.replace(/\s/g, '-'),
    title: `${ordinal(houseNum)} House in Astrology: Complete Meaning`,
    category: 'House Meanings',
    excerpt: `The ${ordinal(houseNum)} House governs ${h.significations}. Here's how to read its strength and significations in a birth chart.`,
    keywords: [`${ordinal(houseNum)} house meaning astrology`, `${ordinal(houseNum)} house significations vedic astrology`, `${h.sanskrit.toLowerCase()} meaning`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 6. Meaning of X Planet
// ---------------------------------------------------------------------------
export function planetMeaning(planetKey) {
  const p = PLANETS[planetKey];

  const content = [
    {
      heading: `${p.name} (${p.sanskrit}): Core Significations`,
      body: `${p.name} governs ${p.karakatva}. It carries a ${p.guna} guna, belongs to the ${p.element} element, and is classified as ${p.gender.toLowerCase()} in gender and a ${p.nature} in nature. Its associated colour is ${p.colour}, and in the planetary cabinet of Vedic astrology it holds the role of ${p.role}.`,
    },
    {
      heading: 'Rulership and Dignity',
      body: `${p.name} rules ${p.rulerOf.map(s => SIGNS[s]?.name || s).join(' and ')}. It reaches its highest strength (exaltation) in ${SIGNS[p.exaltation.sign].name} at ${p.exaltation.degree}°, and its deepest weakness (debilitation) exactly 180° opposite, in ${SIGNS[p.debilitation.sign].name} at ${p.debilitation.degree}°. ${p.moolatrikona ? `Its Moolatrikona — a zone of confident, office-like strength — falls in ${SIGNS[p.moolatrikona.sign].name} between ${p.moolatrikona.range}.` : ''}`,
    },
    {
      heading: 'Relationships With Other Planets',
      body: `${p.name}'s natural friends are ${p.friends.length ? p.friends.map(f => PLANETS[f].name).join(', ') : 'none by classical rule'}, its neutral planets are ${p.neutral.length ? p.neutral.map(n => PLANETS[n].name).join(', ') : 'none'}, and its natural enemies are ${p.enemies.length ? p.enemies.map(e => PLANETS[e].name).join(', ') : 'none'}. These relationships determine how ${p.name} behaves when conjunct or aspected by other planets — a friendly combination tends to smooth its expression, while an enemy combination can create internal tension.`,
    },
    {
      heading: 'Special States',
      body: `${p.name} ${p.retrogrades ? 'does retrograde periodically, a phase during which its significations turn inward and get reworked rather than externally expressed.' : 'does not retrograde in the traditional sense, since it is always in direct motion from Earth\'s perspective.'} ${p.canBeCombust ? `It can also become combust when too close to the Sun (within roughly ${p.combustOrb}°), a state in which its significations get temporarily overshadowed.` : 'It does not undergo combustion in the classical framework.'} It casts its aspect on house number${p.aspects.length > 1 ? 's' : ''} ${p.aspects.join(', ')} counted from its own position.`,
    },
    {
      heading: 'Practical Takeaway',
      body: `Wherever ${p.name} sits in a chart — by house, sign, and nakshatra — that is where ${p.karakatva.split(',')[0].trim()} becomes a central theme of the native's life. Its dignity (exalted, own sign, debilitated, or neutral) determines whether this theme flows with relative ease or requires deliberate effort and maturity to master.`,
    },
  ];

  return {
    slug: `${p.key}-meaning-astrology`,
    title: `${p.name} in Astrology: Complete Meaning`,
    category: 'Planet Meanings',
    excerpt: `${p.name} governs ${p.karakatva.split(',')[0].trim()}. Here is its full significations, dignity, and relationships in Vedic astrology.`,
    keywords: [`${p.key} meaning astrology`, `${p.name.toLowerCase()} significations vedic astrology`, `${p.sanskrit.toLowerCase()} planet meaning`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 7. Meaning of X Sign
// ---------------------------------------------------------------------------
export function signMeaning(signKey) {
  const s = SIGNS[signKey];
  const ruler = PLANETS[s.ruler];

  const content = [
    {
      heading: `${s.name} (${s.sanskrit}): Core Nature`,
      body: `${s.name}, symbolised by ${s.symbol}, is a ${s.quality} ${s.element} sign ruled by ${ruler.name}. It is associated with ${s.keyword} and governs the ${s.bodyPart} in the body according to the Kalapurusha (cosmic body) framework.`,
    },
    {
      heading: 'Element and Quality',
      body: `As a ${s.element} sign, ${s.name} expresses through the qualities associated with that element. Its ${s.quality} nature further shapes how it operates: ${s.quality.includes('Cardinal') ? 'Cardinal (Chara) signs initiate — they are the starting points of each season and favour direct action.' : s.quality.includes('Fixed') ? 'Fixed (Sthira) signs sustain — they hold steady, resist change, and build depth over time.' : 'Dual (Dwiswabhava) signs adapt — they bridge and transition, often carrying two-sided or flexible energy.'}`,
    },
    {
      heading: `${ruler.name} as the Ruling Planet`,
      body: `Because ${ruler.name} rules ${s.name}, any planet placed in this sign is ultimately influenced by ${ruler.name}'s own strength, house placement, and condition in the chart. ${ruler.name} itself signifies ${ruler.karakatva.split(',')[0].trim()}, which is why ${s.name} carries an undertone of that theme even beyond its own core keyword of ${s.keyword}.`,
    },
    {
      heading: 'Where This Sign Shows Up in a Chart',
      body: `${s.name} matters wherever it appears on a house cusp — that house then expresses its affairs through ${s.keyword}. It also matters as the sign occupied by any planet, and as the sign rising at birth (the Ascendant), which shapes the native's basic temperament and physical presentation if ${s.name} is the rising sign.`,
    },
  ];

  return {
    slug: `${s.key}-sign-meaning-astrology`,
    title: `${s.name} Sign in Astrology: Complete Meaning`,
    category: 'Sign Meanings',
    excerpt: `${s.name} is a ${s.quality} ${s.element} sign ruled by ${ruler.name}, associated with ${s.keyword}.`,
    keywords: [`${s.key} sign meaning`, `${s.name.toLowerCase()} zodiac sign astrology`, `${s.sanskrit.toLowerCase()} rasi meaning`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 8. Jaimini Karakas
// ---------------------------------------------------------------------------
export function karakaArticle(karakaKey) {
  const k = KARAKAS.find(x => x.key === karakaKey);
  const otherKarakas = KARAKAS.filter(x => x.key !== karakaKey);

  const content = [
    {
      heading: `What ${k.name} Means`,
      body: `${k.name} is the ${k.meaning} in the Jaimini system of Char Karakas (temporary significators based on planetary degree). It is defined as ${k.desc}. Unlike fixed karakas (such as the Sun always signifying the soul in the general sense), Char Karakas rotate chart to chart — any of the seven classical planets can become the ${k.name} depending purely on its degree within its sign at birth.`,
    },
    {
      heading: 'How It Is Calculated',
      body: `To find the Char Karakas, list the seven classical planets (Sun through Saturn) by their degree within their occupied sign, from highest to lowest. The planet with the highest degree becomes Atmakaraka; the next highest becomes Amatyakaraka; and so on down through all seven roles, of which ${k.name} is one, ending with Darakaraka at the lowest degree.`,
    },
    {
      heading: `Reading a Planet as ${k.name}`,
      body: `Whichever planet earns the ${k.name} role in a specific chart, its own natural significations blend with the karaka's theme. For example, if Mars becomes ${k.name}, the ${k.meaning.replace('significator of ', '')} theme expresses with Mars's courage and assertiveness; if Venus holds the same role, the same theme expresses through Venus's diplomacy and aesthetic sensibility. This is why Jaimini analysis always names both the karaka role and the specific planet occupying it.`,
    },
    {
      heading: 'Its Place Among the Seven Char Karakas',
      body: `The full set of seven Char Karakas in order of degree are: ${KARAKAS.map(x => x.name).join(', ')}. ${k.name} is read alongside the others — particularly its relationship to Atmakaraka (the soul significator), since Jaimini astrology places heavy emphasis on how each supporting karaka relates back to the native's core life path.`,
    },
  ];

  return {
    slug: `${karakaKey}-jaimini-karaka-meaning`,
    title: `${k.name} in Jaimini Astrology: Meaning and Calculation`,
    category: 'Jaimini Karakas',
    excerpt: `${k.name} is the ${k.meaning} — ${k.desc}.`,
    keywords: [`${karakaKey} meaning jaimini astrology`, `${k.name.toLowerCase()} char karaka`, 'jaimini karakas explained'],
    content,
  };
}

// ---------------------------------------------------------------------------
// 9. Types of Yoga (overview + individual)
// ---------------------------------------------------------------------------
export function yogaOverview() {
  const content = [
    {
      heading: 'What Is a Yoga in Vedic Astrology?',
      body: `A Yoga is a specific planetary combination — by conjunction, mutual aspect, or exchange of signs — that produces a distinct, predictable life theme beyond what any single planet would show on its own. Yogas can be auspicious (Raja Yoga, Dhana Yoga), neutral-but-notable (Chandra Mangal Yoga), or challenging (Kemadruma Yoga), and every chart contains dozens of small yogas layered on top of one another.`,
    },
    {
      heading: 'Major Categories of Yoga',
      body: YOGAS.map(y => `${y.name} — ${y.desc}.`).join(' '),
    },
    {
      heading: 'How Yogas Are Judged in Practice',
      body: `No yoga operates in isolation. A powerful Raja Yoga can be weakened if the planets involved are also afflicted, combust, or placed in Dusthana houses; a challenging yoga like Kemadruma can be cancelled if there are planets in Kendras from the Moon. Full evaluation always considers the yoga alongside the dasha (planetary period) that activates it — a yoga present since birth may only manifest visibly during the dasha of the planets that form it.`,
    },
  ];

  return {
    slug: 'types-of-yoga-in-vedic-astrology',
    title: 'Types of Yoga in Vedic Astrology: Complete Overview',
    category: 'Yogas',
    excerpt: 'A guide to the major planetary yogas in Vedic astrology — Raja Yoga, Dhana Yoga, Gajakesari, Panch Mahapurusha, and more.',
    keywords: ['types of yoga in astrology', 'raja yoga dhana yoga meaning', 'vedic astrology yogas list'],
    content,
  };
}

export function yogaArticle(yogaName) {
  const y = YOGAS.find(x => x.name === yogaName);
  const content = [
    { heading: `What ${y.name} Is`, body: `${y.name} is formed when ${y.desc}. It belongs to the broader family of planetary combinations that Vedic astrology treats as distinct from single-planet significations — the combination itself creates an effect greater than its individual parts.` },
    { heading: 'How to Identify It in a Chart', body: `To check for ${y.name}, identify the specific planets and houses named in its classical definition, then confirm the exact placement, sign, and mutual relationship required. Precision matters — a near-miss (for example, planets in adjacent but not the specified houses) does not count as the yoga forming.` },
    { heading: 'Strength and Timing', body: `Even when ${y.name} is technically present, its visible strength depends on the dignity of the planets involved (own sign, exaltation, or debilitation) and whether they are afflicted by malefics or combustion. Its effects tend to become most visible during the Vimshottari dasha or antardasha of the planets that form the yoga.` },
  ];
  return {
    slug: `${slugify(y.name)}-meaning-astrology`,
    title: `${y.name} in Astrology: Meaning and Effects`,
    category: 'Yogas',
    excerpt: `${y.name} is formed when ${y.desc}.`,
    keywords: [`${slugify(y.name)} meaning`, `${y.name.toLowerCase()} astrology`, 'vedic astrology yogas'],
    content,
  };
}

// ---------------------------------------------------------------------------
// 10. Types of Dosha (overview + individual)
// ---------------------------------------------------------------------------
export function doshaOverview() {
  const content = [
    { heading: 'What Is a Dosha?', body: `A Dosha is a planetary combination associated with a specific karmic challenge or delay — it is not a curse, but a pattern that asks for conscious remedy and patience. Doshas are extremely common; most charts carry at least one, and their intensity depends heavily on supporting or mitigating factors elsewhere in the chart.` },
    { heading: 'Major Doshas in Vedic Astrology', body: DOSHAS.map(d => `${d.name} — ${d.desc}.`).join(' ') },
    { heading: 'How Doshas Are Actually Evaluated', body: `A dosha's real-world intensity is never judged from its presence alone. Astrologers check the strength of the planets forming it, whether benefic aspects fall on the same houses, and whether classical cancellation (Bhanga) conditions are met. Many textbook doshas are substantially reduced or fully cancelled once the whole chart is considered.` },
  ];
  return {
    slug: 'types-of-dosha-in-vedic-astrology',
    title: 'Types of Dosha in Vedic Astrology: Complete Overview',
    category: 'Doshas',
    excerpt: 'A guide to the major doshas in Vedic astrology — Manglik, Kaal Sarp, Pitra, Sade Sati, and more — and how they are actually evaluated.',
    keywords: ['types of dosha in astrology', 'manglik dosha kaal sarp dosha meaning', 'vedic astrology dosha list'],
    content,
  };
}

export function doshaArticle(doshaName) {
  const d = DOSHAS.find(x => x.name === doshaName);
  const content = [
    { heading: `What ${d.name} Is`, body: `${d.name} occurs when ${d.desc}. Like all doshas, its presence is a starting point for analysis, not a final verdict — the chart's overall strength determines how intensely it manifests.` },
    { heading: 'How to Check for It', body: `Identifying ${d.name} requires locating the exact planetary positions described in its classical definition and confirming they meet the precise house or conjunction criteria — approximate placements do not qualify.` },
    { heading: 'Cancellation and Remedy', body: `Classical texts describe specific cancellation conditions (Bhanga) for most doshas, along with supportive practices — mantra, charitable action, or timing major decisions around favourable dashas — that are traditionally used to work with, rather than fight against, the pattern.` },
  ];
  return {
    slug: `${slugify(d.name)}-meaning-astrology`,
    title: `${d.name} in Astrology: Meaning and Remedies`,
    category: 'Doshas',
    excerpt: `${d.name} occurs when ${d.desc}.`,
    keywords: [`${slugify(d.name)} meaning`, `${d.name.toLowerCase()} remedies`, 'vedic astrology dosha'],
    content,
  };
}

// ---------------------------------------------------------------------------
// 11. Importance of Rahu-Ketu Axis
// ---------------------------------------------------------------------------
export function rahuKetuAxis() {
  const content = [
    { heading: 'Why Rahu and Ketu Are Always Opposite', body: `Rahu and Ketu are the Moon's north and south nodes — mathematical points where the Moon's orbit crosses the ecliptic, not physical bodies. Because they are two ends of the same orbital intersection, they are always placed exactly 180° apart, permanently occupying opposite houses and opposite signs in every chart.` },
    { heading: 'What the Axis Represents', body: `Rahu signifies ${PLANETS.rahu.karakatva}, while Ketu signifies ${PLANETS.ketu.karakatva}. Together, the axis they form marks the single most active karmic theme in the chart — the houses they occupy show where the native is pulled toward hungry, unresolved ambition (Rahu) and where they are pulled toward release, detachment, and past-life mastery (Ketu).` },
    { heading: 'Reading the Axis by House', body: `Whichever house-pair the nodes occupy (for example 1st–7th, 2nd–8th, up through 6th–12th), that pair becomes the central axis of growth for the entire life. The Rahu side shows what the native compulsively chases, often past a point of diminishing returns; the Ketu side shows what comes unusually easily but is often taken for granted or renounced too early.` },
    { heading: 'Why This Axis Matters More Than Its Individual Points', body: `Because Rahu and Ketu are shadow planets with no physical mass, their significance comes almost entirely from the houses and signs they occupy and aspect, rather than any independent dignity of their own. This is why serious analysis always reads the axis as a single unit — the story only makes sense when both ends are read together.` },
  ];
  return {
    slug: 'importance-of-rahu-ketu-axis-astrology',
    title: 'Importance of the Rahu-Ketu Axis in Astrology',
    category: 'Rahu-Ketu',
    excerpt: 'Rahu and Ketu are always 180° apart — together they mark the single most active karmic axis in a birth chart.',
    keywords: ['rahu ketu axis importance', 'rahu ketu meaning astrology', 'lunar nodes vedic astrology'],
    content,
  };
}

// ---------------------------------------------------------------------------
// 12. Importance of D9 Chart
// ---------------------------------------------------------------------------
export function d9Importance() {
  const content = [
    { heading: 'What the D9 (Navamsa) Chart Is', body: `The D9 or Navamsa chart is a harmonic division of the birth chart created by dividing each 30° sign into nine parts of 3°20' each. It is the most important of the sixteen classical divisional charts (Shodashvarga) after the main birth chart (Rashi/D1), and is considered the chart that shows the "fruit" of what the D1 only shows as potential.` },
    { heading: 'Why It Is Central to Marriage Analysis', body: `The D9 chart is the primary tool for judging marriage and partnership quality — the strength of Venus and the 7th house lord in the D9 is checked alongside their D1 placement before any serious prediction about marital life is made. A planet that looks weak in the D1 but is exalted in the D9 often still delivers strong results, especially in matters the D9 governs.` },
    { heading: 'Why It Matters for Overall Chart Strength', body: `Beyond marriage, the Navamsa is used as a general strength-confirmation tool: a planet that is dignified in both the D1 and D9 is considered genuinely strong (a state called Vargottama when it lands in the exact same sign in both charts), while a planet strong in the D1 but weak in the D9 is considered to deliver less durable results than it initially promises.` },
    { heading: 'How to Use It in Practice', body: `A complete reading always overlays the D9 on top of the D1 rather than reading either alone: check each planet's sign, dignity, and house placement in the D9, note any Vargottama planets, and pay special attention to the Navamsa Lagna (D9 ascendant) as a second, subtler layer of personality and life direction.` },
  ];
  return {
    slug: 'importance-of-d9-navamsa-chart-astrology',
    title: 'Importance of the D9 (Navamsa) Chart in Astrology',
    category: 'Divisional Charts',
    excerpt: 'The D9 or Navamsa chart shows the "fruit" of the birth chart and is the primary tool for judging marriage and true planetary strength.',
    keywords: ['d9 chart importance astrology', 'navamsa chart meaning', 'vargottama planet meaning'],
    content,
  };
}

// ---------------------------------------------------------------------------
// 13/14. Transit Effects (sign / house)
// ---------------------------------------------------------------------------
export function transitInSign(planetKey, signKey) {
  const p = PLANETS[planetKey];
  const s = SIGNS[signKey];
  const speedNote = ['saturn'].includes(planetKey) ? 'roughly two and a half years' : ['jupiter'].includes(planetKey) ? 'about one year' : ['rahu', 'ketu'].includes(planetKey) ? 'about eighteen months' : ['mars'].includes(planetKey) ? 'about six to seven weeks' : 'a few weeks';

  const content = [
    { heading: `${p.name} Transiting ${s.name}: What It Means`, body: `A transit occurs when ${p.name} moves through ${s.name} in the current sky, activating that sign's themes of ${s.keyword} for everyone, but especially for natives whose birth chart has a personal placement (Moon sign, Ascendant, or natal planets) in or aspecting ${s.name}.` },
    { heading: 'Duration and Pace', body: `${p.name} typically stays in a single sign for ${speedNote}, moving through ${s.name} at this pace before advancing to the next sign. During retrograde phases, it can appear to move backward through the same degrees, effectively extending its influence on ${s.name} for a second pass.` },
    { heading: 'Who Feels This Transit Most', body: `The strongest effects fall on natives with their Moon sign or Ascendant in ${s.name}, or with natal planets placed there — for them, this transit directly activates ${p.karakatva.split(',')[0].trim()} in the context of ${s.keyword}. Natives with planets in the signs ${p.name} aspects from ${s.name} (houses ${p.aspects.join(', ')} counted from this position) also feel a secondary, often subtler effect.` },
    { heading: 'How to Work With It', body: `Track this transit against your natal chart specifically rather than reading it generically — the same sky position produces very different results depending on which house ${s.name} represents from your personal Ascendant. Use the period to lean into ${s.keyword} constructively rather than resisting it outright.` },
  ];
  return {
    slug: `${p.key}-transit-in-${s.key}-effects`,
    title: `${p.name} Transit in ${s.name}: Effects and Guidance`,
    category: 'Transits',
    excerpt: `${p.name} transiting ${s.name} activates themes of ${s.keyword} — here's how to read the effect for your chart.`,
    keywords: [`${p.key} transit in ${s.key}`, `${p.name.toLowerCase()} gochar ${s.name.toLowerCase()}`, `${p.name.toLowerCase()} transit effects`],
    content,
  };
}

export function transitInHouse(planetKey, houseNum) {
  const p = PLANETS[planetKey];
  const h = HOUSES[houseNum];
  const content = [
    { heading: `${p.name} Transiting the ${ordinal(houseNum)} House`, body: `Counted from your natal Moon sign (the traditional reference point for transit analysis, called Gochar), ${p.name} moving through your ${ordinal(houseNum)} House temporarily activates the themes of ${h.significations} — the same domain this house governs in the birth chart itself.` },
    { heading: 'What Gets Activated', body: `Since ${p.name} signifies ${p.karakatva.split(',')[0].trim()}, this transit tends to bring ${h.significations} into active focus through that lens. A natal placement that already involves this house or its lord will amplify the transit's visibility considerably.` },
    { heading: 'Houses This Transit Also Aspects', body: `From the ${ordinal(houseNum)} House, ${p.name} casts its aspect on house${p.aspects.length > 1 ? 's' : ''} ${p.aspects.map(a => ordinal(((houseNum - 1 + a - 1) % 12) + 1)).join(', ')} (counted onward), meaning those areas of life also receive a secondary, background influence during this period.` },
    { heading: 'Practical Guidance', body: `Read this transit alongside the dasha (planetary period) currently running — a transit that aligns with the dasha lord's own significations tends to be far more noticeable than one that doesn't. Use this window to actively engage with ${h.significations} rather than treating the transit as something happening passively to you.` },
  ];
  return {
    slug: `${p.key}-transit-in-${houseNum}th-house-effects`,
    title: `${p.name} Transit in the ${ordinal(houseNum)} House: Effects and Guidance`,
    category: 'Transits',
    excerpt: `${p.name} transiting your ${ordinal(houseNum)} House activates themes of ${h.significations}.`,
    keywords: [`${p.key} transit ${houseNum}th house`, `${p.name.toLowerCase()} gochar house effects`, `${p.name.toLowerCase()} transit house`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 15. Planet Effect in Nakshatra Transit (distinct angle from #2: transit-based, not natal placement)
// ---------------------------------------------------------------------------
export function transitInNakshatra(planetKey, nakshatraIndex) {
  const p = PLANETS[planetKey];
  const n = NAKSHATRAS[nakshatraIndex];
  const rulerPlanet = PLANETS[n.ruler];
  const content = [
    { heading: `${p.name} Transiting ${n.name} Nakshatra`, body: `As ${p.name} moves through the sky, it passes through ${n.name} for a portion of its time in the sign(s) that contain this nakshatra. This is a finer-grained transit window than a full sign transit — ${n.name} spans only 13°20', so this activation is comparatively short and specific.` },
    { heading: 'What This Window Emphasises', body: `${n.name} is ruled by ${rulerPlanet.name} and presided over by ${n.deity}, carrying a ${n.nature} quality. While ${p.name} transits this nakshatra, its own significations of ${p.karakatva.split(',')[0].trim()} take on that ${n.nature} flavour — natives with natal planets or their Moon in ${n.name} feel this window most directly.` },
    { heading: 'Who Should Track This Transit', body: `This level of transit detail matters most for precise timing work — for example, choosing an auspicious window (Muhurta) or understanding why a short, specific period felt different from the broader sign transit around it. It is less relevant for general yearly predictions, which are usually read at the sign level.` },
    { heading: 'Practical Note', body: `Because nakshatra transits are brief, their effects are best understood as a short-term emphasis within the larger sign transit already underway, rather than a standalone forecast window.` },
  ];
  return {
    slug: `${p.key}-transit-${slugify(n.name)}-nakshatra-effects`,
    title: `${p.name} Transit Through ${n.name} Nakshatra: Effects`,
    category: 'Transits',
    excerpt: `${p.name} transiting ${n.name} nakshatra is a short, specific window worth tracking for precise timing.`,
    keywords: [`${p.key} transit ${n.name.toLowerCase()} nakshatra`, `${p.name.toLowerCase()} nakshatra transit effects`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 16. Retrograde Meaning
// ---------------------------------------------------------------------------
export function retrogradeMeaning(planetKey) {
  const p = PLANETS[planetKey];
  if (!p.retrogrades) {
    return null; // Sun and Moon do not retrograde — skip generation for these
  }
  const content = [
    { heading: `What ${p.name} Retrograde Means`, body: `Retrograde motion is an optical illusion caused by the relative orbital speeds of Earth and ${p.name} — the planet appears to move backward through the zodiac from Earth's vantage point, though it never actually reverses direction in space. Astrologically, this apparent reversal is read as a turning inward of ${p.name}'s significations.` },
    { heading: 'How Retrograde Changes Expression', body: `${p.name} normally signifies ${p.karakatva.split(',')[0].trim()}, expressed outwardly. In retrograde, this same energy tends to turn reflective, delayed, or repeated — natives often revisit unfinished business connected to this planet's themes, whether that means reconnecting with people, reworking plans, or re-examining decisions made earlier.` },
    { heading: 'Natal Retrograde vs Transit Retrograde', body: `A planet retrograde at birth (natal retrograde) suggests the native's relationship with ${p.karakatva.split(',')[0].trim()} is naturally more internal, self-referential, or unconventional throughout life — not weaker, just differently expressed. A planet turning retrograde by transit is a temporary window, typically lasting weeks to months, during which that planet's significations for everyone shift toward review rather than fresh initiation.` },
    { heading: 'What to Do During This Period', body: `Classical guidance around retrograde periods, especially for ${p.name}, generally advises against starting major new ventures connected to its significations and instead favours revision, reflection, and completing existing commitments until the planet turns direct again.` },
  ];
  return {
    slug: `${p.key}-retrograde-meaning-astrology`,
    title: `${p.name} Retrograde: Meaning and Effects`,
    category: 'Retrograde Planets',
    excerpt: `${p.name} retrograde turns its significations of ${p.karakatva.split(',')[0].trim()} inward — here's what that means in practice.`,
    keywords: [`${p.key} retrograde meaning`, `${p.name.toLowerCase()} vakri astrology`, `${p.name.toLowerCase()} retrograde effects`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 17. Combustion Meaning
// ---------------------------------------------------------------------------
export function combustionMeaning(planetKey) {
  const p = PLANETS[planetKey];
  if (!p.canBeCombust) return null;
  const content = [
    { heading: `What Combustion Means for ${p.name}`, body: `Combustion (Astangata) occurs when a planet sits too close to the Sun in the sky — for ${p.name}, this threshold is traditionally set at roughly ${p.combustOrb}° of separation. Within this orb, ${p.name}'s own light is considered symbolically overpowered by the Sun's brilliance, muting its ability to express its significations clearly.` },
    { heading: 'Effect on Significations', body: `${p.name} governs ${p.karakatva.split(',')[0].trim()}. When combust, this theme doesn't disappear, but it becomes harder for the native to access consciously — often described as the planet's confidence being "burned" rather than destroyed. The native may feel this area of life is present but somehow invisible to themselves or others.` },
    { heading: 'How Combustion Differs From Debilitation', body: `Combustion is a temporary, proximity-based weakening, not a placement-based one like debilitation. A combust ${p.name} can be in a sign it would otherwise be very strong in — the affliction comes purely from its closeness to the Sun and typically lessens once the two planets separate by transit.` },
    { heading: 'Mitigating Factors', body: `A combust planet's severity is judged by exact degree of separation (closer is worse), whether it is also retrograde (some classical texts consider a retrograde combust planet less afflicted), and whether it receives a strong benefic aspect that can offset the weakening.` },
  ];
  return {
    slug: `${p.key}-combustion-meaning-astrology`,
    title: `${p.name} Combustion: Meaning and Effects`,
    category: 'Combustion',
    excerpt: `${p.name} becomes combust within roughly ${p.combustOrb}° of the Sun, muting its significations of ${p.karakatva.split(',')[0].trim()}.`,
    keywords: [`${p.key} combustion meaning`, `${p.name.toLowerCase()} astangata astrology`, `${p.name.toLowerCase()} combust effects`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 18. Permanent Friendship Table
// ---------------------------------------------------------------------------
export function friendshipTable() {
  const rows = Object.values(PLANETS).filter(p => !['rahu', 'ketu'].includes(p.key));
  const content = [
    { heading: 'What Permanent (Naisargika) Friendship Means', body: `Permanent friendship is a fixed relationship between the seven classical planets, based on their natural characters — it never changes regardless of chart or placement, unlike temporary (Tatkalika) friendship, which is based on house distance and does change chart to chart.` },
    { heading: 'The Complete Friendship Table', body: rows.map(p => `${p.name} — Friends: ${p.friends.map(f => PLANETS[f].name).join(', ') || 'none'}; Neutral: ${p.neutral.map(n => PLANETS[n].name).join(', ') || 'none'}; Enemies: ${p.enemies.map(e => PLANETS[e].name).join(', ') || 'none'}.`).join(' ') },
    { heading: 'How This Is Used', body: `Permanent friendship combines with temporary friendship to produce five compound relationship states — Best Friend, Friend, Neutral, Enemy, and Bitter Enemy — which are then used to judge a planet's strength (Panchadha Maitri Bala) and to assess how it will behave when conjunct or aspected by another planet.` },
    { heading: 'A Key Nuance', body: `Friendship in this table is not always mutual. The Moon, for example, considers the Sun a friend, and the Sun also considers the Moon a friend — but several other pairs are one-directional, meaning Planet A can list Planet B as a friend while Planet B lists Planet A as neutral or even an enemy. Always check the relationship from the specific planet being analysed, not the reverse.` },
  ];
  return {
    slug: 'permanent-friendship-between-planets-astrology',
    title: 'Permanent Friendship Between Planets in Astrology',
    category: 'Planetary Relationships',
    excerpt: 'The complete Naisargika Maitri (natural friendship) table for all seven classical planets, and how it is used in chart analysis.',
    keywords: ['permanent friendship between planets', 'naisargika maitri table', 'planetary friendship vedic astrology'],
    content,
  };
}

// ---------------------------------------------------------------------------
// 19. Planetary War (Graha Yuddha)
// ---------------------------------------------------------------------------
export function planetaryWar() {
  const content = [
    { heading: 'What Planetary War (Graha Yuddha) Is', body: `Graha Yuddha, or "planetary war," occurs when two of the five star planets — Mars, Mercury, Jupiter, Venus, or Saturn (the Sun and Moon are excluded from this rule) — are conjunct within 1° of longitude in the same sign. Classical texts treat this as an actual celestial "battle" for dominance between the two.` },
    { heading: 'How the Winner Is Determined', body: `The planet with the greater celestial latitude (distance from the ecliptic) or, by some methods, the one that appears further north or has a brighter magnitude, is considered the winner of the war. The winning planet largely retains its ability to give normal results from that house and sign; the losing planet is considered significantly weakened, similar in effect to combustion.` },
    { heading: 'Effect on the Chart', body: `Because both planets involved carry their own significations, a planetary war creates a compressed, high-tension placement — the house and sign they occupy becomes a site of internal competition between the two planets' agendas, with the winning planet's themes eventually taking precedence once the native matures past the associated conflict.` },
    { heading: 'Why This Differs From an Ordinary Conjunction', body: `An ordinary conjunction blends two planets' energies relatively smoothly, especially if they are natural friends. A Graha Yuddha, by contrast, is defined purely by the extremely tight orb (within 1°) and applies even to naturally friendly planets — the tightness of the degree, not the planets' natural relationship, is what triggers the "war" classification.` },
  ];
  return {
    slug: 'planetary-war-graha-yuddha-meaning',
    title: 'Planetary War (Graha Yuddha): Meaning and Effects',
    category: 'Planetary Relationships',
    excerpt: 'When two planets conjoin within 1° of each other, Vedic astrology treats it as a planetary war — here is how the winner and loser are determined.',
    keywords: ['planetary war graha yuddha meaning', 'planets conjunction within one degree', 'graha yuddha astrology'],
    content,
  };
}

// ---------------------------------------------------------------------------
// 20. Aspect Number Meaning
// ---------------------------------------------------------------------------
export function aspectMeaning(planetKey, aspectNumber) {
  const p = PLANETS[planetKey];
  const meaning = ASPECT_MEANINGS[aspectNumber];
  const content = [
    { heading: `What the ${ordinal(aspectNumber)}-House Aspect Means`, body: `In Vedic astrology, every planet casts a full aspect on the house directly opposite it (the 7th aspect), but several planets carry additional special aspects. ${p.name}'s aspect pattern includes house${p.aspects.length > 1 ? 's' : ''} ${p.aspects.join(', ')} counted forward from its own position. The ${ordinal(aspectNumber)}-house aspect specifically carries the quality of ${meaning}.` },
    { heading: `Why ${p.name} Casts This Particular Aspect`, body: `Special aspects are unique to Mars (4th, 7th, 8th), Jupiter (5th, 7th, 9th), and Saturn (3rd, 7th, 10th) among the classical planets — each reflects that planet's core nature. ${p.name}'s significations of ${p.karakatva.split(',')[0].trim()} are what get projected through the ${ordinal(aspectNumber)}-house aspect specifically.` },
    { heading: 'How to Read This Aspect on a House', body: `Wherever this aspect lands, the house it touches experiences ${meaning}, coloured by ${p.name}'s own significations of ${p.karakatva.split(',')[0].trim()}. Whether this plays out as support or pressure depends heavily on ${p.name}'s own dignity — a well-placed, dignified ${p.name} delivers this aspect's benefits more cleanly, while an afflicted ${p.name} delivers more of its challenging side.` },
  ];
  return {
    slug: `${p.key}-${aspectNumber}th-aspect-meaning`,
    title: `${p.name}'s ${ordinal(aspectNumber)} Aspect: Meaning in Astrology`,
    category: 'Planetary Aspects',
    excerpt: `${p.name}'s ${ordinal(aspectNumber)}-house aspect carries ${meaning}.`,
    keywords: [`${p.key} ${aspectNumber}th aspect meaning`, `${p.name.toLowerCase()} special aspect astrology`, `${p.name.toLowerCase()} drishti meaning`],
    content,
  };
}

// ---------------------------------------------------------------------------
// 21. Aspect on X House Meaning
// ---------------------------------------------------------------------------
export function aspectOnHouse(planetKey, aspectNumber, fromHouseNum) {
  const p = PLANETS[planetKey];
  const targetHouseNum = ((fromHouseNum - 1 + aspectNumber - 1) % 12) + 1;
  const fromHouse = HOUSES[fromHouseNum];
  const targetHouse = HOUSES[targetHouseNum];
  const meaning = ASPECT_MEANINGS[aspectNumber];

  const content = [
    { heading: `${p.name} in the ${ordinal(fromHouseNum)} House Aspecting the ${ordinal(targetHouseNum)} House`, body: `When ${p.name} sits in the ${ordinal(fromHouseNum)} House, its ${ordinal(aspectNumber)} special aspect lands on the ${ordinal(targetHouseNum)} House — the house of ${targetHouse.significations}. This aspect carries ${meaning}.` },
    { heading: 'What Gets Activated in the Target House', body: `The ${ordinal(targetHouseNum)} House governs ${targetHouse.significations}. Under this aspect, ${p.name}'s significations of ${p.karakatva.split(',')[0].trim()} get projected directly onto these matters — meaning the native's experience of ${targetHouse.significations} is noticeably shaped by ${p.name}'s themes, even though ${p.name} itself is physically sitting in the ${ordinal(fromHouseNum)} House.` },
    { heading: 'Reading Both Houses Together', body: `This combination effectively links two houses: the ${ordinal(fromHouseNum)} House (${fromHouse.significations}) and the ${ordinal(targetHouseNum)} House (${targetHouse.significations}). A well-placed, dignified ${p.name} tends to make this a productive bridge between the two life areas; an afflicted ${p.name} tends to import the ${ordinal(fromHouseNum)} House's challenges into the ${ordinal(targetHouseNum)} House's affairs.` },
    { heading: 'Practical Reading', body: `Treat this aspect as a standing background influence rather than a single event — for as long as ${p.name} occupies the ${ordinal(fromHouseNum)} House in the chart (its natal placement, which is permanent), the ${ordinal(targetHouseNum)} House carries this overlay, activated more visibly during ${p.name}'s own dasha periods.` },
  ];
  return {
    slug: `${p.key}-in-${fromHouseNum}th-house-aspect-on-${targetHouseNum}th-house`,
    title: `${p.name} in ${ordinal(fromHouseNum)} House Aspecting ${ordinal(targetHouseNum)} House: Meaning`,
    category: 'Planetary Aspects',
    excerpt: `${p.name} in the ${ordinal(fromHouseNum)} House casts its ${ordinal(aspectNumber)} aspect onto the ${ordinal(targetHouseNum)} House, affecting ${targetHouse.significations}.`,
    keywords: [`${p.key} ${ordinal(fromHouseNum)} house aspect ${ordinal(targetHouseNum)} house`, `${p.name.toLowerCase()} aspect house meaning`],
    content,
  };
}