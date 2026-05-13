import type { Metadata } from "next";
import Link from "next/link";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";
import { SubmitStartupForm } from "./submit-startup-form";

export const metadata: Metadata = pageMetadata({
  title: "Submit a startup profile",
  description:
    "Request a new listing or update your company profile on StartupUpdate. We review submissions before publication.",
  path: "/submit",
  keywords: mergeKeywords("submit startup", "company listing", "profile update", "South Asia founders"),
});

export default function SubmitPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Submit a startup</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Request a profile or update your company listing. We review every submission before it goes live.
        </p>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          Need to send a <strong className="font-medium text-[var(--foreground)]">news story</strong> instead?{" "}
          <Link href="/submit/news" className="font-medium text-primary underline underline-offset-2">
            Submit Startup News
          </Link>
        </p>
      </header>

      <SubmitStartupForm />
    </div>
  );
}
