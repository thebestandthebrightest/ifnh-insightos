"use client";

import { useState, useMemo } from "react";
import { SectionHeader, Subhead, Divider, Note } from "@/components/SectionHeader";
import { KPICard } from "@/components/KPICard";
import { CapacityGauge } from "@/components/charts/CapacityGauge";
import { ScenarioComparisonChart } from "@/components/charts/ScenarioComparisonChart";
import { TradeOffChart } from "@/components/charts/TradeOffChart";
import {
  DEFAULTS,
  PRESETS,
  BASELINE,
  compareScenario,
  generateInterpretation,
  getDemandVerdict,
  generateTradeOffCurve,
} from "@/lib/scenario";
import type { ScenarioParams } from "@/lib/types";

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
        <label
          className="text-[0.82rem] font-medium"
          style={{ color: "var(--text)" }}
        >
          {label}
        </label>
        <span
          className="font-serif text-base font-medium"
          style={{ color: "var(--olive)" }}
        >
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
        className="w-full accent-olive h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "var(--olive)" }}
      />
      <div className="flex justify-between mt-0.5">
        <span className="text-[0.65rem]" style={{ color: "var(--text-light)" }}>{format(min)}</span>
        <span className="text-[0.65rem]" style={{ color: "var(--text-light)" }}>{format(max)}</span>
      </div>
    </div>
  );
}

