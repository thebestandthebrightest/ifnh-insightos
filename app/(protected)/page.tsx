import { SectionHeader, Subhead, Divider, Note } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
import { InsightCard } from "@/components/InsightCard";
import { CoreTensionChart } from "@/components/charts/CoreTensionChart";
import { FunnelChart } from "@/components/charts/FunnelChart";
import { VisitFrequencyChart } from "@/components/charts/VisitFrequencyChart";
import { METRICS, HIGHLIGHTS, FUNNEL, SURVEY_META } from "@/lib/data";

export default function ExecutiveSummary() {
  const m = METRICS;
  const inter_r = m.interaction.rate;
  const visit_r = m.visit.rate;
  const conn_m = m.connection.mean;
  const aware_r = m.awareness.rate;
  const refl_r = m.reflection.rate;
  const open_r = m.interaction.open_rate;

  const kpis = [
    {
      label: "Responses",
      value: `${SURVEY_META.complete_responses} / ${SURVEY_META.total_responses} complete`,
      note: `${SURVEY_META.complete_responses} complete out of ${SURVEY_META.total_responses} total; ${SURVEY_META.partial_responses} partial responses contribute where a question was answered.`,
    },
    {
      label: "Regular Visit Rate",
      value: `80% · n=${m.visit.n}/${m.visit.n_total}`,
      note: `${m.visit.n} of ${m.visit.n_total} answered responses visit at least weekly.`,
    },
    {
      label: "Met Someone New Here",
      value: `${(inter_r * 100).toFixed(0)}% · n=${m.interaction.n_met}/${m.interaction.n_total}`,
      note: `${m.interaction.n_met} of ${m.interaction.n_total} answered Yes.`,
    },
    {
      label: "Avg Connection Score",
      value: `${conn_m.toFixed(2)} / 5 · n=${m.connection.n}`,
      note: `Average sense-of-connection rating among ${m.connection.n} answered responses.`,
    },
    {
      label: "ScarletWell Awareness",
      value: `${(aware_r * 100).toFixed(0)}% · n=${m.awareness.n_aware}/${m.awareness.n_total}`,
      note: `${m.awareness.n_aware} of ${m.awareness.n_total} answered Yes; ${m.awareness.n_not_sure} were not sure.`,
    },
    {
      label: "Reflection Zone Demand",
      value: `${(refl_r * 100).toFixed(0)}% · n=${m.reflection.n_yes}/${m.reflection.n_total}`,
      note: `${m.reflection.n_yes} of ${m.reflection.n_total} yes/no responses said Yes when asked directly; open-text mentions remained low.`,
    },
  ];

  const coreTensionData = [
    { label: "Open to Meeting", value: open_r, color: "#C8A96E" },
    { label: "Regular Visitors", value: visit_r, color: "#7A8F7A" },
    { label: "Met Someone New", value: inter_r, color: "#C5705A" },
    { label: "High Connection ≥4", value: m.connection.high_rate, color: "#7B9BB5" },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="IFNH InsightOS · Executive Summary"
        title="What Is Happening in the Space?"
        subtitle={`A complete read of the ${SURVEY_META.total_responses}-response data story — written for decision-makers.`}
      />

      {/* Editorial lead */}
      <div
        className="rounded border-l-4 px-5 py-4 mb-8 text-[0.9rem] leading-relaxed"
        style={{
          borderLeftColor: "var(--olive)",
          background: "rgba(92,107,60,0.04)",
          borderTop: "1px solid rgba(92,107,60,0.1)",
          borderRight: "1px solid rgba(92,107,60,0.1)",
          borderBottom: "1px solid rgba(92,107,60,0.1)",
          color: "var(--text)",
        }}
      >
        <strong>IFNH is a well-used student space with untapped potential as a hub for connection, wellness awareness, and intentional engagement.</strong>{" "}
        Students are present — but the space is not yet fully converting presence into connection.
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            note={kpi.note}
          />
        ))}
      </div>

      <Note>
        {SURVEY_META.total_responses} total responses ({SURVEY_META.complete_responses} complete, {SURVEY_META.partial_responses} partial). See Methodology for full data notes.
      </Note>

      <Divider />

      {/* Visit frequency chart */}
      <Subhead>Weekly Visit Frequency</Subhead>
      <Note>
        How often respondents visit IFNH/Harvest during a typical week (n = {m.visit.n_total} answered).
      </Note>
      <div
        className="rounded border p-4 mb-4"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <VisitFrequencyChart data={m.visit.chart} />
      </div>
      <div
        className="rounded border-l-2 px-4 py-3 mb-8 text-[0.8rem] leading-relaxed"
        style={{
          background: "rgba(92,107,60,0.04)",
          border: "1px solid rgba(92,107,60,0.08)",
          borderLeftWidth: "2px",
          borderLeftColor: "var(--olive)",
          color: "var(--text-muted)",
        }}
      >
        Nearly four in five respondents ({m.visit.n} of {m.visit.n_total} who answered) report visiting IFNH/Harvest at least weekly, suggesting the space functions as a recurring part of student campus life rather than an occasional destination.
      </div>

      <Divider />

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <InsightCard
          title="Biggest Strength"
          description={HIGHLIGHTS.strength}
          severity="positive"
        />
        <InsightCard
          title="Biggest Gap"
          description={HIGHLIGHTS.gap}
          severity="concern"
        />
        <InsightCard
          title="Highest Priority"
          description={HIGHLIGHTS.priority}
          severity="opportunity"
        />
      </div>

      <Divider />

      {/* Core tension */}
      <Subhead>The Core Tension</Subhead>
      <Note>
        The gap between students open to meeting someone ({(open_r * 100).toFixed(0)}%) and those who
        actually have ({(inter_r * 100).toFixed(0)}%) is the defining strategic opportunity for IFNH.
      </Note>
      <div
        className="rounded border p-4 mb-8"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <CoreTensionChart data={coreTensionData} />
      </div>

      <Divider />

      {/* Engagement funnel preview */}
      <Subhead>Engagement Funnel</Subhead>
      <Note>Where student engagement breaks down — and where conversion opportunity is largest.</Note>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Funnel visual */}
        <div
          className="rounded border p-4"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <FunnelChart stages={FUNNEL} />
        </div>

        {/* Drop-off callouts */}
        <div className="space-y-3">
          {FUNNEL.slice(1).map((stage, i) => {
            const prev = FUNNEL[i];
            const drop = stage.stage_drop_pct;
            const color = drop > 0.40 ? "#C5705A" : drop > 0.20 ? "#C8A96E" : "#7A8F7A";
            return (
              <div
                key={stage.stage}
                className="rounded border-l-2 px-4 py-3"
                style={{
                  background: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderLeftWidth: "2px",
                  borderLeftColor: color,
                }}
              >
                <div
                  className="text-[0.65rem] uppercase tracking-widest mb-1"
                  style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
                >
                  {prev.stage} → {stage.stage}
                </div>
                <div className="font-serif text-2xl font-medium leading-none" style={{ color }}>
                  {(drop * 100).toFixed(0)}% drop
                </div>
                <div className="text-[0.76rem] mt-1" style={{ color: "var(--text-muted)" }}>
                  {prev.n} → {stage.n} students
                </div>
              </div>
            );
          })}

          <InsightCard
            title="Conversion, Not Acquisition"
            description={`With 80% regular visitors, attracting students is not the problem. The drop from visiting to interacting (${(inter_r * 100).toFixed(0)}%) is where the space underperforms. This is addressable through design and programming.`}
            severity="opportunity"
            action="Invest in interaction-enabling design: shared seating, conversation prompts, light events."
          />
        </div>
      </div>
    </div>
  );
}
