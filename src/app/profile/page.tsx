import type { Metadata } from "next";
import Link from "next/link";
import { mergeKeywords, pageMetadata } from "@/lib/seo-config";

export const metadata: Metadata = pageMetadata({
  title: "Your profile & saved startups",
  description:
    "Bookmark companies, manage a reading list, and unlock founder tools when authentication is connected to StartupUpdate.",
  path: "/profile",
  keywords: mergeKeywords("user profile", "bookmarks", "reading list", "account"),
});

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--muted)] text-2xl font-bold text-primary">
        You
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[var(--foreground)]">Profile</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Saved startups, reading list, and founder tools. Connect auth to personalize this hub.
      </p>
      <div className="mt-8 space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-left text-sm text-[var(--muted-foreground)]">
        <p className="font-medium text-[var(--foreground)]">Coming soon</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Bookmarked companies and stories</li>
          <li>Custom alerts by sector or country</li>
          <li>Founder verification badge</li>
        </ul>
      </div>
      <Link
        href="/submit"
        className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Submit an update
      </Link>
    </div>
  );
}
