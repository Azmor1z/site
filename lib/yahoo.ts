import { getDb } from "./db";

// Support des proxys d'entreprise : Node fetch (undici) n'honore pas
// HTTPS_PROXY par défaut. Sans proxy configuré, ne change rien.
let proxyReady: Promise<void> | null = null;
export function ensureProxy(): Promise<void> {
  if (!proxyReady) {
    proxyReady = (async () => {
      if (process.env.HTTPS_PROXY || process.env.https_proxy) {
        const { setGlobalDispatcher, EnvHttpProxyAgent } = await import("undici");
        setGlobalDispatcher(new EnvHttpProxyAgent());
      }
    })();
  }
  return proxyReady;
}

type YF = InstanceType<(typeof import("yahoo-finance2"))["default"]>;
let _yf: YF | null = null;
async function yf(): Promise<YF> {
  await ensureProxy();
  if (!_yf) {
    const mod = await import("yahoo-finance2");
    _yf = new mod.default({ suppressNotices: ["yahooSurvey", "ripHistorical"] });
  }
  return _yf;
}

export interface RefreshResult {
  ticker: string;
  ok: boolean;
  error?: string;
}

function sma(closes: number[], n: number): number | null {
  if (closes.length < n) return null;
  const slice = closes.slice(-n);
  return slice.reduce((a, b) => a + b, 0) / n;
}

/** Rafraîchit cotation + historique 2 ans d'un ticker, calcule MM50/MM200, stocke en base. */
export async function refreshTicker(ticker: string): Promise<RefreshResult> {
  const db = getDb();
  const y = await yf();
  try {
    const period1 = new Date();
    period1.setFullYear(period1.getFullYear() - 2);
    const [quote, chart] = await Promise.all([
      y.quote(ticker),
      y.chart(ticker, { period1, interval: "1d" }),
    ]);

    const rows = (chart.quotes ?? []).filter((q) => q.close != null);
    const insertHist = db.prepare(
      "INSERT OR REPLACE INTO history (ticker, date, close) VALUES (?, ?, ?)"
    );
    const tx = db.transaction(() => {
      for (const r of rows) {
        insertHist.run(ticker, new Date(r.date).toISOString().slice(0, 10), r.close);
      }
    });
    tx();

    const closes = rows.map((r) => r.close as number);
    const price = quote.regularMarketPrice ?? closes[closes.length - 1] ?? null;

    db.prepare(`
      INSERT OR REPLACE INTO quotes
        (ticker, price, prev_close, change_pct, day_low, day_high,
         week52_low, week52_high, ma50, ma200, market_state, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ticker,
      price,
      quote.regularMarketPreviousClose ?? null,
      quote.regularMarketChangePercent ?? null,
      quote.regularMarketDayLow ?? null,
      quote.regularMarketDayHigh ?? null,
      quote.fiftyTwoWeekLow ?? null,
      quote.fiftyTwoWeekHigh ?? null,
      sma(closes, 50),
      sma(closes, 200),
      quote.marketState ?? null,
      new Date().toISOString()
    );
    return { ticker, ok: true };
  } catch (e) {
    return { ticker, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Rafraîchit tous les actifs actifs, avec une petite pause pour ménager l'API. */
export async function refreshAll(): Promise<RefreshResult[]> {
  const db = getDb();
  const tickers = (db.prepare("SELECT ticker FROM assets WHERE active = 1").all() as { ticker: string }[])
    .map((r) => r.ticker);
  const results: RefreshResult[] = [];
  for (const t of tickers) {
    results.push(await refreshTicker(t));
    await new Promise((r) => setTimeout(r, 150));
  }
  return results;
}

export function getHistory(ticker: string, days?: number): { date: string; close: number }[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT date, close FROM history WHERE ticker = ? ORDER BY date ASC")
    .all(ticker) as { date: string; close: number }[];
  return days ? rows.slice(-days) : rows;
}

/** Rafraîchissement léger : cotations seules, en un appel groupé (pour l'auto-refresh). */
export async function refreshQuotes(): Promise<RefreshResult[]> {
  const db = getDb();
  const tickers = (db.prepare("SELECT ticker FROM assets WHERE active = 1").all() as { ticker: string }[])
    .map((r) => r.ticker);
  if (tickers.length === 0) return [];
  const y = await yf();
  try {
    const quotes = await y.quote(tickers);
    const update = db.prepare(`
      UPDATE quotes SET price = ?, prev_close = ?, change_pct = ?, day_low = ?, day_high = ?,
        week52_low = ?, week52_high = ?, market_state = ?, updated_at = ?
      WHERE ticker = ?
    `);
    const insert = db.prepare(`
      INSERT OR IGNORE INTO quotes (ticker, price, prev_close, change_pct, day_low, day_high,
        week52_low, week52_high, market_state, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    const seen = new Set<string>();
    for (const q of Array.isArray(quotes) ? quotes : [quotes]) {
      if (!q?.symbol) continue;
      seen.add(q.symbol);
      const args = [
        q.regularMarketPrice ?? null,
        q.regularMarketPreviousClose ?? null,
        q.regularMarketChangePercent ?? null,
        q.regularMarketDayLow ?? null,
        q.regularMarketDayHigh ?? null,
        q.fiftyTwoWeekLow ?? null,
        q.fiftyTwoWeekHigh ?? null,
        q.marketState ?? null,
        now,
      ];
      const res = update.run(...args, q.symbol);
      if (res.changes === 0) {
        insert.run(q.symbol, ...args);
      }
    }
    return tickers.map((t) => ({ ticker: t, ok: seen.has(t) }));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return tickers.map((t) => ({ ticker: t, ok: false, error: msg }));
  }
}

export interface SearchHit {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

/** Recherche de titres (actions/ETF) via Yahoo Finance. */
export async function searchTickers(q: string): Promise<SearchHit[]> {
  const y = await yf();
  const res = await y.search(q, { quotesCount: 8, newsCount: 0 });
  return (res.quotes ?? [])
    .filter((r): r is typeof r & { symbol: string } => "symbol" in r && !!r.symbol)
    .filter((r) => ["EQUITY", "ETF"].includes((r as { quoteType?: string }).quoteType ?? ""))
    .map((r) => {
      const rec = r as { symbol: string; shortname?: string; longname?: string; exchDisp?: string; quoteType?: string };
      return {
        symbol: rec.symbol,
        name: rec.shortname ?? rec.longname ?? rec.symbol,
        exchange: rec.exchDisp ?? "",
        type: rec.quoteType === "ETF" ? "ETF" : "Action",
      };
    });
}
