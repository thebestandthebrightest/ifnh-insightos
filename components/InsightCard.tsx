import type { InsightSeverity } from "@/lib/types";
import clsx from "clsx";

interface InsightCardProps {
  title: string;
  description: string;
  severity?: InsightSeverity;
  action?: string;
  className?: string;
}

const SEV_STYLES: Record<InsightSeverity, { border: string; badge: string; badgeBg: string }> = {
  positive: { border: "#7A8F7A", badge: "#7A8F7A", badgeBg: "rgba(122,143,122,0.10)" },
  opportunity: { border: "#7B9BB5", badge: "#7B9BB5", badgeBg: "rgba(123,155,181,0.10)" },
  watch: { border: "#C8A96E", badge: "#C8A96E", badgeBg: "rgba(200,169,110,0.10)" },
  concern: { border: "#C5705A", badge: "#C5705A", badgeBg: "rgba(197,112,90,0.10)" },
};

const SEV_LABELS: Record<InsightSeverity, string> = {
  positive: "Strength",
  opportunity: "Opportunity",
  watch: "Watch",
  concern: "Concern",
};

export function InsightCard({ title, description, severity = "watch", action, className = "" }: InsightCardProps) {
  const s = SEV_STYLES[severity];

  return (
    <div
      className={clsx("rounded border-l-2 p-4 mb-3", className)}
      style={{
        borderLeftColor: s.border,
        background: s.badgeBg,
        borderTop: `1px solid ${s.border}22`,
        borderRight: `1px solid ${s.border}22`,
        borderBottom: `1px solid ${s.border}22`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-[0.62rem] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded"
              style={{ color: s.badge, background: `${s.badge}18`, letterSpacing: "0.1em" }}
            >
              {SEV_LABELS[severity]}
            </span>
            <h3
              className="font-medium text-[0.88rem] leading-snug"
              style={{ color: "var(--text)" }}
            >
              {title}
            </h3>
          </div>
          <p className="text-[0.83rem] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
          {action && (
            <div
              className="mt-2.5 text-[0.78rem] leading-snug flex items-start gap-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="mt-0.5 shrink-0" style={{ color: s.badge }}>→</span>
              <span>{action}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
