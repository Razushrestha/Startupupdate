import { AdsenseBanner } from "@/components/ads/adsense-banner";
import { cn } from "@/lib/cn";
import {
  ADSENSE_PUBLISHER_ID,
  ADSENSE_SLOTS,
  ADS_VARIANT_LABELS,
  type AdVariant,
} from "@/lib/ads-config";

export type { AdVariant };

function adsenseConfiguredForVariant(v: AdVariant) {
  return ADSENSE_PUBLISHER_ID.startsWith("ca-pub-") && Boolean(ADSENSE_SLOTS[v]);
}

export function AdSlot({
  variant,
  className,
}: {
  variant: AdVariant;
  className?: string;
}) {
  if (adsenseConfiguredForVariant(variant)) {
    return <AdsenseBanner variant={variant} className={className} />;
  }

  return (
    <aside
      role="note"
      aria-label={`Advertisement: ${ADS_VARIANT_LABELS[variant]}`}
      className={cn(
        "overflow-hidden rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/50 text-center text-xs text-[var(--muted-foreground)]",
        variant === "in-feed" && "min-h-[120px]",
        variant === "sidebar" && "min-h-[280px] lg:sticky lg:top-24",
        variant === "anchor" &&
          "fixed bottom-[5.5rem] left-0 right-0 z-30 mx-auto max-w-lg min-h-[52px] px-3 md:hidden",
        variant === "article-mid" && "min-h-[100px]",
        variant === "article-end" && "min-h-[140px]",
        className,
      )}
    >
      <div className="flex h-full min-h-[inherit] flex-col items-center justify-center gap-1 px-3 py-4">
        <span className="font-semibold text-[var(--foreground)]">Ad placement</span>
        <span>{ADS_VARIANT_LABELS[variant]}</span>
        <span className="text-[10px] opacity-80">
          Set <code className="rounded bg-[var(--muted)] px-1">NEXT_PUBLIC_ADSENSE_PUBLISHER_ID</code> and at least{" "}
          <code className="rounded bg-[var(--muted)] px-1">NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT</code> (or per-placement{" "}
          <code className="rounded bg-[var(--muted)] px-1">NEXT_PUBLIC_ADSENSE_SLOT_*</code>) in{" "}
          <code className="rounded bg-[var(--muted)] px-1">.env.local</code>
        </span>
      </div>
    </aside>
  );
}
