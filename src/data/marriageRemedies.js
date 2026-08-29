/**
 * marriageRemedies.js
 * ------------------------------------------------------------
 * Paid "Marriage & Relationship Report" data source (₹99 unlock).
 *
 * DESIGN GOAL: O(1) lookup at request time.
 * Every entry is pre-keyed as a flat string -> object map.
 * No loops, no nested [planet][sign][house] traversal, no .find().
 *
 * Two kinds of keys:
 *   1. house_<HouseNumber>_<Planet>   -> planet sitting in that house
 *   2. lord7_<Planet>                 -> planet that rules the 7th house
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
 * user — no "functional malefic/benefic", no "7th house", no
 * "ascendant". Those are internal classification concepts only.
 * Copy should read as plain remedy language ("this pattern",
 * "this placement", "this area of your relationship").
 *
 * FUNCTIONAL NATURE GATING:
 * A planet sitting in 2/5/7/8/11 only gets the FULL remedy writeup
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

export const MARRIAGE_FOCUS_HOUSES = [2, 5, 7, 8, 11];

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

// ---------- 1. Planet-in-House remedies (Marriage-relevant houses only) ----------
export const MARRIAGE_HOUSE_REMEDIES = {
  // ================= 2nd House (family values, speech, shared household resources, in-laws) =================
  "house_2_Sun": {
    theme: "You want respect and a real voice within the relationship",
    coreProblem: "You may feel diminished if your opinions or contributions to the household aren't acknowledged, which can create friction over who effectively leads shared decisions.",
    practicalRemedy: "State your needs clearly and directly instead of expecting them to be inferred from your mood.",
    quickRemedy: donationRemedyFor("Sun", "This eases ego-driven friction over household authority."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support mutual respect in partnership."),
  },
  "house_2_Moon": {
    theme: "Emotional security in the relationship is tied to family and home life",
    coreProblem: "Family expectations or a partner's mood can affect your own sense of security more strongly than the relationship itself would otherwise warrant.",
    practicalRemedy: "Build emotional security from consistent daily connection, not just occasional big reassurances.",
    quickRemedy: donationRemedyFor("Moon", "This supports emotional steadiness within family and home life."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support calm, secure family bonds."),
  },
  "house_2_Mars": {
    theme: "Household decisions can become a battleground for control",
    coreProblem: "Disagreements about money, family, or daily household matters can escalate faster than the actual stakes warrant.",
    practicalRemedy: "Address household disagreements calmly and early, before frustration builds into a bigger conflict.",
    quickRemedy: donationRemedyFor("Mars", "This eases conflict-driven friction over shared resources."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel assertiveness into constructive negotiation."),
  },
  "house_2_Mercury": {
    theme: "Communication style shapes how shared life is negotiated",
    coreProblem: "Miscommunication about finances, family expectations, or daily logistics can create recurring, avoidable friction.",
    practicalRemedy: "Confirm important shared decisions in a clear follow-up conversation, not just verbally in passing.",
    quickRemedy: donationRemedyFor("Mercury", "This eases communication-based friction in shared decisions."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support clear, low-friction negotiation."),
  },
  "house_2_Jupiter": {
    theme: "A generally generous, family-oriented approach to shared life",
    coreProblem: "You may over-give to extended family or in-laws before your own household's needs are fully secured.",
    practicalRemedy: "Set a clear boundary for how much you extend to extended family before it affects your own household.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports balanced generosity toward family."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support wise, sustainable family generosity."),
  },
  "house_2_Venus": {
    theme: "Comfort and harmony guide your approach to shared life",
    coreProblem: "You may avoid necessary but uncomfortable conversations about money or family boundaries in order to keep the peace.",
    practicalRemedy: "Raise a difficult household topic early and calmly rather than letting it wait until it's unavoidable.",
    quickRemedy: donationRemedyFor("Venus", "This supports confidence in addressing uncomfortable shared topics."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced, harmonious shared life."),
  },
  "house_2_Saturn": {
    theme: "Shared responsibilities are handled with discipline, sometimes rigidly",
    coreProblem: "You may take on more of the practical household burden than is sustainable, out of a sense of duty rather than explicit agreement.",
    practicalRemedy: "Renegotiate household responsibilities explicitly rather than quietly carrying an unequal share.",
    quickRemedy: donationRemedyFor("Saturn", "This eases the weight of an unequal household burden."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting long-term commitment — trial it carefully."),
  },
  "house_2_Rahu": {
    theme: "Family or financial dynamics in the relationship can feel unconventional",
    coreProblem: "In-law dynamics, unclear financial arrangements, or unconventional family setups can create confusion or sudden tension.",
    practicalRemedy: "Get shared financial or family arrangements clearly documented rather than left informal.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies confusion around unconventional family or financial arrangements."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring clarity to unclear shared arrangements."),
  },
  "house_2_Ketu": {
    theme: "You may feel detached from family or household obligations",
    coreProblem: "A pull toward disengagement can mean shared responsibilities or family ties get quietly neglected.",
    practicalRemedy: "Stay minimally but consistently engaged with shared family obligations rather than opting out entirely.",
    quickRemedy: donationRemedyFor("Ketu", "This restores engagement with shared family responsibilities."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support renewed connection to shared life."),
  },

  // ================= 5th House (romance, courtship, affection, children, creative connection) =================
  "house_5_Sun": {
    theme: "You want to feel proud of, and admired within, the relationship",
    coreProblem: "Romance can get tangled with ego — needing to feel like the more impressive or capable partner rather than simply connecting.",
    practicalRemedy: "Practice romantic gestures that don't require being the center of attention.",
    quickRemedy: donationRemedyFor("Sun", "This eases ego-driven tension in romantic connection."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support warm, confident romantic connection."),
  },
  "house_5_Moon": {
    theme: "Romantic connection is emotionally intense and mood-sensitive",
    coreProblem: "Affection can feel inconsistent to a partner because it tracks your emotional state closely, even when your commitment hasn't actually changed.",
    practicalRemedy: "Communicate mood shifts openly so a partner doesn't read emotional withdrawal as disinterest.",
    quickRemedy: donationRemedyFor("Moon", "This supports emotional steadiness in romantic connection."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support tender, secure affection."),
  },
  "house_5_Mars": {
    theme: "A passionate connection, with a tendency toward impatience",
    coreProblem: "Romantic frustration can turn into sharp conflict quickly, especially if you feel a partner isn't matching your energy or effort.",
    practicalRemedy: "Channel romantic frustration into direct, calm conversation rather than letting it build into conflict.",
    quickRemedy: donationRemedyFor("Mars", "This eases conflict-driven tension in romantic connection."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel passion constructively."),
  },
  "house_5_Mercury": {
    theme: "Connection through conversation and shared humor",
    coreProblem: "Romance can cool if intellectual connection fades, even when emotional commitment is genuinely still there.",
    practicalRemedy: "Keep actively creating things to talk about and learn together, not just logistics conversations.",
    quickRemedy: donationRemedyFor("Mercury", "This supports playful, engaged romantic communication."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support lively romantic connection."),
  },
  "house_5_Jupiter": {
    theme: "A generous, optimistic approach to romance and children",
    coreProblem: "You may idealize a relationship or a partner's potential rather than seeing them clearly as they are right now.",
    practicalRemedy: "Balance optimism about the relationship with honest conversations about real, current needs.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports grounded, sustainable romantic optimism."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support long-term romantic fulfillment."),
  },
  "house_5_Venus": {
    theme: "A naturally strong placement for romance and affection",
    coreProblem: "You may prioritize the feeling of romance over addressing real relationship issues underneath it.",
    practicalRemedy: "Pair romantic gestures with honest conversation about anything that actually needs addressing.",
    quickRemedy: donationRemedyFor("Venus", "This supports balanced, honest romantic connection."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to strengthen romantic harmony and affection."),
  },
  "house_5_Saturn": {
    theme: "Romance builds slowly and matures with commitment",
    coreProblem: "You may struggle to express playfulness or spontaneous affection, which a partner can misread as a lack of interest.",
    practicalRemedy: "Schedule small, low-pressure romantic moments rather than waiting for spontaneous ones to arise.",
    quickRemedy: donationRemedyFor("Saturn", "This eases difficulty expressing spontaneous affection."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting durable romantic commitment — trial it carefully."),
  },
  "house_5_Rahu": {
    theme: "Romantic attraction can feel intense, unconventional, or sudden",
    coreProblem: "You may be drawn to relationships that feel exciting but unstable, mistaking intensity for genuine compatibility.",
    practicalRemedy: "Give a new romantic connection real time before making major commitments based on early intensity.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies sudden, intense romantic attractions."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to intense romantic connections."),
  },
  "house_5_Ketu": {
    theme: "You may feel detached from conventional romantic expectations",
    coreProblem: "A pull toward emotional distance can leave a partner feeling romance has cooled, even when your underlying commitment is intact.",
    practicalRemedy: "Make small, deliberate romantic gestures even when they don't feel urgent to you.",
    quickRemedy: donationRemedyFor("Ketu", "This restores warmth in romantic expression."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support renewed romantic presence."),
  },

  // ================= 7th House (the partnership itself: dynamics, compatibility, negotiation) =================
  "house_7_Sun": {
    theme: "You want an equal, respected voice in the partnership",
    coreProblem: "Power dynamics — who leads, who's 'right' — can become a recurring theme, especially if you feel your role in the relationship is undervalued.",
    practicalRemedy: "Treat the partnership as a collaboration of equals rather than a competition for authority.",
    quickRemedy: donationRemedyFor("Sun", "This eases power-struggle dynamics within the partnership."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support mutual respect between partners."),
  },
  "house_7_Moon": {
    theme: "Partnership stability is closely tied to emotional attunement",
    coreProblem: "The relationship can feel unstable during emotionally difficult periods, even when the underlying partnership is genuinely sound.",
    practicalRemedy: "Build regular emotional check-ins into the relationship so instability gets addressed before it compounds.",
    quickRemedy: donationRemedyFor("Moon", "This supports emotional stability within the partnership."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support secure, attuned partnership."),
  },
  "house_7_Mars": {
    theme: "Partnership dynamics can be intense, direct, and occasionally combative",
    coreProblem: "You and a partner may clash over who takes the lead or how decisions get made, with conflict escalating faster than the issue warrants.",
    practicalRemedy: "Agree in advance on how disagreements will be handled, before you're in the middle of one.",
    quickRemedy: donationRemedyFor("Mars", "This eases conflict-driven friction within the partnership."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel partnership energy constructively."),
  },
  "house_7_Mercury": {
    theme: "Partnership thrives or struggles based on communication quality",
    coreProblem: "Misunderstandings and unclear expectations tend to be the actual source of most partnership friction, more than any deeper incompatibility.",
    practicalRemedy: "Restate important agreements clearly rather than assuming they were understood the same way by both of you.",
    quickRemedy: donationRemedyFor("Mercury", "This eases communication-based partnership friction."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support clear partnership negotiation."),
  },
  "house_7_Jupiter": {
    theme: "Generally favorable for a long-term, growth-oriented partnership",
    coreProblem: "You may extend more patience and generosity to a partner than the relationship's balance actually calls for.",
    practicalRemedy: "Make sure generosity in the partnership goes both directions, not just from you outward.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports balanced, mutual generosity in partnership."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support wise, lasting partnership."),
  },
  "house_7_Venus": {
    theme: "A naturally strong placement for partnership harmony",
    coreProblem: "You may avoid necessary conflict to preserve harmony, letting real issues go unaddressed under the surface.",
    practicalRemedy: "Treat honest disagreement as part of a healthy partnership, not a threat to it.",
    quickRemedy: donationRemedyFor("Venus", "This supports confidence in addressing real partnership issues."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to strengthen partnership harmony and fairness."),
  },
  "house_7_Saturn": {
    theme: "Partnership matures slowly but tends to be genuinely durable",
    coreProblem: "Commitment may develop more slowly than a partner expects, or the relationship may carry real responsibility and pressure early on.",
    practicalRemedy: "Communicate your pace of commitment honestly rather than letting a partner guess at it.",
    quickRemedy: donationRemedyFor("Saturn", "This eases pressure around the pace of commitment."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting long-term partnership durability — trial it carefully."),
  },
  "house_7_Rahu": {
    theme: "Partnership dynamics can feel unconventional or intensely magnetic",
    coreProblem: "You may be drawn to a partnership that feels exciting or unconventional but lacks a stable foundation underneath the attraction.",
    practicalRemedy: "Build the practical, unglamorous parts of the partnership — routine, shared responsibility — alongside the exciting parts.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies unconventional or unstable partnership dynamics."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to intense partnership connections."),
  },
  "house_7_Ketu": {
    theme: "You may feel a pull toward independence within the partnership",
    coreProblem: "A need for space and detachment can be misread by a partner as disinterest or emotional distance.",
    practicalRemedy: "Communicate your need for independence clearly rather than withdrawing without explanation.",
    quickRemedy: donationRemedyFor("Ketu", "This restores warmth and presence within the partnership."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support balanced closeness and independence."),
  },

  // ================= 8th House (intimacy, trust, shared resources/secrets, transformation) =================
  "house_8_Sun": {
    theme: "Trust is tied to feeling respected in vulnerable moments",
    coreProblem: "You may struggle to be vulnerable with a partner if it feels like it threatens your sense of authority or control.",
    practicalRemedy: "Practice sharing something genuinely vulnerable with your partner in a low-stakes moment, to build the habit.",
    quickRemedy: donationRemedyFor("Sun", "This eases resistance to vulnerability within the relationship."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support confident, secure intimacy."),
  },
  "house_8_Moon": {
    theme: "Emotional intimacy runs deep, and so does emotional risk",
    coreProblem: "Deep emotional bonding can also mean deep emotional dependency, making a rupture in trust feel especially destabilizing.",
    practicalRemedy: "Maintain some emotional life and support outside the relationship, so intimacy doesn't become the only source of security.",
    quickRemedy: donationRemedyFor("Moon", "This supports emotional resilience within deep intimacy."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support secure, deep emotional bonds."),
  },
  "house_8_Mars": {
    theme: "Trust issues can surface as sharp, direct conflict",
    coreProblem: "Breaches of trust or unresolved resentment can build until they erupt, rather than being addressed calmly as they arise.",
    practicalRemedy: "Raise trust concerns directly and early, rather than letting them accumulate into a bigger confrontation.",
    quickRemedy: donationRemedyFor("Mars", "This eases conflict around trust and shared resources."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel intensity around trust constructively."),
  },
  "house_8_Mercury": {
    theme: "Trust is built or broken through transparency in communication",
    coreProblem: "Withheld information, even small or well-intentioned, tends to erode trust here faster than in most other patterns.",
    practicalRemedy: "Default to transparency about finances, plans, and concerns, even when full disclosure feels uncomfortable.",
    quickRemedy: donationRemedyFor("Mercury", "This supports transparent, trust-building communication."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support honest, clear intimacy."),
  },
  "house_8_Jupiter": {
    theme: "Generally trustworthy and generous, with a tendency to over-share responsibility",
    coreProblem: "You may take on more shared financial or emotional responsibility than is balanced, out of generosity or optimism.",
    practicalRemedy: "Make sure shared responsibilities and resources are genuinely agreed upon, not just assumed out of goodwill.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports balanced, trustworthy shared responsibility."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support deep, lasting trust."),
  },
  "house_8_Venus": {
    theme: "Intimacy and trust are closely tied to comfort and affection",
    coreProblem: "You may avoid addressing a real trust issue because confronting it threatens the comfort of the relationship.",
    practicalRemedy: "Address a trust concern directly, even when it disrupts the relationship's usual harmony.",
    quickRemedy: donationRemedyFor("Venus", "This supports confidence in addressing trust concerns."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support secure, balanced intimacy."),
  },
  "house_8_Saturn": {
    theme: "Trust builds slowly but tends to be genuinely solid once established",
    coreProblem: "You may be slow to fully trust a partner, which can frustrate them even as your caution is often well-founded.",
    practicalRemedy: "Communicate that trust is building rather than absent, so a partner understands the pace rather than the distance.",
    quickRemedy: donationRemedyFor("Saturn", "This eases the slow pace of building deep trust."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting durable trust — trial it carefully."),
  },
  "house_8_Rahu": {
    theme: "Trust issues here can involve secrets, sudden revelations, or shared finances",
    coreProblem: "Hidden information, financial or otherwise, can surface suddenly and create disproportionate disruption to the relationship.",
    practicalRemedy: "Keep shared finances and important information fully documented and visible to both partners.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies disruption from sudden revelations or hidden information."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring clarity to hidden or unclear matters."),
  },
  "house_8_Ketu": {
    theme: "You may withdraw from deep intimacy without explanation",
    coreProblem: "A pull toward emotional privacy can leave a partner feeling shut out during moments that call for real closeness.",
    practicalRemedy: "Make a deliberate effort to stay present during vulnerable conversations, even when withdrawal feels easier.",
    quickRemedy: donationRemedyFor("Ketu", "This restores presence during moments of needed intimacy."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support engaged, trusting intimacy."),
  },

  // ================= 11th House (shared friendships, future goals, social circle around the relationship) =================
  "house_11_Sun": {
    theme: "You want your relationship recognized and respected by your social circle",
    coreProblem: "You may care more than you'd like to admit about how the relationship looks to friends or family, sometimes letting outside opinion affect internal decisions.",
    practicalRemedy: "Make major relationship decisions based on what actually works for the two of you, not on outside validation.",
    quickRemedy: donationRemedyFor("Sun", "This eases the pull of outside opinion on the relationship."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support confident, self-directed partnership decisions."),
  },
  "house_11_Moon": {
    theme: "Shared social life is tied to emotional comfort",
    coreProblem: "The relationship's social circle can feel unstable during emotionally low periods, even if nothing has actually changed with the friendships involved.",
    practicalRemedy: "Maintain a few steady, low-maintenance shared friendships that don't depend on either partner's mood that week.",
    quickRemedy: donationRemedyFor("Moon", "This supports emotional steadiness in shared social life."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support secure, warm shared friendships."),
  },
  "house_11_Mars": {
    theme: "Shared goals are pursued with real drive, sometimes at odds with a partner's pace",
    coreProblem: "You may push for shared goals faster than a partner is ready for, creating friction over timing rather than direction.",
    practicalRemedy: "Align on pacing for shared goals explicitly, rather than assuming a partner shares your urgency.",
    quickRemedy: donationRemedyFor("Mars", "This eases friction over pacing of shared future goals."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel drive toward shared goals constructively."),
  },
  "house_11_Mercury": {
    theme: "Shared friendships and future plans are built through ongoing conversation",
    coreProblem: "Plans and social commitments can get scattered or miscommunicated if not actively coordinated between partners.",
    practicalRemedy: "Keep shared plans and social commitments clearly tracked between you, rather than relying on memory.",
    quickRemedy: donationRemedyFor("Mercury", "This eases miscommunication around shared plans and social life."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support clear coordination on shared goals."),
  },
  "house_11_Jupiter": {
    theme: "Generally favorable for building a wide, supportive shared social circle",
    coreProblem: "You may over-commit the relationship to social or extended-family obligations before your own shared goals are secured.",
    practicalRemedy: "Protect time and resources for your own shared future goals before extending generosity outward.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports balanced generosity toward your shared social circle."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support long-term shared prosperity and friendship."),
  },
  "house_11_Venus": {
    theme: "Shared social life is a genuine source of relationship pleasure",
    coreProblem: "You may prioritize maintaining a pleasant social image over addressing real friction in shared future planning.",
    practicalRemedy: "Make time for honest planning conversations, not just enjoyable shared social time.",
    quickRemedy: donationRemedyFor("Venus", "This supports honest conversation alongside enjoyable shared life."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support harmonious shared social connection."),
  },
  "house_11_Saturn": {
    theme: "Shared goals build slowly but tend to be genuinely durable",
    coreProblem: "Progress toward shared long-term goals may feel slower than either of you would like, which can create quiet frustration.",
    practicalRemedy: "Review shared goals annually rather than constantly, so slow, steady progress is easier to see and trust.",
    quickRemedy: donationRemedyFor("Saturn", "This eases frustration around the slow pace of shared goals."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting durable shared achievement — trial it carefully."),
  },
  "house_11_Rahu": {
    theme: "Shared social circle or future goals can feel unconventional or in flux",
    coreProblem: "You may be drawn to ambitious, unconventional shared goals without always securing the practical groundwork first.",
    practicalRemedy: "Document shared plans and agreements clearly, especially ones involving finances or unconventional arrangements.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies uncertainty around unconventional shared goals."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to ambitious shared plans."),
  },
  "house_11_Ketu": {
    theme: "You may feel detached from shared social life or long-term planning",
    coreProblem: "A pull toward disengagement can mean shared future planning gets postponed or avoided, even when it matters to a partner.",
    practicalRemedy: "Engage in at least occasional, deliberate future-planning conversations rather than leaving them entirely to your partner.",
    quickRemedy: donationRemedyFor("Ketu", "This restores engagement with shared future planning."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support renewed investment in shared goals."),
  },
};

// ---------- 2. 7th Lord remedies (who RULES the 7th house — your overall partnership pattern) ----------
export const SEVENTH_LORD_REMEDIES = {
  "lord7_Sun": {
    theme: "Your approach to partnership is tied to respect and equality",
    coreProblem: "You may need to feel like an equal or respected voice in the relationship, and can struggle when a partner's personality or role overshadows your own.",
    practicalRemedy: "Build your sense of identity partly outside the relationship, so your self-worth doesn't depend entirely on your role within it.",
    quickRemedy: donationRemedyFor("Sun", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Sun", "As your overall partnership-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Suryaya Namah",
  },
  "lord7_Moon": {
    theme: "Your approach to partnership is emotionally driven and deeply attuned",
    coreProblem: "Relationship satisfaction fluctuates with your emotional state, and you may need more reassurance during low periods than a partner realizes.",
    practicalRemedy: "Communicate emotional needs directly rather than expecting a partner to intuit them.",
    quickRemedy: donationRemedyFor("Moon", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Moon", "As your overall partnership-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Chandraya Namah",
  },
  "lord7_Mars": {
    theme: "Your approach to partnership is direct, passionate, and occasionally combative",
    coreProblem: "You bring real energy and commitment to a relationship, but conflict can escalate quickly if it isn't addressed early and calmly.",
    practicalRemedy: "Agree with a partner in advance on how disagreements will be handled, before you're in the middle of one.",
    quickRemedy: donationRemedyFor("Mars", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Mars", "As your overall partnership-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Angarakaya Namah",
  },
  "lord7_Mercury": {
    theme: "Your approach to partnership is built on communication and shared understanding",
    coreProblem: "Relationship satisfaction depends heavily on how well you and a partner actually talk things through — unclear communication causes more friction than real incompatibility.",
    practicalRemedy: "Prioritize clear, regular conversation over assuming things are understood.",
    quickRemedy: donationRemedyFor("Mercury", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Mercury", "As your overall partnership-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Budhaya Namah",
  },
  "lord7_Jupiter": {
    theme: "Your approach to partnership is generous, optimistic, and growth-oriented",
    coreProblem: "You may idealize a partner or the relationship's potential, extending patience and generosity that isn't always reciprocated in kind.",
    practicalRemedy: "Balance optimism about the relationship with honest, ongoing conversation about its real, current state.",
    quickRemedy: donationRemedyFor("Jupiter", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "As your overall partnership-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Brihaspataye Namah",
  },
  "lord7_Venus": {
    theme: "Your approach to partnership is naturally warm, affectionate, and harmony-seeking",
    coreProblem: "You may avoid necessary conflict to preserve harmony, letting real issues sit unaddressed beneath a pleasant surface.",
    practicalRemedy: "Treat honest disagreement as a normal, healthy part of a good partnership, not a threat to it.",
    quickRemedy: donationRemedyFor("Venus", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Venus", "As your overall partnership-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Shukraya Namah",
  },
  "lord7_Saturn": {
    theme: "Your approach to partnership is serious, committed, and slow to develop",
    coreProblem: "You take partnership seriously and build commitment carefully, but this pace can be frustrating for a partner who moves faster emotionally.",
    practicalRemedy: "Communicate your pace of commitment honestly, so it reads as depth rather than distance.",
    quickRemedy: donationRemedyFor("Saturn", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Saturn", "As your overall partnership-ruling placement, this stone is worth a proper trial period under guidance before committing to regular wear."),
    mantraRemedy: "Om Shanicharaya Namah",
  },
};

/**
 * ---------- 2b. Sign -> Lord map + 7th-lord derivation ----------
 * NOTE: the 7th house is always ruled by Sun, Moon, Mars, Mercury,
 * Jupiter, Venus, or Saturn (never Rahu/Ketu, since they don't rule
 * signs), so SEVENTH_LORD_REMEDIES intentionally has no Rahu/Ketu entry.
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

const SEVENTH_HOUSE_SIGN_THEMES = {
  Aries: 'Relationships grow through directness, courage, shared action, and honest independence.',
  Taurus: 'Relationships grow through loyalty, touch, stability, shared values, and dependable effort.',
  Gemini: 'Relationships grow through conversation, curiosity, humor, and keeping mental connection alive.',
  Cancer: 'Relationships grow through emotional safety, family care, tenderness, and a sense of home.',
  Leo: 'Relationships grow through warmth, appreciation, play, generosity, and visible affection.',
  Virgo: 'Relationships grow through practical care, reliability, thoughtful service, and useful routines.',
  Libra: 'Relationships grow through fairness, cooperation, beauty, diplomacy, and mutual consideration.',
  Scorpio: 'Relationships grow through trust, emotional honesty, depth, loyalty, and healthy vulnerability.',
  Sagittarius: 'Relationships grow through freedom, shared learning, adventure, optimism, and honest space.',
  Capricorn: 'Relationships grow through commitment, responsibility, patience, and long-term building.',
  Aquarius: 'Relationships grow through friendship, equality, originality, shared ideals, and breathing room.',
  Pisces: 'Relationships grow through compassion, imagination, spiritual connection, and emotional sensitivity.',
};

const SEVENTH_HOUSE_SIGN_EXPANSIONS = {
  Aries: { strengths: 'Directness, courage, honest independence.', watchOut: 'Impulsive conflict or power struggles.', direction: 'Channel directness into calm, direct negotiation.' },
  Taurus: { strengths: 'Loyalty, stability, dependable effort.', watchOut: 'Resistance to necessary change or compromise.', direction: 'Pair stability with openness to a partner\'s evolving needs.' },
  Gemini: { strengths: 'Conversation, curiosity, mental connection.', watchOut: 'Restlessness or scattered communication.', direction: 'Keep communication consistent, not just frequent.' },
  Cancer: { strengths: 'Emotional safety, care, sense of home.', watchOut: 'Mood-driven closeness or distance.', direction: 'Anchor emotional security in consistent daily connection.' },
  Leo: { strengths: 'Warmth, appreciation, visible affection.', watchOut: 'Needing constant admiration or control.', direction: 'Balance giving and receiving appreciation equally.' },
  Virgo: { strengths: 'Practical care, reliability, useful routines.', watchOut: 'Over-criticism or excessive practicality.', direction: 'Pair practical care with emotional warmth.' },
  Libra: { strengths: 'Fairness, cooperation, diplomacy.', watchOut: 'Avoiding necessary conflict to keep the peace.', direction: 'Address disagreements directly rather than smoothing them over.' },
  Scorpio: { strengths: 'Trust, depth, loyalty.', watchOut: 'Control struggles or excessive secrecy.', direction: 'Build trust through active transparency, not just loyalty.' },
  Sagittarius: { strengths: 'Freedom, honesty, shared adventure.', watchOut: 'Avoiding commitment or necessary structure.', direction: 'Pair freedom with clear, honored commitments.' },
  Capricorn: { strengths: 'Commitment, responsibility, long-term building.', watchOut: 'Treating the relationship as another duty to manage.', direction: 'Keep warmth and play alongside responsibility.' },
  Aquarius: { strengths: 'Friendship, equality, shared ideals.', watchOut: 'Emotional distance disguised as independence.', direction: 'Pair independence with consistent emotional presence.' },
  Pisces: { strengths: 'Compassion, imagination, emotional sensitivity.', watchOut: 'Blurred boundaries or avoidance of real issues.', direction: 'Give compassion clear boundaries and honest communication.' },
};

const SEVENTH_LORD_PLACEMENT_REMEDIES = {
  1: { theme: 'Partnership becomes closely tied to your own identity.', remedy: 'Keep your individuality intact while building a life together.', action: 'Maintain at least one personal interest independent of the relationship.', watchOut: 'Don\'t let the relationship fully define your sense of self.' },
  2: { theme: 'Partnership is closely tied to shared finances and family values.', remedy: 'Align clearly on money and family expectations early.', action: 'Have an explicit conversation about shared financial values.', watchOut: 'Avoid letting assumptions about money go unspoken.' },
  3: { theme: 'Partnership thrives through communication and shared daily effort.', remedy: 'Keep regular, honest conversation as the foundation of the relationship.', action: 'Build in a short daily or weekly check-in.', watchOut: 'Small unresolved misunderstandings can accumulate quietly.' },
  4: { theme: 'Partnership is closely tied to home and emotional security.', remedy: 'Make the home a genuinely shared, emotionally safe space.', action: 'Divide household responsibilities explicitly.', watchOut: 'Don\'t let domestic stress substitute for addressing relationship issues directly.' },
  5: { theme: 'Partnership needs ongoing romance, play, and creative connection.', remedy: 'Protect intentional romantic time from being crowded out by routine.', action: 'Schedule dedicated time together regularly.', watchOut: 'Letting romance become an afterthought erodes connection quietly.' },
  6: { theme: 'Partnership is tested and strengthened through daily problem-solving.', remedy: 'Use calm, consistent routines to resolve recurring friction.', action: 'Address recurring disagreements with a simple, repeatable process.', watchOut: 'Unresolved daily friction can accumulate into resentment.' },
  7: { theme: 'Partnership itself is a direct, central life focus.', remedy: 'Treat the relationship as a deliberate ongoing agreement, not something that runs on autopilot.', action: 'Revisit shared expectations periodically.', watchOut: 'Assuming the relationship will maintain itself is a common pitfall.' },
  8: { theme: 'Partnership depends on real trust and emotional depth.', remedy: 'Build transparency around intimacy, money, and vulnerability.', action: 'Have one honest, vulnerable conversation regularly, not only during conflict.', watchOut: 'Withheld information erodes trust faster than open conflict does.' },
  9: { theme: 'Partnership grows through shared beliefs and a common future vision.', remedy: 'Keep a shared long-term vision while respecting individual differences.', action: 'Discuss long-term goals and values explicitly, not just in passing.', watchOut: 'Avoid assuming shared beliefs without ever actually confirming them.' },
  10: { theme: 'Partnership is closely affected by career pressure and public roles.', remedy: 'Protect private relationship time from being consumed by career demands.', action: 'Schedule non-negotiable time together, separate from work.', watchOut: 'Career stress can quietly become the relationship\'s main topic.' },
  11: { theme: 'Partnership benefits from shared friendships and future goals.', remedy: 'Build a shared social circle and future plans together deliberately.', action: 'Set at least one shared goal you\'re both actively working toward.', watchOut: 'Outside opinions can otherwise carry too much weight in the relationship.' },
  12: { theme: 'Partnership needs protected privacy, rest, and emotional recovery.', remedy: 'Make space for quiet, private time together away from external demands.', action: 'Protect unstructured, private time as a couple.', watchOut: 'Unclear boundaries with the outside world can quietly strain intimacy.' },
};

/**
 * Given the ascendant sign, returns which sign falls in the 7th house
 * and which planet rules it (the "7th Lord" — primary partnership indicator).
 * @param {string} ascendantSign - e.g. "Virgo"
 */
