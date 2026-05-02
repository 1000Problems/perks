// Layout for the auth-gated app routes. Auth gating gets wired up in a TASK
// for Code (read session via lib/supabase/server.ts, redirect to /login if
// missing). For now this is a passthrough.

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
