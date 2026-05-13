import { headers } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleExperience } from "@/components/news/article-experience";
import { JsonLd } from "@/components/seo/json-ld";
import { getNewsBySlug, newsForStartup } from "@/lib/content/repository";
import { SITE } from "@/lib/site-config";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";
import { absoluteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Article" };

  const titleWords = article.title
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 12);

  return pageMetadata({
    title: article.title,
    description: article.summary,
    path: `/news/${article.slug}`,
    keywords: mergeKeywords(article.category, "startup news", "South Asia", titleWords),
    type: "article",
    publishedTime: article.publishedAt,
    section: article.category,
    ogImage: article.coverImage,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0]?.trim() ?? "http";
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const siteOrigin = fromEnv || (host ? `${proto}://${host}` : "");

  const related = (await newsForStartup(article.startupId))
    .filter((n) => n.id !== article.id)
    .slice(0, 3)
    .map((n) => ({ id: n.id, slug: n.slug, title: n.title, summary: n.summary }));

  const canonical = absoluteUrl(`/news/${article.slug}`);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    image: article.coverImage ? [article.coverImage] : undefined,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: canonical,
    articleSection: article.category,
    keywords: mergeKeywords(article.category, "startups", "South Asia").join(", "),
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <ArticleExperience article={article} related={related} siteOrigin={siteOrigin} />
    </>
  );
}
