"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { createInsight, updateInsight, type ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

export const insightMoodKinds = ["tension", "hope", "clarity", "care"] as const;

type MoodKind = (typeof insightMoodKinds)[number];

const field =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] shadow-[inset_0_1px_2px_color-mix(in_oklch,var(--foreground)_6%,transparent)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-primary/45 focus:ring-2 focus:ring-primary/20 dark:bg-[color-mix(in_oklch,var(--background)_94%,transparent)]";

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_3px_color-mix(in_oklch,var(--foreground)_8%,transparent)] dark:shadow-none">
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_45%,transparent)] px-6 py-4 dark:bg-[color-mix(in_oklch,var(--muted)_28%,transparent)] sm:px-8">
        <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)]">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p> : null}
      </div>
      <div className="space-y-5 px-6 py-6 sm:space-y-6 sm:px-8 sm:py-8">{children}</div>
    </section>
  );
}

function moodBadge(kind: MoodKind) {
  const styles: Record<MoodKind, string> = {
    tension:
      "border border-amber-200/90 bg-amber-50 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/45 dark:text-amber-100",
    hope:
      "border border-emerald-200/90 bg-emerald-50 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/45 dark:text-emerald-100",
    clarity:
      "border border-sky-200/90 bg-sky-50 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/45 dark:text-sky-100",
    care:
      "border border-rose-200/90 bg-rose-50 text-rose-950 dark:border-rose-900/70 dark:bg-rose-950/45 dark:text-rose-100",
  };
  const labels: Record<MoodKind, string> = {
    tension: "Tension",
    hope: "Hope",
    clarity: "Clarity",
    care: "Care",
  };
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[kind],
      )}
    >
      {labels[kind]}
    </span>
  );
}

export type InsightFormInitial = {
  slug: string;
  title: string;
  dek: string;
  readTime: string;
  author: string;
  publishedAt: string;
  feeling: string;
  mood: string;
  moodKind: MoodKind;
  pullQuote: string;
};

export function InsightEditorForm({
  mode,
  id,
  initial,
  defaultPublishedAt,
}: {
  mode: "create" | "edit";
  id?: string;
  initial?: InsightFormInitial;
  /** `datetime-local` default when creating (ISO slice). */
  defaultPublishedAt?: string;
}) {
  const actionFn = mode === "edit" && id ? updateInsight.bind(null, id) : createInsight;
  const [state, action] = useActionState(actionFn, undefined as ActionState | undefined);

  const d = initial;
  const [moodKindPreview, setMoodKindPreview] = useState<MoodKind>(d?.moodKind ?? "tension");

  useEffect(() => {
    if (d?.moodKind) setMoodKindPreview(d.moodKind);
  }, [d?.moodKind]);

  const publishedDefault = d?.publishedAt ?? defaultPublishedAt ?? "";

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-8 pb-16">
      <FormSection
        title="Publishing"
        description="Slug becomes /insights/[slug]. Publish time controls ordering on the public index."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Slug
            <input name="slug" required defaultValue={d?.slug} placeholder="founder-burnout-notes" className={field} />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Published at
            <input name="publishedAt" type="datetime-local" required defaultValue={publishedDefault} className={field} />
          </label>
        </div>
      </FormSection>

      <FormSection title="Headline" description="Title and deck appear on cards and at the top of the piece.">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Title
          <input name="title" required defaultValue={d?.title} placeholder="Readers see this first" className={field} />
        </label>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Deck <span className="font-normal text-[var(--muted-foreground)]">(subtitle)</span>
          <input
            name="dek"
            required
            defaultValue={d?.dek}
            placeholder="One line under the title — sets expectations."
            className={field}
          />
        </label>
      </FormSection>

      <FormSection
        title="Byline & presentation"
        description="Read time is display-only. Mood kind drives badge colors across the site."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Read time
            <input name="readTime" required defaultValue={d?.readTime} placeholder="8 min" className={field} />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Author
            <input name="author" required defaultValue={d?.author} placeholder="Editorial name" className={field} />
          </label>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Mood kind
              <select
                name="moodKind"
                required
                defaultValue={d?.moodKind ?? "tension"}
                onChange={(e) => setMoodKindPreview(e.target.value as MoodKind)}
                className={field}
              >
                {insightMoodKinds.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-xs text-[var(--muted-foreground)]">Preview</span>
              {moodBadge(moodKindPreview)}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Voice"
        description="Mood label is free text for display. Feeling hooks scanners; pull quote supports social previews."
      >
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Mood label
          <input
            name="mood"
            required
            defaultValue={d?.mood}
            placeholder="Late-night clarity"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Feeling <span className="font-normal text-[var(--muted-foreground)]">(hook)</span>
          <textarea
            name="feeling"
            required
            rows={4}
            defaultValue={d?.feeling}
            placeholder="Short emotional beat — leads the article body."
            className={cn(field, "resize-y min-h-[6rem] leading-relaxed")}
          />
        </label>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Pull quote
          <textarea
            name="pullQuote"
            required
            rows={3}
            defaultValue={d?.pullQuote}
            placeholder="A quotable line for cards and shares."
            className={cn(field, "resize-y min-h-[5rem] leading-relaxed")}
          />
        </label>
      </FormSection>

      <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {state && !state.ok ? (
            <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
              {state.message}
            </p>
          ) : null}
          {state?.ok ? (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {mode === "create" ? "Published to insights." : "Saved successfully."}
            </p>
          ) : null}
        </div>
        <SubmitBtn label={mode === "create" ? "Create insight" : "Save changes"} />
      </div>
    </form>
  );
}
