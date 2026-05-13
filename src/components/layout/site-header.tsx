"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_DESKTOP, SITE } from "@/lib/site-config";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SubmitNavDropdown } from "@/components/layout/submit-nav-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/layout/site-logo";

function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-3 lg:flex-nowrap">
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
                  className={cn(
                    "text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:underline",
                    active && "font-medium text-[var(--foreground)]",
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
            className="text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:underline"
          >
            Search
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
