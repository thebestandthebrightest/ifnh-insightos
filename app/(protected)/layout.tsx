import { Sidebar } from "@/components/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div
          className="border-b px-4 py-4 lg:hidden"
          style={{ borderColor: "var(--border)", background: "#FDFCFA" }}
        >
          <div
            className="font-serif text-xl font-medium leading-tight"
            style={{ color: "var(--text)" }}
          >
            IFNH InsightOS
          </div>
          <div
            className="mt-1 text-[0.68rem] uppercase tracking-[0.18em]"
            style={{ color: "var(--olive)" }}
          >
            Student Space Intelligence
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-5 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
