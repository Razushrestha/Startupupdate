"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_MOBILE } from "@/lib/site-config";
import { cn } from "@/lib/cn";

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--background)] pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile primary"
    >
      <ul className="mx-auto flex max-w-xl items-end justify-between gap-0 px-1 pt-1 sm:px-2">
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
                  "block rounded-t-lg py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide transition-[color,background-color,border-color] sm:py-2 sm:text-[11px]",
                  active
                    ? "border-t-2 border-primary bg-primary/10 text-primary dark:bg-primary/15"
                    : "border-t-2 border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
