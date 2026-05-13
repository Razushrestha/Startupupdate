import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { InsightModel, NewsModel, StartupModel } from "@/lib/db/models";
import Link from "next/link";

export default async function AdminDashboard() {
  let startupCount = 0;
  let newsCount = 0;
  let insightCount = 0;

  if (isMongoConfigured()) {
    await connectMongo();
    [startupCount, newsCount, insightCount] = await Promise.all([
      StartupModel.countDocuments(),
      NewsModel.countDocuments(),
      InsightModel.countDocuments(),
    ]);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Content admin</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">
        Manage startups, news, and long-form insights consumed by the public site. Server actions write to MongoDB and
        revalidate pages.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-3">
        <li className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Startups</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{startupCount}</p>
          <Link href="/admin/startups" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Manage →
          </Link>
        </li>
        <li className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">News</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{newsCount}</p>
          <Link href="/admin/news" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Manage →
          </Link>
        </li>
        <li className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Insights</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{insightCount}</p>
          <Link href="/admin/insights" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Manage →
          </Link>
        </li>
      </ul>

      <section className="mt-10 rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-6 text-sm text-[var(--muted-foreground)]">
        <p className="font-medium text-[var(--foreground)]">Security</p>
        <p className="mt-2">
          Sessions use a signed JWT cookie configured with{" "}
          <code className="rounded bg-[var(--card)] px-1">ADMIN_SESSION_SECRET</code>. Protect{" "}
          <code className="rounded bg-[var(--card)] px-1">ADMIN_PASSWORD</code> like any production secret.
        </p>
      </section>
    </div>
  );
}
