import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { NewsCard } from "@/components/cards/news-card";
import type { NewsCategory } from "@/lib/mock-data";
import { getNewsItems } from "@/lib/content/repository";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";

const pageDesc =
  "Funding, launches, tech moves, and events across South Asia. Filter by category and follow the founders shaping the region.";

export const metadata: Metadata = pageMetadata({
  title: "Startup news & funding stories (South Asia)",
  description: pageDesc,
  path: "/news",
  keywords: mergeKeywords(
    "startup news",
    "Funding",
    "Series A",
    "launches",
    "tech startups",
    "events",
    "South Asia headlines",
  ),
});

const categories: NewsCategory[] = ["Funding", "Launch", "Tech", "Events"];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const cat = params.category as NewsCategory | undefined;
  const valid = cat && categories.includes(cat);
  const newsItems = await getNewsItems();
  const filtered = valid ? newsItems.filter((n) => n.category === cat!) : newsItems;

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Startup news</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">
          Funding, launches, tech moves, and events, tuned for South Asia teams and investors.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <CategoryPill href="/news" label="All" active={!valid} />
          {categories.map((c) => (
            <CategoryPill
              key={c}
              href={`/news?category=${encodeURIComponent(c)}`}
              label={c}
              active={valid && cat === c}
            />
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {filtered.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-4">
            <NewsCard item={item} />
            {(index === 1 || index === 4) && <AdSlot variant="in-feed" />}
          </div>
        ))}
      </div>

      <AdSlot variant="article-end" className="mt-10" />
    </div>
  );
}

function CategoryPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-primary text-white"
          : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)]"
      }`}
    >
      {label}
    </Link>
  );
}
