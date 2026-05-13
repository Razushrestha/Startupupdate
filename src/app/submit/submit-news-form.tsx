"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AdSlot } from "@/components/ads/ad-slot";
import { submitNewsPitch, type SubmitState } from "@/app/submit/actions";

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] outline-none ring-primary/20 placeholder:text-[var(--muted-foreground)] focus:ring-2";

function SubmitNewsButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? "Sending…" : "Submit news for review"}
    </button>
  );
}

export function SubmitNewsForm() {
  const [state, formAction] = useActionState(submitNewsPitch, undefined as SubmitState | undefined);

  return (
    <>
      <form
        action={formAction}
        className="relative space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm md:p-8"
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          Share a story, funding note, or launch we should cover. Include a source link when possible so we can verify
          quickly.
        </p>

        {state?.ok === true && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
            Thanks — we saved your tip. Editors may reach out via your contact email if we need more detail.
          </p>
        )}
        {state?.ok === false && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">
            {state.message}
          </p>
        )}

        <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="news_website_hp">Leave this empty</label>
          <input id="news_website_hp" type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor="news-headline" className="text-sm font-medium text-[var(--foreground)]">
            Headline <span className="text-red-600">*</span>
          </label>
          <input
            id="news-headline"
            name="headline"
            required
            className={inputClass}
            placeholder="Short, factual title"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="news-category" className="text-sm font-medium text-[var(--foreground)]">
              Category <span className="text-red-600">*</span>
            </label>
            <select id="news-category" name="category" required className={inputClass} defaultValue="">
              <option value="" disabled>
                Select
              </option>
              <option value="Funding">Funding</option>
              <option value="Launch">Launch</option>
              <option value="Tech">Tech</option>
              <option value="Events">Events</option>
            </select>
          </div>
          <div>
            <label htmlFor="news-company" className="text-sm font-medium text-[var(--foreground)]">
              Company in the story
            </label>
            <input
              id="news-company"
              name="companyName"
              className={inputClass}
              placeholder="Startup or org name (optional)"
            />
          </div>
        </div>

        <div>
          <label htmlFor="news-summary" className="text-sm font-medium text-[var(--foreground)]">
            Summary <span className="text-red-600">*</span>
          </label>
          <textarea
            id="news-summary"
            name="summary"
            rows={5}
            required
            className={inputClass}
            placeholder="Lead with the facts: who, what, amount or milestone, where, when."
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="news-source" className="text-sm font-medium text-[var(--foreground)]">
              Source URL
            </label>
            <input id="news-source" name="sourceUrl" type="url" className={inputClass} placeholder="Press, blog, or filing" />
          </div>
          <div>
            <label htmlFor="news-email" className="text-sm font-medium text-[var(--foreground)]">
              Contact email <span className="text-red-600">*</span>
            </label>
            <input
              id="news-email"
              name="email"
              type="email"
              required
              className={inputClass}
              placeholder="We may follow up for clarification"
            />
          </div>
        </div>

        <div>
          <label htmlFor="news-notes" className="text-sm font-medium text-[var(--foreground)]">
            Notes for editors (optional)
          </label>
          <textarea
            id="news-notes"
            name="editorNotes"
            rows={3}
            className={inputClass}
            placeholder="Embargo, spokespeople, or context"
          />
        </div>

        <div>
          <label htmlFor="news-file" className="text-sm font-medium text-[var(--foreground)]">
            Attachments (optional)
          </label>
          <input
            id="news-file"
            name="files"
            type="file"
            accept="image/*,.pdf"
            multiple
            className="mt-2 block w-full text-sm text-[var(--muted-foreground)]"
          />
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            File uploads are not stored server-side yet; we only log that attachments were included.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SubmitNewsButton />
          <p className="text-xs text-[var(--muted-foreground)]">You will get a confirmation when the tip is saved.</p>
        </div>
      </form>

      <AdSlot variant="article-end" className="mt-10" />
    </>
  );
}
