"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAdmin, type ActionState } from "@/app/admin/actions";
import { SiteLogo } from "@/components/layout/site-logo";
import { SITE } from "@/lib/site-config";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, undefined as ActionState | undefined);

  return (
    <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_50px_-24px_color-mix(in_oklch,var(--foreground)_35%,transparent)] dark:border-[var(--border)] dark:shadow-[0_24px_60px_-28px_color-mix(in_oklch,#000_65%,transparent)]">
      <div className="border-b border-[var(--border)]/70 bg-[color-mix(in_oklch,var(--muted)_55%,transparent)] px-8 pb-8 pt-10 text-center dark:bg-[color-mix(in_oklch,var(--muted)_35%,transparent)]">
        <Link
          href="/"
          className="inline-flex justify-center rounded-lg outline-none ring-offset-2 ring-offset-[var(--card)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <SiteLogo priority decorative size="header" />
          <span className="sr-only">{SITE.name} home</span>
        </Link>
        <h1 className="mt-7 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Admin sign-in</h1>
        <p className="mx-auto mt-2 max-w-[26ch] text-sm leading-relaxed text-[var(--muted-foreground)]">
          Enter the password from your server environment (<code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--foreground)]">ADMIN_PASSWORD</code>).
        </p>
      </div>

      <form action={formAction} className="space-y-5 px-8 pb-10 pt-8">
        <label className="block text-left">
          <span className="text-sm font-medium text-[var(--foreground)]">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] shadow-inner outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-primary/50 focus:ring-2 focus:ring-primary/25 dark:bg-[color-mix(in_oklch,var(--background)_92%,transparent)]"
          />
        </label>

        {state && !state.ok && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-55"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
