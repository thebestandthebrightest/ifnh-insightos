import type { GapItem, FunnelStage, Insight } from "./types";

// ── Design tokens (mirrors theme.py) ─────────────────────────────────────────

export const COLORS = {
  SAGE: "#7A8F7A",
  CORAL: "#C5705A",
  GOLD: "#C8A96E",
  BLUE_GREY: "#7B9BB5",
  OLIVE: "#5C6B3C",
  TEXT: "#2D2D2D",
  TEXT_MUTED: "#6B6B6B",
  TEXT_LIGHT: "#9B9B9B",
  BORDER: "#E0DDD8",
  DIVIDER: "#EEEBE6",
  BG: "#F9F7F4",
  CARD: "#FFFFFF",
};

// ── Survey metadata ───────────────────────────────────────────────────────────

export const SURVEY_META = {
  raw_rows: 95,
  analysis_rows: 93,
  excluded_rows: 2,
  semester: "Spring 2026",
};

// ── Core KPI metrics (computed from 93 valid responses) ───────────────────────

export const METRICS = {
  visit: {
    rate: 0.8065,
    rate_pct: "81%",
    n: 75,
    n_total: 93,
    freq_dist: {
      "1–2 times/week": 0.430,
      "3–4 times/week": 0.290,
      Occasionally: 0.194,
      Daily: 0.086,
    },
    score_mean_1_4: 2.27,
  },
  interaction: {
    rate: 0.3763,
    rate_pct: "38%",
    n_met: 35,
    n_total: 93,
    open_rate: 0.6989,
    open_rate_pct: "70%",
  },
  connection: {
    mean: 3.97,
    mean_str: "3.97",
    high_rate: 0.7204,
    distribution: {
      1: 0.011,
      2: 0.011,
      3: 0.258,
      4: 0.441,
      5: 0.280,
    },
    n: 93,
  },
  awareness: {
    rate: 0.5541,
    rate_pct: "55%",
    n_aware: 41,
    n_not_aware: 33,
    n_total: 74,
    n_not_sure: 19,
    raw_dist: {
      Yes: 0.446,
      No: 0.359,
      "Not sure": 0.196,
    },
  },
  reflection: {
    rate: 0.7458,
    rate_pct: "75%",
    n_yes: 44,
    n_total: 59,
    raw_dist: {
      Yes: 0.506,
      "Not sure": 0.322,
      No: 0.172,
    },
  },
  layout: {
    mean: 3.53,
    mean_str: "3.53",
    agree_rate: 0.5517,
    agree_rate_pct: "55%",
    disagree_rate: 0.1264,
    raw_dist: {
      Agree: 0.437,
      Neutral: 0.322,
      "Strongly agree": 0.115,
      Disagree: 0.115,
      "Strongly disagree": 0.011,
    },
  },
  wellness: {
    mean: 3.66,
    mean_str: "3.66",
    high_rate: 0.671,
    distribution: {
      1: 0.012,
      2: 0.122,
      3: 0.195,
      4: 0.537,
      5: 0.134,
    },
    n: 82,
  },
  channels: {
    dist: {
      "Table cards": 32,
      Events: 22,
      "QR codes": 15,
      "Digital screens": 10,
      "Peer ambassadors": 2,
    },
    norm: {
      "Table cards": 0.395,
      Events: 0.272,
      "QR codes": 0.185,
      "Digital screens": 0.123,
      "Peer ambassadors": 0.025,
    },
    top: "Table cards",
    n: 81,
  },
  seating: {
    dist: {
      "Mixed options": 54,
      "Round tables": 13,
      "Shared long tables": 11,
      "Lounge seating": 5,
      "Other": 4,
    },
    norm: {
      "Mixed options": 0.621,
      "Round tables": 0.149,
      "Shared long tables": 0.126,
      "Lounge seating": 0.057,
      "Other": 0.046,
    },
    top: "Mixed options",
    n: 87,
  },
  activities: {
    dist: {
      "Trivia or theme days": 29,
      "Creative prompts": 13,
      "Daily/weekly challenges": 12,
      "Resource bingo": 10,
      "Conversation prompts": 8,
      "Other": 5,
    },
    norm: {
      "Trivia or theme days": 0.377,
      "Creative prompts": 0.169,
      "Daily/weekly challenges": 0.156,
      "Resource bingo": 0.130,
      "Conversation prompts": 0.104,
      "Other": 0.065,
    },
    top: "Trivia or theme days",
  },
  themes: {
    "Seating Capacity": { count: 45, pct: 0.484 },
    "Food & Harvest": { count: 43, pct: 0.462 },
    "Events & Programming": { count: 26, pct: 0.280 },
    "Social Connection": { count: 25, pct: 0.269 },
    "Wellness Resources": { count: 14, pct: 0.151 },
    "Comfort & Design": { count: 9, pct: 0.097 },
    "Quiet Reflection": { count: 3, pct: 0.032 },
  },
  n_total: 93,
};

