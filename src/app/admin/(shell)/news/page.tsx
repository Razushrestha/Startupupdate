import Link from "next/link";
import Image from "next/image";
import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import type { NewsDoc } from "@/lib/db/models";
import { NewsModel } from "@/lib/db/models";
import { deleteNews } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

type Category = NewsDoc["category"];

function categoryBadge(category: Category) {
  const styles: Record<Category, string> = {
    Funding:
      "border border-emerald-200/90 bg-emerald-50 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/45 dark:text-emerald-100",
    Launch:
      "border border-sky-200/90 bg-sky-50 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/45 dark:text-sky-100",
    Tech:
      "border border-violet-200/90 bg-violet-50 text-violet-950 dark:border-violet-900/70 dark:bg-violet-950/45 dark:text-violet-100",
    Events:
      "border border-orange-200/90 bg-orange-50 text-orange-950 dark:border-orange-900/70 dark:bg-orange-950/45 dark:text-orange-100",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[category],
      )}
    >
      {category}
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

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path d="M4 2h8v12H4V2zm1.5 4h2v2h-2V6zm0 3.5h2v2h-2v-2zm4-3.5h2v2h-2V6zm0 3.5h2v2h-2v-2z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M9.493 2.898a.75.75 0 011.052-.154l3 2.25a.75.75 0 01-.452 1.346h-2.425l2.697 6.074a.75.75 0 01-1.376.583l-8.25-13a.75.75 0 011.286-.764l4.047 6.392h2.923z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type PopulatedStartup = { name?: string; slug?: string };

export default async function AdminNewsPage() {
  if (!isMongoConfigured()) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        Connect MongoDB to manage news. You can still open forms after configuring the database.
      </div>
    );
  }
  await connectMongo();
  const rows = await NewsModel.find()
    .sort({ publishedAt: -1 })
    .populate({ path: "startupId", select: "name slug" })
    .lean();

  return (
    <div className="pb-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">News desk</p>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">News</h1>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Articles surface on the homepage,{" "}
            <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--foreground)]">
              /news
            </code>
            , and each startup timeline — cards show category, publish date, and linked company so you can verify context before edits.
          </p>
          <p className="text-sm font-medium text-[var(--foreground)]">
            <span className="tabular-nums text-primary">{rows.length}</span>{" "}
            <span className="font-normal text-[var(--muted-foreground)]">
              {rows.length === 1 ? "article" : "articles"} · newest first
            </span>
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary/90 hover:shadow-lg"
        >
          Add article
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_35%,transparent)] px-8 py-16 text-center dark:bg-[color-mix(in_oklch,var(--muted)_22%,transparent)]">
          <p className="text-base font-medium text-[var(--foreground)]">No articles yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted-foreground)]">
            Publish funding rounds, launches, and events — each piece needs a cover image and ties to one startup record for timelines.
          </p>
          <Link
            href="/admin/news/new"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary/90"
          >
            Add article
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:gap-6">
          {rows.map((n) => {
            const id = (n._id as mongoose.Types.ObjectId).toString();
            const category = n.category as Category;
            const published =
              n.publishedAt instanceof Date ? n.publishedAt : new Date(String(n.publishedAt));
            const dateLabel = published.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            let startup: PopulatedStartup | null = null;
            const sid = n.startupId;
            if (sid && typeof sid === "object" && !(sid instanceof mongoose.Types.ObjectId)) {
              startup = sid as PopulatedStartup;
            }

            const coverSrc = n.coverImage?.trim() ?? "";

            return (
              <li
                key={id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_2px_12px_color-mix(in_oklch,var(--foreground)_6%,transparent)] transition hover:border-[color-mix(in_oklch,var(--foreground)_14%,var(--border))] hover:shadow-[0_8px_28px_color-mix(in_oklch,var(--foreground)_10%,transparent)] dark:shadow-none dark:hover:border-[var(--border)]"
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--muted)]">
                  {coverSrc ? (
                    <Image
                      src={coverSrc}
                      alt={n.imageAlt ?? n.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 26rem"
                      className="object-cover"
                      unoptimized={coverSrc.startsWith("http://") || coverSrc.startsWith("https://")}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-medium text-[var(--muted-foreground)]">
                      No cover
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)]/80 px-5 pb-4 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {categoryBadge(category)}
                    {n.trending ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/45 dark:text-amber-100">
                        <BoltIcon className="h-3 w-3" aria-hidden />
                        Trending
                      </span>
                    ) : null}
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                    <CalendarIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                    {dateLabel}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <h2 className="text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)]">{n.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{n.summary}</p>

                  {startup?.name ? (
                    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted-foreground)]">
                      <span className="inline-flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                        <BuildingIcon className="h-3.5 w-3.5 shrink-0 opacity-80" />
                        {startup.slug ? (
                          <Link
                            href={`/startups/${startup.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-[var(--border)] underline-offset-2 hover:text-primary hover:decoration-primary"
                          >
                            {startup.name}
                          </Link>
                        ) : (
                          startup.name
                        )}
                      </span>
                      <span className="text-[var(--muted-foreground)]">· linked startup</span>
                    </p>
                  ) : (
                    <p className="mt-4 text-xs font-medium text-amber-700 dark:text-amber-400">
                      Startup link missing or deleted — edit to fix.
                    </p>
                  )}

                  <p className="mt-3 truncate font-mono text-[11px] text-[var(--muted-foreground)]" title={n.slug}>
                    /news/{n.slug}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    <Link
                      href={`/news/${n.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-center text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)] sm:flex-none sm:min-w-[5.5rem]"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/news/${id}`}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 px-3 py-2 text-center text-sm font-semibold text-primary transition hover:bg-primary/15 dark:bg-primary/15 dark:hover:bg-primary/25 sm:flex-none sm:min-w-[5.5rem]"
                    >
                      Edit
                    </Link>
                    <form action={deleteNews} className="flex-1 sm:flex-none">
                      <input type="hidden" name="id" value={id} />
                      <button
                        type="submit"
                        title="Permanently removes this article"
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
