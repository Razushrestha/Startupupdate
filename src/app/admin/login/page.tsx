"use client";

import { useActionState } from "react";
import { loginAdmin, type ActionState } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, undefined as ActionState | undefined);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <h1 className="text-xl font-semibold text-[var(--foreground)]">Admin sign-in</h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">Use the password from your server environment.</p>
      <form action={formAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          />
        </label>
        {state && !state.ok && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {state.message}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