// ── Segments ──────────────────────────────────────────────────────────────────

export const SEGMENTS = [
  { label: "Frequent Visitors", metric: "Interaction Rate", value: 0.373, n: 75 },
  { label: "Infrequent Visitors", metric: "Interaction Rate", value: 0.389, n: 18 },
  { label: "ScarletWell Aware", metric: "Avg Connection Score", value: 4.195, n: 41 },
  { label: "ScarletWell Unaware", metric: "Avg Connection Score", value: 3.697, n: 33 },
];

// ── Engagement funnel (first 3 stages only) ───────────────────────────────────

export const FUNNEL: FunnelStage[] = [
  { stage: "All Respondents", n: 93, pct: 1.0, drop: null, stage_drop_pct: 0 },
  { stage: "Regular Visitors", n: 75, pct: 0.8065, drop: 18, stage_drop_pct: 0.194 },
  { stage: "Met Someone New", n: 35, pct: 0.3763, drop: 40, stage_drop_pct: 0.533 },
];

// ── Needs & gaps ──────────────────────────────────────────────────────────────

export const GAPS: GapItem[] = [
  {
    need: "Quiet / Recharge Space",
    demand: 0.746,
    support: 0.20,
    gap: 0.546,
    note: "74% want it; no dedicated zone exists",
    impact_potential: 50.8,
    demand_pct: "75%",
    support_pct: "20%",
    gap_pct: "55%",
  },
  {
    need: "Social Connection",
    demand: 0.699,
    support: 0.376,
    gap: 0.323,
    note: "70% open to meeting someone; only 38% have",
    impact_potential: 30.0,
    demand_pct: "70%",
    support_pct: "38%",
    gap_pct: "32%",
  },
  {
    need: "Wellness Resource Awareness",
    demand: 0.75,
    support: 0.554,
    gap: 0.196,
    note: "55% aware; 45% not sure or unaware",
    impact_potential: 18.2,
    demand_pct: "75%",
    support_pct: "55%",
    gap_pct: "20%",
  },
  {
    need: "Layout Interaction Design",
    demand: 0.70,
    support: 0.552,
    gap: 0.148,
    note: "Only 55% agree layout encourages interaction",
    impact_potential: 13.8,
    demand_pct: "70%",
    support_pct: "55%",
    gap_pct: "15%",
  },
  {
    need: "Seating Availability",
    demand: 0.484,
    support: 0.35,
    gap: 0.134,
    note: "Strongest open-text signal; frequent overflow",
    impact_potential: 12.5,
    demand_pct: "48%",
    support_pct: "35%",
    gap_pct: "13%",
  },
  {
    need: "Events & Programming",
    demand: 0.280,
    support: 0.15,
    gap: 0.130,
    note: "28% mention events in open text",
    impact_potential: 12.0,
    demand_pct: "28%",
    support_pct: "15%",
    gap_pct: "13%",
  },
  {
    need: "Food & Nutrition Awareness",
    demand: 0.462,
    support: 0.50,
    gap: 0,
    note: "46% mention food/Harvest; support matches demand",
    impact_potential: 0,
    demand_pct: "46%",
    support_pct: "50%",
    gap_pct: "0%",
  },
];

// ── Theme metadata (for student voice section) ────────────────────────────────

export const THEME_META: Record<
  string,
  { label: string; desc: string; color: string; keywords: string[] }
