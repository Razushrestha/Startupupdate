"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const SESSION_KEY = "su-v1-visit-recorded";

type ApiBody = {
  count: number;
  store?: string;
  hint?: string;
};

type FooterVisitorCountProps = {
  className?: string;
};

export function FooterVisitorCount({ className }: FooterVisitorCountProps) {
  const [count, setCount] = useState<number | null>(null);
  const [pending, setPending] = useState(true);
  const [unconfigured, setUnconfigured] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const already = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY);
        if (already) {
          const res = await fetch("/api/visitors", { method: "GET", cache: "no-store" });
          const data = (await res.json()) as ApiBody;
          if (!cancelled) {
            setCount(data.count);
            setUnconfigured(data.store === "unconfigured");
          }
          return;
        }
        const res = await fetch("/api/visitors", { method: "POST", cache: "no-store" });
        const data = (await res.json()) as ApiBody;
        if (!cancelled) {
          setCount(data.count);
          setUnconfigured(data.store === "unconfigured");
          sessionStorage.setItem(SESSION_KEY, "1");
        }
      } catch {
        if (!cancelled) {
          setCount(null);
        }
      } finally {
        if (!cancelled) setPending(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const display = pending ? "…" : count !== null ? count.toLocaleString() : "n/a";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]",
        className,
      )}
      title={
        unconfigured
          ? "Add Upstash Redis env vars on your host to persist visits in production."
          : "Each browser session counts once toward total visits."
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden />
      <span>
        <span className="font-semibold tabular-nums text-[var(--foreground)]">{display}</span>{" "}
        <span>visits</span>
      </span>
    </span>
  );
}