export function getSeventhLord(ascendantSign) {
  const startIndex = SIGN_ORDER.indexOf(ascendantSign);
  if (startIndex === -1) return { seventhSign: null, seventhLordPlanet: null };
  const seventhSign = SIGN_ORDER[(startIndex + 6) % 12]; // 7th house = +6 signs from ascendant
  return { seventhSign, seventhLordPlanet: SIGN_LORD[seventhSign] || null };
}

/**
 * ---------- 3. O(1) Marriage Report Builder ----------
 * @param {Object} planetPositions - e.g. { Sun: { house: 7 }, Saturn: { house: 8 }, ... }
 * @param {string} ascendantSign - e.g. "Virgo" — used to derive the 7th Lord (O(1)) and functional nature
 * @param {number[]} focusHouses - houses to report on, defaults to MARRIAGE_FOCUS_HOUSES
 */
export function getMarriageReport(planetPositions, ascendantSign, focusHouses = MARRIAGE_FOCUS_HOUSES) {
  const placements = [];

  if (!planetPositions || !ascendantSign) {
    return {
      placements: [],
      seventhHouseSign: null,
      seventhHouseTheme: null,
      seventhHouseExpansion: null,
      seventhLord: null,
      seventhLordPlacement: null,
      seventhLordNature: null,
      seventhLordRemedy: null,
      seventhLordPlacementRemedy: null,
    };
  }

  const { seventhSign, seventhLordPlanet } = getSeventhLord(ascendantSign); // O(1)
  const seventhLordHouse = planetPositions[seventhLordPlanet]?.house || null;

  for (const [planet, pos] of Object.entries(planetPositions || {})) {
    if (!pos || !focusHouses.includes(pos.house)) continue;
    const key = `house_${pos.house}_${planet}`;
    const remedy = MARRIAGE_HOUSE_REMEDIES[key]; // O(1) hash lookup
    if (!remedy) continue;

    const nature = getFunctionalNature(planet, ascendantSign); // 'benefic' | 'malefic' | 'neutral'
    const isMalefic = nature === 'malefic';

    if (isMalefic) {
      placements.push({ planet, house: pos.house, nature, ...remedy });
    } else {
      placements.push({
        planet,
        house: pos.house,
        nature,
        theme: remedy.theme,
        coreRemedy: remedy.coreRemedy, // GEMSTONE field only
      });
    }
  }

  const lordKey = `lord7_${seventhLordPlanet}`;
  const lordRemedy = SEVENTH_LORD_REMEDIES[lordKey] || null; // O(1) hash lookup
  const seventhLordNature = seventhLordPlanet ? getFunctionalNature(seventhLordPlanet, ascendantSign) : null;

  return {
    placements,
    seventhHouseSign: seventhSign,
    seventhHouseTheme: SEVENTH_HOUSE_SIGN_THEMES[seventhSign] || null,
    seventhHouseExpansion: SEVENTH_HOUSE_SIGN_EXPANSIONS[seventhSign] || null,
    seventhLord: seventhLordPlanet,
    seventhLordPlacement: seventhLordHouse,
    seventhLordNature,
    seventhLordRemedy: lordRemedy,
    seventhLordPlacementRemedy: SEVENTH_LORD_PLACEMENT_REMEDIES[seventhLordHouse] || null,
  };
}