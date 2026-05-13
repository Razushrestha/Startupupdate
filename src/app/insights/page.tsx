import type { Metadata } from "next";
import { InsightsPageView } from "@/components/insights/insights-page-view";
import { getInsights, getStartups, trendingStartups } from "@/lib/content/repository";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";

const pageDesc =
  "Editorial notes on compliance, climate finance, remote teams, and founder psychology—written for people building in South Asia.";

export const metadata: Metadata = pageMetadata({
  title: "Founder insights & analysis (South Asia)",
  description: pageDesc,
  path: "/insights",
  keywords: mergeKeywords(
    "founder insights",
    "editorial",
    "compliance",
    "climate startups",
    "remote hiring",
    "startup psychology",
  ),
});

function getDayPeriod(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default async function InsightsPage() {
  const [insights, top, startups] = await Promise.all([
    getInsights(),
    trendingStartups(1),
    getStartups(),
  ]);
  const spotlight = top[0] ?? startups[0];
  const ordered = [...insights].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  if (!spotlight) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center text-[var(--muted-foreground)]">
        <p>Add startups and insights in the admin (or seed MongoDB) to populate this page.</p>
        <p className="mt-2 text-sm">Until then, mock data is used only when MongoDB is not configured.</p>
      </div>
    );
  }

  return (
    <InsightsPageView insights={ordered} spotlight={spotlight} dayPeriod={getDayPeriod()} />
  );
}
