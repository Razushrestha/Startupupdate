"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateStartup, type ActionState } from "@/app/admin/actions";

const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Grant"] as const;

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

type Initial = {
  slug: string;
  name: string;
  country: string;
  sector: string;
  stage: (typeof stages)[number];
  description: string;
  mission: string;
  vision: string;
  brandLogoUrl: string;
  logoLetter: string;
  engagementScore: number;
  founderName: string;
  founderRole: string;
  founderBio: string;
  founderLinkedIn: string;
  fundingJson: string;
};

export function EditStartupForm({ id, initial }: { id: string; initial: Initial }) {
  const bound = updateStartup.bind(null, id);
  const [state, action] = useActionState(bound, undefined as ActionState | undefined);

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Slug</span>
          <input name="slug" required defaultValue={initial.slug} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Name</span>
          <input name="name" required defaultValue={initial.name} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Country</span>
          <input name="country" required defaultValue={initial.country} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Sector</span>
          <input name="sector" required defaultValue={initial.sector} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Stage</span>
          <select name="stage" required defaultValue={initial.stage} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2">
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Description</span>
        <textarea name="description" rows={2} defaultValue={initial.description} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Mission</span>
        <textarea name="mission" rows={2} defaultValue={initial.mission} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Vision</span>
        <textarea name="vision" rows={2} defaultValue={initial.vision} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Logo letter</span>
          <input name="logoLetter" maxLength={3} defaultValue={initial.logoLetter} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Engagement (0-100)</span>
          <input name="engagementScore" type="number" defaultValue={initial.engagementScore} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Brand logo URL</span>
          <input name="brandLogoUrl" defaultValue={initial.brandLogoUrl} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Founder name</span>
          <input name="founderName" required defaultValue={initial.founderName} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Founder role</span>
          <input name="founderRole" required defaultValue={initial.founderRole} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Founder bio</span>
        <textarea name="founderBio" rows={2} defaultValue={initial.founderBio} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Founder LinkedIn</span>
        <input name="founderLinkedIn" defaultValue={initial.founderLinkedIn} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Funding (JSON array)</span>
        <textarea name="fundingJson" rows={6} defaultValue={initial.fundingJson} className="mt-1 w-full font-mono text-xs rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      {state && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
      {state?.ok && <p className="text-sm text-emerald-600">Saved.</p>}
      <SubmitBtn label="Save changes" />
    </form>
  );
}
