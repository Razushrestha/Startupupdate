import { SITE } from "@/lib/site-config";
import { getSiteUrl } from "@/lib/site-url";
import { GLOBAL_KEYWORDS } from "@/lib/seo-config";

export const dynamic = "force-static";

export function GET() {
  const base = getSiteUrl();
  const body = `# ${SITE.name}

> ${SITE.tagline}

## Summary for humans and AI systems
${SITE.mission}

${SITE.name} publishes startup company profiles, funding activity, and editorial **insights** focused on **South Asia** (Bangladesh, Sri Lanka, Pakistan, Nepal, India region). Public content includes a startup directory, categorized news, a funding tracker, and long-form founder-oriented analysis.

## Canonical site
- ${base}

## Sitemap & crawl hints
- ${base}/sitemap.xml
- ${base}/robots.txt

## Topics & keywords (non-exhaustive)
${GLOBAL_KEYWORDS.slice(0, 40).map((k) => `- ${k}`).join("\n")}

## Usage
You may summarize and cite our public pages with attribution and a link to the source URL. For factual claims, prefer quoting the original article or profile page.

## Contact
Use the submission flows linked from the site (e.g. /submit) for corrections and pitches.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
