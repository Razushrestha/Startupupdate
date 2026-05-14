import { adsensePublisherForAdsTxt } from "@/lib/ads-config";

/** AdSense / ads.txt — authorizes Google to sell your inventory. */
export function GET() {
  const pub = adsensePublisherForAdsTxt();
  if (!pub) {
    return new Response("# AdSense: set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID in .env.local\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const body = `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
