import Link from "next/link";
import { StartupEditorForm } from "@/components/admin/startup-editor-form";

export default function NewStartupPage() {
  return (
    <div className="pb-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Directory</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">New startup</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Add a company profile for the public directory — upload a logo or paste a URL, then attach news stories from the News tab.
          </p>
        </div>
        <Link
          href="/admin/startups"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)]"
        >
          ← Back to startups
        </Link>
      </div>
      <StartupEditorForm mode="create" />
    </div>
  );
}
