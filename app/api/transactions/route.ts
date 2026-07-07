import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT t.*, a.ticker, a.name FROM transactions t
       JOIN assets a ON a.id = t.asset_id
       ORDER BY t.date DESC, t.id DESC`
    )
    .all();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { ticker, kind, date, qty, price, fees = 0, note = null } = body;
  if (!ticker || !kind || !date || !qty || price === undefined || price === null) {
    return NextResponse.json({ error: "Champs requis : ticker, kind, date, qty, price" }, { status: 400 });
  }
  if (kind !== "buy" && kind !== "sell") {
    return NextResponse.json({ error: "kind doit être buy ou sell" }, { status: 400 });
  }
  if (Number(qty) <= 0 || Number(price) < 0) {
    return NextResponse.json({ error: "Quantité et prix doivent être positifs" }, { status: 400 });
  }
  const db = getDb();
  const asset = db.prepare("SELECT id FROM assets WHERE ticker = ?").get(ticker) as
    | { id: number }
    | undefined;
  if (!asset) return NextResponse.json({ error: `Actif inconnu : ${ticker}` }, { status: 404 });
  const info = db
    .prepare(
      "INSERT INTO transactions (asset_id, kind, date, qty, price, fees, note) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(asset.id, kind, date, Number(qty), Number(price), Number(fees), note);
  return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
}
