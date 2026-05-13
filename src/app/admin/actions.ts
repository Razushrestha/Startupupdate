"use server";

import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession, signAdminJwt, setAdminCookie, clearAdminCookie } from "@/lib/admin/auth";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { InsightModel, NewsModel, StartupModel, SubmissionModel } from "@/lib/db/models";

const startupStageZ = z.enum(["Pre-seed", "Seed", "Series A", "Series B", "Grant"]);
const newsCategoryZ = z.enum(["Funding", "Launch", "Tech", "Events"]);
const insightMoodZ = z.enum(["tension", "hope", "clarity", "care"]);

const fundingRoundZ = z.object({
  round: z.string().min(1),
  amount: z.string().min(1),
  date: z.string().min(1),
  investors: z.array(z.string()),
});

const startupPayloadZ = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/i, "Slug: letters, numbers, hyphens only"),
  name: z.string().min(1),
  country: z.string().min(1),
  sector: z.string().min(1),
  stage: startupStageZ,
  description: z.string(),
  mission: z.string(),
  vision: z.string(),
  brandLogoUrl: z.string().optional(),
  logoLetter: z.string().min(1).max(3),
  engagementScore: z.coerce.number().min(0).max(100),
  founderName: z.string().min(1),
  founderRole: z.string().min(1),
  founderBio: z.string(),
  founderLinkedIn: z.string().optional(),
  fundingJson: z.string().optional(),
});

function parseFunding(json?: string): z.infer<typeof fundingRoundZ>[] {
  if (!json?.trim()) return [];
  const parsed = JSON.parse(json) as unknown;
  return z.array(fundingRoundZ).parse(parsed);
}

export type ActionState = { ok: true } | { ok: false; message: string };

export async function loginAdmin(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) {
    return {
      ok: false,
      message:
        "Admin is not configured: set ADMIN_PASSWORD (and ADMIN_SESSION_SECRET) in .env.local, then restart the dev server.",
    };
  }
  const password = String(formData.get("password") ?? "").trim();
  if (!password || password !== expected) {
    return { ok: false, message: "Invalid password." };
  }
  if (!process.env.ADMIN_SESSION_SECRET) {
    return { ok: false, message: "ADMIN_SESSION_SECRET is not set on the server." };
  }
  const token = await signAdminJwt();
  await setAdminCookie(token);
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}

async function requireMongo(): Promise<ActionState | null> {
  if (!isMongoConfigured()) {
    return { ok: false, message: "Set MONGODB_URI to modify content." };
  }
  await connectMongo();
  return null;
}

