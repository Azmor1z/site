import type { AssetRow, QuoteRow, TransactionRow } from "./db";

export interface Signal {
  level: "buy" | "success" | "warning" | "danger" | "info";
  label: string;
}

export interface PositionView {
  asset: AssetRow;
  quote: QuoteRow | null;
  qty: number;
  avgCost: number | null; // PRU
  invested: number; // coût total des titres encore détenus
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number | null;
  realizedPnl: number;
  dayChange: number;
  weightPct: number; // % de la valeur totale du portefeuille
  targetGapPct: number; // weight - target
  signals: Signal[];
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalUnrealized: number;
  totalRealized: number;
  dayChange: number;
  dayChangePct: number | null;
  aiFactorPct: number;
  ballastPct: number;
  positions: PositionView[];
  lastQuoteUpdate: string | null;
}

/** Position à coût moyen pondéré : les ventes sortent au PRU et réalisent le P&L. */
export function computePosition(txs: TransactionRow[]): {
  qty: number;
  avgCost: number | null;
  invested: number;
  realizedPnl: number;
} {
  let qty = 0;
  let cost = 0; // coût total du lot courant
  let realized = 0;
  const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
  for (const t of sorted) {
    if (t.kind === "buy") {
      qty += t.qty;
      cost += t.qty * t.price + t.fees;
    } else {
      const avg = qty > 0 ? cost / qty : 0;
      const sellQty = Math.min(t.qty, qty);
      realized += sellQty * (t.price - avg) - t.fees;
      cost -= sellQty * avg;
      qty -= sellQty;
      if (qty <= 1e-9) {
        qty = 0;
        cost = 0;
      }
    }
  }
  return {
    qty,
    avgCost: qty > 0 ? cost / qty : null,
    invested: cost,
    realizedPnl: realized,
  };
}

export function buildSignals(
  p: Omit<PositionView, "signals">,
  // L'écrêtage n'a de sens qu'une fois le portefeuille suffisamment déployé :
  // pendant la construction, chaque ligne dépasse mécaniquement 1,5× sa cible.
  portfolioMature = true
): Signal[] {
  const s: Signal[] = [];
  const a = p.asset;
  const price = p.quote?.price ?? null;
  if (price === null) return s;

  if (a.stop_price !== null && price <= a.stop_price) {
    const kind = a.stop_kind === "weekly_close" ? "clôture hebdo" : "clôture";
    s.push({ level: "danger", label: `⛔ Sous le stop ${a.stop_price} (${kind}) — vérifier l'invalidation` });
  } else if (a.stop_price !== null && price <= a.stop_price * 1.04) {
    s.push({ level: "warning", label: `Proche du stop ${a.stop_price} (à ${(((price - a.stop_price) / a.stop_price) * 100).toFixed(1)} %)` });
  }

  if (a.obj_low !== null && price >= a.obj_low) {
    s.push({ level: "success", label: `Objectif ${a.obj_low}–${a.obj_high} atteint` });
  } else if (a.tp1_low !== null && price >= a.tp1_low) {
    s.push({ level: "success", label: `TP1 ${a.tp1_low}–${a.tp1_high} atteint — alléger 25-30 %` });
  }

  if (a.buy_low !== null && a.buy_high !== null) {
    if (price >= a.buy_low && price <= a.buy_high) {
      s.push({ level: "buy", label: `Dans la zone d'achat ${a.buy_low}–${a.buy_high}` });
    } else if (price < a.buy_low) {
      s.push({ level: "warning", label: `Sous la zone d'achat (${a.buy_low}–${a.buy_high}) — vérifier la thèse avant de renforcer` });
    }
  }

  if (portfolioMature && p.qty > 0 && a.target_pct > 0 && p.weightPct > 1.5 * a.target_pct) {
    s.push({ level: "warning", label: `Écrêtage : ${p.weightPct.toFixed(1)} % > 1,5× cible (${a.target_pct} %) → ramener à la cible` });
  }

  if (p.qty > 0 && p.unrealizedPnlPct !== null && p.unrealizedPnlPct >= 100) {
    s.push({ level: "success", label: "+100 % → vendre 25-30 % (règle take profit)" });
  }

  if (
    p.qty > 0 &&
    (a.block === "speculatif" || a.block === "crypto") &&
    p.unrealizedPnlPct !== null &&
    p.unrealizedPnlPct <= -35
  ) {
    s.push({ level: "danger", label: "Spéculatif -35 % → couper la moitié (100 % si thèse cassée)" });
  }

  const ma200 = p.quote?.ma200 ?? null;
  if (ma200 !== null) {
    const d = ((price - ma200) / ma200) * 100;
    if (d < 0) s.push({ level: "info", label: `${Math.abs(d).toFixed(1)} % sous la MM200` });
  }

  return s;
}

