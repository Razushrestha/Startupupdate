import Link from "next/link";
import { FooterVisitorCount } from "@/components/layout/footer-visitor-count";
import { SITE, SITE_LOGO_SRC } from "@/lib/site-config";
import { SiteLogo } from "@/components/layout/site-logo";

function getPublicSiteUrl() {
  const v = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return v ? v.replace(/\/$/, "") : "";
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

const footerLink = "text-sm text-[var(--foreground)] underline-offset-2 transition hover:underline";

const sectionTitle =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]";

export function SiteFooter() {
  const siteUrl = getPublicSiteUrl();

  return (
    <footer
      className="border-t border-[var(--border)] bg-[var(--muted)]/35 pb-24 pt-12 dark:bg-[var(--muted)]/20 lg:pb-12"
      role="contentinfo"
    >
      {siteUrl ? <FooterJsonLd siteUrl={siteUrl} /> : null}

      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 className="sr-only">Site footer</h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex items-center outline-offset-4">
              <SiteLogo />
              <span className="sr-only">{SITE.name}</span>
            </Link>
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{SITE.tagline}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              {SITE.mission} Independent coverage of startups, funding, and product news across Bangladesh, India,
              Nepal, Pakistan, Sri Lanka, and the broader South Asian innovation corridor.
            </p>
          </div>

          <nav className="lg:col-span-2" aria-labelledby="footer-nav-explore">
            <h3 id="footer-nav-explore" className={sectionTitle}>
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/" className={footerLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/startups" className={footerLink}>
                  Startups
                </Link>
              </li>
              <li>
                <Link href="/news" className={footerLink}>
                  News
                </Link>
              </li>
              <li>
                <Link href="/funding" className={footerLink}>
                  Funding
                </Link>
              </li>
              <li>
                <Link href="/insights" className={footerLink}>
                  Insights
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-labelledby="footer-nav-contribute">
            <h3 id="footer-nav-contribute" className={sectionTitle}>
              Contribute
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/submit" className={footerLink}>
                  Submit startup
                </Link>
              </li>
              <li>
                <Link href="/submit/news" className={footerLink}>
                  Submit startup news
                </Link>
              </li>
              <li>
                <Link href="/search" className={footerLink}>
                  Search
                </Link>
              </li>
              <li>
                <Link href="/profile" className={footerLink}>
                  Profile
                </Link>
              </li>
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className={sectionTitle}>Engagement</h3>
            <div className="mt-4">
              <FooterVisitorCount />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted-foreground)]">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
