import { SectionHeader, Subhead, Divider, Note } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
import { InsightCard } from "@/components/InsightCard";
import { RankedList } from "@/components/RankedList";
import { GapBarsChart } from "@/components/charts/GapBarsChart";
import { METRICS, GAPS } from "@/lib/data";

export default function SpaceDesign() {
  const m = METRICS;
  const layout = m.layout;
  const refl = m.reflection;
  const seating = m.seating;

  const agree = layout.agree_rate;
  const disagree = layout.disagree_rate;
  const neutral = 1 - agree - disagree;

  const seatingItems = Object.entries(seating.norm).map(([label, value]) => ({
    label,
    value,
    count: (seating.dist as Record<string, number>)[label],
  }));

  const reflDist = Object.entries(refl.raw_dist).map(([label, value]) => ({
    label,
    value,
    color: label === "Yes" ? "#7A8F7A" : label === "No" ? "#C5705A" : "#C8A96E",
  }));

  const top3Gaps = [...GAPS]
    .filter((g) => g.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  return (
    <div>
      <SectionHeader
        eyebrow="Section 02 · Space Design"
        title="Space Design & Seating Demand"
        subtitle="How does the physical environment support or constrain student behavior?"
      />

      {/* Seating preferences + Layout support */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Seating preferences */}
        <div
          className="rounded border p-5"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <Subhead className="mt-0">Seating Preference</Subhead>
          <Note>What type of seating do students prefer? (n = {seating.n})</Note>
          <RankedList
            items={seatingItems}
            formatValue={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>

        {/* Layout support */}
        <div
          className="rounded border p-5"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <Subhead className="mt-0">Layout Encourages Interaction</Subhead>
          <Note>Do students feel the layout supports social interaction?</Note>
          <RankedList
            items={Object.entries(layout.raw_dist).map(([label, value]) => ({
              label,
              value,
              color:
                label.includes("Agree")
                  ? "#7A8F7A"
                  : label === "Neutral"
                  ? "#C8A96E"
                  : "#C5705A",
            }))}
            formatValue={(v) => `${(v * 100).toFixed(0)}%`}
            showRank={false}
          />
        </div>
      </div>

      {/* Layout KPI strip */}
      <Subhead>Layout Signal</Subhead>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <KPICard
          label="Agree Layout Supports Interaction"
          value={`${(agree * 100).toFixed(0)}%`}
          status={agree >= 0.65 ? "Strong" : "Watch"}
          note="Students who feel the layout encourages interaction."
        />
        <KPICard
          label="Neutral or Undecided"
          value={`${(neutral * 100).toFixed(0)}%`}
          status="Watch"
          note="The layout is not sending a clear behavioral signal."
        />
        <KPICard
          label="Disagree or Strongly Disagree"
          value={`${(disagree * 100).toFixed(0)}%`}
          status={disagree >= 0.15 ? "Needs Attention" : "Watch"}
          note="Students who feel the layout works against interaction."
        />
      </div>

      {agree < 0.55 && (
        <InsightCard
          title="The Layout Is Not Clearly Encouraging Interaction"
          description={`Only ${(agree * 100).toFixed(0)}% of students agree the layout supports interaction. Another ${(neutral * 100).toFixed(0)}% are neutral — the space lacks a clear behavioral signal. This is a design problem, not a student attitude problem.`}
          severity="concern"
          action="Redesign table clustering. Add shared-facing seating. Create a visible gathering zone."
        />
      )}

      <Divider />

      {/* Reflection demand */}
      <Subhead>Reflection & Recharge Demand</Subhead>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <KPICard
            label="Want a Reflection / Recharge Area"
            value={`${(refl.rate * 100).toFixed(0)}%`}
            status={refl.rate >= 0.70 ? "Strong" : "Watch"}
            note={`${refl.n_yes} students say yes — strongest design signal in the dataset.`}
          />
          <div
            className="rounded border p-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="text-[0.65rem] uppercase tracking-widest font-semibold mb-3"
              style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
            >
              Response Breakdown (n = {refl.n_total})
            </div>
            <RankedList
              items={reflDist}
              formatValue={(v) => `${(v * 100).toFixed(0)}%`}
              showRank={false}
            />
          </div>
        </div>

        <div className="space-y-3">
          <InsightCard
            title="Recharge Zone Demand Is the Clearest Design Signal"
            description={`${(refl.rate * 100).toFixed(0)}% of students want a designated reflection or recharge area. Even among the 'not sure' group, the instinct toward quieter space is implicit. This is not a niche preference — it reflects how students actually use the space.`}
            severity="opportunity"
            action="Zone a quiet corner with soft seating, reduced traffic, and soft lighting. Signal its purpose through design rather than rules."
          />
          <InsightCard
            title="Recommended Space Zoning"
            description="① Quiet / Recharge — soft seating, low noise, restorative · ② Flexible Group — shared long tables, conversation-oriented · ③ Activation / Events — reconfigurable space for programming · ④ Wellness Info Hub — QR codes, table cards, ScarletWell touchpoints"
            severity="positive"
            action="No full renovation required — zoning can begin with furniture and signage."
          />
        </div>
      </div>

      <Divider />

      {/* Needs & gaps */}
      <Subhead>Needs & Gaps Analysis</Subhead>
      <Note>
        Gap = Demand % − Estimated Current Support %. Blue bars show demand, green bars show estimated current support.
      </Note>

      <div
        className="rounded border p-4 mb-5"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <GapBarsChart gaps={GAPS} />
      </div>

      {/* Key findings: top gaps as cards below the chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {top3Gaps.map((g, i) => {
          const rankLabel = ["Largest Gap", "Second Gap", "Third Gap"][i];
          const gapColor =
            g.gap > 0.4 ? "#C5705A" : g.gap > 0.25 ? "#C8A96E" : "var(--blue-grey)";
          return (
            <div
              key={g.need}
              className="rounded border p-4"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="text-[0.6rem] uppercase tracking-widest font-semibold mb-1"
                style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
              >
                {rankLabel}
              </div>
              <div
                className="font-medium text-[0.85rem] mb-2 leading-snug"
                style={{ color: "var(--text)" }}
              >
                {g.need}
              </div>
              <div className="flex gap-3 text-[0.78rem]" style={{ color: "var(--text-muted)" }}>
                <span>Demand <strong style={{ color: "#7B9BB5" }}>{g.demand_pct}</strong></span>
                <span>·</span>
                <span>Support <strong style={{ color: "#7A8F7A" }}>{g.support_pct}</strong></span>
                <span>·</span>
                <span>Gap <strong style={{ color: gapColor }}>{g.gap_pct}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      <InsightCard
        title="Critical Opportunities vs. Monitoring Areas"
        description="The top three gaps — Quiet/Recharge Space, Social Connection, and Wellness Resource Awareness — all have high demand and low current support. These represent the highest-leverage investments."
        severity="opportunity"
        action="Prioritize the top three gaps in any upcoming space or programming decision."
      />

      {/* Gap detail table */}
      <div className="mt-6">
        <Subhead>Gap Detail</Subhead>
        <div
          className="rounded border overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <table className="w-full text-[0.8rem]">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--border)" }}>
                {["Need Area", "Demand", "Est. Support", "Gap", "Note"].map((h) => (
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
              {GAPS.map((g, i) => (
                <tr
                  key={g.need}
                  style={{
                    borderBottom: i < GAPS.length - 1 ? "1px solid var(--divider)" : undefined,
                    background: "var(--card)",
                  }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>
                    {g.need}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {g.demand_pct}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {g.support_pct}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-semibold"
                      style={{ color: g.gap > 0.3 ? "#C5705A" : g.gap > 0.1 ? "#C8A96E" : "var(--text-muted)" }}
                    >
                      {g.gap_pct}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-light)" }}>
                    {g.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