export async function createStartup(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  await requireAdminSession();
  const mongoErr = await requireMongo();
  if (mongoErr) return mongoErr;

  let funding: z.infer<typeof fundingRoundZ>[] = [];
  try {
    funding = parseFunding(String(formData.get("fundingJson") ?? ""));
  } catch {
    return { ok: false, message: "Funding must be valid JSON (array of rounds)." };
  }

  const raw = {
    slug: formData.get("slug"),
    name: formData.get("name"),
    country: formData.get("country"),
    sector: formData.get("sector"),
    stage: formData.get("stage"),
    description: formData.get("description") ?? "",
    mission: formData.get("mission") ?? "",
    vision: formData.get("vision") ?? "",
    brandLogoUrl: (formData.get("brandLogoUrl") as string) || undefined,
    logoLetter: formData.get("logoLetter"),
    engagementScore: formData.get("engagementScore"),
    founderName: formData.get("founderName"),
    founderRole: formData.get("founderRole"),
    founderBio: formData.get("founderBio") ?? "",
    founderLinkedIn: (formData.get("founderLinkedIn") as string) || undefined,
    fundingJson: "",
  };

  const parsed = startupPayloadZ.safeParse({ ...raw, fundingJson: "" });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" • ") };
  }

  const p = parsed.data;
  try {
    await StartupModel.create({
      slug: p.slug,
      name: p.name,
      country: p.country,
      sector: p.sector,
      stage: p.stage,
      description: p.description,
      mission: p.mission,
      vision: p.vision,
      brandLogoUrl: p.brandLogoUrl,
      logoLetter: p.logoLetter,
      engagementScore: p.engagementScore,
      founder: {
        name: p.founderName,
        role: p.founderRole,
        bio: p.founderBio,
        linkedIn: p.founderLinkedIn,
      },
      funding,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save startup.";
    if (String(msg).includes("duplicate key")) {
      return { ok: false, message: "That slug is already in use." };
    }
    return { ok: false, message: msg };
  }

  revalidateAll();
  return { ok: true };
}

export async function updateStartup(
  id: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();
  const mongoErr = await requireMongo();
  if (mongoErr) return mongoErr;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid id." };
  }

  let funding: z.infer<typeof fundingRoundZ>[] = [];
  try {
    funding = parseFunding(String(formData.get("fundingJson") ?? ""));
  } catch {
    return { ok: false, message: "Funding must be valid JSON (array of rounds)." };
  }

  const raw = {
    slug: formData.get("slug"),
    name: formData.get("name"),
    country: formData.get("country"),
    sector: formData.get("sector"),
    stage: formData.get("stage"),
    description: formData.get("description") ?? "",
    mission: formData.get("mission") ?? "",
    vision: formData.get("vision") ?? "",
    brandLogoUrl: (formData.get("brandLogoUrl") as string) || undefined,
    logoLetter: formData.get("logoLetter"),
    engagementScore: formData.get("engagementScore"),
    founderName: formData.get("founderName"),
    founderRole: formData.get("founderRole"),
    founderBio: formData.get("founderBio") ?? "",
    founderLinkedIn: (formData.get("founderLinkedIn") as string) || undefined,
    fundingJson: "",
  };
  const parsed = startupPayloadZ.safeParse({ ...raw });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" • ") };
  }
  const p = parsed.data;

  try {
    await StartupModel.findByIdAndUpdate(id, {
      slug: p.slug,
      name: p.name,
      country: p.country,
      sector: p.sector,
      stage: p.stage,
      description: p.description,
      mission: p.mission,
      vision: p.vision,
      brandLogoUrl: p.brandLogoUrl,
      logoLetter: p.logoLetter,
      engagementScore: p.engagementScore,
      founder: {
        name: p.founderName,
        role: p.founderRole,
        bio: p.founderBio,
        linkedIn: p.founderLinkedIn,
      },
      funding,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not update startup.";
    if (String(msg).includes("duplicate key")) {
      return { ok: false, message: "That slug is already in use." };
    }
    return { ok: false, message: msg };
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteStartup(formData: FormData): Promise<void> {
  await requireAdminSession();
  if (!isMongoConfigured()) return;
  await connectMongo();
  const id = String(formData.get("id") ?? "");
  if (!mongoose.Types.ObjectId.isValid(id)) return;
  await NewsModel.deleteMany({ startupId: id });
  await StartupModel.findByIdAndDelete(id);
  revalidateAll();
}

const newsPayloadZ = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/i),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: newsCategoryZ,
  publishedAt: z.string().min(1),
  startupId: z.string().min(1),
  trending: z.boolean(),
  coverImage: z.string().min(1),
  imageAlt: z.string().optional(),
  body: z.string(),
});

