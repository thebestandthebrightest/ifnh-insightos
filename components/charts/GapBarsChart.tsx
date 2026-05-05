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
import type { GapItem } from "@/lib/types";

const DEMAND_COLOR = "#7B9BB5";  // muted blue
const SUPPORT_COLOR = "#7A8F7A"; // muted green

/** Split a long label into at most 2 lines for the X-axis tick. */
function splitLabel(label: string): [string, string] {
  const words = label.split(" ");
  if (words.length <= 2) return [label, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

const CustomXTick = ({ x, y, payload }: any) => {
  const [line1, line2] = splitLabel(payload.value as string);
  return (
    <g transform={`translate(${x},${y + 8})`}>
      <text
        textAnchor="middle"
        fill="var(--text-muted)"
        style={{ fontSize: 11, fontFamily: "var(--font-sans)" }}
      >
        <tspan x={0} dy={0}>{line1}</tspan>
        {line2 && <tspan x={0} dy={14}>{line2}</tspan>}
      </text>
    </g>
  );
};

const CustomLegend = () => (
  <div
    className="flex items-center justify-center gap-6 mt-2"
    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
  >
    <span className="flex items-center gap-1.5">
      <span
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          borderRadius: 2,
          background: DEMAND_COLOR,
          opacity: 0.85,
        }}
      />
      Demand %
    </span>
    <span className="flex items-center gap-1.5">
      <span
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          borderRadius: 2,
          background: SUPPORT_COLOR,
          opacity: 0.85,
        }}
      />
      Est. Current Support %
    </span>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const demandEntry = payload.find((p: any) => p.dataKey === "demand");
  const supportEntry = payload.find((p: any) => p.dataKey === "support");
  const demand = demandEntry?.value ?? 0;
  const support = supportEntry?.value ?? 0;
  const gap = demand - support;

  return (
    <div
      className="rounded border p-3 text-[0.78rem] shadow-md"
      style={{ background: "var(--card)", borderColor: "var(--border)", minWidth: 210 }}
    >
      <div className="font-medium mb-2" style={{ color: "var(--text)" }}>
        {label}
      </div>
      <div className="space-y-0.5">
        <div style={{ color: DEMAND_COLOR }}>
          Demand: <strong>{(demand * 100).toFixed(0)}%</strong>
        </div>
        <div style={{ color: SUPPORT_COLOR }}>
          Est. Current Support: <strong>{(support * 100).toFixed(0)}%</strong>
        </div>
      </div>
      <div
        className="mt-2 pt-2 border-t font-semibold"
        style={{
          borderColor: "var(--divider)",
          color: gap > 0.3 ? "#C5705A" : gap > 0.1 ? "#C8A96E" : "var(--text-muted)",
        }}
      >
        Gap: {(gap * 100).toFixed(0)}%
      </div>
    </div>
  );
};

interface GapBarsChartProps {
  gaps: GapItem[];
}

export function GapBarsChart({ gaps }: GapBarsChartProps) {
  const data = gaps.filter((g) => g.gap > 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 72 }}
          barSize={22}
          barGap={4}
          barCategoryGap="35%"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--divider)" />
          <XAxis
            dataKey="need"
            tick={<CustomXTick />}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar
            dataKey="demand"
            name="Demand %"
            fill={DEMAND_COLOR}
            fillOpacity={0.85}
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="support"
            name="Est. Current Support %"
            fill={SUPPORT_COLOR}
            fillOpacity={0.85}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
}
