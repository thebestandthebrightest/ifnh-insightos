"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ScenarioComparison } from "@/lib/types";

interface Props {
  comparison: ScenarioComparison;
}

export function ScenarioComparisonChart({ comparison }: Props) {
  const { current, scenario } = comparison;

  const data = [
    {
      metric: "Interaction Rate",
      Current: Math.round(current.interaction_rate * 1000) / 10,
      Scenario: Math.round(scenario.interaction_rate * 1000) / 10,
      unit: "%",
    },
    {
      metric: "Connection Score",
      Current: Math.round(current.connection_score * 100) / 100,
      Scenario: Math.round(scenario.connection_score * 100) / 100,
      unit: "/5",
    },
    {
      metric: "Seating Pressure",
      Current: Math.round(current.seating_pressure * 100) / 100,
      Scenario: Math.round(scenario.seating_pressure * 100) / 100,
      unit: "×",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const unit = data.find((d) => d.metric === label)?.unit ?? "";
    return (
      <div
        className="rounded border p-2.5 text-[0.78rem] shadow-sm"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="font-medium mb-1" style={{ color: "var(--text)" }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: p.color }}
            />
            <span style={{ color: "var(--text-muted)" }}>
              {p.name}: <strong>{p.value}{unit}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barSize={22} barGap={4}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--divider)" />
        <XAxis
          dataKey="metric"
          tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
        <Legend
          wrapperStyle={{ fontSize: 11, fontFamily: "Inter, sans-serif", color: "var(--text-muted)" }}
        />
        <Bar dataKey="Current" fill="#E0DDD8" fillOpacity={0.9} radius={[2, 2, 0, 0]} />
        <Bar dataKey="Scenario" fill="#7A8F7A" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
