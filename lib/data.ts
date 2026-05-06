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
// Source: Shape This Space! Harvest IFNH_May 6, 2026_16.39_CLEANED.csv
// Exported from Qualtrics on May 6, 2026 at 16:39.
// One response excluded: recaptcha error / no core fields answered.

export const SURVEY_META = {
  raw_rows: 104,
  analysis_rows: 103,
  excluded_rows: 1,
  semester: "Spring 2026",
  export_date: "May 6, 2026",
  source_file: "ifnh_shape_this_space_cleaned_may_6_2026.csv",
};

// ── Core KPI metrics (computed from 103 valid responses) ──────────────────────
// NOTE: Denominators vary by question. Each metric notes its effective n.
// Percentages are calculated from respondents who answered the relevant question.

export const METRICS = {
  // ── Visit Frequency ──────────────────────────────────────────────────────────
  // Q1: "How often do you visit IFNH/Harvest during a typical week?" (n=103, all answered)
  visit: {
    rate: 0.7864,
    rate_pct: "79%",
    n: 81,            // regular visitors (1+/week)
    n_total: 103,
    freq_dist: {
      "1–2 times/week": 0.417,
      "3–4 times/week": 0.282,
      Occasionally: 0.204,
      Daily: 0.087,
    },
    score_mean_1_4: 2.25,
  },

  // ── Interaction Rate ─────────────────────────────────────────────────────────
  // Q3: "I have met new people here." (n=103, all answered)
  // met_someone = "Yes"; open_to_meeting = "Yes" + "Not yet, but I would like to"
  interaction: {
    rate: 0.3592,
    rate_pct: "36%",
    n_met: 37,
    n_total: 103,
    open_rate: 0.6699,
    open_rate_pct: "67%",
  },

  // ── Sense of Connection ───────────────────────────────────────────────────────
  // Q2: "I feel a sense of connection when I spend time in this space." (1–5 Likert, n=102)
  // One respondent left Q2 blank.
  connection: {
    mean: 3.96,
    mean_str: "3.96",
    high_rate: 0.7059,  // ≥4 (Agree or Strongly agree)
    distribution: {
      1: 0.010,
      2: 0.010,
      3: 0.275,
      4: 0.422,
      5: 0.284,
    },
    n: 102,
  },

  // ── ScarletWell Awareness ─────────────────────────────────────────────────────
  // Q13: "I am aware of the ScarletWell resources available to me." (n=101 answered; 2 blank)
  // Awareness rate = Yes / (Yes + No), excluding "Not sure" from denominator.
  awareness: {
    rate: 0.5432,
    rate_pct: "54%",
    n_aware: 44,
    n_not_aware: 37,
    n_total: 101,     // total who responded (Yes + No + Not sure)
    n_not_sure: 20,
    raw_dist: {
      Yes: 0.436,       // 44/101
      No: 0.366,        // 37/101
      "Not sure": 0.198, // 20/101
    },
  },

  // ── Reflection / Recharge Demand ─────────────────────────────────────────────
  // Q8: "Would a designated reflection/recharge area be helpful?" (n=96 answered; 7 blank)
  // Closed-ended demand rate = Yes / (Yes + No), excluding "Not sure" from denominator.
  // Open-text mention rate ("quiet"/"recharge" keywords): ~1% (1/103) — see themes below.
  // These are two different signals and should not be combined.
  reflection: {
    rate: 0.7727,
    rate_pct: "77%",
    n_yes: 51,
    n_total: 66,       // Yes + No only (Not sure excluded from rate denominator)
    n_not_sure: 30,
    n_answered: 96,    // all who gave any answer including Not sure
    opentext_rate: 0.010, // 1/103 — qualitative mention only, very different signal
    raw_dist: {
      Yes: 0.531,        // 51/96
      "Not sure": 0.313, // 30/96
      No: 0.156,         // 15/96
    },
  },

  // ── Layout Interaction Support ────────────────────────────────────────────────
  // Q6: "The current layout encourages conversation and interaction." (1–5 Likert, n=96)
  // Seven respondents left Q6 blank.
  layout: {
    mean: 3.57,
    mean_str: "3.57",
    agree_rate: 0.5833,   // ≥4 (Agree or Strongly agree)
    agree_rate_pct: "58%",
    disagree_rate: 0.1146, // ≤2 (Disagree or Strongly disagree)
    raw_dist: {
      Agree: 0.469,
      Neutral: 0.302,
      "Strongly agree": 0.115,
      Disagree: 0.104,
      "Strongly disagree": 0.010,
    },
  },

  // ── Wellness Resource Self-Awareness ──────────────────────────────────────────
  // Q11: "I am aware of wellness campus resources available to me." (1–5 Likert, n=91)
  // Twelve respondents left Q11 blank.
  wellness: {
    mean: 3.65,
    mean_str: "3.65",
    high_rate: 0.6593,  // ≥4
    distribution: {
      1: 0.011,
      2: 0.121,
      3: 0.209,
      4: 0.527,
      5: 0.132,
    },
    n: 91,
  },

  // ── Preferred Wellness Learning Channel ───────────────────────────────────────
  // Q12: "How would you prefer to learn about wellness campus resources?" (n=90 answered; 13 blank)
  channels: {
    dist: {
      "Table cards": 35,
      Events: 24,
      "QR codes": 16,
      "Digital screens": 13,
      "Peer ambassadors": 2,
    },
    norm: {
      "Table cards": 0.389,
      Events: 0.267,
      "QR codes": 0.178,
      "Digital screens": 0.144,
      "Peer ambassadors": 0.022,
    },
    top: "Table cards",
    n: 90,
  },

  // ── Seating Preferences ───────────────────────────────────────────────────────
  // Q7: "What types of seating or table arrangements would encourage more interaction?" (n=96; 7 blank)
  seating: {
    dist: {
      "Mixed options": 61,
      "Shared long tables": 13,
      "Round tables": 13,
      "Lounge seating": 5,
      "Other": 4,
    },
    norm: {
      "Mixed options": 0.635,
      "Shared long tables": 0.135,
      "Round tables": 0.135,
      "Lounge seating": 0.052,
      "Other": 0.042,
    },
    top: "Mixed options",
    n: 96,
  },

  // ── Table Activity Preferences ────────────────────────────────────────────────
  // Q9: "What table-based activities would you participate in?" (select all that apply; n=94 who answered)
  // Counts are per 94 respondents; multi-select so totals exceed 100%.
  // "None" (9 respondents) and "Other" (6) are excluded from display ranking.
  activities: {
    dist: {
      "Trivia or theme days": 32,
      "Creative prompts": 14,
      "Daily/weekly challenges": 14,
      "Resource bingo": 11,
      "Conversation prompts": 8,
    },
    norm: {
      "Trivia or theme days": 0.340,
      "Creative prompts": 0.149,
      "Daily/weekly challenges": 0.149,
      "Resource bingo": 0.117,
      "Conversation prompts": 0.085,
    },
    top: "Trivia or theme days",
    n: 94,   // respondents who chose at least one activity
  },

  // ── Open-Text Theme Mention Rates ─────────────────────────────────────────────
  // Derived from manual keyword coding of Q5 ("what would make this space more welcoming")
  // and Q13 ("services/activities you'd like"). Coded per respondent — a respondent is
  // counted once per theme regardless of how many keywords matched. n = 103.
  themes: {
    "Seating Capacity":    { count: 45, pct: 0.437 },
    "Food & Harvest":      { count: 43, pct: 0.417 },
    "Events & Programming":{ count: 16, pct: 0.155 },
    "Social Connection":   { count: 15, pct: 0.146 },
    "Wellness Resources":  { count: 10, pct: 0.097 },
    "Comfort & Design":    { count:  2, pct: 0.019 },
    "Quiet Reflection":    { count:  1, pct: 0.010 },
  },

  n_total: 103,
};

