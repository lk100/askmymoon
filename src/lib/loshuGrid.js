// lib/loshuGrid.js
//
// Lo Shu Grid: a fixed 3x3 magic square.
//   4  9  2
//   3  5  7
//   8  1  6

export const GRID_POSITIONS = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

export const NUMBER_MEANINGS = {
  1: {
    title: 'Self & Independence',
    keywords: ['Leadership', 'Willpower', 'Originality'],
    present: 'Number 1 is the number of the pioneer. You carry a strong sense of who you are and an instinct to move first instead of waiting to be told. People often look to you to take charge, even when you never asked for the role. You would rather build your own path than follow a ready-made one, and that independence is the engine behind most of what you achieve.',
    repeated: 'When 1 shows up more than once, your drive gets louder. You are decisive and ambitious, but you may find it hard to take advice or share credit. Learning to listen is what turns this strength into real leadership.',
    missing: 'With 1 missing, confidence does not always come easily. You may know exactly what you want and still hesitate to step forward, or let someone else speak for you. Many people with this gap are quietly capable, and their biggest breakthroughs come the moment they start backing their own ideas.',
    strengths: 'Initiative, courage to start things, clear self-belief',
    watchOut: 'Stubbornness and impatience with slower people',
    career: 'Entrepreneurship, management, independent professions',
    relationships: 'Loyal and protective, but needs to leave room for the other person\'s voice',
  },
  2: {
    title: 'Emotional Connection',
    keywords: ['Empathy', 'Cooperation', 'Sensitivity'],
    present: 'Number 2 is the number of the peacemaker. You read moods quickly, often before anyone says a word, and people feel at ease around you without quite knowing why. You work best in partnership, and you have a gift for calming tension and bringing people back to the same page. Your intuition about people is rarely wrong.',
    repeated: 'Several 2s make you deeply feelings-driven. You give generously and absorb the mood of a room, which can leave you drained or over-sensitive to criticism. Protecting your own energy is the lesson here.',
    missing: 'With 2 missing, expressing feelings or leaning on others can feel unfamiliar. You may prefer to handle things alone and can come across as more distant than you actually are. Learning to say what you feel, and to accept help, changes the quality of your closest relationships.',
    strengths: 'Empathy, diplomacy, patience, teamwork',
    watchOut: 'Over-sensitivity, mood swings, indecision',
    career: 'Counselling, teaching, HR, healthcare, partnerships and mediation',
    relationships: 'Devoted and attentive, though prone to taking things personally',
  },
  3: {
    title: 'Creativity & Expression',
    keywords: ['Creativity', 'Communication', 'Joy'],
    present: 'Number 3 is the number of the storyteller. You have a natural way with words and ideas, and people tend to remember what you say. There is a spark of humour and imagination in how you see things, and you bring lightness to heavy situations. Whether through speaking, writing, art or simply being good company, you are made to be heard.',
    repeated: 'Multiple 3s make you unusually expressive and social, with plenty of ideas. The risk is spreading yourself thin or talking more than you finish. Pick one idea and follow it through to see how far your creativity can go.',
    missing: 'With 3 missing, putting thoughts and feelings into words may not come easily. You might hold ideas back, worry about how they will land, or feel your creativity has no outlet. Small, regular expression, such as journaling, sketching or speaking up in meetings, tends to unlock this quickly.',
    strengths: 'Communication, imagination, charm, optimism',
    watchOut: 'Scattered focus and exaggeration',
    career: 'Media, teaching, marketing, design, performing arts, sales',
    relationships: 'Fun, warm and expressive, and needs a partner who enjoys conversation',
  },
  4: {
    title: 'Stability & Structure',
    keywords: ['Discipline', 'Reliability', 'Order'],
    present: 'Number 4 is the number of the builder. You like things done properly, and you have the patience to do them step by step. People trust you because you show up, keep your word and finish what you start. Where others see routine, you see the foundation that makes bigger things possible.',
    repeated: 'Several 4s give you remarkable discipline, but also a tendency toward rigidity. You may resist change or work too hard for too little rest. Allowing some flexibility keeps this strength from becoming a burden.',
    missing: 'With 4 missing, routine and structure can feel like a struggle. Plans may start well and fade, or your schedule may feel scattered. You do not need to become rigid. Just a few small anchors, like fixed timings and simple checklists, make a big difference.',
    strengths: 'Discipline, dependability, attention to detail',
    watchOut: 'Rigidity, over-working, resisting change',
    career: 'Engineering, accounting, administration, construction, operations',
    relationships: 'Steady and committed, showing love through actions more than words',
  },
  5: {
    title: 'Freedom & Adventure',
    keywords: ['Adaptability', 'Curiosity', 'Balance'],
    present: 'Number 5 sits at the centre of the grid, and it acts as the balance point for everything around it. You are curious, quick to adapt and happiest when life keeps moving. You learn fast, talk easily with all kinds of people and can find an opening where others see a dead end. Change does not scare you, it energises you.',
    repeated: 'Multiple 5s make you restless and hungry for variety. It is a wonderful energy, but it can make commitments feel confining. Choosing a few things worth staying with gives your adventurous side a direction.',
    missing: 'With 5 missing, the centre of the grid is empty, which is why balance and flexibility can feel harder. You may resist change, stay too long in familiar situations, or feel pulled in two directions without a clear anchor. Building comfort with small changes brings this number to life quietly and steadily.',
    strengths: 'Adaptability, curiosity, quick thinking, balance',
    watchOut: 'Restlessness, impulsiveness, fear of commitment',
    career: 'Travel, communication, sales, consulting, technology',
    relationships: 'Exciting and open-minded, and needs freedom and variety',
  },
  6: {
    title: 'Nurturing & Responsibility',
    keywords: ['Care', 'Family', 'Harmony'],
    present: 'Number 6 is the number of the caretaker. Family, home and the people you love come first for you, and you naturally take responsibility for their wellbeing. You bring warmth to any space and a sense of fairness to any disagreement. Others lean on you because you are steady, generous and hard to shake.',
    repeated: 'Several 6s deepen your devotion, but may lead you to carry other people\'s burdens or expect a lot in return. Setting kind boundaries protects your energy so your care stays a joy, not a duty.',
    missing: 'With 6 missing, the pull of duty and domestic responsibility can feel heavy, or you may feel emotionally detached from routine care. Some people with this gap take longer to settle down or find balance between personal freedom and family. Small acts of care, done consistently, build this strength gently.',
    strengths: 'Compassion, loyalty, sense of fairness, warmth',
    watchOut: 'Over-giving, perfectionism, controlling through care',
    career: 'Healthcare, education, hospitality, design, social work',
    relationships: 'Devoted partner and parent, and needs appreciation in return',
  },
  7: {
    title: 'Spirituality & Analysis',
    keywords: ['Insight', 'Depth', 'Intuition'],
    present: 'Number 7 is the number of the seeker. You look beneath the surface of things, and you are rarely satisfied with easy answers. You value quiet time, think deeply and often sense things before you can explain them. That mix of intellect and intuition gives you an insight that surprises even people who know you well.',
    repeated: 'Several 7s make you a deep thinker, sometimes to the point of overthinking or withdrawing. You may need a lot of solitude. Balancing reflection with connection keeps this gift from turning into isolation.',
    missing: 'With 7 missing, reflection and inner questions may not come naturally, and you may prefer the practical and visible over the abstract. Life can feel like it moves fast without much pause. Setting aside quiet time regularly is the simplest way to build this depth.',
    strengths: 'Analysis, intuition, wisdom, focus in research',
    watchOut: 'Overthinking, secrecy, withdrawing from others',
    career: 'Research, science, writing, psychology, spiritual and healing professions',
    relationships: 'Thoughtful and loyal, and needs space and a partner who respects silence',
  },
  8: {
    title: 'Material Success & Power',
    keywords: ['Ambition', 'Authority', 'Wealth'],
    present: 'Number 8 is the number of achievement. You think in terms of results, resources and long-term outcomes, and you have the stamina to pursue them. Money, status and responsibility tend to find their way into your life, along with the pressure that comes with them. When you use your influence well, you become someone who builds things that last.',
    repeated: 'Multiple 8s create tremendous ambition and a strong link between your effort and your results. The risk is becoming too focused on control or success at the cost of relationships. Keeping generosity in the picture keeps your power healthy.',
    missing: 'With 8 missing, managing money, setting ambitious targets or asserting authority may feel less natural. You may undervalue your worth or avoid financial planning. Building simple habits around saving, tracking and asking for what you deserve helps this area grow steadily.',
    strengths: 'Ambition, management ability, resilience, financial sense',
    watchOut: 'Workaholism, control, tying self-worth to success',
    career: 'Business, finance, law, administration, real estate, leadership roles',
    relationships: 'Protective and generous, though work can crowd out personal time',
  },
  9: {
    title: 'Wisdom & Service',
    keywords: ['Compassion', 'Vision', 'Generosity'],
    present: 'Number 9 is the number of the humanitarian. You care about the bigger picture and feel a real pull to leave things better than you found them. People sense your generosity and often come to you for perspective when life gets complicated. There is an old-soul quality about you, and you tend to grow wiser through every experience.',
    repeated: 'Several 9s make you deeply idealistic and emotional. You may take on other people\'s pain or find it hard to let go of the past. Learning to protect your own wellbeing lets you keep giving without burning out.',
    missing: 'With 9 missing, the wider view can be harder to reach, and personal concerns may take priority over the needs of others. Letting go of grudges or thinking beyond your own circle may take effort. Small, regular acts of service gradually open this side of you.',
    strengths: 'Compassion, wisdom, vision, generosity',
    watchOut: 'Idealism, emotional heaviness, difficulty letting go',
    career: 'Teaching, medicine, charity work, the arts, counselling, public service',
    relationships: 'Warm and forgiving, but may give more than they receive',
  },
};

