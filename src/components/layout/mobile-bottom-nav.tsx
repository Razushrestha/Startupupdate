"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_MOBILE } from "@/lib/site-config";
import { cn } from "@/lib/cn";

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)]/80 bg-[var(--background)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/75 pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile primary"
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {NAV_MOBILE.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-1 w-1 rounded-full transition-opacity",
                    active ? "bg-primary opacity-100" : "opacity-0",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
