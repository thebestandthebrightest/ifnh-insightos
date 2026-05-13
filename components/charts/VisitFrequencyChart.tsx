"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const BAR_COLOR = "#7A8F7A";

interface VisitFrequencyDatum {
  label: string;
  percent: number;
  count: number;
}

interface TickProps { x?: number; y?: number; payload?: { value: string } }
const CustomXTick = ({ x = 0, y = 0, payload }: TickProps) => (
  <g transform={`translate(${x},${y + 6})`}>
    <text
      textAnchor="middle"
      fill="var(--text-muted)"
      style={{ fontSize: 11, fontFamily: "Inter, sans-serif" }}
    >
      {payload?.value}
    </text>
  </g>
);

interface TooltipItem {
  value: number;
  payload?: { count: number };
}
interface CustomTooltipProps { active?: boolean; payload?: TooltipItem[]; label?: string }
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded border px-3 py-2 text-[0.78rem] shadow-sm"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="font-medium mb-1" style={{ color: "var(--text)" }}>{label}</div>
      <div style={{ color: BAR_COLOR }}>{payload[0].value?.toFixed(1)}% of answered responses</div>
      <div style={{ color: "var(--text-muted)" }}>Count: {payload[0].payload?.count}</div>
    </div>
  );
};

interface VisitFrequencyChartProps {
  data: VisitFrequencyDatum[];
}

export function VisitFrequencyChart({ data }: VisitFrequencyChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 28, right: 12, left: 8, bottom: 8 }}
          barSize={44}
          barCategoryGap="22%"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--divider)" />
          <XAxis
            dataKey="label"
            tick={<CustomXTick />}
            axisLine={false}
            tickLine={false}
            interval={0}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis
            domain={[0, 50]}
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
            axisLine={false}
            tickLine={false}
            width={36}
            ticks={[0, 10, 20, 30, 40, 50]}
          />
          <Tooltip
            content={(props) => (
              <CustomTooltip
                active={props.active}
                payload={props.payload as unknown as TooltipItem[]}
                label={props.label as string}
              />
            )}
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
          />
          <Bar dataKey="percent" fill={BAR_COLOR} fillOpacity={0.78} radius={[3, 3, 0, 0]}>
            <LabelList
              dataKey="percent"
              position="top"
              formatter={(value) => `${Math.round(Number(value ?? 0))}%`}
              style={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
