"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE = "ifnh_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type LoginState = { error: boolean };

/**
 * Validate the submitted password server-side against SITE_PASSWORD.
 * On success: sets an httpOnly auth cookie and redirects to /.
 * On failure: returns { error: true } so the form can show an inline message.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const submitted = (formData.get("password") as string) ?? "";
  const correct = process.env.SITE_PASSWORD;

  // If the env var is not set, allow access (local dev convenience)
  if (!correct || submitted === correct) {
    const jar = await cookies();
    jar.set(AUTH_COOKIE, "1", {
      httpOnly: true,
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    redirect("/");
  }

  return { error: true };
}

/**
 * Clear the auth cookie and redirect to /login.
 * Called from the Sidebar logout form.
 */
export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  redirect("/login");
}
