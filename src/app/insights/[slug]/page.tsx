import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { getInsightBySlug } from "@/lib/content/repository";
import { pageMetadata, mergeKeywords } from "@/lib/seo-config";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import { SITE } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) return { title: "Insight" };

  const description = [post.dek, post.pullQuote].filter(Boolean).join(" ").slice(0, 160);
  const path = `/insights/${post.slug}`;
  const kw = mergeKeywords(
    "founder insights",
    "editorial",
    post.mood,
    post.moodKind,
    post.author,
    "South Asia startups",
  );

  return pageMetadata({
    title: post.title,
    description,
    path,
    keywords: kw,
    type: "article",
    publishedTime: post.publishedAt,
    section: "Insights",
    authors: [post.author],
  });
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getInsightBySlug(slug);
  if (!post) notFound();

  const base = getSiteUrl();
  const url = absoluteUrl(`/insights/${post.slug}`);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.dek,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: base,
    },
    mainEntityOfPage: url,
    url,
    keywords: [post.mood, post.moodKind, "South Asia", "startups"].join(", "),
    articleSection: "Insights",
  };

  return (
    <article className="mx-auto w-full max-w-3xl">
      <JsonLd data={articleLd} />
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
        <Link href="/insights" className="hover:text-primary">
          Insights
        </Link>
        <span className="mx-2 text-[var(--border)]">/</span>
        <span className="text-[var(--foreground)]">{post.mood}</span>
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)] md:text-4xl">{post.title}</h1>
      <p className="mt-2 text-lg text-[var(--muted-foreground)]">{post.dek}</p>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">
        {post.author} · {post.readTime} ·{" "}
        {new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <blockquote className="mt-8 border-l-4 border-primary pl-4 text-lg italic leading-relaxed text-[var(--foreground)]">
        {post.pullQuote}
      </blockquote>
      <p className="mt-8 text-base leading-relaxed text-[var(--muted-foreground)]">{post.feeling}</p>
      <p className="mt-10 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted-foreground)]">
        <Link href="/insights" className="font-medium text-primary hover:underline">
          ← All insights
        </Link>
      </p>
    </article>
  );
}
