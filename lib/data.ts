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
// Source: ifnh_shape_this_space_cleaned_may_6_2026.csv
// Exported from Qualtrics on May 6, 2026 at 16:39.
// The CSV contains 3 metadata header rows (Q-codes, human labels, ImportId JSON)
// followed by 104 submission rows.
// Validity rule: Q_RecaptchaStatus == "complete". One row had status "error" → excluded.
// Valid responses: 103.

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
// "answered" means the respondent gave a non-blank response to that question.

export const METRICS = {
  // ── Visit Frequency ──────────────────────────────────────────────────────────
  // Q1: "How often do you visit IFNH/Harvest during a typical week?"
  // 102 of 103 valid respondents answered Q1 (1 left blank).
  // Regular visitor = 1+ times/week (Daily, 1–2/week, 3–4/week).
  visit: {
    rate: 0.7941,         // 81 / 102 (answered denominator)
    rate_pct: "79%",
    n: 81,               // regular visitors (1+/week)
    n_total: 102,         // answered Q1
    freq_dist: {
      "1–2 times/week": 0.422,   // 43/102
      "3–4 times/week": 0.284,   // 29/102
      Occasionally: 0.206,       // 21/102
      Daily: 0.088,              // 9/102
    },
    score_mean_1_4: 2.25,
  },

  // ── Interaction Rate ─────────────────────────────────────────────────────────
  // Q3: "I have met new people here."
  // Options: Yes / No / "Not yet, but I would like to"
  // 102 of 103 valid respondents answered Q3 (1 left blank).
  // met_someone = "Yes"; open_to_meeting = "Yes" + "Not yet, but I would like to"
  interaction: {
    rate: 0.3627,         // 37 / 102 (answered denominator)
    rate_pct: "36%",
    n_met: 37,
    n_total: 102,         // answered Q3
    open_rate: 0.6765,    // 69 / 102 (Yes=37 + NotYet=32)
    open_rate_pct: "68%",
  },

  // ── Sense of Connection ───────────────────────────────────────────────────────
  // Q2: "I feel a sense of connection when I spend time in this space." (1–5 Likert)
  // 102 of 103 valid respondents answered Q2 (1 left blank).
  connection: {
    mean: 3.96,
    mean_str: "3.96",
    high_rate: 0.7059,   // 72/102: Agree or Strongly agree (≥4)
    distribution: {
      1: 0.010,           // 1/102
      2: 0.010,           // 1/102
      3: 0.275,           // 28/102
      4: 0.422,           // 43/102
      5: 0.284,           // 29/102
    },
    n: 102,
  },

  // ── ScarletWell Awareness ─────────────────────────────────────────────────────
  // Q13: "I am aware of the ScarletWell resources available to me."
  // Options: Yes / No / Not sure
  // 101 of 103 valid respondents answered Q13 (2 left blank).
  //
  // DEFINITION: Awareness rate = Yes / (Yes + No + Not sure)
  // This matches what the pie chart displays and treats "Not sure" as not aware,
  // which is the appropriate planning baseline.
  //
  // Yes=44, No=37, Not sure=20 → total answered=101 → rate=44/101=43.6%
  awareness: {
    rate: 0.4356,         // 44 / 101
    rate_pct: "44%",
    n_aware: 44,          // answered Yes
    n_not_aware: 37,      // answered No
    n_total: 101,         // total who answered (Yes + No + Not sure)
    n_not_sure: 20,       // answered Not sure
    raw_dist: {
      Yes: 0.436,          // 44/101
      No: 0.366,           // 37/101
      "Not sure": 0.198,   // 20/101
    },
  },

  // ── Reflection / Recharge Demand ─────────────────────────────────────────────
  // Q8: "Would a designated reflection/recharge area be helpful?"
  // Options: Yes / No / Not sure
  // 96 of 103 valid respondents answered Q8 (7 left blank).
  // Yes=51, No=15, Not sure=30.
  //
  // HEADLINE RATE (rate): Yes / (Yes + No) = 51/66 = 77.3%
  //   Denominator excludes "Not sure" to isolate the yes/no preference signal.
  //   Subtext: "Among students who gave a yes/no preference; 51 of 66 said yes."
  //
  // BREAKDOWN RATE (raw_dist): proportions of all 96 who answered, including "Not sure".
  //   Interpretation: 53% Yes · 31% Not sure · 16% No (of all Q8 respondents)
  //
  // Open-text mention rate: ~2% (2/103) — very different signal; don't conflate.
  reflection: {
    rate: 0.7727,           // 51 / 66 (Yes + No denominator = yes/no preference rate)
    rate_pct: "77%",
    n_yes: 51,
    n_no: 15,
    n_total: 66,            // Yes + No (preference-only denominator for headline KPI)
    n_not_sure: 30,
    n_answered: 96,         // all who gave any answer (Yes + No + Not sure)
    opentext_rate: 0.019,   // 2/103 open-text mentions — different signal entirely
    raw_dist: {
      Yes: 0.531,           // 51/96 (of all Q8 respondents)
      "Not sure": 0.313,    // 30/96
      No: 0.156,            // 15/96
    },
  },

  // ── Layout Interaction Support ────────────────────────────────────────────────
  // Q6: "The current layout encourages conversation and interaction." (1–5 Likert)
  // 96 of 103 valid respondents answered Q6 (7 left blank).
  layout: {
    mean: 3.57,
    mean_str: "3.57",
    agree_rate: 0.5833,     // 56/96: Agree or Strongly agree (≥4)
    agree_rate_pct: "58%",
    disagree_rate: 0.1146,  // 11/96: Disagree or Strongly disagree (≤2)
    raw_dist: {
      Agree: 0.469,          // 45/96
      Neutral: 0.302,        // 29/96
      "Strongly agree": 0.115, // 11/96
      Disagree: 0.104,       // 10/96
      "Strongly disagree": 0.010, // 1/96
    },
  },

  // ── Wellness Resource Self-Awareness ──────────────────────────────────────────
  // Q11: "I am aware of wellness campus resources available to me." (1–5 Likert)
  // 91 of 103 valid respondents answered Q11 (12 left blank).
  wellness: {
    mean: 3.65,
    mean_str: "3.65",
    high_rate: 0.6593,   // 60/91: Agree or Strongly agree (≥4)
    distribution: {
      1: 0.011,           // 1/91
      2: 0.121,           // 11/91
      3: 0.209,           // 19/91
      4: 0.527,           // 48/91
      5: 0.132,           // 12/91
    },
    n: 91,
  },

  // ── Preferred Wellness Learning Channel ───────────────────────────────────────
  // Q12: "How would you prefer to learn about wellness campus resources?"
  // 90 of 103 valid respondents answered Q12 (13 left blank).
  channels: {
    dist: {
      "Table cards": 35,
      Events: 24,
      "QR codes": 16,
      "Digital screens": 13,
      "Peer ambassadors": 2,
    },
    norm: {
      "Table cards": 0.389,    // 35/90
      Events: 0.267,           // 24/90
      "QR codes": 0.178,       // 16/90
      "Digital screens": 0.144, // 13/90
      "Peer ambassadors": 0.022, // 2/90
    },
    top: "Table cards",
    n: 90,
  },

  // ── Seating Preferences ───────────────────────────────────────────────────────
  // Q7: "What types of seating or table arrangements would encourage more interaction?"
  // 96 of 103 valid respondents answered Q7 (7 left blank).
  seating: {
    dist: {
      "Mixed options": 61,
      "Shared long tables": 13,
      "Round tables": 13,
      "Lounge seating": 5,
      "Other": 4,
    },
    norm: {
      "Mixed options": 0.635,      // 61/96
      "Shared long tables": 0.135, // 13/96
      "Round tables": 0.135,       // 13/96
      "Lounge seating": 0.052,     // 5/96
      "Other": 0.042,              // 4/96
    },
    top: "Mixed options",
    n: 96,
  },

  // ── Table Activity Preferences ────────────────────────────────────────────────
  // Q9: "What table-based activities would you participate in?" (single-select)
  // 94 of 103 valid respondents answered Q9 (9 left blank).
  // "None" (9) and "Other" (6) are excluded from the ranked display.
  // Norm uses n=94 (all who answered) as denominator.
  activities: {
    dist: {
      "Trivia or theme days": 32,
      "Creative prompts": 14,
      "Daily/weekly challenges": 14,
      "Resource bingo": 11,
      "Conversation prompts": 8,
    },
    norm: {
      "Trivia or theme days": 0.340,  // 32/94
      "Creative prompts": 0.149,      // 14/94
      "Daily/weekly challenges": 0.149, // 14/94
      "Resource bingo": 0.117,        // 11/94
      "Conversation prompts": 0.085,  // 8/94
    },
    top: "Trivia or theme days",
    n: 94,   // respondents who answered Q9 (including None/Other, excluded from ranking)
  },

  // ── Open-Text Theme Mention Rates ─────────────────────────────────────────────
  // Derived from keyword coding of Q5 ("what would make this space more welcoming")
  // and Q13 ("services/activities you'd like"). A respondent is counted once per theme
  // regardless of keyword match count. n = 103 valid respondents.
  // These are open-text mention rates — qualitative signals, not closed-ended survey demand.
  themes: {
    "Seating Capacity":     { count: 45, pct: 0.437 },  // 45/103
    "Food & Harvest":       { count: 44, pct: 0.427 },  // 44/103
    "Events & Programming": { count: 17, pct: 0.165 },  // 17/103
    "Social Connection":    { count: 16, pct: 0.155 },  // 16/103
    "Wellness Resources":   { count: 11, pct: 0.107 },  // 11/103
    "Comfort & Design":     { count:  5, pct: 0.049 },  // 5/103
    "Quiet Reflection":     { count:  2, pct: 0.019 },  // 2/103 — see reflection.rate for survey demand
  },

  n_total: 103,
};

