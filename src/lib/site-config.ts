export const SITE = {
  name: "StartupUpdate",
  tagline: "Startup Intelligence & Launch Platform for South Asia",
  mission:
    "Every startup gets a voice. Every innovation gets visibility.",
} as const;

/** Path under `public/` (leading slash) for brand mark across header, footer, metadata, JSON-LD. */
export const SITE_LOGO_SRC = "/assets/Startup.png" as const;

export const NAV_DESKTOP = [
  { href: "/", label: "Home" },
  { href: "/startups", label: "Startups" },
  { href: "/news", label: "News" },
  { href: "/insights", label: "Insights" },
] as const;

export const NAV_MOBILE = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/news", label: "News", icon: "news" as const },
  { href: "/startups", label: "Startups", icon: "startups" as const },
  { href: "/insights", label: "Insights", icon: "insights" as const },
  { href: "/profile", label: "Profile", icon: "profile" as const },
] as const;
