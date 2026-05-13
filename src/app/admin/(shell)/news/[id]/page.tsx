import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { NewsModel, StartupModel } from "@/lib/db/models";
import { NewsEditorForm } from "@/components/admin/news-editor-form";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isMongoConfigured() || !mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectMongo();
  const [n, startups] = await Promise.all([
    NewsModel.findById(id).lean(),
    StartupModel.find().sort({ name: 1 }).select("name").lean(),
  ]);
  if (!n) notFound();

  const options = startups.map((s) => ({
    id: (s._id as mongoose.Types.ObjectId).toString(),
    name: s.name as string,
  }));

  const startupId = (n.startupId as mongoose.Types.ObjectId).toString();
  const published = n.publishedAt instanceof Date ? n.publishedAt : new Date(String(n.publishedAt));
  const publishedLocal = published.toISOString().slice(0, 16);
  const body = Array.isArray(n.body) ? (n.body as string[]).join("\n\n") : "";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit article</h1>
        <Link href="/admin/news" className="text-sm text-[var(--muted-foreground)] hover:underline">
          ← Back
        </Link>
      </div>
      <NewsEditorForm
        mode="edit"
        id={id}
        startupOptions={options}
        initial={{
          slug: n.slug,
          title: n.title,
          summary: n.summary,
          category: n.category as "Funding" | "Launch" | "Tech" | "Events",
          publishedAt: publishedLocal,
          startupId,
          trending: Boolean(n.trending),
          coverImage: n.coverImage,
          imageAlt: n.imageAlt ?? "",
          body,
        }}
      />
    </div>
  );
}
