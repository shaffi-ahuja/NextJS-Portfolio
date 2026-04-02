import { NextResponse } from "next/server";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const { Redis } = require("@upstash/redis");
  return new Redis({ url, token });
}

export async function GET() {
  try {
    const redis = getRedis();
    if (!redis) return NextResponse.json({ slugs: [] });

    const slugs: string[] = await redis.smembers("slugs");
    if (!slugs || slugs.length === 0) return NextResponse.json({ slugs: [] });

    const previews = await Promise.all(
      slugs.slice(0, 6).map(async (slug: string) => {
        const raw = await redis.get(`portfolio:${slug}`);
        if (!raw) return null;
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        return {
          slug,
          firstName: data?.Intro?.FirstName ?? "",
          lastName: data?.Intro?.LastName ?? "",
          oneLinerIntro: data?.Intro?.OneLinerIntro ?? "",
          profileImage: data?.Intro?.profileImage ?? "",
        };
      })
    );

    return NextResponse.json({ slugs: previews.filter(Boolean) });
  } catch {
    return NextResponse.json({ slugs: [] });
  }
}
