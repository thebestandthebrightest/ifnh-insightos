"use client";

import { useState, useMemo } from "react";
import { SectionHeader, Subhead, Divider, Note } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
import {
  SEATING_DEFAULTS,
  USABLE_PER_UNIT,
  calculateSeatingMetrics,
  generateRecommendations,
  type SeatingParams,
  type ComfortPriority,
  type RecommendationScenario,
} from "@/lib/seating-optimizer";

// ── SliderRow ─────────────────────────────────────────────────────────────────

function SliderRow({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  format = (v: number) => String(v),
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <label className="text-[0.82rem] font-medium" style={{ color: "var(--text)" }}>
          {label}
        </label>
        <span className="font-serif text-base font-medium" style={{ color: "var(--olive)" }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "var(--olive)" }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[0.65rem]" style={{ color: "var(--text-light)" }}>
          {format(min)}
        </span>
        <span className="text-[0.65rem]" style={{ color: "var(--text-light)" }}>
          {format(max)}
        </span>
      </div>
    </div>
  );
}

// ── ComfortPriorityPicker ─────────────────────────────────────────────────────

const COMFORT_OPTIONS: { value: ComfortPriority; label: string; desc: string }[] = [
  { value: "low",      label: "Lean Efficient", desc: "More 4-seat tables, fewer lounge" },
  { value: "balanced", label: "Balanced",        desc: "Mix of all three types" },
  { value: "high",     label: "Comfort-First",   desc: "More variety, better circulation" },
];

