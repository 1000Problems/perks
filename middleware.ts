// We auth-check on protected routes via lib/auth/session.ts. No middleware
// work is needed for a session-cookie + Postgres setup, so this file is a
// no-op passthrough kept around in case we want to add request-level
// concerns (rate limiting, CSP, etc.) later.

import { NextResponse, type NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