// ── Segments ──────────────────────────────────────────────────────────────────
// Cross-tabulations from May 6, 2026 dataset.

export const SEGMENTS = [
  { label: "Frequent Visitors",   metric: "Interaction Rate",      value: 0.370, n: 81 },
  { label: "Infrequent Visitors", metric: "Interaction Rate",      value: 0.333, n: 21 },
  { label: "ScarletWell Aware",   metric: "Avg Connection Score",  value: 4.159, n: 44 },
  { label: "ScarletWell Unaware", metric: "Avg Connection Score",  value: 3.730, n: 37 },
];

// ── Engagement funnel (first 3 stages only) ───────────────────────────────────

export const FUNNEL: FunnelStage[] = [
  { stage: "All Respondents",  n: 103, pct: 1.0,    drop: null, stage_drop_pct: 0     },
  { stage: "Regular Visitors", n: 81,  pct: 0.7864, drop: 22,   stage_drop_pct: 0.214 },
  { stage: "Met Someone New",  n: 37,  pct: 0.3592, drop: 44,   stage_drop_pct: 0.457 },
];

// ── Needs & gaps ──────────────────────────────────────────────────────────────
// Demand %: derived from survey closed-ended or open-text responses (see notes per item).
// Estimated Current Support %: based on direct observation; directional proxy, not measured.
// Gap = Demand % − Estimated Current Support %.

