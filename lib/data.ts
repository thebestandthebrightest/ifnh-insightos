import dashboardMetrics from "@/data/ifnh_dashboard_metrics_105.json";

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
// Source of truth for this refresh:
// 1. ifnh_dashboard_metrics_105.json
// 2. ifnh_summary_metrics_105.csv
// 3. ifnh_survey_cleaned_105.csv

const answered = dashboardMetrics.answered_n_by_question;
const distributions = dashboardMetrics.distributions;
const totalResponses = dashboardMetrics.total_exported_responses;
const completeResponses = dashboardMetrics.complete_responses_progress_100;
const partialResponses = dashboardMetrics.partial_responses;

const visitAnswered = answered.visit_frequency;
const visitRegularCount = dashboardMetrics.regular_weekly_visitors_all_answered.count;
const visitCounts = distributions.visit_frequency;

const interactionAnswered = answered.met_new_people;
const interactionYesCount = distributions.met_new_people.Yes;
const interactionOpenCount =
  distributions.met_new_people.Yes +
  distributions.met_new_people["Not yet, but I would like to"];

const connectionAnswered = answered.sense_of_connection;
const connectionCounts = distributions.sense_of_connection;
const connectionMean =
  (connectionCounts["Strongly disagree"] * 1 +
    connectionCounts.Disagree * 2 +
    connectionCounts.Neutral * 3 +
    connectionCounts.Agree * 4 +
    connectionCounts["Strongly agree"] * 5) /
  connectionAnswered;

const awarenessAnswered = answered.scarletwell_awareness;
const awarenessCounts = distributions.scarletwell_awareness;

const reflectionAnswered = answered.reflection_recharge_helpful;
const reflectionCounts = distributions.reflection_recharge_helpful;
const reflectionPreferenceTotal = reflectionCounts.Yes + reflectionCounts.No;

const layoutAnswered = answered.layout_encourages_interaction;
const layoutCounts = distributions.layout_encourages_interaction;
const layoutMean =
  (layoutCounts["Strongly disagree"] * 1 +
    layoutCounts.Disagree * 2 +
    layoutCounts.Neutral * 3 +
    layoutCounts.Agree * 4 +
    layoutCounts["Strongly agree"] * 5) /
  layoutAnswered;

const wellnessAnswered = answered.wellness_resource_awareness;
const wellnessCounts = distributions.wellness_resource_awareness;
const wellnessMean =
  (wellnessCounts["Strongly disagree"] * 1 +
    wellnessCounts.Disagree * 2 +
    wellnessCounts.Neutral * 3 +
    wellnessCounts.Agree * 4 +
    wellnessCounts["Strongly agree"] * 5) /
  wellnessAnswered;

const channelAnswered = answered.wellness_info_channel;
const channelCounts = distributions.wellness_info_channel;

const seatingAnswered = answered.seating_preference;
const seatingCounts = distributions.seating_preference;

const activityAnswered = answered.table_activity_preference;
const activityCounts = distributions.table_activity_preference;

const themeCounts = {
  "Seating Capacity": 50,
  "Food & Harvest": 23,
  "Events & Programming": 26,
  "Social Connection": 20,
  "Wellness Resources": 11,
  "Comfort & Design": 4,
  "Quiet Reflection": 3,
} as const;

const pct = (value: number) => `${Math.round(value * 100)}%`;
const ratio = (count: number, total: number) => count / total;

const regularVisitRate = ratio(visitRegularCount, visitAnswered);
const interactionRate = ratio(interactionYesCount, interactionAnswered);
const openMeetingRate = ratio(interactionOpenCount, interactionAnswered);
const awarenessRate = ratio(awarenessCounts.Yes, awarenessAnswered);
const reflectionRate = ratio(reflectionCounts.Yes, reflectionPreferenceTotal);
const reflectionAnsweredRate = ratio(reflectionCounts.Yes, reflectionAnswered);
const layoutAgreeRate = ratio(
  dashboardMetrics.topline.layout_agree_or_strongly_agree,
  layoutAnswered
);
const wellnessHighRate = ratio(
  dashboardMetrics.topline.wellness_resource_awareness_agree_or_strongly_agree,
  wellnessAnswered
);
const highConnectionRate = ratio(
  dashboardMetrics.topline.sense_of_connection_agree_or_strongly_agree,
  connectionAnswered
);

