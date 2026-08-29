/**
 * financeRemedies.js
 * ------------------------------------------------------------
 * Paid "Finance Report" data source (₹99 unlock).
 *
 * DESIGN GOAL: O(1) lookup at request time.
 * Every entry is pre-keyed as a flat string -> object map.
 * No loops, no nested [planet][sign][house] traversal, no .find().
 *
 * Two kinds of keys:
 *   1. house_<HouseNumber>_<Planet>   -> planet sitting in that house
 *   2. lord2_<Planet>                 -> planet that rules the 2nd house (wealth/savings)
 *
 * FIELD CONTRACT (what each key in a remedy object must contain):
 *   theme           -> one-line label for the card header
 *   coreProblem     -> the actual friction/pattern being reported on
 *   practicalRemedy -> a behavior/habit change the person can act on
 *   quickRemedy     -> DONATION remedy (item, day, how) — rendered by the
 *                       UI under the "Donation" / "extras" label
 *   coreRemedy      -> GEMSTONE remedy (stone, general guidance) —
 *                       rendered by the UI under "Gemstone & core solution"
 *                       and, for benefic/neutral placements, under
 *                       "Supporting gemstone remedies"
 *
 * IMPORTANT: coreRemedy and quickRemedy must NEVER contain generic
 * self-help / journaling / mindset tips. They are physical remedies
 * (a stone to wear, an item to donate). Behavioral tips belong ONLY
 * in practicalRemedy.
 *
 * USER-FACING LANGUAGE RULE:
 * None of these strings should surface chart mechanics to the end
 * user — no "functional malefic/benefic", no "2nd house", no
 * "ascendant". Those are internal classification concepts only.
 * Copy should read as plain remedy language ("this pattern",
 * "this placement", "this area of your finances").
 *
 * HOUSES COVERED: 5 (speculation/investments), 6 (debt/loans/expenses),
 * 9 (fortune/luck-driven gains), 10 (career-linked income), 11 (income/gains).
 * All 9 planets (Sun..Ketu) are defined for each of these 5 houses, since
 * any planet can land in any house for a given chart.
 *
 * FUNCTIONAL NATURE GATING:
 * A planet sitting in 5/6/9/10/11 only gets the FULL remedy writeup
 * (theme + core problem + practical + donation + gemstone) if it is a
 * FUNCTIONAL MALEFIC for this ascendant — that's where the actual
 * financial friction lives astrologically. Functional benefics and
 * neutrals for that ascendant are naturally supportive placements,
 * so they only surface the GEMSTONE remedy (coreRemedy) as a
 * reinforcement — no "core problem" framing, since there isn't one
 * to report.
 * ------------------------------------------------------------
 */

import { getFunctionalNature } from './planetaryData';

// ---------- 0. Shared gemstone + donation reference per planet ----------
const GEMSTONE_BY_PLANET = {
  Sun: { stone: "Ruby", metal: "gold or copper", finger: "ring finger", day: "Sunday morning" },
  Moon: { stone: "Pearl", metal: "silver", finger: "little finger", day: "Monday morning" },
  Mars: { stone: "Red Coral", metal: "gold or copper", finger: "ring finger", day: "Tuesday morning" },
  Mercury: { stone: "Emerald", metal: "gold or silver", finger: "little finger", day: "Wednesday morning" },
  Jupiter: { stone: "Yellow Sapphire", metal: "gold", finger: "index finger", day: "Thursday morning" },
  Venus: { stone: "Diamond (or White Sapphire)", metal: "silver or platinum", finger: "middle or ring finger", day: "Friday morning" },
  Saturn: { stone: "Blue Sapphire", metal: "silver or iron", finger: "middle finger", day: "Saturday, after a trial period" },
  Rahu: { stone: "Hessonite (Gomed)", metal: "silver", finger: "middle finger", day: "Saturday evening" },
  Ketu: { stone: "Cat's Eye", metal: "silver", finger: "middle finger", day: "Tuesday" },
};

const DONATION_BY_PLANET = {
  Sun: "On Sundays, donate wheat, jaggery, or copper items — ideally to someone older or in a position of authority.",
  Moon: "On Mondays, donate rice, milk, or white clothing — giving to women or to a place that feeds people works especially well.",
  Mars: "On Tuesdays, donate red lentils, jaggery, or red clothing — giving toward a hospital or blood-donation drive is a strong fit.",
  Mercury: "On Wednesdays, donate green moong dal, green clothing, or books/stationery to a student.",
  Jupiter: "On Thursdays, donate turmeric, chana dal, or yellow clothing — giving to a teacher or place of learning fits this one well.",
  Venus: "On Fridays, donate white clothing, sugar, or curd — giving toward a women's shelter or arts/education cause fits well.",
  Saturn: "On Saturdays, donate black sesame seeds, mustard oil, or iron items — giving to daily-wage workers or the elderly fits this one well.",
  Rahu: "On Saturday evenings, donate mustard oil, blue/black clothing, or a coconut — giving anonymously or to an outsider/foreigner fits this pattern.",
  Ketu: "On Tuesdays, donate multi-coloured clothing, sesame seeds, or a blanket for stray dogs — quiet, no-recognition giving fits this pattern best.",
};

function gemstoneRemedyFor(planet, note) {
  const g = GEMSTONE_BY_PLANET[planet];
  if (!g) return note || "";
  const base = `${g.stone}, worn in ${g.metal} on the ${g.finger}, ideally starting on a ${g.day}.`;
  return note ? `${base} ${note}` : `${base} Get it tested by a jeweller for genuineness and try it for a few weeks before committing long-term.`;
}

function donationRemedyFor(planet, note) {
  const base = DONATION_BY_PLANET[planet] || "";
  return note ? `${base} ${note}` : base;
}

