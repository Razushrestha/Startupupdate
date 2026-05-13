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
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">New article</h1>
        <Link href="/admin/news" className="text-sm text-[var(--muted-foreground)] hover:underline">
          ← Back
        </Link>
      </div>
      <NewsEditorForm mode="create" startupOptions={options} />
    </div>
  );
}