> = {
  "Seating Capacity": {
    label: "Most urgent need",
    desc: "Students can't use a space they can't sit in. Overflow is actively limiting participation, not just comfort.",
    color: COLORS.CORAL,
    keywords: ["seat", "chair", "table", "sit", "crowded", "full", "standing"],
  },
  "Events & Programming": {
    label: "Biggest opportunity",
    desc: "Students want reasons to gather, not just a place to be. Programming is the highest-leverage, lowest-cost intervention.",
    color: COLORS.SAGE,
    keywords: ["event", "trivia", "program", "activity", "game", "workshop"],
  },
  "Social Connection": {
    label: "The strategic gap",
    desc: "The desire to connect is present — the environment just isn't facilitating it yet. Design and programming can close this.",
    color: COLORS.BLUE_GREY,
    keywords: ["meet", "connect", "people", "friend", "social", "talk", "community"],
  },
  "Quiet Reflection": {
    label: "Near-universal demand",
    desc: "74% of students want a quiet zone. This is not a niche preference — it's a core use case the space is currently missing.",
    color: COLORS.OLIVE,
    keywords: ["quiet", "relax", "recharge", "study", "peace", "calm", "reflect"],
  },
  "Wellness Resources": {
    label: "A communication gap",
    desc: "Students are present in the space but not discovering the wellness ecosystem that surrounds it.",
    color: COLORS.GOLD,
    keywords: ["wellness", "scarletwell", "health", "resource", "aware", "mental"],
  },
  "Comfort & Design": {
    label: "Environmental signals",
    desc: "Physical comfort and aesthetic quality signal belonging. Small design choices send large behavioral messages.",
    color: "#8B9E8B",
    keywords: ["comfortable", "cozy", "aesthetic", "design", "atmosphere", "vibe", "decor"],
  },
  "Food & Harvest": {
    label: "Underused anchor",
    desc: "The Harvest dining connection is a natural community-building asset that intentional programming could activate.",
    color: "#9BACC8",
    keywords: ["food", "harvest", "eat", "dining", "meal", "nutrition", "snack"],
  },
};

// ── Curated student quotes (by keyword group) ─────────────────────────────────

export const QUOTES: Record<string, string[]> = {
  welcoming: [
    "More tables and chairs — the current capacity is often full, meaning people need to wait.",
    "More seating would be lovely, but it's really nice right now.",
    "Definitely more seating! I can never find a table during peak hours.",
    "I fell less anxious and the lot of natural light made me feel good.",
    "I love that Harvest is getting the popularity it deserves, but I wish there were more seating areas.",
    "I would love if you brought back the live music occasionally, but I understand seating is tight.",
    "Slightly more heat — it's often chilly even in winter.",
  ],
  social: [
    "A little sign on the table you could flip to indicate you're welcome to strangers sitting with you.",
    "If there was a set long table for single people looking to meet others.",
    "Prompts about interests — something to spark a conversation naturally.",
    "If there was a way to designate whether or not someone is welcome to sit with you. I feel awkward intruding!",
    "I liked the daily/weekly challenges and trivia — table activities could facilitate more interaction.",
    "Maybe an event where you get free coffee if you talk to someone new and learn something about them.",
    "Themed tables might be cute — pop culture, anime — but seating is tight during rush hour.",
  ],
  programming: [
    "I really enjoyed the Wellness Through Clay events here, so probably events similar to that.",
    "ScarletArtsRX collabs! I always meet new people there.",
    "Health centers and CAPS — good guides on how to make smoothies and food awareness.",
    "Cooking events, food sampling, career events.",
    "Basic needs center information, bingo, art activities.",
    "Coloring books for mental health.",
    "Fresh food access initiatives or even food/donation drives.",
  ],
};

// ── Executive highlights ──────────────────────────────────────────────────────

export const HIGHLIGHTS = {
  strength: "High sense of connection (avg 3.97/5) among visitors",
  gap: "Only 38% of students have met someone new — interaction gap is the #1 opportunity",
  priority:
    "Convert regular visits into social connections through seating, zoning, and programming",
};

// ── Key insights ──────────────────────────────────────────────────────────────

