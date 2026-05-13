"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "su-v1-visit-recorded";

type ApiBody = {
  count: number;
  store?: string;
  hint?: string;
};

export function FooterVisitorCount() {
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
    <div
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
      title={
        unconfigured
          ? "Add Upstash Redis env vars on your host to persist visits in production."
          : "Each browser session counts once toward total visits."
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        Site visits
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">{display}</p>
      <p className="mt-2 text-xs leading-snug text-[var(--muted-foreground)]">
        {unconfigured
          ? "Configure visitor storage for live counts."
          : "Approx. sessions, once per browser visit."}
      </p>
    </div>
  );
}
