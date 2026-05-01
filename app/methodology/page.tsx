import { SectionHeader, Subhead, Divider, Note } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
import { InsightCard } from "@/components/InsightCard";
import { SURVEY_META, METRICS, STRATEGY_STEPS } from "@/lib/data";

const COLUMN_GROUPS = [
  {
    group: "Visit & Engagement",
    columns: [
      { name: "visit_frequency_regular_binary", desc: "1 = visits 1+ times/week; 0 = less frequent" },
      { name: "visit_frequency_score_1_4", desc: "Ordinal frequency score (Daily=4, Occasionally=1)" },
      { name: "met_someone_new_binary", desc: "1 = met a new person at IFNH; 0 = has not" },
      { name: "open_to_meeting_new_people_binary", desc: "1 = open to meeting someone new; 0 = not" },
    ],
  },
  {
    group: "Belonging & Space",
    columns: [
      { name: "connection_score_1_5", desc: "Sense of connection/belonging (1–5 Likert)" },
      { name: "layout_interaction_score_1_5", desc: "Layout encourages interaction (1–5 Likert)" },
      { name: "reflection_recharge_area_binary", desc: "1 = wants a quiet/recharge zone" },
    ],
  },
  {
    group: "Wellness Awareness",
    columns: [
      { name: "scarletwell_awareness_binary", desc: "1 = aware of ScarletWell; 0 = not sure or unaware" },
      { name: "scarletwell_awareness_score", desc: "0/0.5/1 depending on awareness level" },
      { name: "wellness_resource_awareness_score_1_5", desc: "Self-rated campus wellness resource awareness (1–5)" },
    ],
  },
  {
    group: "Preferences",
    columns: [
      { name: "seating_preference_raw", desc: "Free-text seating choice (mapped to categories)" },
      { name: "table_activity_preference_raw", desc: "Preferred table activity (single select)" },
      { name: "wellness_learning_channel_raw", desc: "Preferred channel for wellness info" },
    ],
  },
  {
    group: "Open-Text Themes",
    columns: [
      { name: "theme_seating_capacity", desc: "1 if open text mentioned seating/space overflow" },
      { name: "theme_events_programming", desc: "1 if open text mentioned events or programming" },
      { name: "theme_social_connection", desc: "1 if open text mentioned social connection" },
      { name: "theme_quiet_reflection", desc: "1 if open text mentioned quiet or recharge" },
      { name: "theme_wellness_resources", desc: "1 if open text mentioned wellness/ScarletWell" },
      { name: "theme_comfort_design", desc: "1 if open text mentioned comfort or aesthetics" },
      { name: "theme_food_harvest", desc: "1 if open text mentioned food or Harvest dining" },
    ],
  },
];

const SCENARIO_PARAMS = [
  { param: "tables_2seat", default: "10", range: "0–25", effect: "Reduces group-seating ratio; limits shared interaction" },
  { param: "tables_4seat", default: "25", range: "0–40", effect: "Primary driver of group-table ratio; key interaction lever" },
  { param: "lounge_seats", default: "42", range: "0–80", effect: "Social anchor; elevated lounge share boosts interaction slightly" },
  { param: "temp_seats", default: "0", range: "0–30", effect: "Overflow capacity; reduces pressure but low interaction signal" },
  { param: "shared_seating_pct", default: "20%", range: "0–80%", effect: "+1pp shared → +0.25pp interaction rate (above 20% baseline)" },
  { param: "events_per_week", default: "0", range: "0–7", effect: "+1 event/week → +2.5pp interaction rate (capped at 5 events)" },
  { param: "programming_level", default: "1", range: "1–5", effect: "+1 level → +1.5pp interaction rate" },
];

