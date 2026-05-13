"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { NewsCategory, NewsItem, Startup, StartupStage } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/mock-data";
import { StartupLogoTile } from "@/components/cards/startup-logo-tile";
import { cn } from "@/lib/cn";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.329 3.328a1 1 0 01-1.414 1.414l-3.328-3.329A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function categoryChip(cat: NewsCategory) {
  const styles: Record<NewsCategory, string> = {
    Funding:
      "border border-emerald-200/90 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100",
    Launch:
      "border border-sky-200/90 bg-sky-50 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100",
    Tech:
      "border border-violet-200/90 bg-violet-50 text-violet-950 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-100",
    Events:
      "border border-orange-200/90 bg-orange-50 text-orange-950 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-100",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        styles[cat],
      )}
    >
      {cat}
    </span>
  );
}

function stageChip(stage: StartupStage) {
  const styles: Record<StartupStage, string> = {
    "Pre-seed": "bg-violet-500/12 text-violet-950 dark:text-violet-100",
    Seed: "bg-blue-500/12 text-blue-950 dark:text-blue-100",
    "Series A": "bg-teal-500/12 text-teal-950 dark:text-teal-100",
    "Series B": "bg-indigo-500/12 text-indigo-950 dark:text-indigo-100",
    Grant: "bg-orange-500/12 text-orange-950 dark:text-orange-100",
  };
  return (
    <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", styles[stage])}>{stage}</span>
  );
}

