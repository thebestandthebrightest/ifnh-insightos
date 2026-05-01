import type { Recommendation } from "@/lib/types";
import clsx from "clsx";

interface RecommendationCardProps {
  rec: Recommendation;
  showScore?: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  High: "#C5705A",
  Medium: "#C8A96E",
  Low: "#9B9B9B",
};

const EFFORT_COLORS: Record<string, string> = {
  Low: "#7A8F7A",
  Medium: "#C8A96E",
  High: "#C5705A",
};

function DotBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded"
      style={{ color, background: `${color}18`, letterSpacing: "0.08em" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

export function RecommendationCard({ rec, showScore = false }: RecommendationCardProps) {
  return (
    <div
      className="rounded border p-4 mb-3 transition-shadow hover:shadow-sm"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-2.5">
        <div
          className="font-serif text-xl font-medium leading-none shrink-0 mt-0.5 w-6 text-right"
          style={{ color: "var(--text-light)" }}
        >
          {rec.rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <DotBadge label={`${rec.priority} Priority`} color={PRIORITY_COLORS[rec.priority]} />
            <DotBadge label={`${rec.effort} Effort`} color={EFFORT_COLORS[rec.effort]} />
            {rec.quick_win && (
              <DotBadge label="Quick Win" color="#7A8F7A" />
            )}
            <span
              className="text-[0.65rem] uppercase tracking-wide font-medium"
              style={{ color: "var(--text-light)" }}
            >
              {rec.category}
            </span>
          </div>
          <h3
            className="font-medium text-[0.95rem] leading-snug"
            style={{ color: "var(--text)" }}
          >
            {rec.title}
          </h3>
        </div>
        {showScore && (
          <div className="shrink-0 text-right">
            <div className="font-serif text-lg font-medium" style={{ color: "var(--olive)" }}>
              {rec.adjusted_score.toFixed(2)}
            </div>
            <div className="text-[0.62rem]" style={{ color: "var(--text-light)" }}>score</div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pl-9 space-y-2">
        <p className="text-[0.82rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <span className="font-medium" style={{ color: "var(--text)" }}>Why: </span>
          {rec.why}
        </p>
        <p className="text-[0.82rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <span className="font-medium" style={{ color: "var(--text)" }}>Outcome: </span>
          {rec.outcome}
        </p>
        {rec.owner && (
          <p className="text-[0.75rem]" style={{ color: "var(--text-light)" }}>
            Owner: {rec.owner}
          </p>
        )}
      </div>
    </div>
  );
}
