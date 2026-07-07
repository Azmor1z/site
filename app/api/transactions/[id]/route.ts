import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const info = getDb().prepare("DELETE FROM transactions WHERE id = ?").run(Number(id));
  if (info.changes === 0) {
    return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
