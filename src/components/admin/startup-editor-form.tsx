"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createStartup, updateStartup, type ActionState } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

export const startupStages = ["Pre-seed", "Seed", "Series A", "Series B", "Grant"] as const;

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

export type StartupFormInitial = {
  slug: string;
  name: string;
  country: string;
  sector: string;
  stage: (typeof startupStages)[number];
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

export function StartupEditorForm({
  mode,
  id,
  initial,
}: {
  mode: "create" | "edit";
  id?: string;
  initial?: StartupFormInitial;
}) {
  const actionFn = mode === "edit" && id ? updateStartup.bind(null, id) : createStartup;
  const [state, action] = useActionState(actionFn, undefined as ActionState | undefined);

  const d = initial;
  const [logoUrl, setLogoUrl] = useState(d?.brandLogoUrl ?? "");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLogoUrl(d?.brandLogoUrl ?? "");
  }, [d?.brandLogoUrl]);

  const uploadFile = useCallback(async (file: File) => {
    setUploadErr(null);
    setUploadBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/startup-logo", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setUploadErr(data.error ?? "Upload failed");
        return;
      }
      if (data.url) setLogoUrl(data.url);
    } catch {
      setUploadErr("Network error — try again.");
    } finally {
      setUploadBusy(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) void uploadFile(f);
  };

  const logoPreviewOk = logoUrl.trim().length > 0;

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-8 pb-16">
      <FormSection
        title="Company profile"
        description="Slug appears in public URLs (/startups/[slug]). Use a short, memorable path — change rarely."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Slug
            <input
              name="slug"
              required
              defaultValue={d?.slug}
              placeholder="acme-pay"
              className={field}
            />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Legal / brand name
            <input name="name" required defaultValue={d?.name} placeholder="Acme Payments" className={field} />
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Country
            <input name="country" required defaultValue={d?.country} placeholder="Nepal" className={field} />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Sector
            <input name="sector" required defaultValue={d?.sector} placeholder="Enterprise SaaS" className={field} />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Stage
            <select name="stage" required defaultValue={d?.stage ?? "Pre-seed"} className={field}>
              {startupStages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      </FormSection>

      <FormSection title="Story" description="Shown on the startup profile — keep mission and vision concise for scanners.">
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Description
          <textarea
            name="description"
            rows={3}
            defaultValue={d?.description}
            placeholder="What the company does in one tight paragraph."
            className={cn(field, "resize-y min-h-[5rem]")}
          />
        </label>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Mission
          <textarea
            name="mission"
            rows={3}
            defaultValue={d?.mission}
            placeholder="Why you exist."
            className={cn(field, "resize-y min-h-[5rem]")}
          />
        </label>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Vision
          <textarea
            name="vision"
            rows={3}
            defaultValue={d?.vision}
            placeholder="Where you're headed."
            className={cn(field, "resize-y min-h-[5rem]")}
          />
        </label>
      </FormSection>

      <FormSection
        title="Brand & visibility"
        description="Square or wide PNG/SVG-style logos work best. Upload stores the file on this server; you can override with any HTTPS URL."
      >
        <input type="hidden" name="brandLogoUrl" value={logoUrl} readOnly />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-4">
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
                {uploadBusy ? "Uploading…" : "Drop logo here or click to upload"}
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
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://… or /uploads/startups/…"
                className={field}
              />
            </label>
          </div>

          <div className="mx-auto shrink-0 lg:mx-0">
            <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)] lg:text-left">
              Preview
            </p>
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklch,var(--muted)_50%,transparent)] shadow-inner dark:bg-[color-mix(in_oklch,var(--muted)_25%,transparent)]">
              {logoPreviewOk ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin preview accepts arbitrary URLs
                <img src={logoUrl} alt="" className="max-h-full max-w-full object-contain p-3" />
              ) : (
                <span className="px-4 text-center text-xs text-[var(--muted-foreground)]">No logo yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Fallback letter
            <input
              name="logoLetter"
              maxLength={3}
              defaultValue={d?.logoLetter ?? "?"}
              placeholder="?"
              className={field}
            />
            <span className="mt-1 block text-xs text-[var(--muted-foreground)]">Shown when no image loads (1–3 characters).</span>
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Buzz score (0–100)
            <input
              name="engagementScore"
              type="number"
              min={0}
              max={100}
              defaultValue={d?.engagementScore ?? 70}
              className={field}
            />
            <span className="mt-1 block text-xs text-[var(--muted-foreground)]">Feeds homepage and directory ordering.</span>
          </label>
        </div>
      </FormSection>

      <FormSection title="Founder" description="Primary contact shown on the public profile.">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Name
            <input name="founderName" required defaultValue={d?.founderName} className={field} />
          </label>
          <label className="block text-sm font-medium text-[var(--foreground)]">
            Role
            <input name="founderRole" required defaultValue={d?.founderRole} placeholder="CEO" className={field} />
          </label>
        </div>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Bio
          <textarea name="founderBio" rows={3} defaultValue={d?.founderBio} className={cn(field, "resize-y min-h-[5rem]")} />
        </label>
        <label className="block text-sm font-medium text-[var(--foreground)]">
          LinkedIn (optional)
          <input name="founderLinkedIn" type="url" defaultValue={d?.founderLinkedIn} placeholder="https://linkedin.com/in/…" className={field} />
        </label>
      </FormSection>

      <FormSection
        title="Funding rounds"
        description="Paste a JSON array. Leave as [] if you are not tracking rounds yet."
      >
        <label className="block text-sm font-medium text-[var(--foreground)]">
          Rounds JSON
          <textarea
            name="fundingJson"
            rows={8}
            defaultValue={d?.fundingJson ?? "[]"}
            placeholder='[{"round":"Seed","amount":"$3M","date":"2026-01-01","investors":["Fund A"]}]'
            className={cn(field, "resize-y font-mono text-xs leading-relaxed")}
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
              {mode === "create" ? "Created. You can link news articles from the News tab." : "Saved successfully."}
            </p>
          ) : null}
        </div>
        <SubmitBtn label={mode === "create" ? "Create startup" : "Save changes"} />
      </div>
    </form>
  );
}