export const MISSING_NUMBER_REMEDIES = {
  1: 'Wear red or gold on Sundays and make one small decision each day without asking for approval. Red coral is the traditional stone.',
  2: 'Wear white or silver on Mondays and share one honest feeling with someone close each week. Pearl or moonstone is the traditional stone.',
  3: 'Wear yellow on Thursdays and give your ideas a regular outlet, like writing or teaching. Yellow sapphire or citrine is the traditional stone.',
  4: 'Build a fixed morning routine and use a simple daily checklist. Hessonite (gomed) is the traditional stone.',
  5: 'Wear green on Wednesdays and add one small change to your week, like a new route or hobby. Emerald is the traditional stone.',
  6: 'Wear soft pink or white on Fridays and take on a small caregiving role in your family. Diamond or opal is the traditional stone.',
  7: 'Set aside twenty quiet minutes daily for reflection or reading. Cat\'s eye is the traditional stone.',
  8: 'Wear dark blue on Saturdays and track your spending and savings for one month. Blue sapphire is traditional, best worn only after guidance.',
  9: 'Wear red or coral on Tuesdays and volunteer or mentor someone once a month. Red coral is the traditional stone.',
};

/** Reduce a number to a single digit (1-9) by repeatedly summing its digits. */
function reduceToDigit(n) {
  let value = Math.abs(n);
  while (value > 9) {
    value = String(value).split('').reduce((sum, d) => sum + Number(d), 0);
  }
  return value;
}

