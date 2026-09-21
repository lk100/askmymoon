    // lib/sunSign.js
    //
    // Lightweight sun sign calculator. No API, no dependencies: every sign is
    // found from the day and month of birth using a small lookup table.
    //
    // Two systems are supported:
    //   - "western": tropical zodiac (the usual newspaper / app sun sign)
    //   - "vedic":   sidereal zodiac (Surya Rashi, used in Indian astrology).
    //                Sign changes fall around the 14th-18th of each month and can
    //                shift by a day from year to year, so treat dates as approximate.

    export const SIGNS = {
    aries: {
        name: 'Aries', vedicName: 'Mesha', glyph: '\u2648', element: 'Fire', modality: 'Cardinal', ruler: 'Mars',
        colour: 'Red', number: 9, tagline: 'The fearless starter',
        personality: 'Aries is the first sign of the zodiac, and it shows. You act on instinct, enjoy a challenge and would rather try and fail than wait and wonder. Your energy is contagious, and people follow you when you commit to a goal. Under the bold surface is a warm, honest heart that forgives quickly.',
        strengths: ['Courage', 'Initiative', 'Honesty', 'Enthusiasm'],
        challenges: ['Impatience', 'Short temper', 'Starting more than you finish'],
        love: 'Passionate and direct in love. You need excitement and a partner who can match your energy.',
        career: 'Thrives in leadership, sales, sports, entrepreneurship and anything fast-moving.',
        money: 'Earns boldly but can spend on impulse. A fixed savings habit protects your gains.',
        health: 'High energy, but prone to burnout and tension headaches. Regular exercise and rest keep you balanced.',
        compatible: ['leo', 'sagittarius', 'gemini'],
    },
    taurus: {
        name: 'Taurus', vedicName: 'Vrishabha', glyph: '\u2649', element: 'Earth', modality: 'Fixed', ruler: 'Venus',
        colour: 'Green and pink', number: 6, tagline: 'The steady builder',
        personality: 'Taurus values comfort, loyalty and things that last. You are patient, practical and hard to rush, and once you decide something you stay the course. You appreciate good food, music and beauty. People rely on you because you keep your word.',
        strengths: ['Patience', 'Reliability', 'Determination', 'Sense of beauty'],
        challenges: ['Stubbornness', 'Resistance to change', 'Possessiveness'],
        love: 'Loyal and sensual. You show love through consistency and need trust to feel secure.',
        career: 'Suited to finance, design, food, real estate and roles that reward steady work.',
        money: 'A natural saver with a good sense of value. Watch overspending on comfort.',
        health: 'Strong stamina, though prone to throat problems and weight gain. Gentle daily movement helps.',
        compatible: ['virgo', 'capricorn', 'cancer'],
    },
    gemini: {
        name: 'Gemini', vedicName: 'Mithuna', glyph: '\u264A', element: 'Air', modality: 'Mutable', ruler: 'Mercury',
        colour: 'Yellow', number: 5, tagline: 'The curious communicator',
        personality: 'Gemini is quick, witty and endlessly curious. You pick up ideas fast, adapt easily and can talk to almost anyone. Your mind is always running, which makes you great at connecting people and information. You need variety to stay engaged.',
        strengths: ['Adaptability', 'Wit', 'Quick learning', 'Sociability'],
        challenges: ['Restlessness', 'Inconsistency', 'Overthinking'],
        love: 'Playful and communicative. You need mental connection and a partner who keeps things interesting.',
        career: 'Shines in media, writing, teaching, marketing, technology and sales.',
        money: 'Can earn from several sources. Needs discipline to keep finances organised.',
        health: 'A busy mind and nervous energy. Good sleep and breathing exercises calm the system.',
        compatible: ['libra', 'aquarius', 'aries'],
    },
    cancer: {
        name: 'Cancer', vedicName: 'Karka', glyph: '\u264B', element: 'Water', modality: 'Cardinal', ruler: 'Moon',
        colour: 'White and silver', number: 2, tagline: 'The caring protector',
        personality: 'Cancer is deeply intuitive and emotionally aware. Home, family and the people you love are your centre, and you protect them fiercely. You remember what matters to others. Your moods follow their own tides, and you need a safe space to recharge.',
        strengths: ['Empathy', 'Loyalty', 'Intuition', 'Nurturing nature'],
        challenges: ['Moodiness', 'Holding on to the past', 'Over-sensitivity'],
        love: 'Devoted and tender. You need emotional security and a partner who is gentle with your feelings.',
        career: 'Fits caregiving, teaching, hospitality, real estate, cooking and counselling.',
        money: 'Careful and security-minded. You tend to save for the family\'s future.',
        health: 'Emotions can affect digestion. Regular meals and healthy emotional outlets keep you steady.',
        compatible: ['scorpio', 'pisces', 'taurus'],
    },
    leo: {
        name: 'Leo', vedicName: 'Simha', glyph: '\u264C', element: 'Fire', modality: 'Fixed', ruler: 'Sun',
        colour: 'Gold and orange', number: 1, tagline: 'The warm-hearted star',
        personality: 'Leo brings warmth, confidence and a flair for the dramatic. You lead naturally and love to celebrate the people around you. Generous and loyal, you give freely and appreciate recognition in return. When you believe in something, you inspire others to believe too.',
        strengths: ['Confidence', 'Generosity', 'Creativity', 'Leadership'],
        challenges: ['Pride', 'Need for attention', 'Stubborn streak'],
        love: 'Romantic and generous. You need admiration and a partner who makes you feel special.',
        career: 'Suited to leadership, entertainment, management, teaching and creative fields.',
        money: 'Earns well and spends generously. Set money aside before treating everyone else.',
        health: 'Strong vitality, with the heart and back worth looking after. Avoid overworking for applause.',
        compatible: ['aries', 'sagittarius', 'libra'],
    },
    virgo: {
        name: 'Virgo', vedicName: 'Kanya', glyph: '\u264D', element: 'Earth', modality: 'Mutable', ruler: 'Mercury',
        colour: 'Green and navy', number: 5, tagline: 'The thoughtful perfectionist',
        personality: 'Virgo is analytical, dependable and quietly caring. You notice details others miss and like things done right. Your help is practical, and you show love by fixing, planning and improving. You hold yourself to high standards, sometimes higher than needed.',
        strengths: ['Attention to detail', 'Practicality', 'Helpfulness', 'Analytical mind'],
        challenges: ['Over-criticism', 'Worry', 'Perfectionism'],
        love: 'Shy at first, then deeply devoted. You need a partner who values reliability.',
        career: 'Excels in healthcare, analysis, editing, research, operations and craftsmanship.',
        money: 'A careful budgeter with a good eye for value.',
        health: 'Worry can affect the stomach. Routine, clean food and relaxation help.',
        compatible: ['taurus', 'capricorn', 'cancer'],
    },
    libra: {
        name: 'Libra', vedicName: 'Tula', glyph: '\u264E', element: 'Air', modality: 'Cardinal', ruler: 'Venus',
        colour: 'Pink and pastel blue', number: 6, tagline: 'The graceful peacemaker',
        personality: 'Libra seeks balance, beauty and fairness in everything. You are diplomatic, charming and good at seeing both sides of an issue. Relationships matter deeply to you, and you work to keep harmony around you. Decisions can take time because you weigh everything carefully.',
        strengths: ['Diplomacy', 'Charm', 'Fairness', 'Aesthetic sense'],
        challenges: ['Indecision', 'Avoiding conflict', 'People-pleasing'],
        love: 'Romantic and partnership-minded. You need harmony and a partner who values fairness.',
        career: 'Fits law, design, mediation, HR, fashion and public relations.',
        money: 'Enjoys nice things. A clear budget prevents impulse purchases.',
        health: 'Balance is key. Watch stress from conflict and keep a steady sleep routine.',
        compatible: ['gemini', 'aquarius', 'leo'],
    },
    scorpio: {
        name: 'Scorpio', vedicName: 'Vrischika', glyph: '\u264F', element: 'Water', modality: 'Fixed', ruler: 'Mars',
        colour: 'Maroon and black', number: 9, tagline: 'The intense strategist',
        personality: 'Scorpio is deep, focused and quietly powerful. You feel strongly, see through pretence and are not afraid of difficult truths. Loyalty runs deep, and so does your memory of betrayal. Once you commit to a goal, few things can stop you.',
        strengths: ['Determination', 'Insight', 'Loyalty', 'Resourcefulness'],
        challenges: ['Jealousy', 'Secrecy', 'Holding grudges'],
        love: 'Intense and committed. You need trust and complete honesty from a partner.',
        career: 'Suited to research, investigation, medicine, finance, psychology and strategy.',
        money: 'Strong instinct for investing and managing resources.',
        health: 'Emotional intensity can build up. Physical exercise and honest conversation release it.',
        compatible: ['cancer', 'pisces', 'virgo'],
    },
    sagittarius: {
        name: 'Sagittarius', vedicName: 'Dhanu', glyph: '\u2650', element: 'Fire', modality: 'Mutable', ruler: 'Jupiter',
        colour: 'Yellow and purple', number: 3, tagline: 'The free-spirited explorer',
        personality: 'Sagittarius is optimistic, adventurous and always looking at the bigger picture. You love learning, travelling and honest conversations. Your enthusiasm lifts people, and you rarely stay down for long. Freedom is essential to you, and you dislike being boxed in.',
        strengths: ['Optimism', 'Honesty', 'Adventurousness', 'Broad outlook'],
        challenges: ['Bluntness', 'Restlessness', 'Overpromising'],
        love: 'Fun-loving and sincere. You need freedom and a partner who shares your curiosity.',
        career: 'Fits teaching, travel, publishing, law, sports and international work.',
        money: 'Generous and hopeful about money. Plan for the long term, not just the next trip.',
        health: 'Active and energetic. Look after hips and thighs, and avoid overindulgence.',
        compatible: ['aries', 'leo', 'aquarius'],
    },
    capricorn: {
        name: 'Capricorn', vedicName: 'Makara', glyph: '\u2651', element: 'Earth', modality: 'Cardinal', ruler: 'Saturn',
        colour: 'Dark blue and brown', number: 8, tagline: 'The disciplined climber',
        personality: 'Capricorn is ambitious, patient and responsible. You set long-term goals and work toward them steadily, often quietly. People see you as mature and dependable, and you tend to grow more confident with age. Under the serious exterior is a dry sense of humour.',
        strengths: ['Discipline', 'Ambition', 'Responsibility', 'Patience'],
        challenges: ['Workaholic tendencies', 'Pessimism', 'Difficulty relaxing'],
        love: 'Reserved but deeply loyal. You need a partner who respects your goals.',
        career: 'Excels in management, engineering, finance, government and building businesses.',
        money: 'An excellent long-term planner and saver.',
        health: 'Joint stiffness and stress from overwork are common. Schedule real rest.',
        compatible: ['taurus', 'virgo', 'scorpio'],
    },
    aquarius: {
        name: 'Aquarius', vedicName: 'Kumbha', glyph: '\u2652', element: 'Air', modality: 'Fixed', ruler: 'Saturn',
        colour: 'Electric blue', number: 4, tagline: 'The original thinker',
        personality: 'Aquarius is independent, inventive and a little ahead of its time. You think differently, care about fairness and enjoy ideas more than convention. You are friendly to many yet keep a private inner world. When you believe in a cause, you work hard for it.',
        strengths: ['Originality', 'Independence', 'Humanitarian outlook', 'Intellect'],
        challenges: ['Emotional distance', 'Stubborn opinions', 'Unpredictability'],
        love: 'Friendship comes first. You need space, intellect and a partner who accepts your individuality.',
        career: 'Suited to technology, science, social causes, research and innovation.',
        money: 'Prefers unconventional ways of earning. Keep a basic savings plan in place.',
        health: 'Circulation and nerves may need attention. Regular movement and screen breaks help.',
        compatible: ['gemini', 'libra', 'sagittarius'],
    },
    pisces: {
        name: 'Pisces', vedicName: 'Meena', glyph: '\u2653', element: 'Water', modality: 'Mutable', ruler: 'Jupiter',
        colour: 'Sea green and lavender', number: 7, tagline: 'The dreamy empath',
        personality: 'Pisces is imaginative, compassionate and deeply intuitive. You absorb the feelings around you and often understand people without being told. Creativity and spirituality come naturally. You need quiet time and creative outlets to stay balanced.',
        strengths: ['Compassion', 'Imagination', 'Intuition', 'Adaptability'],
        challenges: ['Escapism', 'Over-sensitivity', 'Weak boundaries'],
        love: 'Romantic and selfless. You need emotional depth and a partner who is kind.',
        career: 'Fits arts, music, healing, counselling, spirituality and charity work.',
        money: 'Generous to a fault. Clear boundaries and a budget protect you.',
        health: 'Sensitive to stress and surroundings. Rest, water and creative time restore you.',
        compatible: ['cancer', 'scorpio', 'capricorn'],
    },
    };

    export const SIGN_ORDER = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
    ];

    // Start date [month, day] of each sign, listed in calendar order from 1 January.
    const STARTS = {
    western: [
        [1, 20, 'aquarius'], [2, 19, 'pisces'], [3, 21, 'aries'], [4, 20, 'taurus'],
        [5, 21, 'gemini'], [6, 21, 'cancer'], [7, 23, 'leo'], [8, 23, 'virgo'],
        [9, 23, 'libra'], [10, 23, 'scorpio'], [11, 22, 'sagittarius'], [12, 22, 'capricorn'],
    ],
    vedic: [
        [1, 14, 'capricorn'], [2, 13, 'aquarius'], [3, 14, 'pisces'], [4, 14, 'aries'],
        [5, 15, 'taurus'], [6, 15, 'gemini'], [7, 16, 'cancer'], [8, 17, 'leo'],
        [9, 17, 'virgo'], [10, 18, 'libra'], [11, 17, 'scorpio'], [12, 16, 'sagittarius'],
    ],
    };

    const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /** Day-of-year using a leap year, so every calendar date has a fixed position. */
    function dayOfYear(month, day) {
    return Math.round((Date.UTC(2000, month - 1, day) - Date.UTC(2000, 0, 1)) / 86400000);
    }

    /** True when year-month-day is a real calendar date (rejects 31 Apr, 29 Feb 2001...). */
    export function isValidDate(year, month, day) {
    const d = new Date(Date.UTC(year, month - 1, day));
    return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
    }

    /** "21 Mar - 19 Apr" style range for a sign in the given system. */
    export function getSignDates(key, system = 'western') {
    const list = STARTS[system];
    const i = list.findIndex((s) => s[2] === key);
    const [sm, sd] = list[i];
    const [nm, nd] = list[(i + 1) % list.length];
    const end = new Date(Date.UTC(2000, nm - 1, nd - 1));
    return `${sd} ${MONTH_SHORT[sm - 1]} - ${end.getUTCDate()} ${MONTH_SHORT[end.getUTCMonth()]}`;
    }

    /**
     * Finds the sun sign for a birth date.
     * @param {string} dob    ISO date, e.g. "2003-07-13"
     * @param {'western'|'vedic'} system
     * @returns {null | { key, sign, system, dates, cusp }}
     *   cusp is null, or { key, sign } for the neighbouring sign when the birth
     *   date is within 2 days of a sign change.
     */
    export function calculateSunSign(dob, system = 'western') {
    if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
    const [y, m, d] = dob.split('-').map(Number);
    if (!isValidDate(y, m, d)) return null;

    const list = STARTS[system] || STARTS.western;
    const code = m * 100 + d;

    let idx = list.length - 1; // dates before the first start belong to the last sign
    list.forEach(([sm, sd], i) => { if (code >= sm * 100 + sd) idx = i; });

    const [sm, sd, key] = list[idx];
    const [nm, nd, nextKey] = list[(idx + 1) % list.length];
    const prevKey = list[(idx + list.length - 1) % list.length][2];

    const today = dayOfYear(m, d);
    const sinceStart = (today - dayOfYear(sm, sd) + 366) % 366;
    const untilNext = (dayOfYear(nm, nd) - today + 366) % 366;

    let cusp = null;
    if (untilNext <= 2) cusp = { key: nextKey, sign: SIGNS[nextKey] };
    else if (sinceStart <= 1) cusp = { key: prevKey, sign: SIGNS[prevKey] };

    return { key, sign: SIGNS[key], system, dates: getSignDates(key, system), cusp };
    }