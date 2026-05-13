import Link from "next/link";
import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { StartupModel } from "@/lib/db/models";
import { NewsEditorForm } from "@/components/admin/news-editor-form";

export default async function NewNewsPage() {
  if (!isMongoConfigured()) {
    return <p className="text-sm text-[var(--muted-foreground)]">Configure MongoDB first.</p>;
  }
  await connectMongo();
  const startups = await StartupModel.find().sort({ name: 1 }).select("name").lean();
  const options = startups.map((s) => ({
    id: (s._id as mongoose.Types.ObjectId).toString(),
    name: s.name as string,
  }));

  return (
    <div className="pb-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">News</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">New article</h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">
            Draft the story, upload a cover, and publish when ready — changes sync to the public news pages.
          </p>
        </div>
        <Link
          href="/admin/news"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)]"
        >
          ← Back to news
        </Link>
      </div>
      <NewsEditorForm mode="create" startupOptions={options} />
    </div>
  );
}
