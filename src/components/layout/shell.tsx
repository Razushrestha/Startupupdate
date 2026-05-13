import type { ReactNode } from "react";
import { AdSlot } from "@/components/ads/ad-slot";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 pb-28 pt-8 lg:pb-12">
        {children}
      </div>
      <SiteFooter />
      {/* Mobile anchor ad (pair with bottom nav, cap total ads per route) */}
      <AdSlot variant="anchor" />
      <MobileBottomNav />
    </>
  );
}
