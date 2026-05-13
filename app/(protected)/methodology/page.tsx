import { SectionHeader, Subhead, Divider, Note } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
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
  { param: "2-seat perimeter tables", default: "10", range: "5–20", effect: "Each table adds 1.80 est. usable seats (2 seats × 0.90 usability)" },
  { param: "4-seat shared tables",    default: "25", range: "15–35", effect: "Each table adds 4.00 est. usable seats (4 seats × 1.00 usability)" },
  { param: "Lounge seats",            default: "42", range: "30–65", effect: "Each seat adds 0.75 est. usable seats (0.75 usability)" },
  { param: "Modeled peak demand",     default: "180", range: "130–230", effect: "Peak pressure = modeled demand ÷ estimated usable seats" },
  { param: "Comfort priority",        default: "Balanced", range: "Low / Balanced / High", effect: "Shapes how recommended additions are distributed across seat types" },
];

const CALC_SECTIONS = [
  {
    heading: "Demand percentages",
    body: "Each demand figure comes directly from the survey. The percentage shown is the proportion of respondents who answered that question and expressed a want or need. Question-specific denominators are used throughout, so respondents who skipped a question are excluded from that item. For example, Quiet/Recharge Space demand is 78% because 53 of 68 respondents who gave a yes or no preference said Yes; the denominator intentionally excludes 'Not sure' to isolate the preference signal.",
  },
  {
    heading: "Estimated current support percentages",
    body: "Because IFNH does not yet have a formal space inventory, estimated support levels were assigned based on direct observation during the survey period and consultation with space staff. These are directional proxies — not measured values — and should be updated as the space evolves. For instance, 'Quiet/Recharge Space' support is estimated at 20% because a quiet corner exists informally but lacks dedicated furniture or signage.",
  },
  {
    heading: "Gap score",
    body: "Gap = Demand % − Estimated Current Support %. A large gap means many students want something the space does not currently provide well. Gaps above 40 percentage points are flagged as high-priority. Gaps between 10–40% are monitoring areas. The gap score is not a prediction — it is a planning signal.",
  },
  {
    heading: "Needs & Gaps chart",
    body: "The chart shows demand and estimated current support as grouped vertical bars for each need area. Blue bars represent demand; green bars represent estimated current support. The gap is the visible space between the two bars. A custom tooltip also displays the calculated gap when hovering over any bar group. Bars are sorted by gap size descending in the detail table below the chart.",
  },
  {
    heading: "Seating Mix Optimizer outputs",
    body: "The Seating Mix Optimizer models effective seating capacity using usability-weighted seat counts. Physical seats are adjusted by type: 4-seat shared tables count at 1.00 usability per seat (4.00 per table), 2-seat perimeter tables at 0.90 per seat (1.80 per table), and lounge seats at 0.75 per seat. Estimated usable seats = sum of (seat count × usability factor) across all types. Peak seating pressure = modeled peak demand ÷ estimated usable seats. Status thresholds: ≤ 0.85× meets modeled demand with buffer; 0.85–1.0× near capacity; > 1.0× over capacity. Three recommendation scenarios (Minimum Relief targeting 1.0×, Comfortable Buffer targeting 0.85×, and Collaboration-Heavy using only 4-seat tables) calculate the additions needed to reach each target, distributed by the selected comfort priority. All outputs are planning estimates — not predictions.",
  },
  {
    heading: "Recommendation priorities",
    body: "Each recommendation is scored on three dimensions: impact (estimated effect on key metrics if implemented), feasibility (ease and cost of implementation), and demand (proportion of students who expressed this need). The final score is a weighted average. Dynamic boosts are applied when the current data makes a recommendation especially timely — for example, seating recommendations receive a 15% score boost when seating demand exceeds 40% of the survey. Quick Wins are high-impact, low-effort actions that can be taken immediately with minimal resources.",
  },
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
        subtitle="Survey design, data collection context, recommended actions, and calculation methodology."
      />

      {/* ── 1. Survey overview ── */}
      <Subhead>Survey Overview</Subhead>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KPICard
          label="Total Responses"
          value={String(SURVEY_META.total_responses)}
          note="All submitted survey responses"
        />
        <KPICard
          label="Complete Responses"
          value={String(SURVEY_META.complete_responses)}
          status="Strong"
          note="Reached 100% progress in Qualtrics"
        />
        <KPICard
          label="Partial Responses"
          value={String(SURVEY_META.partial_responses)}
          note="Still included where a question was answered"
        />
        <KPICard
          label="Item-Level n"
          value="91-104"
          status="Strong"
          note="Answered counts vary by question across the dashboard"
        />
      </div>

      <div
        className="rounded border p-5 mb-6 text-[0.85rem] leading-relaxed space-y-3"
        style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <p>
          The survey was administered to students who use the IFNH / Harvest student space at Rutgers University
          during Spring 2026. It was distributed via QR codes placed in the space and through direct outreach.
          All responses were collected anonymously. This refresh uses {SURVEY_META.total_responses} total responses,
          including {SURVEY_META.complete_responses} complete submissions and {SURVEY_META.partial_responses} partial submissions that
          still contribute to question-level analysis where an item was answered. Data was exported on {SURVEY_META.export_date}
          and the app now uses <code className="text-[0.80em] px-1 rounded" style={{ background: "var(--divider)" }}>{SURVEY_META.source_file}</code>
          as the primary in-app source, with <code className="text-[0.80em] px-1 rounded" style={{ background: "var(--divider)" }}>{SURVEY_META.summary_file}</code>
          and <code className="text-[0.80em] px-1 rounded" style={{ background: "var(--divider)" }}>{SURVEY_META.cleaned_csv_file}</code> retained for auditability.
        </p>
        <p>
          Open-text responses were manually reviewed and coded into seven thematic categories. Theme binary flags
          (0/1) were applied to each respondent row. Quantitative metrics were derived from Likert-scale and
          binary questions using standard proportion and mean calculations. {SURVEY_META.methodology_note}
        </p>
      </div>

      <Divider />

      {/* ── 2. Recommended Path Forward (elevated) ── */}
      <Subhead>Recommended Path Forward</Subhead>
      <Note>
        These steps synthesize the survey findings into a prioritized action sequence. Timing reflects implementation
        complexity, not urgency — all steps are worth beginning soon.
      </Note>

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

      <Divider />

      {/* ── 3. How calculations and visuals were built ── */}
      <Subhead>How the Calculations and Visuals Were Built</Subhead>
      <Note>
        Plain-English explanations of how each number, chart, and score in this report was produced.
      </Note>

      <div className="space-y-3 mb-6">
        {CALC_SECTIONS.map(({ heading, body }) => (
          <div
            key={heading}
            className="rounded border p-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="text-[0.82rem] font-semibold mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {heading}
            </div>
            <p className="text-[0.82rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {body}
            </p>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── 4. Key metric definitions ── */}
      <Subhead>Key Metric Definitions</Subhead>

      <div className="space-y-2 mb-6">
        {[
          { metric: "Regular Visit Rate", value: m.visit.rate_pct, def: `Proportion of respondents who answered Q1 (n = ${m.visit.n_total}) who visit IFNH 1+ times per week (Daily, 1–2/week, or 3–4/week).` },
          { metric: "Interaction Rate", value: m.interaction.rate_pct, def: `Proportion of Q3 respondents (n = ${m.interaction.n_total}) who answered "Yes" to having met someone new at IFNH.` },
          { metric: "Open-to-Meeting Rate", value: m.interaction.open_rate_pct, def: `Proportion of Q3 respondents who answered "Yes" or "Not yet, but I would like to" — indicating openness to social connection (n = ${m.interaction.n_total}).` },
          { metric: "Connection Score", value: `${m.connection.mean_str} / 5`, def: `Mean Likert score (1–5) from Q2: "I feel a sense of connection when I spend time in this space." (n = ${m.connection.n})` },
          { metric: "ScarletWell Awareness", value: m.awareness.rate_pct, def: `Yes responses divided by all who answered Q13 (Yes + No + Not sure = ${m.awareness.n_total}). "Not sure" is treated as not yet aware for planning purposes but is shown separately in the breakdown chart. ${m.awareness.n_aware} of ${m.awareness.n_total} said Yes; ${m.awareness.n_not_sure} were not sure.` },
          { metric: "Reflection Demand", value: m.reflection.rate_pct, def: `Headline rate: Yes / (Yes + No) = ${m.reflection.n_yes} / ${m.reflection.n_total} — excludes "Not sure" to isolate the yes/no preference signal. The response breakdown shows all ${m.reflection.n_answered} who answered Q8, including "Not sure" (${m.reflection.n_not_sure}).` },
          { metric: "Layout Support Rate", value: m.layout.agree_rate_pct, def: `Proportion who Agree or Strongly Agree that the layout encourages interaction (Q6 ≥ 4 on 1–5 scale, n = ${m.layout.n}).` },
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

      {/* ── 5. Column dictionary ── */}
      <Subhead>Column Reference</Subhead>
      <Note>Key analysis columns from the cleaned dataset ({SURVEY_META.cleaned_csv_file}).</Note>

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

      {/* ── 6. Seating Mix Optimizer assumptions ── */}
      <Subhead>Seating Mix Optimizer Assumptions</Subhead>
      <Note>
        The Seating Mix Optimizer uses a usability-weighted seat model — not a precise occupancy measurement. Usability factors and peak demand are planning parameters that can be adjusted to reflect different space layouts and usage patterns.
      </Note>

      <div className="rounded border overflow-hidden mb-6" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-[0.79rem]">
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)" }}>
              {["Parameter", "Default", "Range", "Effect on Seating Pressure"].map((h) => (
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
        <strong style={{ color: "var(--text)" }}>Model limitations:</strong> Usability factors (1.00, 0.90, 0.75) are planning estimates, not measured values. They do not account for room layout, table placement, circulation paths, noise zoning, or time-of-day variation. Modeled peak demand is a configurable assumption — the actual number of simultaneous students seeking seats at a given moment is not measured. Student qualitative data confirms peak-time crowding occurs even when estimated usable counts appear adequate. Use the optimizer to compare relative scenarios and direction of change, not to predict exact occupancy.
      </div>

      {/* Footer note */}
      <div
        className="mt-8 pt-6 border-t text-[0.72rem] leading-relaxed"
        style={{ borderColor: "var(--divider)", color: "var(--text-light)" }}
      >
        IFNH InsightOS · {SURVEY_META.total_responses} total responses · {SURVEY_META.complete_responses} complete · question-level denominators throughout · {SURVEY_META.semester} · All findings are observational. No causal claims are made.
      </div>
    </div>
  );
}
