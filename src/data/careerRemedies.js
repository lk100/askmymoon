/**
 * careerRemedies.js
 * ------------------------------------------------------------
 * Paid "Career Report" data source (₹99 unlock).
 *
 * DESIGN GOAL: O(1) lookup at request time.
 * Every entry is pre-keyed as a flat string -> object map.
 * No loops, no nested [planet][sign][house] traversal, no .find().
 *
 * Two kinds of keys:
 *   1. house_<HouseNumber>_<Planet>   -> planet sitting in that house
 *   2. lord10_<Planet>                -> planet that rules the 10th house
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
 * user — no "functional malefic/benefic", no "10th house", no
 * "ascendant". Those are internal classification concepts only.
 * Copy should read as plain remedy language ("this pattern",
 * "this placement", "this area of your career").
 *
 * FUNCTIONAL NATURE GATING:
 * A planet sitting in 6/10/11 only gets the FULL remedy writeup
 * (theme + core problem + practical + donation + gemstone) if it is
 * a functional malefic for this ascendant — that's where the actual
 * friction/problem lives astrologically. Functional benefics and
 * neutrals for that ascendant are naturally supportive placements,
 * so they only surface the GEMSTONE remedy (coreRemedy) as a
 * reinforcement — no "core problem" framing, since there isn't one
 * to report.
 * ------------------------------------------------------------
 */

import { getFunctionalNature } from './planetaryData';

// ---------- 0. Shared gemstone + donation reference per planet ----------
// Used to keep coreRemedy / quickRemedy copy consistent everywhere a
// planet shows up, without repeating the stone name by hand in every
// single entry. Carat/weight is intentionally left general — that
// depends on the person's overall chart strength, not just this one
// placement, so we give safe general guidance rather than a specific
// number.
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

