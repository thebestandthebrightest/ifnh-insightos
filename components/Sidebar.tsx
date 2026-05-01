"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Sofa,
  MessageSquare,
  Sliders,
  Star,
  FileText,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Executive Summary", icon: LayoutDashboard },
  { href: "/space-design", label: "Space Design", icon: Sofa },
  { href: "/student-voice", label: "Student Voice", icon: MessageSquare },
  { href: "/scenario-lab", label: "Scenario Lab", icon: Sliders },
  { href: "/recommendations", label: "Recommendations", icon: Star },
  { href: "/methodology", label: "Methodology", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-56 shrink-0 flex flex-col border-r"
      style={{
        background: "#FDFCFA",
        borderColor: "var(--border)",
        minHeight: "100vh",
      }}
    >
      {/* Brand */}
      <div className="px-5 pt-7 pb-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div
          className="font-serif text-base font-medium leading-tight"
          style={{ color: "var(--text)", letterSpacing: "-0.2px" }}
        >
          IFNH InsightOS
        </div>
        <div
          className="mt-1 text-[10px] uppercase tracking-widest font-medium"
          style={{ color: "var(--olive)", letterSpacing: "0.12em" }}
        >
          Student Space Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2.5 px-3 py-2 rounded text-[0.8rem] font-medium transition-colors",
                active
                  ? "text-olive bg-olive/10"
                  : "text-text-muted hover:text-text hover:bg-black/4"
              )}
              style={
                active
                  ? { color: "var(--olive)", background: "rgba(92,107,60,0.08)" }
                  : { color: "var(--text-muted)" }
              }
            >
              <Icon size={14} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 border-t text-[0.68rem] leading-relaxed"
        style={{ borderColor: "var(--border)", color: "var(--text-light)" }}
      >
        IFNH / Harvest Survey
        <br />
        n = 93 · Spring 2026
      </div>
    </aside>
  );
}
