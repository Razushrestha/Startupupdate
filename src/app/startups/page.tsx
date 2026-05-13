import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { StartupsHero } from "@/components/startups/startups-hero";
import { getStartups } from "@/lib/content/repository";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";
import { StartupDirectory } from "./startup-directory";

const pageDesc =
  "Explore tracked startups by country, sector, and stage. Profiles include mission, vision, funding history, and engagement signals.";

export const metadata: Metadata = pageMetadata({
  title: "Startup directory (South Asia companies)",
  description: pageDesc,
  path: "/startups",
  keywords: mergeKeywords("startup directory", "company profiles", "Seed", "Series A", "by country", "by sector"),
});

function getDayPeriod(): "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default async function StartupsPage() {
  const startups = await getStartups();
  const countryCount = new Set(startups.map((s) => s.country)).size;

  return (
    <div className="w-full">
      <StartupsHero count={startups.length} countryCount={countryCount} dayPeriod={getDayPeriod()} />

      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          Claiming and submissions are coming. For now, every card is an invitation to understand how a team talks
          about its own work. That honesty is the engagement we care about.
        </p>
        <AdSlot variant="sidebar" className="hidden w-full min-h-[120px] shrink-0 lg:block lg:w-72" />
      </div>

      <StartupDirectory startups={startups} />

      <AdSlot variant="in-feed" className="mt-12" />
    </div>
  );
}
