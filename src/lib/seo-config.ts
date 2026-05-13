import type { Metadata } from "next";
import { SITE } from "@/lib/site-config";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

/** Rich default description for `<meta name="description">` and Open Graph. */
export const SITE_SEO_DESCRIPTION = `${SITE.mission} Explore ${SITE.tagline}: startup profiles, funding news, and founder insights across Bangladesh, Sri Lanka, Pakistan, Nepal, and the broader South Asia ecosystem.`;

/** Primary and long-tail phrases for discovery (search + AI retrieval). */
export const GLOBAL_KEYWORDS: string[] = [
  SITE.name,
  "South Asia startups",
  "startup news",
  "startup funding",
  "Bangladesh startups",
  "Sri Lanka startups",
  "Pakistan startups",
  "Nepal startups",
  "India startups",
  "fintech South Asia",
  "healthtech",
  "climate tech",
  "Series A",
  "Seed round",
  "venture capital",
  "founder stories",
  "startup directory",
  "company profiles",
  "launch platform",
];

export function mergeKeywords(...groups: (string | string[] | undefined)[]): string[] {
  const set = new Set<string>();
  for (const g of groups) {
    if (!g) continue;
    const arr = Array.isArray(g) ? g : [g];
    arr.forEach((k) => set.add(k.trim()));
  }
  return [...set];
}

const defaultOgImage = process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE?.trim();

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Open Graph / Twitter image (full URL). */
  ogImage?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  authors?: string[];
  noIndex?: boolean;
};

export function pageMetadata(input: PageSeoInput): Metadata {
  const url = absoluteUrl(input.path);
  const keywords = mergeKeywords(GLOBAL_KEYWORDS, input.keywords);
  const titleSegment = input.title;
  const ogTitle = `${titleSegment} | ${SITE.name}`;
  const images =
    input.ogImage ??
    (defaultOgImage
      ? defaultOgImage.startsWith("http")
        ? defaultOgImage
        : absoluteUrl(defaultOgImage)
      : undefined);

  const openGraph = {
    title: ogTitle,
    description: input.description,
    url,
    siteName: SITE.name,
    locale: "en_US",
    type: input.type ?? "website",
    ...(input.type === "article" && input.publishedTime
      ? {
          publishedTime: input.publishedTime,
          ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
          ...(input.authors?.length ? { authors: input.authors } : {}),
          ...(input.section ? { section: input.section } : {}),
        }
      : {}),
    ...(images ? { images: [{ url: images, alt: titleSegment }] } : {}),
  } as NonNullable<Metadata["openGraph"]>;

  return {
    title: titleSegment,
    description: input.description,
    keywords,
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: ogTitle,
      description: input.description,
      ...(images ? { images: [images] } : {}),
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}

/** JSON-LD @graph: WebSite + Organization for discovery and AI assistants. */
export function websiteJsonLd(): Record<string, unknown> {
  const base = getSiteUrl();
  const org: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${base}#organization`,
    name: SITE.name,
    url: base,
    description: SITE.mission,
    slogan: SITE.tagline,
  };
  if (process.env.NEXT_PUBLIC_ORG_LOGO?.trim()) {
    org.logo = absoluteUrl(process.env.NEXT_PUBLIC_ORG_LOGO.trim());
  }
  if (defaultOgImage) {
    const img = defaultOgImage.startsWith("http") ? defaultOgImage : absoluteUrl(defaultOgImage);
    org.image = img;
  }

  const webSite: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": `${base}#website`,
    name: SITE.name,
    url: base,
    description: SITE.mission,
    inLanguage: "en",
    publisher: { "@id": `${base}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [webSite, org],
  };
}
