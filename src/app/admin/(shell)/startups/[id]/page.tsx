import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { StartupModel } from "@/lib/db/models";
import { StartupEditorForm } from "@/components/admin/startup-editor-form";

export default async function EditStartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isMongoConfigured() || !mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectMongo();
  const s = await StartupModel.findById(id).lean();
  if (!s) notFound();

  const fundingJson = JSON.stringify((s.funding as unknown[]) ?? [], null, 2);
  const founder = s.founder as { name: string; role: string; bio: string; linkedIn?: string };

  return (
    <div className="pb-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Directory</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)]">Edit startup</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            Update listing copy, logo, and founder details — slug changes affect public URLs immediately.
          </p>
        </div>
        <Link
          href="/admin/startups"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)]"
        >
          ← Back to startups
        </Link>
      </div>
      <StartupEditorForm
        mode="edit"
        id={id}
        initial={{
          slug: s.slug,
          name: s.name,
          country: s.country,
          sector: s.sector,
          stage: s.stage as "Pre-seed" | "Seed" | "Series A" | "Series B" | "Grant",
          description: s.description ?? "",
          mission: s.mission ?? "",
          vision: s.vision ?? "",
          brandLogoUrl: s.brandLogoUrl ?? "",
          logoLetter: s.logoLetter ?? "?",
          engagementScore: s.engagementScore ?? 50,
          founderName: founder.name,
          founderRole: founder.role,
          founderBio: founder.bio ?? "",
          founderLinkedIn: founder.linkedIn ?? "",
          fundingJson,
        }}
      />
    </div>
  );
}