export default function Methodology() {
  const m = METRICS;
  const timingColors: Record<string, string> = {
    Immediate: "var(--coral)",
    "Short-Term": "var(--gold)",
    "Medium-Term": "var(--blue-grey)",
    Ongoing: "var(--text-muted)",
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Section 06 · Data Notes"
        title="Methodology & Data Notes"
        subtitle="Survey design, data cleaning, metric definitions, and scenario model assumptions."
      />

      {/* Survey overview */}
      <Subhead>Survey Overview</Subhead>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KPICard
          label="Raw Responses"
          value={String(SURVEY_META.raw_rows)}
          note="Total submissions collected"
        />
        <KPICard
          label="Valid Responses"
          value={String(SURVEY_META.analysis_rows)}
          status="Strong"
          note="Passed validation and included in analysis"
        />
        <KPICard
          label="Excluded"
          value={String(SURVEY_META.excluded_rows)}
          note="Removed: failed recaptcha or incomplete"
        />
        <KPICard
          label="Data Quality"
          value={`${(SURVEY_META.analysis_rows / SURVEY_META.raw_rows * 100).toFixed(0)}%`}
          status="Strong"
          note="Valid / Total response rate"
        />
      </div>

      <div
        className="rounded border p-5 mb-6 text-[0.85rem] leading-relaxed space-y-3"
        style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p>
          The survey was administered to students who use the IFNH / Harvest student space at Rutgers University
          during Spring 2026. The survey was distributed via QR codes placed in the space and via direct outreach.
          All responses were collected anonymously. Two responses were excluded from analysis due to failed
          recaptcha validation or substantially incomplete submissions.
        </p>
        <p>
          Open-text responses were manually reviewed and coded into seven thematic categories. Theme binary flags
          (0/1) were applied to each respondent row. Quantitative metrics were derived from Likert-scale and
          binary questions using standard proportion and mean calculations.
        </p>
      </div>

      <Divider />

      {/* Key metric definitions */}
      <Subhead>Key Metric Definitions</Subhead>

      <div className="space-y-2 mb-6">
        {[
          { metric: "Regular Visit Rate", value: m.visit.rate_pct, def: "Proportion of respondents who visit IFNH 1+ times per week (visit_frequency_regular_binary = 1)." },
          { metric: "Interaction Rate", value: m.interaction.rate_pct, def: "Proportion of respondents who have met someone new at IFNH (met_someone_new_binary = 1)." },
          { metric: "Open-to-Meeting Rate", value: m.interaction.open_rate_pct, def: "Proportion open to meeting someone new (open_to_meeting_new_people_binary = 1)." },
          { metric: "Connection Score", value: `${m.connection.mean_str} / 5`, def: "Mean Likert score (1–5) measuring sense of connection and belonging in the space." },
          { metric: "ScarletWell Awareness", value: m.awareness.rate_pct, def: `Proportion who indicated awareness of ScarletWell (Yes responses only). Denominator excludes 'Not Sure' (n = ${m.awareness.n_total}).` },
          { metric: "Reflection Demand", value: m.reflection.rate_pct, def: `Proportion who responded 'Yes' to wanting a quiet/recharge area. Denominator: ${m.reflection.n_total} (excludes non-responses).` },
          { metric: "Layout Support Rate", value: m.layout.agree_rate_pct, def: "Proportion who Agree or Strongly Agree that the layout encourages interaction (layout_interaction_score_1_5 ≥ 4)." },
        ].map(({ metric, value, def }) => (
          <div
            key={metric}
            className="rounded border p-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-medium text-[0.88rem]" style={{ color: "var(--text)" }}>
                {metric}
              </span>
              <span className="font-serif text-lg" style={{ color: "var(--olive)" }}>
                {value}
              </span>
            </div>
            <p className="text-[0.80rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {def}
            </p>
          </div>
        ))}
      </div>

      <Divider />

      {/* Column dictionary */}
      <Subhead>Column Reference</Subhead>
      <Note>Key analysis columns from the cleaned dataset (IFNH_cleaned_analysis_ready.csv).</Note>

      <div className="space-y-5 mb-6">
        {COLUMN_GROUPS.map(({ group, columns }) => (
          <div key={group}>
            <div
              className="text-[0.67rem] uppercase tracking-widest font-semibold mb-2"
              style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
            >
              {group}
            </div>
            <div className="rounded border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-[0.79rem]">
                <tbody>
                  {columns.map(({ name, desc }, i) => (
                    <tr
                      key={name}
                      style={{
                        borderBottom: i < columns.length - 1 ? "1px solid var(--divider)" : undefined,
                        background: "var(--card)",
                      }}
                    >
                      <td
                        className="px-4 py-2.5 font-mono font-medium w-64 shrink-0"
                        style={{ color: "var(--olive)", fontSize: "0.76rem" }}
                      >
                        {name}
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "var(--text-muted)" }}>
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Scenario model */}
      <Subhead>Scenario Model Assumptions</Subhead>
      <Note>
        The Scenario Lab uses a directional behavioral model — not a prediction. All effect sizes are estimates based on behavioral design principles and the survey baseline. The model is calibrated to the observed interaction rate of 37.6%.
      </Note>

      <div className="rounded border overflow-hidden mb-6" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-[0.79rem]">
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)" }}>
              {["Parameter", "Default", "Range", "Effect on Interaction Rate"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 font-semibold text-[0.67rem] uppercase tracking-wide"
                  style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCENARIO_PARAMS.map(({ param, default: def, range, effect }, i) => (
              <tr
                key={param}
                style={{
                  borderBottom: i < SCENARIO_PARAMS.length - 1 ? "1px solid var(--divider)" : undefined,
                  background: "var(--card)",
                }}
              >
                <td className="px-4 py-2.5 font-mono font-medium" style={{ color: "var(--olive)", fontSize: "0.76rem" }}>{param}</td>
                <td className="px-4 py-2.5" style={{ color: "var(--text-muted)" }}>{def}</td>
                <td className="px-4 py-2.5" style={{ color: "var(--text-muted)" }}>{range}</td>
                <td className="px-4 py-2.5" style={{ color: "var(--text-muted)" }}>{effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="rounded border-l-2 px-4 py-3 mb-6 text-[0.82rem] leading-relaxed"
        style={{
          borderLeftColor: "var(--gold)",
          background: "rgba(200,169,110,0.05)",
          color: "var(--text-muted)",
        }}
      >
        <strong style={{ color: "var(--text)" }}>Model limitations:</strong> The interaction rate model is additive and linear. It does not account for non-linear interactions between parameters, individual behavioral variation, or time-of-day effects. Crowding penalties are applied when seating pressure exceeds 1.0×. All estimates should be treated as directional — the model is most useful for comparing relative scenarios, not as an absolute forecast.
      </div>

      <Divider />

      {/* Strategy path */}
      <Subhead>Recommended Path Forward</Subhead>

      <div className="space-y-0 mb-6">
        {STRATEGY_STEPS.map((step, i) => {
          const color = timingColors[step.timing] ?? "var(--text-muted)";
          return (
            <div
              key={i}
              className="flex items-start gap-5 py-4 border-b"
              style={{ borderColor: "var(--divider)" }}
            >
              <div
                className="font-serif text-xl font-medium shrink-0 w-6 text-right leading-none pt-0.5"
                style={{ color }}
              >
                {i + 1}
              </div>
              <div>
                <div
                  className="text-[0.65rem] uppercase tracking-widest font-semibold mb-1"
                  style={{ color, letterSpacing: "0.1em" }}
                >
                  {step.timing}
                </div>
                <div className="text-[0.88rem] leading-relaxed" style={{ color: "var(--text)" }}>
                  {step.action}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div
        className="mt-8 pt-6 border-t text-[0.72rem] leading-relaxed"
        style={{ borderColor: "var(--divider)", color: "var(--text-light)" }}
      >
        IFNH InsightOS · {SURVEY_META.analysis_rows} students surveyed ·{" "}
        {(SURVEY_META.analysis_rows / SURVEY_META.raw_rows * 100).toFixed(0)}% data quality ·{" "}
        {SURVEY_META.semester} · All findings are observational. No causal claims are made.
      </div>
    </div>
  );
}
