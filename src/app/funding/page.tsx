import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { getStartups } from "@/lib/content/repository";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";

const pageDesc =
  "Seed through Series B and grants: funding rounds across tracked South Asia startups, sortable by date and amount.";

export const metadata: Metadata = pageMetadata({
  title: "Startup funding tracker (rounds & investors)",
  description: pageDesc,
  path: "/funding",
  keywords: mergeKeywords("funding rounds", "investors", "Seed", "Series B", "venture capital South Asia"),
});

export default async function FundingPage() {
  const startups = await getStartups();
  const rows = startups.flatMap((s) =>
    s.funding.map((r) => ({
      startup: s.name,
      slug: s.slug,
      ...r,
    })),
  );

  rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Funding tracker</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted-foreground)]">
          Seed through Series B, grants and strategic rounds across South Asia. Pair with{" "}
          <Link href="/news?category=Funding" className="font-medium text-primary hover:underline">
            funding news
          </Link>{" "}
          for context.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3 font-medium">Startup</th>
              <th className="px-4 py-3 font-medium">Round</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Lead / investors</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.slug}-${r.round}-${r.date}`} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <Link href={`/startups/${r.slug}`} className="font-medium hover:text-primary">
                    {r.startup}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[var(--foreground)]">{r.round}</td>
                <td className="px-4 py-3 text-[var(--foreground)]">{r.amount}</td>
                <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.date}</td>
                <td className="max-w-xs px-4 py-3 text-[var(--muted-foreground)]">
                  {r.investors.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <AdSlot variant="in-feed" />
        <AdSlot variant="article-end" />
      </div>
    </div>
  );
}
