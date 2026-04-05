import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getPortfolio } from "@/lib/storage";
import type { Portfolio } from "@/lib/schema";
import ResumePDF from "@/components/pdf/ResumePDF";

async function getLegacyUser(slug: string): Promise<Portfolio | null> {
  const legacyMap: Record<string, () => Promise<{ default: unknown }>> = {
    shaffiahuja: () => import("@/data/ShaffiAhuja"),
    nimishmadan: () => import("@/data/NimishMadan"),
    sahilahuja1729: () => import("@/data/SahilAhuja"),
  };
  const loader = legacyMap[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default as Portfolio;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let portfolio: Portfolio | null = await getPortfolio(slug);
  if (!portfolio) portfolio = await getLegacyUser(slug);
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  try {
    const documentElement = ResumePDF({ portfolio });
    const buffer = await renderToBuffer(documentElement);

    // Convert Node Buffer → Uint8Array so NextResponse accepts it in Next.js 15
    const uint8Array = new Uint8Array(buffer);

    const name = `${portfolio.Intro.FirstName}_${portfolio.Intro.LastName}_Resume`;
    const filename = `${name.replace(/\s+/g, "_")}.pdf`;

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[resume/GET]", err);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      { status: 500 }
    );
  }
}