/**
 * Calculates the Lo Shu Grid from a birth date, the way it is done in
 * Indian numerology:
 *   1. Every digit 1-9 of the full birth date (DDMMYYYY) is placed in its cell.
 *   2. The Driver number (Mulank = day of birth reduced to a single digit)
 *      is added to the grid.
 *   3. The Conductor number (Bhagyank = all birth-date digits summed and
 *      reduced to a single digit) is added to the grid.
 *   0 is never placed (it has no cell).
 *
 * @param {string} dob - ISO date string, e.g. "1994-07-13"
 * @returns {{ counts, missingNumbers, digitString, dobDigits, driver, conductor } | null}
 */
export function calculateLoShuGrid(dob) {
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;

  const [year, month, day] = dob.split('-');
  const digitString = `${day}${month}${year}`;
  const allDigits = digitString.split('').map(Number);
  const dobDigits = allDigits.filter((d) => d >= 1 && d <= 9);

  const driver = reduceToDigit(Number(day));
  const conductor = reduceToDigit(allDigits.reduce((sum, d) => sum + d, 0));

  const counts = {};
  for (let n = 1; n <= 9; n += 1) counts[n] = 0;
  [...dobDigits, driver, conductor].forEach((d) => { counts[d] += 1; });

  const missingNumbers = Object.entries(counts)
    .filter(([, count]) => count === 0)
    .map(([num]) => Number(num));

  return {
    counts, missingNumbers, digitString, dobDigits, driver, conductor,
    analysis: analyzeLoShuGrid(counts),
  };
}

// ---------------------------------------------------------------------------
// Lines, diagonals (yogas) and overall nature
// ---------------------------------------------------------------------------

