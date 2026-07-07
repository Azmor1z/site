import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ensureProxy } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

const LOGO_DIR = path.join(process.cwd(), "data", "logos");
const MISS_TTL_MS = 24 * 3600 * 1000; // on retente les échecs après 24 h

// Domaines connus (repli Clearbit quand les sources par ticker n'ont rien)
const DOMAINS: Record<string, string> = {
  NVDA: "nvidia.com", AVGO: "broadcom.com", AMD: "amd.com", GOOGL: "abc.xyz",
  JPM: "jpmorganchase.com", GS: "goldmansachs.com", MU: "micron.com",
  GEV: "gevernova.com", XOM: "exxonmobil.com", VRT: "vertiv.com",
  ABBV: "abbvie.com", LYFT: "lyft.com", CRWV: "coreweave.com",
  COHR: "coherent.com", IBIT: "ishares.com", NEM: "newmont.com", SGOV: "ishares.com",
};

function sources(ticker: string): string[] {
  const list = [
    `https://assets.parqet.com/logos/symbol/${ticker}?format=png&size=64`,
    `https://financialmodelingprep.com/image-stock/${ticker}.png`,
  ];
  const domain = DOMAINS[ticker];
  if (domain) list.push(`https://logo.clearbit.com/${domain}?size=64`);
  return list;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker: raw } = await params;
  const ticker = raw.toUpperCase().replace(/[^A-Z0-9.\-]/g, "");
  if (!ticker) return new NextResponse(null, { status: 400 });

  fs.mkdirSync(LOGO_DIR, { recursive: true });
  const file = path.join(LOGO_DIR, `${ticker}.png`);
  const missFile = path.join(LOGO_DIR, `${ticker}.miss`);

  if (fs.existsSync(file)) {
    return new NextResponse(new Uint8Array(fs.readFileSync(file)), {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    });
  }
  if (fs.existsSync(missFile)) {
    const age = Date.now() - fs.statSync(missFile).mtimeMs;
    if (age < MISS_TTL_MS) return new NextResponse(null, { status: 404 });
  }

  await ensureProxy();
  for (const url of sources(ticker)) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("image/")) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 200) continue; // pixel de tracking / placeholder
      fs.writeFileSync(file, buf);
      if (fs.existsSync(missFile)) fs.unlinkSync(missFile);
      return new NextResponse(new Uint8Array(buf), {
        headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
      });
    } catch {
      // source suivante
    }
  }
  fs.writeFileSync(missFile, "");
  return new NextResponse(null, { status: 404 });
}
