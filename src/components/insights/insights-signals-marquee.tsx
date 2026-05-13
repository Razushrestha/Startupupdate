const SIGNALS = [
  "Founders naming fatigue without apologizing for it",
  "Investors asking for proof, then staying for the ritual of weekly truth",
  "Teams choosing slowness when speed would fracture trust…",
  "Revenue that arrives with relief, not panic",
  "CEOs who text “I don’t know yet” and still sleep",
  "Markets that reward compliance as craft, not theatre",
  "Communities where second chances have receipts",
];

export function InsightsSignalsMarquee() {
  const doubled = [...SIGNALS, ...SIGNALS];
  return (
    <div className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--muted)]/35 py-3">
      <div className="insights-marquee flex gap-10 whitespace-nowrap">
        {doubled.map((line, i) => (
          <span
            key={`${line}-${i}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--foreground)]/25" aria-hidden />
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
