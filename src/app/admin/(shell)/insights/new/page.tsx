"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createInsight, type ActionState } from "@/app/admin/actions";

const moods = ["tension", "hope", "clarity", "care"] as const;

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

export default function NewInsightPage() {
  const [state, action] = useActionState(createInsight, undefined as ActionState | undefined);

  const nowLocal = new Date().toISOString().slice(0, 16);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">New insight</h1>
        <Link href="/admin/insights" className="text-sm text-[var(--muted-foreground)] hover:underline">
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
            <span className="text-[var(--foreground)]">Published at</span>
            <input name="publishedAt" type="datetime-local" required defaultValue={nowLocal} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Title</span>
          <input name="title" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Deck (subtitle)</span>
          <input name="dek" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Read time</span>
            <input name="readTime" placeholder="8 min" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Author</span>
            <input name="author" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--foreground)]">Mood kind</span>
            <select name="moodKind" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2">
              {moods.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Mood label</span>
          <input name="mood" placeholder="Late-night clarity" required className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Feeling (hook)</span>
          <textarea name="feeling" required rows={2} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Pull quote</span>
          <textarea name="pullQuote" required rows={2} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        {state && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
        {state?.ok && <p className="text-sm text-emerald-600">Saved.</p>}
        <SubmitBtn label="Create insight" />
      </form>
    </div>
  );
}
