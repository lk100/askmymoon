// data/ascendantRemedies.js
//
// Structure per Ascendant (identity data only now):
// - element, ruler, tagline, color, basicMantra, generalRemedy
//
// LIFELINE_PROBLEMS — per Ascendant x House, the core problem the
// person actually feels — specific, second person, names the cost.
// LIFELINE_REMEDIES — same keying, real astrological/spiritual
// remedies (mantra, donation, day-specific ritual tied to the
// Ascendant lord) addressing that specific problem — not generic
// behavioral advice.
//
// getPrimaryBottleneck(ascendantSign, rulerHouse) -> problem text (left card)
// getLifelineRemedy(ascendantSign, rulerHouse)     -> remedy text (right card)

export const ASCENDANT_REMEDIES = {
  Aries: { element: "Fire", ruler: "Mars", tagline: "The Fighter", color: "Red or Coral", basicMantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah", generalRemedy: "Offer water to the rising sun on Tuesdays and keep a piece of coral or red thread on you — Mars steadies fastest through discipline, not more fire." },
  Taurus: { element: "Earth", ruler: "Venus", tagline: "The Builder", color: "White or Light Pink", basicMantra: "Om Dram Dreem Droum Sah Shukraya Namah", generalRemedy: "Light a ghee lamp on Fridays and donate something white — rice, sugar, or cloth — to soften Venus's grip on comfort and security." },
  Gemini: { element: "Air", ruler: "Mercury", tagline: "The Messenger", color: "Green", basicMantra: "Om Bram Breem Broum Sah Budhaya Namah", generalRemedy: "Feed green gram (moong) to birds or the needy on Wednesdays — it steadies a Mercury mind that scatters faster than it finishes." },
  Cancer: { element: "Water", ruler: "Moon", tagline: "The Nurturer", color: "Pearl White or Silver", basicMantra: "Om Shram Shreem Shroum Sah Chandraya Namah", generalRemedy: "Offer raw milk or white rice to Shiva on Mondays and keep a silver object close to your body — it steadies a Moon that reads every room's mood as its own." },
  Leo: { element: "Fire", ruler: "Sun", tagline: "The Sovereign", color: "Saffron or Gold", basicMantra: "Om Hram Hreem Hroum Sah Suryaya Namah", generalRemedy: "Offer water to the Sun at sunrise on Sundays, facing east — it grounds a need for recognition in something steadier than other people's applause." },
  Virgo: { element: "Earth", ruler: "Mercury", tagline: "The Analyst", color: "Emerald Green", basicMantra: "Om Bram Breem Broum Sah Budhaya Namah", generalRemedy: "Donate green vegetables or moong dal on Wednesdays — it loosens a Mercury that polishes past the point of usefulness." },
  Libra: { element: "Air", ruler: "Venus", tagline: "The Diplomat", color: "Off-White or Pastel Blue", basicMantra: "Om Dram Dreem Droum Sah Shukraya Namah", generalRemedy: "Donate white or light-colored clothing on Fridays, and set one decision deadline for yourself this week — Venus resolves faster with structure than with more options." },
  Scorpio: { element: "Water", ruler: "Mars", tagline: "The Strategist", color: "Dark Red or Maroon", basicMantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah", generalRemedy: "Offer jaggery and red lentils to Hanuman on Tuesdays — it gives Mars's intensity somewhere safe to go before it comes out sideways." },
  Sagittarius: { element: "Fire", ruler: "Jupiter", tagline: "The Explorer", color: "Yellow or Ochre", basicMantra: "Om Gram Greem Groum Sah Gurave Namah", generalRemedy: "Donate turmeric, yellow lentils, or a religious text on Thursdays, and pick one commitment to finish this month before starting anything new." },
  Capricorn: { element: "Earth", ruler: "Saturn", tagline: "The Achiever", color: "Dark Blue or Navy", basicMantra: "Om Pram Preem Proum Sah Shanaishcharaya Namah", generalRemedy: "Light a mustard oil lamp on Saturdays and feed crows or the underprivileged — it eases a Saturn that only ever recognizes effort, never rest." },
  Aquarius: { element: "Air", ruler: "Saturn", tagline: "The Visionary", color: "Electric Blue or Charcoal", basicMantra: "Om Pram Preem Proum Sah Shanaishcharaya Namah", generalRemedy: "Donate black sesame or iron items on Saturdays — it warms a Saturn placement that keeps people at exactly arm's length." },
  Pisces: { element: "Water", ruler: "Jupiter", tagline: "The Dreamer", color: "Yellow or Sea Green", basicMantra: "Om Gram Greem Groum Sah Gurave Namah", generalRemedy: "Offer turmeric water to a peepal tree on Thursdays, and name one boundary out loud before it gets crossed quietly again." }
};

// ============================================================
// LIFELINE_PROBLEMS — unchanged: this is the free hook, and it's
// doing its job. Second person, specific, names the cost.
// ============================================================
export const LIFELINE_PROBLEMS = {
  Aries: {
    1: "You've started more things this year than you've finished, and some part of you already knows the count. The rush at the beginning feels like proof you're alive — the follow-through never quite arrives with the same intensity. People close to you have quietly learned to wait and see if this one sticks.",
    2: "You've bought something recently you can't fully justify, and you knew it while you were buying it. Money moves fastest through your hands right after a win or a bad mood — never in between. The people closest to you have learned to brace when your voice gets short.",
    3: "You win almost every argument you're in, and you've started to notice the room goes quiet afterward instead of settled. The words land exactly where you aim them — that's the actual problem. Someone close has stopped bringing things up with you, not because it doesn't matter, but because it's easier not to.",
    4: "You can feel the temperature of a room shift before anyone says anything, and more often than you'd like, you're the one who shifted it. Home is supposed to be where the pressure comes off — for you it's sometimes where it goes on first.",
    5: "You fall into things — a person, an idea, a project — headfirst and immediately certain, and you've been wrong about that certainty before. Somewhere there's a person or a project that got the fastest, most convincing version of you, then watched it fade sooner than they expected.",
    6: "You can outwork almost anyone when there's a real fight worth having, and you've picked fights that weren't worth having just to have somewhere to put the energy. The ones that weren't real have cost you more than you've actually tallied.",
    7: "You say exactly what you mean, and the person across from you has, more than once, heard it as an attack when it wasn't meant as one. You've noticed the small hesitation before they speak to you now.",
    8: "There's a decision you made under pressure — about money, or about your body — that you wouldn't make again with a clear head. You already know which one. The consequences arrived later than the decision did, which is exactly why you didn't see them coming.",
    9: "You've dismissed an idea, a teacher, or an older way of doing something faster than you actually understood it, because agreeing first felt like losing. Some of what you walked away from was worth more than your pride let you admit at the time.",
    10: "You've moved fast enough at work to outrun your own reputation, and there's at least one person above you who remembers the version of you that moved too fast. The promotion and the friction came from the same instinct — you don't get to keep one without the other.",
    11: "You've chased a number — income, a goal, a milestone — faster than the plan underneath it was ready for. There's a decision from the last year you'd unwind if you could, made in a hurry that didn't need to be one.",
    12: "You sleep worse than you let on. The energy that used to go into a fight now has nowhere to go, so it goes inward — a clenched jaw, a racing mind at 2am, a frustration you haven't said out loud to anyone, including yourself."
  },

  Taurus: {
    1: "You've said no to a change that, deep down, you knew was overdue — not because it was wrong, but because it wasn't familiar yet. Comfort has quietly become your identity, and anything that threatens it feels like a threat to you personally.",
    2: "Your savings account is probably healthier than most people's, and you still feel a flicker of anxiety spending on things you can clearly afford. Somewhere that carefulness has tipped into holding on too tight, and it's cost you a risk worth taking.",
    3: "There's a conversation you've been avoiding for longer than you'd admit, purely because saying it out loud would break the peace. The peace you're protecting isn't real anymore — it's just quiet.",
    4: "You've resisted moving, renovating, or changing a routine you don't even like that much, simply because it's the one you know. Something in your life has stayed the same for the wrong reasons.",
    5: "Your loyalty in love runs deep, and there's a version of that loyalty that's shown up as gripping a little too tightly when someone needed space. You've felt the tension of loving someone and also wanting to control the shape of it.",
    6: "You know exactly which habit is quietly working against your health, and you've kept it anyway because changing it feels like more effort than it's worth today. It's been 'today' for a while now.",
    7: "Your partner has asked, directly or indirectly, for something to change between you, and some part of you dug in instead of leaning in. Stability is your gift — it's also occasionally been your excuse.",
    8: "There's a shared financial conversation — a joint account, a split cost, a debt — that you've let sit rather than open, because opening it might mean something has to shift.",
    9: "You've heard an idea that genuinely challenged what you believe, and you closed the door on it a little too fast, a little too comfortably. Growth was on the other side of that door.",
    10: "You've stayed in a role or a company past the point it was actually serving you, because leaving felt riskier than staying — even as staying quietly cost you momentum.",
    11: "There's a friendship or an income stream you've kept alive out of loyalty long after it stopped giving back. You already know which one.",
    12: "There's something you've been avoiding facing entirely, and comfort has become the excuse rather than the reason. The stillness you've built isn't peace — it's a way of not looking at it."
  },

  Gemini: {
    1: "You've made a decision that felt clear in the moment and murky an hour later, because a new thought talked you out of the first one. Your mind moves faster than your follow-through, and it's cost you more finished things than you'd like to count.",
    2: "You know exactly how many small subscriptions, side accounts, or half-tracked expenses are quietly draining you, because you've meant to consolidate them for months. Saving feels harder than it should be — not because you don't earn enough, but because your attention won't sit still on it.",
    3: "You've talked yourself out of a commitment mid-way through, after starting it with real enthusiasm. Somewhere someone's still waiting on something you were excited about a month ago.",
    4: "Your mind stays busy even in your own home, and someone close to you has felt you being physically present but somewhere else entirely. They've stopped trying to get your full attention some evenings.",
    5: "You have more unfinished creative ideas than finished ones, and you know it. The excitement of the beginning is real — it's just rarely still there by the middle.",
    6: "You solve problems quickly and well, and you've also turned a simple task into an overthought one more than once this month, burning energy on something that needed ten minutes, not an hour.",
    7: "You've replayed something your partner said, turning it over for meaning that probably wasn't there. The doubt you built in your head was louder than anything they actually meant.",
    8: "Your curiosity has pulled you into something — a rumor, someone else's business, a secret not yours to hold — that gave you nothing back except distraction from your own life.",
    9: "You can argue a belief brilliantly and have never actually tested whether you live by it. The gap between what you say and what you do is wider than you'd want someone to point out.",
    10: "You've got three initiatives half-started at work right now, and you know which one is actually going to move your career and which two are just interesting. You haven't picked yet.",
    11: "You've made a new contact, a new idea, a new maybe-opportunity this month — and let the one from last month go cold. Growth for you isn't a supply problem, it's a follow-through problem.",
    12: "Your mind doesn't stop at night. The conversation you should have had today is happening in your head at midnight instead, on a loop, changing nothing."
  },

  Cancer: {
    1: "Your mood has decided things today that your actual judgment wouldn't have chosen. People can read your emotional weather before you've said a word, and you've let that weather drive a decision you regretted the next day.",
    2: "Your sense of financial safety rises and falls with your bank balance more than it should for someone as capable as you are. A dip that would barely register for someone else has kept you up at night.",
    3: "You've carried a feeling into a simple conversation and made it heavier than it needed to be — with a sibling, a collaborator, someone who just wanted to talk logistics and got your whole emotional state instead.",
    4: "You're more attached to your home, your routines, your past, than you let on, and it's quietly slowed you down from a change you actually need to make.",
    5: "A romantic high or low hit you harder than you showed anyone, and you processed it alone instead of saying it out loud, which only made it heavier.",
    6: "Your body has been telling you something for a while — tiredness, a knot in your stomach, restlessness — that's actually about stress you haven't named, not about your body itself.",
    7: "You've absorbed someone else's mood so completely that you couldn't tell, for a moment, which feelings were actually yours. That merging has cost you your own footing more than once.",
    8: "A change you didn't choose hit you harder and longer than it should have. You're still carrying weight from a transition you never fully let yourself feel through.",
    9: "You've stuck with a belief mostly because it feels like home, not because you've actually tested it against anything new. Comfort and truth aren't always the same thing, and you know that.",
    10: "Your reputation at work has taken a small hit on a day your mood, not your competence, was doing the driving. People remember the off days more than you'd like.",
    11: "A social gain or loss landed on you personally, harder than it should have. Your friendships carry more emotional weight for you than for most people around you, and it shows.",
    12: "You've chosen to withdraw and process alone more than once this month, when saying the feeling out loud to one person would have actually helped. The silence isn't peace — it's storage."
  },

  Leo: {
    1: "You've done something genuinely good recently and quietly waited for someone to notice before you let yourself feel proud of it. When the notice didn't come fast enough, some of the shine came off the thing itself.",
    2: "Your sense of self-worth moves with your bank balance more than you'd admit to most people. A good month makes you feel like more of a person; a lean one makes you feel smaller than you are.",
    3: "You've spoken over a quieter voice in a room this month, not out of unkindness, but because your idea felt too good not to say first. Someone didn't get to finish their thought.",
    4: "You've felt the pressure of your home needing to look a certain way to guests, to family, to yourself — and the gap between the image and the reality has cost you actual peace.",
    5: "You've created something and felt the joy of it deflate the moment it didn't get the reaction you were quietly hoping for. The making itself used to be enough — check whether it still is.",
    6: "You've done something well at work that nobody noticed, and the frustration from that has leaked into how you show up the rest of the week.",
    7: "You've needed more visible appreciation from your partner than you've said out loud, and the silence around that need has curdled into quiet resentment more than once.",
    8: "A moment where you lost control or status hit you harder than the situation actually warranted. Your reaction was about more than what happened.",
    9: "You hold your beliefs with real conviction, and there's at least one opposing view you dismissed too fast because entertaining it felt like losing ground.",
    10: "Your identity and your job title have fused tighter than is safe. A bad quarter at work has hit you like a verdict on who you are, not just how you performed.",
    11: "You've wanted to be the center of a group this month more than the group actually needed you to be, and it cost you a little goodwill you didn't notice losing.",
    12: "You're proud of something you haven't shown anyone. The instinct to hide it and the instinct to be seen are pulling against each other, and neither is winning."
  },

  Virgo: {
    1: "You listed everything wrong with something you did well today before you let yourself register that it went well. That's not humility — it's a habit that's quietly draining your confidence one correction at a time.",
    2: "You track your money carefully, and a small, forgettable mistake in your spending has cost you real peace of mind out of proportion to the actual number. The fear of scarcity is louder than your actual financial situation.",
    3: "You've reread a message four times before sending it, and the version you finally sent was flatter than the one you meant. Somewhere your natural voice is getting edited out of your own communication.",
    4: "Clutter or disorder in your space has disturbed your peace of mind more than the actual mess warranted. Your standards for your home are higher than what your energy can sustain without cost.",
    5: "There's creative work sitting unfinished or unshared because it doesn't feel 'ready' yet, and you already suspect it never will feel ready by your own measure.",
    6: "A routine task has taken twice as long as it needed to because you kept refining it past the point of usefulness. Efficiency has quietly become perfectionism wearing a work costume.",
    7: "You've found a flaw in your relationship that, looking back, might not have actually been there — just a pattern your mind found because it was looking for one.",
    8: "Your mind has gone to the worst-case scenario about shared money or a hidden issue more than once this month, and the anxiety cost you more than the actual situation deserved.",
    9: "You've dismissed an idea quickly because it wasn't precise enough for your taste, without giving it the chance to be roughly right instead of exactly right.",
    10: "You've delivered something later than you needed to because it wasn't quite polished enough yet — and the delay itself has cost you more credibility than an imperfect on-time version would have.",
    11: "You've overanalyzed a good opportunity social or financial long enough that someone else moved on it while you were still weighing it.",
    12: "You've kept a self-critical thought entirely to yourself, running it on a private loop instead of saying it to someone who'd tell you it isn't true."
  },

  Libra: {
    1: "You've weighed a decision so long that the decision essentially made itself, without you. Somewhere that's cost you a choice you actually wanted to make.",
    2: "You have genuinely good taste, and it's led to spending on comfort or beauty that your budget didn't actually have room for. The indecision isn't really about the money — it's about picking a side.",
    3: "You've softened something true recently to keep the peace, and the person you softened it for probably needed to hear the real version more than the comfortable one.",
    4: "There's a small tension at home you've let sit unspoken because addressing it would break a calm that's actually just quiet, not resolved.",
    5: "You've noticed something in a relationship or a creative situation that concerned you, and smoothed over the noticing instead of naming it, to keep the picture pleasant.",
    6: "You've overanalyzed a good opportunity social or financial long enough that someone else moved on it while you were still weighing it.",
    7: "There's a relationship question you've left open for longer than it needed to stay open, because deciding felt riskier than staying in limbo.",
    8: "A shared financial decision has been sitting unresolved because closing it means someone has to compromise, and you'd rather it stay comfortably vague.",
    9: "You've balanced between two beliefs on something you actually do have a real opinion about, because picking a side felt like picking a fight.",
    10: "You know which career direction you actually want, and you've delayed saying it out loud because it's not the popular or obviously safe choice.",
    11: "You've built a wide social circle and still haven't committed fully to the one or two opportunities in it that actually matter, because closing other doors feels like a loss.",
    12: "There's a genuinely uncomfortable choice you've been withdrawing from entirely rather than facing badly. Avoiding it hasn't made it smaller."
  },

  Scorpio: {
    1: "You've held something in until it came out sideways — a short reply, a cold silence, a sudden edge — instead of saying the actual thing when it was still small.",
    2: "You've made a financial decision on a strong feeling rather than a clear head, and the instability that followed wasn't really about the money.",
    3: "A conversation escalated faster than it needed to because a comment landed on a nerve you didn't mention was there. The other person still doesn't know what actually happened.",
    4: "There's tension at home that's been building quietly and will surface as a sudden conflict if it isn't named first, on your terms, before it picks its own moment.",
    5: "A flicker of jealousy or the urge to control a situation in love came from a trust question you haven't actually asked out loud yet.",
    6: "Something at work has been irritating you under the surface for longer than you've let on, and it will come out as conflict if it doesn't come out as a conversation first.",
    7: "You've felt the pull to control a dynamic in your relationship rather than trust it, and the person on the other side has probably felt that pull too, even if neither of you named it.",
    8: "You've handled a hard transition or loss competently on the outside and never actually processed it. It's still sitting somewhere, taking up more room than you think.",
    9: "You've defended a belief hard enough to alienate someone who was actually open to hearing you, if you'd come in a little softer.",
    10: "You've felt frustration with someone above you at work and swallowed it at exactly the wrong moment, which means it's still there, waiting for the next wrong moment.",
    11: "You've moved faster than a long-term ally was ready for, and the relationship absorbed some quiet damage that patience would have prevented.",
    12: "There's a private frustration or a low simmering anger you haven't told anyone about, and it's shown up as exhaustion or poor sleep instead."
  },

  Sagittarius: {
    1: "You've made a promise recently — to yourself or someone else — with more excitement than actual plan behind it, and some part of you already knows it's not getting finished on schedule.",
    2: "You've been generous or confident with money in a way that felt good in the moment and thinner than it should have the next morning.",
    3: "You've said something enthusiastic that you hadn't actually confirmed you could deliver, and now someone's expecting it.",
    4: "You've thought about moving, changing, or restarting your living situation again, sooner than the current one actually deserves a verdict.",
    5: "There's a creative or romantic project that got your best, most excited energy at the start and has quietly stalled since.",
    6: "You've said yes to a new responsibility this week that you didn't actually have room for, because it sounded exciting when it was offered.",
    7: "You've made a bigger promise in a relationship than you'd actually earned the trust for yet, and some part of the other person noticed the gap.",
    8: "You've taken more risk with shared money or resources than prudence would suggest, riding on confidence rather than a plan.",
    9: "You hold a belief with real enthusiasm and haven't actually tested it against something real in a while. Faith and evidence have drifted apart a little.",
    10: "You're chasing more than one career direction right now, and the energy split between them is costing you depth in any single one.",
    11: "You've overestimated how far a plan or a new connection would go this month, and the actual results came in thinner than the excitement suggested.",
    12: "There's a big 'someday' idea you talk about with real enthusiasm and haven't taken one actual step toward. It's still just a good story you tell."
  },

  Capricorn: {
    1: "You've worked past the point your body was asking you to stop, again, because rest has always felt like something you have to earn first.",
    2: "Your finances are probably in better shape than your anxiety about them suggests. The fear of not having enough is louder than the actual numbers.",
    3: "You've held back something honest because saying it risked someone's judgment, and the cost of staying quiet was clarity you both needed.",
    4: "You're carrying a family responsibility that's heavier than it should be for you alone, and you haven't actually asked anyone to share the weight.",
    5: "You've delayed enjoying something — a relationship, a creative moment — until it felt earned, and the joy shrank while you were waiting to deserve it.",
    6: "You've pushed through a sign of exhaustion or illness this week that was actually asking you to stop, not push harder.",
    7: "You've held off on a commitment, waiting for a certainty that isn't going to arrive before you have to decide anyway.",
    8: "A shared financial transition has felt like one heavy, undifferentiated weight instead of a series of smaller, manageable steps.",
    9: "You've resisted a new belief until it's been proven to you multiple times over, when a smaller, lower-stakes test would have told you enough sooner.",
    10: "You're getting real results at work through sustained effort, and the recognition is arriving slower than the effort deserves — which is starting to wear on you more than you've said.",
    11: "Your progress has been steady and mostly invisible, even to you, because you haven't been tracking it anywhere you can actually see it.",
    12: "You've treated rest as something you'll get to eventually, and eventually keeps not arriving on its own."
  },

  Aquarius: {
    1: "Someone close to you has felt the distance in you this week, even while you were technically present. Your calm reads as guarded more often than you intend.",
    2: "You manage money with real caution, and the caution has started to feel like anxiety that never fully resolves, no matter how stable things actually are.",
    3: "You've explained an idea clearly and left the feeling behind it completely unsaid. The person you were talking to got the logic, not the you.",
    4: "There's warmth you feel toward family that you haven't actually said out loud in a while — it's stayed inside where it doesn't do anyone any good.",
    5: "You've held back in a creative or romantic moment to keep it safely private, and some of what made it worth having got held back with it.",
    6: "There's a personal need you've been ignoring long enough that it's starting to look like a health issue instead of a request.",
    7: "A conversation about commitment recently stayed entirely about logistics, and the feeling underneath it never actually got named.",
    8: "You've handled a hard transition alone by design, when having one person alongside you would have made it lighter without making it less yours.",
    9: "You've held a new idea at arm's length, giving it full scrutiny before you've let yourself actually sit with it open-minded first.",
    10: "You're respected at work, and the professional distance you keep has crowded out an actual personal connection you might otherwise have had there.",
    11: "Your friendships are steady and functional, and a few of them have room to be closer than you've let them get.",
    12: "You've defaulted to solitude this week when reaching out to one person was actually the thing you needed."
  },

  Pisces: {
    1: "You absorbed someone else's problem this week as if it were yours to solve, and it cost you energy that was never actually meant to go there.",
    2: "You've given more — money, time, resources — than your own security could comfortably afford, because saying no felt harder than the giving did.",
    3: "You've agreed to something recently just to avoid disappointing someone, and now you're carrying a commitment you didn't actually want to make.",
    4: "A family member's mood became your mood this week without you fully noticing the moment it happened.",
    5: "You've made a romantic or creative decision on the strength of a feeling that hadn't actually settled yet, and the clarity you needed only showed up after.",
    6: "You've taken on someone else's work or problem out of empathy, and your own health or workload paid the difference.",
    7: "A limit got crossed in your relationship recently, quietly, and you let it pass rather than naming it in the moment.",
    8: "You've sat with someone else's hidden struggle longer than was sustainable, and it's left you quietly depleted in a way you haven't named.",
    9: "You've drifted between beliefs again this month rather than committing to sit with one long enough to actually understand it.",
    10: "You've absorbed a colleague's or a team's burden as your own personal responsibility at work, and it's made your own progress heavier than it needs to be.",
    11: "There's a friendship where your empathy runs one direction more than it comes back, and you've noticed without adjusting it.",
    12: "You've withdrawn instead of reaching out this week, and the isolation started to feel like relief when it was actually just avoidance."
  }
};

// ============================================================
// LIFELINE_REMEDIES — real astrological/spiritual remedies tied
// to the Ascendant lord (Mars/Venus/Mercury/Moon/Sun/Jupiter/Saturn),
// each written to specifically counter the house's named problem —
// not generic behavioral advice with astrology attached.
// ============================================================
export const LIFELINE_REMEDIES = {
  Aries: {
    1: "Offer water to the rising sun every morning this week and recite the Mars beej mantra 11 times before starting your day. Mars needs a fixed ritual to answer to, or it keeps starting things without finishing them.",
    2: "On Tuesday, donate red lentils or jaggery to someone in need before you make any big purchase this week. This grounds Mars's money impulses in giving before spending, and quiets the sharp words that follow impulsive buys.",
    3: "Chant 'Om Kram Kreem Kroum Sah Bhaumaya Namah' 11 times before any conversation you know will be difficult. It slows the tongue down just enough that Mars stops winning the argument and starts keeping the relationship.",
    4: "Keep a small piece of coral or a red cloth near your main door, and light a lamp at dusk on Tuesdays. This settles the fire that Mars brings into the home before it turns into tension.",
    5: "Wear or keep red coral (moonga) on you when entering a new romantic or creative commitment, and offer a prayer to Hanuman before signing on to anything new. It slows the headfirst rush just enough to see clearly.",
    6: "Feed stray dogs or donate red items on Tuesdays — this is the classical remedy for Mars-driven conflict at work, redirecting the fighting energy into merit instead of rivalry.",
    7: "Recite the Hanuman Chalisa once a week, ideally Tuesday evening, with your partner or relationship specifically in mind. It's the traditional remedy for softening Mars's directness in close partnerships.",
    8: "Donate blood or red items to charity before a high-risk decision involving money or health. This is considered the most direct way to defuse Mars's tendency toward sudden, regretted risk.",
    9: "Visit a Hanuman or Mars-associated temple on a Tuesday and offer respect to a teacher or elder you've dismissed too quickly. This realigns the ninth house's need for humility before authority.",
    10: "Wear a small red thread (mauli) on your right wrist during a tense period at work, and avoid initiating conflict with superiors on Tuesdays specifically — Mars is at its most volatile that day for you.",
    11: "Donate to a cause involving land, property, or physical labor before committing to a new income opportunity. This steadies Mars's impatience around gains long enough for the plan to catch up.",
    12: "Keep a small copper vessel of water by your bed and empty it outside each morning — a traditional practice for releasing Mars's restless, inward-turning energy that disturbs sleep."
  },
  Taurus: {
    1: "Light a ghee lamp to Venus on Friday evenings and offer white flowers. This is the classical remedy for softening Venus's resistance to change without losing your sense of security.",
    2: "Donate white rice, sugar, or silver items on Fridays before making any decision that involves letting go of money or control. It loosens Venus's grip just enough to allow growth.",
    3: "Wear white or light-colored clothing on Friday and use that day specifically to have the conversation you've been avoiding — Venus is most receptive to honest, gentle speech on its own day.",
    4: "Keep fresh flowers at home and change them weekly. This is the direct Venus remedy for resistance to change in domestic life — small, repeated renewal trains comfort to accept small shifts.",
    5: "Offer a coconut at a Shiva or Venus-associated temple on Friday, specifically asking for release rather than control in a relationship where you've been holding too tight.",
    6: "Fast partially (avoiding heavy or sweet food) one Friday this month — the traditional Venus remedy for comfort-driven health habits that resist change.",
    7: "Gift your partner something white or silver, given without occasion, on a Friday. This is a recognized Venus remedy for softening stubbornness that shows up as resistance to a partner's needs.",
    8: "Donate to a cause involving women, comfort, or beauty before opening a stalled shared-money conversation. It's the traditional way to soften Venus's discomfort with financial vulnerability.",
    9: "Read one page of a philosophy or text outside your own tradition on a Friday, then let it sit without argument. Venus expands fastest through gentle exposure, not confrontation.",
    10: "Wear a small diamond, white sapphire, or clear quartz to work if you're due for a career decision — the classical stone for loosening a Venus placement that clings to outdated comfort.",
    11: "Donate to a cause you've personally benefited from, before deciding whether to keep or release a friendship or income stream that's stopped serving you.",
    12: "Sit in silence near water for five minutes each evening this week, letting one avoided thought surface without acting on it yet. Venus resolves inner avoidance through stillness, not force."
  },
  Gemini: {
    1: "Chant the Mercury beej mantra 'Om Bram Breem Broum Sah Budhaya Namah' 11 times each morning before checking your phone. It's the direct remedy for a Mercury mind that scatters before it decides.",
    2: "Donate green moong dal on Wednesdays before reviewing your finances. This is the classical remedy for Mercury-driven money scatter — it grounds the mind before it multiplies small decisions.",
    3: "Wear or keep green with you on Wednesday, and use that day specifically to follow through on one commitment you've been avoiding finishing.",
    4: "Feed green vegetables to cows or donate them on Wednesday evenings — this settles a restless Mercury mind enough to be actually present at home.",
    5: "Offer durva grass or green items at a Ganesha temple on Wednesday before starting any new creative project — it's the traditional remedy for Mercury's tendency to abandon things mid-way.",
    6: "Keep a piece of emerald or green aventurine on your work desk. This is the classical stone for steadying Mercury's overthinking on routine tasks.",
    7: "Recite the Vishnu Sahasranama, even partially, on a Wednesday when doubt about a partner's words is loudest — it's a recognized remedy for Mercury-driven overanalysis in relationships.",
    8: "Donate green clothing or books to students on Wednesday before curiosity pulls you into something that isn't yours to hold.",
    9: "Write down, rather than argue, one belief you hold strongly — Mercury settles into conviction through writing, not debate, and this is the traditional way to close the gap between what you say and do.",
    10: "Wear green on Wednesdays specifically when you need to choose which work initiative to finish — it's considered Mercury's most decisive day for you.",
    11: "Donate to an educational cause before following up with an old contact instead of collecting a new one. This is the classical remedy for scattered Mercury growth in networks.",
    12: "Write down the late-night mental loop on paper and place it under a green cloth overnight rather than carrying it into sleep — a traditional practice for quieting an overactive Mercury mind."
  },
  Cancer: {
    1: "Offer raw milk to a Shiva lingam on Monday mornings, and keep a piece of moonstone or pearl close to your body. This is the direct remedy for a Moon that reads every room's mood as its own.",
    2: "Donate white rice or milk on Mondays before any financial decision made during an emotional dip — it steadies the Moon enough to separate feeling from fact.",
    3: "Wear white or silver on Mondays and use that day to have any conversation you've been carrying too much emotional weight into.",
    4: "Keep a consistent lamp-lighting ritual at home every evening — this is the classical Moon remedy for emotional dependence on unstable surroundings.",
    5: "Offer white flowers to the Moon on a Monday evening, specifically naming a romantic or creative high or low out loud as part of the offering, rather than carrying it silently.",
    6: "Fast on Mondays, or eat only white foods, when physical stress signals appear — this is the traditional Moon remedy for emotional turbulence showing up in the body.",
    7: "Wear a pearl or moonstone when spending extended time with your partner during an emotionally heavy period — it's considered protective against absorbing another's mood as your own.",
    8: "Offer water to the Moon (Chandra Arghya) on a full moon night before making a major decision during a difficult transition. It's the classical remedy for emotional overwhelm during change.",
    9: "Visit a Shiva or Moon-associated temple on Monday when an unfamiliar belief has unsettled you — sit with it there rather than dismissing it immediately.",
    10: "Keep a small silver coin or pearl in your workspace, and take five minutes to yourself before a Monday meeting if work feels emotionally loud.",
    11: "Donate milk or white sweets on Mondays before a social gain or loss, to keep self-worth from attaching too heavily to that outcome.",
    12: "Recite 'Om Shram Shreem Shroum Sah Chandraya Namah' 11 times before bed on nights you've chosen to withdraw rather than share a feeling with someone close."
  },
  Leo: {
    1: "Offer water to the Sun every morning facing east, and recite the Surya mantra 11 times. This is the primary remedy for a need for recognition that's outpacing your actual confidence.",
    2: "Donate wheat, jaggery, or copper items on Sundays before checking your finances — it's the classical Sun remedy for self-worth that rises and falls with money.",
    3: "Wear saffron or gold-toned clothing on Sunday and use that day to practice letting someone else finish their thought before you offer yours.",
    4: "Light a lamp with cow ghee at home on Sundays — this is the traditional Sun remedy for pride about how a home looks costing you actual peace inside it.",
    5: "Offer red flowers to Surya on Sunday before sharing new creative work, specifically asking for the joy of making rather than the reaction to it.",
    6: "Donate copper vessels or wheat to those in need on Sunday when frustration about unnoticed work builds — it's considered the remedy for recognition-hunger at the root.",
    7: "Wear a ruby, or a red garnet as a lighter alternative, and have one direct conversation with your partner about the appreciation you actually need, ideally on a Sunday.",
    8: "Offer respect and a small donation to your father or a father figure during a period of lost control or status — this is the classical remedy tied to Sun's placement in the eighth house energy.",
    9: "Visit a Sun temple or offer water to Surya before engaging with a belief that challenges yours — it steadies confidence enough to stay open rather than defensive.",
    10: "Recite the Aditya Hridayam, even a few verses, on Sunday mornings during a period where your identity feels too fused with your job title.",
    11: "Donate to a group cause rather than an individual one this week — it's the traditional way to soften Leo's pull toward being the center of a group at the cost of harmony.",
    12: "Show one piece of work you're proud of to a single trusted person on a Sunday. This is considered the direct remedy for Sun's hidden need for recognition turning into private withdrawal."
  },
  Virgo: {
    1: "Recite 'Om Bram Breem Broum Sah Budhaya Namah' 11 times each morning before you look at your to-do list. This is the direct Mercury remedy for listing flaws before registering what went well.",
    2: "Share a meal with green vegetables or donate moong dal on Wednesday before reviewing your finances — it's the classical remedy for Mercury-driven money anxiety disproportionate to reality.",
    3: "Wear green on Wednesday and send the message you've written without a fourth read-through — Mercury's own day is considered its most forgiving for direct communication.",
    4: "Donate cleaning supplies or green cloth to those in need on Wednesdays — a recognized remedy for a Mercury-driven need for order that's begun costing more peace than it gives.",
    5: "Offer durva grass at a Ganesha temple on Wednesday before sharing unfinished creative work with someone you trust — it eases the fear that it isn't ready.",
    6: "Keep an emerald or peridot on your workspace, and set a hard stop time for tasks on Wednesdays specifically — Mercury is most willing to let go on its own day.",
    7: "Recite the Vishnu Sahasranama partially on a Wednesday when you've found a flaw in your relationship that may not be real — it's the traditional remedy for Mercury's tendency to over-interpret.",
    8: "Donate books or educational material on Wednesday before worst-case thinking about shared finances takes hold. This grounds Mercury's spiraling analysis in something concrete and useful.",
    9: "Write down, rather than dismiss, one imprecise idea you encountered this week — Mercury's growth comes through patient documentation, not quick rejection.",
    10: "Wear green specifically on the day you plan to deliver work, and set your personal deadline slightly earlier than the real one — a traditional Mercury practice for trusting timing over perfection.",
    11: "Donate to an educational or communication-related cause before acting on a good opportunity you've been overanalyzing.",
    12: "Say one self-critical thought aloud to a trusted person on a Wednesday rather than keeping it as a private loop — Mercury needs to speak a thought to release it."
  },
  Libra: {
    1: "Light a lamp to Venus on Friday and state one honest opinion that day without softening it — Venus resolves indecision fastest through its own ruling day.",
    2: "Donate white clothing or sugar on Fridays, and set a firm monthly cap on comfort spending as part of the same practice — pairing giving with restraint steadies Venus's excess.",
    3: "Wear white or pastel colors on Friday and use that day specifically to say the direct version of something you've been softening.",
    4: "Offer white flowers at home on Friday evenings, and name one small unspoken tension at home as part of that same ritual, out loud, to whoever it involves.",
    5: "Visit a Venus-associated or Shiva temple on Friday when something in a relationship or creative situation has quietly concerned you — ask for clarity rather than comfort in the visit.",
    6: "Donate to a cause involving fairness or justice on Friday before saying no to something you'd normally accept just to keep the peace.",
    7: "Wear a diamond or white sapphire, or offer one to your partner, when an open relationship question has stayed unresolved too long — it's the classical remedy for Venus indecision in partnership.",
    8: "Donate silver items on Friday before finally closing a shared financial decision that's been left vague. This steadies Venus enough to compromise instead of avoid.",
    9: "Read a firm philosophical text — something opinionated, not balanced — on a Friday, when you've been avoiding taking a real stance on a belief you actually hold.",
    10: "Recite 'Om Dram Dreem Droum Sah Shukraya Namah' 11 times before writing down your actual career preference — Venus needs ritual permission to admit an unpopular choice.",
    11: "Donate to one specific cause rather than several small ones this month before committing fully to the one opportunity that actually matters to you.",
    12: "Sit in stillness for five minutes on a Friday, then make one small uncomfortable choice you've been withdrawing from entirely."
  },
  Scorpio: {
    1: "Offer jaggery and red lentils to Hanuman on Tuesday before a conversation you've been holding something back from. This gives Mars-driven intensity a safe outlet before it comes out sideways.",
    2: "Donate red items or blood (via blood donation) on Tuesday before an intense financial decision — the classical remedy for Mars-driven money choices made on strong feeling.",
    3: "Recite the Hanuman Chalisa on Tuesday when a conversation is escalating faster than it should — it's considered the direct remedy for Mars-driven speech that damages bonds.",
    4: "Light a lamp with mustard oil at home on Tuesday evenings — a traditional practice for releasing buried household tension before it surfaces as sudden conflict.",
    5: "Wear red coral and offer a prayer to Hanuman before naming a trust question directly to a partner, rather than acting out jealousy or control.",
    6: "Feed stray animals or donate red items on Tuesday before addressing workplace friction directly — it channels Mars's intensity into resolution rather than confrontation.",
    7: "Visit a Hanuman temple on Tuesday when you notice the urge to control a relationship dynamic — ask specifically for trust rather than control in the visit.",
    8: "Donate to a cause involving crisis relief or transformation before or after processing a hard transition you've handled outwardly but never inwardly.",
    9: "Hold a belief privately for one full day, ideally starting on a Tuesday, before arguing it publicly — the classical remedy for Mars-driven conviction that alienates rather than persuades.",
    10: "Wear a small red thread on your wrist during a period of frustration with authority at work, and avoid confrontations specifically on Tuesdays, when Mars runs hottest for you.",
    11: "Donate to a cause tied to land or physical effort before moving faster than a long-term ally is ready for — it steadies Mars's impatience around important relationships.",
    12: "Keep a copper vessel of water by your bed, emptying it each morning — a traditional remedy for private, buried frustration that surfaces as poor sleep or unexplained exhaustion."
  },
  Sagittarius: {
    1: "Apply a small pinch of turmeric to your forehead each morning and recite the Jupiter beej mantra 'Om Gram Greem Groum Sah Gurave Namah' 11 times before making any new promise.",
    2: "Donate turmeric, yellow lentils, or a religious text on Thursday before lending or spending generously — this is the classical Jupiter remedy for overconfidence in money matters.",
    3: "Wear yellow on Thursday and use that day specifically to confirm you can deliver something before promising it enthusiastically.",
    4: "Offer respect and small gifts to a teacher or elder on Thursday before deciding whether to move or restart a living situation again.",
    5: "Visit a Jupiter or Vishnu-associated temple on Thursday before starting a new creative or romantic project — ask specifically for follow-through rather than more inspiration.",
    6: "Donate food to those in need on Thursday before saying yes to a new responsibility this week that you don't actually have room for.",
    7: "Recite the Guru Chalisa or Vishnu Sahasranama on Thursday before making a bigger relationship commitment than the trust built so far can hold.",
    8: "Offer yellow flowers or turmeric water to a peepal tree before taking on more shared-resource risk than prudence would suggest.",
    9: "Read a text on a belief you hold, this Thursday, testing one part of it against a real experience rather than accepting it purely on faith.",
    10: "Wear yellow specifically when choosing which career direction to focus this quarter's energy on — Jupiter is considered most decisive on its own day.",
    11: "Donate to an educational or spiritual cause on Thursday before following through fully on one existing plan rather than chasing a new connection.",
    12: "Light a ghee lamp on Thursday evening and give one 'someday' plan an actual first step that same day — Jupiter responds to ritual commitment, not just enthusiasm."
  },
  Capricorn: {
    1: "Light a mustard oil lamp on Saturday and offer black sesame seeds to the needy before pushing through another sign of exhaustion — this is the direct Saturn remedy for a body asking to stop.",
    2: "Donate black items, iron, or mustard oil on Saturday before scarcity anxiety drives a financial decision your actual numbers don't justify.",
    3: "Wear dark blue or black on Saturday and use that day to say the honest, undiplomatic sentence you've been holding back out of fear of judgment.",
    4: "Feed crows or the underprivileged on Saturday before naming a family responsibility you've been carrying alone, and ask someone to share it that same day.",
    5: "Visit a Shani or Hanuman temple on Saturday before allowing yourself to enjoy a relationship or creative moment without needing to earn it first.",
    6: "Fast partially on Saturday, or donate food instead, when a sign of illness or exhaustion appears — treat the fast as permission to rest, not another form of discipline.",
    7: "Offer respect to elders and donate black clothing on Saturday before taking one small step toward a commitment you've been delaying for certainty.",
    8: "Donate iron or oil before breaking a heavy shared financial transition into smaller steps — Saturn responds to structure more than to willpower alone.",
    9: "Test a new belief in one small, low-risk way this Saturday, rather than waiting for repeated proof before accepting it.",
    10: "Recite 'Om Pram Preem Proum Sah Shanaishcharaya Namah' 11 times on Saturday mornings during a stretch where recognition at work feels slower than the effort deserves.",
    11: "Track your progress somewhere visible — a notebook, a chart — starting this Saturday, so Saturn's slow, real gains don't stay invisible to you.",
    12: "Put one hour of actual rest on your calendar this Saturday as a fixed appointment, and light a lamp at the start of it as a signal to yourself that it's protected time."
  },
  Aquarius: {
    1: "Offer black sesame seeds and mustard oil to the needy on Saturday before spending time with someone who's noticed emotional distance in you.",
    2: "Donate iron items or black lentils on Saturday before a financial decision driven more by anxiety than by the actual numbers in front of you.",
    3: "Wear dark blue on Saturday and use that day to say the feeling behind an idea, not just the logic of it, to someone who matters.",
    4: "Light a lamp at home on Saturday evening and say one warm, plain thing directly to a family member as part of that same ritual.",
    5: "Visit a Shani temple on Saturday before a creative or romantic moment you'd normally keep entirely private — ask specifically for the courage to be witnessed.",
    6: "Donate to a health-related cause on Saturday before an ignored personal need becomes something more serious.",
    7: "Recite the Shani mantra 11 times before a conversation about commitment, specifically asking that the feeling behind it gets said, not just the logistics.",
    8: "Offer black clothing or oil in donation before processing a difficult transition — invite one trusted person into it rather than managing it entirely alone.",
    9: "Sit with a new idea in an open, non-judging way for a full day, ideally starting Saturday, before subjecting it to your usual scrutiny.",
    10: "Wear iron or a blue sapphire (if suited to your chart) during a stretch where professional distance has crowded out real connection at work.",
    11: "Donate to a community cause on Saturday before scheduling real one-on-one time with someone in your circle who deserves to be closer than they currently are.",
    12: "Feed crows or the underprivileged on Saturday before reaching out to one person this week instead of defaulting to solitude."
  },
  Pisces: {
    1: "Offer turmeric water to a peepal tree on Thursday before taking on a problem this week that isn't actually yours to solve.",
    2: "Donate turmeric, yellow lentils, or money on Thursday, setting the same amount as your giving limit for the month — this channels Jupiter's generosity without letting it outpace your own security.",
    3: "Recite 'Om Gram Greem Groum Sah Gurave Namah' 11 times before agreeing to something you don't actually want to do, specifically to create a pause before the automatic yes.",
    4: "Visit a Vishnu or Jupiter-associated temple on Thursday when a family member's mood has quietly become your own — ask for the clarity to separate the two.",
    5: "Wear yellow on Thursday when making a romantic or creative decision, and let the decision wait until that clarity has settled rather than acting on a feeling still forming.",
    6: "Donate food to those in need on Thursday before taking on someone else's work or problem out of empathy this week.",
    7: "Offer respect to a guru or elder figure on Thursday before naming a boundary in your relationship that's been quietly crossed.",
    8: "Light a ghee lamp on Thursday evening, setting a time limit for how long you'll sit with someone else's hidden struggle before stepping back.",
    9: "Read one page of a single spiritual text on Thursday and commit to sitting with it for the month, rather than drifting to the next one early.",
    10: "Wear yellow or keep a small yellow sapphire nearby during a period where you're absorbing a colleague's burden as your own responsibility at work.",
    11: "Donate to a cause where you won't personally know the outcome, before adjusting a friendship where your empathy runs one direction more than it returns.",
    12: "Offer water to the Moon or Jupiter on a Thursday evening before choosing to withdraw instead of reaching out — let the ritual replace the isolation, even briefly."
  }
};

export function getPrimaryBottleneck(ascendantSign, rulerHouse) {
  return LIFELINE_PROBLEMS[ascendantSign]?.[rulerHouse] || null;
}

export function getLifelineRemedy(ascendantSign, rulerHouse) {
  return LIFELINE_REMEDIES[ascendantSign]?.[rulerHouse] || null;
}