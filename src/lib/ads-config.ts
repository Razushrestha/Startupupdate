export type AdVariant = "in-feed" | "sidebar" | "anchor" | "article-mid" | "article-end";

export const ADS_VARIANT_LABELS: Record<AdVariant, string> = {
  "in-feed": "In-feed",
  sidebar: "Sticky sidebar",
  anchor: "Anchor (mobile)",
  "article-mid": "Article mid-content",
  "article-end": "End of article",
};

/**
 * Must match `public/ads.txt` (google.com, pub-… line). Override for staging/forks via
 * `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` in `.env.local` / host env.
 */
const FALLBACK_ADSENSE_PUBLISHER = "ca-pub-3440826594967276";

export const ADSENSE_PUBLISHER_ID = (() => {
  const raw =
    typeof process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID === "string"
      ? process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID.trim()
      : "";
  return (raw || FALLBACK_ADSENSE_PUBLISHER).trim();
})();

const defaultSlot = normalizeSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT);

/** Per-placement slot IDs, each falling back to `NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT` when unset. */
export const ADSENSE_SLOTS: Record<AdVariant, string | undefined> = {
  "in-feed": normalizeSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED) ?? defaultSlot,
  sidebar: normalizeSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR) ?? defaultSlot,
  anchor: normalizeSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_ANCHOR) ?? defaultSlot,
  "article-mid": normalizeSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MID) ?? defaultSlot,
  "article-end": normalizeSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_END) ?? defaultSlot,
};

function normalizeSlot(v?: string) {
  const s = v?.trim();
  return s && s.length > 0 ? s : undefined;
}

export function adsenseScriptSrc(): string | null {
  if (!ADSENSE_PUBLISHER_ID.startsWith("ca-pub-")) return null;
  const q = `client=${encodeURIComponent(ADSENSE_PUBLISHER_ID)}`;
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?${q}`;
}

/** `pub-…` line value for ads.txt (Google expects `pub-`, not `ca-pub-`). */
export function adsensePublisherForAdsTxt(): string | null {
  if (!ADSENSE_PUBLISHER_ID.startsWith("ca-pub-")) return null;
  return `pub-${ADSENSE_PUBLISHER_ID.slice("ca-pub-".length)}`;
}