// ---------- 1. Planet-in-House remedies (Career-relevant houses only) ----------
export const CAREER_HOUSE_REMEDIES = {
  // ================= Main career pattern =================
  "house_10_Sun": {
    theme: "You want to lead, and you want to be recognized for it",
    coreProblem: "You tend to clash with bosses or senior people, especially if you feel your effort isn't being noticed. This can come from actually being right, but also from taking things personally too quickly — a manager's neutral comment can feel like a personal attack. Over time this creates a pattern where you burn bridges with exactly the people who could promote you.",
    practicalRemedy: "Take on visible responsibility in small doses rather than demanding recognition all at once. Volunteer to lead one meeting or one small project, do it well, and let the recognition build naturally instead of chasing it.",
    quickRemedy: donationRemedyFor("Sun", "This eases friction with authority figures and softens ego-driven conflict at work."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to strengthen confidence and standing with authority figures."),
  },
  "house_10_Moon": {
    theme: "Your career mood shifts a lot, and that's normal for you — not a flaw",
    coreProblem: "Your motivation and confidence at work rise and fall with your emotional state more than most people's. On a good week you're brilliant; on a bad week even simple tasks feel heavy. This can look like inconsistency to others even though your actual skill hasn't changed.",
    practicalRemedy: "Build a loose daily routine (same start time, same first task) so your work doesn't depend entirely on your mood that day. Structure acts as a floor under you on the bad days.",
    quickRemedy: donationRemedyFor("Moon", "This is traditionally used to steady emotional highs and lows that spill into work."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is associated with calming emotional volatility and steadying mood-driven decisions."),
  },
  "house_10_Mars": {
    theme: "You have real drive, but you get impatient with slow-moving people and systems",
    coreProblem: "You want progress now, and corporate slowness — approvals, meetings about meetings, bureaucracy — genuinely frustrates you. This impatience can come across as aggression even when you don't mean it that way, and it can put you at odds with colleagues who move at a different pace.",
    practicalRemedy: "Find an outlet for your competitive energy outside of office politics — sports, a fitness goal, or a personal project with clear targets. This takes the pressure off needing every workplace interaction to be a win.",
    quickRemedy: donationRemedyFor("Mars", "This is traditionally used to cool sudden anger and reduce conflict-driven setbacks at work."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel drive productively instead of into conflict."),
  },
  "house_10_Mercury": {
    theme: "You're good at a lot of things, which is both your strength and your trap",
    coreProblem: "Because you pick up skills quickly, you're tempted to keep exploring new directions instead of going deep in one. This can mean you're 'good at everything, expert at nothing' by your 30s, which limits how far you can rise in any single field.",
    practicalRemedy: "Give yourself permission to say no to interesting side opportunities for a defined period (say, 2 years) so you can build real depth in one lane. You can always widen out again later — depth first.",
    quickRemedy: donationRemedyFor("Mercury", "This is traditionally used to sharpen focus and decision-making around which path to commit to."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support clarity, communication, and focused thinking."),
  },
  "house_10_Jupiter": {
    theme: "You do well in roles built on advice, teaching, or expertise — but you take on too much",
    coreProblem: "You're the person others come to for guidance, which is a real strength, but you say yes to too many extra responsibilities and end up spread thin. Recognition tends to come later than you'd like — you're often underpaid or under-titled relative to your actual knowledge, for a while.",
    practicalRemedy: "Pick one area of expertise and become genuinely excellent at explaining it — writing, teaching, or mentoring. Recognition in your case tends to follow visible expertise, and staying quiet about what you know slows it down.",
    quickRemedy: donationRemedyFor("Jupiter", "This is traditionally used to accelerate recognition and open doors through mentors and senior figures."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to strengthen recognition, wisdom, and long-term career growth."),
  },
  "house_10_Venus": {
    theme: "You want work that feels good, not just work that pays",
    coreProblem: "You're drawn to roles and decisions based on how pleasant or aesthetically satisfying they are, sometimes over what's actually strategic. Office relationships can also blur into personal territory, which occasionally creates complications.",
    practicalRemedy: "Separate 'do I like this person' from 'is this the right professional decision' when making calls about who to work with or promote. Write pros/cons on paper — it's harder to let personal fondness quietly tip the scale that way.",
    quickRemedy: donationRemedyFor("Venus", "This is traditionally used to bring more discipline into decisions that are currently being led by comfort or likability."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced judgment in career and workplace relationships."),
  },
  "house_10_Saturn": {
    theme: "Your career rewards are real, but they arrive later than you'd like",
    coreProblem: "You likely feel behind compared to peers for a good chunk of your career — more workload, less applause. The frustrating part is this isn't really about ability; it's about the shape of the timeline. People with this placement often peak later than average but with more durable, long-term success.",
    practicalRemedy: "Track your own long-term milestones (skills gained, responsibility earned) rather than expecting frequent praise. Staying in one place or field for 7+ years tends to pay off disproportionately for this pattern — job-hopping resets the clock.",
    quickRemedy: donationRemedyFor("Saturn", "This is traditionally used to ease delays and heavy workload without changing your effort or ability."),
    coreRemedy: gemstoneRemedyFor("Saturn", "This is a slower-acting, powerful stone — start with a short trial period before wearing it regularly, and only after testing it suits you."),
  },
  "house_10_Rahu": {
    theme: "You're drawn to unconventional, fast-moving, or newer fields",
    coreProblem: "You may feel pulled toward foreign opportunities, new industries, or fast-rising fields, sometimes chasing status or a big leap rather than steady footing. Reputation can be volatile — quick wins followed by setbacks — if the foundation isn't solid.",
    practicalRemedy: "Build documented credentials as you go — certifications, a portfolio, visible project outcomes. Ambition serves you well here, but only when it's backed by something concrete other people can verify.",
    quickRemedy: donationRemedyFor("Rahu", "This is traditionally used to steady sudden swings in reputation and reduce impulsive career leaps."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring more grounding and stability to ambitious, fast-moving career moves."),
  },
  "house_10_Ketu": {
    theme: "Conventional recognition doesn't excite you much, and that's fine",
    coreProblem: "You may feel disconnected from typical career ladder thinking — promotions and titles don't motivate you the way they do others. This can look like a lack of ambition to outsiders, when really it's that you need a different kind of motivation: purpose, not prestige.",
    practicalRemedy: "Look for roles connected to research, healing, or something behind-the-scenes that genuinely matters to you, rather than forcing yourself into a highly visible, front-facing career track that will drain you.",
    quickRemedy: donationRemedyFor("Ketu", "This is traditionally used to restore a sense of direction when motivation feels disconnected from conventional career goals."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to sharpen focus and restore a sense of purpose in career decisions."),
  },

  // ================= Daily work, coworkers, workload =================
  "house_6_Sun": {
    theme: "You tend to clash with coworkers, not bosses, over who's really in charge",
    coreProblem: "In day-to-day work you can get into friction with peers or subordinates, often around ego or being taken seriously. This can quietly wear you down over time — you're carrying more workplace stress than you let on.",
    practicalRemedy: "Get in the habit of resolving small disagreements one-on-one before they turn into group drama. Handled early and privately, most workplace friction with you resolves quickly.",
    quickRemedy: donationRemedyFor("Sun", "This is traditionally used to ease ego-driven friction with coworkers and reduce day-to-day tension."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to steady confidence in daily workplace interactions."),
  },
  "house_6_Moon": {
    theme: "You absorb other people's stress at work more than you realize",
    coreProblem: "If your job involves caregiving, support, or just being around people a lot, you likely take on their emotional weight without noticing. This often shows up as tiredness or stomach/digestive issues that don't have an obvious physical cause.",
    practicalRemedy: "Set a clear boundary around when work stress is allowed to follow you home — for example, no work messages after a set hour. This protects the parts of you that would otherwise be constantly 'on.'",
    quickRemedy: donationRemedyFor("Moon", "This is traditionally used to ease the emotional weight of a caregiving or high-contact daily role."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to protect emotional energy in people-heavy daily work."),
  },
  "house_6_Mars": {
    theme: "You're built for competitive environments, but they can also drain you through conflict",
    coreProblem: "You have real ability to outperform rivals and win competitive situations, but this same energy makes you prone to disputes — with coworkers, sometimes even legally. Overwork paired with unresolved conflict is where this tends to hit hardest.",
    practicalRemedy: "In roles with clear, structured competition (targets, rankings, sports-like structures), you tend to do very well. Avoid roles that are competitive in a vague, political way with no clear rules.",
    quickRemedy: donationRemedyFor("Mars", "This is traditionally used to cool workplace disputes before they escalate into something formal."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel competitive drive without tipping into unnecessary conflict."),
  },
  "house_6_Mercury": {
    theme: "You handle workplace friction through talk, not confrontation — which mostly works",
    coreProblem: "Day-to-day disputes with coworkers tend to come from miscommunication or overthinking small remarks rather than any real conflict. You can also take on too many small tasks and admin work because you're quick and reliable, which quietly overloads you.",
    practicalRemedy: "Get comfortable saying 'I can't take this on right now' — your reliability at small tasks tends to attract more of them than is good for you long-term.",
    quickRemedy: donationRemedyFor("Mercury", "This is traditionally used to clear up communication-based misunderstandings at work."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support clear, low-friction communication with coworkers."),
  },
  "house_6_Jupiter": {
    theme: "You're the one coworkers come to for advice, even in day-to-day friction",
    coreProblem: "You end up mediating other people's workplace disputes more than your own, which can be draining even though you're good at it. You may also over-extend patience with underperforming colleagues out of a sense of fairness.",
    practicalRemedy: "Set a limit on how much informal mentoring or mediating you do in a week. Being generous with your time is a real strength here, but it needs a boundary or it quietly becomes unpaid extra work.",
    quickRemedy: donationRemedyFor("Jupiter", "This is traditionally used to protect your own energy while you continue supporting others at work."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support wise boundary-setting alongside natural generosity."),
  },
  "house_6_Venus": {
    theme: "You keep the peace at work, sometimes at your own cost",
    coreProblem: "You tend to avoid necessary conflict with coworkers to keep things pleasant, which can let small issues fester until they become bigger problems. You may also take on extra tasks for people you like, even when it isn't reciprocated.",
    practicalRemedy: "Practice raising a small disagreement early and calmly, rather than letting your natural preference for harmony delay it until it's unavoidable.",
    quickRemedy: donationRemedyFor("Venus", "This is traditionally used to bring more confidence into addressing conflict you'd normally avoid."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support smoother, more balanced workplace relationships."),
  },
  "house_6_Saturn": {
    theme: "You have real staying power in demanding jobs — this is actually a strength",
    coreProblem: "You can handle a heavy, grinding workload better than most people, which is genuinely valuable — but it also means you're prone to just quietly enduring exhaustion instead of addressing it. Job security tends to be strong for you here, but at the cost of feeling stuck in a routine.",
    practicalRemedy: "Since stability is naturally strong for you, use that security as a base to build new skills or slowly push for better conditions, rather than just tolerating a grind indefinitely.",
    quickRemedy: donationRemedyFor("Saturn", "This is traditionally used to ease the burden of a heavy daily workload."),
    coreRemedy: gemstoneRemedyFor("Saturn", "This is a slower-acting, powerful stone — start with a short trial period before wearing it regularly."),
  },
  "house_6_Rahu": {
    theme: "Workplace conflict for you often involves outsiders, technology, or unclear rules",
    coreProblem: "Disputes at work can flare up suddenly and feel disproportionate — often involving new systems, foreign colleagues or clients, or situations with no established process to fall back on. This can create anxiety around workplace politics you don't fully see coming.",
    practicalRemedy: "Document unusual disputes as they happen rather than relying on memory later — this placement benefits from a clear paper trail when things get messy.",
    quickRemedy: donationRemedyFor("Rahu", "This is traditionally used to steady sudden, hard-to-predict workplace conflicts."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring more clarity to confusing or ambiguous workplace situations."),
  },
  "house_6_Ketu": {
    theme: "You disengage from workplace politics rather than fight them, and that mostly serves you",
    coreProblem: "You may feel detached from daily office conflict, which protects you from a lot of drama but can also mean real issues go unaddressed because you'd rather not engage. Health or energy can dip when work feels meaningless rather than from direct conflict.",
    practicalRemedy: "Even with a naturally detached style, pick the handful of workplace issues that actually affect your role and address those directly rather than letting everything slide.",
    quickRemedy: donationRemedyFor("Ketu", "This is traditionally used to restore energy when day-to-day work starts to feel disengaged or draining."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support engagement and follow-through on issues you'd normally let slide."),
  },

  // ================= Income, networks, career payoff =================
  "house_11_Sun": {
    theme: "Your income and recognition are tied to being seen by the right people",
    coreProblem: "Financial gains for you tend to come through visibility and validation from authority figures or networks — when you feel recognized, opportunities and income follow. When you don't, both can stall, even if your actual work hasn't changed.",
    practicalRemedy: "Build more than one source of income or recognition (a side project, a second skill, a wider network) so you're not entirely dependent on one authority figure's approval for your financial progress.",
    quickRemedy: donationRemedyFor("Sun", "This is traditionally used to improve visibility with the people who influence your income and opportunities."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to strengthen recognition-driven income and career gains."),
  },
  "house_11_Moon": {
    theme: "Your income and network grow in waves, tied to how supported you feel",
    coreProblem: "Financial gains and opportunities for you can fluctuate along with your emotional state and your sense of belonging in a group — a strong network one season can feel distant the next, without much actually changing.",
    practicalRemedy: "Nurture a small, steady circle of financial or professional contacts rather than a wide, shallow one — consistency of connection matters more for you than sheer numbers.",
    quickRemedy: donationRemedyFor("Moon", "This is traditionally used to steady income and networking during emotionally low periods."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support steadier financial confidence through emotional ups and downs."),
  },
  "house_11_Mars": {
    theme: "You gain financially through direct action and competitive drive, not slow networking",
    coreProblem: "Your income growth is tied to bold moves — negotiating, competing for a raise, chasing a deal — but impatience can lead you to act before an opportunity is fully ready, or to burn a useful contact through unnecessary conflict.",
    practicalRemedy: "Channel your drive into a specific, time-bound financial goal (a raise ask, a side income target) rather than generalized restlessness about money.",
    quickRemedy: donationRemedyFor("Mars", "This is traditionally used to prevent impatience from damaging financial opportunities or contacts."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to support bold, well-timed financial moves."),
  },
  "house_11_Mercury": {
    theme: "You're likely to have several small income streams rather than one big one",
    coreProblem: "Money comes to you through networking, communication, and trade-type activity, but it's often scattered across too many small streams instead of consolidated into anything substantial.",
    practicalRemedy: "Pick your one or two strongest income streams and actively grow those, rather than adding new small streams. Consolidation, not addition, is what turns this pattern into real money.",
    quickRemedy: donationRemedyFor("Mercury", "This is traditionally used to bring more clarity and focus to a scattered set of income streams."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support clearer financial decision-making and negotiation."),
  },
  "house_11_Jupiter": {
    theme: "Money tends to grow for you through knowledge, advice, or teaching",
    coreProblem: "This is a genuinely good placement for financial growth, but you can overestimate how fast money will come in, or give away resources generously before your own base is secure.",
    practicalRemedy: "Set a savings floor you don't touch, and let generosity happen from what's above that line, not below it. Your gains tend to be real and lasting — just protect the foundation while they build.",
    quickRemedy: donationRemedyFor("Jupiter", "This is traditionally used to accelerate financial growth while helping protect your own base first."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support steady, lasting financial growth."),
  },
  "house_11_Venus": {
    theme: "Income tends to come through relationships, creativity, or things people find appealing",
    coreProblem: "Your financial gains can be tied to networks built on personal fondness rather than pure merit, which works well until a relationship sours or a trend shifts — and you can be tempted to overspend on maintaining a certain lifestyle within that network.",
    practicalRemedy: "Diversify your income sources so you're not solely dependent on one social circle or one aesthetic-driven venture for financial stability.",
    quickRemedy: donationRemedyFor("Venus", "This is traditionally used to bring more discipline to relationship-driven income and spending."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced, sustainable financial choices."),
  },
  "house_11_Saturn": {
    theme: "Your income grows slowly, but what you build tends to actually last",
    coreProblem: "You'll likely see slower income growth than peers for a while, which can be genuinely frustrating to watch. The upside is that gains that do arrive for you tend to be stable and durable, not the kind that disappear in a downturn.",
    practicalRemedy: "Favor long-horizon investments and income sources over speculative, fast ones. Patience is genuinely your financial advantage here, even when it doesn't feel like it in the moment.",
    quickRemedy: donationRemedyFor("Saturn", "This is traditionally used to ease frustration around slow financial growth without changing your effort."),
    coreRemedy: gemstoneRemedyFor("Saturn", "This is a slower-acting, powerful stone — start with a short trial period before wearing it regularly."),
  },
  "house_11_Rahu": {
    theme: "You're drawn to unconventional or fast-moving sources of income",
    coreProblem: "You may chase speculative or trend-driven income opportunities — new markets, foreign income, unconventional ventures — with real upside but also real volatility. Sudden gains can be followed by sudden setbacks if there's no solid foundation underneath.",
    practicalRemedy: "Keep a portion of income in stable, boring instruments even while chasing higher-upside opportunities elsewhere — this placement needs a floor under the ambition.",
    quickRemedy: donationRemedyFor("Rahu", "This is traditionally used to steady sudden swings in speculative or fast-moving income."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring more grounding to high-upside, high-volatility income."),
  },
  "house_11_Ketu": {
    theme: "Money and networking don't excite you much, and that itself needs some attention",
    coreProblem: "You may feel disconnected from actively pursuing income growth or building a wide network, which can mean opportunities pass by simply because you didn't engage with them rather than because they weren't available.",
    practicalRemedy: "You don't need to become someone who networks hard, but building one or two low-effort financial habits (automatic saving, a single reliable side income) compensates well for a naturally low interest in active pursuit.",
    quickRemedy: donationRemedyFor("Ketu", "This is traditionally used to restore engagement with income opportunities that would otherwise go unnoticed."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support renewed interest and follow-through on financial opportunities."),
  },
};

// ---------- 2. 10th Lord remedies (overall career pattern) ----------
// Each entry carries full depth (theme, problem, practical, donation,
// gemstone, mantra) because this is the report's backbone regardless
// of the chart's other placements.
export const TENTH_LORD_REMEDIES = {
  "lord10_Sun": {
    theme: "Your career is tied to leadership and being recognized by authority",
    coreProblem: "Your sense of success depends a lot on being seen and validated — by a boss, an industry, or the public. This means setbacks can hit harder than they should, because they feel like a hit to who you are, not just a work setback.",
    practicalRemedy: "Work on separating your sense of self-worth from your job title before chasing the next promotion. A bad quarter or a missed promotion is information, not a verdict on your value.",
    quickRemedy: donationRemedyFor("Sun", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Sun", "As your overall career-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Suryaya Namah",
  },
  "lord10_Saturn": {
    theme: "Your career is built on discipline and a long apprenticeship before real mastery",
    coreProblem: "Your career growth genuinely moves slower than most people's, especially in the early-to-mid stage, which can create real self-doubt if you're comparing yourself to faster-moving peers.",
    practicalRemedy: "Reframe your own timeline — this pattern tends to reward people who stay in one field for 7-10+ years rather than switching every couple of years. The slow build is normal for you, not a sign something's wrong.",
    quickRemedy: donationRemedyFor("Saturn", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Saturn", "As your overall career-ruling placement, this stone is worth a proper trial period under guidance before committing to regular wear."),
    mantraRemedy: "Om Shanicharaya Namah",
  },
  "lord10_Moon": {
    theme: "Your career satisfaction is tied to your emotional state and to feeling useful to people",
    coreProblem: "Your work satisfaction fluctuates with your mood more than most, and you need work that feels meaningful — not just work that pays well — to actually stay engaged long-term.",
    practicalRemedy: "Look for roles with a genuine people or service component. Purely isolated, back-office work tends to drain this pattern even if it's objectively 'good' work on paper.",
    quickRemedy: donationRemedyFor("Moon", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Moon", "As your overall career-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Chandraya Namah",
  },
  "lord10_Mars": {
    theme: "Your career is driven by competition, courage, and decisive action",
    coreProblem: "You get genuinely impatient with slow-moving corporate environments, and you tend to feel restless in stable, low-stakes roles even when they're objectively comfortable.",
    practicalRemedy: "Seek out roles with clear targets and deadlines rather than open-ended, ambiguous responsibilities — this pattern thrives with a visible finish line, not a vague ongoing task.",
    quickRemedy: donationRemedyFor("Mars", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Mars", "As your overall career-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Angarakaya Namah",
  },
  "lord10_Mercury": {
    theme: "Your career is built on communication, analysis, and adaptability",
    coreProblem: "You're skilled across many areas, which is genuinely useful but can delay you settling into a clear specialization and career identity — you can end up 'a bit of everything' longer than is ideal.",
    practicalRemedy: "Pick one lane and go deep in it for a defined stretch of time. Versatility becomes a real asset here once it's paired with depth in at least one area — right now it may be working against you.",
    quickRemedy: donationRemedyFor("Mercury", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Mercury", "As your overall career-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Budhaya Namah",
  },
  "lord10_Jupiter": {
    theme: "Your career is tied to wisdom, teaching, or advisory-type authority",
    coreProblem: "You're likely reluctant to self-promote, so your recognition tends to lag behind your actual competence — people around you may not know just how good you are.",
    practicalRemedy: "Actively document and share what you know — through writing, teaching, or mentoring. This kind of visibility genuinely doesn't happen passively for this pattern; it needs a small deliberate push.",
    quickRemedy: donationRemedyFor("Jupiter", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "As your overall career-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Brihaspataye Namah",
  },
  "lord10_Venus": {
    theme: "Your career is tied to creativity, relationships, and things that feel good to work on",
    coreProblem: "Your career choices can get swayed by comfort or likability rather than long-term strategy, and workplace relationships can occasionally blur professional judgment.",
    practicalRemedy: "When making an important career decision, separate 'what feels pleasant right now' from 'what actually builds long-term value.' Writing the pros and cons down on paper helps keep this distinction clear.",
    quickRemedy: donationRemedyFor("Venus", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Venus", "As your overall career-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Shukraya Namah",
  },
};

/**
 * ---------- 2b. Sign -> Lord map + 10th-lord derivation ----------
 * O(1) array lookups. No external ephemeris needed — just the
 * ascendant sign, since sign order from ascendant is fixed.
 * NOTE: the 10th house is always ruled by Sun, Moon, Mars, Mercury,
 * Jupiter, Venus, or Saturn (never Rahu/Ketu, since they don't rule
 * signs), so TENTH_LORD_REMEDIES intentionally has no Rahu/Ketu entry.
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

const TENTH_HOUSE_SIGN_THEMES = {
  Aries: 'Career rewards initiative, leadership, competition, and decisive action.',
  Taurus: 'Career grows through stability, resources, finance, design, and practical value.',
  Gemini: 'Career grows through communication, analysis, trade, technology, and adaptable skills.',
  Cancer: 'Career is shaped by care, public connection, guidance, and creating emotional security.',
  Leo: 'Career rewards visibility, leadership, creativity, authority, and confident self-expression.',
  Virgo: 'Career rewards service, analysis, systems, health, craft, and continuous improvement.',
  Libra: 'Career grows through partnerships, diplomacy, design, negotiation, and public balance.',
  Scorpio: 'Career favors research, strategy, transformation, investigation, and work with depth.',
  Sagittarius: 'Career expands through teaching, law, travel, publishing, ethics, and big-picture vision.',
  Capricorn: 'Career is built through structure, responsibility, patience, authority, and long-term mastery.',
  Aquarius: 'Career favors technology, networks, social impact, unconventional systems, and innovation.',
  Pisces: 'Career grows through imagination, healing, spirituality, compassion, and behind-the-scenes work.',
};

const TENTH_LORD_PLACEMENT_REMEDIES = {
  1: { theme: 'Career becomes a major part of your identity.', remedy: 'Lead visibly, but define one clear professional direction before taking on too many paths.', action: 'Choose one role or skill to be known for and show evidence of it every week.', watchOut: 'Do not confuse attention with authority; credibility must be built consistently.' },
  2: { theme: 'Career growth is tied to income, speech, and personal values.', remedy: 'Build savings, price your skills clearly, and communicate your value instead of working quietly for approval.', action: 'Keep a record of results and use it in every salary, proposal, or client conversation.', watchOut: 'Avoid undercharging or accepting vague promises in place of fair compensation.' },
  3: { theme: 'Career advances through communication, courage, and self-made effort.', remedy: 'Publish, practice, pitch, and document your work regularly; consistent communication unlocks progress here.', action: 'Share one useful insight, case study, or portfolio piece every week.', watchOut: 'Scattered effort and unfinished projects can dilute an otherwise strong message.' },
  4: { theme: 'Career needs emotional security, a stable base, and a supportive environment.', remedy: 'Create a stable work base and protect home-work boundaries so emotional security supports ambition.', action: 'Design a reliable workspace and fixed work rhythm before pursuing bigger responsibilities.', watchOut: 'Do not let family pressure or comfort make every career decision for you.' },
  5: { theme: 'Career grows through creativity, intelligence, mentoring, and visible original work.', remedy: 'Use creativity and mentoring publicly, while avoiding ego-driven decisions about recognition.', action: 'Turn one idea into a finished public project instead of keeping it theoretical.', watchOut: 'Do not measure your talent only by praise or immediate applause.' },
  6: { theme: 'Career develops through service, problem-solving, routines, and overcoming competition.', remedy: 'Use routines, service, and disciplined conflict resolution; do not let workplace disputes consume your energy.', action: 'Track recurring problems and become the person who solves one of them reliably.', watchOut: 'Overwork and unnecessary conflict can hide your real professional progress.' },
  7: { theme: 'Career is shaped by clients, business partners, negotiation, and public relationships.', remedy: 'Choose collaborators carefully and put agreements in writing; partnerships are central to career growth.', action: 'Define responsibilities, payment, and outcomes before starting shared work.', watchOut: 'Do not outsource your professional identity entirely to a partner or employer.' },
  8: { theme: 'Career grows through depth, confidential work, research, risk, and transformation.', remedy: 'Specialize in research, risk, finance, or transformation and keep a careful record of sensitive work.', action: 'Build a specialty that rewards patience rather than chasing frequent visible wins.', watchOut: 'Hidden politics and unclear financial arrangements require documentation and boundaries.' },
  9: { theme: 'Career expands through teaching, ethics, publishing, travel, and higher knowledge.', remedy: 'Teach, certify, publish, or work with international perspectives; let expertise become visible.', action: 'Convert knowledge into a course, article, credential, or public body of work.', watchOut: 'Avoid waiting for perfect authority before sharing what you already know.' },
  10: { theme: 'Career focus is direct, powerful, and closely tied to responsibility.', remedy: 'Accept responsibility gradually and build durable authority through consistent, measurable results.', action: 'Set quarterly outcomes and let your track record speak louder than ambition.', watchOut: 'Control issues and impatience can damage the authority you are trying to build.' },
  11: { theme: 'Career rewards networks, audiences, gains, and long-term professional connections.', remedy: 'Grow through networks and multiple opportunities, but consolidate gains instead of chasing every lead.', action: 'Maintain a small list of strong contacts and follow up with useful value, not only requests.', watchOut: 'Too many opportunities can scatter your attention and weaken your best income channel.' },
  12: { theme: 'Career develops through foreign links, remote work, institutions, retreat, or quiet expertise.', remedy: 'Build a quiet, sustainable path through foreign, remote, institutional, spiritual, or behind-the-scenes work.', action: 'Create systems that protect focus and make invisible work measurable to others.', watchOut: 'Isolation and unpaid invisible labor can become patterns unless boundaries are explicit.' },
};

const TENTH_HOUSE_SIGN_EXPANSIONS = {
  Aries: { strengths: 'Initiative, leadership, competition, and decisive action.', watchOut: 'Impulsive career changes or conflict with authority.', direction: 'Build leadership through measurable wins and controlled courage.' },
  Taurus: { strengths: 'Stability, resources, finance, design, and practical value.', watchOut: 'Staying comfortable after growth has stopped.', direction: 'Turn dependable skills into assets, savings, and durable expertise.' },
  Gemini: { strengths: 'Communication, analysis, trade, technology, and adaptable skills.', watchOut: 'Being visible everywhere but expert nowhere.', direction: 'Choose one communication or technical specialty and go deep.' },
  Cancer: { strengths: 'Care, public connection, guidance, and emotional security.', watchOut: 'Mood-driven decisions or carrying everyone else’s stress.', direction: 'Create structure around people-focused work and protect recovery time.' },
  Leo: { strengths: 'Visibility, leadership, creativity, authority, and self-expression.', watchOut: 'Needing recognition before taking the next useful step.', direction: 'Lead generously and let consistent results earn the spotlight.' },
  Virgo: { strengths: 'Service, analysis, systems, health, craft, and improvement.', watchOut: 'Perfectionism delaying publication or promotion.', direction: 'Ship useful work regularly and improve it through feedback.' },
  Libra: { strengths: 'Partnerships, diplomacy, design, negotiation, and public balance.', watchOut: 'Avoiding necessary decisions to keep everyone pleased.', direction: 'Use clear agreements and make principled choices promptly.' },
  Scorpio: { strengths: 'Research, strategy, transformation, investigation, and depth.', watchOut: 'Secrecy, control struggles, or distrust at work.', direction: 'Specialize deeply while keeping communication and records transparent.' },
  Sagittarius: { strengths: 'Teaching, law, travel, publishing, ethics, and big-picture vision.', watchOut: 'Overpromising or moving on before a project matures.', direction: 'Turn knowledge into a visible body of work and finish what you start.' },
  Capricorn: { strengths: 'Structure, responsibility, authority, patience, and mastery.', watchOut: 'Measuring worth only through status or workload.', direction: 'Build a long-range path with sustainable standards for success.' },
  Aquarius: { strengths: 'Technology, networks, social impact, systems, and innovation.', watchOut: 'Rebelling against useful structure or people skills.', direction: 'Pair original ideas with reliable delivery and community.' },
  Pisces: { strengths: 'Imagination, healing, spirituality, compassion, and quiet work.', watchOut: 'Blurred boundaries or unclear professional expectations.', direction: 'Give creative service a practical structure, price, and schedule.' },
};

/**
 * Given the ascendant sign, returns which sign falls in the 10th house
 * and which planet rules it (the "10th Lord").
 * @param {string} ascendantSign - e.g. "Virgo"
 */
export function getTenthLord(ascendantSign) {
  const startIndex = SIGN_ORDER.indexOf(ascendantSign);
  if (startIndex === -1) return { tenthSign: null, tenthLordPlanet: null };
  const tenthSign = SIGN_ORDER[(startIndex + 9) % 12]; // 10th house = +9 signs from ascendant
  return { tenthSign, tenthLordPlanet: SIGN_LORD[tenthSign] || null };
}

/**
 * ---------- 3. O(1) Career Report Builder ----------
 * Pass the user's already-calculated chart data. This does pure
 * object-key lookups — no loops over the whole chart, no filtering.
 *
 * Functional-nature gating:
 *   - MALEFIC placement  -> full remedy (theme, coreProblem, practicalRemedy, quickRemedy/donation, coreRemedy/gemstone)
 *   - BENEFIC or NEUTRAL -> gemstone-only (theme kept for the label, coreRemedy/gemstone only)
 *
 * @param {Object} planetPositions - e.g. { Sun: { house: 10 }, Saturn: { house: 6 }, ... }
 * @param {string} ascendantSign - e.g. "Virgo" — used to derive the 10th Lord (O(1)) and functional nature
 * @param {number[]} focusHouses - houses to report on, defaults to [6, 10, 11]
 */
export function getCareerReport(planetPositions, ascendantSign, focusHouses = [6, 10, 11]) {
  const placements = [];

  if (!planetPositions || !ascendantSign) {
    return {
      placements: [],
      tenthHouseSign: null,
      tenthHouseTheme: null,
      tenthLord: null,
      tenthLordPlacement: null,
      tenthLordNature: null,
      tenthLordRemedy: null,
    };
  }

  const { tenthSign, tenthLordPlanet } = getTenthLord(ascendantSign); // O(1)
  const tenthLordHouse = planetPositions[tenthLordPlanet]?.house || null;

  for (const [planet, pos] of Object.entries(planetPositions || {})) {
    if (!pos || !focusHouses.includes(pos.house)) continue;
    const key = `house_${pos.house}_${planet}`;
    const remedy = CAREER_HOUSE_REMEDIES[key]; // O(1) hash lookup
    if (!remedy) continue;

    const nature = getFunctionalNature(planet, ascendantSign); // 'benefic' | 'malefic' | 'neutral'
    const isMalefic = nature === 'malefic';

    if (isMalefic) {
      // Problem placement — full writeup: theme, coreProblem,
      // practicalRemedy, donation (quickRemedy), gemstone (coreRemedy)
      placements.push({ planet, house: pos.house, nature, ...remedy });
    } else {
      // Benefic or neutral — naturally supportive, gemstone-only
      // reinforcement. No coreProblem/practicalRemedy/donation here —
      // there's no friction to report, just a supporting stone.
      placements.push({
        planet,
        house: pos.house,
        nature,
        theme: remedy.theme,           // kept for the card label only
        coreRemedy: remedy.coreRemedy, // GEMSTONE field only
      });
    }
  }

  const lordKey = `lord10_${tenthLordPlanet}`;
  const lordRemedy = TENTH_LORD_REMEDIES[lordKey] || null; // O(1) hash lookup
  const tenthLordNature = tenthLordPlanet ? getFunctionalNature(tenthLordPlanet, ascendantSign) : null;

  return {
    placements,          // array of career-relevant placements, full or gemstone-only per nature
    tenthHouseSign: tenthSign,
    tenthHouseTheme: TENTH_HOUSE_SIGN_THEMES[tenthSign] || null,
    tenthHouseExpansion: TENTH_HOUSE_SIGN_EXPANSIONS[tenthSign] || null,
    tenthLord: tenthLordPlanet,
    tenthLordPlacement: tenthLordHouse,
    tenthLordNature,     // exposed for optional UI badging — not used to gate the headline
    tenthLordRemedy: lordRemedy,
    tenthLordPlacementRemedy: TENTH_LORD_PLACEMENT_REMEDIES[tenthLordHouse] || null,
  };
}