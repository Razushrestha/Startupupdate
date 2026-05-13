"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
} | null>(null);

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem("theme");
  return v === "dark" || v === "light" ? v : null;
}

let themeState: Theme = "light";
const themeListeners = new Set<() => void>();

function subscribeTheme(onStoreChange: () => void) {
  themeListeners.add(onStoreChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === "theme" || e.key === null) applyThemeFromStorage();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    themeListeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function emitTheme() {
  themeListeners.forEach((l) => l());
}

function getThemeSnapshot(): Theme {
  return themeState;
}

function applyThemeFromStorage() {
  if (typeof window === "undefined") return;
  const stored = readStoredTheme();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const next: Theme = stored ?? (prefersDark ? "dark" : "light");
  document.documentElement.classList.toggle("dark", next === "dark");
  if (themeState === next) return;
  themeState = next;
  emitTheme();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => "light" as Theme,
  );

  useLayoutEffect(() => {
    applyThemeFromStorage();
  }, []);

  const setTheme = useCallback((t: Theme) => {
    themeState = t;
    document.documentElement.classList.toggle("dark", t === "dark");
    try {
      window.localStorage.setItem("theme", t);
    } catch {
      /* ignore */
    }
    emitTheme();
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