export const INSIGHTS: Insight[] = [
  {
    title: "Presence Without Connection",
    description:
      "81% of students visit regularly, yet only 38% have met someone new. The space is succeeding as a destination but has not yet become a connector.",
    severity: "opportunity",
    action:
      "Introduce light-touch structured programming (icebreakers, trivia, shared tables) to convert regular visits into social encounters.",
    metric: "Regular visit rate vs. interaction rate",
  },
  {
    title: "High Latent Social Intent",
    description:
      "70% of students are open to meeting someone new, but only 38% have. That 32-point gap represents students who want connection but have no current pathway to it.",
    severity: "opportunity",
    action:
      "Remove friction: shared seating clusters, table prompts, brief structured interactions at events.",
    metric: "Open-to-meeting rate vs. actual interaction rate",
  },
  {
    title: "Comfort Without New Social Ties",
    description:
      "Students feel connected (avg 3.97/5), yet only 38% have met someone new. The space feels safe and familiar, but is not yet facilitating new relationships.",
    severity: "watch",
    action:
      "Design for weak-tie formation: shared seating, conversation starters, ambient programming.",
    metric: "Connection score vs. met-someone-new rate",
  },
  {
    title: "ScarletWell Awareness Gap",
    description:
      "Only 55% of students are aware of ScarletWell resources. Students are using the physical space without connecting to the wellness ecosystem it sits within.",
    severity: "concern",
    action:
      "Embed QR codes, table cards, and ambient signage. Use events as organic discovery moments.",
    metric: "ScarletWell awareness rate",
  },
  {
    title: "Strong Recharge Zone Demand",
    description:
      "75% of students want a designated reflection or recharge area. This is one of the clearest design mandates in the dataset.",
    severity: "opportunity",
    action:
      "Zone a quiet corner with comfortable seating, soft lighting, and minimal traffic. Signal its purpose through signage and design.",
    metric: "Reflection/recharge area demand",
  },
  {
    title: "Seating Is the #1 Student Complaint",
    description:
      "48% of students mention seating capacity in their open-text responses. This is the loudest and most repeated signal in the qualitative data.",
    severity: "concern",
    action:
      "Prioritize seating expansion. Shared long tables and temporary overflow seating are quick wins.",
    metric: "Seating capacity theme frequency",
  },
  {
    title: "Programming Demand Is Actionable",
    description:
      "28% of students mention events or programming in open-text. This demand is specific — students name trivia, themed days, and collaborative activities.",
    severity: "opportunity",
    action:
      "Launch a monthly IFNH event series. Start with trivia/theme days (top-ranked activity). Use events as a ScarletWell awareness channel.",
    metric: "Events & programming theme frequency",
  },
  {
    title: "Harvest Is a Magnet — Use It",
    description:
      "46% of students mention food or Harvest in their responses. The connection to Harvest Dining is a unique asset that could drive both visits and wellness awareness.",
    severity: "positive",
    action:
      "Leverage Harvest for event tie-ins, nutrition programming, and organic foot traffic activation.",
    metric: "Food & Harvest theme frequency",
  },
];

// ── Channel priority list (for wellness section) ──────────────────────────────

export const CHANNEL_PRIORITY = [
  {
    channel: "Table Cards",
    priority: "High",
    note: "39% preferred · ambient, persistent, no barrier to entry",
    color: COLORS.SAGE,
  },
  {
    channel: "Events",
    priority: "High",
    note: "27% preferred · builds community while building awareness",
    color: COLORS.SAGE,
  },
  {
    channel: "QR Codes",
    priority: "Medium",
    note: "18% preferred · frictionless, trackable, always-on",
    color: COLORS.GOLD,
  },
  {
    channel: "Digital Screens",
    priority: "Medium",
    note: "12% preferred · easy to update, no printing cost",
    color: COLORS.GOLD,
  },
  {
    channel: "Peer Ambassadors",
    priority: "Lower",
    note: "2% preferred now · high authenticity potential with the right program",
    color: COLORS.TEXT_MUTED,
  },
];

// ── Strategy path forward ─────────────────────────────────────────────────────

export const STRATEGY_STEPS = [
  { timing: "Immediate", action: "Address seating overflow. Add shared long tables and temporary seating." },
  { timing: "Short-Term", action: "Zone the space: quiet/recharge corner, group seating cluster, activation area." },
  { timing: "Short-Term", action: "Deploy table cards with ScarletWell resources and conversation prompts." },
  { timing: "Medium-Term", action: "Launch a monthly IFNH event series. Start with trivia/theme days." },
  { timing: "Medium-Term", action: "Add QR codes for wellness resource discovery at tables and the entrance." },
  { timing: "Ongoing", action: "Re-measure annually using the same survey. Track interaction rate and awareness." },
];
