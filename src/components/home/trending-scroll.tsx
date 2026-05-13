"use client";

import type { ReactNode } from "react";

export function TrendingScroll({ children }: { children: ReactNode }) {
  return (
    <section className="relative" aria-labelledby="trending-heading">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="trending-heading"
            className="text-2xl font-semibold tracking-tight text-[var(--foreground)]"
          >
            Trending now
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Swipe or drag sideways. Editor-picked stories gaining traction.
          </p>
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          Scroll →
        </p>
      </div>

      <div className="relative -mx-4 sm:-mx-0">
        <div
          className="trending-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 pt-1 sm:gap-6 sm:px-1 sm:pr-2"
          tabIndex={0}
          role="region"
          aria-label="Trending stories, horizontal scroll"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
