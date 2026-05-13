"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createNews, updateNews, type ActionState } from "@/app/admin/actions";

const categories = ["Funding", "Launch", "Tech", "Events"] as const;

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

type Options = { id: string; name: string }[];

type NewsInitial = {
  slug: string;
  title: string;
  summary: string;
  category: (typeof categories)[number];
  publishedAt: string;
  startupId: string;
  trending: boolean;
  coverImage: string;
  imageAlt: string;
  body: string;
};

export function NewsEditorForm({
  mode,
  id,
  startupOptions,
  initial,
}: {
  mode: "create" | "edit";
  id?: string;
  startupOptions: Options;
  initial?: NewsInitial;
}) {
  const actionFn = mode === "edit" && id ? updateNews.bind(null, id) : createNews;
  const [state, action] = useActionState(actionFn, undefined as ActionState | undefined);

  const d = initial;

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Slug</span>
          <input name="slug" required defaultValue={d?.slug} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Category</span>
          <select name="category" required defaultValue={d?.category ?? "Funding"} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Title</span>
        <input name="title" required defaultValue={d?.title} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Summary</span>
        <textarea name="summary" required rows={2} defaultValue={d?.summary} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Published at</span>
          <input name="publishedAt" type="datetime-local" required defaultValue={d?.publishedAt} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--foreground)]">Startup</span>
          <select name="startupId" required defaultValue={d?.startupId} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2">
            <option value="">Select…</option>
            {startupOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input name="trending" type="checkbox" defaultChecked={d?.trending} className="rounded border-[var(--border)]" />
        Trending
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Cover image URL</span>
        <input name="coverImage" required defaultValue={d?.coverImage} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Image alt</span>
        <input name="imageAlt" defaultValue={d?.imageAlt} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="text-[var(--foreground)]">Body (paragraphs separated by blank line)</span>
        <textarea name="body" rows={12} defaultValue={d?.body} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-2" />
      </label>
      {state && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
      {state?.ok && <p className="text-sm text-emerald-600">Saved.</p>}
      <SubmitBtn label={mode === "create" ? "Publish article" : "Save changes"} />
    </form>
  );
}
