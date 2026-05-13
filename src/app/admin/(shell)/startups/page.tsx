import Link from "next/link";
import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { StartupModel } from "@/lib/db/models";
import { deleteStartup } from "@/app/admin/actions";

export default async function AdminStartupsPage() {
  if (!isMongoConfigured()) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">
        Connect MongoDB to list startups. You can still open forms after configuring the database.
      </p>
    );
  }
  await connectMongo();
  const rows = await StartupModel.find().sort({ updatedAt: -1 }).lean();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Startups</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Slug must stay unique for public URLs.</p>
        </div>
        <Link
          href="/admin/startups/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Add startup
        </Link>
      </div>
      <ul className="mt-8 divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--card)]">
        {rows.length === 0 && (
          <li className="px-4 py-8 text-sm text-[var(--muted-foreground)]">No startups yet. Seed or create one.</li>
        )}
        {rows.map((s) => {
          const id = (s._id as mongoose.Types.ObjectId).toString();
          return (
            <li key={id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium text-[var(--foreground)]">{s.name}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">
                  {s.slug}, {s.country}, {s.sector}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/startups/${s.slug}`} className="text-sm text-primary hover:underline">
                  View
                </Link>
                <Link href={`/admin/startups/${id}`} className="text-sm font-medium hover:underline">
                  Edit
                </Link>
                <form action={deleteStartup}>
                  <input type="hidden" name="id" value={id} />
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                    title="Also removes news tied to this startup id"
                  >
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
