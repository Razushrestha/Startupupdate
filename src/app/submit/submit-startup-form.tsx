"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AdSlot } from "@/components/ads/ad-slot";
import { submitStartupPitch, type SubmitState } from "@/app/submit/actions";

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] outline-none ring-primary/20 placeholder:text-[var(--muted-foreground)] focus:ring-2";

function SubmitStartupButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? "Sending…" : "Submit startup for review"}
    </button>
  );
}

export function SubmitStartupForm() {
  const [state, formAction] = useActionState(submitStartupPitch, undefined as SubmitState | undefined);

  return (
    <>
      <form
        action={formAction}
        className="relative space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm md:p-8"
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          Tell us about the company so we can review a profile listing, visibility on the map, and future news tied to
          your startup.
        </p>

        {state?.ok === true && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
            Thanks — we received your pitch. Our team will follow up from the contact email you provided.
          </p>
        )}
        {state?.ok === false && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">
            {state.message}
          </p>
        )}

        <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="website_hp">Leave this empty</label>
          <input id="website_hp" type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="su-name" className="text-sm font-medium text-[var(--foreground)]">
              Company / startup name <span className="text-red-600">*</span>
            </label>
            <input id="su-name" name="companyName" required className={inputClass} placeholder="Registered or trading name" />
          </div>
          <div>
            <label htmlFor="su-country" className="text-sm font-medium text-[var(--foreground)]">
              Country <span className="text-red-600">*</span>
            </label>
            <input id="su-country" name="country" required className={inputClass} placeholder="e.g. Bangladesh" />
          </div>
          <div>
            <label htmlFor="su-sector" className="text-sm font-medium text-[var(--foreground)]">
              Sector <span className="text-red-600">*</span>
            </label>
            <input id="su-sector" name="sector" required className={inputClass} placeholder="e.g. Fintech" />
          </div>
          <div>
            <label htmlFor="su-stage" className="text-sm font-medium text-[var(--foreground)]">
              Stage
            </label>
            <select id="su-stage" name="stage" className={inputClass} defaultValue="">
              <option value="">Select</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Grant">Grant</option>
            </select>
          </div>
          <div>
            <label htmlFor="su-site" className="text-sm font-medium text-[var(--foreground)]">
              Website
            </label>
            <input id="su-site" name="website" type="url" className={inputClass} placeholder="https://" />
          </div>
        </div>

        <div>
          <label htmlFor="su-tagline" className="text-sm font-medium text-[var(--foreground)]">
            One-line description <span className="text-red-600">*</span>
          </label>
          <input
            id="su-tagline"
            name="tagline"
            required
            className={inputClass}
            placeholder="What you do in one sentence"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="su-mission" className="text-sm font-medium text-[var(--foreground)]">
              Mission
            </label>
            <textarea id="su-mission" name="mission" rows={3} className={inputClass} placeholder="Why you exist" />
          </div>
          <div>
            <label htmlFor="su-vision" className="text-sm font-medium text-[var(--foreground)]">
              Vision
            </label>
            <textarea id="su-vision" name="vision" rows={3} className={inputClass} placeholder="Where you’re headed" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="su-founder" className="text-sm font-medium text-[var(--foreground)]">
              Primary founder / contact name
            </label>
            <input id="su-founder" name="founderName" className={inputClass} />
          </div>
          <div>
            <label htmlFor="su-email" className="text-sm font-medium text-[var(--foreground)]">
              Contact email <span className="text-red-600">*</span>
            </label>
            <input id="su-email" name="email" type="email" required className={inputClass} placeholder="you@company.com" />
          </div>
        </div>

        <div>
          <label htmlFor="su-deck" className="text-sm font-medium text-[var(--foreground)]">
            Link to deck, memo, or press kit
          </label>
          <input id="su-deck" name="deckUrl" type="url" className={inputClass} placeholder="https://" />
        </div>

        <div>
          <label htmlFor="su-file" className="text-sm font-medium text-[var(--foreground)]">
            Logo or attachments (optional)
          </label>
          <input
            id="su-file"
            name="files"
            type="file"
            accept="image/*,.pdf"
            multiple
            className="mt-2 block w-full text-sm text-[var(--muted-foreground)]"
          />
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Files are not uploaded to the server in this release; we only record that files were chosen so we know to follow up.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SubmitStartupButton />
          <p className="text-xs text-[var(--muted-foreground)]">You will get a browser confirmation when the pitch is stored.</p>
        </div>
      </form>

      <AdSlot variant="article-end" className="mt-10" />
    </>
  );
}
