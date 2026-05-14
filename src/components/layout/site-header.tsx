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
const SCROLL_DOWN_DELTA = 10;
const SCROLL_UP_DELTA = 6;

function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="9" r="6" />
      <path d="m17 17-3.5-3.5" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const searchActive = pathname === "/search" || pathname.startsWith("/search/");
  const [revealed, setRevealed] = useState(true);
  const lastY = useRef(0);

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

  const navLinkBase =
    "relative inline-flex items-center px-1 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] rounded-sm";
  const indicator =
    "after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary after:content-['']";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--background)]/85 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/70 transition-transform duration-300 motion-safe:ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
        revealed ? "translate-y-0" : "-translate-y-full pointer-events-none",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-2">
        <Link
          href="/"
          aria-label={SITE.name}
          className="inline-flex shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <SiteLogo decorative priority size="header" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_DESKTOP.map((item) => {
            const active = navActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  navLinkBase,
                  active
                    ? cn("text-[var(--foreground)]", indicator)
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-current={searchActive ? "page" : undefined}
            aria-label="Search"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
              searchActive && "bg-[var(--muted)] text-[var(--foreground)]",
            )}
          >
            <SearchIcon className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <span className="hidden h-5 w-px bg-[var(--border)] sm:inline-block" aria-hidden />
          <LanguageSwitcher />
          <SubmitNavDropdown align="end" compact />
        </div>
      </div>
    </header>
  );
}