function ComfortPriorityPicker({
  value,
  onChange,
}: {
  value: ComfortPriority;
  onChange: (v: ComfortPriority) => void;
}) {
  return (
    <div className="mb-4">
      <div className="text-[0.82rem] font-medium mb-2" style={{ color: "var(--text)" }}>
        Comfort Priority
      </div>
      <div className="text-[0.75rem] mb-2" style={{ color: "var(--text-muted)" }}>
        Shapes how recommendation additions are distributed across seat types.
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {COMFORT_OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="text-left px-2.5 py-2 rounded border transition-colors"
              style={{
                borderColor: active ? "var(--olive)" : "var(--border)",
                background:  active ? "rgba(122,143,122,0.08)" : "var(--card)",
                color:       active ? "var(--olive)" : "var(--text-muted)",
              }}
            >
              <div className="text-[0.75rem] font-semibold leading-none mb-1">{opt.label}</div>
              <div className="text-[0.68rem] leading-snug" style={{ color: "var(--text-light)" }}>
                {opt.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── PressureBar ───────────────────────────────────────────────────────────────

function PressureBar({ pressure }: { pressure: number }) {
  const MAX_SCALE  = 1.5;
  const meetsPct   = (0.85 / MAX_SCALE) * 100;
  const nearPct    = (1.00 / MAX_SCALE) * 100;
  const fillPct    = Math.min(100, (pressure / MAX_SCALE) * 100);

  const fillColor =
    pressure <= 0.85 ? "#7A8F7A" :
    pressure <= 1.00 ? "#C8A96E" :
    "#C5705A";

  return (
    <div>
      {/* Bar track */}
      <div
        className="relative h-3 rounded-full overflow-hidden"
        style={{ background: "var(--divider)" }}
      >
        {/* Zone backgrounds */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div style={{ width: `${meetsPct}%`, background: "rgba(122,143,122,0.20)" }} />
          <div style={{ width: `${nearPct - meetsPct}%`, background: "rgba(200,169,110,0.20)" }} />
          <div style={{ flex: 1, background: "rgba(197,112,90,0.20)" }} />
        </div>
        {/* Active fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width:      `${fillPct}%`,
            background: fillColor,
            transition: "width 0.2s ease, background 0.2s ease",
          }}
        />
        {/* Zone dividers */}
        <div
          className="absolute inset-y-0 pointer-events-none"
          style={{ left: `${meetsPct}%`, width: 1, background: "rgba(255,255,255,0.5)" }}
        />
        <div
          className="absolute inset-y-0 pointer-events-none"
          style={{ left: `${nearPct}%`, width: 1, background: "rgba(255,255,255,0.5)" }}
        />
      </div>

      {/* Scale labels */}
      <div className="relative mt-1" style={{ height: 16 }}>
        <span
          className="absolute text-[0.60rem]"
          style={{ left: 0, color: "var(--text-light)" }}
        >
          0
        </span>
        <span
          className="absolute text-[0.60rem]"
          style={{
            left:      `${meetsPct}%`,
            transform: "translateX(-50%)",
            color:     "var(--text-light)",
          }}
        >
          0.85×
        </span>
        <span
          className="absolute text-[0.60rem]"
          style={{
            left:      `${nearPct}%`,
            transform: "translateX(-50%)",
            color:     "var(--text-light)",
          }}
        >
          1.0×
        </span>
        <span
          className="absolute text-[0.60rem] right-0"
          style={{ color: "var(--text-light)" }}
        >
          1.5×
        </span>
      </div>

      {/* Zone legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {[
          { color: "#7A8F7A", label: "≤ 0.85× Meets Modeled Demand" },
          { color: "#C8A96E", label: "0.85–1.0× Near Capacity" },
          { color: "#C5705A", label: "> 1.0× Over Capacity" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: color, opacity: 0.75 }}
            />
            <span className="text-[0.65rem]" style={{ color: "var(--text-light)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recommendation card ───────────────────────────────────────────────────────

function RecCard({ rec }: { rec: RecommendationScenario }) {
  const fmt = (n: number) => (n > 0 ? `+${n}` : n === 0 ? "—" : String(n));

  return (
    <div
      className="rounded border flex flex-col"
      style={{
        background:     "var(--card)",
        borderColor:    "var(--border)",
        borderTopWidth: "3px",
        borderTopColor: rec.cardColor,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: "var(--divider)" }}>
        <div
          className="text-[0.60rem] uppercase tracking-widest font-semibold mb-0.5"
          style={{ color: rec.cardColor, letterSpacing: "0.13em" }}
        >
          {rec.title}
        </div>
        <div
          className="text-[0.88rem] font-medium leading-snug"
          style={{ color: "var(--text)" }}
        >
          {rec.goal}
        </div>
      </div>

      {rec.alreadyMeets ? (
        <div className="px-4 py-4 text-[0.82rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Current configuration already achieves this target. No additions needed.
        </div>
      ) : (
        <>
          {/* Additions table */}
          <div className="px-4 pt-3 pb-2">
            <div
              className="text-[0.60rem] uppercase tracking-widest font-semibold mb-2"
              style={{ color: "var(--text-muted)", letterSpacing: "0.10em" }}
            >
              Additions needed
            </div>

            {[
              { label: "2-seat perimeter tables", n: rec.add2Seat },
              { label: "4-seat shared tables",    n: rec.add4Seat },
              { label: "Lounge seats",            n: rec.addLounge },
            ].map(({ label, n }) => (
              <div
                key={label}
                className="flex justify-between items-baseline py-1.5 border-b"
                style={{ borderColor: "var(--divider)" }}
              >
                <span className="text-[0.80rem]" style={{ color: "var(--text-muted)" }}>
                  {label}
                </span>
                <span
                  className="font-mono text-[0.82rem] font-semibold"
                  style={{ color: n > 0 ? rec.cardColor : "var(--text-light)" }}
                >
                  {fmt(n)}
                </span>
              </div>
            ))}

            <div
              className="flex justify-between items-baseline py-1.5 border-b"
              style={{ borderColor: "var(--divider)" }}
            >
              <span className="text-[0.80rem]" style={{ color: "var(--text-muted)" }}>
                Added physical seats
              </span>
              <span className="font-mono text-[0.82rem] font-medium" style={{ color: "var(--text)" }}>
                +{rec.addedPhysicalSeats}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1.5">
              <span className="text-[0.80rem]" style={{ color: "var(--text-muted)" }}>
                Added usable seats
              </span>
              <span className="font-mono text-[0.82rem] font-medium" style={{ color: "var(--text)" }}>
                +{rec.addedUsableSeats}
              </span>
            </div>
          </div>

          {/* New metrics */}
          <div
            className="mx-4 mb-4 rounded p-3 space-y-1.5"
            style={{ background: "rgba(0,0,0,0.025)", border: "1px solid var(--divider)" }}
          >
            <div className="flex justify-between items-baseline">
              <span className="text-[0.75rem]" style={{ color: "var(--text-muted)" }}>
                New est. usable seating
              </span>
              <span className="font-serif text-[1.05rem] font-medium" style={{ color: "var(--text)" }}>
                {rec.newUsableSeats}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[0.75rem]" style={{ color: "var(--text-muted)" }}>
                New peak pressure
              </span>
              <span
                className="font-serif text-[1.05rem] font-medium"
                style={{ color: rec.indicator.color }}
              >
                {rec.newPressure.toFixed(2)}×
              </span>
            </div>
            <div className="pt-0.5">
              <span
                className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[0.67rem] font-semibold uppercase tracking-wide"
                style={{
                  background:     `${rec.indicator.color}18`,
                  color:          rec.indicator.color,
                  letterSpacing:  "0.08em",
                  border:         `1px solid ${rec.indicator.color}30`,
                }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: rec.indicator.color }}
                />
                {rec.indicator.label}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Footer: target label + tradeoff */}
      <div className="px-4 pb-4 mt-auto space-y-2">
        <div
          className="text-[0.72rem] leading-snug rounded px-2.5 py-1.5"
          style={{
            background: `${rec.cardColor}14`,
            color:      rec.cardColor,
            border:     `1px solid ${rec.cardColor}30`,
          }}
        >
          {rec.targetLabel}
        </div>
        {rec.tradeoffNote && (
          <div className="text-[0.70rem] leading-snug" style={{ color: "var(--text-light)" }}>
            ⚠ {rec.tradeoffNote}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SeatingMixOptimizer() {
  const [params, setParams] = useState<SeatingParams>({ ...SEATING_DEFAULTS });

  const set =
    <K extends keyof SeatingParams>(key: K) =>
    (v: SeatingParams[K]) =>
      setParams((p) => ({ ...p, [key]: v }));

  const metrics = useMemo(() => calculateSeatingMetrics(params), [params]);
  const recs    = useMemo(() => generateRecommendations(params, metrics), [params, metrics]);

  // Usable breakdown for the live table
  const usable4 = params.fourSeatTables * USABLE_PER_UNIT.fourSeat;
  const usable2 = params.twoSeatTables  * USABLE_PER_UNIT.twoSeat;
  const usableL = params.loungeSeats    * USABLE_PER_UNIT.lounge;
  const totalUsableRaw = usable4 + usable2 + usableL;

  const breakdown = [
    {
      label:       "4-seat shared tables",
      usable:      usable4,
      formula:     `${params.fourSeatTables} × 4 × 1.00`,
    },
    {
      label:       "2-seat perimeter tables",
      usable:      usable2,
      formula:     `${params.twoSeatTables} × 2 × 0.90`,
    },
    {
      label:       "Lounge seats",
      usable:      usableL,
      formula:     `${params.loungeSeats} × 0.75`,
    },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Section 04 · Seating Mix Optimizer"
        title="Seating Mix Optimizer"
        subtitle="Estimate how many additional seats and what mix would reduce peak-hour crowding. These are planning estimates — not predictions or official occupancy measurements."
      />

      {/* Starting-point callout */}
      <div
        className="rounded px-4 py-3 mb-6 text-[0.82rem] leading-relaxed"
        style={{
          borderLeftWidth: "3px",
          borderLeftColor: "var(--coral)",
          background:      "rgba(197,112,90,0.04)",
          border:          "1px solid rgba(197,112,90,0.18)",
          color:           "var(--text-muted)",
        }}
      >
        <span className="font-semibold" style={{ color: "var(--text)" }}>Starting point: </span>
        Current IFNH configuration — {SEATING_DEFAULTS.twoSeatTables} two-seat tables,{" "}
        {SEATING_DEFAULTS.fourSeatTables} four-seat tables,{" "}
        {SEATING_DEFAULTS.loungeSeats} lounge seats — yields approximately{" "}
        <strong style={{ color: "var(--text)" }}>149.5 estimated usable seats</strong>, below the
        modeled peak demand of {SEATING_DEFAULTS.modeledPeakDemand}. Adjust sliders to explore
        additions.
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8">
        {/* ── Controls ── */}
        <div
          className="rounded border p-5"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <Subhead className="mt-0">Seating Configuration</Subhead>

          <SliderRow
            label="2-seat perimeter tables"
            min={5}
            max={20}
            value={params.twoSeatTables}
            onChange={(v) => set("twoSeatTables")(v)}
            format={(v) => `${v} tables`}
          />
          <SliderRow
            label="4-seat shared tables"
            min={15}
            max={35}
            value={params.fourSeatTables}
            onChange={(v) => set("fourSeatTables")(v)}
            format={(v) => `${v} tables`}
          />
          <SliderRow
            label="Lounge seats"
            min={30}
            max={65}
            value={params.loungeSeats}
            onChange={(v) => set("loungeSeats")(v)}
            format={(v) => `${v} seats`}
          />

          <Subhead>Demand & Comfort</Subhead>

          <SliderRow
            label="Modeled peak demand"
            min={130}
            max={230}
            step={5}
            value={params.modeledPeakDemand}
            onChange={(v) => set("modeledPeakDemand")(v)}
            format={(v) => `${v} students`}
          />

          <ComfortPriorityPicker
            value={params.comfortPriority}
            onChange={(v) => set("comfortPriority")(v)}
          />

          <button
            onClick={() => setParams({ ...SEATING_DEFAULTS })}
            className="mt-2 text-[0.76rem] px-3 py-1.5 rounded border transition-colors"
            style={{
              borderColor: "var(--border)",
              color:       "var(--text-muted)",
              background:  "transparent",
            }}
          >
            Reset to current baseline
          </button>
        </div>

        {/* ── Live Metrics ── */}
        <div className="space-y-4">
          {/* Pressure display */}
          <div
            className="rounded border p-5"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-baseline justify-between mb-4">
              <div
                className="text-[0.62rem] uppercase tracking-widest font-semibold"
                style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
              >
                Peak Seating Pressure
              </div>
              <div
                className="font-serif text-3xl font-medium"
                style={{ color: metrics.indicator.color }}
              >
                {metrics.peakPressure.toFixed(2)}×
              </div>
            </div>

            <PressureBar pressure={metrics.peakPressure} />

            <div className="mt-3 flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: metrics.indicator.color }}
              />
              <span
                className="text-[0.80rem] font-semibold"
                style={{ color: metrics.indicator.color }}
              >
                {metrics.indicator.label}
              </span>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-3">
            <KPICard
              label="Physical Seats"
              value={String(metrics.physicalSeats)}
              note="Total chairs placed"
            />
            <KPICard
              label="Est. Usable Seats"
              value={String(metrics.usableSeats)}
              note="After usability factors"
            />
            <KPICard
              label="Peak Pressure"
              value={`${metrics.peakPressure.toFixed(2)}×`}
              status={
                metrics.indicator.status === "meets" ? "Strong" :
                metrics.indicator.status === "near"  ? "Watch"  :
                "Needs Attention"
              }
              note={metrics.indicator.label}
            />
          </div>

          {/* Usable-seat breakdown */}
          <div
            className="rounded border p-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="text-[0.62rem] uppercase tracking-widest font-semibold mb-3"
              style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
            >
              Estimated Usable Seat Breakdown
            </div>
            <div className="divide-y" style={{ borderColor: "var(--divider)" }}>
              {breakdown.map(({ label, usable, formula }) => {
                const pct = totalUsableRaw > 0 ? (usable / totalUsableRaw) * 100 : 0;
                return (
                  <div key={label} className="py-2.5 flex items-center gap-3">
                    <div
                      className="flex-1 text-[0.80rem]"
                      style={{ color: "var(--text)" }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-[0.70rem] font-mono shrink-0"
                      style={{ color: "var(--text-light)" }}
                    >
                      {formula}
                    </div>
                    <div className="w-12 text-right shrink-0">
                      <span
                        className="font-serif text-[0.95rem] font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {Math.round(usable * 10) / 10}
                      </span>
                    </div>
                    <div
                      className="w-16 h-1.5 rounded-full overflow-hidden shrink-0"
                      style={{ background: "var(--divider)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width:      `${pct}%`,
                          background: "var(--olive)",
                          opacity:    0.55,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {/* Total row */}
              <div className="py-2.5 flex items-center gap-3">
                <div
                  className="flex-1 text-[0.80rem] font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Total
                </div>
                <div className="text-[0.70rem] font-mono shrink-0" style={{ color: "transparent" }}>
                  —
                </div>
                <div className="w-12 text-right shrink-0">
                  <span
                    className="font-serif text-[0.95rem] font-semibold"
                    style={{ color: "var(--olive)" }}
                  >
                    {metrics.usableSeats}
                  </span>
                </div>
                <div className="w-16 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* Recommendation cards */}
      <Subhead>Seating Mix Recommendations</Subhead>
      <Note>
        Each scenario shows the additions needed to reach the target pressure, distributed by your
        selected comfort priority. Planning estimates only — actual needs depend on layout,
        circulation, and desired atmosphere.
      </Note>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {recs.map((rec) => (
          <RecCard key={rec.title} rec={rec} />
        ))}
      </div>

      <Divider />

      {/* Assumptions table */}
      <Subhead>Seat Usability Assumptions</Subhead>
      <Note>
        Physical seat count overstates effective capacity. Usability factors reflect typical
        fill patterns, seat accessibility, and comfort during peak periods.
      </Note>

      <div
        className="rounded border overflow-hidden mb-6"
        style={{ borderColor: "var(--border)" }}
      >
        <table className="w-full text-[0.82rem]">
          <thead>
            <tr
              style={{
                background:   "rgba(0,0,0,0.02)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {["Seat Type", "Usability", "Usable per Unit", "Role"].map((h) => (
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
            {[
              {
                type:       "4-seat shared tables",
                usability:  "1.00",
                perUnit:    "4.0 per table",
                role:       "Group work, meals, collaboration. Highest seat efficiency.",
              },
              {
                type:       "2-seat perimeter tables",
                usability:  "0.90",
                perUnit:    "1.8 per table",
                role:       "Quieter / individual / paired seating. Slightly lower fill rate.",
              },
              {
                type:       "Lounge seats",
                usability:  "0.75",
                perUnit:    "0.75 per seat",
                role:       "Casual, short-stay, social. Often not occupied at peak study hours.",
              },
            ].map(({ type, usability, perUnit, role }, i) => (
              <tr
                key={type}
                style={{
                  borderBottom: i < 2 ? "1px solid var(--divider)" : undefined,
                  background:   "var(--card)",
                }}
              >
                <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>
                  {type}
                </td>
                <td
                  className="px-4 py-3 font-mono font-semibold"
                  style={{ color: "var(--olive)" }}
                >
                  {usability}
                </td>
                <td className="px-4 py-3 font-mono" style={{ color: "var(--text-muted)" }}>
                  {perUnit}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                  {role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Planning note */}
      <div
        className="rounded px-4 py-3 text-[0.80rem] leading-relaxed"
        style={{
          borderLeftWidth: "3px",
          borderLeftColor: "var(--gold)",
          background:      "rgba(200,169,110,0.04)",
          border:          "1px solid rgba(200,169,110,0.18)",
          color:           "var(--text-muted)",
        }}
      >
        <span className="font-semibold" style={{ color: "var(--text)" }}>
          Planning note:{" "}
        </span>
        Usability factors and peak demand are planning estimates, not official occupancy
        measurements. Actual peak crowding depends on room layout, table placement, circulation
        paths, noise zoning, and time of day. Student qualitative data confirms peak-time strain
        even when total seat counts appear adequate. Use these scenarios to compare directions,
        not to predict exact outcomes.
      </div>
    </div>
  );
}
