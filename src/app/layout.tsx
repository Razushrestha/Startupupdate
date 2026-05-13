import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/components/locale-provider";
import { Shell } from "@/components/layout/shell";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE, SITE_LOGO_SRC } from "@/lib/site-config";
import { GLOBAL_KEYWORDS, SITE_SEO_DESCRIPTION, websiteJsonLd } from "@/lib/seo-config";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name}, ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  applicationName: SITE.name,
  description: SITE_SEO_DESCRIPTION,
  keywords: GLOBAL_KEYWORDS,
  authors: [{ name: SITE.name, url: siteUrl }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE.name,
    title: `${SITE.name}, ${SITE.tagline}`,
    description: SITE_SEO_DESCRIPTION,
    url: siteUrl,
    images: [{ url: SITE_LOGO_SRC, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}: ${SITE.tagline}`,
    description: SITE_SEO_DESCRIPTION,
    images: [SITE_LOGO_SRC],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  icons: {
    icon: SITE_LOGO_SRC,
    shortcut: SITE_LOGO_SRC,
    apple: SITE_LOGO_SRC,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <LocaleProvider>
            <JsonLd data={websiteJsonLd()} />
            <Shell>{children}</Shell>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
