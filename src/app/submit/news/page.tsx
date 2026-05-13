import type { Metadata } from "next";
import Link from "next/link";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";
import { SubmitNewsForm } from "../submit-news-form";

export const metadata: Metadata = pageMetadata({
  title: "Submit startup news",
  description:
    "Pitch funding announcements, launches, and milestones for StartupUpdate’s editorial desk. We verify stories before publishing.",
  path: "/submit/news",
  keywords: mergeKeywords("press release", "startup news tip", "funding announcement", "South Asia tech news"),
});

export default function SubmitNewsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Submit startup news</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Funding, launches, product milestones, and events. Help our desk verify and cover what matters.
        </p>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          Want to <strong className="font-medium text-[var(--foreground)]">list or update a company profile</strong>?{" "}
          <Link href="/submit" className="font-medium text-primary underline underline-offset-2">
            Submit Startup
          </Link>
        </p>
      </header>

      <SubmitNewsForm />
    </div>
  );
}
