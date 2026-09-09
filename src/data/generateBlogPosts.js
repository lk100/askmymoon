    // data/generateBlogPosts.js
    // Builds the full blogPosts array by calling every blogGenerators function
    // against astroData.js, then reshapes the output into the site's existing
    // blog post schema (sections/faqs/description/etc).
    //
    // TRIMMED SET: nakshatra-level combinations (planet-in-nakshatra and
    // planet-transit-in-nakshatra) are skipped to cut ~500 low-differentiation
    // pages. Everything else in the 21-category list is generated.

    import { PLANETS, SIGN_ORDER, HOUSES, KARAKAS, YOGAS, DOSHAS } from './astroData';
    import * as gen from '../lib/blogGenerators'; // adjust path to wherever you save blogGenerators.js

    const ALL_PLANETS = Object.keys(PLANETS);
    const CLASSICAL_PLANETS = ALL_PLANETS.filter(k => !['rahu', 'ketu'].includes(k));
    const HOUSE_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    function toPost(raw, index) {
    if (!raw) return null;
    return {
        slug: raw.slug,
        title: raw.title,
        category: raw.category,
        excerpt: raw.excerpt,
        description: raw.excerpt,
        publishedAt: '2026-09-09',
        updatedAt: '2026-09-09',
        readingTime: `${Math.max(4, 5 + (index % 6))} min read`,
        author: 'AskMyMoon',
        keywords: raw.keywords,
        heroImage: 'https://www.askmymoon.com/og-image.jpg',
        sections: raw.content,
        faqs: buildFaqs(raw),
    };
    }

    function buildFaqs(raw) {
    const kw = raw.keywords[0];
    return [
        { question: `What does ${raw.title.replace(/: .*/, '')} mean?`, answer: raw.excerpt },
        { question: `How is ${kw} used in a real chart reading?`, answer: `${kw} is one factor among many \u2014 it's read alongside dignity, aspects, dasha timing, and the rest of the chart before drawing conclusions.` },
        { question: `Does this apply the same way to everyone?`, answer: `No \u2014 the exact degree, sign, and surrounding planetary influences change how ${kw} plays out for each individual chart.` },
    ];
    }

    let posts = [];
    let i = 0;
    const add = (raw) => { const p = toPost(raw, i++); if (p) posts.push(p); };

    // 1. Planet in House
    for (const p of ALL_PLANETS) for (const h of HOUSE_NUMS) add(gen.planetInHouse(p, h));

    // 2. Planet in Nakshatra — SKIPPED (trimmed set)

    // 3. Planet in Sign
    for (const p of ALL_PLANETS) for (const s of SIGN_ORDER) add(gen.planetInSign(p, s));

    // 4. Functional nature of planets by ascendant
    for (const s of SIGN_ORDER) add(gen.functionalNatureByAscendant(s));

    // 5. Meaning of X House
    for (const h of HOUSE_NUMS) add(gen.houseMeaning(h));

    // 6. Meaning of X Planet
    for (const p of ALL_PLANETS) add(gen.planetMeaning(p));

    // 7. Meaning of X Sign
    for (const s of SIGN_ORDER) add(gen.signMeaning(s));

    // 8. Jaimini Karakas
    for (const k of KARAKAS) add(gen.karakaArticle(k.key));

    // 9. Types of Yoga
    add(gen.yogaOverview());
    for (const y of YOGAS) add(gen.yogaArticle(y.name));

    // 10. Types of Dosha
    add(gen.doshaOverview());
    for (const d of DOSHAS) add(gen.doshaArticle(d.name));

    // 11. Importance of Rahu-Ketu axis
    add(gen.rahuKetuAxis());

    // 12. Importance of D9 chart
    add(gen.d9Importance());

    // 13. Transit effect in sign
    for (const p of ALL_PLANETS) for (const s of SIGN_ORDER) add(gen.transitInSign(p, s));

    // 14. Transit effect in house
    for (const p of ALL_PLANETS) for (const h of HOUSE_NUMS) add(gen.transitInHouse(p, h));

    // 15. Transit effect in nakshatra — SKIPPED (trimmed set)

    // 16. Retrograde meaning
    for (const p of CLASSICAL_PLANETS) add(gen.retrogradeMeaning(p));

    // 17. Combustion meaning
    for (const p of CLASSICAL_PLANETS) add(gen.combustionMeaning(p));

    // 18. Permanent friendship table
    add(gen.friendshipTable());

    // 19. Planetary war
    add(gen.planetaryWar());

    // 20 & 21. Aspect number meaning + aspect on house (only planets with special aspects)
    const ASPECT_PLANETS = { mars: [4, 7, 8], jupiter: [5, 7, 9], saturn: [3, 7, 10] };
    for (const [p, aspects] of Object.entries(ASPECT_PLANETS)) {
    for (const a of aspects) add(gen.aspectMeaning(p, a));
    for (const a of aspects) for (const h of HOUSE_NUMS) add(gen.aspectOnHouse(p, a, h));
    }

    // de-dupe by slug
    const seen = new Set();
    posts = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
    });

    export const blogPosts = posts;
    export const blogCategories = [...new Set(blogPosts.map((p) => p.category))];