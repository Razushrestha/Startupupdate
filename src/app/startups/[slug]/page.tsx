import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { StartupLogoTile } from "@/components/cards/startup-logo-tile";
import { JsonLd } from "@/components/seo/json-ld";
import { formatRelativeTime } from "@/lib/mock-data";
import { getStartupBySlug, newsForStartup } from "@/lib/content/repository";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";
import { absoluteUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartupBySlug(slug);
  if (!startup) return { title: "Startup" };

  const description = `${startup.description} Mission: ${startup.mission.slice(0, 120)}`;
  return pageMetadata({
    title: `${startup.name} (${startup.sector}, ${startup.country})`,
    description: description.slice(0, 200),
    path: `/startups/${startup.slug}`,
    keywords: mergeKeywords(
      startup.name,
      startup.sector,
      startup.country,
      startup.stage,
      "founder",
      startup.founder.name,
      "funding",
    ),
  });
}

export default async function StartupProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const startup = await getStartupBySlug(slug);
  if (!startup) notFound();

  const timeline = (await newsForStartup(startup.id)).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const url = absoluteUrl(`/startups/${startup.slug}`);
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: startup.name,
    url,
    description: startup.description,
    slogan: startup.mission,
    areaServed: startup.country,
    industry: startup.sector,
    founder: {
      "@type": "Person",
      name: startup.founder.name,
      jobTitle: startup.founder.role,
    },
    ...(startup.brandLogoUrl ? { logo: startup.brandLogoUrl } : {}),
  };

  return (
    <div className="w-full">
      <JsonLd data={orgLd} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-6">
            <StartupLogoTile startup={startup} size="lg" />
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">{startup.name}</h1>
              <p className="mt-1 text-[var(--muted-foreground)]">
                {startup.country}, {startup.sector}, {startup.stage}
              </p>
              <div className="mt-6 space-y-4 text-[var(--muted-foreground)]">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]">Mission</h2>
                  <p className="mt-2 max-w-3xl leading-relaxed">{startup.mission}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]">Vision</h2>
                  <p className="mt-2 max-w-3xl leading-relaxed">{startup.vision}</p>
                </div>
              </div>
              <p className="mt-6 max-w-3xl border-t border-[var(--border)] pt-6 text-sm leading-relaxed text-[var(--muted-foreground)]">
                {startup.description}
              </p>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Funding history</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Round</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Investors</th>
                  </tr>
                </thead>
                <tbody>
                  {startup.funding.map((r) => (
                    <tr key={`${r.round}-${r.date}`} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3 text-[var(--foreground)]">{r.round}</td>
                      <td className="px-4 py-3 text-[var(--foreground)]">{r.amount}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.date}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {r.investors.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <AdSlot variant="article-mid" className="my-10" />

          <section>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">News timeline</h2>
            <ul className="mt-4 space-y-6 border-l border-[var(--border)] pl-6">
              {timeline.map((n) => (
                <li key={n.id} className="relative">
                  <span className="absolute -left-[25px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-[var(--background)]" />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {formatRelativeTime(n.publishedAt)}, {n.category}
                  </p>
                  <Link href={`/news/${n.slug}`} className="mt-1 block font-medium hover:text-primary">
                    {n.title}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">{n.summary}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="w-full flex-shrink-0 space-y-6 lg:w-80">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--foreground)]">Founder</h2>
            <p className="mt-2 font-medium text-[var(--foreground)]">{startup.founder.name}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{startup.founder.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{startup.founder.bio}</p>
          </div>
          <AdSlot variant="sidebar" />
        </aside>
      </div>
    </div>
  );
}