export const SURVEY_META = {
  raw_rows: totalResponses,
  analysis_rows: totalResponses,
  excluded_rows: 0,
  total_responses: totalResponses,
  complete_responses: completeResponses,
  partial_responses: partialResponses,
  semester: "Spring 2026",
  export_date: "May 12, 2026",
  source_file: "ifnh_dashboard_metrics_105.json",
  summary_file: "ifnh_summary_metrics_105.csv",
  cleaned_csv_file: "ifnh_survey_cleaned_105.csv",
  methodology_note:
    "Percentages use question-level response counts, so denominators vary slightly by item.",
};

// ── Core KPI metrics (computed from the 105-response refresh) ─────────────────
// NOTE: Denominators vary by question. Each metric notes its effective n.
// "answered" means the respondent gave a non-blank response to that question.

export const METRICS = {
  // ── Visit Frequency ──────────────────────────────────────────────────────────
  // Q1: "How often do you visit IFNH/Harvest during a typical week?"
  // 104 of 105 respondents answered Q1.
  // Regular visitor = 1+ times/week (Daily, 1–2/week, 3–4/week).
  visit: {
    rate: regularVisitRate,
    rate_pct: pct(regularVisitRate),
    n: visitRegularCount,
    n_total: visitAnswered,
    freq_dist: {
      "1–2 times/week": ratio(visitCounts["1-2 times/week"], visitAnswered),
      "3–4 times/week": ratio(visitCounts["3-4 times/week"], visitAnswered),
      Occasionally: ratio(visitCounts.Occasionally, visitAnswered),
      Daily: ratio(visitCounts.Daily, visitAnswered),
    },
    chart: [
      {
        label: "Occasionally",
        percent: Number((ratio(visitCounts.Occasionally, visitAnswered) * 100).toFixed(1)),
        count: visitCounts.Occasionally,
      },
      {
        label: "1–2×/week",
        percent: Number((ratio(visitCounts["1-2 times/week"], visitAnswered) * 100).toFixed(1)),
        count: visitCounts["1-2 times/week"],
      },
      {
        label: "3–4×/week",
        percent: Number((ratio(visitCounts["3-4 times/week"], visitAnswered) * 100).toFixed(1)),
        count: visitCounts["3-4 times/week"],
      },
      {
        label: "Daily",
        percent: Number((ratio(visitCounts.Daily, visitAnswered) * 100).toFixed(1)),
        count: visitCounts.Daily,
      },
    ],
    score_mean_1_4:
      (visitCounts.Occasionally * 1 +
        visitCounts["1-2 times/week"] * 2 +
        visitCounts["3-4 times/week"] * 3 +
        visitCounts.Daily * 4) /
      visitAnswered,
  },

  // ── Interaction Rate ─────────────────────────────────────────────────────────
  // Q3: "I have met new people here."
  // Options: Yes / No / "Not yet, but I would like to"
  // 104 of 105 respondents answered Q3.
  // met_someone = "Yes"; open_to_meeting = "Yes" + "Not yet, but I would like to"
  interaction: {
    rate: interactionRate,
    rate_pct: pct(interactionRate),
    n_met: interactionYesCount,
    n_total: interactionAnswered,
    open_rate: openMeetingRate,
    open_rate_pct: pct(openMeetingRate),
  },

  // ── Sense of Connection ───────────────────────────────────────────────────────
  // Q2: "I feel a sense of connection when I spend time in this space." (1–5 Likert)
  // 104 of 105 respondents answered Q2.
  connection: {
    mean: connectionMean,
    mean_str: connectionMean.toFixed(2),
    high_rate: highConnectionRate,
    distribution: {
      1: ratio(connectionCounts["Strongly disagree"], connectionAnswered),
      2: ratio(connectionCounts.Disagree, connectionAnswered),
      3: ratio(connectionCounts.Neutral, connectionAnswered),
      4: ratio(connectionCounts.Agree, connectionAnswered),
      5: ratio(connectionCounts["Strongly agree"], connectionAnswered),
    },
    n: connectionAnswered,
  },

  // ── ScarletWell Awareness ─────────────────────────────────────────────────────
  // Q13: "I am aware of the ScarletWell resources available to me."
  // Options: Yes / No / Not sure
  // 103 of 105 respondents answered Q13.
  //
  // DEFINITION: Awareness rate = Yes / (Yes + No + Not sure)
  // This matches what the pie chart displays and treats "Not sure" as not aware,
  // which is the appropriate planning baseline.
  awareness: {
    rate: awarenessRate,
    rate_pct: pct(awarenessRate),
    n_aware: awarenessCounts.Yes,
    n_not_aware: awarenessCounts.No,
    n_total: awarenessAnswered,
    n_not_sure: awarenessCounts["Not sure"],
    raw_dist: {
      Yes: ratio(awarenessCounts.Yes, awarenessAnswered),
      No: ratio(awarenessCounts.No, awarenessAnswered),
      "Not sure": ratio(awarenessCounts["Not sure"], awarenessAnswered),
    },
  },

  // ── Reflection / Recharge Demand ─────────────────────────────────────────────
  // Q8: "Would a designated reflection/recharge area be helpful?"
  // Options: Yes / No / Not sure
  // 98 of 105 respondents answered Q8.
  //
  // HEADLINE RATE (rate): Yes / (Yes + No) = 53/68 = 77.9%
  //   Denominator excludes "Not sure" to isolate the yes/no preference signal.
  //   Subtext: "Among students who gave a yes/no preference; 53 of 68 said yes."
  //
  // BREAKDOWN RATE (raw_dist): proportions of all 98 who answered, including "Not sure".
  //   Interpretation: 54% Yes · 31% Not sure · 15% No (of all Q8 respondents)
  //
  // Open-text mention rate: ~3% (3/105) — very different signal; don't conflate.
  reflection: {
    rate: reflectionRate,
    rate_pct: pct(reflectionRate),
    n_yes: reflectionCounts.Yes,
    n_no: reflectionCounts.No,
    n_total: reflectionPreferenceTotal,
    n_not_sure: reflectionCounts["Not sure"],
    n_answered: reflectionAnswered,
    answered_rate: reflectionAnsweredRate,
    opentext_rate: ratio(themeCounts["Quiet Reflection"], totalResponses),
    raw_dist: {
      Yes: ratio(reflectionCounts.Yes, reflectionAnswered),
      "Not sure": ratio(reflectionCounts["Not sure"], reflectionAnswered),
      No: ratio(reflectionCounts.No, reflectionAnswered),
    },
  },

  // ── Layout Interaction Support ────────────────────────────────────────────────
  // Q6: "The current layout encourages conversation and interaction." (1–5 Likert)
  // 98 of 105 respondents answered Q6.
  layout: {
    mean: layoutMean,
    mean_str: layoutMean.toFixed(2),
    agree_rate: layoutAgreeRate,
    agree_rate_pct: pct(layoutAgreeRate),
    disagree_rate: ratio(
      layoutCounts.Disagree + layoutCounts["Strongly disagree"],
      layoutAnswered
    ),
    raw_dist: {
      Agree: ratio(layoutCounts.Agree, layoutAnswered),
      Neutral: ratio(layoutCounts.Neutral, layoutAnswered),
      "Strongly agree": ratio(layoutCounts["Strongly agree"], layoutAnswered),
      Disagree: ratio(layoutCounts.Disagree, layoutAnswered),
      "Strongly disagree": ratio(layoutCounts["Strongly disagree"], layoutAnswered),
    },
    n: layoutAnswered,
  },

  // ── Wellness Resource Self-Awareness ──────────────────────────────────────────
  // Q11: "I am aware of wellness campus resources available to me." (1–5 Likert)
  // 92 of 105 respondents answered Q11.
  wellness: {
    mean: wellnessMean,
    mean_str: wellnessMean.toFixed(2),
    high_rate: wellnessHighRate,
    distribution: {
      1: ratio(wellnessCounts["Strongly disagree"], wellnessAnswered),
      2: ratio(wellnessCounts.Disagree, wellnessAnswered),
      3: ratio(wellnessCounts.Neutral, wellnessAnswered),
      4: ratio(wellnessCounts.Agree, wellnessAnswered),
      5: ratio(wellnessCounts["Strongly agree"], wellnessAnswered),
    },
    n: wellnessAnswered,
  },

  // ── Preferred Wellness Learning Channel ───────────────────────────────────────
  // Q12: "How would you prefer to learn about wellness campus resources?"
  // 91 of 105 respondents answered Q12.
  channels: {
    dist: {
      "Table cards": channelCounts["Table cards"],
      Events: channelCounts.Events,
      "QR codes": channelCounts["QR codes"],
      "Digital screens": channelCounts["Digital screens"],
      "Peer ambassadors": channelCounts["Peer ambassadors"],
    },
    norm: {
      "Table cards": ratio(channelCounts["Table cards"], channelAnswered),
      Events: ratio(channelCounts.Events, channelAnswered),
      "QR codes": ratio(channelCounts["QR codes"], channelAnswered),
      "Digital screens": ratio(channelCounts["Digital screens"], channelAnswered),
      "Peer ambassadors": ratio(channelCounts["Peer ambassadors"], channelAnswered),
    },
    top: "Table cards",
    n: channelAnswered,
  },

  // ── Seating Preferences ───────────────────────────────────────────────────────
  // Q7: "What types of seating or table arrangements would encourage more interaction?"
  // 98 of 105 respondents answered Q7.
  seating: {
    dist: {
      "Mixed options": seatingCounts["Mixed options"],
      "Shared long tables": seatingCounts["Shared long tables"],
      "Round tables": seatingCounts["Round tables"],
      "Lounge seating": seatingCounts["Lounge seating"],
      Other: seatingCounts["Other:"],
    },
    norm: {
      "Mixed options": ratio(seatingCounts["Mixed options"], seatingAnswered),
      "Shared long tables": ratio(seatingCounts["Shared long tables"], seatingAnswered),
      "Round tables": ratio(seatingCounts["Round tables"], seatingAnswered),
      "Lounge seating": ratio(seatingCounts["Lounge seating"], seatingAnswered),
      Other: ratio(seatingCounts["Other:"], seatingAnswered),
    },
    top: "Mixed options",
    n: seatingAnswered,
  },

  // ── Table Activity Preferences ────────────────────────────────────────────────
  // Q9: "What table-based activities would you participate in?" (single-select)
  // 96 of 105 respondents answered Q9 (None/Other excluded from ranking, but
  // still included in the denominator for preference percentages).
  // "None" (9) and "Other" (6) are excluded from the ranked display.
  // Norm uses n=96 (all who answered) as denominator.
  activities: {
    dist: {
      "Trivia or theme days": activityCounts["Trivia or theme days"],
      "Creative prompts": activityCounts["Creative prompts"],
      "Daily/weekly challenges": activityCounts["Daily/weekly challenges"],
      "Resource bingo": activityCounts["Resource bingo"],
      "Conversation prompts": activityCounts["Conversation prompts"],
    },
    norm: {
      "Trivia or theme days": ratio(activityCounts["Trivia or theme days"], activityAnswered),
      "Creative prompts": ratio(activityCounts["Creative prompts"], activityAnswered),
      "Daily/weekly challenges": ratio(
        activityCounts["Daily/weekly challenges"],
        activityAnswered
      ),
      "Resource bingo": ratio(activityCounts["Resource bingo"], activityAnswered),
      "Conversation prompts": ratio(
        activityCounts["Conversation prompts"],
        activityAnswered
      ),
    },
    top: "Trivia or theme days",
    n: activityAnswered,
  },

  // ── Open-Text Theme Mention Rates ─────────────────────────────────────────────
  // Theme flags come from the cleaned 105-response export. Broader qualitative
  // rollups continue to use keyword coding against the cleaned open-text fields.
  themes: {
    "Seating Capacity": {
      count: themeCounts["Seating Capacity"],
      pct: ratio(themeCounts["Seating Capacity"], totalResponses),
    },
    "Food & Harvest": {
      count: themeCounts["Food & Harvest"],
      pct: ratio(themeCounts["Food & Harvest"], totalResponses),
    },
    "Events & Programming": {
      count: themeCounts["Events & Programming"],
      pct: ratio(themeCounts["Events & Programming"], totalResponses),
    },
    "Social Connection": {
      count: themeCounts["Social Connection"],
      pct: ratio(themeCounts["Social Connection"], totalResponses),
    },
    "Wellness Resources": {
      count: themeCounts["Wellness Resources"],
      pct: ratio(themeCounts["Wellness Resources"], totalResponses),
    },
    "Comfort & Design": {
      count: themeCounts["Comfort & Design"],
      pct: ratio(themeCounts["Comfort & Design"], totalResponses),
    },
    "Quiet Reflection": {
      count: themeCounts["Quiet Reflection"],
      pct: ratio(themeCounts["Quiet Reflection"], totalResponses),
    },
  },

  n_total: totalResponses,
};

