import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = getDb()
    .prepare("SELECT * FROM checklist ORDER BY done ASC, due IS NULL, due ASC, id ASC")
    .all();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b.label) return NextResponse.json({ error: "label requis" }, { status: 400 });
  const info = getDb()
    .prepare("INSERT INTO checklist (label, category, due) VALUES (?, ?, ?)")
    .run(b.label, b.category ?? null, b.due ?? null);
  return NextResponse.json({ id: info.lastInsertRowid }, { status: 201 });
}

export async function PATCH(req: Request) {
  const b = await req.json();
  if (typeof b.id !== "number") return NextResponse.json({ error: "id requis" }, { status: 400 });
  getDb().prepare("UPDATE checklist SET done = ? WHERE id = ?").run(b.done ? 1 : 0, b.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  getDb().prepare("DELETE FROM checklist WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
