"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  TickerAvatar,
  SignalBadge,
  SignalDot,
  DeltaChip,
  Button,
  Spinner,
  Sparkline,
  BLOCK_COLORS,
  blockLabel,
} from "@/components/ui";
import { AddAssetButton } from "@/components/add-asset";
import { PortfolioChart } from "@/components/charts";
import { fmtUsd, fmtPct, fmtNum, fmtDateTime, pnlClass } from "@/lib/format";
import { BLOCK_ORDER, RULES } from "@/lib/memo-data";
import type { PortfolioSummary, PositionView } from "@/lib/positions";

type PfHistory = { date: string; value: number; invested: number }[];

export default function Dashboard() {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<PfHistory>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [live, setLive] = useState(true);

  const load = useCallback(async () => {
    const [p, h] = await Promise.all([
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/portfolio/history").then((r) => r.json()),
    ]);
    setData(p);
    setHistory(h);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Actualisation automatique : cotations groupées toutes les 60 s (onglet visible)
  useEffect(() => {
    if (!live) return;
    const tick = async () => {
      if (document.hidden) return;
      try {
        await fetch("/api/refresh?mode=quotes", { method: "POST" });
        await load();
      } catch {
        // silencieux : nouvel essai à la prochaine minute
      }
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [live, load]);

  const refresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/refresh", { method: "POST" });
      const j = await res.json();
      if (j.failed?.length) {
        setError(`Échec pour : ${j.failed.map((f: { ticker: string }) => f.ticker).join(", ")}`);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setRefreshing(false);
    }
  };

  if (!data) {
    return <div className="flex h-64 items-center justify-center text-ink-3"><Spinner /></div>;
  }

  const hasQuotes = data.positions.some((p) => p.quote?.price != null);
  const invested = data.totalValue > 0;
  const alerts = data.positions.flatMap((p) =>
    p.signals
      .filter((s) => s.level !== "info")
      .map((s) => ({ ticker: p.asset.ticker, block: p.asset.block, signal: s }))
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ——— Héro ——— */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-ink-3">
            Portefeuille
            {data.lastQuoteUpdate && (
              <span className="ml-2 opacity-70">· cours du {fmtDateTime(data.lastQuoteUpdate)}</span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLive(!live)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                live ? "bg-good/10 text-pos" : "bg-white/6 text-ink-3"
              }`}
              title={live ? "Actualisation automatique chaque minute — cliquer pour mettre en pause" : "Actualisation en pause — cliquer pour reprendre"}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${live ? "live-dot" : ""}`}
                style={{ background: live ? "var(--pos)" : "var(--ink-3)" }}
              />
              {live ? "En direct" : "En pause"}
            </button>
            <Button onClick={refresh} disabled={refreshing} variant="ghost">
              {refreshing ? <>Actualisation… <Spinner /></> : "⟳ Tout recharger"}
            </Button>
            <AddAssetButton onAdded={load} />
          </div>
        </div>
        <div className="mt-1 text-[40px] font-semibold leading-tight tabular">
          {fmtUsd(data.totalValue)}
        </div>
        {invested && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DeltaChip
              amount={fmtUsd(data.dayChange, 0)}
              pct={fmtPct(data.dayChangePct, 2, true)}
              label="aujourd'hui"
            />
            <DeltaChip
              amount={fmtUsd(data.totalUnrealized, 0)}
              pct={
                data.totalInvested > 0
                  ? fmtPct((data.totalUnrealized / data.totalInvested) * 100, 1, true)
                  : undefined
              }
              label="latent"
            />
          </div>
        )}
      </div>

      {error && <div className="card p-3 text-xs text-serious">{error}</div>}

      {!hasQuotes && (
        <Card>
          <p className="text-sm leading-relaxed text-ink-2">
            Bienvenue. Le portefeuille cible du mémo (16 lignes, zones d&apos;achat, stops, TP)
            est pré-chargé. Commencez par <strong>« Actualiser »</strong> pour récupérer les cours,
            puis saisissez vos achats dans{" "}
            <Link href="/transactions" className="text-accent underline">Transactions</Link>.
          </p>
        </Card>
      )}

      {/* ——— Courbe de valeur ——— */}
      {history.length >= 2 && <PortfolioChart data={history} />}

      {invested && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-3">
          <span>Investi <strong className="tabular text-ink-2">{fmtUsd(data.totalInvested, 0)}</strong></span>
          <span>
            P&L réalisé{" "}
            <strong className={`tabular ${pnlClass(data.totalRealized)}`}>{fmtUsd(data.totalRealized, 0)}</strong>
          </span>
          <span>Facteur IA <strong className="tabular text-ink-2">{fmtPct(data.aiFactorPct, 1)}</strong></span>
          <span>Ballast <strong className="tabular text-ink-2">{fmtPct(data.ballastPct, 1)}</strong></span>
        </div>
      )}

      {/* ——— Signaux ——— */}
      {alerts.length > 0 && <AlertsCard alerts={alerts} />}

      {/* ——— Allocation ——— */}
      <AllocationCard positions={data.positions} totalValue={data.totalValue} />

      {/* ——— Lignes ——— */}
      <HoldingsList positions={data.positions} />

      <Card
        title="Règles du mémo"
        action={
          <button onClick={() => setShowRules(!showRules)} className="text-xs text-accent">
            {showRules ? "Masquer" : "Afficher"}
          </button>
        }
      >
        {showRules ? (
          <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-ink-2">
            {RULES.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-ink-3">
            Écrêtage 1,5× · règle de cycle MU · spéculatif -35 % · TP +100 % · trigger macro · revue trimestrielle…
          </p>
        )}
      </Card>
    </div>
  );
}

/* ——— Signaux ——— */
function AlertsCard({
  alerts,
}: {
  alerts: { ticker: string; block: string; signal: PositionView["signals"][number] }[];
}) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? alerts : alerts.slice(0, 5);
  return (
    <Card
      title={`Signaux (${alerts.length})`}
      action={
        alerts.length > 5 && (
          <button onClick={() => setShowAll(!showAll)} className="text-xs text-accent">
            {showAll ? "Réduire" : "Tout voir"}
          </button>
        )
      }
    >
      <ul className="space-y-2">
        {shown.map((a, i) => (
          <li key={i} className="flex items-center gap-2.5 text-xs">
            <TickerAvatar ticker={a.ticker} block={a.block} size={24} />
            <Link href={`/asset/${a.ticker}`} className="w-12 shrink-0 font-semibold hover:text-accent">
              {a.ticker}
            </Link>
            <SignalBadge signal={a.signal} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ——— Allocation ——— */
function AllocationCard({
  positions,
  totalValue,
}: {
  positions: PositionView[];
  totalValue: number;
}) {
  const byBlock = useMemo(() => {
    return BLOCK_ORDER.map((block) => {
      const value = positions
        .filter((p) => p.asset.block === block)
        .reduce((a, p) => a + p.marketValue, 0);
      const target = positions
        .filter((p) => p.asset.block === block)
        .reduce((a, p) => a + p.asset.target_pct, 0);
      return { block, name: blockLabel(block), value, target };
    }).filter((b) => b.target > 0 || b.value > 0);
  }, [positions]);

  const invested = totalValue > 0;

  return (
    <Card title="Allocation">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        {invested && (
          <div className="relative h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byBlock.filter((b) => b.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={76}
                  paddingAngle={2}
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {byBlock
                    .filter((b) => b.value > 0)
                    .map((b) => (
                      <Cell key={b.block} fill={BLOCK_COLORS[b.block]} />
                    ))}
                </Pie>
                <Tooltip
                  formatter={(v) => fmtUsd(v as number)}
                  contentStyle={{
                    background: "#1b1e26",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-ink-3">Total</span>
              <span className="text-sm font-bold tabular">{fmtUsd(totalValue, 0)}</span>
            </div>
          </div>
        )}
        <ul className="w-full space-y-2.5">
          {byBlock.map((b) => {
            const actualPct = totalValue > 0 ? (b.value / totalValue) * 100 : 0;
            const max = Math.max(actualPct, b.target, 1) * 1.2;
            return (
              <li key={b.block} className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: BLOCK_COLORS[b.block] }} />
                  <span className="text-ink-2">{b.name}</span>
                  <span className="ml-auto tabular font-semibold">
                    {invested ? fmtPct(actualPct, 1) : "—"}
                  </span>
                  <span className="w-14 whitespace-nowrap text-right tabular text-ink-3">
                    / {b.target} %
                  </span>
                </div>
                <div className="relative mt-1 h-1 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${Math.min((actualPct / max) * 100, 100)}%`,
                      background: BLOCK_COLORS[b.block],
                      opacity: 0.85,
                    }}
                  />
                  <div
                    className="absolute inset-y-0 w-px bg-white/50"
                    style={{ left: `${Math.min((b.target / max) * 100, 100)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

/* ——— Liste des lignes ——— */
function HoldingsList({ positions }: { positions: PositionView[] }) {
  return (
    <Card title="Lignes" className="!p-3">
      {BLOCK_ORDER.map((block) => {
        const rows = positions.filter((p) => p.asset.block === block);
        if (rows.length === 0) return null;
        const target = rows.reduce((a, p) => a + p.asset.target_pct, 0);
        return (
          <div key={block} className="mb-1">
            <div className="flex items-center gap-2 px-2 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wide text-ink-3">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLOCK_COLORS[block] }} />
              {blockLabel(block)}
              <span className="opacity-70">· cible {target} %</span>
            </div>
            {rows.map((p) => (
              <HoldingRow key={p.asset.ticker} p={p} />
            ))}
          </div>
        );
      })}
    </Card>
  );
}

function HoldingRow({ p }: { p: PositionView }) {
  const q = p.quote;
  const held = p.qty > 0;
  const firstSignal = p.signals.find((s) => s.level !== "info");
  return (
    <Link
      href={`/asset/${p.asset.ticker}`}
      className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-card-hover"
    >
      <TickerAvatar ticker={p.asset.ticker} block={p.asset.block} size={38} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{p.asset.ticker}</span>
          <span className="truncate text-xs text-ink-3">{p.asset.name}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-ink-3">
          {held ? (
            <span className="tabular">
              {fmtNum(p.qty, 4)} × PRU {fmtNum(p.avgCost)} · {p.weightPct.toFixed(1)} % / {p.asset.target_pct} %
            </span>
          ) : (
            <span className="tabular">cible {p.asset.target_pct} %</span>
          )}
          {firstSignal && (
            <>
              <SignalDot level={firstSignal.level} />
              <span className="truncate" style={{ maxWidth: 220 }}>{firstSignal.label}</span>
            </>
          )}
        </div>
      </div>
      {p.spark && p.spark.length > 1 && (
        <div className="hidden md:block">
          <Sparkline data={p.spark} />
        </div>
      )}
      <div className="text-right">
        {held ? (
          <>
            <div className="font-semibold tabular">{fmtUsd(p.marketValue, 0)}</div>
            <div className={`text-xs tabular ${pnlClass(p.unrealizedPnl)}`}>
              {fmtPct(p.unrealizedPnlPct, 1, true)}
            </div>
          </>
        ) : (
          <>
            <div className="font-semibold tabular">{q?.price != null ? `${fmtNum(q.price)} $` : "—"}</div>
            <div className={`text-xs tabular ${pnlClass(q?.change_pct)}`}>
              {fmtPct(q?.change_pct, 2, true)}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
