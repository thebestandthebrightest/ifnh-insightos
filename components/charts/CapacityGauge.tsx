"use client";

interface CapacityGaugeProps {
  pressure: number;
  capacity: number;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToXY(cx, cy, r, startDeg);
  const e = polarToXY(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
}

export function CapacityGauge({ pressure, capacity }: CapacityGaugeProps) {
  // Gauge spans -150° to +150° (total 300°), mapped to pressure 0–2×
  const START_DEG = -150;
  const END_DEG = 150;
  const TOTAL = END_DEG - START_DEG;

  // Needle: clamp 0–2
  const clamped = Math.min(2, Math.max(0, pressure));
  const needleDeg = START_DEG + (clamped / 2) * TOTAL;

  // Zone boundaries
  const okEnd = START_DEG + (0.9 / 2) * TOTAL;   // 0.9×
  const warnEnd = START_DEG + (1.1 / 2) * TOTAL; // 1.1×

  // Color based on pressure
  let color = "#7A8F7A"; // green
  let label = "Meets Demand";
  if (pressure >= 1.1) {
    color = "#C5705A"; // coral
    label = "Over Capacity";
  } else if (pressure >= 0.9) {
    color = "#C8A96E"; // gold
    label = "Near Capacity";
  }

  const CX = 120, CY = 120, R = 88;
  const needle = polarToXY(CX, CY, R * 0.75, needleDeg);

  return (
    <div className="flex flex-col items-center">
      <div
        className="text-[0.62rem] uppercase tracking-widest font-semibold mb-2 text-center"
        style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
      >
        Capacity Fit
      </div>
      <svg width={240} height={168} viewBox="0 0 240 168">
        {/* Track */}
        <path
          d={describeArc(CX, CY, R, START_DEG, END_DEG)}
          fill="none"
          stroke="var(--divider)"
          strokeWidth={16}
          strokeLinecap="round"
        />
        {/* Green zone: START → ok */}
        <path
          d={describeArc(CX, CY, R, START_DEG, okEnd)}
          fill="none"
          stroke="#7A8F7A"
          strokeWidth={16}
          strokeLinecap="butt"
          opacity={0.25}
        />
        {/* Yellow zone: ok → warn */}
        <path
          d={describeArc(CX, CY, R, okEnd, warnEnd)}
          fill="none"
          stroke="#C8A96E"
          strokeWidth={16}
          strokeLinecap="butt"
          opacity={0.25}
        />
        {/* Red zone: warn → end */}
        <path
          d={describeArc(CX, CY, R, warnEnd, END_DEG)}
          fill="none"
          stroke="#C5705A"
          strokeWidth={16}
          strokeLinecap="butt"
          opacity={0.25}
        />
        {/* Active arc */}
        <path
          d={describeArc(CX, CY, R, START_DEG, Math.min(needleDeg, END_DEG - 0.5))}
          fill="none"
          stroke={color}
          strokeWidth={16}
          strokeLinecap="round"
          opacity={0.85}
        />
        {/* Needle */}
        <line
          x1={CX}
          y1={CY}
          x2={needle.x}
          y2={needle.y}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={5} fill={color} />

        {/* Center label */}
        <text
          x={CX}
          y={CY + 26}
          textAnchor="middle"
          fontSize={26}
          fontWeight={500}
          fontFamily="'Playfair Display', Georgia, serif"
          fill={color}
        >
          {pressure.toFixed(2)}×
        </text>
        <text
          x={CX}
          y={CY + 44}
          textAnchor="middle"
          fontSize={11}
          fontFamily="Inter, sans-serif"
          fill="var(--text-muted)"
        >
          {label}
        </text>

        {/* Scale labels */}
        {[
          { val: 0, deg: START_DEG },
          { val: 1, deg: 30 },
          { val: 2, deg: END_DEG },
        ].map(({ val, deg }) => {
          const pos = polarToXY(CX, CY, R + 22, deg);
          return (
            <text
              key={val}
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fontSize={9}
              fontFamily="Inter, sans-serif"
              fill="var(--text-light)"
            >
              {val}×
            </text>
          );
        })}
      </svg>
      <div
        className="text-[0.72rem] mt-1"
        style={{ color: "var(--text-muted)" }}
      >
        {capacity} total seats · 1.0× = at peak capacity
      </div>
    </div>
  );
}
