import clsx from "clsx";

type Status = "Strong" | "Watch" | "Needs Attention";

interface KPICardProps {
  label: string;
  value: string;
  status?: Status;
  note?: string;
  className?: string;
}

const STATUS_STYLES: Record<Status, { dot: string; text: string }> = {
  Strong: { dot: "#7A8F7A", text: "#7A8F7A" },
  Watch: { dot: "#C8A96E", text: "#C8A96E" },
  "Needs Attention": { dot: "#C5705A", text: "#C5705A" },
};

export function KPICard({ label, value, status, note, className = "" }: KPICardProps) {
  const s = status ? STATUS_STYLES[status] : null;

  return (
    <div
      className={clsx(
        "rounded border p-4 flex flex-col gap-1.5",
        className
      )}
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div
        className="text-[0.68rem] font-medium leading-tight"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className="font-serif text-2xl font-medium leading-none"
        style={{ color: "var(--text)" }}
      >
        {value}
      </div>
      {status && s && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: s.dot }}
          />
          <span className="text-[0.68rem] font-semibold" style={{ color: s.text }}>
            {status}
          </span>
        </div>
      )}
      {note && (
        <p className="text-[0.72rem] leading-snug mt-0.5" style={{ color: "var(--text-light)" }}>
          {note}
        </p>
      )}
    </div>
  );
}
