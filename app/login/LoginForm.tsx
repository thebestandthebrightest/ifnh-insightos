"use client";

import { useActionState, useEffect, useRef } from "react";
import { loginAction, type LoginState } from "../actions";

const initialState: LoginState = { error: false };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Re-focus after a failed attempt
  useEffect(() => {
    if (state.error) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [state.error]);

  return (
    <form action={formAction} noValidate>
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
          name="password"
          type="password"
          autoComplete="current-password"
          spellCheck={false}
          className="w-full rounded border px-3 py-2.5 text-[0.88rem] outline-none transition-colors"
          style={{
            borderColor: state.error ? "var(--coral)" : "var(--border)",
            background: "var(--bg)",
            color: "var(--text)",
            boxShadow: state.error
              ? "0 0 0 2px rgba(197,112,90,0.15)"
              : undefined,
          }}
          placeholder="Enter password"
          disabled={pending}
        />
        {state.error && (
          <p
            className="mt-2 text-[0.75rem]"
            style={{ color: "var(--coral)" }}
            role="alert"
          >
            Incorrect password. Please try again.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded py-2.5 text-[0.88rem] font-medium transition-opacity disabled:opacity-50"
        style={{
          background: "var(--olive)",
          color: "#fff",
          cursor: pending ? "not-allowed" : "pointer",
        }}
      >
        {pending ? "Verifying…" : "Continue"}
      </button>
    </form>
  );
}
