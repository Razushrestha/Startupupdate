"use client";

import { APP_LOCALES, isAppLocale } from "@/lib/i18n/locales";
import { uiT } from "@/lib/i18n/ui-dictionary";
import { useLocale } from "@/components/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
      <span className="sr-only">{uiT(locale, "language")}</span>
      <select
        value={locale}
        onChange={(e) => {
          const v = e.target.value;
          if (isAppLocale(v)) setLocale(v);
        }}
        className="max-w-[10rem] cursor-pointer border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-xs text-[var(--foreground)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)] sm:max-w-[11rem]"
        aria-label={uiT(locale, "language")}
      >
        {APP_LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
