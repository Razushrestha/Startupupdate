import Link from "next/link";
import { cn } from "@/lib/cn";
import type { InsightPost } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/mock-data";

const moodRing: Record<
  InsightPost["moodKind"],
  { ring: string; chip: string; glow: string }
> = {
  tension: {
    ring: "border-l-rose-500",
    chip: "bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-100",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(244,63,94,0.15)]",
  },
  hope: {
    ring: "border-l-emerald-500",
    chip: "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/45 dark:text-emerald-100",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(16,185,129,0.15)]",
  },
  clarity: {
    ring: "border-l-sky-500",
    chip: "bg-sky-50 text-sky-900 dark:bg-sky-950/45 dark:text-sky-100",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(14,165,233,0.15)]",
  },
  care: {
    ring: "border-l-violet-500",
    chip: "bg-violet-50 text-violet-900 dark:bg-violet-950/45 dark:text-violet-100",
    glow: "group-hover:shadow-[0_0_0_1px_rgba(139,92,246,0.15)]",
  },
};

export function InsightPostCard({
  post,
  featured,
}: {
  post: InsightPost;
  featured?: boolean;
}) {
  const m = moodRing[post.moodKind];
  return (
    <article
      id={post.slug}
      className={cn(
        "group relative overflow-hidden border border-[var(--border)] bg-[var(--card)] transition duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        m.ring,
        "border-l-4",
        m.glow,
        featured && "md:col-span-2 md:grid md:grid-cols-5 md:gap-8 md:p-8 md:pr-10",
        !featured && "p-6",
      )}
    >
      <div className={cn(featured && "md:col-span-3")}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              m.chip,
            )}
          >
            {post.mood}
          </span>
          <span className="text-xs text-[var(--muted-foreground)]">
            {formatRelativeTime(post.publishedAt)}, {post.readTime}
          </span>
        </div>
        <h3
          className={cn(
            "mt-3 font-semibold tracking-tight text-[var(--foreground)]",
            featured ? "text-2xl md:text-3xl" : "text-xl",
          )}
        >
          <Link href={`/insights/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{post.dek}</p>
        <blockquote
          className={cn(
            "mt-5 border-l-2 border-[var(--border)] pl-4 text-sm italic leading-relaxed text-[var(--foreground)]/90",
            featured && "md:text-base",
          )}
        >
          {post.pullQuote}
        </blockquote>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">{post.feeling}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-4">
          <p className="text-xs text-[var(--muted-foreground)]">{post.author}</p>
          <Link
            href={`/insights/${post.slug}`}
            className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-primary/40 hover:text-primary"
          >
            Read full insight
          </Link>
        </div>
      </div>
      {featured && (
        <div
          className={cn(
            "relative mt-6 min-h-[140px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 md:col-span-2 md:mt-0",
          )}
          aria-hidden
        >
          <div
            className={cn(
              "absolute inset-0 opacity-90",
              post.moodKind === "tension" && "bg-rose-100 dark:bg-rose-950/50",
              post.moodKind === "hope" && "bg-emerald-100 dark:bg-emerald-950/45",
              post.moodKind === "clarity" && "bg-sky-100 dark:bg-sky-950/45",
              post.moodKind === "care" && "bg-violet-100 dark:bg-violet-950/45",
            )}
          />
          <p className="relative z-[1] flex h-full items-end p-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[var(--muted-foreground)]">
            Signal, {post.moodKind}
          </p>
        </div>
      )}
    </article>
  );
}
