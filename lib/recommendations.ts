import { METRICS } from "./data";
import type { Recommendation } from "./types";

// ── Recommendation factory (mirrors recommendations.py _rec) ──────────────────

function rec(
  title: string,
  category: string,
  why: string,
  metric: string,
  outcome: string,
  impact: number,
  feasibility: number,
  demand: number,
  priority: "High" | "Medium" | "Low",
  effort: "Low" | "Medium" | "High",
  owner = "",
  quick_win = false,
): Omit<Recommendation, "adjusted_score" | "rank"> {
  const score = Math.round((impact * feasibility * demand) / 25 * 100) / 100;
  return { title, category, why, metric, outcome, impact, feasibility, demand, score, priority, effort, owner, quick_win };
}

const percent = (value: number) => `${Math.round(value * 100)}%`;
const interactionGapPoints = Math.round(
  ((METRICS.interaction.open_rate ?? 0) - (METRICS.interaction.rate ?? 0)) * 100
);

// ── Static recommendation library ────────────────────────────────────────────

const ALL_RECS = [
  rec(
    "Create a Designated Reflection & Recharge Zone",
    "Space Design",
    "78% of students responded positively when asked directly about a quiet/recharge area (Q8: Yes among yes/no respondents, 53 of 68), but only 3% raised this theme spontaneously in open text. This suggests a meaningful secondary comfort preference rather than the primary complaint.",
    "Prompted recharge preference (78%) vs. open-text mentions (3%)",
    "Adds a quieter comfort option for students who would use it, while softening pressure in active areas once higher-leverage interaction and seating fixes are underway.",
    3, 3, 3, "Medium", "Medium", "Facilities / IFNH Management",
  ),
  rec(
    "Expand and Reconfigure Seating",
    "Seating & Zoning",
    "Seating capacity is the #1 qualitative theme (48% of respondents). Students describe peak-hour overflow, inability to find the table type they want (2-top vs. group vs. lounge), and crowding that discourages staying.",
    "Seating capacity theme (48%)",
    "Reduces peak overflow; adds movable or reconfigurable seating to absorb demand spikes; expands the mix of available table types.",
    5, 3, 5, "High", "Medium", "Facilities / Space Planning",
  ),
  rec(
    "Increase Shared & Collaborative Seating Options",
    "Seating & Zoning",
    "Only 37% of students have met someone new here, but 67% are open to it. Opt-in shared tables with simple flip-sign indicators (open to company / prefer solo) reduce social friction while keeping seating choice fully voluntary.",
    "Interaction rate (37%) vs. open-to-meeting rate (67%)",
    "Closes the 31-point gap between intent and action; increases weak-tie formation without requiring structured programming.",
    4, 4, 4, "High", "Low", "IFNH Management", true,
  ),
  rec(
    "Launch a Monthly IFNH Activation Event Series",
    "Programming",
    "25% of students mention events/programming in open text. Trivia and themed days are the #1 preferred table activity. Lightweight, ambient programming — starting with trivia/theme days — requires minimal setup and doubles as a ScarletWell awareness moment. Events are the #2 preferred wellness awareness channel (26% of respondents).",
    "Events theme (25%); trivia preference (#1 activity)",
    "Creates recurring interaction moments; builds community identity; boosts ScarletWell awareness.",
    4, 4, 4, "High", "Medium", "ScarletWell / Student Affairs",
  ),
  rec(
    "Add Table Cards as Primary Wellness Resource Channel",
    "Wellness Awareness",
    "Table cards are the #1 preferred wellness learning channel (40% of respondents). They are low-cost, ambient, and persistent.",
    "Table cards as preferred channel (40%)",
    "Increases ScarletWell awareness from 45% toward 70%+ without requiring active student effort.",
    4, 5, 4, "High", "Low", "ScarletWell Communications", true,
  ),
  rec(
    "Embed QR Codes for Wellness Resource Discovery",
    "Wellness Awareness",
    "QR codes are the #2 preferred channel (18% of respondents) and align with how students already use phones.",
    "QR code channel preference (18%)",
    "Frictionless wellness resource discovery; trackable engagement; complements table cards.",
    3, 5, 3, "Medium", "Low", "ScarletWell / Digital", true,
  ),
  rec(
    "Introduce Conversation Prompt Table Cards",
    "Student Engagement",
    "Students want to meet people but lack a low-pressure entry point. Conversation prompts at tables reduce social friction.",
    "Open-to-meeting rate (67%) vs. actual interaction (37%)",
    "Activates latent social intent; creates organic connection moments without structured programming.",
    4, 5, 4, "High", "Low", "ScarletWell / Student Engagement", true,
  ),
  rec(
    "Zone the Space into Clear Activity Areas",
    "Space Design",
    "64% of students prefer 'mixed options' for seating — the clearest seating-preference signal. Current layout ambiguity may suppress both interaction and activity. Clear zoning into Shared/Social, Flexible Group, Activation/Events, Wellness Info, and optionally Quiet/Recharge areas helps students self-select the right environment.",
    "Seating preference (mixed options 64%); layout support rate (59%)",
    "Students self-select the right environment; reduces conflict between social and quiet users; makes peak crowding feel less chaotic.",
    4, 3, 4, "High", "Medium", "Facilities / IFNH Management",
  ),
  rec(
    "Partner with Harvest Dining on Nutrition Programming",
    "Programming",
    "22% of students mention food, samples, or Harvest-adjacent activation in open text. The dining connection is an underused asset.",
    "Food & Harvest theme (22%)",
    "Deepens the wellness + nutrition mission; drives foot traffic; creates natural event anchor.",
    3, 4, 3, "Medium", "Medium", "Harvest Dining / IFNH",
  ),
  rec(
    "Run a Pre/Post Layout Change Measurement Study",
    "Measurement",
    "Without baseline measurement, it is difficult to know which changes are working. The current survey provides a strong baseline.",
    "All core metrics (baseline established)",
    "Enables data-driven iteration; demonstrates ROI to decision-makers; surfaces unexpected effects.",
    3, 4, 2, "Medium", "Low", "IFNH Research / ScarletWell",
  ),
  rec(
    "Train Student Ambassadors for Peer Wellness Outreach",
    "Student Engagement",
    "Peer ambassadors are the least-preferred channel today, but they have high authenticity potential in a casual space context.",
    "Ambassador channel preference (2%); interaction rate opportunity",
    "Human touch in ScarletWell promotion; creates student jobs and leadership roles.",
    3, 3, 2, "Low", "High", "ScarletWell / Student Affairs",
  ),
  rec(
    "Add Digital Screens for Ambient Wellness Content",
    "Wellness Awareness",
    "Digital screens are preferred by 14% of students and enable rotating, timely content with no ongoing printing cost.",
    "Digital screen channel preference (14%)",
    "Continuous ambient wellness messaging; easy to update seasonally.",
    3, 3, 2, "Medium", "Medium", "IFNH Management / IT",
  ),
];