// ── Segments ──────────────────────────────────────────────────────────────────
// Cross-tabulations from May 6, 2026 dataset.

export const SEGMENTS = [
  { label: "Frequent Visitors",   metric: "Interaction Rate",     value: 0.370, n: 81 },  // 30/81 answered Q3
  { label: "Infrequent Visitors", metric: "Interaction Rate",     value: 0.333, n: 21 },  // 7/21 answered Q3
  { label: "ScarletWell Aware",   metric: "Avg Connection Score", value: 4.159, n: 44 },  // mean Q2 score for Yes respondents
  { label: "ScarletWell Unaware", metric: "Avg Connection Score", value: 3.730, n: 37 },  // mean Q2 score for No respondents
];

// ── Engagement funnel (first 3 stages) ───────────────────────────────────────
// pct = fraction of all 103 respondents who reach that stage (funnel perspective).
// Drop counts reflect respondents who visited but didn't progress to next stage.

export const FUNNEL: FunnelStage[] = [
  { stage: "All Respondents",  n: 103, pct: 1.0,    drop: null, stage_drop_pct: 0     },
  { stage: "Regular Visitors", n: 81,  pct: 0.7864, drop: 22,   stage_drop_pct: 0.214 },
  { stage: "Met Someone New",  n: 37,  pct: 0.3592, drop: 44,   stage_drop_pct: 0.457 },
];

