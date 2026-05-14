import Link from "next/link";
import { FooterVisitorCount } from "@/components/layout/footer-visitor-count";
import { SITE, SITE_FACEBOOK_URL, SITE_LOGO_SRC } from "@/lib/site-config";
import { SiteLogo } from "@/components/layout/site-logo";

function getPublicSiteUrl() {
  const v = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return v ? v.replace(/\/$/, "") : "";
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function FooterJsonLd({ siteUrl }: { siteUrl: string }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: siteUrl,
    logo: `${siteUrl}${SITE_LOGO_SRC}`,
    description: SITE.mission,
    slogan: SITE.tagline,
    sameAs: [SITE_FACEBOOK_URL],
    areaServed: {
      "@type": "Place",
      name: "South Asia",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: siteUrl,
    description: SITE.tagline,
    publisher: { "@type": "Organization", name: SITE.name, url: siteUrl },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organization, website]),
      }}
    />
  );
}

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/startups", label: "Startups" },
  { href: "/news", label: "News" },
  { href: "/insights", label: "Insights" },
  { href: "/submit", label: "Submit" },
  { href: "/search", label: "Search" },
] as const;

const linkClass =
  "rounded-sm text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

export function SiteFooter() {
  const siteUrl = getPublicSiteUrl();

  return (
    <footer
      className="border-t border-[var(--border)]/80 bg-[var(--background)] pb-28 pt-14 lg:pb-12"
      role="contentinfo"
    >
      {siteUrl ? <FooterJsonLd siteUrl={siteUrl} /> : null}

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-7 px-4 text-center">
        <h2 className="sr-only">Site footer</h2>

        <Link
          href="/"
          aria-label={SITE.name}
          className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <SiteLogo decorative />
        </Link>

        <p className="max-w-md text-sm leading-relaxed text-[var(--muted-foreground)]">
          {SITE.tagline}
        </p>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={SITE_FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Startup Update on Facebook"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[#1877F2]/60 hover:text-[#1877F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          <FacebookIcon className="h-4 w-4" />
        </a>

        <div className="mt-2 flex w-full flex-col items-center gap-2 border-t border-[var(--border)]/70 pt-6 text-xs text-[var(--muted-foreground)] sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-[var(--foreground)]">{SITE.name}</span>. All rights reserved.
          </p>
          <FooterVisitorCount />
        </div>
      </div>
    </footer>
  );
}
