import Image from "next/image";
import type { Startup } from "@/lib/mock-data";
import { cn } from "@/lib/cn";

/** Company / brand mark (or approved executive photo). Square, shown beside the name. */
export function StartupLogoTile({
  startup,
  size = "md",
  className,
}: {
  startup: Pick<Startup, "logoLetter" | "name" | "brandLogoUrl">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "lg" ? 80 : size === "sm" ? 48 : 56;
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-sky-200/90 bg-sky-50 dark:border-blue-900/60 dark:bg-blue-950/50",
        className,
      )}
      style={{ width: dim, height: dim }}
    >
      {startup.brandLogoUrl ? (
        <Image
          src={startup.brandLogoUrl}
          alt={`${startup.name} logo`}
          width={dim}
          height={dim}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={cn("font-bold text-blue-800 dark:text-blue-200", textSize)}
          aria-hidden
        >
          {startup.logoLetter}
        </span>
      )}
    </div>
  );
}
