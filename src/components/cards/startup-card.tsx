import Link from "next/link";
import type { Startup } from "@/lib/mock-data";
import { cn } from "@/lib/cn";
import { StartupLogoTile } from "@/components/cards/startup-logo-tile";

function EngagementPulse({ score }: { score: number }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        <span>Community pulse</span>
        <span className="tabular-nums text-[var(--foreground)]">{score}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}

export function StartupCard({
  startup,
  className,
  showScore,
  variant = "default",
}: {
  startup: Startup;
  className?: string;
  showScore?: boolean;
  /** `directory`: storytelling layout for the startups listing. */
  variant?: "default" | "directory";
}) {
  if (variant === "directory") {
    return (
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition duration-300",
          "hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/40",
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[var(--muted)]/40" />
        <div className="relative flex flex-1 flex-col p-6">
          <div className="flex items-start gap-4">
            <StartupLogoTile
              startup={startup}
              size="md"
              className="rounded-xl shadow-sm ring-2 ring-white/60 dark:ring-slate-800/80"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {startup.stage}, {startup.sector}
              </p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight">
                <Link
                  href={`/startups/${startup.slug}`}
                  className="text-[var(--foreground)] underline-offset-2 decoration-transparent visited:text-[var(--foreground)] transition hover:underline hover:decoration-[var(--foreground)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/25"
                >
                  {startup.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{startup.country}</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-[var(--foreground)]/90">{startup.description}</p>

          <blockquote className="mt-5 border-l-[3px] border-sky-400/90 py-0.5 pl-4 text-sm font-medium italic leading-relaxed text-[var(--foreground)] dark:border-sky-500/80">
            {startup.mission}
          </blockquote>

          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            {startup.vision}
          </p>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-[var(--border)] pt-5 text-sm">
            <span className="text-[var(--muted-foreground)]">Led by</span>
            <span className="font-medium text-[var(--foreground)]">{startup.founder.name}</span>
            <span className="text-[var(--muted-foreground)]">, {startup.founder.role}</span>
          </div>

          <EngagementPulse score={startup.engagementScore} />

          <Link
            href={`/startups/${startup.slug}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition group-hover:border-sky-300 group-hover:bg-sky-50/90 dark:group-hover:border-sky-600/50 dark:group-hover:bg-sky-950/40"
          >
            Open profile: mission, news &amp; funding
          </Link>
        </div>
      </article>
    );
  }

  /* Default: home listings & compact reuse */
  return (
    <article
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm",
        "transition hover:-translate-y-0.5 hover:shadow-md dark:hover:bg-[var(--muted)]/15",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <StartupLogoTile startup={startup} size="md" className="shrink-0" />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight">
            <Link
              href={`/startups/${startup.slug}`}
              className="text-[var(--foreground)] underline-offset-2 decoration-transparent visited:text-[var(--foreground)] transition hover:underline hover:decoration-[var(--foreground)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/25"
            >
              {startup.name}
            </Link>
          </h3>
          <div className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
            <p>
              <span className="font-semibold text-[var(--foreground)]">Mission </span>
              {startup.mission}
            </p>
            <p>
              <span className="font-semibold text-[var(--foreground)]">Vision </span>
              {startup.vision}
            </p>
          </div>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            {startup.country}, {startup.sector}, {startup.stage}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{startup.description}</p>
          {showScore && <EngagementPulse score={startup.engagementScore} />}
        </div>
      </div>
    </article>
  );
}
