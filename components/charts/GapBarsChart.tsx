"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import type { GapItem } from "@/lib/types";

interface GapBarsChartProps {
  gaps: GapItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as GapItem;
  return (
    <div
      className="rounded border p-3 text-[0.78rem] shadow-md"
      style={{ background: "var(--card)", borderColor: "var(--border)", minWidth: 200 }}
    >
      <div className="font-medium mb-1" style={{ color: "var(--text)" }}>
        {d.need}
      </div>
      <div style={{ color: "var(--text-muted)" }}>
        <div>Demand: <strong>{d.demand_pct}</strong></div>
        <div>Support: <strong>{d.support_pct}</strong></div>
        <div>Gap: <strong style={{ color: "#C5705A" }}>{d.gap_pct}</strong></div>
      </div>
      <div className="mt-1.5 text-[0.72rem]" style={{ color: "var(--text-light)" }}>
        {d.note}
      </div>
    </div>
  );
};

export function GapBarsChart({ gaps }: GapBarsChartProps) {
  const data = gaps.filter((g) => g.gap > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 80, left: 0, bottom: 4 }}
        barSize={18}
        barGap={4}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--divider)" />
        <XAxis
          type="number"
          domain={[0, 1]}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="need"
          width={158}
          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />

        {/* Demand bar (background) */}
        <Bar dataKey="demand" fill="#7B9BB5" fillOpacity={0.22} radius={[0, 2, 2, 0]}>
          <LabelList
            dataKey="demand_pct"
            position="right"
            style={{ fontSize: 10, fill: "var(--text-muted)" }}
          />
        </Bar>

        {/* Support bar (foreground) */}
        <Bar dataKey="support" fill="#7A8F7A" fillOpacity={0.75} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
