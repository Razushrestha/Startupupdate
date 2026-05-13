import Link from "next/link";
import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import type { InsightDoc } from "@/lib/db/models";
import { InsightModel } from "@/lib/db/models";
import { deleteInsight } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

function moodBadge(kind: InsightDoc["moodKind"]) {
  const styles: Record<InsightDoc["moodKind"], string> = {
    tension:
      "border border-amber-200/90 bg-amber-50 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/45 dark:text-amber-100",
    hope:
      "border border-emerald-200/90 bg-emerald-50 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/45 dark:text-emerald-100",
    clarity:
      "border border-sky-200/90 bg-sky-50 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/45 dark:text-sky-100",
    care:
      "border border-rose-200/90 bg-rose-50 text-rose-950 dark:border-rose-900/70 dark:bg-rose-950/45 dark:text-rose-100",
  };
  const labels: Record<InsightDoc["moodKind"], string> = {
    tension: "Tension",
    hope: "Hope",
    clarity: "Clarity",
    care: "Care",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[kind],
      )}
    >
      {labels[kind]}
    </span>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M5.75 3V2a.75.75 0 011.5 0v1h2V2a.75.75 0 011.5 0v1h1A1.75 1.75 0 0113 5.75v6.5A1.75 1.75 0 0111.25 14h-6.5A1.75 1.75 0 013 12.25v-6.5C3 4.784 3.784 4 4.75 4h1zm7.5 3h-9v5.5c0 .138.112.25.25.25h6.5a.25.25 0 00.25-.25V6z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 118 1a7 7 0 010 14zm-.75-10.25v4.69l3.03 1.51a.75.75 0 11-.67 1.34l-3.5-1.75A.75.75 0 016 10V4.75a.75.75 0 011.5 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M11.013 2.513a1.75 1.75 0 012.474 0l1 1a1.75 1.75 0 010 2.474l-8.454 8.454a3.75 3.75 0 01-1.132.758l-3.187 1.435a.75.75 0 01-.987-.987l1.435-3.187a3.75 3.75 0 01.758-1.132l8.093-8.093z" />
    </svg>
  );
}

export default async function AdminInsightsPage() {
  if (!isMongoConfigured()) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        Connect MongoDB to manage insights.
      </div>
    );
  }
  await connectMongo();
  const rows = await InsightModel.find().sort({ publishedAt: -1 }).lean();

  return (
    <div className="pb-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Editorial</p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Insights</h1>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Long-form notes on founders, markets, and psychology — each card shows mood, publish date, and read length so you can scan what&apos;s live.
          </p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            <span className="tabular-nums text-primary">{rows.length}</span>{" "}
            <span className="font-normal text-[var(--muted-foreground)]">{rows.length === 1 ? "piece" : "pieces"} published</span>
          </p>
        </div>
        <Link
          href="/admin/insights/new"
          className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary/90 hover:shadow-lg"
        >
          Add insight
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_35%,transparent)] px-8 py-16 text-center dark:bg-[color-mix(in_oklch,var(--muted)_22%,transparent)]">
          <p className="text-base font-medium text-[var(--foreground)]">No insights yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
            Create your first editorial piece — it will appear on the public insights index and pick up mood styling automatically.
          </p>
          <Link
            href="/admin/insights/new"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary/90"
          >
            Add insight
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:gap-6">
          {rows.map((row) => {
            const id = (row._id as mongoose.Types.ObjectId).toString();
            const published =
              row.publishedAt instanceof Date ? row.publishedAt : new Date(String(row.publishedAt));
            const dateLabel = published.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const moodKind = row.moodKind as InsightDoc["moodKind"];

            return (
              <li
                key={id}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_2px_12px_color-mix(in_oklch,var(--foreground)_6%,transparent)] transition hover:border-[color-mix(in_oklch,var(--foreground)_14%,var(--border))] hover:shadow-[0_8px_28px_color-mix(in_oklch,var(--foreground)_10%,transparent)] dark:shadow-none dark:hover:border-[var(--border)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)]/80 px-5 pb-4 pt-5">
                  {moodBadge(moodKind)}
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                    <CalendarIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    {dateLabel}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <h2 className="text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)]">{row.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{row.dek}</p>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[var(--border)]/70 pt-4 text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1.5">
                      <PenIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      {row.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      {row.readTime}
                    </span>
                  </div>
                  <p className="mt-2 truncate font-mono text-[11px] text-[var(--muted-foreground)]" title={row.slug}>
                    /insights/{row.slug}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Link
                      href={`/insights/${row.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-center text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)] sm:flex-none sm:min-w-[5.5rem]"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/insights/${id}`}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 px-3 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary/15 dark:bg-primary/15 dark:hover:bg-primary/25 sm:flex-none sm:min-w-[5.5rem]"
                    >
                      Edit
                    </Link>
                    <form action={deleteInsight} className="flex-1 sm:flex-none">
                      <input type="hidden" name="id" value={id} />
                      <button
                        type="submit"
                        className="w-full rounded-lg border border-transparent px-3 py-2 text-center text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