export function ScenarioLab() {
  const [params, setParams] = useState<ScenarioParams>({ ...DEFAULTS });
  const [dailyDemand, setDailyDemand] = useState(BASELINE.daily_demand);

  const set = (key: keyof ScenarioParams) => (v: number) =>
    setParams((p) => ({ ...p, [key]: v }));

  const comparison = useMemo(() => compareScenario(params, dailyDemand), [params, dailyDemand]);
  const interpretation = useMemo(() => generateInterpretation(comparison), [comparison]);
  const verdict = useMemo(() => getDemandVerdict(comparison), [comparison]);
  const tradeOffCurve = useMemo(
    () => generateTradeOffCurve(params, dailyDemand),
    [params, dailyDemand]
  );

  const s = comparison.scenario;
  const d = comparison.deltas;

  const pressureStatus =
    s.seating_pressure < 0.9 ? "Strong" : s.seating_pressure < 1.2 ? "Watch" : "Needs Attention";
  const interStatus = s.interaction_rate >= 0.5 ? "Strong" : "Watch";
  const connStatus = s.connection_score >= 4.0 ? "Strong" : "Watch";

  const verdictColor =
    s.seating_pressure < 0.9 ? "var(--sage)" : s.seating_pressure > 1.1 ? "var(--coral)" : "var(--gold)";

  return (
    <div>
      <SectionHeader
        eyebrow="Section 04 · Scenario Lab"
        title="Scenario Lab"
        subtitle="Model space and programming changes. These are directional planning estimates — not predictions."
      />

      <div
        className="rounded border-l-2 px-4 py-3 mb-6 text-[0.82rem]"
        style={{
          borderLeftColor: "var(--border)",
          background: "rgba(0,0,0,0.01)",
          color: "var(--text-muted)",
        }}
      >
        Adjust the sliders to model different configurations. Use the presets for quick scenarios. Results update instantly.
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(PRESETS).map(([name, preset]) => (
          <button
            key={name}
            onClick={() => setParams({ ...preset })}
            className="px-3 py-1.5 rounded border text-[0.78rem] font-medium transition-colors hover:border-olive hover:text-olive"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-muted)",
              background: "var(--card)",
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
        {/* ── Controls ── */}
        <div>
          <div
            className="rounded border p-5"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <Subhead className="mt-0">Space Configuration</Subhead>
            <SliderRow label="2-Seat Tables" min={0} max={25} value={params.tables_2seat} onChange={set("tables_2seat")} />
            <SliderRow label="4-Seat Tables" min={0} max={40} value={params.tables_4seat} onChange={set("tables_4seat")} />
            <SliderRow label="Lounge Seats"  min={0} max={80} value={params.lounge_seats}  onChange={set("lounge_seats")} />
            <SliderRow label="Temporary Seats" min={0} max={30} value={params.temp_seats} onChange={set("temp_seats")} />

            <Subhead>Programming & Culture</Subhead>
            <SliderRow
              label="Shared Seating %"
              min={0} max={80} step={5}
              value={Math.round(params.shared_seating_pct * 100)}
              onChange={(v) => set("shared_seating_pct")(v / 100)}
              format={(v) => `${v}%`}
            />
            <SliderRow label="Events per Week" min={0} max={7} value={params.events_per_week} onChange={set("events_per_week")} />
            <SliderRow
              label="Programming Intensity"
              min={1} max={5}
              value={params.programming_level}
              onChange={set("programming_level")}
              format={(v) => `${v} / 5`}
            />

            <Subhead>Demand Assumption</Subhead>
            <SliderRow
              label="Est. Daily Visitors"
              min={50} max={400} step={10}
              value={dailyDemand}
              onChange={setDailyDemand}
            />
          </div>
        </div>

        {/* ── Results ── */}
        <div className="space-y-4">
          {/* Gauge + KPI grid */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded border p-4 flex flex-col items-center justify-center"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <CapacityGauge pressure={s.seating_pressure} capacity={s.capacity} />
            </div>
            <div className="space-y-3">
              <KPICard
                label="Interaction Rate"
                value={`${(s.interaction_rate * 100).toFixed(0)}%`}
                status={interStatus}
                note={`Δ ${d.interaction_rate >= 0 ? "+" : ""}${(d.interaction_rate * 100).toFixed(1)}% vs. current · ~${s.students_connecting} students/day`}
              />
              <KPICard
                label="Connection Score"
                value={`${s.connection_score.toFixed(2)} / 5`}
                status={connStatus}
                note={`Δ ${d.connection_score >= 0 ? "+" : ""}${d.connection_score.toFixed(2)} vs. current baseline`}
              />
              <KPICard
                label="Seating Pressure"
                value={`${s.seating_pressure.toFixed(2)}×`}
                status={pressureStatus}
                note={`${s.capacity} seats · 1.0× = at peak capacity`}
              />
            </div>
          </div>

          {/* Comparison chart */}
          <div
            className="rounded border p-4"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="text-[0.65rem] uppercase tracking-widest font-semibold mb-3"
              style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
            >
              Current vs. Scenario
            </div>
            <ScenarioComparisonChart comparison={comparison} />
          </div>

          {/* Interpretation callout */}
          <div
            className="rounded border-l-[3px] px-5 py-4"
            style={{
              background: "rgba(122,143,122,0.05)",
              border: "1px solid rgba(122,143,122,0.15)",
              borderLeftWidth: "3px",
              borderLeftColor: "var(--sage)",
            }}
          >
            <p
              className="font-serif text-[1rem] leading-relaxed"
              style={{ color: "var(--text)" }}
            >
              {interpretation}
            </p>
          </div>

          {/* Verdict */}
          <div
            className="flex items-start gap-2.5 rounded border px-4 py-3 text-[0.83rem]"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <span className="mt-0.5 text-base leading-none" style={{ color: verdictColor }}>
              {s.seating_pressure < 0.9 ? "✓" : s.seating_pressure > 1.1 ? "⚠" : "~"}
            </span>
            <span>{verdict}</span>
          </div>
        </div>
      </div>

      <Divider />

      {/* Trade-off curve */}
      <Subhead>Trade-off: Shared Seating % vs. Interaction Rate</Subhead>
      <Note>
        This curve shows how interaction rate responds as shared seating % increases, holding all other parameters constant. The dotted line at your current scenario value is highlighted.
      </Note>
      <div
        className="rounded border p-4"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <TradeOffChart
          curveData={tradeOffCurve}
          currentSharedPct={Math.round(DEFAULTS.shared_seating_pct * 100)}
          scenarioSharedPct={Math.round(params.shared_seating_pct * 100)}
        />
      </div>
    </div>
  );
}
