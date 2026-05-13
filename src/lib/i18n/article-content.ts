import type { AppLocale } from "./locales";
import type { NewsItem } from "@/lib/mock-data";

export type ResolvedArticle = {
  title: string;
  summary: string;
  body: string[];
  /** True when this locale has its own story body (or English source). */
  isFullyLocalized: boolean;
};

export function resolveArticleForLocale(article: NewsItem, locale: AppLocale): ResolvedArticle {
  if (locale === "en") {
    return {
      title: article.title,
      summary: article.summary,
      body: article.body,
      isFullyLocalized: true,
    };
  }
  const tr = article.translations?.[locale];
  if (tr && tr.body?.length) {
    return {
      title: tr.title,
      summary: tr.summary,
      body: tr.body,
      isFullyLocalized: true,
    };
  }
  return {
    title: article.title,
    summary: article.summary,
    body: article.body,
    isFullyLocalized: false,
  };
}

export function googleTranslateUrl(articleUrl: string, targetLang: string) {
  const params = new URLSearchParams({
    sl: "auto",
    tl: targetLang,
    u: articleUrl,
  });
  return `https://translate.google.com/translate?${params.toString()}`;
}