export const LINE_DEFINITIONS = [
  // Rows
  { id: 'mental', kind: 'row', name: 'Mental plane', numbers: [4, 9, 2],
    about: 'The top row covers thinking, memory and judgement.',
    complete: 'Your mental plane is complete, so your mind is one of your greatest assets. You think clearly, remember details well and weigh situations before acting. People often turn to you for advice because your judgement feels calm and considered.',
    missing: 'Your mental plane is incomplete, so thinking may sometimes feel scattered. You might forget details, struggle to plan far ahead or second-guess decisions. Writing things down and slowing decisions by even a day tends to help a lot.' },
  { id: 'emotional', kind: 'row', name: 'Emotional plane', numbers: [3, 5, 7],
    about: 'The middle row covers feelings, intuition and balance.',
    complete: 'Your emotional plane is complete, giving you a rare balance between feeling and thinking. You understand your own moods and other people\'s, and your intuition tends to be reliable. This is a source of resilience when life becomes uncertain.',
    missing: 'Your emotional plane is incomplete, so feelings may be hard to read or share. You may seem reserved, or feel things deeply without showing them. Building a habit of naming what you feel, even privately, helps your inner and outer worlds line up.' },
  { id: 'practical', kind: 'row', name: 'Practical plane', numbers: [8, 1, 6],
    about: 'The bottom row covers action, money and everyday results.',
    complete: 'Your practical plane is complete, so you know how to turn plans into results. You handle money, responsibilities and daily routines with confidence. Others see you as someone who makes things actually happen.',
    missing: 'Your practical plane is incomplete, so ideas may stay ideas for longer than you would like. Handling money, deadlines or routine follow-through may need extra effort. A simple system for tracking tasks and spending closes most of this gap.' },
  // Columns
  { id: 'planning', kind: 'column', name: 'Planning plane', numbers: [4, 3, 8],
    about: 'The left column covers thinking things through and organising.',
    complete: 'Your planning plane is complete, which gives you a natural sense of order. You like to think before you act, and you organise your time, ideas and resources well. Projects you plan tend to stay on track.',
    missing: 'Your planning plane is incomplete, so you may act on impulse or delay decisions. Long-term plans may start strongly and fade. Breaking goals into small dated steps gives this area the structure it needs.' },
  { id: 'will', kind: 'column', name: 'Willpower plane', numbers: [9, 5, 1],
    about: 'The centre column covers determination and inner strength.',
    complete: 'Your willpower plane is complete, and that is a powerful combination. You have determination, flexibility and self-belief working together. Once you commit to something, you usually see it through.',
    missing: 'Your willpower plane is incomplete, so your determination may rise and fall. You may need encouragement, a partner or a clear deadline to finish what you start. Choosing one goal at a time and celebrating small wins builds this steadily.' },
  { id: 'action', kind: 'column', name: 'Action plane', numbers: [2, 7, 6],
    about: 'The right column covers execution and follow-through.',
    complete: 'Your action plane is complete, which means feelings, insight and responsibility flow into real action. You are able to start, keep going and follow through, especially for the people and causes you care about.',
    missing: 'Your action plane is incomplete, so you may hesitate to start or lose momentum halfway. Ideas and intentions are there, and they need a push to turn into steps. Starting with a tiny first action, just five minutes, usually breaks the pattern.' },
  // Diagonals
  { id: 'golden', kind: 'diagonal', name: 'Golden Yog', numbers: [4, 5, 6],
    about: 'The 4-5-6 diagonal, traditionally linked with steady progress and stability.',
    complete: 'Your Golden Yog is formed, a combination traditionally linked with steady growth, respect and material stability. It suggests you build your life on solid ground, and that effort tends to be recognised over time.',
    missing: 'The Golden Yog is not formed in your grid. This does not block success, it just means steady progress comes through deliberate effort and patience rather than automatically. Consistency is your best tool.' },
  { id: 'silver', kind: 'diagonal', name: 'Silver Yog', numbers: [2, 5, 8],
    about: 'The 2-5-8 diagonal, traditionally linked with relationships and support.',
    complete: 'Your Silver Yog is formed, a combination traditionally linked with good relationships, helpful people and gains through cooperation. It suggests that the right people tend to appear at the right time.',
    missing: 'The Silver Yog is not formed in your grid. Support from others may not arrive on its own, so it helps to build relationships and trust on purpose. Networks you invest in become your strongest resource.' },
];

// ---------------------------------------------------------------------------
// Life domains: career, health, finances, love
// ---------------------------------------------------------------------------

