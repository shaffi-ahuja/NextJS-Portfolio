import { NextRequest, NextResponse } from "next/server";
import { isSlugTaken } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug param required" }, { status: 400 });
  }

  // Basic format validation before hitting storage
  const isValidFormat = /^[a-z0-9-]{3,40}$/.test(slug);
  if (!isValidFormat) {
    return NextResponse.json({ available: false, reason: "invalid_format" });
  }

  const taken = await isSlugTaken(slug);
  return NextResponse.json({ available: !taken });
}
