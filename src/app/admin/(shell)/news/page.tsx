import Link from "next/link";
import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { NewsModel } from "@/lib/db/models";
import { deleteNews } from "@/app/admin/actions";

export default async function AdminNewsPage() {
  if (!isMongoConfigured()) {
    return <p className="text-sm text-[var(--muted-foreground)]">Connect MongoDB to manage news.</p>;
  }
  await connectMongo();
  const rows = await NewsModel.find().sort({ publishedAt: -1 }).lean();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">News</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Articles shown on home, news, and startup timelines.</p>
        </div>
        <Link href="/admin/news/new" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          Add article
        </Link>
      </div>
      <ul className="mt-8 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--card)]">
        {rows.length === 0 && (
          <li className="px-4 py-8 text-sm text-[var(--muted-foreground)]">No articles yet.</li>
        )}
        {rows.map((n) => {
          const id = (n._id as mongoose.Types.ObjectId).toString();
          return (
            <li key={id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium text-[var(--foreground)]">{n.title}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">{n.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/news/${n.slug}`} className="text-sm text-primary hover:underline">
                  View
                </Link>
                <Link href={`/admin/news/${id}`} className="text-sm font-medium hover:underline">
                  Edit
                </Link>
                <form action={deleteNews}>
                  <input type="hidden" name="id" value={id} />
                  <button type="submit" className="text-sm text-red-600 hover:underline dark:text-red-400">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
