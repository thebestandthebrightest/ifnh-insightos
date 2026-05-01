"use client";

import type { FunnelStage } from "@/lib/types";

interface FunnelChartProps {
  stages: FunnelStage[];
}

const STAGE_COLORS = ["#7A8F7A", "#C8A96E", "#C5705A"];

export function FunnelChart({ stages }: FunnelChartProps) {
  const maxN = stages[0]?.n ?? 1;

  return (
    <div className="space-y-2 py-2">
      {stages.map((stage, i) => {
        const width = (stage.n / maxN) * 100;
        const color = STAGE_COLORS[i] ?? "#9B9B9B";
        const drop = stage.stage_drop_pct;

        return (
          <div key={stage.stage}>
            {/* Drop annotation between stages */}
            {i > 0 && drop > 0 && (
              <div
                className="flex items-center gap-2 text-[0.72rem] py-1.5 pl-4"
                style={{ color: "var(--text-muted)" }}
              >
                <span style={{ color: drop > 0.4 ? "#C5705A" : "#C8A96E" }}>
                  ↓ {(drop * 100).toFixed(0)}% drop
                </span>
                <span>({stages[i - 1].n} → {stage.n})</span>
              </div>
            )}

            {/* Bar */}
            <div className="relative">
              <div
                className="h-12 rounded flex items-center px-4 transition-all"
                style={{
                  width: `${width}%`,
                  minWidth: "40%",
                  background: color,
                  opacity: 0.85,
                }}
              />
              {/* Labels overlaid */}
              <div
                className="absolute inset-0 flex items-center justify-between px-4"
                style={{ pointerEvents: "none" }}
              >
                <span
                  className="text-[0.83rem] font-medium text-white"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                >
                  {stage.stage}
                </span>
                <span
                  className="text-[0.83rem] font-medium text-white"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                >
                  {stage.n} &nbsp;
                  <span className="opacity-75 text-[0.75rem]">
                    ({(stage.pct * 100).toFixed(0)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
