"use client";

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createNews, updateNews, type ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

const categories = ["Funding", "Launch", "Tech", "Events"] as const;

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

type Options = { id: string; name: string }[];

export type NewsInitial = {
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

function splitIntoParagraphs(text: string | undefined): string[] {
  if (!text?.trim()) return [""];
  const chunks = text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  return chunks.length > 0 ? chunks : [""];
}

type ParaBlock = { id: string; text: string };

function blocksFromBody(body: string | undefined, prefix: string): ParaBlock[] {
  const texts = splitIntoParagraphs(body);
  return texts.map((text, i) => ({ id: `${prefix}:${i}`, text }));
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
  const blockPrefix = mode === "edit" && id ? id : "new";

  const [coverUrl, setCoverUrl] = useState(d?.coverImage ?? "");
  const [paragraphs, setParagraphs] = useState<ParaBlock[]>(() => blocksFromBody(d?.body, blockPrefix));
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prefix = mode === "edit" && id ? id : "new";
    setParagraphs(blocksFromBody(d?.body, prefix));
    setCoverUrl(d?.coverImage ?? "");
  }, [d?.body, d?.coverImage, id, mode]);

  const joinedBody = useMemo(
    () =>
      paragraphs
        .map((p) => p.text.trim())
        .filter(Boolean)
        .join("\n\n"),
    [paragraphs],
  );

  const filledParagraphCount = useMemo(() => paragraphs.filter((p) => p.text.trim()).length, [paragraphs]);

  const setParagraphText = useCallback((pid: string, value: string) => {
    setParagraphs((prev) => prev.map((p) => (p.id === pid ? { ...p, text: value } : p)));
  }, []);

  const addParagraph = useCallback(() => {
    const prefix = mode === "edit" && id ? id : "new";
    setParagraphs((prev) => [...prev, { id: `${prefix}:x:${crypto.randomUUID()}`, text: "" }]);
  }, [mode, id]);

  const removeParagraph = useCallback((pid: string) => {
    setParagraphs((prev) => (prev.length <= 1 ? prev : prev.filter((p) => p.id !== pid)));
  }, []);

  const uploadFile = async (file: File) => {
    setUploadErr(null);
    setUploadBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/news-cover", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setUploadErr(data.error ?? "Upload failed");
        return;
      }
      if (data.url) setCoverUrl(data.url);
    } catch {
      setUploadErr("Network error — try again.");
    } finally {
      setUploadBusy(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) void uploadFile(f);
  };

  const coverPreviewOk = coverUrl.trim().length > 0;

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-8 pb-16">
      <FormSection title="Article details" description="Slug, category, title, and summary shown in listings and SEO.">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Slug
            <input name="slug" required defaultValue={d?.slug} placeholder="seed-round-acme" className={field} />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Category
            <select name="category" required defaultValue={d?.category ?? "Funding"} className={field}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Title
          <input name="title" required defaultValue={d?.title} placeholder="Headline readers see first" className={field} />
        </label>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Summary
          <textarea
            name="summary"
            required
            rows={3}
            defaultValue={d?.summary}
            placeholder="One or two sentences — appears under the title."
            className={cn(field, "resize-y min-h-[5rem]")}
          />
        </label>
      </FormSection>

      <FormSection title="Publishing" description="Link this article to a startup and control visibility.">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Published at
            <input name="publishedAt" type="datetime-local" required defaultValue={d?.publishedAt} className={field} />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Startup
            <select name="startupId" required defaultValue={d?.startupId} className={field}>
              <option value="">Select…</option>
              {startupOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_35%,transparent)] px-4 py-3 text-sm font-medium text-[var(--foreground)] dark:bg-[color-mix(in_oklch,var(--muted)_22%,transparent)]">
          <input name="trending" type="checkbox" defaultChecked={d?.trending} className="h-4 w-4 rounded border-[var(--border)] text-primary focus:ring-primary/30" />
          Trending — highlight on homepage carousels
        </label>
      </FormSection>

      <FormSection title="Cover image" description="Upload a file stored on this server, or paste an external image URL.">
        <input type="hidden" name="coverImage" value={coverUrl} />
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileRef.current?.click();
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_40%,transparent)] px-6 py-10 text-center transition-colors hover:border-primary/35 hover:bg-[color-mix(in_oklch,var(--muted)_55%,transparent)] dark:bg-[color-mix(in_oklch,var(--muted)_25%,transparent)]",
            uploadBusy && "pointer-events-none opacity-60",
          )}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void uploadFile(f);
              e.target.value = "";
            }}
          />
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {uploadBusy ? "Uploading…" : "Drop an image here or click to browse"}
          </span>
          <span className="mt-2 text-xs text-[var(--muted-foreground)]">JPEG, PNG, WebP, or GIF · max 5 MB</span>
        </div>

        {uploadErr ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
            {uploadErr}
          </p>
        ) : null}

        <label className="block text-sm font-medium text-[var(--foreground)]">
          Or paste image URL
          <input
            type="text"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://… or /uploads/news/…"
            className={field}
          />
        </label>

        <label className="block text-sm font-medium text-[var(--foreground)]">
          Image alt (accessibility)
          <input name="imageAlt" defaultValue={d?.imageAlt} placeholder="Describe the hero image for screen readers" className={field} />
        </label>

        {coverPreviewOk ? (
          <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)]">
            <div className="relative aspect-[2/1] w-full max-h-52">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary preview URLs */}
              <img src={coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <p className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--muted-foreground)]">Preview · saved URL above</p>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">Add an upload or URL to see a preview.</p>
        )}
      </FormSection>

      <FormSection
        title="Article body"
        description="Each block becomes one paragraph on the site. Add sections as you go — blank lines between blocks are preserved when published."
      >
        <input type="hidden" name="body" value={joinedBody} readOnly />

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="text-sm text-[var(--muted-foreground)]">
            <span className="tabular-nums font-medium text-[var(--foreground)]">{filledParagraphCount}</span> paragraph
            {filledParagraphCount === 1 ? "" : "s"} with text
            <span className="mx-1.5 text-[var(--border)]">·</span>
            <span className="text-[var(--muted-foreground)]">empty blocks are skipped</span>
          </p>
          <button
            type="button"
            onClick={addParagraph}
            className="text-sm font-semibold text-primary transition hover:text-primary/80 focus-visible:outline-none focus-visible:underline"
          >
            + Add paragraph
          </button>
        </div>

        <div className="mt-8 space-y-10">
          {paragraphs.map((para, index) => (
            <div key={para.id} className="relative">
              {index > 0 ? (
                <div className="absolute -top-5 left-0 right-0 h-px bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)]" aria-hidden />
              ) : null}
              <div className="flex items-start gap-4">
                <span
                  className="select-none pt-2.5 text-[13px] tabular-nums font-medium text-[var(--muted-foreground)]"
                  aria-hidden
                >
                  {index + 1}.
                </span>
                <div className="min-w-0 flex-1">
                  {paragraphs.length > 1 ? (
                    <div className="mb-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeParagraph(para.id)}
                        className="text-xs font-medium text-[var(--muted-foreground)] transition hover:text-red-600 dark:hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                  <textarea
                    value={para.text}
                    onChange={(e) => setParagraphText(para.id, e.target.value)}
                    rows={5}
                    placeholder="Write this section… Start a new block below for the next idea."
                    aria-label={`Paragraph ${index + 1}`}
                    className="w-full min-h-[7.5rem] resize-y bg-transparent py-1 text-[15px] leading-[1.65] text-[var(--foreground)] outline-none transition-[box-shadow] placeholder:text-[var(--muted-foreground)] focus-visible:shadow-[inset_0_-1px_0_0_color-mix(in_oklch,var(--primary)_55%,transparent)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          {state && !state.ok ? (
            <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
              {state.message}
            </p>
          ) : null}
          {state?.ok ? (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Saved successfully.</p>
          ) : null}
        </div>
        <SubmitBtn label={mode === "create" ? "Publish article" : "Save changes"} />
      </div>
    </form>
  );
}