// ── Segments ──────────────────────────────────────────────────────────────────
// Cross-tabulations from the 105-response refresh.

export const SEGMENTS = [
  { label: "Frequent Visitors", metric: "Interaction Rate", value: 0.378, n: 82 },
  { label: "Infrequent Visitors", metric: "Interaction Rate", value: 0.318, n: 22 },
  { label: "ScarletWell Aware", metric: "Avg Connection Score", value: 4.13, n: 46 },
  { label: "ScarletWell Unaware", metric: "Avg Connection Score", value: 3.73, n: 37 },
];

// ── Engagement funnel (first 3 stages) ───────────────────────────────────────
// pct = fraction of all 105 respondents who reach that stage (funnel perspective).
// Drop counts reflect respondents who visited but didn't progress to next stage.

export const FUNNEL: FunnelStage[] = [
  { stage: "All Respondents", n: totalResponses, pct: 1, drop: null, stage_drop_pct: 0 },
  {
    stage: "Regular Visitors",
    n: visitRegularCount,
    pct: ratio(visitRegularCount, totalResponses),
    drop: totalResponses - visitRegularCount,
    stage_drop_pct: ratio(totalResponses - visitRegularCount, totalResponses),
  },
  {
    stage: "Met Someone New",
    n: interactionYesCount,
    pct: ratio(interactionYesCount, totalResponses),
    drop: visitRegularCount - interactionYesCount,
    stage_drop_pct: ratio(visitRegularCount - interactionYesCount, visitRegularCount),
  },
];

