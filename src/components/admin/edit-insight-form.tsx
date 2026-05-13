"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateInsight, type ActionState } from "@/app/admin/actions";

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

type Initial = {
  slug: string;
  title: string;
  dek: string;
  readTime: string;
  author: string;
  publishedAt: string;
  feeling: string;
  mood: string;
  moodKind: (typeof moods)[number];
  pullQuote: string;
};

export function EditInsightForm({ id, initial }: { id: string; initial: Initial }) {
  const bound = updateInsight.bind(null, id);
  const [state, action] = useActionState(bound, undefined as ActionState | undefined);

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Slug</span>
          <input name="slug" required defaultValue={initial.slug} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Published at</span>
          <input name="publishedAt" type="datetime-local" required defaultValue={initial.publishedAt} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Title</span>
        <input name="title" required defaultValue={initial.title} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Deck</span>
        <input name="dek" required defaultValue={initial.dek} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Read time</span>
          <input name="readTime" required defaultValue={initial.readTime} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Author</span>
          <input name="author" required defaultValue={initial.author} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Mood kind</span>
          <select name="moodKind" required defaultValue={initial.moodKind} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2">
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
        <input name="mood" required defaultValue={initial.mood} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Feeling</span>
        <textarea name="feeling" required rows={2} defaultValue={initial.feeling} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Pull quote</span>
        <textarea name="pullQuote" required rows={2} defaultValue={initial.pullQuote} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      {state && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
      {state?.ok && <p className="text-sm text-emerald-600">Saved.</p>}
      <SubmitBtn label="Save changes" />
    </form>
  );
}
