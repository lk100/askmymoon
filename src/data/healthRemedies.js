/**
 * healthRemedies.js
 * ------------------------------------------------------------
 * Paid "Health Report" data source (₹99 unlock).
 *
 * DESIGN GOAL: O(1) lookup at request time.
 * Every entry is pre-keyed as a flat string -> object map.
 * No loops, no nested [planet][sign][house] traversal, no .find().
 *
 * Two kinds of keys:
 *   1. house_<HouseNumber>_<Planet>   -> planet sitting in that house
 *   2. lord6_<Planet>                 -> planet that rules the 6th house
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
 * user — no "functional malefic/benefic", no "6th house", no
 * "ascendant". Those are internal classification concepts only.
 * Copy should read as plain remedy language ("this pattern",
 * "this placement", "this area of your health").
 *
 * FUNCTIONAL NATURE GATING:
 * A planet sitting in 1/6/8/12 only gets the FULL remedy writeup
 * (theme + core problem + practical + donation + gemstone) if it is
 * a functional malefic for this ascendant — that's where the actual
 * friction/problem lives astrologically. Functional benefics and
 * neutrals for that ascendant are naturally supportive placements,
 * so they only surface the GEMSTONE remedy (coreRemedy) as a
 * reinforcement — no "core problem" framing, since there isn't one
 * to report.
 *
 * NOTE ON MEDICAL SCOPE: nothing here is medical advice. Copy stays
 * at the level of lifestyle patterns and habits, and never names a
 * diagnosis or prescribes treatment.
 * ------------------------------------------------------------
 */

import { getFunctionalNature } from './planetaryData';

export const HEALTH_FOCUS_HOUSES = [1, 6, 8, 12];

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