const NARRATIVE_PRIORITY: Record<string, number> = {
  "Increase Shared & Collaborative Seating Options": 1,
  "Expand and Reconfigure Seating": 2,
  "Launch a Monthly IFNH Activation Event Series": 3,
  "Introduce Conversation Prompt Table Cards": 4,
  "Add Table Cards as Primary Wellness Resource Channel": 5,
  "Embed QR Codes for Wellness Resource Discovery": 6,
  "Zone the Space into Clear Activity Areas": 7,
  "Partner with Harvest Dining on Nutrition Programming": 8,
  "Run a Pre/Post Layout Change Measurement Study": 9,
  "Create a Designated Reflection & Recharge Zone": 10,
  "Add Digital Screens for Ambient Wellness Content": 11,
  "Train Student Ambassadors for Peer Wellness Outreach": 12,
};

// ── Dynamic scoring ───────────────────────────────────────────────────────────

export function generateRecommendations(): Recommendation[] {
  const recs = ALL_RECS.map((r) => ({ ...r }));

  // Apply same boosts as recommendations.py generate_recommendations()
  // Values updated from the May 12, 2026 105-response refresh.
  const seatPct = METRICS.themes["Seating Capacity"].pct;
  const interRate = METRICS.interaction.rate ?? 0;
  const awareRate = METRICS.awareness.rate ?? 0;
  const reflRate = METRICS.reflection.rate ?? 0;

  const scored = recs.map((rec) => {
    let score = rec.score;
    if (rec.category.includes("Seating") && seatPct >= 0.40) score *= 1.15;
    if (rec.category.includes("Wellness") && awareRate < 0.60) score *= 1.10;
    if (rec.category === "Programming" && interRate < 0.45) score *= 1.10;
    if (rec.title.includes("Reflection") && reflRate >= 0.70) score *= 0.92;
    return { ...rec, adjusted_score: Math.round(score * 1000) / 1000 };
  });

  scored.sort((a, b) => {
    const aPriority = NARRATIVE_PRIORITY[a.title] ?? 999;
    const bPriority = NARRATIVE_PRIORITY[b.title] ?? 999;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return b.adjusted_score - a.adjusted_score;
  });

  return scored.map((r, i) => ({ ...r, rank: i + 1 })) as Recommendation[];
}

// ── Tier partitioning (mirrors app.py Section 08) ────────────────────────────

export interface RecommendationTiers {
  quickWins: Recommendation[];
  strategic: Recommendation[];
  longerTerm: Recommendation[];
}

