"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_DESKTOP, SITE } from "@/lib/site-config";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SubmitNavDropdown } from "@/components/layout/submit-nav-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";

function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:flex-nowrap lg:items-center lg:gap-8">
        <Link
          href="/"
          className="shrink-0 justify-self-start text-[var(--foreground)] outline-none focus-visible:underline"
        >
          <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            South Asia
          </span>
          <span className="block text-lg font-semibold tracking-tight">{SITE.name}</span>
        </Link>

        <nav className="hidden w-full justify-center gap-1 lg:flex" aria-label="Primary">
          {NAV_DESKTOP.map((item) => {
            const active = navActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b-2 px-3 py-2 text-sm transition-colors",
                  active
                    ? "border-[var(--foreground)] pb-[6px] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <SubmitNavDropdown className="ml-1" align="center" />
        </nav>

        <div className="ml-auto flex items-center gap-2 text-sm sm:gap-3 lg:ml-0 lg:justify-self-end">
          <LanguageSwitcher />
          <SubmitNavDropdown className="lg:hidden" align="end" />
          <Link
            href="/search"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Search
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