export const GAPS: GapItem[] = [
  {
    need: "Quiet / Recharge Space",
    demand: 0.773,
    support: 0.20,
    gap: 0.573,
    note: "77% want it (closed-ended Q8 Yes/Yes+No); no dedicated zone exists",
    impact_potential: 53.4,
    demand_pct: "77%",
    support_pct: "20%",
    gap_pct: "57%",
  },
  {
    need: "Social Connection",
    demand: 0.670,
    support: 0.359,
    gap: 0.311,
    note: "67% open to meeting someone (Q3 Yes+Would Like); only 36% have",
    impact_potential: 29.0,
    demand_pct: "67%",
    support_pct: "36%",
    gap_pct: "31%",
  },
  {
    need: "Wellness Resource Awareness",
    demand: 0.75,
    support: 0.543,
    gap: 0.207,
    note: "54% aware of ScarletWell; 46% not sure or unaware",
    impact_potential: 19.3,
    demand_pct: "75%",
    support_pct: "54%",
    gap_pct: "21%",
  },
  {
    need: "Layout Interaction Design",
    demand: 0.70,
    support: 0.583,
    gap: 0.117,
    note: "Only 58% agree layout encourages interaction",
    impact_potential: 10.9,
    demand_pct: "70%",
    support_pct: "58%",
    gap_pct: "12%",
  },
  {
    need: "Seating Availability",
    demand: 0.437,
    support: 0.35,
    gap: 0.087,
    note: "44% mention seating in open text; overflow is the #1 qualitative signal",
    impact_potential: 8.1,
    demand_pct: "44%",
    support_pct: "35%",
    gap_pct: "9%",
  },
  {
    need: "Events & Programming",
    demand: 0.155,
    support: 0.15,
    gap: 0.005,
    note: "16% mention events in open text (down from 28% in prior export)",
    impact_potential: 0.5,
    demand_pct: "16%",
    support_pct: "15%",
    gap_pct: "1%",
  },
  {
    need: "Food & Nutrition Awareness",
    demand: 0.417,
    support: 0.50,
    gap: 0,
    note: "42% mention food/Harvest; support meets or exceeds demand",
    impact_potential: 0,
    demand_pct: "42%",
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
    label: "Emerging opportunity",
    desc: "16% of students mention events in open text — down from 28% in the prior export. Demand exists but is not yet the top-of-mind signal it once was. Programming is still a high-leverage, low-cost lever.",
    color: COLORS.SAGE,
    keywords: ["event", "trivia", "program", "activity", "game", "workshop"],
  },
  "Social Connection": {
    label: "The strategic gap",
    desc: "The desire to connect is present — 67% of students are open to meeting someone new, but only 36% have. The environment is not yet facilitating it. Design and programming can close this gap.",
    color: COLORS.BLUE_GREY,
    keywords: ["meet", "connect", "people", "friend", "social", "talk", "community"],
  },
  "Quiet Reflection": {
    label: "Clear design mandate",
    desc: "77% of students answered Yes when asked if a quiet/recharge zone would be helpful (closed-ended survey). Only ~1% mention quiet space in open text — these measure different things. The closed-ended rate is the more reliable signal.",
    color: COLORS.OLIVE,
    keywords: ["quiet", "relax", "recharge", "study", "peace", "calm", "reflect"],
  },
  "Wellness Resources": {
    label: "A communication gap",
    desc: "Students are present in the space but not discovering the wellness ecosystem that surrounds it. Only 54% are aware of ScarletWell.",
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
  strength: "High sense of connection (avg 3.96/5) among visitors",
  gap: "Only 36% of students have met someone new — interaction gap is the #1 opportunity",
  priority:
    "Convert regular visits into social connections through seating, zoning, and programming",
};

// ── Key insights ──────────────────────────────────────────────────────────────

export const INSIGHTS: Insight[] = [
  {
    title: "Presence Without Connection",
    description:
      "79% of students visit regularly, yet only 36% have met someone new. The space is succeeding as a destination but has not yet become a connector.",
    severity: "opportunity",
    action:
      "Introduce light-touch structured programming (icebreakers, trivia, shared tables) to convert regular visits into social encounters.",
    metric: "Regular visit rate vs. interaction rate",
  },
  {
    title: "High Latent Social Intent",
    description:
      "67% of students are open to meeting someone new, but only 36% have. That 31-point gap represents students who want connection but have no current pathway to it.",
    severity: "opportunity",
    action:
      "Remove friction: shared seating clusters, table prompts, brief structured interactions at events.",
    metric: "Open-to-meeting rate vs. actual interaction rate",
  },
  {
    title: "Comfort Without New Social Ties",
    description:
      "Students feel connected (avg 3.96/5), yet only 36% have met someone new. The space feels safe and familiar, but is not yet facilitating new relationships.",
    severity: "watch",
    action:
      "Design for weak-tie formation: shared seating, conversation starters, ambient programming.",
    metric: "Connection score vs. met-someone-new rate",
  },
  {
    title: "ScarletWell Awareness Gap",
    description:
      "Only 54% of students are aware of ScarletWell resources. Students are using the physical space without connecting to the wellness ecosystem it sits within.",
    severity: "concern",
    action:
      "Embed QR codes, table cards, and ambient signage. Use events as organic discovery moments.",
    metric: "ScarletWell awareness rate",
  },
  {
    title: "Strong Recharge Zone Demand",
    description:
      "77% of students said Yes when asked if a quiet/recharge zone would be helpful (closed-ended question). This is one of the clearest design mandates in the dataset. Note: only ~1% spontaneously mention quiet space in open text — these are different signals.",
    severity: "opportunity",
    action:
      "Zone a quiet corner with comfortable seating, soft lighting, and minimal traffic. Signal its purpose through signage and design.",
    metric: "Reflection/recharge area demand (closed-ended)",
  },
  {
    title: "Seating Is the #1 Student Complaint",
    description:
      "44% of students mention seating capacity in their open-text responses. This is the loudest and most repeated signal in the qualitative data.",
    severity: "concern",
    action:
      "Prioritize seating expansion. Shared long tables and temporary overflow seating are quick wins.",
    metric: "Seating capacity theme frequency",
  },
  {
    title: "Programming Demand Has Moderated",
    description:
      "16% of students mention events or programming in open text — down from 28% in the prior export. The demand is still real and actionable, but is less top-of-mind than seating and social connection.",
    severity: "opportunity",
    action:
      "Launch a monthly IFNH event series. Start with trivia/theme days (top-ranked activity). Use events as a ScarletWell awareness channel.",
    metric: "Events & programming theme frequency",
  },
  {
    title: "Harvest Is a Magnet — Use It",
    description:
      "42% of students mention food or Harvest in their responses. The connection to Harvest Dining is a unique asset that could drive both visits and wellness awareness.",
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
    note: "14% preferred · easy to update, no printing cost",
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