export function partitionTiers(recs: Recommendation[]): RecommendationTiers {
  const quickWins = recs.filter((r) => r.quick_win && r.effort === "Low");
  const strategic = recs.filter(
    (r) => r.priority === "High" && !(r.quick_win && r.effort === "Low")
  );
  const doneRanks = new Set([...quickWins, ...strategic].map((r) => r.rank));
  const longerTerm = recs.filter((r) => !doneRanks.has(r.rank));
  return { quickWins, strategic, longerTerm };
}

export const CATEGORIES = [
  "All",
  "Space Design",
  "Seating & Zoning",
  "Programming",
  "Wellness Awareness",
  "Student Engagement",
  "Measurement",
];

export interface ExecutivePriority {
  title: string;
  summary: string;
  evidence: string[];
  actions: string[];
  expectedImpact: string;
  cost: string;
  impact: string;
  timeline: string;
  lead: string;
}

export interface ImplementationPhase {
  phase: string;
  timing: string;
  goal: string;
  actions: string[];
}

export interface SecondaryOpportunity {
  title: string;
  description: string;
  timing: string;
}

export interface SuccessMarker {
  label: string;
  baseline: string;
  shift: string;
}

export const EXECUTIVE_PRIORITIES: ExecutivePriority[] = [
  {
    title: "Activate Tables for Interaction",
    summary:
      "IFNH already has traffic. The fastest win is converting shared presence into low-pressure conversation, activity, and repeat engagement at the table level.",
    evidence: [
      `${METRICS.visit.rate_pct} of students visit regularly, but only ${METRICS.interaction.rate_pct} report meeting someone new here.`,
      `${METRICS.interaction.open_rate_pct} are open to meeting someone new, leaving a ${interactionGapPoints}-point conversion gap between intent and experience.`,
      `${percent(METRICS.themes["Events & Programming"].pct)} mention events or programming in open text, and ${percent(METRICS.activities.norm["Trivia or theme days"])} choose trivia or theme days as their top table activity.`,
    ],
    actions: [
      "Pilot conversation-prompt table cards and opt-in shared-table cues.",
      "Launch a lightweight trivia or theme-night rhythm to create recurring social activation.",
      "Use collaborative tables and table hosts only as low-pressure entry points, not formal programming overhead.",
    ],
    expectedImpact:
      "Raises the likelihood that regular visitors actually interact, building belonging without needing a major capital project.",
    cost: "Low cost",
    impact: "High impact",
    timeline: "Immediate",
    lead: "IFNH Management + Student Affairs",
  },
  {
    title: "Improve Seating Flexibility + Comfort",
    summary:
      "The physical environment should make it easier to stay, gather, and self-select into the right kind of use. Right now, seating pressure and layout ambiguity are getting in the way.",
    evidence: [
      `${percent(METRICS.themes["Seating Capacity"].pct)} mention seating or crowding in open text, making it the strongest spontaneous operational complaint.`,
      `${percent(METRICS.seating.norm["Mixed options"])} prefer a mixed seating strategy, signaling demand for variety rather than a single-use room type.`,
      `Only ${METRICS.layout.agree_rate_pct} agree that the current layout encourages interaction, which suggests the room is not yet doing enough work on its own.`,
    ],
    actions: [
      "Preserve mixed seating while increasing shared long tables, movable seats, and flexible group arrangements.",
      "Improve traffic flow around peak seating zones so the room feels less congested during busy periods.",
      "Add selective soft seating or lounge elements where they support comfort without turning the room into a quiet-first space.",
    ],
    expectedImpact:
      "Reduces friction, helps students find the kind of seat they want, and creates a better physical foundation for interaction and longer stays.",
    cost: "Medium cost",
    impact: "Medium-high impact",
    timeline: "Near term",
    lead: "Facilities + IFNH Operations",
  },
  {
    title: "Embed Wellness Discovery Into the Space",
    summary:
      "Students are using IFNH without consistently connecting to the ScarletWell ecosystem around it. Awareness should be built into the room, not left to chance.",
    evidence: [
      `Only ${METRICS.awareness.rate_pct} are aware of ScarletWell resources among students who answered the awareness question.`,
      `${percent(METRICS.channels.norm["Table cards"])} prefer table cards for learning about wellness resources, making them the clearest passive discovery channel.`,
      `${percent(METRICS.channels.norm.Events)} prefer events as a wellness channel, so programming can reinforce visibility rather than sit beside it.`,
    ],
    actions: [
      "Deploy table cards as the first-line ScarletWell discovery tool at high-use seating zones.",
      "Add QR prompts and ambient wellness cues so discovery happens while students are already present in the space.",
      "Tie ScarletWell messaging into IFNH events, trivia, and Harvest-adjacent activations rather than relying on stand-alone promotion.",
    ],
    expectedImpact:
      "Turns everyday use of the space into a repeated awareness touchpoint, improving discovery without adding major staffing burden.",
    cost: "Low cost",
    impact: "High impact",
    timeline: "Immediate",
    lead: "ScarletWell Communications + IFNH",
  },
];