export function SearchPageClient({
  startups,
  newsItems,
  initialQuery,
}: {
  startups: Startup[];
  newsItems: NewsItem[];
  initialQuery: string;
}) {
  const [q, setQ] = useState(initialQuery);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) {
      return { startups: startups.slice(0, 6), news: newsItems.slice(0, 6), browsing: true };
    }
    const s = startups.filter(
      (x) =>
        x.name.toLowerCase().includes(needle) ||
        x.country.toLowerCase().includes(needle) ||
        x.sector.toLowerCase().includes(needle) ||
        x.description.toLowerCase().includes(needle) ||
        x.founder.name.toLowerCase().includes(needle),
    );
    const n = newsItems.filter(
      (x) =>
        x.title.toLowerCase().includes(needle) ||
        x.summary.toLowerCase().includes(needle) ||
        x.category.toLowerCase().includes(needle),
    );
    return { startups: s, news: n, browsing: false };
  }, [q, startups, newsItems]);

  const startupCount = results.startups.length;
  const newsCount = results.news.length;

  return (
    <div className="relative mx-auto w-full max-w-4xl pb-12">
      <div
        className="pointer-events-none absolute -left-24 -top-12 h-56 w-56 rounded-full bg-primary/[0.07] blur-3xl dark:bg-primary/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-24 h-48 w-48 rounded-full bg-sky-400/[0.08] blur-3xl dark:bg-sky-500/10"
        aria-hidden
      />

      <header className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Explore</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-[2.75rem] md:leading-[1.1]">
          Search
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          Find startups by name, country, sector, or founder — or scan headlines and summaries across recent news.
        </p>
      </header>

      <div className="relative mt-8">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)] opacity-70" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='Try "fintech", "Lagoon", or "Series A"…'
          className="w-full rounded-2xl border border-[color-mix(in_oklch,var(--foreground)_12%,var(--border))] bg-[var(--card)] py-4 pl-12 pr-4 text-[17px] text-[var(--foreground)] shadow-[0_12px_40px_-18px_color-mix(in_oklch,var(--foreground)_35%,transparent)] outline-none ring-offset-2 ring-offset-[var(--background)] transition-[border-color,box-shadow] placeholder:text-[var(--muted-foreground)] focus:border-primary/40 focus:shadow-[0_16px_48px_-14px_color-mix(in_oklch,var(--primary)_45%,transparent)] focus:ring-2 focus:ring-primary/25 dark:shadow-none dark:focus:shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent)]"
          autoFocus
          aria-label="Search startups and news"
        />
      </div>

      <p className="relative mt-4 text-sm text-[var(--muted-foreground)]" aria-live="polite">
        {results.browsing ? (
          <>
            <span className="font-medium text-[var(--foreground)]">Browsing highlights</span>
            <span className="mx-1.5 text-[var(--border)]">·</span>
            Start typing to narrow results across the full catalog.
          </>
        ) : (
          <>
            <span className="tabular-nums font-semibold text-[var(--foreground)]">{startupCount}</span> startup
            {startupCount === 1 ? "" : "s"}
            <span className="mx-2 text-[var(--border)]">·</span>
            <span className="tabular-nums font-semibold text-[var(--foreground)]">{newsCount}</span> article
            {newsCount === 1 ? "" : "s"}
          </>
        )}
      </p>

      <div className="relative mt-14 grid gap-14 lg:gap-16">
        <section aria-labelledby="search-startups-heading">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
            <h2 id="search-startups-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Startups
            </h2>
          </div>
          <ul className="mt-5 grid gap-3">
            {results.startups.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/startups/${s.slug}`}
                  className="group flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_2px_14px_-6px_color-mix(in_oklch,var(--foreground)_25%,transparent)] transition-[border-color,box-shadow,transform] hover:border-[color-mix(in_oklch,var(--primary)_35%,var(--border))] hover:shadow-[0_12px_28px_-12px_color-mix(in_oklch,var(--foreground)_30%,transparent)] dark:shadow-none md:p-5"
                >
                  <StartupLogoTile startup={s} size="sm" className="rounded-xl shadow-sm transition group-hover:ring-2 group-hover:ring-primary/15" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-lg font-semibold tracking-tight text-[var(--foreground)] group-hover:text-primary md:text-xl">
                        {s.name}
                      </span>
                      {stageChip(s.stage)}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted-foreground)]">
                      <span>{s.country}</span>
                      <span className="text-[var(--border)]">·</span>
                      <span>{s.sector}</span>
                      <span className="text-[var(--border)]">·</span>
                      <span className="truncate">{s.founder.name}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{s.description}</p>
                  </div>
                </Link>
              </li>
            ))}
            {startupCount === 0 && (
              <li className="rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_35%,transparent)] px-6 py-12 text-center dark:bg-[color-mix(in_oklch,var(--muted)_18%,transparent)]">
                <p className="font-medium text-[var(--foreground)]">No startups match</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">Try another keyword or browse the directory.</p>
                <Link href="/startups" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                  Open startup directory
                </Link>
              </li>
            )}
          </ul>
        </section>

        <section aria-labelledby="search-news-heading">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] pb-4">
            <h2 id="search-news-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              News
            </h2>
          </div>
          <ul className="mt-5 grid gap-3">
            {results.news.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/news/${n.slug}`}
                  className="group flex gap-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_2px_14px_-6px_color-mix(in_oklch,var(--foreground)_25%,transparent)] transition-[border-color,box-shadow] hover:border-[color-mix(in_oklch,var(--primary)_35%,var(--border))] hover:shadow-[0_12px_28px_-12px_color-mix(in_oklch,var(--foreground)_30%,transparent)] dark:shadow-none sm:gap-4 sm:pr-4"
                >
                  <div className="relative hidden aspect-[16/10] w-[min(42%,11rem)] shrink-0 overflow-hidden bg-[var(--muted)] sm:block">
                    <Image
                      src={n.coverImage}
                      alt=""
                      fill
                      sizes="176px"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 px-4 py-4 sm:py-5 sm:pl-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {categoryChip(n.category)}
                      <span className="text-[11px] font-medium text-[var(--muted-foreground)]">{formatRelativeTime(n.publishedAt)}</span>
                      {n.trending ? (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                          Trending
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[17px] font-semibold leading-snug tracking-tight text-[var(--foreground)] group-hover:text-primary md:text-lg">
                      {n.title}
                    </p>
                    <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{n.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
            {newsCount === 0 && (
              <li className="rounded-2xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_35%,transparent)] px-6 py-12 text-center dark:bg-[color-mix(in_oklch,var(--muted)_18%,transparent)]">
                <p className="font-medium text-[var(--foreground)]">No articles match</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">Broaden your search or jump to the news feed.</p>
                <Link href="/news" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                  View all news
                </Link>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
