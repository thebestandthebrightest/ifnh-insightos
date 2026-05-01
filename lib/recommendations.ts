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

// ── Static recommendation library ────────────────────────────────────────────

const ALL_RECS = [
  rec(
    "Create a Designated Reflection & Recharge Zone",
    "Space Design",
    "74% of students want a dedicated quiet/recharge space — the clearest design mandate in the data.",
    "Reflection/recharge demand (74%)",
    "Serves an unmet need for ~69 of 93 surveyed students; reduces crowding in active zones.",
    5, 3, 5, "High", "Medium", "Facilities / IFNH Management",
  ),
  rec(
    "Expand and Reconfigure Seating",
    "Seating & Zoning",
    "Seating capacity is the #1 qualitative theme (48% of respondents). Students describe not being able to find tables during peak hours.",
    "Seating capacity theme (48%)",
    "Reduces overflow; captures demand currently lost to space unavailability.",
    5, 3, 5, "High", "Medium", "Facilities / Space Planning",
  ),
  rec(
    "Increase Shared & Collaborative Seating Options",
    "Seating & Zoning",
    "Only 38% of students have met someone new here, but 70% are open to it. Shared-facing seating design is a proven interaction catalyst.",
    "Interaction rate (38%) vs. open-to-meeting rate (70%)",
    "Closes the 32-point gap between intent and action; increases weak-tie formation.",
    4, 4, 4, "High", "Low", "IFNH Management", true,
  ),
  rec(
    "Launch a Monthly IFNH Activation Event Series",
    "Programming",
    "28% of students mention events/programming in open text. Trivia and themed days are the #1 preferred table activity. Events are also the #2 preferred wellness awareness channel.",
    "Events theme (28%); trivia preference (#1 activity)",
    "Creates recurring interaction moments; builds community identity; boosts ScarletWell awareness.",
    4, 4, 4, "High", "Medium", "ScarletWell / Student Affairs",
  ),
  rec(
    "Add Table Cards as Primary Wellness Resource Channel",
    "Wellness Awareness",
    "Table cards are the #1 preferred wellness learning channel (39% of respondents). They are low-cost, ambient, and persistent.",
    "Table cards as preferred channel (39%)",
    "Increases ScarletWell awareness from 55% toward 70%+ without requiring active student effort.",
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
    "Open-to-meeting rate (70%) vs. actual interaction (38%)",
    "Activates latent social intent; creates organic connection moments without structured programming.",
    4, 5, 4, "High", "Low", "ScarletWell / Student Engagement", true,
  ),
  rec(
    "Zone the Space into Clear Activity Areas",
    "Space Design",
    "48% of students prefer 'mixed options' for seating — suggesting desire for variety. Current layout ambiguity may suppress interaction.",
    "Seating preference (mixed options 67%); layout support rate",
    "Students self-select the right environment; reduces conflict between social and quiet users.",
    4, 3, 4, "High", "Medium", "Facilities / IFNH Management",
  ),
  rec(
    "Partner with Harvest Dining on Nutrition Programming",
    "Programming",
    "46% of students mention food or Harvest in open text. The dining connection is an underused asset.",
    "Food & Harvest theme (46%)",
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
    "Digital screens are preferred by 12% of students and enable rotating, timely content with no ongoing printing cost.",
    "Digital screen channel preference (12%)",
    "Continuous ambient wellness messaging; easy to update seasonally.",
    3, 3, 2, "Medium", "Medium", "IFNH Management / IT",
  ),
];

// ── Dynamic scoring ───────────────────────────────────────────────────────────

export function generateRecommendations(): Recommendation[] {
  const recs = ALL_RECS.map((r) => ({ ...r }));

  // Apply same boosts as recommendations.py generate_recommendations()
  const seatPct = 0.484; // themes.Seating Capacity.pct
  const interRate = 0.376;
  const awareRate = 0.554;
  const reflRate = 0.746;

  const scored = recs.map((rec) => {
    let score = rec.score;
    if (rec.category.includes("Seating") && seatPct >= 0.40) score *= 1.15;
    if (rec.category.includes("Wellness") && awareRate < 0.60) score *= 1.10;
    if (rec.category === "Programming" && interRate < 0.45) score *= 1.10;
    if (rec.title.includes("Reflection") && reflRate >= 0.70) score *= 1.15;
    return { ...rec, adjusted_score: Math.round(score * 1000) / 1000 };
  });

  scored.sort((a, b) => b.adjusted_score - a.adjusted_score);

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
