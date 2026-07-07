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
