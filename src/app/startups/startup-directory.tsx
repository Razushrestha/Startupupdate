"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Startup, StartupStage } from "@/lib/mock-data";
import { StartupCard } from "@/components/cards/startup-card";
import { cn } from "@/lib/cn";

const stages: StartupStage[] = ["Pre-seed", "Seed", "Series A", "Series B", "Grant"];

type SortKey = "pulse" | "name" | "country";

export function StartupDirectory({ startups }: { startups: Startup[] }) {
  const [country, setCountry] = useState<string>("");
  const [sector, setSector] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("pulse");

  const countries = useMemo(
    () => Array.from(new Set(startups.map((s) => s.country))).sort(),
    [startups],
  );
  const sectors = useMemo(() => Array.from(new Set(startups.map((s) => s.sector))).sort(), [startups]);

  const filtered: Startup[] = useMemo(() => {
    let list = startups.filter((s) => {
      if (country && s.country !== country) return false;
      if (sector && s.sector !== sector) return false;
      if (stage && s.stage !== stage) return false;
      return true;
    });
    list = [...list];
    if (sort === "pulse") {
      list.sort((a, b) => b.engagementScore - a.engagementScore);
    } else if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));
    }
    return list;
  }, [country, sector, stage, sort, startups]);

  const activeFilters = [country, sector, stage].filter(Boolean).length;

  const reset = () => {
    setCountry("");
    setSector("");
    setStage("");
  };

  const fieldClass =
    "rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/25 dark:bg-[var(--card)]";

  const sortBtn = (key: SortKey, label: string) => (
    <button
      type="button"
      onClick={() => setSort(key)}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-medium transition",
        sort === key
          ? "bg-[var(--foreground)] text-[var(--background)]"
          : "bg-[var(--muted)]/60 text-[var(--foreground)] hover:bg-[var(--muted)]",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/25 p-6 dark:bg-[var(--muted)]/15">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Find your way in</h2>
            <p className="mt-1 max-w-xl text-sm text-[var(--muted-foreground)]">
              Filters are optional. Sort by pulse to see who readers are leaning toward lately, or by name if you’re
              meeting someone halfway.
            </p>
          </div>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={reset}
              className="shrink-0 self-start rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:border-sky-400/60 hover:bg-sky-50 dark:hover:bg-sky-950/30 md:self-auto"
            >
              Clear filters ({activeFilters})
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-4">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">Sort</span>
          {sortBtn("pulse", "Momentum")}
          {sortBtn("name", "Name")}
          {sortBtn("country", "Country")}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--foreground)]">Country</span>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClass}>
              <option value="">Everywhere we cover</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--foreground)]">Sector</span>
            <select value={sector} onChange={(e) => setSector(e.target.value)} className={fieldClass}>
              <option value="">All sectors</option>
              {sectors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2 lg:col-span-1">
            <span className="font-medium text-[var(--foreground)]">Stage</span>
            <select value={stage} onChange={(e) => setStage(e.target.value)} className={fieldClass}>
              <option value="">Any stage</option>
              {stages.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mb-6 text-sm text-[var(--muted-foreground)]">
        {filtered.length === 0 ? (
          <>
            Nothing matches yet. Loosen a filter and we’ll show teams again. Building something new?{" "}
            <Link href="/submit" className="font-medium text-sky-700 underline underline-offset-2 dark:text-sky-400">
              Tell us your story
            </Link>
            .
          </>
        ) : (
          <>
            Showing{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {filtered.length} {filtered.length === 1 ? "team" : "teams"}
            </span>
            {activeFilters > 0 ? " that feel like a fit" : " you can root for"}. Open a profile to go deeper.
          </>
        )}
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {filtered.map((s) => (
          <StartupCard key={s.id} startup={s} variant="directory" />
        ))}
      </div>
    </div>
  );
}
