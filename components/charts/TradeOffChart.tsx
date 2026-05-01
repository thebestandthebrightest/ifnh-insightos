"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";

interface TradeOffPoint {
  shared_pct: number;
  interaction_rate: number;
  seating_pressure: number;
}

interface Props {
  curveData: TradeOffPoint[];
  currentSharedPct: number;
  scenarioSharedPct: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as TradeOffPoint;
  return (
    <div
      className="rounded border px-3 py-2 text-[0.78rem] shadow-sm"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="font-medium mb-1" style={{ color: "var(--text)" }}>
        {d.shared_pct}% shared seating
      </div>
      <div style={{ color: "var(--text-muted)" }}>
        Interaction: <strong>{(d.interaction_rate * 100).toFixed(1)}%</strong>
      </div>
      <div style={{ color: "var(--text-muted)" }}>
        Pressure: <strong>{d.seating_pressure.toFixed(2)}×</strong>
      </div>
    </div>
  );
};

export function TradeOffChart({ curveData, currentSharedPct, scenarioSharedPct }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={curveData}
        margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" />
        <XAxis
          dataKey="shared_pct"
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Shared Seating %",
            position: "insideBottom",
            offset: -4,
            fontSize: 11,
            fill: "var(--text-muted)",
          }}
        />
        <YAxis
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          domain={[0.3, 0.65]}
          tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
          width={40}
          label={{
            value: "Interaction Rate",
            angle: -90,
            position: "insideLeft",
            fontSize: 11,
            fill: "var(--text-muted)",
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x={currentSharedPct} stroke="var(--text-light)" strokeDasharray="4 4" label="" />
        <ReferenceLine x={scenarioSharedPct} stroke="#7A8F7A" strokeDasharray="4 4" label="" />
        <Line
          type="monotone"
          dataKey="interaction_rate"
          stroke="#7A8F7A"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#7A8F7A" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