function splitBody(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createNews(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  await requireAdminSession();
  const mongoErr = await requireMongo();
  if (mongoErr) return mongoErr;

  const rawEntries = [...formData.entries()].filter(([k]) => k !== "trending") as [string, FormDataEntryValue][];
  const raw = Object.fromEntries(rawEntries) as Record<string, string>;
  const trending = formData.get("trending") === "on";
  const parsed = newsPayloadZ.safeParse({
    ...raw,
    trending,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" • ") };
  }
  const p = parsed.data;
  if (!mongoose.Types.ObjectId.isValid(p.startupId)) {
    return { ok: false, message: "Pick a valid startup." };
  }

  const paragraphs = splitBody(p.body);
  try {
    await NewsModel.create({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      category: p.category,
      publishedAt: new Date(p.publishedAt),
      startupId: new mongoose.Types.ObjectId(p.startupId),
      trending: trending || false,
      body: paragraphs,
      coverImage: p.coverImage,
      imageAlt: p.imageAlt,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save article.";
    if (String(msg).includes("duplicate key")) {
      return { ok: false, message: "That slug is already in use." };
    }
    return { ok: false, message: msg };
  }

  revalidateAll();
  return { ok: true };
}

export async function updateNews(
  id: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();
  const mongoErr = await requireMongo();
  if (mongoErr) return mongoErr;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid id." };
  }

  const rawEntries = [...formData.entries()].filter(([k]) => k !== "trending") as [string, FormDataEntryValue][];
  const raw = Object.fromEntries(rawEntries) as Record<string, string>;
  const trending = formData.get("trending") === "on";
  const parsed = newsPayloadZ.safeParse({
    ...raw,
    trending,
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" • ") };
  }
  const p = parsed.data;
  if (!mongoose.Types.ObjectId.isValid(p.startupId)) {
    return { ok: false, message: "Pick a valid startup." };
  }

  const paragraphs = splitBody(p.body);
  try {
    await NewsModel.findByIdAndUpdate(id, {
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      category: p.category,
      publishedAt: new Date(p.publishedAt),
      startupId: new mongoose.Types.ObjectId(p.startupId),
      trending: trending || false,
      body: paragraphs,
      coverImage: p.coverImage,
      imageAlt: p.imageAlt,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not update article.";
    if (String(msg).includes("duplicate key")) {
      return { ok: false, message: "That slug is already in use." };
    }
    return { ok: false, message: msg };
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteNews(formData: FormData): Promise<void> {
  await requireAdminSession();
  if (!isMongoConfigured()) return;
  await connectMongo();
  const id = String(formData.get("id") ?? "");
  if (!mongoose.Types.ObjectId.isValid(id)) return;
  await NewsModel.findByIdAndDelete(id);
  revalidateAll();
}

const insightPayloadZ = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/i),
  title: z.string().min(1),
  dek: z.string().min(1),
  readTime: z.string().min(1),
  author: z.string().min(1),
  publishedAt: z.string().min(1),
  feeling: z.string().min(1),
  mood: z.string().min(1),
  moodKind: insightMoodZ,
  pullQuote: z.string().min(1),
});

export async function createInsight(_prev: ActionState | undefined, formData: FormData): Promise<ActionState> {
  await requireAdminSession();
  const mongoErr = await requireMongo();
  if (mongoErr) return mongoErr;

  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = insightPayloadZ.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" • ") };
  }
  const p = parsed.data;
  try {
    await InsightModel.create({
      ...p,
      publishedAt: new Date(p.publishedAt),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not save insight.";
    if (String(msg).includes("duplicate key")) {
      return { ok: false, message: "That slug is already in use." };
    }
    return { ok: false, message: msg };
  }

  revalidateAll();
  return { ok: true };
}

export async function updateInsight(
  id: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();
  const mongoErr = await requireMongo();
  if (mongoErr) return mongoErr;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { ok: false, message: "Invalid id." };
  }

  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = insightPayloadZ.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues.map((i) => i.message).join(" • ") };
  }
  const p = parsed.data;
  try {
    await InsightModel.findByIdAndUpdate(id, {
      ...p,
      publishedAt: new Date(p.publishedAt),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not update insight.";
    if (String(msg).includes("duplicate key")) {
      return { ok: false, message: "That slug is already in use." };
    }
    return { ok: false, message: msg };
  }

  revalidateAll();
  return { ok: true };
}

export async function deleteInsight(formData: FormData): Promise<void> {
  await requireAdminSession();
  if (!isMongoConfigured()) return;
  await connectMongo();
  const id = String(formData.get("id") ?? "");
  if (!mongoose.Types.ObjectId.isValid(id)) return;
  await InsightModel.findByIdAndDelete(id);
  revalidateAll();
}

const submissionStatusZ = z.enum(["pending", "reviewed", "dismissed"]);

export async function setSubmissionStatus(formData: FormData): Promise<void> {
  await requireAdminSession();
  if (!isMongoConfigured()) return;
  await connectMongo();
  const id = String(formData.get("id") ?? "");
  const st = String(formData.get("status") ?? "");
  if (!mongoose.Types.ObjectId.isValid(id)) return;
  const parsed = submissionStatusZ.safeParse(st);
  if (!parsed.success) return;
  await SubmissionModel.findByIdAndUpdate(id, { $set: { status: parsed.data } });
  revalidatePath("/admin/submissions");
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/startups");
  revalidatePath("/news");
  revalidatePath("/insights");
  revalidatePath("/funding");
  revalidatePath("/search");
}
