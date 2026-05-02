// Shared types for the auth flow. Lives separately from actions.ts because
// "use server" files can only export async functions.

export type AuthState = { error: string | null };

export const initialAuthState: AuthState = { error: null };
