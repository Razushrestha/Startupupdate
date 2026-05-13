import type { Metadata } from "next";
import { getNewsItems, getStartups } from "@/lib/content/repository";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";
import { SearchPageClient } from "./search-client";

export const metadata: Metadata = pageMetadata({
  title: "Search startups & news",
  description:
    "Search company names, countries, sectors, founders, news headlines, and story summaries across StartupUpdate.",
  path: "/search",
  keywords: mergeKeywords("search", "find startups", "startup news search"),
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [startups, newsItems] = await Promise.all([getStartups(), getNewsItems()]);
  return <SearchPageClient key={q ?? ""} initialQuery={q ?? ""} startups={startups} newsItems={newsItems} />;
}
