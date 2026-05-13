"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  APP_LOCALES,
  DEFAULT_LOCALE,
  type AppLocale,
  isAppLocale,
} from "@/lib/i18n/locales";

const STORAGE_KEY = "su-locale-v1";

type LocaleValue = {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
};

const LocaleContext = createContext<LocaleValue | null>(null);

let localeState: AppLocale = DEFAULT_LOCALE;
const localeListeners = new Set<() => void>();

function subscribeLocale(onStoreChange: () => void) {
  localeListeners.add(onStoreChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) applyLocaleFromStorage();
  };
  const onCustom = () => applyLocaleFromStorage();
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
    window.addEventListener("su-locale", onCustom);
  }
  return () => {
    localeListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("su-locale", onCustom);
    }
  };
}

function emitLocale() {
  localeListeners.forEach((l) => l());
}

function getLocaleSnapshot(): AppLocale {
  return localeState;
}

function readLocaleFromStorage(): AppLocale {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isAppLocale(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

function applyLocaleFromStorage() {
  if (typeof window === "undefined") return;
  const next = readLocaleFromStorage();
  if (localeState === next) return;
  localeState = next;
  emitLocale();
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    () => DEFAULT_LOCALE,
  );

  useLayoutEffect(() => {
    const next = readLocaleFromStorage();
    if (localeState !== next) {
      localeState = next;
      emitLocale();
    }
  }, []);

  const setLocale = useCallback((l: AppLocale) => {
    localeState = l;
    try {
      localStorage.setItem(STORAGE_KEY, l);
      window.dispatchEvent(new Event("su-locale"));
    } catch {
      /* ignore */
    }
    const meta = APP_LOCALES.find((x) => x.code === l);
    if (meta) document.documentElement.lang = meta.htmlLang;
    emitLocale();
  }, []);

  useEffect(() => {
    const meta = APP_LOCALES.find((x) => x.code === locale);
    if (meta) document.documentElement.lang = meta.htmlLang;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