// ── Needs & gaps ──────────────────────────────────────────────────────────────
// Demand %: from closed-ended survey questions or open-text keyword rates (noted per item).
// Estimated Current Support %: directional proxy based on observation; not measured.
// Gap = Demand % − Estimated Current Support %.

export const GAPS: GapItem[] = [
  {
    need: "Quiet / Recharge Space",
    demand: 0.773,
    support: 0.20,
    gap: 0.573,
    note: "77% want it (Q8: Yes among yes/no respondents); no dedicated zone exists",
    impact_potential: 53.4,
    demand_pct: "77%",
    support_pct: "20%",
    gap_pct: "57%",
  },
  {
    need: "Social Connection",
    demand: 0.677,
    support: 0.363,
    gap: 0.314,
    note: "68% open to meeting someone (Q3 Yes + Would Like); only 36% have",
    impact_potential: 29.2,
    demand_pct: "68%",
    support_pct: "36%",
    gap_pct: "31%",
  },
  {
    need: "Wellness Resource Awareness",
    demand: 0.75,
    support: 0.436,
    gap: 0.314,
    note: "44% aware of ScarletWell (Q13: Yes/all answered); 56% not sure or unaware",
    impact_potential: 29.2,
    demand_pct: "75%",
    support_pct: "44%",
    gap_pct: "31%",
  },
  {
    need: "Layout Interaction Design",
    demand: 0.70,
    support: 0.583,
    gap: 0.117,
    note: "Only 58% agree the layout encourages interaction (Q6)",
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
    demand: 0.165,
    support: 0.15,
    gap: 0.015,
    note: "17% mention events in open text; 27% prefer events as a wellness channel",
    impact_potential: 1.4,
    demand_pct: "17%",
    support_pct: "15%",
    gap_pct: "2%",
  },
  {
    need: "Food & Nutrition Awareness",
    demand: 0.427,
    support: 0.50,
    gap: 0,
    note: "43% mention food/Harvest; estimated support meets or exceeds demand",
    impact_potential: 0,
    demand_pct: "43%",
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
    desc: "17% of students mention events or programming in open text. The appetite for programming is real and actionable — trivia and themed days are the top-ranked table activity.",
    color: COLORS.SAGE,
    keywords: ["event", "trivia", "program", "activity", "game", "workshop"],
  },
  "Social Connection": {
    label: "The strategic gap",
    desc: "The desire to connect is present — 68% of students are open to meeting someone new, but only 36% have. The environment is not yet facilitating it. Design and programming can close this gap.",
    color: COLORS.BLUE_GREY,
    keywords: ["meet", "connect", "people", "friend", "social", "talk", "community"],
  },
  "Quiet Reflection": {
    label: "Clear design mandate",
    desc: "77% of students answered Yes when asked if a quiet/recharge zone would be helpful (closed-ended Q8, yes/no preference). Only ~2% mention quiet space in open text — these measure entirely different things. The closed-ended rate is the planning signal.",
    color: COLORS.OLIVE,
    keywords: ["quiet", "relax", "recharge", "study", "peace", "calm", "reflect"],
  },
  "Wellness Resources": {
    label: "A communication gap",
    desc: "Students are present in the space but not discovering the wellness ecosystem that surrounds it. Only 44% are aware of ScarletWell (Yes responses out of all who answered the awareness question).",
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
      "68% of students are open to meeting someone new, but only 36% have. That 32-point gap represents students who want connection but have no current pathway to it.",
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
      "Only 44% of students are aware of ScarletWell resources (Yes responses out of all who answered the awareness question, including Not sure). Students are using the physical space without connecting to the wellness ecosystem it sits within.",
    severity: "concern",
    action:
      "Embed QR codes, table cards, and ambient signage. Use events as organic discovery moments.",
    metric: "ScarletWell awareness rate",
  },
  {
    title: "Strong Recharge Zone Demand",
    description:
      "77% of students said Yes when asked if a quiet/recharge zone would be helpful — among students who gave a yes/no preference (51 of 66). This is one of the clearest design mandates in the dataset. Note: only ~2% spontaneously mention quiet space in open text — these are different signals.",
    severity: "opportunity",
    action:
      "Zone a quiet corner with comfortable seating, soft lighting, and minimal traffic. Signal its purpose through signage and design.",
    metric: "Reflection/recharge area demand (closed-ended, yes/no preference)",
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
    title: "Programming Demand Is Present and Actionable",
    description:
      "17% of students mention events or programming in open text — and 27% of respondents choose events as their preferred wellness learning channel. The demand is real and offers a high-leverage, low-cost opportunity.",
    severity: "opportunity",
    action:
      "Launch a monthly IFNH event series. Start with trivia/theme days (top-ranked activity). Use events as a ScarletWell awareness channel.",
    metric: "Events & programming theme frequency",
  },
  {
    title: "Harvest Is a Magnet — Use It",
    description:
      "43% of students mention food or Harvest in their responses. The connection to Harvest Dining is a unique asset that could drive both visits and wellness awareness.",
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
