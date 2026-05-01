"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface AwarenessDonutProps {
  dist: Record<string, number>; // e.g. { Yes: 0.446, No: 0.359, "Not sure": 0.196 }
  title?: string;
}

const SLICE_COLORS: Record<string, string> = {
  Yes: "#7A8F7A",
  No: "#C5705A",
  "Not sure": "#C8A96E",
};
const FALLBACK_COLORS = ["#7A8F7A", "#C5705A", "#C8A96E", "#7B9BB5"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div
      className="rounded border px-3 py-2 text-[0.78rem] shadow-sm"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <span className="font-medium" style={{ color: "var(--text)" }}>{name}</span>
      {" — "}
      <span style={{ color: "var(--text-muted)" }}>{(value * 100).toFixed(0)}%</span>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
  if (value < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={500}
      style={{ fontFamily: "Inter, sans-serif", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
    >
      {(value * 100).toFixed(0)}%
    </text>
  );
};

export function AwarenessDonut({ dist, title = "ScarletWell Awareness" }: AwarenessDonutProps) {
  const data = Object.entries(dist).map(([name, value]) => ({ name, value }));

  return (
    <div>
      {title && (
        <div
          className="text-[0.65rem] uppercase tracking-widest font-semibold mb-3 text-center"
          style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
        >
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={90}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            strokeWidth={2}
            stroke="var(--bg)"
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={SLICE_COLORS[entry.name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-4 flex-wrap mt-1">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{
                background: SLICE_COLORS[entry.name] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
              }}
            />
            <span className="text-[0.72rem]" style={{ color: "var(--text-muted)" }}>
              {entry.name} ({(entry.value * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
