interface ThemeCardProps {
  name: string;
  pct: number;
  pctNote?: string;
  label: string;
  description: string;
  color: string;
  quote?: string;
}

export function ThemeCard({ name, pct, pctNote, label, description, color, quote }: ThemeCardProps) {
  return (
    <div
      className="rounded border-l-2 p-4 mb-4"
      style={{
        background: "var(--card)",
        border: `1px solid var(--border)`,
        borderLeftWidth: "2px",
        borderLeftColor: color,
      }}
    >
      {/* Top row: name + label */}
      <div className="flex justify-between items-start gap-3 mb-2">
        <div>
          <div
            className="text-[0.62rem] uppercase tracking-widest font-semibold mb-1"
            style={{ color: "var(--olive)", letterSpacing: "0.1em" }}
          >
            {name}
          </div>
          <div
            className="font-serif text-3xl font-medium leading-none"
            style={{ color }}
          >
            {(pct * 100).toFixed(0)}%
          </div>
          {pctNote && (
            <div
              className="text-[0.63rem] leading-snug mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {pctNote}
            </div>
          )}
        </div>
        <div
          className="text-[0.68rem] font-medium text-right shrink-0 max-w-[40%] leading-tight pt-1"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </div>
      </div>

      {/* Description */}
      <p className="text-[0.83rem] leading-relaxed mb-3" style={{ color: "var(--text)" }}>
        {description}
      </p>

      {/* Quote */}
      {quote && (
        <div
          className="border-l pl-3 py-0.5"
          style={{ borderColor: "var(--divider)" }}
        >
          <span
            className="font-serif text-[0.82rem] italic leading-snug"
            style={{ color: "#5A5A5A" }}
          >
            &ldquo;{quote}&rdquo;
          </span>
        </div>
      )}
    </div>
  );
}
