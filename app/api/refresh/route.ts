import { NextResponse } from "next/server";
import { refreshAll, refreshTicker, refreshQuotes } from "@/lib/yahoo";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  const mode = searchParams.get("mode");
  const results = ticker
    ? [await refreshTicker(ticker)]
    : mode === "quotes"
      ? await refreshQuotes()
      : await refreshAll();
  const failed = results.filter((r) => !r.ok);
  return NextResponse.json({
    ok: failed.length === 0,
    refreshed: results.filter((r) => r.ok).map((r) => r.ticker),
    failed,
  });
}
