"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { AdSlot } from "@/components/ads/ad-slot";
import { useLocale } from "@/components/locale-provider";
import { NewsReactions } from "@/components/news/news-reactions";
import { googleTranslateUrl, resolveArticleForLocale } from "@/lib/i18n/article-content";
import { APP_LOCALES } from "@/lib/i18n/locales";
import { uiT } from "@/lib/i18n/ui-dictionary";
import type { NewsItem } from "@/lib/mock-data";
import { formatRelativeTime, getStartupById } from "@/lib/mock-data";

type Related = Pick<NewsItem, "id" | "slug" | "title" | "summary">;

export function ArticleExperience({
  article,
  related,
  siteOrigin,
}: {
  article: NewsItem;
  related: Related[];
  /** Absolute site URL without trailing slash (from server headers or env). */
  siteOrigin: string;
}) {
  const { locale } = useLocale();
  const resolved = useMemo(
    () => resolveArticleForLocale(article, locale),
    [article, locale],
  );
  const startup = getStartupById(article.startupId);

  const articleUrl = useMemo(
    () => (siteOrigin ? `${siteOrigin}/news/${article.slug}` : ""),
    [article.slug, siteOrigin],
  );

  const translateHref = useMemo(() => {
    if (!articleUrl) return "#";
    const tl =
      APP_LOCALES.find((l) => l.code === locale)?.htmlLang ??
      ("en" satisfies string);
    return googleTranslateUrl(articleUrl, tl);
  }, [articleUrl, locale]);

  const showMachineHelp = locale !== "en" && !resolved.isFullyLocalized;

  const htmlLang =
    APP_LOCALES.find((l) => l.code === locale)?.htmlLang ?? "en";
  const bodyLang = resolved.isFullyLocalized ? htmlLang : "en";

  return (
    <article
      className="mx-auto w-full max-w-3xl"
      lang={htmlLang}
      dir={locale === "ur" ? "rtl" : "ltr"}
    >
      <figure className="mb-8 border border-[var(--border)] bg-[var(--muted)]">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.imageAlt ?? article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-cover"
          />
        </div>
        {article.imageAlt && (
          <figcaption className="border-t border-[var(--border)] px-3 py-2 text-xs text-[var(--muted-foreground)]">
            {article.imageAlt}
          </figcaption>
        )}
      </figure>

      <header className="border-b border-[var(--border)] pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          {article.category}
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-snug tracking-tight text-[var(--foreground)] md:text-4xl">
          {resolved.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted-foreground)]">{resolved.summary}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
          {startup && (
            <>
              <span aria-hidden>|</span>
              <Link href={`/startups/${startup.slug}`} className="text-[var(--foreground)] underline-offset-2 hover:underline">
                {startup.name}
              </Link>
            </>
          )}
        </div>

        <div className="mt-6">
        <NewsReactions
          articleId={article.id}
          slug={article.slug}
          title={resolved.title}
          summary={resolved.summary}
          variant="article"
        />
        </div>

        {showMachineHelp && (
          <div className="mt-6 border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3 text-sm text-[var(--muted-foreground)]">
            <p>{uiT(locale, "showingTranslation")}</p>
            <p className="mt-2">{uiT(locale, "originalEnglish")}</p>
            {articleUrl && (
              <a
                href={translateHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block font-medium text-[var(--foreground)] underline underline-offset-2"
              >
                {uiT(locale, "openInTranslate")}
              </a>
            )}
          </div>
        )}
      </header>

      <div
        className="mx-auto mt-10 max-w-prose space-y-5 text-[1.05rem] leading-[1.75] text-[var(--muted-foreground)]"
        lang={bodyLang}
        translate="yes"
      >
        {resolved.body.map((para, index) => (
          <div key={`${article.id}-p-${index}`}>
            <p className="text-pretty">{para}</p>
            {index === 1 && <AdSlot variant="article-mid" className="my-10 max-w-none" />}
            {index === 3 && resolved.body.length > 4 && (
              <AdSlot variant="article-mid" className="my-10 max-w-none" />
            )}
          </div>
        ))}
      </div>

      <AdSlot variant="article-end" className="mt-12 max-w-none" />

      {related.length > 0 && (
        <section className="mt-14 border-t border-[var(--border)] pt-12">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {uiT(locale, "moreOnStartup")}
          </h2>
          <ul className="mt-6 space-y-5">
            {related.map((n) => (
              <li key={n.id} className="border border-[var(--border)] bg-[var(--card)] p-4">
                <Link
                  href={`/news/${n.slug}`}
                  className="font-medium text-[var(--foreground)] underline-offset-2 hover:underline"
                >
                  {n.title}
                </Link>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{n.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
