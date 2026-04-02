import { NextRequest, NextResponse } from "next/server";
import { PortfolioSchema } from "@/lib/schema";
import { savePortfolio, isSlugTaken, checkRateLimit } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting ──────────────────────────────────────────────
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    const { allowed, remaining } = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many portfolios created. Try again tomorrow." },
        { status: 429 }
      );
    }

    // ── Parse & validate body ─────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = PortfolioSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const portfolio = parsed.data;

    // ── Slug uniqueness ───────────────────────────────────────────
    const taken = await isSlugTaken(portfolio.slug);
    if (taken) {
      return NextResponse.json(
        { error: "This URL is already taken. Please choose a different one." },
        { status: 409 }
      );
    }

    // ── Persist ───────────────────────────────────────────────────
    await savePortfolio(portfolio);

    return NextResponse.json(
      {
        success: true,
        slug: portfolio.slug,
        url: `/user/${portfolio.slug}`,
        remaining,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // KV not configured - give a clear developer message
    if (message === "REDIS_NOT_CONFIGURED") {
      return NextResponse.json(
        {
          error:
            "Storage not configured. Create a free Upstash Redis database at console.upstash.com and add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to your environment variables.",
        },
        { status: 503 }
      );
    }

    console.error("[portfolio/POST]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
