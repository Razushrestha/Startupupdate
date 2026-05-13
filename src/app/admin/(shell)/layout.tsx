import Link from "next/link";
import { isMongoConfigured } from "@/lib/db/connect";
import { logoutAdmin } from "@/app/admin/actions";
import { SiteLogo } from "@/components/layout/site-logo";

export default function AdminShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/admin" aria-label="Admin dashboard" className="shrink-0 pt-0.5">
            <SiteLogo priority size="compact" />
          </Link>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <Link href="/admin" className="text-[var(--foreground)]">
              Dashboard
            </Link>
            <Link href="/admin/startups" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              Startups
            </Link>
            <Link href="/admin/news" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              News
            </Link>
            <Link href="/admin/insights" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              Insights
            </Link>
            <Link
              href="/admin/submissions"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Submissions
            </Link>
            <Link href="/" className="text-primary hover:underline">
              View site
            </Link>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="text-sm text-[var(--muted-foreground)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        {!isMongoConfigured() && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
            Set{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">MONGODB_URI</code> in{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">.env.local</code>, run{" "}
            <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">npm run db:seed</code>, then
            restart the dev server. Admin edits require the database connection.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
