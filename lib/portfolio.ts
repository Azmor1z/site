import { getDb, AssetRow, QuoteRow, TransactionRow } from "./db";
import { computePosition, buildSignals, PositionView, Signal, PortfolioSummary } from "./positions";

export type { PositionView, Signal, PortfolioSummary };

export function getPortfolio(): PortfolioSummary {
  const db = getDb();
  const assets = db
    .prepare("SELECT * FROM assets WHERE active = 1 ORDER BY sort_order ASC")
    .all() as AssetRow[];
  const quotes = new Map(
    (db.prepare("SELECT * FROM quotes").all() as QuoteRow[]).map((q) => [q.ticker, q])
  );
  const txByAsset = new Map<number, TransactionRow[]>();
  for (const t of db.prepare("SELECT * FROM transactions").all() as TransactionRow[]) {
    const arr = txByAsset.get(t.asset_id) ?? [];
    arr.push(t);
    txByAsset.set(t.asset_id, arr);
  }

  const prelim = assets.map((asset) => {
    const quote = quotes.get(asset.ticker) ?? null;
    const pos = computePosition(txByAsset.get(asset.id) ?? []);
    const price = quote?.price ?? null;
    const marketValue = price !== null ? pos.qty * price : 0;
    const unrealizedPnl = marketValue - pos.invested;
    const prevClose = quote?.prev_close ?? null;
    const dayChange = price !== null && prevClose !== null ? pos.qty * (price - prevClose) : 0;
    return { asset, quote, ...pos, marketValue, unrealizedPnl, dayChange };
  });

  const totalValue = prelim.reduce((a, p) => a + p.marketValue, 0);
  const totalInvested = prelim.reduce((a, p) => a + p.invested, 0);
  const totalUnrealized = prelim.reduce((a, p) => a + p.unrealizedPnl, 0);
  const totalRealized = prelim.reduce((a, p) => a + p.realizedPnl, 0);
  const dayChange = prelim.reduce((a, p) => a + p.dayChange, 0);

  const targetUsd = Number(
    (db.prepare("SELECT value FROM settings WHERE key = 'portfolio_target_usd'").get() as
      | { value: string }
      | undefined)?.value ?? 0
  );
  const mature = targetUsd <= 0 || totalValue >= 0.5 * targetUsd;

  const positions: PositionView[] = prelim.map((p) => {
    const weightPct = totalValue > 0 ? (p.marketValue / totalValue) * 100 : 0;
    const base = {
      asset: p.asset,
      quote: p.quote,
      qty: p.qty,
      avgCost: p.avgCost,
      invested: p.invested,
      marketValue: p.marketValue,
      unrealizedPnl: p.unrealizedPnl,
      unrealizedPnlPct: p.invested > 0 ? (p.unrealizedPnl / p.invested) * 100 : null,
      realizedPnl: p.realizedPnl,
      dayChange: p.dayChange,
      weightPct,
      targetGapPct: weightPct - p.asset.target_pct,
    };
    return { ...base, signals: buildSignals(base, mature) };
  });

  const aiValue = positions
    .filter((p) => p.asset.ai_factor === 1)
    .reduce((a, p) => a + p.marketValue, 0);

  const lastUpdate = positions
    .map((p) => p.quote?.updated_at ?? null)
    .filter((d): d is string => d !== null)
    .sort()
    .pop() ?? null;

  return {
    totalValue,
    totalInvested,
    totalUnrealized,
    totalRealized,
    dayChange,
    dayChangePct:
      totalValue - dayChange > 0 ? (dayChange / (totalValue - dayChange)) * 100 : null,
    aiFactorPct: totalValue > 0 ? (aiValue / totalValue) * 100 : 0,
    ballastPct: totalValue > 0 ? 100 - (aiValue / totalValue) * 100 : 0,
    positions,
    lastQuoteUpdate: lastUpdate,
  };
}

/** Valeur quotidienne du portefeuille reconstruite : transactions × historique des cours. */
export function getPortfolioHistory(): { date: string; value: number; invested: number }[] {
  const db = getDb();
  const txs = (db
    .prepare(
      `SELECT t.date, t.kind, t.qty, t.price, t.fees, a.ticker
       FROM transactions t JOIN assets a ON a.id = t.asset_id
       ORDER BY t.date ASC, t.id ASC`
    )
    .all()) as { date: string; kind: string; qty: number; price: number; fees: number; ticker: string }[];
  if (txs.length === 0) return [];
  const firstDate = txs[0].date;

  const histRows = (db
    .prepare("SELECT ticker, date, close FROM history WHERE date >= ? ORDER BY date ASC")
    .all(firstDate)) as { ticker: string; date: string; close: number }[];

  const dates = [...new Set(histRows.map((r) => r.date))].sort();
  if (dates.length === 0) return [];
  const closesByDate = new Map<string, Map<string, number>>();
  for (const r of histRows) {
    let m = closesByDate.get(r.date);
    if (!m) closesByDate.set(r.date, (m = new Map()));
    m.set(r.ticker, r.close);
  }

  const qty = new Map<string, number>();
  const cost = new Map<string, number>();
  const lastClose = new Map<string, number>();
  let txIdx = 0;
  const out: { date: string; value: number; invested: number }[] = [];

  for (const date of dates) {
    // applique les transactions jusqu'à cette date incluse
    while (txIdx < txs.length && txs[txIdx].date <= date) {
      const t = txs[txIdx++];
      const q = qty.get(t.ticker) ?? 0;
      const c = cost.get(t.ticker) ?? 0;
      if (t.kind === "buy") {
        qty.set(t.ticker, q + t.qty);
        cost.set(t.ticker, c + t.qty * t.price + t.fees);
      } else {
        const avg = q > 0 ? c / q : 0;
        const sell = Math.min(t.qty, q);
        qty.set(t.ticker, q - sell);
        cost.set(t.ticker, Math.max(c - sell * avg, 0));
      }
    }
    const closes = closesByDate.get(date);
    if (closes) for (const [tk, cl] of closes) lastClose.set(tk, cl);
    let value = 0;
    let invested = 0;
    for (const [tk, q] of qty) {
      if (q <= 0) continue;
      const cl = lastClose.get(tk);
      if (cl !== undefined) value += q * cl;
      invested += cost.get(tk) ?? 0;
    }
    out.push({ date, value, invested });
  }
  return out;
}
