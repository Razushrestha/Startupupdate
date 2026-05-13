import type mongoose from "mongoose";
import type { InsightPost, NewsItem, Startup } from "@/lib/mock-data";
import {
  insights as mockInsights,
  newsItems as mockNews,
  startups as mockStartups,
} from "@/lib/mock-data";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { InsightModel, NewsModel, StartupModel } from "@/lib/db/models";

function toIso(d: Date | string): string {
  if (typeof d === "string") return d;
  return d.toISOString();
}

function serializeStartup(
  doc: mongoose.FlattenMaps<{ _id: mongoose.Types.ObjectId } & Record<string, unknown>>,
): Startup {
  const d = doc as unknown as {
    _id: mongoose.Types.ObjectId;
    slug: string;
    name: string;
    country: string;
    sector: string;
    stage: Startup["stage"];
    description: string;
    mission: string;
    vision: string;
    brandLogoUrl?: string;
    logoLetter: string;
    engagementScore: number;
    founder: Startup["founder"];
    funding: Startup["funding"];
  };
  return {
    id: d._id.toString(),
    slug: d.slug,
    name: d.name,
    country: d.country,
    sector: d.sector,
    stage: d.stage,
    description: d.description,
    mission: d.mission,
    vision: d.vision,
    brandLogoUrl: d.brandLogoUrl,
    logoLetter: d.logoLetter,
    engagementScore: d.engagementScore,
    founder: d.founder,
    funding: d.funding ?? [],
  };
}

function serializeNews(
  doc: mongoose.FlattenMaps<{ _id: mongoose.Types.ObjectId } & Record<string, unknown>>,
): NewsItem {
  const d = doc as unknown as {
    _id: mongoose.Types.ObjectId;
    slug: string;
    title: string;
    summary: string;
    category: NewsItem["category"];
    publishedAt: Date;
    startupId: mongoose.Types.ObjectId;
    trending?: boolean;
    body: string[];
    coverImage: string;
    imageAlt?: string;
    translations?: NewsItem["translations"];
  };
  return {
    id: d._id.toString(),
    slug: d.slug,
    title: d.title,
    summary: d.summary,
    category: d.category,
    publishedAt: toIso(d.publishedAt),
    startupId: d.startupId.toString(),
    trending: d.trending,
    body: d.body ?? [],
    coverImage: d.coverImage,
    imageAlt: d.imageAlt,
    translations: d.translations,
  };
}

function serializeInsight(
  doc: mongoose.FlattenMaps<{ _id: mongoose.Types.ObjectId } & Record<string, unknown>>,
): InsightPost {
  const d = doc as unknown as {
    _id: mongoose.Types.ObjectId;
    slug: string;
    title: string;
    dek: string;
    readTime: string;
    author: string;
    publishedAt: Date;
    feeling: string;
    mood: string;
    moodKind: InsightPost["moodKind"];
    pullQuote: string;
  };
  return {
    id: d._id.toString(),
    slug: d.slug,
    title: d.title,
    dek: d.dek,
    readTime: d.readTime,
    author: d.author,
    publishedAt: toIso(d.publishedAt),
    feeling: d.feeling,
    mood: d.mood,
    moodKind: d.moodKind,
    pullQuote: d.pullQuote,
  };
}

export async function getStartups(): Promise<Startup[]> {
  if (!isMongoConfigured()) return mockStartups;
  await connectMongo();
  const docs = await StartupModel.find().lean();
  return docs.map((doc) => serializeStartup(doc));
}

export async function getStartupById(id: string): Promise<Startup | undefined> {
  if (!isMongoConfigured()) return mockStartups.find((s) => s.id === id);
  await connectMongo();
  if (!id) return undefined;
  const doc = await StartupModel.findById(id).lean();
  return doc ? serializeStartup(doc) : undefined;
}

export async function getStartupBySlug(slug: string): Promise<Startup | undefined> {
  if (!isMongoConfigured()) return mockStartups.find((s) => s.slug === slug);
  await connectMongo();
  const doc = await StartupModel.findOne({ slug }).lean();
  return doc ? serializeStartup(doc) : undefined;
}

export async function getNewsItems(): Promise<NewsItem[]> {
  if (!isMongoConfigured()) return mockNews;
  await connectMongo();
  const docs = await NewsModel.find().lean();
  return docs.map((d) => serializeNews(d));
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  if (!isMongoConfigured()) return mockNews.find((n) => n.slug === slug);
  await connectMongo();
  const doc = await NewsModel.findOne({ slug }).lean();
  return doc ? serializeNews(doc) : undefined;
}

export async function getInsights(): Promise<InsightPost[]> {
  if (!isMongoConfigured()) return mockInsights;
  await connectMongo();
  const docs = await InsightModel.find().lean();
  return docs.map((d) => serializeInsight(d));
}

export async function getInsightBySlug(slug: string): Promise<InsightPost | undefined> {
  if (!isMongoConfigured()) return mockInsights.find((i) => i.slug === slug);
  await connectMongo();
  const doc = await InsightModel.findOne({ slug }).lean();
  return doc ? serializeInsight(doc) : undefined;
}

export async function trendingStartups(limit = 10): Promise<Startup[]> {
  const all = await getStartups();
  return [...all].sort((a, b) => b.engagementScore - a.engagementScore).slice(0, limit);
}

export async function newsForStartup(startupId: string): Promise<NewsItem[]> {
  if (!isMongoConfigured()) return mockNews.filter((n) => n.startupId === startupId);
  await connectMongo();
  const docs = await NewsModel.find({ startupId }).sort({ publishedAt: -1 }).lean();
  return docs.map((d) => serializeNews(d));
}

export async function visitorStats(): Promise<{
  startupCount: number;
  storyCount: number;
}> {
  const startups = await getStartups();
  const news = await getNewsItems();
  return { startupCount: startups.length, storyCount: news.length };
}