// ---------- 1. Planet-in-House remedies (Health-relevant houses only) ----------
export const HEALTH_HOUSE_REMEDIES = {
  // ================= 1st House (body, vitality, overall constitution) =================
  "house_1_Sun": {
    theme: "Vitality is tied to confidence and being taken seriously",
    coreProblem: "Health can dip when you feel unseen or disrespected. You may push through fatigue to prove your strength, which over time puts strain on the heart, eyes, or blood pressure rather than actually protecting you.",
    practicalRemedy: "Build a daily energy check that doesn't depend on outside approval — track how you actually feel, not how capable you look to others.",
    quickRemedy: donationRemedyFor("Sun", "This eases ego-linked strain and supports steady, sustainable vitality."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to strengthen core vitality and stamina."),
  },
  "house_1_Moon": {
    theme: "The body responds directly to your emotional state",
    coreProblem: "Digestion, sleep, and immunity shift with your moods. Unprocessed emotion tends to show up physically before you consciously notice the underlying feeling.",
    practicalRemedy: "Keep a simple nightly wind-down routine so emotional swings don't disrupt sleep and appetite.",
    quickRemedy: donationRemedyFor("Moon", "This eases emotional volatility that shows up as physical symptoms."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to steady mood-linked physical sensitivity."),
  },
  "house_1_Mars": {
    theme: "High physical energy that needs a real outlet",
    coreProblem: "Suppressed frustration tends to surface as inflammation, overexertion injuries, or sudden accidents when you push your body too hard, too fast.",
    practicalRemedy: "Give restless energy a scheduled outlet — sport, a workout, physical work — rather than letting it build until it forces its own release.",
    quickRemedy: donationRemedyFor("Mars", "This eases accident-proneness and sudden physical flare-ups."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to channel physical drive safely."),
  },
  "house_1_Mercury": {
    theme: "Nervous system and mind are closely linked to your physical state",
    coreProblem: "Overthinking and mental overload can translate into tension headaches, skin issues, or restlessness that doesn't resolve with rest alone.",
    practicalRemedy: "Build short, regular breaks from mental tasks into your day rather than pushing through until you crash.",
    quickRemedy: donationRemedyFor("Mercury", "This calms an overactive nervous system."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support mental-physical balance."),
  },
  "house_1_Jupiter": {
    theme: "A generally resilient constitution, with a tendency toward excess",
    coreProblem: "You may overindulge — food, commitments, optimism about your own limits — and only notice the physical cost once it has already accumulated.",
    practicalRemedy: "Set simple moderation limits (portions, workload) in advance rather than relying on willpower in the moment.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports moderation and eases the effects of overindulgence."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support long-term resilience and vitality."),
  },
  "house_1_Venus": {
    theme: "Comfort-seeking habits shape your physical wellbeing",
    coreProblem: "Pleasant but sedentary or indulgent habits — rich food, inactivity, late nights — can quietly undercut an otherwise strong constitution.",
    practicalRemedy: "Pair comfort habits with a non-negotiable baseline of movement and sleep, so ease doesn't tip into neglect.",
    quickRemedy: donationRemedyFor("Venus", "This supports balance between comfort and healthy discipline."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced, sustainable vitality."),
  },
  "house_1_Saturn": {
    theme: "Health needs pacing, not pushing through",
    coreProblem: "You tend to under-rest and treat fatigue as something to override, which can turn manageable strain into chronic issues around joints, bones, or energy over time.",
    practicalRemedy: "Schedule rest and recovery like an appointment, not an afterthought — this constitution punishes neglect more than most.",
    quickRemedy: donationRemedyFor("Saturn", "This eases chronic fatigue and long-term physical strain."),
    coreRemedy: gemstoneRemedyFor("Saturn", "This is a slower-acting, powerful stone for sustained vitality — trial it carefully before committing."),
  },
  "house_1_Rahu": {
    theme: "Health concerns can appear suddenly or defy easy explanation",
    coreProblem: "Irregular routines, unusual symptoms, or health anxiety fed by too much unfiltered information can make this pattern feel harder to manage than it actually is.",
    practicalRemedy: "Keep a simple written symptom log for anything unusual and bring it to a qualified professional rather than researching alone.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies sudden, hard-to-explain health fluctuations."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to an unpredictable constitution."),
  },
  "house_1_Ketu": {
    theme: "You may disengage from your own physical needs",
    coreProblem: "A tendency toward detachment can mean symptoms go unnoticed or unaddressed simply because health isn't top of mind, until something becomes harder to ignore.",
    practicalRemedy: "Put a recurring reminder in place for basic checkups and self-care, since this pattern won't prompt itself naturally.",
    quickRemedy: donationRemedyFor("Ketu", "This restores engagement with basic physical self-care."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to sharpen attention toward the body's needs."),
  },

  // ================= 6th House (daily routine, minor illness, workload, prevention) =================
  "house_6_Sun": {
    theme: "Daily energy is tied to feeling capable and in control",
    coreProblem: "You may push through minor illness to avoid appearing weak, letting small issues like colds or digestive upsets drag on longer than they need to.",
    practicalRemedy: "Treat a sick day as a legitimate need, not a failure — rest early rather than after symptoms worsen.",
    quickRemedy: donationRemedyFor("Sun", "This eases stubborn minor illnesses tied to pushing through them."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support steady daily vitality."),
  },
  "house_6_Moon": {
    theme: "Daily habits are shaped by your emotional rhythm",
    coreProblem: "Digestive and immune issues here often track stress and mood more than diet alone — a hard week can show up as a stomach issue days later.",
    practicalRemedy: "Build one small daily ritual — tea, a short walk — that signals to your body it's safe to relax.",
    quickRemedy: donationRemedyFor("Moon", "This eases stress-linked digestive and immune sensitivity."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support a calmer daily rhythm."),
  },
  "house_6_Mars": {
    theme: "Strong physical stamina, but it needs pacing and recovery",
    coreProblem: "This placement commonly reflects a strong ability to carry work demands, yet a tendency to push beyond sustainable limits, which shows up as strain, recurring fatigue, or minor overuse issues when recovery is skipped.",
    practicalRemedy: "Build in a fixed recovery window after intense effort instead of treating rest as a reward or afterthought.",
    quickRemedy: donationRemedyFor("Mars", "This supports balanced physical strain and recovery."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to support steady, sustainable physical drive."),
  },
  "house_6_Mercury": {
    theme: "Nervous energy shapes your daily physical state",
    coreProblem: "A busy mind can translate into digestive sensitivity, restlessness, or minor recurring ailments like skin issues or allergies tied to mental overload.",
    practicalRemedy: "Build short mental-rest breaks into your workday rather than treating constant activity as productive.",
    quickRemedy: donationRemedyFor("Mercury", "This eases nervous-system-linked daily ailments."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support calmer daily focus."),
  },
  "house_6_Jupiter": {
    theme: "Generally good daily resilience, undercut by overcommitment",
    coreProblem: "You take on too much — for others and for yourself — which can quietly wear down an otherwise strong daily constitution over time.",
    practicalRemedy: "Set a weekly cap on obligations you take on, health-related or otherwise, and hold to it.",
    quickRemedy: donationRemedyFor("Jupiter", "This eases fatigue from overcommitment."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support sustainable daily resilience."),
  },
  "house_6_Venus": {
    theme: "Daily comfort habits are a double-edged sword",
    coreProblem: "Enjoyable routines around food, rest, and socializing can tip into minor imbalances — weight, energy, skin — if left unchecked by any structure.",
    practicalRemedy: "Keep one simple daily health habit non-negotiable, like a walk or a set bedtime, alongside your comfort habits.",
    quickRemedy: donationRemedyFor("Venus", "This supports balance between enjoyment and daily discipline."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced daily wellbeing."),
  },
  "house_6_Saturn": {
    theme: "Daily health is strongest when effort is paced with consistency",
    coreProblem: "This placement often indicates long working hours, chronic fatigue, or recurring strain in the joints, muscles, or digestion when rest is treated as expendable.",
    practicalRemedy: "Protect recovery as part of the routine itself, rather than something left to be earned after the work is done.",
    quickRemedy: donationRemedyFor("Saturn", "This supports the body when workload and recovery need to be balanced."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone for sustained daily stamina — trial it carefully under guidance."),
  },
  "house_6_Rahu": {
    theme: "Daily health patterns can be irregular or hard to pin down",
    coreProblem: "Inconsistent sleep, meals, or routines can create vague, shifting symptoms that are frustrating to diagnose or explain.",
    practicalRemedy: "Anchor at least one part of your daily routine — wake time or one fixed meal — to reduce overall irregularity.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies irregular daily health patterns."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to an unpredictable routine."),
  },
  "house_6_Ketu": {
    theme: "Daily self-care is easy to neglect",
    coreProblem: "Minor symptoms can go unaddressed simply because daily routines feel uninteresting to maintain, letting small issues quietly linger.",
    practicalRemedy: "Automate the basics with reminders or simple habits, so daily care doesn't rely on motivation you may not feel.",
    quickRemedy: donationRemedyFor("Ketu", "This restores engagement with daily self-care."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support consistent basic care."),
  },

  // ================= 8th House (chronic/hidden health, surgery, transformation) =================
  "house_8_Sun": {
    theme: "This area often reflects recovery, intensity, and a strong need for grounded self-trust",
    coreProblem: "A hidden or intense health pattern here often points to a need to let go of control and rely on steady guidance rather than pushing through alone.",
    practicalRemedy: "Use trusted medical guidance and structured recovery steps rather than trying to manage this pattern purely through willpower.",
    quickRemedy: donationRemedyFor("Sun", "This supports stability during recovery and periods of intense adjustment."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support strength through recovery and restoration."),
  },
  "house_8_Moon": {
    theme: "This pattern often connects emotional steadiness with recovery and long-term healing",
    coreProblem: "Hidden or chronic health patterns here can be shaped by emotional stress, and recovery often works better when the emotional side is addressed as seriously as the physical.",
    practicalRemedy: "Pair a recovery plan with emotional support, routine, and adequate rest rather than focusing only on procedures or symptoms.",
    quickRemedy: donationRemedyFor("Moon", "This supports calm and steady recovery when emotional strain is involved."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support emotional balance through healing."),
  },
  "house_8_Mars": {
    theme: "This pattern can involve intense physical strain, surgery, or a sharp recovery phase",
    coreProblem: "The body here often responds to strong force or sudden change, and the real lesson is to respect recovery time rather than rushing back into activity.",
    practicalRemedy: "Follow post-incident or post-surgery guidance closely and avoid accelerating activity before the body is ready.",
    quickRemedy: donationRemedyFor("Mars", "This supports safe recovery after strain, surgery, or a sudden physical setback."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to support strength and steadiness during physical recovery."),
  },
  "house_8_Mercury": {
    theme: "This pattern often reflects stress-linked or hidden physical sensitivity",
    coreProblem: "The body may carry strain through the nervous system here, and recurring, unexplained symptoms often need proper assessment rather than being dismissed as ordinary stress.",
    practicalRemedy: "Take recurring or unusual symptoms seriously and get a clear diagnosis before ignoring them or overworking through them.",
    quickRemedy: donationRemedyFor("Mercury", "This supports clarity and balance when stress and physical sensitivity are intertwined."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support calm, steady recovery and clear-minded healing."),
  },
  "house_8_Jupiter": {
    theme: "This pattern usually supports recovery once issues are acknowledged and treated early",
    coreProblem: "An optimistic attitude here can sometimes delay direct action, but the real pattern is one of resilience when the underlying issue is properly addressed.",
    practicalRemedy: "Use optimism as a support, not a reason to avoid proper checkups or structured treatment when something persists.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports steady recovery and a return to balanced strength."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support recovery, resilience, and long-term restoration."),
  },
  "house_8_Venus": {
    theme: "This pattern often points to discomfort, sensitivity, or delayed attention in a private health matter",
    coreProblem: "There may be a tendency to avoid a discomforting issue until it becomes harder to ignore, especially in areas connected to comfort, balance, or reproductive health.",
    practicalRemedy: "Address sensitive health topics early and without delay, rather than allowing discomfort to become avoidance.",
    quickRemedy: donationRemedyFor("Venus", "This supports calm and steadiness when a sensitive issue needs attention."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced healing and a gentler return to wellbeing."),
  },
  "house_8_Saturn": {
    theme: "This pattern often reflects long-term strain, chronic build-up, or a gradual health issue",
    coreProblem: "The body here can carry slow-developing strain in joints, bones, or endurance-related areas, which means regular checkups and pacing matter more than intense effort.",
    practicalRemedy: "Use consistent monitoring and structured recovery rather than waiting for symptoms to become severe before paying attention.",
    quickRemedy: donationRemedyFor("Saturn", "This supports balance when long-term strain or gradual wear needs gentle protection."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting, powerful stone for long-term recovery and sustained strength — trial it carefully under guidance."),
  },
  "house_8_Rahu": {
    theme: "This pattern can involve sudden or unexplained physical irregularity",
    coreProblem: "Unusual symptoms or hard-to-diagnose fluctuations may appear here, and the most useful response is calm investigation rather than repeated over-analysis.",
    practicalRemedy: "Get a second opinion or a clearer assessment when symptoms are unclear, instead of relying on one source or a long period of uncertainty.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies anxious energy around uncertain or irregular physical symptoms."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to unpredictable health patterns."),
  },
  "house_8_Ketu": {
    theme: "This pattern often points to hidden strain that needs steady attention before it becomes more intense",
    coreProblem: "A tendency to ignore ongoing signals can allow deeper issues to linger, especially when the body is quietly asking for support without a dramatic warning.",
    practicalRemedy: "Establish a routine of checkups or regular body-awareness habits so quiet warning signs are noticed before they accumulate.",
    quickRemedy: donationRemedyFor("Ketu", "This restores attention to overlooked or ongoing health needs."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to sharpen awareness of the body's signals and support careful recovery."),
  },

  // ================= 12th House (rest, sleep, hospitalization, hidden ailments, mental quiet) =================
  "house_12_Sun": {
    theme: "Rest is hard for you to fully accept",
    coreProblem: "You may resist slowing down or being cared for because it feels like losing standing, which can delay needed recovery.",
    practicalRemedy: "Treat rest as a strategic choice, not a defeat — recovery time protects your ability to lead later.",
    quickRemedy: donationRemedyFor("Sun", "This eases resistance to necessary rest and recovery."),
    coreRemedy: gemstoneRemedyFor("Sun", "This stone is traditionally used to support renewal through rest."),
  },
  "house_12_Moon": {
    theme: "Sleep and emotional processing are deeply connected for you",
    coreProblem: "Poor sleep or unprocessed emotion tends to compound quickly here, affecting overall health more than it would for most people.",
    practicalRemedy: "Protect a consistent sleep schedule as a genuine health priority, not a flexible one.",
    quickRemedy: donationRemedyFor("Moon", "This supports restful, restorative sleep."),
    coreRemedy: gemstoneRemedyFor("Moon", "This stone is traditionally used to support emotional and physical rest."),
  },
  "house_12_Mars": {
    theme: "Restlessness makes true rest difficult",
    coreProblem: "You may struggle to actually slow down even when your body needs it, which can turn manageable fatigue into burnout.",
    practicalRemedy: "Schedule complete rest days in advance, since waiting until you 'feel like resting' rarely works for this pattern.",
    quickRemedy: donationRemedyFor("Mars", "This eases restlessness that prevents real recovery."),
    coreRemedy: gemstoneRemedyFor("Mars", "This stone is traditionally used to support calm, complete rest."),
  },
  "house_12_Mercury": {
    theme: "An overactive mind interferes with real rest",
    coreProblem: "Mental chatter and overstimulation from screens and constant input can keep you from truly resting even when you have the time for it.",
    practicalRemedy: "Build a screen-free wind-down period before sleep to give your mind a genuine chance to quiet.",
    quickRemedy: donationRemedyFor("Mercury", "This calms mental overstimulation that disrupts rest."),
    coreRemedy: gemstoneRemedyFor("Mercury", "This stone is traditionally used to support a quieter mind before sleep."),
  },
  "house_12_Jupiter": {
    theme: "You recover well once you actually allow yourself to rest",
    coreProblem: "You may over-commit to helping others or taking on responsibility, leaving little room for the rest your body actually needs.",
    practicalRemedy: "Schedule true downtime the same way you'd schedule any other commitment, and protect it.",
    quickRemedy: donationRemedyFor("Jupiter", "This supports genuine recovery time."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "This stone is traditionally used to support restorative rest."),
  },
  "house_12_Venus": {
    theme: "Comfort and rest are closely linked for you",
    coreProblem: "You may confuse leisure activity like socializing or entertainment with actual rest, leaving you tired even after time off.",
    practicalRemedy: "Build in genuinely quiet, low-stimulation downtime, separate from your usual comfort activities.",
    quickRemedy: donationRemedyFor("Venus", "This supports genuine, restorative quiet time."),
    coreRemedy: gemstoneRemedyFor("Venus", "This stone is traditionally used to support balanced rest."),
  },
  "house_12_Saturn": {
    theme: "Rest doesn't come naturally, but you need it more than most",
    coreProblem: "You tend to treat rest as unproductive, which can lead to chronic under-recovery and slow-building exhaustion.",
    practicalRemedy: "Redefine rest as part of your discipline, not the opposite of it — recovery is what sustains long-term output.",
    quickRemedy: donationRemedyFor("Saturn", "This eases chronic under-recovery and exhaustion."),
    coreRemedy: gemstoneRemedyFor("Saturn", "A slower-acting stone supporting long-term rest and recovery — trial it carefully."),
  },
  "house_12_Rahu": {
    theme: "Sleep and rest patterns can be irregular or disrupted",
    coreProblem: "Unusual sleep patterns, vivid or disturbing dreams, or hospital-related anxiety can make rest feel unpredictable.",
    practicalRemedy: "Keep a consistent wind-down routine to counteract the pull toward irregular hours.",
    quickRemedy: donationRemedyFor("Rahu", "This steadies irregular or disrupted rest patterns."),
    coreRemedy: gemstoneRemedyFor("Rahu", "This stone is traditionally used to bring grounding to disrupted sleep."),
  },
  "house_12_Ketu": {
    theme: "You may need more solitary rest than most people",
    coreProblem: "A pull toward withdrawal and quiet is natural for you, but too much isolation during rest can tip into disconnection rather than recovery.",
    practicalRemedy: "Balance solitary rest with occasional light connection so recovery doesn't become isolation.",
    quickRemedy: donationRemedyFor("Ketu", "This supports balanced, restorative solitude."),
    coreRemedy: gemstoneRemedyFor("Ketu", "This stone is traditionally used to support peaceful, grounded rest."),
  },
};

// ---------- 2. 6th Lord remedies (who RULES the 6th house — your overall daily-health pattern) ----------
export const SIXTH_LORD_REMEDIES = {
  "lord6_Sun": {
    theme: "Your daily health rhythm is tied to feeling capable and respected",
    coreProblem: "Overall wellbeing dips when you feel unseen or undervalued, and you may neglect basic care while trying to prove your strength.",
    practicalRemedy: "Build a daily health routine that isn't dependent on outside validation — track your own energy honestly.",
    quickRemedy: donationRemedyFor("Sun", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Sun", "As your overall health-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Suryaya Namah",
  },
  "lord6_Moon": {
    theme: "Overall health is closely tied to emotional stability",
    coreProblem: "Your baseline wellbeing rises and falls with your mood more than most, and unprocessed emotion tends to surface physically.",
    practicalRemedy: "A stable daily rhythm around meals and sleep protects your health even during emotionally rough patches.",
    quickRemedy: donationRemedyFor("Moon", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Moon", "As your overall health-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Chandraya Namah",
  },
  "lord6_Mars": {
    theme: "Well-being improves with movement, structure, and release of built-up strain",
    coreProblem: "This pattern often indicates that physical energy is strong, but it becomes uncomfortable when pressure builds without an outlet, showing up as recurring strain, irritation, or overuse.",
    practicalRemedy: "Regular, disciplined movement is a strong health anchor for this pattern and helps prevent accumulated physical tension.",
    quickRemedy: donationRemedyFor("Mars", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Mars", "As your overall health-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Angarakaya Namah",
  },
  "lord6_Mercury": {
    theme: "Your health is closely linked to mental load",
    coreProblem: "An overloaded mind shows up physically for you — tension, digestive sensitivity, restlessness — faster than it does for most people.",
    practicalRemedy: "Protect regular mental downtime as seriously as you'd protect physical rest.",
    quickRemedy: donationRemedyFor("Mercury", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Mercury", "As your overall health-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Budhaya Namah",
  },
  "lord6_Jupiter": {
    theme: "A generally strong constitution, undercut by overcommitment",
    coreProblem: "You tend to overextend yourself for others, and your own health maintenance quietly slips down the priority list.",
    practicalRemedy: "Treat your own basic health routine as a non-negotiable commitment, not something to fit in if time allows.",
    quickRemedy: donationRemedyFor("Jupiter", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Jupiter", "As your overall health-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Brihaspataye Namah",
  },
  "lord6_Venus": {
    theme: "Your health is tied to comfort and balance",
    coreProblem: "Pleasant but unstructured habits can tip into imbalance without you fully noticing, until the pattern is already established.",
    practicalRemedy: "Pair enjoyable habits with one consistent structural anchor, such as a fixed sleep time or regular movement.",
    quickRemedy: donationRemedyFor("Venus", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Venus", "As your overall health-ruling placement, this is the single most impactful stone to consider for consistent, long-term wear."),
    mantraRemedy: "Om Shukraya Namah",
  },
  "lord6_Saturn": {
    theme: "Long-term vitality improves when effort is paced with consistency",
    coreProblem: "This pattern often reflects a tendency to keep moving through stress, fatigue, or recurring physical strain until the body signals that recovery needs to be built into the routine.",
    practicalRemedy: "Treat recovery and rest as part of a sustainable discipline, not as a separate luxury or reward.",
    quickRemedy: donationRemedyFor("Saturn", "This is the primary donation to support this pattern — repeat it consistently rather than as a one-off."),
    coreRemedy: gemstoneRemedyFor("Saturn", "As your overall health-ruling placement, this stone is worth a proper trial period under guidance before committing to regular wear."),
    mantraRemedy: "Om Shanicharaya Namah",
  },
};

/**
 * ---------- 2b. Sign -> Lord map + 6th-lord derivation ----------
 * NOTE: the 6th house is always ruled by Sun, Moon, Mars, Mercury,
 * Jupiter, Venus, or Saturn (never Rahu/Ketu, since they don't rule
 * signs), so SIXTH_LORD_REMEDIES intentionally has no Rahu/Ketu entry.
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

const SIXTH_HOUSE_SIGN_THEMES = {
  Aries: 'Vitality grows through movement, initiative, healthy competition, and direct stress release.',
  Taurus: 'Vitality grows through regular nourishment, sleep, comfort, and steady physical routines.',
  Gemini: 'Vitality depends on balanced mental stimulation, breathing space, movement, and manageable variety.',
  Cancer: 'Vitality grows through emotional safety, nourishing habits, rest, and a supportive home rhythm.',
  Leo: 'Vitality grows through confidence, sunlight, creative expression, warmth, and joyful movement.',
  Virgo: 'Vitality grows through consistent routines, practical prevention, digestion-friendly habits, and order.',
  Libra: 'Vitality grows through balance, pleasant surroundings, social harmony, and moderated habits.',
  Scorpio: 'Vitality grows through deep recovery, emotional honesty, transformation, and releasing held tension.',
  Sagittarius: 'Vitality grows through outdoor movement, optimism, learning, travel, and enough freedom.',
  Capricorn: 'Vitality grows through disciplined pacing, structure, strength-building, and sustainable ambition.',
  Aquarius: 'Vitality grows through fresh routines, community, circulation, technology boundaries, and flexibility.',
  Pisces: 'Vitality grows through rest, hydration, creative release, spiritual grounding, and clear boundaries.',
};

const SIXTH_HOUSE_SIGN_EXPANSIONS = {
  Aries: { strengths: 'Quick recovery, high energy, natural resilience.', watchOut: 'Overexertion and impatience with rest.', direction: 'Pair intensity with real, scheduled recovery time.' },
  Taurus: { strengths: 'Steady stamina and strong resistance once routines are set.', watchOut: 'Comfort-driven inertia.', direction: 'Keep gentle, consistent movement as a daily habit.' },
  Gemini: { strengths: 'Adaptable energy and quick mental recovery.', watchOut: 'Nervous overstimulation.', direction: 'Protect quiet, screen-free downtime.' },
  Cancer: { strengths: 'A strong intuitive sense of what the body needs.', watchOut: 'Mood-driven health dips.', direction: 'Anchor health to a stable daily rhythm.' },
  Leo: { strengths: 'Natural vitality and resilience.', watchOut: 'Pushing through to maintain image.', direction: 'Let rest be a form of strength, not weakness.' },
  Virgo: { strengths: 'Disciplined, detail-oriented self-care.', watchOut: 'Health anxiety or over-monitoring.', direction: 'Trust a simple, sustainable routine over constant tweaking.' },
  Libra: { strengths: 'Balance-seeking, moderate habits.', watchOut: 'Avoiding necessary but uncomfortable health decisions.', direction: 'Address health issues directly rather than postponing them.' },
  Scorpio: { strengths: 'Deep recovery capacity once committed.', watchOut: 'Hiding symptoms or avoiding checkups.', direction: 'Bring hidden health concerns into the open early.' },
  Sagittarius: { strengths: 'Optimism and resilience; enjoys active living.', watchOut: 'Overextension while traveling or expanding.', direction: 'Keep one grounding health habit no matter where you are.' },
  Capricorn: { strengths: 'Discipline and long-term consistency.', watchOut: 'Treating rest as unproductive.', direction: 'Build recovery into your definition of discipline.' },
  Aquarius: { strengths: 'Openness to new, innovative health approaches.', watchOut: 'Detachment from the body\'s basic signals.', direction: 'Pair new ideas with consistent basic care.' },
  Pisces: { strengths: 'Sensitive, intuitive awareness of wellbeing.', watchOut: 'Blurred boundaries around rest and escapism.', direction: 'Give rest and self-care clear structure and limits.' },
};

const SIXTH_LORD_PLACEMENT_REMEDIES = {
  1: { theme: 'Health is closely tied to your sense of self and daily choices.', remedy: 'Build one core wellness habit into your identity rather than treating health as separate from who you are.', action: 'Pick one non-negotiable daily health habit and track it.', watchOut: 'Don\'t let self-image push you to override real physical signals.' },
  2: { theme: 'Health is connected to diet, speech, and accumulated habits.', remedy: 'Keep eating and daily habits consistent rather than reactive.', action: 'Review your typical diet and routine once a month.', watchOut: 'Avoid letting stress change your habits without noticing.' },
  3: { theme: 'Health responds to effort, courage, and daily movement.', remedy: 'Use consistent physical activity as your main health lever.', action: 'Build a short daily movement habit you can sustain.', watchOut: 'Restlessness can turn into overexertion without structure.' },
  4: { theme: 'Health is tied to home stability and emotional security.', remedy: 'Protect a calm home environment as part of your health routine.', action: 'Create one calming ritual at home you return to daily.', watchOut: 'Unresolved home stress can quietly affect physical wellbeing.' },
  5: { theme: 'Health connects to stress relief through creativity and joy.', remedy: 'Make space for genuine enjoyment as part of maintaining health, not a reward for it.', action: 'Schedule one purely enjoyable activity weekly.', watchOut: 'Don\'t let joy become another obligation to optimize.' },
  6: { theme: 'Health and daily routine are central, direct strengths.', remedy: 'Lean into structured daily habits — this is naturally your strongest health area.', action: 'Keep a simple, consistent daily health checklist.', watchOut: 'Don\'t let perfectionism about routine become its own stressor.' },
  7: { theme: 'Health is influenced by close relationships and partnership dynamics.', remedy: 'Address relationship stress directly rather than letting it show up physically.', action: 'Have one honest check-in conversation when tension builds.', watchOut: 'Don\'t absorb a partner\'s stress as your own without boundaries.' },
  8: { theme: 'Health needs attention to hidden or chronic patterns.', remedy: 'Take recurring or unusual symptoms seriously and get them checked early.', action: 'Schedule a proper checkup at least once a year.', watchOut: 'Avoid dismissing early warning signs as unimportant.' },
  9: { theme: 'Health benefits from a broader perspective and sense of purpose.', remedy: 'Keep a sense of meaning connected to your daily routine, not just discipline for its own sake.', action: 'Revisit why your health habits matter to you every few months.', watchOut: 'Don\'t let travel or busy periods fully derail your routine.' },
  10: { theme: 'Health is closely tied to work demands and career pressure.', remedy: 'Protect recovery time from being consumed by career pressure.', action: 'Set a firm boundary around work hours affecting rest.', watchOut: 'Burnout here often masquerades as simple tiredness.' },
  11: { theme: 'Health is influenced by your social circle and shared habits.', remedy: 'Choose a social circle whose habits support, not undermine, your health goals.', action: 'Find one health-minded friend or group to stay accountable with.', watchOut: 'Peer pressure can quietly erode good habits.' },
  12: { theme: 'Health depends heavily on genuine rest and quiet.', remedy: 'Protect solitary rest and sleep as a core, not optional, health practice.', action: 'Set a consistent wind-down and sleep schedule.', watchOut: 'Chronic under-rest here compounds quietly over time.' },
};

/**
 * Given the ascendant sign, returns which sign falls in the 6th house
 * and which planet rules it (the "6th Lord" — primary health indicator).
 * @param {string} ascendantSign - e.g. "Virgo"
 */
export function getSixthLord(ascendantSign) {
  const startIndex = SIGN_ORDER.indexOf(ascendantSign);
  if (startIndex === -1) return { sixthSign: null, sixthLordPlanet: null };
  const sixthSign = SIGN_ORDER[(startIndex + 5) % 12]; // 6th house = +5 signs from ascendant
  return { sixthSign, sixthLordPlanet: SIGN_LORD[sixthSign] || null };
}

/**
 * ---------- 3. O(1) Health Report Builder ----------
 * @param {Object} planetPositions - e.g. { Sun: { house: 6 }, Saturn: { house: 12 }, ... }
 * @param {string} ascendantSign - e.g. "Virgo" — used to derive the 6th Lord (O(1)) and functional nature
 * @param {number[]} focusHouses - houses to report on, defaults to HEALTH_FOCUS_HOUSES
 */
export function getHealthReport(planetPositions, ascendantSign, focusHouses = HEALTH_FOCUS_HOUSES) {
  const placements = [];

  if (!planetPositions || !ascendantSign) {
    return {
      placements: [],
      sixthHouseSign: null,
      sixthHouseTheme: null,
      sixthHouseExpansion: null,
      sixthLord: null,
      sixthLordPlacement: null,
      sixthLordNature: null,
      sixthLordRemedy: null,
      sixthLordPlacementRemedy: null,
    };
  }

  const { sixthSign, sixthLordPlanet } = getSixthLord(ascendantSign); // O(1)
  const sixthLordHouse = planetPositions[sixthLordPlanet]?.house || null;

  for (const [planet, pos] of Object.entries(planetPositions || {})) {
    if (!pos || !focusHouses.includes(pos.house)) continue;
    const key = `house_${pos.house}_${planet}`;
    const remedy = HEALTH_HOUSE_REMEDIES[key]; // O(1) hash lookup
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

  const lordKey = `lord6_${sixthLordPlanet}`;
  const lordRemedy = SIXTH_LORD_REMEDIES[lordKey] || null; // O(1) hash lookup
  const sixthLordNature = sixthLordPlanet ? getFunctionalNature(sixthLordPlanet, ascendantSign) : null;

  return {
    placements,
    sixthHouseSign: sixthSign,
    sixthHouseTheme: SIXTH_HOUSE_SIGN_THEMES[sixthSign] || null,
    sixthHouseExpansion: SIXTH_HOUSE_SIGN_EXPANSIONS[sixthSign] || null,
    sixthLord: sixthLordPlanet,
    sixthLordPlacement: sixthLordHouse,
    sixthLordNature,
    sixthLordRemedy: lordRemedy,
    sixthLordPlacementRemedy: SIXTH_LORD_PLACEMENT_REMEDIES[sixthLordHouse] || null,
  };
}