export const DOMAIN_DEFINITIONS = [
  {
    id: 'career', title: 'Career',
    key: [
      { n: 1, present: 'Natural leadership and the drive to start things', absent: 'Confidence to take charge and put yourself forward' },
      { n: 3, present: 'Strong communication and creative ideas', absent: 'Expressing ideas and promoting your work' },
      { n: 4, present: 'Discipline and reliability in your work', absent: 'Consistent routines and follow-through' },
      { n: 8, present: 'Business sense and comfort with authority', absent: 'Ambition, negotiation and managing resources' },
    ],
    summaries: {
      high: 'Your grid supports a strong professional life. You have both the drive and the discipline to build something lasting.',
      mid: 'Your grid shows real career strengths alongside a few areas to build. Pairing them well can take you far.',
      low: 'Your career strengths are still developing. Skills like leadership, discipline and communication can be built with steady practice.',
    },
  },
  {
    id: 'health', title: 'Health',
    key: [
      { n: 2, present: 'Emotional balance that supports wellbeing', absent: 'Managing stress and emotional ups and downs' },
      { n: 4, present: 'Ability to keep healthy routines', absent: 'Regular sleep, meals and exercise habits' },
      { n: 5, present: 'Good energy, adaptability and overall balance', absent: 'Balance, energy levels and flexibility' },
      { n: 7, present: 'Inner calm and awareness of your body and mind', absent: 'Quiet time and mental rest' },
    ],
    summaries: {
      high: 'Your grid points to good natural balance between body and mind. Keeping your routines steady protects it.',
      mid: 'Your grid shows a fair foundation for wellbeing, with a few habits worth strengthening.',
      low: 'Your grid suggests paying extra attention to routine, rest and stress. Small daily habits make a big difference.',
    },
    note: 'These are general tendencies from numerology, not medical advice.',
  },
  {
    id: 'finances', title: 'Finances',
    key: [
      { n: 1, present: 'Drive to earn on your own terms', absent: 'Taking initiative to grow your income' },
      { n: 4, present: 'Saving discipline and careful planning', absent: 'Budgeting and steady saving' },
      { n: 5, present: 'Spotting new opportunities and adapting to change', absent: 'Flexibility when income or plans change' },
      { n: 8, present: 'Natural feel for money and wealth-building', absent: 'Money management and long-term wealth goals' },
    ],
    summaries: {
      high: 'Your grid supports healthy earning and wealth-building. The key is to keep your habits consistent.',
      mid: 'Your grid shows a workable financial foundation. Strengthening the missing areas gives you more stability.',
      low: 'Money management may need conscious effort in your grid. Tracking and planning are your best allies.',
    },
  },
  {
    id: 'love', title: 'Love',
    key: [
      { n: 2, present: 'Emotional sensitivity and closeness', absent: 'Opening up and asking for support' },
      { n: 3, present: 'Warm, expressive communication', absent: 'Saying what you feel out loud' },
      { n: 6, present: 'Devotion, care and commitment', absent: 'Nurturing and settling into commitment' },
      { n: 9, present: 'Compassion and the ability to forgive', absent: 'Letting go of old hurts and giving freely' },
    ],
    summaries: {
      high: 'Your grid shows a loving, caring nature and the emotional skills that make relationships last.',
      mid: 'Your grid shows real warmth with a few areas to grow. Open communication fills most gaps.',
      low: 'Emotional closeness may take more effort in your grid. Honest conversation and small acts of care go a long way.',
    },
  },
];

export function analyzeDomains(counts) {
  return DOMAIN_DEFINITIONS.map((d) => {
    const present = d.key.filter((k) => counts[k.n] > 0);
    const absent = d.key.filter((k) => counts[k.n] === 0);
    const level = present.length >= 3 ? 'high' : present.length === 2 ? 'mid' : 'low';
    return {
      id: d.id,
      title: d.title,
      note: d.note,
      score: present.length,
      total: d.key.length,
      label: { high: 'Strong', mid: 'Moderate', low: 'Needs attention' }[level],
      level,
      summary: d.summaries[level],
      strengths: present.map((k) => ({ n: k.n, text: k.present })),
      growth: absent.map((k) => ({ n: k.n, text: k.absent })),
    };
  });
}

