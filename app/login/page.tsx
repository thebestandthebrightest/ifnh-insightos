import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

// If the user already holds a valid auth cookie, skip straight to the app.
export default async function LoginPage() {
  const jar = await cookies();
  if (jar.has("ifnh_access")) {
    redirect("/");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="font-serif text-2xl font-medium mb-1"
            style={{ color: "var(--text)", letterSpacing: "-0.3px" }}
          >
            IFNH InsightOS
          </div>
          <div
            className="text-[0.72rem] uppercase tracking-widest font-medium"
            style={{ color: "var(--olive)", letterSpacing: "0.14em" }}
          >
            Student Space Intelligence
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded border p-8"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <LoginForm />
        </div>

        {/* Footer */}
        <p
          className="text-center mt-6 text-[0.7rem]"
          style={{ color: "var(--text-light)" }}
        >
          Internal access only · IFNH / Harvest · Spring 2026
        </p>
      </div>
    </div>
  );
}