// ── Needs & gaps ──────────────────────────────────────────────────────────────
// Demand %: from closed-ended survey questions or open-text keyword rates (noted per item).
// Estimated Current Support %: directional proxy based on observation; not measured.
// Gap = Demand % − Estimated Current Support %.

export const GAPS: GapItem[] = [
  {
    need: "Quiet / Recharge Space",
    demand: reflectionRate,
    support: 0.20,
    gap: reflectionRate - 0.20,
    note: ` ${pct(reflectionRate)} want it (Q8 yes/no preference: ${reflectionCounts.Yes} of ${reflectionPreferenceTotal}); no dedicated zone exists`.trim(),
    impact_potential: Number((((reflectionRate - 0.20) * totalResponses)).toFixed(1)),
    demand_pct: pct(reflectionRate),
    support_pct: "20%",
    gap_pct: pct(reflectionRate - 0.20),
  },
  {
    need: "Social Connection",
    demand: openMeetingRate,
    support: interactionRate,
    gap: openMeetingRate - interactionRate,
    note: `${pct(openMeetingRate)} open to meeting someone (Q3 Yes + Not yet); only ${pct(interactionRate)} have`,
    impact_potential: Number((((openMeetingRate - interactionRate) * totalResponses)).toFixed(1)),
    demand_pct: pct(openMeetingRate),
    support_pct: pct(interactionRate),
    gap_pct: pct(openMeetingRate - interactionRate),
  },
  {
    need: "Wellness Resource Awareness",
    demand: 0.75,
    support: awarenessRate,
    gap: 0.75 - awarenessRate,
    note: `${pct(awarenessRate)} aware of ScarletWell (Q13 Yes/all answered); ${pct(
      1 - awarenessRate
    )} are unsure or unaware`,
    impact_potential: Number(((0.75 - awarenessRate) * totalResponses).toFixed(1)),
    demand_pct: "75%",
    support_pct: pct(awarenessRate),
    gap_pct: pct(0.75 - awarenessRate),
  },
  {
    need: "Layout Interaction Design",
    demand: 0.70,
    support: layoutAgreeRate,
    gap: 0.70 - layoutAgreeRate,
    note: `Only ${pct(layoutAgreeRate)} agree the layout encourages interaction (Q6)`,
    impact_potential: Number(((0.70 - layoutAgreeRate) * totalResponses).toFixed(1)),
    demand_pct: "70%",
    support_pct: pct(layoutAgreeRate),
    gap_pct: pct(0.70 - layoutAgreeRate),
  },
  {
    need: "Seating Availability",
    demand: ratio(themeCounts["Seating Capacity"], totalResponses),
    support: 0.35,
    gap: ratio(themeCounts["Seating Capacity"], totalResponses) - 0.35,
    note: `${pct(
      ratio(themeCounts["Seating Capacity"], totalResponses)
    )} mention seating or capacity in open text; overflow remains the #1 qualitative signal`,
    impact_potential: Number(
      ((ratio(themeCounts["Seating Capacity"], totalResponses) - 0.35) * totalResponses).toFixed(1)
    ),
    demand_pct: pct(ratio(themeCounts["Seating Capacity"], totalResponses)),
    support_pct: "35%",
    gap_pct: pct(ratio(themeCounts["Seating Capacity"], totalResponses) - 0.35),
  },
  {
    need: "Events & Programming",
    demand: ratio(themeCounts["Events & Programming"], totalResponses),
    support: 0.15,
    gap: ratio(themeCounts["Events & Programming"], totalResponses) - 0.15,
    note: `${pct(
      ratio(themeCounts["Events & Programming"], totalResponses)
    )} mention events in open text; ${pct(ratio(channelCounts.Events, channelAnswered))} prefer events as a wellness channel`,
    impact_potential: Number(
      ((ratio(themeCounts["Events & Programming"], totalResponses) - 0.15) * totalResponses).toFixed(1)
    ),
    demand_pct: pct(ratio(themeCounts["Events & Programming"], totalResponses)),
    support_pct: "15%",
    gap_pct: pct(ratio(themeCounts["Events & Programming"], totalResponses) - 0.15),
  },
  {
    need: "Food & Nutrition Awareness",
    demand: ratio(themeCounts["Food & Harvest"], totalResponses),
    support: 0.50,
    gap: 0,
    note: `${pct(
      ratio(themeCounts["Food & Harvest"], totalResponses)
    )} mention food, samples, or Harvest-adjacent activation; estimated support meets or exceeds demand`,
    impact_potential: 0,
    demand_pct: pct(ratio(themeCounts["Food & Harvest"], totalResponses)),
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
    desc: `${pct(
      ratio(themeCounts["Events & Programming"], totalResponses)
    )} of students mention events or programming in open text. The appetite for programming is real and actionable, and trivia/theme days remain the top-ranked table activity.`,
    color: COLORS.SAGE,
    keywords: ["event", "trivia", "program", "activity", "game", "workshop"],
  },
  "Social Connection": {
    label: "The strategic gap",
    desc: `The desire to connect is present: ${pct(
      openMeetingRate
    )} of students are open to meeting someone new, but only ${pct(
      interactionRate
    )} have. The environment is not yet facilitating it. Design and programming can close this gap.`,
    color: COLORS.BLUE_GREY,
    keywords: ["meet", "connect", "people", "friend", "social", "talk", "community"],
  },
  "Quiet Reflection": {
    label: "Clear design mandate",
    desc: `${pct(
      reflectionRate
    )} of students answered Yes when asked if a quiet/recharge zone would be helpful (closed-ended Q8, yes/no preference). Only ${pct(
      ratio(themeCounts["Quiet Reflection"], totalResponses)
    )} mention quiet space in open text, which measures a different signal. The closed-ended rate is the planning indicator.`,
    color: COLORS.OLIVE,
    keywords: ["quiet", "relax", "recharge", "study", "peace", "calm", "reflect"],
  },
  "Wellness Resources": {
    label: "A communication gap",
    desc: `Students are present in the space but not discovering the wellness ecosystem around it. Only ${pct(
      awarenessRate
    )} are aware of ScarletWell (Yes responses out of all who answered the awareness question).`,
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
  strength: `High sense of connection (avg ${METRICS.connection.mean_str}/5) among visitors`,
  gap: `Only ${METRICS.interaction.rate_pct} of students have met someone new, making interaction the clearest opportunity`,
  priority:
    "Convert regular visits into social connections through seating, zoning, and programming",
};

// ── Key insights ──────────────────────────────────────────────────────────────

export const INSIGHTS: Insight[] = [
  {
    title: "Presence Without Connection",
    description:
      `${METRICS.visit.rate_pct} of students visit regularly, yet only ${METRICS.interaction.rate_pct} have met someone new. The space is succeeding as a destination but has not yet become a connector.`,
    severity: "opportunity",
    action:
      "Introduce light-touch structured programming (icebreakers, trivia, shared tables) to convert regular visits into social encounters.",
    metric: "Regular visit rate vs. interaction rate",
  },
  {
    title: "High Latent Social Intent",
    description:
      `${METRICS.interaction.open_rate_pct} of students are open to meeting someone new, but only ${METRICS.interaction.rate_pct} have. That ${Math.round(
        (METRICS.interaction.open_rate - METRICS.interaction.rate) * 100
      )}-point gap represents students who want connection but have no current pathway to it.`,
    severity: "opportunity",
    action:
      "Remove friction: shared seating clusters, table prompts, brief structured interactions at events.",
    metric: "Open-to-meeting rate vs. actual interaction rate",
  },
  {
    title: "Comfort Without New Social Ties",
    description:
      `Students feel connected (avg ${METRICS.connection.mean_str}/5), yet only ${METRICS.interaction.rate_pct} have met someone new. The space feels safe and familiar, but is not yet facilitating new relationships.`,
    severity: "watch",
    action:
      "Design for weak-tie formation: shared seating, conversation starters, ambient programming.",
    metric: "Connection score vs. met-someone-new rate",
  },
  {
    title: "ScarletWell Awareness Gap",
    description:
      `Only ${METRICS.awareness.rate_pct} of students are aware of ScarletWell resources (Yes responses out of all who answered the awareness question, including Not sure). Students are using the physical space without connecting to the wellness ecosystem it sits within.`,
    severity: "concern",
    action:
      "Embed QR codes, table cards, and ambient signage. Use events as organic discovery moments.",
    metric: "ScarletWell awareness rate",
  },
  {
    title: "Strong Recharge Zone Demand",
    description:
      `${METRICS.reflection.rate_pct} of students said Yes when asked if a quiet/recharge zone would be helpful, among students who gave a yes/no preference (${METRICS.reflection.n_yes} of ${METRICS.reflection.n_total}). This remains one of the clearest design mandates in the dataset. Note: only ${pct(
        METRICS.reflection.opentext_rate
      )} spontaneously mention quiet space in open text, which measures a different signal.`,
    severity: "opportunity",
    action:
      "Zone a quiet corner with comfortable seating, soft lighting, and minimal traffic. Signal its purpose through signage and design.",
    metric: "Reflection/recharge area demand (closed-ended, yes/no preference)",
  },
  {
    title: "Seating Is the #1 Student Complaint",
    description:
      `${pct(
        ratio(themeCounts["Seating Capacity"], totalResponses)
      )} of students mention seating capacity in their open-text responses. This is the loudest and most repeated signal in the qualitative data.`,
    severity: "concern",
    action:
      "Prioritize seating expansion. Shared long tables and temporary overflow seating are quick wins.",
    metric: "Seating capacity theme frequency",
  },
  {
    title: "Programming Demand Is Present and Actionable",
    description:
      `${pct(
        ratio(themeCounts["Events & Programming"], totalResponses)
      )} of students mention events or programming in open text, and ${pct(
        ratio(channelCounts.Events, channelAnswered)
      )} choose events as their preferred wellness learning channel. The demand is real and offers a high-leverage, low-cost opportunity.`,
    severity: "opportunity",
    action:
      "Launch a monthly IFNH event series. Start with trivia/theme days (top-ranked activity). Use events as a ScarletWell awareness channel.",
    metric: "Events & programming theme frequency",
  },
  {
    title: "Harvest Is a Magnet — Use It",
    description:
      `${pct(
        ratio(themeCounts["Food & Harvest"], totalResponses)
      )} of students mention food, samples, or Harvest-adjacent activation in their responses. The dining connection remains a unique asset that could drive both visits and wellness awareness.`,
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
    note: `${pct(ratio(channelCounts["Table cards"], channelAnswered))} preferred · ambient, persistent, no barrier to entry`,
    color: COLORS.SAGE,
  },
  {
    channel: "Events",
    priority: "High",
    note: `${pct(ratio(channelCounts.Events, channelAnswered))} preferred · builds community while building awareness`,
    color: COLORS.SAGE,
  },
  {
    channel: "QR Codes",
    priority: "Medium",
    note: `${pct(ratio(channelCounts["QR codes"], channelAnswered))} preferred · frictionless, trackable, always-on`,
    color: COLORS.GOLD,
  },
  {
    channel: "Digital Screens",
    priority: "Medium",
    note: `${pct(ratio(channelCounts["Digital screens"], channelAnswered))} preferred · easy to update, no printing cost`,
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
