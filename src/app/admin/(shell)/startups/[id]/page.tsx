import Link from "next/link";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { StartupModel } from "@/lib/db/models";
import { EditStartupForm } from "@/components/admin/edit-startup-form";

export default async function EditStartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isMongoConfigured() || !mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectMongo();
  const s = await StartupModel.findById(id).lean();
  if (!s) notFound();

  const fundingJson = JSON.stringify((s.funding as unknown[]) ?? [], null, 2);
  const founder = s.founder as { name: string; role: string; bio: string; linkedIn?: string };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit startup</h1>
        <Link href="/admin/startups" className="text-sm text-[var(--muted-foreground)] hover:underline">
          ← Back
        </Link>
      </div>
      <EditStartupForm
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
