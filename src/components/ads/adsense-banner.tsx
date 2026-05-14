"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { ADSENSE_PUBLISHER_ID, ADSENSE_SLOTS, ADS_VARIANT_LABELS, type AdVariant } from "@/lib/ads-config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Renders one AdSense responsive display unit once the global `adsbygoogle.js` script has loaded. */
export function AdsenseBanner({
  variant,
  className,
}: {
  variant: AdVariant;
  className?: string;
}) {
  const slot = ADSENSE_SLOTS[variant];
  const pushedRef = useRef(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADSENSE_PUBLISHER_ID.startsWith("ca-pub-") || !slot || pushedRef.current) return;

    let frame = 0;
    let stopped = false;
    const deadline = typeof performance !== "undefined" ? performance.now() + 25_000 : 0;

    const push = (): boolean => {
      if (!insRef.current || pushedRef.current) return true;
      if (!window.adsbygoogle) return false;
      try {
        window.adsbygoogle.push({});
        pushedRef.current = true;
        return true;
      } catch {
        return false;
      }
    };

    const tick = (): void => {
      if (stopped) return;
      if (typeof performance !== "undefined" && performance.now() > deadline) return;
      if (push()) return;
      frame = window.requestAnimationFrame(tick);
    };

    tick();
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      pushedRef.current = false;
    };
  }, [slot]);

  if (!ADSENSE_PUBLISHER_ID.startsWith("ca-pub-") || !slot) return null;

  return (
    <aside
      role="note"
      aria-label={`Advertisement: ${ADS_VARIANT_LABELS[variant]}`}
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)]/35 text-[var(--muted-foreground)]",
        variant === "in-feed" && "min-h-[120px]",
        variant === "sidebar" && "min-h-[280px] lg:sticky lg:top-24",
        variant === "anchor" &&
          "fixed bottom-[5.5rem] left-0 right-0 z-30 mx-auto max-w-lg min-h-[52px] bg-[var(--background)] px-3 shadow-lg shadow-black/5 md:hidden dark:shadow-black/25",
        variant === "article-mid" && "min-h-[100px]",
        variant === "article-end" && "min-h-[140px]",
        className,
      )}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block min-h-[inherit] w-full"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
