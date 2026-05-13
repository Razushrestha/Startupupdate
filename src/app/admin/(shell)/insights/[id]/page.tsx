import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { InsightModel } from "@/lib/db/models";
import { InsightEditorForm } from "@/components/admin/insight-editor-form";

export default async function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isMongoConfigured() || !mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectMongo();
  const row = await InsightModel.findById(id).lean();
  if (!row) notFound();

  const published = row.publishedAt instanceof Date ? row.publishedAt : new Date(String(row.publishedAt));
  const publishedLocal = published.toISOString().slice(0, 16);

  return (
    <div className="pb-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Editorial</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">Edit insight</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Adjust copy and mood metadata — slug changes affect live URLs immediately.
          </p>
        </div>
        <Link
          href="/admin/insights"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)]"
        >
          ← Back to insights
        </Link>
      </div>
      <InsightEditorForm
        mode="edit"
        id={id}
        initial={{
          slug: row.slug,
          title: row.title,
          dek: row.dek,
          readTime: row.readTime,
          author: row.author,
          publishedAt: publishedLocal,
          feeling: row.feeling,
          mood: row.mood,
          moodKind: row.moodKind as "tension" | "hope" | "clarity" | "care",
          pullQuote: row.pullQuote,
        }}
      />
    </div>
  );
}
