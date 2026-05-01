import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "ifnh_access";
const LOGIN_PATH = "/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the login page itself
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  // Check for the auth cookie
  const isAuthenticated = request.cookies.has(AUTH_COOKIE);

  if (!isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico   (browser icon)
     */
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
