import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = getDb()
    .prepare("SELECT * FROM assets WHERE active = 1 ORDER BY sort_order ASC")
    .all();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b.ticker || !b.name || !b.block) {
    return NextResponse.json({ error: "Champs requis : ticker, name, block" }, { status: 400 });
  }
  const db = getDb();
  const exists = db.prepare("SELECT id FROM assets WHERE ticker = ?").get(b.ticker.toUpperCase());
  if (exists) return NextResponse.json({ error: "Ticker déjà présent" }, { status: 409 });
  const maxOrder = (db.prepare("SELECT MAX(sort_order) AS m FROM assets").get() as { m: number | null }).m ?? 0;
  const info = db
    .prepare(
      `INSERT INTO assets (ticker, name, block, target_pct, ai_factor,
        buy_low, buy_high, tp1_low, tp1_high, obj_low, obj_high,
        stop_price, stop_kind, stop_note, timing, thesis, risk, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      String(b.ticker).toUpperCase(), b.name, b.block, Number(b.target_pct ?? 0),
      b.ai_factor ? 1 : 0,
      b.buy_low ?? null, b.buy_high ?? null, b.tp1_low ?? null, b.tp1_high ?? null,
      b.obj_low ?? null, b.obj_high ?? null, b.stop_price ?? null,
      b.stop_kind ?? "close", b.stop_note ?? null, b.timing ?? null,
      b.thesis ?? null, b.risk ?? null, maxOrder + 1
    );
  return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
}
