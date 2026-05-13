import type { MetadataRoute } from "next";
import { getInsights, getNewsItems, getStartups } from "@/lib/content/repository";
import { getSiteUrl } from "@/lib/site-url";

const staticRoutes: MetadataRoute.Sitemap = [
  "",
  "/startups",
  "/news",
  "/funding",
  "/insights",
  "/search",
  "/submit",
  "/submit/news",
  "/profile",
].map((path) => ({
  url: `${getSiteUrl()}${path}`,
  lastModified: new Date(),
  changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
  priority: path === "" ? 1 : path === "/news" || path === "/startups" ? 0.9 : 0.7,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [startups, news, insights] = await Promise.all([
    getStartups(),
    getNewsItems(),
    getInsights(),
  ]);

  const startupEntries: MetadataRoute.Sitemap = startups.map((s) => ({
    url: `${base}/startups/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const newsEntries: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${base}/news/${n.slug}`,
    lastModified: new Date(n.publishedAt),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const insightEntries: MetadataRoute.Sitemap = insights.map((i) => ({
    url: `${base}/insights/${i.slug}`,
    lastModified: new Date(i.publishedAt),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...startupEntries, ...newsEntries, ...insightEntries];
}
