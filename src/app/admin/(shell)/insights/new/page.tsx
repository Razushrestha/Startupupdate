import Link from "next/link";
import { InsightEditorForm } from "@/components/admin/insight-editor-form";

export default function NewInsightPage() {
  const defaultPublishedAt = new Date().toISOString().slice(0, 16);

  return (
    <div className="pb-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Editorial</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">New insight</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Long-form notes on founders and markets — mood styling matches the public insights index automatically.
          </p>
        </div>
        <Link
          href="/admin/insights"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)]"
        >
          ← Back to insights
        </Link>
      </div>
      <InsightEditorForm mode="create" defaultPublishedAt={defaultPublishedAt} />
    </div>
  );
}
