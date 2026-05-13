"use client";

import { APP_LOCALES, isAppLocale } from "@/lib/i18n/locales";
import { uiT } from "@/lib/i18n/ui-dictionary";
import { useLocale } from "@/components/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <>
      <label className="sr-only" htmlFor="app-locale-select">
        {uiT(locale, "language")}
      </label>
      <select
        id="app-locale-select"
        value={locale}
        onChange={(e) => {
          const v = e.target.value;
          if (isAppLocale(v)) setLocale(v);
        }}
        className="cursor-pointer rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-2 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] max-w-[10rem] sm:max-w-[11rem]"
        aria-label={uiT(locale, "language")}
      >
        {APP_LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </>
  );
}
