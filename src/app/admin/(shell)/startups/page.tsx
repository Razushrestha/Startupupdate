import Link from "next/link";
import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import type { StartupDoc } from "@/lib/db/models";
import { StartupModel } from "@/lib/db/models";
import { deleteStartup } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

type Stage = StartupDoc["stage"];

function stageBadge(stage: Stage) {
  const styles: Record<Stage, string> = {
    "Pre-seed":
      "border border-violet-200/90 bg-violet-50 text-violet-950 dark:border-violet-900/70 dark:bg-violet-950/45 dark:text-violet-100",
    Seed:
      "border border-blue-200/90 bg-blue-50 text-blue-950 dark:border-blue-900/70 dark:bg-blue-950/45 dark:text-blue-100",
    "Series A":
      "border border-teal-200/90 bg-teal-50 text-teal-950 dark:border-teal-900/70 dark:bg-teal-950/45 dark:text-teal-100",
    "Series B":
      "border border-indigo-200/90 bg-indigo-50 text-indigo-950 dark:border-indigo-900/70 dark:bg-indigo-950/45 dark:text-indigo-100",
    Grant:
      "border border-orange-200/90 bg-orange-50 text-orange-950 dark:border-orange-900/70 dark:bg-orange-950/45 dark:text-orange-100",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[stage],
      )}
    >
      {stage}
    </span>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M8 15A7 7 0 108 1a7 7 0 000 14zm4.875-7a6 6 0 01-.383 2.125h2.071a7 8 0 000-4.25h2.071zm-.383 2.875a6 6 0 01-.698 1.71 7 8 0 01-4.573 4.574 6 6 0 011.708-.698v2.083a8 8 0 004.563-7.669zm-5.563 7.669v-2.082a6 6 0 011.708.698 7 8 0 01-4.573-4.573 6 6 0 01-.698-1.71H2.508a8 8 0 004.563 7.669zM2.508 8.875h2.082a6 6 0 00.698 1.708 7 8 0 004.573 4.573 6 6 0 01-1.708-.698v2.082a8 8 0 01-7.669-4.563zm7.669-7.669v2.082a6 6 0 011.708-.698 7 8 0 004.573 4.573 6 6 0 01-.698 1.708h2.082a8 8 0 01-7.669-4.563zm-.914-.914a7 8 0 00-4.573 4.573 6 6 0 01-.698-1.708H2.508a8 8 0 017.669-4.563zm-.914 13.922a8 8 0 007.669-4.563h-2.082a6 6 0 01-.698 1.708 7 8 0 01-4.573 4.573 6 6 0 011.708-.698v2.082zM8 6.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M7.596 2.036a.75.75 0 01.808 0l6.25 3.765a.75.75 0 010 1.278l-6.25 3.766a.75.75 0 01-.808 0l-6.25-3.766a.75.75 0 010-1.278l6.25-3.765z" />
      <path d="M12.594 8.052l-.902-.544L8 10.016 4.308 7.508l-.902.544 4.594 2.766 4.594-2.766z" />
      <path d="M8 11.517l4.594-2.766L8 5.985 3.406 8.751 8 11.517z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm4 6a4 4 0 10-8 0h8z" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M11.534 4H9.75a.75.75 0 010-1.5h3.75v3.75a.75.75 0 01-1.5 0V5.803l-1.647 1.647a4 4 0 11.708-.708L11.534 4zm-6.068 8h1.784a.75.75 0 010 1.5H3.5v-3.75a.75.75 0 011.5 0v1.697l1.647-1.647a4 4 0 11-.708.708L5.466 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default async function AdminStartupsPage() {
  if (!isMongoConfigured()) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        Connect MongoDB to list startups. You can still open forms after configuring the database.
      </div>
    );
  }
  await connectMongo();
  const rows = await StartupModel.find().sort({ updatedAt: -1 }).lean();

  return (
    <div className="pb-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Directory</p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Startups</h1>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Public profiles live at{" "}
            <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--foreground)]">
              /startups/[slug]
            </code>
            — keep each slug unique. Cards group stage, market, and sector so you can scan the portfolio quickly.
          </p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            <span className="tabular-nums text-primary">{rows.length}</span>{" "}
            <span className="font-normal text-[var(--muted-foreground)]">
              {rows.length === 1 ? "company" : "companies"} · sorted by last update
            </span>
          </p>
        </div>
        <Link
          href="/admin/startups/new"
          className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary/90 hover:shadow-lg"
        >
          Add startup
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_35%,transparent)] px-8 py-16 text-center dark:bg-[color-mix(in_oklch,var(--muted)_22%,transparent)]">
          <p className="text-base font-medium text-[var(--foreground)]">No startups in the database</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
            Run your seed script or add the first profile — news articles can reference these listings once they exist.
          </p>
          <Link
            href="/admin/startups/new"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary/90"
          >
            Add startup
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:gap-6">
          {rows.map((s) => {
            const id = (s._id as mongoose.Types.ObjectId).toString();
            const stage = s.stage as Stage;
            const founderName =
              s.founder && typeof s.founder === "object" && "name" in s.founder
                ? String((s.founder as { name?: string }).name ?? "")
                : "";
            const score =
              typeof s.engagementScore === "number" && Number.isFinite(s.engagementScore)
                ? Math.round(s.engagementScore)
                : null;
            const updated =
              s.updatedAt instanceof Date ? s.updatedAt : s.updatedAt ? new Date(String(s.updatedAt)) : null;
            const updatedLabel = updated
              ? updated.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
              : null;

            return (
              <li
                key={id}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_2px_12px_color-mix(in_oklch,var(--foreground)_6%,transparent)] transition hover:border-[color-mix(in_oklch,var(--foreground)_14%,var(--border))] hover:shadow-[0_8px_28px_color-mix(in_oklch,var(--foreground)_10%,transparent)] dark:shadow-none dark:hover:border-[var(--border)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)]/80 px-5 pb-4 pt-5">
                  {stageBadge(stage)}
                  <div className="flex flex-wrap items-center gap-2">
                    {score !== null ? (
                      <span className="rounded-full border border-[var(--border)] bg-[var(--muted)]/60 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[var(--foreground)] dark:bg-[var(--muted)]/35">
                        Buzz {score}
                      </span>
                    ) : null}
                    {updatedLabel ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-[var(--muted-foreground)]">
                        <RefreshIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        {updatedLabel}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <h2 className="text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)]">{s.name}</h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_40%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] dark:bg-[color-mix(in_oklch,var(--muted)_22%,transparent)]">
                      <GlobeIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      {s.country}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_40%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] dark:bg-[color-mix(in_oklch,var(--muted)_22%,transparent)]">
                      <LayersIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      {s.sector}
                    </span>
                  </div>

                  {founderName ? (
                    <p className="mt-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <UserIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                      <span className="font-medium text-[var(--foreground)]">{founderName}</span>
                      <span className="text-[var(--muted-foreground)]">· primary contact</span>
                    </p>
                  ) : null}

                  <p className="mt-3 truncate font-mono text-[11px] text-[var(--muted-foreground)]" title={s.slug}>
                    /startups/{s.slug}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Link
                      href={`/startups/${s.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-center text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)] sm:flex-none sm:min-w-[5.5rem]"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/startups/${id}`}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 px-3 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary/15 dark:bg-primary/15 dark:hover:bg-primary/25 sm:flex-none sm:min-w-[5.5rem]"
                    >
                      Edit
                    </Link>
                    <form action={deleteStartup} className="flex-1 sm:flex-none">
                      <input type="hidden" name="id" value={id} />
                      <button
                        type="submit"
                        title="Also removes news tied to this startup id"
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
