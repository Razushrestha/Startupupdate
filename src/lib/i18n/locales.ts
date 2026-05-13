export type AppLocale =
  | "en"
  | "bn"
  | "hi"
  | "ur"
  | "si"
  | "ne"
  | "ta"
  | "id"
  | "ms"
  | "ta-LK";

export const APP_LOCALES: { code: AppLocale; label: string; htmlLang: string }[] = [
  { code: "en", label: "English", htmlLang: "en" },
  { code: "bn", label: "বাংলা", htmlLang: "bn" },
  { code: "hi", label: "हिन्दी", htmlLang: "hi" },
  { code: "ur", label: "اردو", htmlLang: "ur" },
  { code: "si", label: "සිංහල", htmlLang: "si" },
  { code: "ne", label: "नेपाली", htmlLang: "ne" },
  { code: "ta", label: "தமிழ்", htmlLang: "ta" },
  { code: "ta-LK", label: "தமிழ் (LK)", htmlLang: "ta-LK" },
  { code: "id", label: "Bahasa Indonesia", htmlLang: "id" },
  { code: "ms", label: "Bahasa Melayu", htmlLang: "ms" },
];

export const DEFAULT_LOCALE: AppLocale = "en";

export function isAppLocale(v: string): v is AppLocale {
  return APP_LOCALES.some((l) => l.code === v);
}
