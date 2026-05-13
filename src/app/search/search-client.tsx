"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { NewsItem, Startup } from "@/lib/mock-data";

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
      return { startups: startups.slice(0, 6), news: newsItems.slice(0, 6) };
    }
    const s = startups.filter(
      (x) =>
        x.name.toLowerCase().includes(needle) ||
        x.country.toLowerCase().includes(needle) ||
        x.sector.toLowerCase().includes(needle) ||
        x.founder.name.toLowerCase().includes(needle),
    );
    const n = newsItems.filter(
      (x) =>
        x.title.toLowerCase().includes(needle) || x.summary.toLowerCase().includes(needle),
    );
    return { startups: s, news: n };
  }, [q, startups, newsItems]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-3xl font-bold text-[var(--foreground)]">Search</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Startups, founders, and headlines. Extend with your search backend when ready.
      </p>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='Try "fintech", "Lagoon", or "Series A"…'
        className="mt-6 w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[var(--foreground)] shadow-sm outline-none ring-primary/30 placeholder:text-[var(--muted-foreground)] focus:ring-2"
        autoFocus
        aria-label="Search"
      />

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Startups
        </h2>
        <ul className="mt-3 space-y-2">
          {results.startups.map((s) => (
            <li key={s.id}>
              <Link href={`/startups/${s.slug}`} className="font-medium hover:text-primary">
                {s.name}
              </Link>
              <span className="text-sm text-[var(--muted-foreground)]">
                , {s.country}, {s.sector}
              </span>
            </li>
          ))}
          {results.startups.length === 0 && (
            <li className="text-sm text-[var(--muted-foreground)]">No startup matches.</li>
          )}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          News
        </h2>
        <ul className="mt-3 space-y-3">
          {results.news.map((n) => (
            <li key={n.id}>
              <Link href={`/news/${n.slug}`} className="font-medium hover:text-primary">
                {n.title}
              </Link>
              <p className="text-sm text-[var(--muted-foreground)]">{n.summary}</p>
            </li>
          ))}
          {results.news.length === 0 && (
            <li className="text-sm text-[var(--muted-foreground)]">No news matches.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
