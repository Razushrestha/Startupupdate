"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { createStartup, type ActionState } from "@/app/admin/actions";

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

export default function NewStartupPage() {
  const [state, action] = useActionState(createStartup, undefined as ActionState | undefined);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">New startup</h1>
        <Link href="/admin/startups" className="text-sm text-[var(--muted-foreground)] hover:underline">
          ← Back
        </Link>
      </div>
      <form action={action} className="max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Slug</span>
            <input name="slug" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Name</span>
            <input name="name" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Country</span>
            <input name="country" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Sector</span>
            <input name="sector" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Stage</span>
            <select name="stage" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2">
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
          <textarea name="description" rows={2} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Mission</span>
          <textarea name="mission" rows={2} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Vision</span>
          <textarea name="vision" rows={2} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Logo letter</span>
            <input name="logoLetter" maxLength={3} defaultValue="?" className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Engagement (0-100)</span>
            <input name="engagementScore" type="number" defaultValue={70} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Brand logo URL</span>
            <input name="brandLogoUrl" className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" placeholder="optional" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Founder name</span>
            <input name="founderName" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Founder role</span>
            <input name="founderRole" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Founder bio</span>
          <textarea name="founderBio" rows={2} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Founder LinkedIn</span>
          <input name="founderLinkedIn" className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Funding (JSON array)</span>
          <textarea
            name="fundingJson"
            rows={6}
            defaultValue="[]"
            placeholder='[{"round":"Seed","amount":"$3M","date":"2026-01-01","investors":["Fund A"]}]'
            className="mt-1 w-full font-mono text-xs rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2"
          />
        </label>
        {state && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
        {state?.ok && <p className="text-sm text-emerald-600">Saved. You can add news from the News tab.</p>}
        <SubmitBtn label="Create startup" />
      </form>
    </div>
  );
}
