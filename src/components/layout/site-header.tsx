"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_DESKTOP, SITE } from "@/lib/site-config";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SubmitNavDropdown } from "@/components/layout/submit-nav-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/layout/site-logo";

const SCROLL_EDGE = 56;
/** px — ignore tiny deltas from touch bounce / subpixel jitter */
const SCROLL_DOWN_DELTA = 10;
const SCROLL_UP_DELTA = 6;

function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const searchActive = pathname === "/search" || pathname.startsWith("/search/");
  const [revealed, setRevealed] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    setRevealed(true);
  }, [pathname]);

  useEffect(() => {
    lastY.current = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const onScrollFrame = () => {
      ticking = false;
      const y = window.scrollY;
      const prev = lastY.current;
      const delta = y - prev;
      lastY.current = y;

      if (y < SCROLL_EDGE) {
        setRevealed(true);
        return;
      }
      if (delta > SCROLL_DOWN_DELTA) setRevealed(false);
      else if (delta < -SCROLL_UP_DELTA) setRevealed(true);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScrollFrame);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)] transition-[transform] duration-300 motion-safe:ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
        revealed ? "translate-y-0" : "-translate-y-full pointer-events-none",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-1.5 lg:flex-nowrap">
        <div className="flex min-w-0 items-center gap-x-8">
          <Link
            href="/"
            aria-label={SITE.name}
            className="inline-block shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            <SiteLogo decorative priority size="header" />
          </Link>

          <nav className="hidden shrink-0 items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_DESKTOP.map((item) => {
              const active = navActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-[color,background-color,box-shadow]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                    active
                      ? "bg-primary/15 font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary/25 dark:bg-primary/20 dark:ring-primary/35"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <SubmitNavDropdown align="end" />
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-sm">
          <LanguageSwitcher />
          <SubmitNavDropdown className="lg:hidden" align="end" compact />
          <Link
            href="/search"
            aria-current={searchActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1.5 font-medium transition-[color,background-color,box-shadow]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
              searchActive
                ? "bg-primary/15 font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary/25 dark:bg-primary/20 dark:ring-primary/35"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
            )}
          >
            Search
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
