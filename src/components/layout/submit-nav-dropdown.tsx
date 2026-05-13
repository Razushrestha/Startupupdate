"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function SubmitNavDropdown({
  className,
  align = "end",
  compact = false,
}: {
  className?: string;
  align?: "center" | "end";
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        id={`${menuId}-trigger`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? `${menuId}-menu` : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md bg-primary font-medium text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
        )}
      >
        <span>{compact ? "Submit" : "Submit Startup"}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={`${menuId}-menu`}
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
          className={cn(
            "absolute top-full z-[60] mt-1 min-w-[14rem] rounded-md border border-[var(--border)] bg-[var(--card)] py-1 shadow-md",
            align === "center" ? "left-1/2 -translate-x-1/2" : "right-0",
          )}
        >
          <Link
            role="menuitem"
            href="/submit"
            className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)]"
            onClick={() => setOpen(false)}
          >
            Submit Startup
          </Link>
          <Link
            role="menuitem"
            href="/submit/news"
            className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--muted)]"
            onClick={() => setOpen(false)}
          >
            Submit Startup News
          </Link>
        </div>
      )}
    </div>
  );
}