export function analyzeLoShuGrid(counts) {
  const lines = LINE_DEFINITIONS.map((def) => {
    const missingInLine = def.numbers.filter((n) => counts[n] === 0);
    return {
      ...def,
      isComplete: missingInLine.length === 0,
      missingInLine,
      strength: def.numbers.reduce((sum, n) => sum + counts[n], 0),
      text: missingInLine.length === 0 ? def.complete : def.missing,
    };
  });

  const rows = lines.filter((l) => l.kind === 'row');
  const columns = lines.filter((l) => l.kind === 'column');
  const diagonals = lines.filter((l) => l.kind === 'diagonal');
  const completeRowsCols = [...rows, ...columns].filter((l) => l.isComplete);
  const completeDiagonals = diagonals.filter((l) => l.isComplete);
  const completeCount = completeRowsCols.length + completeDiagonals.length;
  const presentCount = Object.values(counts).filter((c) => c > 0).length;

  const strongest = (list) => list.reduce((a, b) => (b.strength > a.strength ? b : a));
  const weakest = (list) => list.reduce((a, b) => (b.strength < a.strength ? b : a));
  const topRow = strongest(rows);
  const topColumn = strongest(columns);
  const lowRow = weakest(rows);
  const lowColumn = weakest(columns);
  const repeated = Object.entries(counts).filter(([, c]) => c >= 3).map(([n]) => Number(n));

  const missingList = Object.entries(counts).filter(([, c]) => c === 0).map(([n]) => Number(n));

  let title;
  let summary;
  if (completeCount >= 3) {
    title = 'Strong and well-connected';
    summary = 'Your grid forms several complete lines, which is the clearest sign of a well-connected personality. Your thoughts, feelings and actions tend to support one another instead of pulling in different directions. That gives you consistency, and people notice it. The main task for you is to keep using these strengths on purpose rather than taking them for granted.';
  } else if (completeCount >= 1) {
    title = 'Balanced, with clear strengths';
    summary = 'Your grid has at least one complete line, giving you a dependable area of real strength. You can rely on it in difficult moments. Other areas are still open for growth, and the missing numbers point exactly to where effort will pay off most. This is a balanced pattern with plenty of room to develop.';
  } else if (presentCount >= 5) {
    title = 'Varied and still developing';
    summary = 'You carry a wide mix of qualities, but no full line has formed yet. That often means you are versatile and can adapt to many situations, while the different sides of you work more separately than together. Bringing them into alignment takes conscious effort, and once that happens it can feel like a real breakthrough.';
  } else {
    title = 'Focused on a few strengths';
    summary = 'Your grid concentrates on a small set of numbers, which usually means you are exceptionally strong in a few areas and less developed in others. People with this pattern often become known for one or two clear talents. Growth comes from deliberately building the missing numbers, one at a time.';
  }

  const points = [];
  points.push(`Your strongest horizontal area is the ${topRow.name.toLowerCase()}, and your strongest vertical area is the ${topColumn.name.toLowerCase()}. These are the parts of life where things tend to feel natural to you.`);
  if (lowRow.strength < topRow.strength) points.push(`The ${lowRow.name.toLowerCase()} is your weakest horizontal area, so it is the best place to put extra attention.`);
  if (lowColumn.strength < topColumn.strength) points.push(`The ${lowColumn.name.toLowerCase()} is your weakest vertical area, which is where progress may need a little more patience.`);
  points.push(
    counts[5] > 0
      ? 'The centre number 5 is present. It ties the grid together, adds balance and adaptability, and supports both diagonals.'
      : 'The centre number 5 is missing. It sits on both diagonals, one row and one column, so balance and adaptability need conscious effort, and building them lifts several areas at once.',
  );
  if (repeated.length) points.push(`${repeated.join(', ')} appear${repeated.length === 1 ? 's' : ''} three or more times, which makes ${repeated.length === 1 ? 'that trait' : 'those traits'} very strong. It is a great gift, as long as it does not crowd out the quieter numbers.`);
  points.push(
    completeDiagonals.length === 2
      ? 'Both diagonal yogs (Golden and Silver) are formed. This is a rare and favourable combination, traditionally linked with progress and support.'
      : completeDiagonals.length === 1
        ? `The ${completeDiagonals[0].name} is formed, a favourable sign. The other diagonal is not formed, and that area grows through effort.`
        : 'No diagonal yog is formed in your grid. This is common, and it simply means progress comes through steady effort rather than natural momentum.',
  );
  if (missingList.length === 0) {
    points.push('Every number from 1 to 9 is present, which is very rare. It points to a well-rounded personality, so the lesson is balance between the different sides of you.');
  } else {
    points.push(`Your missing ${missingList.length === 1 ? 'number is' : 'numbers are'} ${missingList.join(', ')}. ${missingList.length === 1 ? 'It is' : 'They are'} the clearest guide to where personal growth will feel most rewarding.`);
  }

  return {
    lines, rows, columns, diagonals,
    completeCount, presentCount,
    domains: analyzeDomains(counts),
    overall: { title, summary, points },
  };
}