import { Portfolio } from "./schema";

const PORTFOLIO_PREFIX = "portfolio:";
const SLUG_SET_KEY = "slugs";
const RATE_LIMIT_PREFIX = "ratelimit:";
const VIEWS_PREFIX = "views:";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 86400;

// ─── Redis client ─────────────────────────────────────────────────────────────
// Created lazily per-call so env vars are always read at runtime, not build time

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null; // Not configured — all functions degrade gracefully
  }

  // Dynamic import is NOT needed — @upstash/redis is safe to import at top level
  // We just delay instantiation until here so env vars are loaded
  const { Redis } = require("@upstash/redis");
  return new Redis({ url, token });
}

// ─── Save ─────────────────────────────────────────────────────────────────────

export async function savePortfolio(portfolio: Portfolio): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("REDIS_NOT_CONFIGURED");

  await redis.set(`${PORTFOLIO_PREFIX}${portfolio.slug}`, JSON.stringify(portfolio));
  await redis.sadd(SLUG_SET_KEY, portfolio.slug);
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function getPortfolio(slug: string): Promise<Portfolio | null> {
  const redis = getRedis();
  if (!redis) return null;

  const raw = await redis.get(`${PORTFOLIO_PREFIX}${slug}`);
  if (!raw) return null;

  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

// ─── Slug availability ────────────────────────────────────────────────────────

export async function isSlugTaken(slug: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  const isMember = await redis.sismember(SLUG_SET_KEY, slug);
  return Boolean(isMember);
}

// ─── Rate limiting ────────────────────────────────────────────────────────────

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const redis = getRedis();
  if (!redis) return { allowed: true, remaining: RATE_LIMIT_MAX };

  const key = `${RATE_LIMIT_PREFIX}${ip}`;
  const current = (await redis.get(key)) ?? 0;

  if (Number(current) >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  const newCount = Number(current) + 1;
  await redis.set(key, newCount, { ex: RATE_LIMIT_WINDOW });

  return { allowed: true, remaining: RATE_LIMIT_MAX - newCount };
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function incrementViews(slug: string): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  return await redis.incr(`${VIEWS_PREFIX}${slug}`);
}

export async function getViews(slug: string): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;
  return (await redis.get(`${VIEWS_PREFIX}${slug}`)) ?? 0;
}

// ─── Slug generator ───────────────────────────────────────────────────────────

export function generateSlug(firstName: string, lastName: string): string {
  const base = `${firstName}${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}${suffix}`;
}
