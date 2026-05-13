import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { StartupLogoTile } from "@/components/cards/startup-logo-tile";
import { InsightPostCard } from "@/components/insights/insight-post-card";
import { InsightsSignalsMarquee } from "@/components/insights/insights-signals-marquee";
import type { InsightPost, Startup } from "@/lib/mock-data";

const SALUTATIONS: Record<"morning" | "afternoon" | "evening", string> = {
  morning:
    "If you’re reading this before the day crowds your calendar, welcome. We saved the human bits on purpose.",
  afternoon:
    "The middle of the week is when doubt and momentum often share a desk. These notes are for that stretch.",
  evening:
    "If you’re here after hours, take the softer type and slower scroll as permission to read as a person, not only a role.",
};

const EDITOR_NOTE = [
  "We built this desk for the texture other briefings leave out: relief, impatience, tenderness toward teams, and the inconvenient truth that data never replaces how a decision feels in the body.",
  "Nothing here is optimized for outrage. If a line lands, it’s because someone trusted us with how the work actually felt.",
];

export function InsightsPageView({
  insights,
  spotlight,
  dayPeriod,
}: {
  insights: InsightPost[];
  spotlight: Startup;
  dayPeriod: "morning" | "afternoon" | "evening";
}) {
  const [featured, ...rest] = insights;

  return (
    <div className="w-full">
      <section className="relative mb-0 overflow-hidden border border-[var(--border)] bg-[var(--card)]">
        <div className="relative px-6 py-12 md:px-10 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
            The living layer, Startup intelligence
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.15] tracking-tight text-[var(--foreground)] md:text-4xl">
            Insights that leave space for how the work{" "}
            <span className="text-primary">actually feels</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            {SALUTATIONS[dayPeriod]}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--foreground)]">
              Not a leaderboard, a ledger of attention
            </span>
            <span className="rounded-full border border-transparent bg-[var(--muted)]/80 px-3 py-1 text-xs text-[var(--muted-foreground)]">
              South Asia, founders, capital, craft
            </span>
          </div>
        </div>
      </section>

      <InsightsSignalsMarquee />

      <section
        className="my-12 border border-[var(--border)] bg-[var(--card)]"
        aria-labelledby="spotlight-heading"
      >
        <div className="grid gap-0 lg:grid-cols-12">
          <div className="flex flex-col justify-between border-b border-[var(--border)] bg-[var(--muted)]/35 p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                Founder pulse
              </p>
              <h2
                id="spotlight-heading"
                className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]"
              >
                {spotlight.founder.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {spotlight.founder.role}, {spotlight.name}
              </p>
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <StartupLogoTile startup={spotlight} size="lg" />
            </div>
          </div>
          <div className="space-y-6 p-8 lg:col-span-7">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 p-6 dark:bg-[var(--muted)]/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                In their words
              </p>
              <blockquote className="mt-3 text-lg font-medium leading-relaxed text-[var(--foreground)] md:text-xl">
                “{spotlight.mission}”
              </blockquote>
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{spotlight.founder.bio}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/startups/${spotlight.slug}`}
                className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]/30 hover:bg-[var(--muted)]/50"
              >
                See how {spotlight.name} shows up on a profile
              </Link>
              <p className="self-center text-xs text-[var(--muted-foreground)]">
                Clarity for people deciding whether to trust the mission with their Monday morning.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-12 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-10">
          <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                Stories worth a slower read
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">
                Each piece carries a mood on purpose, so you know what kind of week it was written from.
              </p>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Updated as we learn, not as we rush.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {featured && <InsightPostCard post={featured} featured />}
            {rest.map((post) => (
              <InsightPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <aside className="w-full shrink-0 space-y-6 lg:w-80">
          <AdSlot variant="sidebar" />
          <div className="border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
              Editor&apos;s note
            </p>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {EDITOR_NOTE.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-4 text-xs text-[var(--muted-foreground)]">
              <p className="font-medium text-[var(--foreground)]">Want this in your inbox?</p>
              <p className="mt-2">
                Reserve this sidebar for a human-written digest, not growth hacks, the kind of letter people reply to.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <AdSlot variant="article-end" className="mt-12" />
    </div>
  );
}
