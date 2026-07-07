import { NextResponse } from "next/server";
import { getDb, AssetRow } from "@/lib/db";
import { getHistory } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const db = getDb();
  const asset = db.prepare("SELECT * FROM assets WHERE ticker = ?").get(ticker.toUpperCase()) as
    | AssetRow
    | undefined;
  if (!asset) return NextResponse.json({ error: "Actif introuvable" }, { status: 404 });
  const quote = db.prepare("SELECT * FROM quotes WHERE ticker = ?").get(asset.ticker) ?? null;
  const transactions = db
    .prepare("SELECT * FROM transactions WHERE asset_id = ? ORDER BY date DESC, id DESC")
    .all(asset.id);
  const history = getHistory(asset.ticker);
  return NextResponse.json({ asset, quote, transactions, history });
}

const EDITABLE = [
  "name", "block", "target_pct", "ai_factor",
  "buy_low", "buy_high", "tp1_low", "tp1_high", "obj_low", "obj_high",
  "stop_price", "stop_kind", "stop_note", "timing", "thesis", "risk", "notes", "active",
] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const body = await req.json();
  const db = getDb();
  const asset = db.prepare("SELECT id FROM assets WHERE ticker = ?").get(ticker.toUpperCase());
  if (!asset) return NextResponse.json({ error: "Actif introuvable" }, { status: 404 });

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const key of EDITABLE) {
    if (key in body) {
      sets.push(`${key} = ?`);
      values.push(body[key]);
    }
  }
  if (sets.length === 0) return NextResponse.json({ error: "Aucun champ modifiable" }, { status: 400 });
  values.push(ticker.toUpperCase());
  db.prepare(`UPDATE assets SET ${sets.join(", ")} WHERE ticker = ?`).run(...values);
  return NextResponse.json({ ok: true });
}
