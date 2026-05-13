import { NextResponse } from "next/server";
import { getVisitorCount, incrementVisitorCount, visitorStoreKind } from "@/lib/visitor-count";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await getVisitorCount();
    return NextResponse.json({ count, store: visitorStoreKind() });
  } catch {
    return NextResponse.json({ count: 0, store: "error" as const }, { status: 500 });
  }
}

export async function POST() {
  try {
    const count = await incrementVisitorCount();
    return NextResponse.json({ count, store: visitorStoreKind() });
  } catch {
    const count = await getVisitorCount().catch(() => 0);
    return NextResponse.json(
      {
        count,
        store: visitorStoreKind(),
        hint: "Add Upstash Redis (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) for production; local dev uses data/site-visitors.json.",
      },
      { status: 503 },
    );
  }
}
