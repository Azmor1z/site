import { NextResponse } from "next/server";
import { searchTickers } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 1) return NextResponse.json([]);
  try {
    return NextResponse.json(await searchTickers(q));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Recherche indisponible" },
      { status: 502 }
    );
  }
}
