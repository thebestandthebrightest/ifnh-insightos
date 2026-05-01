interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b" style={{ borderColor: "var(--border)" }}>
      <div
        className="text-[0.65rem] uppercase tracking-widest font-semibold mb-2"
        style={{ color: "var(--olive)", letterSpacing: "0.14em" }}
      >
        {eyebrow}
      </div>
      <h1
        className="font-serif text-3xl font-medium leading-tight mb-2"
        style={{ color: "var(--text)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface SubheadProps {
  children: React.ReactNode;
  className?: string;
}

export function Subhead({ children, className = "" }: SubheadProps) {
  return (
    <div
      className={`text-[0.65rem] uppercase tracking-widest font-semibold mt-7 mb-3 ${className}`}
      style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
    >
      {children}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.82rem] leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
      {children}
    </p>
  );
}

export function Divider() {
  return <hr className="my-8" style={{ borderColor: "var(--divider)" }} />;
}
