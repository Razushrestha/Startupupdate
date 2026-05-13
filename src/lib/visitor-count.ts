import { Redis } from "@upstash/redis";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const REDIS_KEY = "site:total_visits";
const FILE_PATH = path.join(process.cwd(), "data", "site-visitors.json");

function redisEnabled() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function fileEnabled() {
  return process.env.NODE_ENV === "development";
}

async function readFileCount(): Promise<number> {
  try {
    const raw = await readFile(FILE_PATH, "utf8");
    const j = JSON.parse(raw) as { count?: unknown };
    return typeof j.count === "number" && Number.isFinite(j.count) ? j.count : 0;
  } catch {
    return 0;
  }
}

async function writeFileCount(next: number): Promise<void> {
  await mkdir(path.dirname(FILE_PATH), { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify({ count: next }, null, 2), "utf8");
}

export function visitorStoreKind(): "redis" | "file" | "unconfigured" {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return "redis";
  }
  if (process.env.NODE_ENV === "development") return "file";
  return "unconfigured";
}

export async function getVisitorCount(): Promise<number> {
  if (redisEnabled()) {
    const redis = Redis.fromEnv();
    const v = await redis.get<number | string>(REDIS_KEY);
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  }
  if (fileEnabled()) {
    return readFileCount();
  }
  return 0;
}

export async function incrementVisitorCount(): Promise<number> {
  if (redisEnabled()) {
    const redis = Redis.fromEnv();
    return redis.incr(REDIS_KEY);
  }
  if (fileEnabled()) {
    const next = (await readFileCount()) + 1;
    await writeFileCount(next);
    return next;
  }
  throw new Error("VISITOR_COUNT_UNAVAILABLE");
}