// ---------- 1. Planet-in-House remedies (Finance-relevant houses only) ----------
export const FINANCE_HOUSE_REMEDIES = {
  // ================= 5th House (speculation, investments, intelligence-driven gains) =================
  "house_5_Sun": {
    theme: "You gain financially when you back yourself and take visible, calculated risks",
    coreProblem: "You may take investment or speculative decisions somewhat impulsively when your ego or confidence is high, without always doing the homework first. Losses here can sting your pride more than your wallet, which sometimes makes you double down instead of stepping back.",
    practicalRemedy: "Set a fixed, small percentage of your income as your 'speculation budget' and never exceed it, regardless of how confident you feel about an opportunity.",
    quickRemedy: donationRemedyFor("Sun", "This eases impulsive, ego-driven investment decisions."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support calm, confident investment judgment."),
  },
  "house_5_Moon": {
    theme: "Your investment decisions are more emotionally driven than you'd like to admit",
    coreProblem: "You may buy or sell investments based on mood or a passing feeling of comfort/anxiety rather than a set plan, which can lead to inconsistent results over time.",
    practicalRemedy: "Automate your regular investments (SIPs, recurring transfers) so consistent decisions don't depend on your mood that day.",
    quickRemedy: donationRemedyFor("Moon", "This eases mood-driven investment decisions."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support emotional steadiness in investing."),
  },
  "house_5_Mars": {
    theme: "You're drawn to fast, aggressive investment moves — which can pay off or backfire quickly",
    coreProblem: "You may chase high-risk, high-reward speculative bets with more confidence than caution, and impatience can push you to act before an opportunity is fully vetted.",
    practicalRemedy: "Keep speculative investing in a separate, capped account from your core savings, so a bad streak can't threaten your financial foundation.",
    quickRemedy: donationRemedyFor("Mars", "This eases impulsive, high-risk investment moves."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel investment drive toward disciplined risk-taking."),
  },
  "house_5_Mercury": {
    theme: "You're drawn to analytical, data-driven investment decisions — mostly a strength",
    coreProblem: "You may over-research and second-guess decisions, or spread money across too many small speculative positions instead of committing meaningfully to your best ideas.",
    practicalRemedy: "Pick 2-3 investment theses you believe in most and size those positions properly, rather than diversifying into dozens of small, under-researched bets.",
    quickRemedy: donationRemedyFor("Mercury", "This supports clear, decisive investment analysis."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to sharpen investment judgment."),
  },
  "house_5_Jupiter": {
    theme: "This is a genuinely strong placement for long-term wealth through wisdom and patience",
    coreProblem: "You may be overly optimistic about an investment's prospects, or generous with financial advice/backing to others before your own portfolio is properly established.",
    practicalRemedy: "Favor long-horizon, fundamentally sound investments over speculative short-term bets — patience is your genuine edge here.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports patient, long-term investment growth."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to strengthen long-term investment wisdom."),
  },
  "house_5_Venus": {
    theme: "You may be drawn to investments that feel enjoyable or aesthetically pleasing rather than strategic",
    coreProblem: "You can be tempted by lifestyle-linked speculative investments (luxury goods, trend-driven assets) more for their appeal than their fundamentals, and comfort can make you complacent about reviewing a portfolio.",
    practicalRemedy: "Set a recurring calendar reminder to review your investments — comfort-seeking here can otherwise mean a portfolio drifts unexamined for too long.",
    quickRemedy: donationRemedyFor("Venus", "This supports fundamentals-based investment decisions."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to balance enjoyment with financial discipline."),
  },
  "house_5_Saturn": {
    theme: "Your investment gains are slow-building but tend to be genuinely durable",
    coreProblem: "You may be overly hesitant to take any investment risk at all, potentially missing reasonable opportunities out of excess caution, or feel that speculative gains are 'not for you.'",
    practicalRemedy: "Start with small, low-risk positions to build comfort with investing gradually rather than avoiding it altogether — this pattern rewards showing up consistently over time.",
    quickRemedy: donationRemedyFor("Saturn", "This eases hesitation around reasonable investment risk."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting, powerful stone supporting disciplined, long-term investing — trial it carefully."),
  },
  "house_5_Rahu": {
    theme: "You're drawn to unconventional, high-risk, or trend-driven speculative bets",
    coreProblem: "You may chase speculative fads (crypto, new asset classes, hot tips) with real upside but also real volatility, sometimes without a solid understanding of what you're investing in.",
    practicalRemedy: "Cap unconventional/speculative investments to a small, clearly defined percentage of your total portfolio, regardless of how exciting the opportunity seems.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies volatility in speculative or trend-driven investing."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to unconventional investments."),
  },
  "house_5_Ketu": {
    theme: "You may feel disconnected from active investing, which has both a cost and a protection built in",
    coreProblem: "You might avoid engaging with investment decisions altogether, missing growth opportunities simply through disinterest, though this same detachment also protects you from impulsive speculative losses.",
    practicalRemedy: "A simple, low-maintenance, mostly passive investment approach (index funds, automated contributions) suits this placement better than active trading ever will.",
    quickRemedy: donationRemedyFor("Ketu", "This restores engagement with passive, hands-off investing."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support steady, low-maintenance investment habits."),
  },

  // ================= 6th House (debt, loans, recurring expenses, financial disputes) =================
  "house_6_Sun": {
    theme: "Financial disputes for you often involve authority, ego, or being taken seriously",
    coreProblem: "You may get into disputes over money with people in positions of authority (banks, employers, officials), sometimes escalated by pride rather than the actual amount at stake.",
    practicalRemedy: "Keep financial paperwork and communications with authorities/institutions well-documented — this placement handles a clean, well-evidenced dispute better than an emotional one.",
    quickRemedy: donationRemedyFor("Sun", "This eases ego-driven disputes with authorities over money."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support calm resolution of financial disputes."),
  },
  "house_6_Moon": {
    theme: "Your relationship with debt and expenses fluctuates with your emotional state",
    coreProblem: "You may take on debt or overspend during emotionally low periods as a coping mechanism, without fully registering the financial impact until later.",
    practicalRemedy: "Set a firm rule around any purchase over a certain amount made during a low-mood period: wait 48 hours before finalizing it.",
    quickRemedy: donationRemedyFor("Moon", "This eases emotionally-driven borrowing or overspending."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support emotional steadiness around debt."),
  },
  "house_6_Mars": {
    theme: "You have real ability to fight off financial disputes and debt aggressively, sometimes too aggressively",
    coreProblem: "You may take on debt impulsively to fund a competitive or urgent goal, or get into heated disputes over money that escalate faster than necessary.",
    practicalRemedy: "If you're in a financial dispute, get it documented and handled formally early — this placement handles a clean, structured resolution better than a prolonged fight.",
    quickRemedy: donationRemedyFor("Mars", "This eases impulsive borrowing and heated financial disputes."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to support disciplined, quick debt payoff."),
  },
  "house_6_Mercury": {
    theme: "You tend to have several small debts or recurring expenses rather than one big one",
    coreProblem: "Money can quietly leak through scattered subscriptions, small loans, or minor recurring charges that individually seem trivial but add up meaningfully over time.",
    practicalRemedy: "Consolidate small debts into fewer, clearer obligations where possible, and cancel recurring charges you can't immediately name a use for.",
    quickRemedy: donationRemedyFor("Mercury", "This supports awareness of scattered small debts and expenses."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support clear tracking of recurring expenses."),
  },
  "house_6_Jupiter": {
    theme: "You may lend generously to others before your own financial obligations are handled",
    coreProblem: "You're likely to be too generous with loans or financial help to friends/family, sometimes to your own detriment if those funds aren't returned or your own debts are still outstanding.",
    practicalRemedy: "Set a personal rule about lending — a fixed maximum amount, and treat anything beyond it as a gift you don't expect back, not a loan you're relying on.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports balanced generosity in lending."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support wise limits on financial generosity."),
  },
  "house_6_Venus": {
    theme: "You may take on debt for lifestyle or relationship-related spending more than you realize",
    coreProblem: "You can accumulate debt or recurring expenses tied to comfort, appearance, or pleasing people close to you, and may avoid confronting a growing balance because it's uncomfortable to address.",
    practicalRemedy: "Set a firm limit on relationship or lifestyle-linked spending, and revisit debt balances monthly rather than avoiding the number.",
    quickRemedy: donationRemedyFor("Venus", "This supports confidence in addressing lifestyle-driven debt."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced, comfort-conscious spending."),
  },
  "house_6_Saturn": {
    theme: "Debt for you tends to be long-term and slow to clear, but manageable if handled directly",
    coreProblem: "You may carry debt for a genuinely long time — student loans, a mortgage, an old obligation — with slow progress that can feel discouraging even when it's actually on track.",
    practicalRemedy: "Set up automatic, consistent debt payments rather than relying on motivation-driven extra payments — steady and unglamorous beats occasional large pushes here.",
    quickRemedy: donationRemedyFor("Saturn", "This eases the weight of long-term, slow-clearing debt."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting steady debt payoff — trial it carefully."),
  },
  "house_6_Rahu": {
    theme: "Debt or financial disputes for you can appear suddenly, often tied to unfamiliar or foreign arrangements",
    coreProblem: "You may take on debt through unconventional or unfamiliar financial products, or get pulled into a financial dispute involving unclear terms, sometimes without fully understanding the fine print.",
    practicalRemedy: "Read the full terms of any borrowing arrangement before committing, and keep records of everything — this placement's disputes tend to hinge on details that were unclear upfront.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies confusion around unclear borrowing terms."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring clarity to unconventional financial arrangements."),
  },
  "house_6_Ketu": {
    theme: "You may disengage from tracking debt or expenses, letting small issues go unnoticed",
    coreProblem: "You might avoid confronting a debt or a recurring expense simply because it feels tedious or uninteresting to deal with, which can let a manageable issue quietly grow.",
    practicalRemedy: "Automate debt payments and expense tracking so your natural tendency to disengage doesn't translate into missed payments or forgotten balances.",
    quickRemedy: donationRemedyFor("Ketu", "This restores attention to overlooked debts and expenses."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support consistent expense tracking."),
  },

  // ================= 9th House (fortune, luck-driven gains, father's wealth, higher wisdom) =================
  "house_9_Sun": {
    theme: "Your financial luck tends to be tied to mentors, authority figures, or your father's example",
    coreProblem: "You may depend heavily on validation or backing from an authority figure or father figure for financial confidence, and can feel financially adrift if that support or approval is absent.",
    practicalRemedy: "Build your own independent track record of financial decisions, even small ones, rather than relying primarily on inherited guidance or approval.",
    quickRemedy: donationRemedyFor("Sun", "This supports independent financial confidence apart from authority figures."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to strengthen independent financial judgment."),
  },
  "house_9_Moon": {
    theme: "Your sense of financial security is tied to emotional and family stability",
    coreProblem: "Your financial confidence can rise and fall with how emotionally settled or supported you feel, sometimes leading to conservative decisions during unstable periods and looser ones during secure periods.",
    practicalRemedy: "Build a financial cushion specifically earmarked for emotional security (a clearly labeled emergency fund) — knowing it exists tends to stabilize decisions across the board.",
    quickRemedy: donationRemedyFor("Moon", "This supports steady financial confidence through emotional ups and downs."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support a stable sense of financial security."),
  },
  "house_9_Mars": {
    theme: "Bold financial moves tend to pay off for you, especially ones tied to travel, education, or new ventures",
    coreProblem: "You may act too quickly on a promising-seeming opportunity related to higher education, travel, or a new venture, without doing enough due diligence first.",
    practicalRemedy: "Channel your natural boldness into well-researched bets in growth areas (education, skills, calculated ventures) rather than impulsive ones.",
    quickRemedy: donationRemedyFor("Mars", "This supports bold, well-researched financial opportunities."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to support decisive, well-timed financial action."),
  },
  "house_9_Mercury": {
    theme: "You gain financially through knowledge, higher education, or intellectual pursuits",
    coreProblem: "You may over-analyze fortune-related decisions (further education, publishing, teaching-related income) without committing, or scatter your intellectual pursuits too widely to convert any one into real financial gain.",
    practicalRemedy: "Consider monetizing existing knowledge (writing, courses, consulting) rather than only accumulating more of it — this placement's fortune tends to reward output, not just input.",
    quickRemedy: donationRemedyFor("Mercury", "This supports converting knowledge into real financial gain."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to sharpen financial and intellectual focus."),
  },
  "house_9_Jupiter": {
    theme: "This is one of the most naturally fortunate placements for long-term wealth and higher learning",
    coreProblem: "You may take your good fortune for granted and under-plan financially, assuming things will simply work out, which can mean missed opportunities to actively build on a strong natural foundation.",
    practicalRemedy: "Actively pursue higher education, teaching, publishing, or advisory work — these are unusually strong wealth channels for this specific placement.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports structured planning alongside natural good fortune."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to strengthen long-term fortune and wisdom."),
  },
  "house_9_Venus": {
    theme: "Financial fortune for you is tied to relationships, travel, and creative or luxury-adjacent pursuits",
    coreProblem: "You may associate fortune primarily with comfort or luxury and underinvest in the practical, less glamorous aspects of financial planning.",
    practicalRemedy: "Look for financial or creative opportunities tied to travel, higher education, or the arts — this placement's fortune often flows through those channels specifically.",
    quickRemedy: donationRemedyFor("Venus", "This supports balance between luxury-adjacent fortune and practical saving."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced financial fortune."),
  },
  "house_9_Saturn": {
    theme: "Your financial fortune builds slowly through discipline, not sudden luck",
    coreProblem: "You may feel like you have less natural luck than others in financial matters, when the reality is that your gains simply build through sustained effort rather than sudden windfalls.",
    practicalRemedy: "Pursue long-term education or credentials methodically — this placement's fortune tends to come through earned expertise, not luck, and rewards patience specifically.",
    quickRemedy: donationRemedyFor("Saturn", "This eases doubt about slow-building financial fortune."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting earned, lasting fortune — trial it carefully."),
  },
  "house_9_Rahu": {
    theme: "You may find unconventional or foreign sources of financial fortune",
    coreProblem: "You may chase fortune through foreign markets, unconventional beliefs about money, or higher-risk 'lucky break' thinking, which can create real opportunity but also real volatility.",
    practicalRemedy: "Foreign education, foreign income, or unconventional fields can genuinely be strong for this placement — but always with documented, verifiable structure underneath.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies volatility in foreign or unconventional financial fortune."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to unconventional sources of fortune."),
  },
  "house_9_Ketu": {
    theme: "Conventional ideas of financial luck or fortune don't move you much, and that's workable",
    coreProblem: "You may feel disconnected from the pursuit of traditional 'fortune' (inheritance, luck, higher status), which can look like a lack of ambition but is really just different motivation.",
    practicalRemedy: "Look for quieter, purpose-driven paths to financial stability (research, spiritual or wellness-related work) rather than forcing yourself to chase conventional fortune.",
    quickRemedy: donationRemedyFor("Ketu", "This supports purpose-driven financial paths outside convention."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support quiet, meaningful financial stability."),
  },

  // ================= 10th House (career-linked income and status-based earning) =================
  "house_10_Sun": {
    theme: "Your income is closely tied to visibility and recognition at work",
    coreProblem: "Financial progress for you tends to stall when you don't feel seen or validated at work, even if your actual output hasn't changed — recognition and income are linked more tightly for you than for most.",
    practicalRemedy: "Build a second, independent income source so your financial progress doesn't depend entirely on one employer's recognition of you.",
    quickRemedy: donationRemedyFor("Sun", "This supports visibility and recognition tied to career income."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to strengthen recognition-driven income growth."),
  },
  "house_10_Moon": {
    theme: "Your income and career-linked earnings fluctuate with your emotional engagement in your work",
    coreProblem: "Your income growth can stagnate during periods when work feels emotionally unfulfilling, even if the actual job hasn't changed — motivation and money are closely linked for you here.",
    practicalRemedy: "Look for work with a genuine sense of purpose or people-connection — pure back-office, disconnected roles tend to slow income growth for this placement specifically.",
    quickRemedy: donationRemedyFor("Moon", "This supports steady motivation and income through emotional shifts."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support consistent career-linked income."),
  },
  "house_10_Mars": {
    theme: "You gain income through direct, assertive career moves — negotiating, competing, closing",
    coreProblem: "Impatience with slow-moving corporate income growth (annual reviews, gradual raises) can push you toward impulsive job changes or aggressive asks that aren't always well-timed.",
    practicalRemedy: "Pursue roles or side income with clear, direct financial upside (commission, bonus-linked, results-based) — this placement's income responds well to visible, immediate stakes.",
    quickRemedy: donationRemedyFor("Mars", "This supports well-timed, assertive career and income moves."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to support bold, disciplined income growth."),
  },
  "house_10_Mercury": {
    theme: "Your career-linked income tends to come from several smaller sources rather than one big one",
    coreProblem: "Income can end up scattered across too many small side projects or minor role changes instead of consolidating into meaningful growth in one direction.",
    practicalRemedy: "Consolidate your career-linked efforts into fewer, stronger income sources rather than continuously adding new small ones.",
    quickRemedy: donationRemedyFor("Mercury", "This supports consolidating scattered career income sources."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to sharpen career-linked financial decisions."),
  },
  "house_10_Jupiter": {
    theme: "Your career-linked income grows well through expertise, teaching, or advisory work",
    coreProblem: "You may undercharge or under-negotiate for your actual expertise out of reluctance to self-promote, leaving income on the table relative to your real value.",
    practicalRemedy: "Actively pursue teaching, consulting, or advisory income streams — this placement's income grows disproportionately well through sharing expertise rather than just holding it.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports fair compensation for real expertise."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to strengthen income growth through expertise."),
  },
  "house_10_Venus": {
    theme: "Your career income is tied to creative, relational, or aesthetically-driven work",
    coreProblem: "You may choose career paths based on comfort or likability over financial strategy, potentially leaving income growth on the table in favor of a more pleasant but lower-paying option.",
    practicalRemedy: "Negotiate compensation directly and unemotionally, ideally in writing, since in-person negotiation can be swayed by likability dynamics for this placement.",
    quickRemedy: donationRemedyFor("Venus", "This supports confident, unemotional compensation negotiation."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced career-linked earning."),
  },
  "house_10_Saturn": {
    theme: "Career-linked income grows slowly for you, but tends to be durable once established",
    coreProblem: "You'll likely see slower income growth than peers for a good stretch of your career, which can be discouraging if you're comparing timelines to faster-moving colleagues.",
    practicalRemedy: "Staying in one field or company for 7+ years tends to pay off disproportionately for this placement — frequent switching resets income-growth momentum.",
    quickRemedy: donationRemedyFor("Saturn", "This eases frustration around slow career-linked income growth."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting durable career income — trial it carefully."),
  },
  "house_10_Rahu": {
    theme: "You may find unconventional, fast-moving, or foreign career-linked income opportunities",
    coreProblem: "You may chase a big leap in income (a foreign role, a fast-rising industry, a bold career pivot) without always securing the documented credentials to back it up, risking volatility.",
    practicalRemedy: "Build documented credentials alongside ambitious career moves — this placement's income potential is real, but needs a verifiable foundation to actually stick.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies volatility in ambitious career income leaps."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to bold career moves."),
  },
  "house_10_Ketu": {
    theme: "Conventional career-linked income growth doesn't motivate you much, and that needs a workaround",
    coreProblem: "You may under-prioritize salary negotiation or promotion-chasing because career status doesn't excite you, which can mean income growth stalls simply from disengagement.",
    practicalRemedy: "Automate your savings and investing so your income, even if it grows slowly, is still being put to work — this compensates well for lower engagement with career-climbing.",
    quickRemedy: donationRemedyFor("Ketu", "This supports passive income growth despite low career-status interest."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support steady, low-engagement income growth."),
  },

  // ================= 11th House (income, networks, financial gains) =================
  "house_11_Sun": {
    theme: "Your income and recognition are tied to being seen by the right people",
    coreProblem: "Financial gains for you tend to come through visibility and validation from authority figures or networks — when you feel recognized, opportunities and income follow. When you don't, both can stall, even if your actual work hasn't changed.",
    practicalRemedy: "Build more than one source of income or recognition (a side project, a second skill, a wider network) so you're not entirely dependent on one authority figure's approval for your financial progress.",
    quickRemedy: donationRemedyFor("Sun", "This supports visibility with the people who influence your income and opportunities."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to strengthen recognition-driven income and career gains."),
  },
  "house_11_Moon": {
    theme: "Your income and network grow in waves, tied to how supported you feel",
    coreProblem: "Financial gains and opportunities for you can fluctuate along with your emotional state and your sense of belonging in a group — a strong network one season can feel distant the next, without much actually changing.",
    practicalRemedy: "Nurture a small, steady circle of financial or professional contacts rather than a wide, shallow one — consistency of connection matters more for you than sheer numbers.",
    quickRemedy: donationRemedyFor("Moon", "This supports steady income and networking during emotionally low periods."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support steadier financial confidence through emotional ups and downs."),
  },
  "house_11_Mars": {
    theme: "You gain financially through direct action and competitive drive, not slow networking",
    coreProblem: "Your income growth is tied to bold moves — negotiating, competing for a raise, chasing a deal — but impatience can lead you to act before an opportunity is fully ready, or to burn a useful contact through unnecessary conflict.",
    practicalRemedy: "Channel your drive into a specific, time-bound financial goal (a raise ask, a side income target) rather than generalized restlessness about money.",
    quickRemedy: donationRemedyFor("Mars", "This prevents impatience from damaging financial opportunities or contacts."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to support bold, well-timed financial moves."),
  },
  "house_11_Mercury": {
    theme: "You're likely to have several small income streams rather than one big one",
    coreProblem: "Money comes to you through networking, communication, and trade-type activity, but it's often scattered across too many small streams instead of consolidated into anything substantial.",
    practicalRemedy: "Pick your one or two strongest income streams and actively grow those, rather than adding new small streams. Consolidation, not addition, is what turns this pattern into real money.",
    quickRemedy: donationRemedyFor("Mercury", "This supports consolidating scattered income streams."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support clearer financial decision-making."),
  },
  "house_11_Jupiter": {
    theme: "Money tends to grow for you through knowledge, advice, or teaching",
    coreProblem: "This is a genuinely good placement for financial growth, but you can overestimate how fast money will come in, or give away resources generously before your own base is secure.",
    practicalRemedy: "Set a savings floor you don't touch, and let generosity happen from what's above that line, not below it. Your gains tend to be real and lasting — just protect the foundation while they build.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports financial growth while protecting your own base."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support steady, lasting financial growth."),
  },
  "house_11_Venus": {
    theme: "Income tends to come through relationships, creativity, or things people find appealing",
    coreProblem: "Your financial gains can be tied to networks built on personal fondness rather than pure merit, which works well until a relationship sours or a trend shifts — and you can be tempted to overspend on maintaining a certain lifestyle within that network.",
    practicalRemedy: "Diversify your income sources so you're not solely dependent on one social circle or one aesthetic-driven venture for financial stability.",
    quickRemedy: donationRemedyFor("Venus", "This supports discipline in relationship-driven income and spending."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced financial choices."),
  },
  "house_11_Saturn": {
    theme: "Your income grows slowly, but what you build tends to actually last",
    coreProblem: "You'll likely see slower income growth than peers for a while, which can be genuinely frustrating to watch. The upside is that gains that do arrive for you tend to be stable and durable, not the kind that disappear in a downturn.",
    practicalRemedy: "Favor long-horizon investments and income sources over speculative, fast ones. Patience is genuinely your financial advantage here, even when it doesn't feel like it in the moment.",
    quickRemedy: donationRemedyFor("Saturn", "This eases frustration around slow financial growth."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting durable financial gains — trial it carefully."),
  },
  "house_11_Rahu": {
    theme: "You're drawn to unconventional or fast-moving sources of income",
    coreProblem: "You may chase speculative or trend-driven income opportunities — new markets, foreign income, unconventional ventures — with real upside but also real volatility. Sudden gains can be followed by sudden setbacks if there's no solid foundation underneath.",
    practicalRemedy: "Keep a portion of income in stable, boring instruments even while chasing higher-upside opportunities elsewhere — this placement needs a floor under the ambition.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies volatility in speculative or fast-moving income."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to high-upside income."),
  },
  "house_11_Ketu": {
    theme: "Money and networking don't excite you much, and that itself needs some attention",
    coreProblem: "You may feel disconnected from actively pursuing income growth or building a wide network, which can mean opportunities pass by simply because you didn't engage with them rather than because they weren't available.",
    practicalRemedy: "You don't need to become someone who networks hard, but building one or two low-effort financial habits (automatic saving, a single reliable side income) compensates well for a naturally low interest in active pursuit.",
    quickRemedy: donationRemedyFor("Ketu", "This restores engagement with overlooked income opportunities."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support renewed financial follow-through."),
  },
};

// ---------- 2. 2nd Lord remedies (who RULES the 2nd house — your overall financial pattern) ----------
export const SECOND_LORD_REMEDIES = {
  "lord2_Sun": {
    theme: "Your financial confidence is tied to being recognized and taken seriously",
    coreProblem: "Your sense of financial security depends partly on being validated — by a boss, family, or society — rather than purely on the numbers themselves. This can mean a genuinely stable financial position still feels shaky if you don't feel respected around it.",
    practicalRemedy: "Build your sense of financial security around your own tracked progress (savings rate, net worth trend) rather than around how impressive your finances look to others.",
    quickRemedy: donationRemedyFor("Sun", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Sun", "As your overall wealth-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Suryaya Namah",
  },
  "lord2_Moon": {
    theme: "Your financial habits are closely tied to your emotional state",
    coreProblem: "You may save diligently during emotionally stable periods and spend impulsively during unstable ones, creating an inconsistent financial pattern that isn't really about discipline.",
    practicalRemedy: "Automate your savings so a consistent amount moves away before you see it, protecting your financial progress from mood-driven decisions.",
    quickRemedy: donationRemedyFor("Moon", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Moon", "As your overall wealth-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Chandraya Namah",
  },
  "lord2_Mars": {
    theme: "You gain and spend money decisively — the key is directing that energy well",
    coreProblem: "You may make sudden, assertive financial moves (a big purchase, a bold investment, an impulsive loan) without always pausing to plan first, which can create avoidable financial friction.",
    practicalRemedy: "Direct your natural financial assertiveness toward paying off debt quickly and negotiating hard for income — those are the areas where this energy serves you best.",
    quickRemedy: donationRemedyFor("Mars", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Mars", "As your overall wealth-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Angarakaya Namah",
  },
  "lord2_Mercury": {
    theme: "Your finances are built on analysis, trade, and multiple income streams",
    coreProblem: "Money can end up scattered across too many small accounts, investments, or income sources without a unifying plan, making it hard to see your actual financial picture clearly.",
    practicalRemedy: "Consolidate where possible and maintain one simple master view of your finances, updated regularly, rather than tracking pieces separately.",
    quickRemedy: donationRemedyFor("Mercury", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Mercury", "As your overall wealth-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Budhaya Namah",
  },
  "lord2_Jupiter": {
    theme: "This is one of the most naturally favorable placements for long-term wealth",
    coreProblem: "You may be overly generous or optimistic with money, assuming things will work out, which can mean under-planning for setbacks even while your overall trajectory stays positive.",
    practicalRemedy: "Set clear savings and investment targets rather than relying on general optimism — this placement's natural abundance still benefits from real structure.",
    quickRemedy: donationRemedyFor("Jupiter", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "As your overall wealth-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Brihaspataye Namah",
  },
  "lord2_Venus": {
    theme: "Your finances are closely tied to comfort, relationships, and lifestyle",
    coreProblem: "You may spend to maintain a certain lifestyle or to please people close to you, sometimes before your savings and essential obligations are fully covered.",
    practicalRemedy: "Separate discretionary, comfort-driven spending from essentials in your budget so the two don't quietly blur together.",
    quickRemedy: donationRemedyFor("Venus", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Venus", "As your overall wealth-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Shukraya Namah",
  },
  "lord2_Saturn": {
    theme: "Your wealth builds slowly and steadily, and that's actually the strength of this placement",
    coreProblem: "You may feel behind financially compared to peers for a good stretch of time, which can create real anxiety even when your underlying trajectory is genuinely solid and durable.",
    practicalRemedy: "Automated, disciplined saving and investing suits this placement far better than occasional large, motivated financial pushes.",
    quickRemedy: donationRemedyFor("Saturn", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Saturn", "As your overall wealth-ruling placement, this stone is worth a proper trial period under guidance before committing to regular wear."),
    mantraRemedy: "Om Shanicharaya Namah",
  },
};

/**
 * ---------- 2b. Sign -> Lord map + 2nd-lord derivation ----------
 * O(1) array lookups. No external ephemeris needed — just the
 * ascendant sign, since sign order from ascendant is fixed.
 * NOTE: the 2nd house is always ruled by Sun, Moon, Mars, Mercury,
 * Jupiter, Venus, or Saturn (never Rahu/Ketu, since they don't rule
 * signs), so SECOND_LORD_REMEDIES intentionally has no Rahu/Ketu entry.
 */
const SIGN_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_LORD = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

const SECOND_HOUSE_SIGN_THEMES = {
  Aries: { theme: 'Money grows through initiative, courage, direct action, and independent earning.', strengths: 'Leadership, entrepreneurship, competition, and fast decisions.', watchOut: 'Impulsive spending, risky bets, or financial conflict.', direction: 'Use boldness with a written budget and clear limits.' },
  Taurus: { theme: 'Money grows through stability, tangible assets, patience, and practical value.', strengths: 'Savings, property, food, design, luxury, and dependable skills.', watchOut: 'Comfort spending or resisting necessary change.', direction: 'Build durable assets and let consistency compound.' },
  Gemini: { theme: 'Money grows through communication, trade, technology, analysis, and multiple skills.', strengths: 'Writing, sales, teaching, networking, and adaptable income.', watchOut: 'Scattered accounts, plans, or small income streams.', direction: 'Consolidate your strongest skill into a clear offer.' },
  Cancer: { theme: 'Money is connected to emotional security, family, care, and creating a safe foundation.', strengths: 'Hospitality, public support, food, property, and people-focused work.', watchOut: 'Mood-based spending or carrying family expenses alone.', direction: 'Separate emotional support from financial responsibility.' },
  Leo: { theme: 'Money grows through visibility, leadership, creativity, and confident self-expression.', strengths: 'Management, performance, authority, branding, and original work.', watchOut: 'Lifestyle spending to maintain status or approval.', direction: 'Let measurable results, not image, guide spending.' },
  Virgo: { theme: 'Money grows through service, analysis, systems, health, and careful improvement.', strengths: 'Operations, research, craft, accounting, health, and problem-solving.', watchOut: 'Over-analysis or perfectionism delaying action.', direction: 'Use a simple repeatable system for saving and investing.' },
  Libra: { theme: 'Money grows through partnerships, diplomacy, design, clients, and balanced negotiation.', strengths: 'Consulting, beauty, law, public relations, and collaborative work.', watchOut: 'Spending to please others or unclear shared finances.', direction: 'Put every financial agreement and boundary in writing.' },
  Scorpio: { theme: 'Money grows through depth, strategy, research, transformation, and confidential expertise.', strengths: 'Finance, investigation, psychology, risk, and specialist work.', watchOut: 'Hidden obligations, control struggles, or secrecy around money.', direction: 'Keep records transparent and build a strong emergency reserve.' },
  Sagittarius: { theme: 'Money grows through knowledge, teaching, travel, publishing, law, and wider markets.', strengths: 'Education, international work, advising, and big-picture ventures.', watchOut: 'Overconfidence, over-giving, or spending on expansion too early.', direction: 'Pair optimism with milestones and conservative reserves.' },
  Capricorn: { theme: 'Money grows slowly through discipline, authority, structure, and long-term mastery.', strengths: 'Management, institutions, property, engineering, and durable careers.', watchOut: 'Fear-based hoarding or measuring worth only through wealth.', direction: 'Follow a long-term plan with sustainable targets.' },
  Aquarius: { theme: 'Money grows through networks, technology, innovation, communities, and unconventional work.', strengths: 'Digital products, platforms, social impact, and large networks.', watchOut: 'Volatile experiments or detachment from everyday budgeting.', direction: 'Keep a stable financial base beneath innovative income.' },
  Pisces: { theme: 'Money grows through imagination, healing, compassion, spirituality, and creative service.', strengths: 'Arts, wellness, care, retreats, and behind-the-scenes expertise.', watchOut: 'Blurred boundaries, undercharging, or unclear financial promises.', direction: 'Give creative work a firm price, schedule, and contract.' },
};

const SECOND_LORD_PLACEMENT_REMEDIES = {
  1: { theme: 'Your identity and personal choices directly shape wealth.', remedy: 'Define one clear financial priority and make saving part of your self-image.', action: 'Automate a fixed transfer on every payday.', watchOut: 'Do not spend to prove independence or status.' },
  2: { theme: 'Wealth compounds through speech, savings, family values, and accumulated resources.', remedy: 'Protect your savings and speak clearly about money.', action: 'Review your budget and recurring expenses every month.', watchOut: 'Avoid family pressure or comfort spending draining the base.' },
  3: { theme: 'Money grows through communication, skills, courage, and self-made effort.', remedy: 'Turn one practical skill into a consistent income channel.', action: 'Publish, pitch, or sell one useful offer each week.', watchOut: 'Scattered projects can prevent meaningful accumulation.' },
  4: { theme: 'Wealth is tied to home, property, emotional security, and a stable foundation.', remedy: 'Create a calm financial base before pursuing bigger risks.', action: 'Build an emergency fund and separate household obligations clearly.', watchOut: 'Do not let family emotion replace financial planning.' },
  5: { theme: 'Wealth is influenced by intelligence, creativity, speculation, and calculated risk.', remedy: 'Keep speculation disciplined and separate from essential savings.', action: 'Set a fixed risk budget before making any investment.', watchOut: 'Avoid gambling with money needed for stability.' },
  6: { theme: 'Wealth develops through work, service, debt management, and disciplined routines.', remedy: 'Clear recurring expenses and obligations methodically.', action: 'Automate debt payments and review subscriptions monthly.', watchOut: 'Small leaks and unpaid obligations can quietly compound.' },
  7: { theme: 'Wealth grows through clients, partnerships, trade, and negotiation.', remedy: 'Make shared money arrangements precise and balanced.', action: 'Record scope, payment, and ownership before collaborating.', watchOut: 'Do not rely on goodwill where a contract is needed.' },
  8: { theme: 'Wealth is shaped by shared resources, research, inheritance, and transformation.', remedy: 'Build protection around taxes, debt, insurance, and shared finances.', action: 'Keep a complete record of every long-term obligation.', watchOut: 'Avoid unclear loans or secret financial arrangements.' },
  9: { theme: 'Wealth expands through education, mentors, travel, publishing, and fortunate opportunities.', remedy: 'Invest in knowledge that can become a visible, useful income stream.', action: 'Choose one credential or teaching channel and complete it.', watchOut: 'Do not assume luck will replace planning.' },
  10: { theme: 'Wealth is closely connected to career, authority, reputation, and public results.', remedy: 'Make your professional value measurable and negotiate from evidence.', action: 'Track achievements and review compensation annually.', watchOut: 'Do not let work status dictate every financial decision.' },
  11: { theme: 'Wealth grows through networks, audiences, gains, and multiple opportunities.', remedy: 'Nurture strong connections while consolidating the gains they create.', action: 'Maintain a short list of valuable contacts and follow up consistently.', watchOut: 'Too many opportunities can scatter your money and attention.' },
  12: { theme: 'Wealth is connected to foreign links, remote work, institutions, and hidden expenses.', remedy: 'Make invisible costs and quiet income streams fully measurable.', action: 'Audit subscriptions, transfers, taxes, and overseas costs quarterly.', watchOut: 'Isolation or unclear agreements can lead to leakage.' },
};

/**
 * Given the ascendant sign, returns which sign falls in the 2nd house
 * and which planet rules it (the "2nd Lord" — primary wealth indicator).
 * @param {string} ascendantSign - e.g. "Virgo"
 */
export function getSecondLord(ascendantSign) {
  const startIndex = SIGN_ORDER.indexOf(ascendantSign);
  if (startIndex === -1) return { secondSign: null, secondLordPlanet: null };
  const secondSign = SIGN_ORDER[(startIndex + 1) % 12]; // 2nd house = +1 sign from ascendant
  return { secondSign, secondLordPlanet: SIGN_LORD[secondSign] || null };
}

/**
 * ---------- 3. O(1) Finance Report Builder ----------
 * Pass the user's already-calculated chart data. This does pure
 * object-key lookups — no loops over the whole chart, no filtering.
 *
 * Functional-nature gating:
 *   - MALEFIC placement  -> full remedy (theme, coreProblem, practicalRemedy, quickRemedy/donation, coreRemedy/gemstone)
 *   - BENEFIC or NEUTRAL -> gemstone-only (theme kept for internal use, coreRemedy/gemstone only)
 *
 * @param {Object} planetPositions - e.g. { Sun: { house: 10 }, Saturn: { house: 6 }, ... }
 * @param {string} ascendantSign - e.g. "Virgo" — used to derive the 2nd Lord (O(1)) and functional nature
 * @param {number[]} focusHouses - houses to report on, defaults to [5, 6, 9, 10, 11]
 */
export function getFinanceReport(planetPositions, ascendantSign, focusHouses = [5, 6, 9, 10, 11]) {
  const placements = [];

  if (!planetPositions || !ascendantSign) {
    return { placements: [], secondHouseSign: null, secondHouseTheme: null, secondHouseExpansion: null, secondLord: null, secondLordPlacement: null, secondLordPlacementRemedy: null, secondLordNature: null, secondLordRemedy: null };
  }

  const { secondSign, secondLordPlanet } = getSecondLord(ascendantSign); // O(1)
  const secondLordHouse = planetPositions[secondLordPlanet]?.house || null;

  for (const [planet, pos] of Object.entries(planetPositions || {})) {
    if (!pos || !focusHouses.includes(pos.house)) continue;
    const key = `house_${pos.house}_${planet}`;
    const remedy = FINANCE_HOUSE_REMEDIES[key]; // O(1) hash lookup
    if (!remedy) continue;

    const nature = getFunctionalNature(planet, ascendantSign); // 'benefic' | 'malefic' | 'neutral'
    const isMalefic = nature === 'malefic';

    if (isMalefic) {
      // Problem placement — full writeup
      placements.push({ planet, house: pos.house, nature, ...remedy });
    } else {
      // Benefic or neutral — naturally supportive, gemstone-only reinforcement
      placements.push({
        planet,
        house: pos.house,
        nature,
        theme: remedy.theme,           // kept for internal use only, not necessarily shown
        coreRemedy: remedy.coreRemedy, // gemstone field only — no problem/practical/donation
      });
    }
  }

  const lordKey = `lord2_${secondLordPlanet}`;
  const lordRemedy = SECOND_LORD_REMEDIES[lordKey] || null; // O(1) hash lookup
  const secondLordNature = secondLordPlanet ? getFunctionalNature(secondLordPlanet, ascendantSign) : null;

  return {
    placements,          // array of finance-relevant placements, full or gemstone-only per nature
    secondHouseSign: secondSign,
    secondHouseTheme: SECOND_HOUSE_SIGN_THEMES[secondSign]?.theme || null,
    secondHouseExpansion: SECOND_HOUSE_SIGN_THEMES[secondSign] || null,
    secondLord: secondLordPlanet,
    secondLordPlacement: secondLordHouse,
    secondLordNature,    // exposed for optional internal use — not used to gate the headline
    secondLordRemedy: lordRemedy, // always full — this is the report's backbone regardless of nature
    secondLordPlacementRemedy: SECOND_LORD_PLACEMENT_REMEDIES[secondLordHouse] || null,
  };
}