import clsx from "clsx";

type Status = "Strong" | "Watch" | "Needs Attention";

interface KPICardProps {
  label: string;
  value: string;
  status?: Status;
  note?: string;
  className?: string;
}

export function KPICard({ label, value, note, className = "" }: KPICardProps) {

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
      {note && (
        <p className="text-[0.72rem] leading-snug mt-0.5" style={{ color: "var(--text-light)" }}>
          {note}
        </p>
      )}
    </div>
  );
}
