import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Sauvegarde complète des données (JSON téléchargeable). */
export async function GET() {
  const db = getDb();
  const dump = {
    exportedAt: new Date().toISOString(),
    assets: db.prepare("SELECT * FROM assets").all(),
    transactions: db.prepare("SELECT * FROM transactions").all(),
    checklist: db.prepare("SELECT * FROM checklist").all(),
    settings: db.prepare("SELECT * FROM settings").all(),
  };
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(dump, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="cockpit-us-sauvegarde-${date}.json"`,
    },
  });
}
