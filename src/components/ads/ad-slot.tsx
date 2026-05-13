import { cn } from "@/lib/cn";

export type AdVariant = "in-feed" | "sidebar" | "anchor" | "article-mid" | "article-end";

const labels: Record<AdVariant, string> = {
  "in-feed": "In-feed",
  sidebar: "Sticky sidebar",
  anchor: "Anchor (mobile)",
  "article-mid": "Article mid-content",
  "article-end": "End of article",
};

export function AdSlot({
  variant,
  className,
}: {
  variant: AdVariant;
  className?: string;
}) {
  return (
    <aside
      role="note"
      aria-label={`Advertisement: ${labels[variant]}`}
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
        <span>{labels[variant]}</span>
        <span className="text-[10px] opacity-80">Swap with AdSense / GAM unit, cap 3 to 5 per page</span>
      </div>
    </aside>
  );
}
