// Session management. Cookie-based, server-validated. Tokens are random
// 32-byte values, stored hashed in the DB so a leaked snapshot can't be
// used to impersonate users.

import { cache } from "react";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

const COOKIE_NAME = "perks_session";
const SESSION_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface SessionUser {
  id: string;
  account: string;
}

interface SessionRow {
  user_id: string;
  account: string;
  expires_at: Date;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

// Create a session row and set the cookie. Returns the raw token (caller
// rarely needs it — useful for tests).
export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * MS_PER_DAY);

  await sql`
    insert into perks_sessions (id, user_id, expires_at)
    values (${tokenHash}, ${userId}, ${expiresAt})
  `;

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

// Read the session cookie, look up the row, return the user. Returns null
// if no cookie, expired session, or row missing.
//
// Wrapped in React.cache so a single request that hits both the layout
// guard and a per-page getCurrentProfile() does one DB lookup, not two.
// Cache is per-request — across requests we re-validate.
export const getCurrentUser: () => Promise<SessionUser | null> = cache(
  async () => {
    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const tokenHash = hashToken(token);
    const rows = await sql<SessionRow[]>`
      select s.user_id, s.expires_at, u.account
      from perks_sessions s
      join perks_users u on u.id = s.user_id
      where s.id = ${tokenHash}
      limit 1
    `;
    const row = rows[0];
    if (!row) return null;

    if (row.expires_at.getTime() < Date.now()) {
      // Expired — opportunistically clean up server-side and clear the
      // client cookie so subsequent requests don't keep DB-checking a
      // dead session.
      await sql`delete from perks_sessions where id = ${tokenHash}`;
      jar.delete(COOKIE_NAME);
      return null;
    }

    return { id: row.user_id, account: row.account };
  },
);

// Delete the session row and clear the cookie.
export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    const tokenHash = hashToken(token);
    await sql`delete from perks_sessions where id = ${tokenHash}`;
  }
  jar.delete(COOKIE_NAME);
}
