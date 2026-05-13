import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { NewsCard } from "@/components/cards/news-card";
import { TrendingScroll } from "@/components/home/trending-scroll";
import { StartupCard } from "@/components/cards/startup-card";
import { SITE } from "@/lib/site-config";
import {
  getInsights,
  getNewsItems,
  trendingStartups,
  visitorStats,
} from "@/lib/content/repository";
import { mergeKeywords, pageMetadata, SITE_SEO_DESCRIPTION } from "@/lib/seo-config";

export const metadata: Metadata = pageMetadata({
  title: "South Asia startup news, funding & company profiles",
  description: SITE_SEO_DESCRIPTION,
  path: "/",
  keywords: mergeKeywords(
    "homepage",
    "trending startups",
    "latest funding news",
    "startup ecosystem",
    "BD PK LK NP IN founders",
  ),
});

export default async function HomePage() {
  const [newsItems, insights, topStartups, stats] = await Promise.all([
    getNewsItems(),
    getInsights(),
    trendingStartups(10),
    visitorStats(),
  ]);

  const trendingNews = [...newsItems]
    .filter((n) => n.trending)
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  const feed = [...newsItems].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <div className="flex w-full flex-col gap-10 lg:flex-row">
      <div className="min-w-0 flex-1 space-y-10">
        <section className="border border-[var(--border)] bg-[var(--muted)]/40 px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            South Asia
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">
            {SITE.tagline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted-foreground)]">{SITE.mission}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center border border-primary bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Submit an update
            </Link>
            <Link
              href="/startups"
              className="inline-flex items-center justify-center border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--muted)]"
            >
              Browse startups
            </Link>
          </div>
        </section>

        <TrendingScroll>
          {trendingNews.map((item) => (
            <div
              key={item.id}
              className="w-[min(100%,380px)] shrink-0 snap-center sm:w-[360px]"
            >
              <NewsCard item={item} layout="carousel" className="h-full" />
            </div>
          ))}
        </TrendingScroll>

        <section aria-labelledby="latest-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="latest-heading" className="text-lg font-semibold text-[var(--foreground)]">
              Latest startup news
            </h2>
            <Link href="/news" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {feed.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-4">
                <NewsCard item={item} />
                {(index === 1 || index === 4) && <AdSlot variant="in-feed" />}
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="featured-startups-heading">
          <h2 id="featured-startups-heading" className="text-lg font-semibold text-[var(--foreground)]">
            Rising startups this week
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Ranked by on-platform engagement, your live tracker for momentum in the ecosystem.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {topStartups.slice(0, 4).map((s) => (
              <StartupCard key={s.id} startup={s} showScore />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Insights preview</h2>
          <ul className="mt-4 space-y-4">
            {insights.slice(0, 2).map((post) => (
              <li key={post.id} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                <Link href={`/insights/${post.slug}`} className="font-medium text-[var(--foreground)] hover:text-primary">
                  {post.title}
                </Link>
                <p className="mt-2 text-xs font-medium text-[var(--foreground)]/80">{post.mood}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{post.dek}</p>
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                  {post.readTime}, {post.author}
                </p>
              </li>
            ))}
          </ul>
          <Link
            href="/insights"
            className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Open Insights
          </Link>
        </section>
      </div>

      <aside className="hidden w-80 flex-shrink-0 flex-col gap-6 lg:flex" aria-label="Highlights">
        <AdSlot variant="sidebar" />
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Top 10, momentum</h3>
          <ol className="mt-4 space-y-3 text-sm">
            {topStartups.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-xs font-bold">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <Link href={`/startups/${s.slug}`} className="truncate font-medium hover:text-primary">
                    {s.name}
                  </Link>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {s.country}, {s.sector}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Ecosystem snapshot</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted-foreground)]">
            <li>{stats.startupCount} tracked startups</li>
            <li>{stats.storyCount} stories in the last cycle</li>
            <li>Self-serve submissions live. Help us grow the map.</li>
          </ul>
          <Link
            href="/submit"
            className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Submit your launch
          </Link>
        </div>
      </aside>
    </div>
  );
}
