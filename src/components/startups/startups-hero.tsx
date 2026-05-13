type DayPeriod = "morning" | "afternoon" | "evening";

const LEDE: Record<DayPeriod, string> = {
  morning:
    "Start here before the spreadsheets: every company below is a group of people who decided the region’s problems are theirs to carry.",
  afternoon:
    "Use filters if you need them, or scroll slowly. These profiles are written so investors and neighbors recognize the humans behind the metrics.",
  evening:
    "If you’re browsing after hours, treat this less like a database and more like a room where founders left the light on.",
};

export function StartupsHero({
  count,
  countryCount,
  dayPeriod,
}: {
  count: number;
  countryCount: number;
  dayPeriod: DayPeriod;
}) {
  return (
    <section className="relative mb-10 overflow-hidden border border-[var(--border)] bg-[var(--card)]">
      <div className="relative px-6 py-10 md:px-10 md:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          South Asia, founders &amp; teams
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.12] tracking-tight text-[var(--foreground)] md:text-4xl">
          Meet the startups{" "}
          <span className="text-primary">worth rooting for</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {LEDE[dayPeriod]}
        </p>
        <dl className="mt-8 flex flex-wrap gap-6 border-t border-[var(--border)] pt-8">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              In this room
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">{count}</dd>
            <dd className="text-xs text-[var(--muted-foreground)]">teams profiled</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              Geography
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
              {countryCount}
            </dd>
            <dd className="text-xs text-[var(--muted-foreground)]">countries represented</dd>
          </div>
          <div className="min-w-0 max-w-md flex-1">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              Why we built it this way
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
              Momentum scores show how readers are responding here, not a verdict on worth. The best next step is
              always the profile: where mission, news, and funding live together.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
