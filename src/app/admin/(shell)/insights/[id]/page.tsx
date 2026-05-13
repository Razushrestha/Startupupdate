import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { InsightModel } from "@/lib/db/models";
import { EditInsightForm } from "@/components/admin/edit-insight-form";

export default async function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isMongoConfigured() || !mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectMongo();
  const row = await InsightModel.findById(id).lean();
  if (!row) notFound();

  const published = row.publishedAt instanceof Date ? row.publishedAt : new Date(String(row.publishedAt));
  const publishedLocal = published.toISOString().slice(0, 16);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit insight</h1>
        <Link href="/admin/insights" className="text-sm text-[var(--muted-foreground)] hover:underline">
          ← Back
        </Link>
      </div>
      <EditInsightForm
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
