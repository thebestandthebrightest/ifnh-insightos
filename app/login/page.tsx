"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const AUTH_COOKIE = "ifnh_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function setAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // If already authenticated, skip to home
  useEffect(() => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    if (cookies.some((c) => c.startsWith(`${AUTH_COOKIE}=`))) {
      router.replace("/");
    }
  }, [router]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const correct = process.env.NEXT_PUBLIC_SITE_PASSWORD;

    // If env var is not set, allow access in development
    if (!correct) {
      setAuthCookie();
      router.replace("/");
      return;
    }

    if (password === correct) {
      setAuthCookie();
      router.replace("/");
    } else {
      setError(true);
      setLoading(false);
      setPassword("");
      inputRef.current?.focus();
    }
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
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-[0.78rem] font-medium mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Access password
              </label>
              <input
                ref={inputRef}
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                autoComplete="current-password"
                spellCheck={false}
                className="w-full rounded border px-3 py-2.5 text-[0.88rem] outline-none transition-colors"
                style={{
                  borderColor: error ? "var(--coral)" : "var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  boxShadow: error ? "0 0 0 2px rgba(197,112,90,0.15)" : undefined,
                }}
                placeholder="Enter password"
                disabled={loading}
              />
              {error && (
                <p
                  className="mt-2 text-[0.75rem]"
                  style={{ color: "var(--coral)" }}
                >
                  Incorrect password. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded py-2.5 text-[0.88rem] font-medium transition-opacity disabled:opacity-50"
              style={{
                background: "var(--olive)",
                color: "#fff",
                cursor: loading || !password ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Verifying…" : "Continue"}
            </button>
          </form>
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
