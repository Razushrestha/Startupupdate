import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/lib/mock-data";
import { formatRelativeTime, getStartupById } from "@/lib/mock-data";
import { cn } from "@/lib/cn";
import { NewsReactions } from "@/components/news/news-reactions";

export function NewsCard({
  item,
  className,
  layout = "default",
}: {
  item: NewsItem;
  className?: string;
  /** `carousel`: compact card for horizontal trending rail. */
  layout?: "default" | "carousel";
}) {
  const startup = getStartupById(item.startupId);
  const isCarousel = layout === "carousel";

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden border bg-[var(--card)]",
        isCarousel
          ? "h-full rounded-2xl border-[var(--border)] shadow-sm"
          : "group border-[var(--border)] transition hover:bg-[var(--muted)]/30",
        className,
      )}
    >
      <Link
        href={`/news/${item.slug}`}
        className={cn(
          "relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-[var(--muted)]",
          isCarousel ? "rounded-t-2xl" : "border-b border-[var(--border)]",
        )}
      >
        <Image
          src={item.coverImage}
          alt={item.imageAlt ?? item.title}
          fill
          sizes={isCarousel ? "(max-width: 640px) 88vw, 380px" : "(max-width: 768px) 100vw, 33rem"}
          className="object-cover"
        />
      </Link>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-[15px] font-semibold",
              "border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]",
            )}
            aria-hidden
          >
            {startup?.logoLetter ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {item.trending && (
                <span className="rounded-md border border-amber-300/60 bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-100">
                  Trending
                </span>
              )}
              <span className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[11px] font-semibold text-[var(--foreground)]">
                {item.category}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {formatRelativeTime(item.publishedAt)}
              </span>
            </div>
            <h3
              className={cn(
                "font-semibold leading-snug tracking-tight text-[var(--foreground)]",
                isCarousel ? "text-[17px]" : "text-base md:text-lg",
              )}
            >
              <Link href={`/news/${item.slug}`} className="hover:underline">
                {item.title}
              </Link>
            </h3>
            <p
              className={cn(
                "mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]",
              )}
            >
              {item.summary}
            </p>
            {startup && (
              <p className="mt-3 text-sm">
                <Link
                  href={`/startups/${startup.slug}`}
                  className="font-medium text-[var(--foreground)] underline-offset-2 hover:underline"
                >
                  {startup.name}
                </Link>
                <span className="text-[var(--muted-foreground)]">, {startup.country}</span>
              </p>
            )}
          </div>
        </div>

        <div className={cn(isCarousel && "mt-auto pt-5")}>
          <NewsReactions
            articleId={item.id}
            slug={item.slug}
            title={item.title}
            summary={item.summary}
            variant="card"
          />
        </div>
      </div>
    </article>
  );
}
