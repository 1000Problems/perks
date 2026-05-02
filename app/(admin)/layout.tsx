// Admin route group. Single allow-list: ADMIN_ACCOUNT_NAME env var.
// Mismatch → 404 (notFound), not 403 — keeps the path quiet.

import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const allowed = process.env.ADMIN_ACCOUNT_NAME;
  if (!allowed) notFound();
  if (!user || user.account !== allowed) notFound();
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <strong>perks · admin</strong>
        <span className="dim">/ {user.account}</span>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
