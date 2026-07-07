import { NextResponse } from "next/server";
import { getDb, AssetRow } from "@/lib/db";
import { getHistory } from "@/lib/yahoo";
import { runMonteCarlo } from "@/lib/montecarlo";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CACHE_HOURS = 12;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const { searchParams } = new URL(req.url);
  const force = searchParams.get("force") === "1";
  const t = ticker.toUpperCase();
  const db = getDb();

  if (!force) {
    const cached = db.prepare("SELECT payload, updated_at FROM mc_cache WHERE ticker = ?").get(t) as
      | { payload: string; updated_at: string }
      | undefined;
    if (cached) {
      const ageH = (Date.now() - new Date(cached.updated_at).getTime()) / 3.6e6;
      if (ageH < CACHE_HOURS) {
        return NextResponse.json(JSON.parse(cached.payload));
      }
    }
  }

  const asset = db.prepare("SELECT * FROM assets WHERE ticker = ?").get(t) as AssetRow | undefined;
  if (!asset) return NextResponse.json({ error: "Actif introuvable" }, { status: 404 });

  const closes = getHistory(t).map((h) => h.close);
  const result = runMonteCarlo(t, closes, {
    tp1: asset.tp1_low,
    obj: asset.obj_low,
    stop: asset.stop_price,
  });

  if ("error" in result) return NextResponse.json(result, { status: 422 });

  db.prepare(
    "INSERT OR REPLACE INTO mc_cache (ticker, payload, updated_at) VALUES (?, ?, ?)"
  ).run(t, JSON.stringify(result), new Date().toISOString());

  return NextResponse.json(result);
}
