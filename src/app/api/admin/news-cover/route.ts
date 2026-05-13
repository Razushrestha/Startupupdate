import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE, verifyAdminJwt } from "@/lib/admin/auth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(req: Request) {
  const jar = await cookies();
  const ok = await verifyAdminJwt(jar.get(COOKIE)?.value);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
  }

  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return NextResponse.json({ error: "Use JPEG, PNG, WebP, or GIF" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads", "news");
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  const fsPath = path.join(dir, name);
  await writeFile(fsPath, buf);

  const url = `/uploads/news/${name}`;
  return NextResponse.json({ url });
}
