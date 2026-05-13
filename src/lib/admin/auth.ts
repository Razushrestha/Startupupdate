import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { SignJWT } from "jose";
import { redirect } from "next/navigation";

const COOKIE = "su_admin";

function getSecret(): Uint8Array | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function signAdminJwt(): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verifyAdminJwt(token: string | undefined): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function requireAdminSession(): Promise<void> {
  const store = await cookies();
  const ok = await verifyAdminJwt(store.get(COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}

export async function setAdminCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export { COOKIE };
