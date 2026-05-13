"use server";

import { z } from "zod";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { SubmissionModel } from "@/lib/db/models";

export type SubmitState = { ok: true } | { ok: false; message: string };

const startupZ = z.object({
  companyName: z.string().min(1, "Company name is required"),
  country: z.string().min(1),
  sector: z.string().min(1),
  stage: z.string().optional(),
  website: z.union([z.string().url(), z.literal("")]).optional(),
  tagline: z.string().min(1),
  mission: z.string().optional(),
  vision: z.string().optional(),
  founderName: z.string().optional(),
  email: z.string().email(),
  deckUrl: z.union([z.string().url(), z.literal("")]).optional(),
});

const newsZ = z.object({
  headline: z.string().min(1),
  category: z.enum(["Funding", "Launch", "Tech", "Events"]),
  companyName: z.string().optional(),
  summary: z.string().min(1),
  sourceUrl: z.union([z.string().url(), z.literal("")]).optional(),
  email: z.string().email(),
  editorNotes: z.string().optional(),
});

function optionalUrl(s: string | null): string | undefined {
  const t = (s ?? "").trim();
  if (!t) return undefined;
  try {
    new URL(t);
    return t;
  } catch {
    return undefined;
  }
}

export async function submitStartupPitch(_prev: SubmitState | undefined, formData: FormData): Promise<SubmitState> {
  if (!isMongoConfigured()) {
    return {
      ok: false,
      message:
        "Submissions are not stored until MongoDB is connected. Add MONGODB_URI to your environment and restart the server.",
    };
  }

  const hp = String(formData.get("website_hp") ?? "");
  if (hp.trim()) {
    return { ok: true };
  }

  const fileCount = formData
    .getAll("files")
    .filter((v) => typeof File !== "undefined" && v instanceof File && v.size > 0).length;
  const fileMeta =
    fileCount > 0
      ? `${fileCount} file(s) selected (attachments are not uploaded yet; contact email is on file).`
      : undefined;

  const raw = {
    companyName: formData.get("companyName"),
    country: formData.get("country"),
    sector: formData.get("sector"),
    stage: formData.get("stage"),
    website: optionalUrl(formData.get("website") as string | null),
    tagline: formData.get("tagline"),
    mission: formData.get("mission"),
    vision: formData.get("vision"),
    founderName: formData.get("founderName"),
    email: formData.get("email"),
    deckUrl: optionalUrl(formData.get("deckUrl") as string | null),
  };

  const parsed = startupZ.safeParse({
    ...raw,
    companyName: String(raw.companyName ?? "").trim(),
    country: String(raw.country ?? "").trim(),
    sector: String(raw.sector ?? "").trim(),
    stage: String(raw.stage ?? "").trim() || undefined,
    tagline: String(raw.tagline ?? "").trim(),
    mission: String(raw.mission ?? "").trim() || undefined,
    vision: String(raw.vision ?? "").trim() || undefined,
    founderName: String(raw.founderName ?? "").trim() || undefined,
    email: String(raw.email ?? "").trim(),
    website: raw.website,
    deckUrl: raw.deckUrl,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" • ") };
  }

  const p = parsed.data;
  await connectMongo();
  await SubmissionModel.create({
    kind: "startup",
    status: "pending",
    contactEmail: p.email,
    attachmentHint: fileMeta,
    payload: {
      companyName: p.companyName,
      country: p.country,
      sector: p.sector,
      stage: p.stage,
      website: p.website,
      tagline: p.tagline,
      mission: p.mission,
      vision: p.vision,
      founderName: p.founderName,
      deckUrl: p.deckUrl,
    },
  });

  return { ok: true };
}

export async function submitNewsPitch(_prev: SubmitState | undefined, formData: FormData): Promise<SubmitState> {
  if (!isMongoConfigured()) {
    return {
      ok: false,
      message:
        "Submissions are not stored until MongoDB is connected. Add MONGODB_URI to your environment and restart the server.",
    };
  }

  const hp = String(formData.get("website_hp") ?? "");
  if (hp.trim()) {
    return { ok: true };
  }

  const fileCount = formData
    .getAll("files")
    .filter((v) => typeof File !== "undefined" && v instanceof File && v.size > 0).length;
  const fileMeta =
    fileCount > 0
      ? `${fileCount} file(s) selected (attachments not uploaded server-side yet).`
      : undefined;

  const raw = {
    headline: formData.get("headline"),
    category: formData.get("category"),
    companyName: formData.get("companyName"),
    summary: formData.get("summary"),
    sourceUrl: optionalUrl(formData.get("sourceUrl") as string | null),
    email: formData.get("email"),
    editorNotes: formData.get("editorNotes"),
  };

  const parsed = newsZ.safeParse({
    headline: String(raw.headline ?? "").trim(),
    category: String(raw.category ?? "").trim(),
    companyName: String(raw.companyName ?? "").trim() || undefined,
    summary: String(raw.summary ?? "").trim(),
    sourceUrl: raw.sourceUrl,
    email: String(raw.email ?? "").trim(),
    editorNotes: String(raw.editorNotes ?? "").trim() || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" • ") };
  }

  const p = parsed.data;
  await connectMongo();
  await SubmissionModel.create({
    kind: "news",
    status: "pending",
    contactEmail: p.email,
    attachmentHint: fileMeta,
    payload: {
      headline: p.headline,
      category: p.category,
      companyName: p.companyName,
      summary: p.summary,
      sourceUrl: p.sourceUrl,
      editorNotes: p.editorNotes,
    },
  });

  return { ok: true };
}
