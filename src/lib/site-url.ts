/** Canonical site origin for metadata, sitemap, JSON-LD, and AdSense context. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "").trim();
  if (explicit) return explicit;
  /** Vercel sets this on each deployment (no protocol). Custom domains still need NEXT_PUBLIC_SITE_URL. */
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "").trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
