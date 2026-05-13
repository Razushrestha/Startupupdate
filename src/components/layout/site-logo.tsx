import Image from "next/image";
import { SITE, SITE_LOGO_SRC } from "@/lib/site-config";
import { cn } from "@/lib/cn";

const boxes = {
  /** Navbar — taller wordmark */
  featured:
    "relative inline-block h-12 w-[15.5rem] shrink-0 align-middle sm:h-[3.5rem] sm:w-[17rem]",
  /** Header fallback (unused if featured used) */
  header:
    "relative inline-block h-[3.25rem] w-[13rem] shrink-0 align-middle sm:h-14 sm:w-[15rem]",
  /** Footer */
  default: "relative inline-block h-11 w-[10.5rem] shrink-0 align-middle sm:h-12 sm:w-[11.75rem]",
  /** Admin */
  compact: "relative inline-block h-8 w-[7rem] shrink-0 align-middle",
} as const;

export function SiteLogo({
  className,
  decorative = false,
  priority,
  size = "default",
}: {
  className?: string;
  /** Hide image alt when the logo sits inside an element that already names the destination (e.g. home link `aria-label`). */
  decorative?: boolean;
  priority?: boolean;
  size?: keyof typeof boxes;
}) {
  const sizesAttr =
    size === "featured"
      ? "(max-width: 640px) 248px, 272px"
      : size === "header"
        ? "(max-width: 640px) 208px, 240px"
        : size === "compact"
          ? "112px"
          : "(max-width: 640px) 168px, 188px";

  return (
    <span className={cn(boxes[size], className)}>
      <Image
        src={SITE_LOGO_SRC}
        alt={decorative ? "" : `${SITE.name} logo`}
        fill
        className="object-contain object-left"
        sizes={sizesAttr}
        priority={priority}
      />
    </span>
  );
}
