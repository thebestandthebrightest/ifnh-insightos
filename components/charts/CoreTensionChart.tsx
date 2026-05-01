"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";

interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: DataItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded border px-3 py-2 text-[0.78rem] shadow-sm"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="font-medium" style={{ color: "var(--text)" }}>{label}</div>
      <div style={{ color: "var(--text-muted)" }}>{payload[0].value}%</div>
    </div>
  );
};

export function CoreTensionChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data.map((d) => ({ ...d, value: Math.round(d.value * 100) }))}
        margin={{ top: 24, right: 16, left: 0, bottom: 8 }}
        barSize={36}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--divider)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          domain={[0, 105]}
          tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v) => `${v}%`}
            style={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
          />
          {data.map((entry) => (
            <Cell key={entry.label} fill={entry.color} fillOpacity={0.82} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
