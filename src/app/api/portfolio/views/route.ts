import { NextRequest, NextResponse } from "next/server";
import { getViews } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug param required" }, { status: 400 });
  }

  const views = await getViews(slug);
  return NextResponse.json({ slug, views });
}