export const IMPLEMENTATION_PHASES: ImplementationPhase[] = [
  {
    phase: "Phase 1 — Immediate Pilots",
    timing: "0–2 months",
    goal: "Test interaction conversion quickly with low-cost, reversible moves.",
    actions: [
      "Pilot conversation prompts, shared-table signals, and a first round of trivia or theme-day activation.",
      "Install table cards, QR prompts, and simple ScarletWell discovery signage in the highest-traffic zones.",
      "Make quick movable-seating and table-placement tweaks to reduce crowding pressure during peak hours.",
    ],
  },
  {
    phase: "Phase 2 — Environmental Adjustments",
    timing: "2–6 months",
    goal: "Support comfort and longer engagement once the first interaction pilots show what works.",
    actions: [
      "Expand or reconfigure seating mixes, especially shared tables, flexible group seating, and soft seating where helpful.",
      "Refine circulation and zone clarity so students can tell where to gather, linger, or work together.",
      "If space remains, test a small recharge corner as a secondary environmental enhancement rather than the main redesign driver.",
    ],
  },
  {
    phase: "Phase 3 — Long-Term Identity",
    timing: "6–12 months",
    goal: "Position IFNH as a recognizable community and wellness hub, not just a place students pass through.",
    actions: [
      "Establish a recurring programming rhythm tied to IFNH identity, student life moments, and Harvest-adjacent opportunities.",
      "Integrate ScarletWell discovery into the experience so wellness activation becomes part of how the space is known.",
      "Use the next survey wave to measure interaction, awareness, layout support, and whether seating complaints are easing.",
    ],
  },
];

export const SECONDARY_OPPORTUNITIES: SecondaryOpportunity[] = [
  {
    title: "Quiet / Recharge Corner",
    description:
      `${METRICS.reflection.rate_pct} responded positively when asked directly about recharge space, but only ${percent(METRICS.reflection.opentext_rate)} raised it spontaneously in open text. Treat it as a useful secondary comfort layer, not the core redesign mandate.`,
    timing: "After seating, interaction, and visibility basics are in place",
  },
  {
    title: "Environmental Softening",
    description:
      "Selective lounge cues, softer materials, or comfort upgrades can improve dwell time, but they should support the main social and seating strategy rather than replace it.",
    timing: "Best paired with Phase 2 layout adjustments",
  },
  {
    title: "Digital Screens",
    description:
      `${percent(METRICS.channels.norm["Digital screens"])} prefer screens as a wellness channel. They can help, but they are a supporting layer after table cards and event-based discovery are established.`,
    timing: "Useful once the analog visibility system is already live",
  },
  {
    title: "Peer Ambassadors",
    description:
      "Peer outreach can add warmth and authenticity, but it is a higher-lift optional layer than passive environmental discovery tools.",
    timing: "Consider later if staff capacity and student leadership structure exist",
  },
];

export const GUIDING_PRINCIPLES = [
  "Solve for conversion, not attendance. IFNH is already well used; the opportunity is what happens once students are there.",
  "Use the room to lower social friction. Interventions should make interaction easier without forcing participation.",
  "Pilot before investing heavily. Low-cost table, programming, and signage tests should shape later environment decisions.",
  "Treat quiet/recharge as additive. It is a real prompted preference, but not the strongest cross-source driver of action.",
];

export const SUCCESS_MARKERS: SuccessMarker[] = [
  {
    label: "Students meeting someone new",
    baseline: `${METRICS.interaction.rate_pct} today`,
    shift: "Should move up first if table activation and programming are working.",
  },
  {
    label: "ScarletWell awareness",
    baseline: `${METRICS.awareness.rate_pct} aware today`,
    shift: "Should rise as table cards, QR prompts, and events create more discovery moments.",
  },
  {
    label: "Layout supports interaction",
    baseline: `${METRICS.layout.agree_rate_pct} agree today`,
    shift: "Should improve as seating mixes, zoning, and circulation become clearer.",
  },
  {
    label: "Seating pressure in open text",
    baseline: `${percent(METRICS.themes["Seating Capacity"].pct)} mention seating/capacity today`,
    shift: "Should decline in the next survey wave if flexibility and overflow issues are addressed.",
  },
  {
    label: "Regular visitation",
    baseline: `${METRICS.visit.rate_pct} visit regularly today`,
    shift: "Should stay strong while the space becomes more engaging and more discoverable.",
  },
];
