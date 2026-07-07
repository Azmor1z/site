"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, Stat, BlockChip, SignalBadge, Button, Spinner, BLOCK_COLORS, blockLabel } from "@/components/ui";
import { fmtUsd, fmtPct, fmtNum, fmtDateTime, pnlClass } from "@/lib/format";
import { BLOCK_ORDER, RULES } from "@/lib/memo-data";
import type { PortfolioSummary, PositionView } from "@/lib/positions";

export default function Dashboard() {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/portfolio");
    setData(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
  const alerts = data.positions.flatMap((p) =>
    p.signals
      .filter((s) => s.level !== "info")
      .map((s) => ({ ticker: p.asset.ticker, signal: s }))
  );

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Tableau de bord</h1>
          <p className="text-xs text-ink-3">
            Dernière mise à jour des cours : {fmtDateTime(data.lastQuoteUpdate)}
          </p>
        </div>
        <Button onClick={refresh} disabled={refreshing}>
          {refreshing ? <>Rafraîchissement… <Spinner /></> : "⟳ Rafraîchir les cours"}
        </Button>
      </div>

      {error && (
        <div className="card border-critical/40 p-3 text-xs text-serious">{error}</div>
      )}
      {!hasQuotes && (
        <div className="card p-4 text-sm text-ink-2">
          Bienvenue. Le portefeuille cible du mémo (16 lignes, zones d&apos;achat, stops, TP)
          est pré-chargé. Commencez par <strong>« Rafraîchir les cours »</strong> pour récupérer
          prix et historiques, puis saisissez vos exécutions réelles dans{" "}
          <Link href="/transactions" className="text-accent underline">Transactions</Link>.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Valeur du portefeuille" value={fmtUsd(data.totalValue)} sub={`investi : ${fmtUsd(data.totalInvested)}`} />
        <Stat
          label="P&L latent"
          value={<span className={pnlClass(data.totalUnrealized)}>{fmtUsd(data.totalUnrealized)}</span>}
          sub={data.totalInvested > 0 ? fmtPct((data.totalUnrealized / data.totalInvested) * 100, 1, true) : "—"}
          subClass={pnlClass(data.totalUnrealized)}
        />
        <Stat
          label="Variation du jour"
          value={<span className={pnlClass(data.dayChange)}>{fmtUsd(data.dayChange)}</span>}
          sub={fmtPct(data.dayChangePct, 2, true)}
          subClass={pnlClass(data.dayChange)}
        />
        <Stat
          label="P&L réalisé"
          value={<span className={pnlClass(data.totalRealized)}>{fmtUsd(data.totalRealized)}</span>}
          sub="ventes cumulées"
        />
        <Stat
          label="Exposition facteur IA"
          value={fmtPct(data.aiFactorPct, 1)}
          sub={`ballast : ${fmtPct(data.ballastPct, 1)} · trigger macro → 40 %`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AllocationCard positions={data.positions} totalValue={data.totalValue} />
        <Card title={`Alertes & signaux (${alerts.length})`} className="lg:col-span-2">
          {alerts.length === 0 ? (
            <p className="text-xs text-ink-3">
              Aucun signal actif. Les signaux apparaissent dès que les cours sont chargés :
              zone d&apos;achat, stop, TP1, écrêtage, règles spéculatives…
            </p>
          ) : (
            <ul className="space-y-1.5">
              {alerts.map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <Link href={`/asset/${a.ticker}`} className="w-14 shrink-0 font-semibold text-accent hover:underline">
                    {a.ticker}
                  </Link>
                  <SignalBadge signal={a.signal} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <HoldingsTable positions={data.positions} />

      <Card
        title="Règles de sortie / rééquilibrage (mémo)"
        action={
          <button onClick={() => setShowRules(!showRules)} className="text-xs text-accent">
            {showRules ? "Masquer" : "Afficher"}
          </button>
        }
      >
        {showRules && (
          <ul className="list-disc space-y-1 pl-5 text-xs text-ink-2">
            {RULES.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

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
    <Card title="Allocation par bloc">
      {invested ? (
        <>
          <div className="relative">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={byBlock.filter((b) => b.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
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
                    background: "#1d212a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8,
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
        </>
      ) : (
        <p className="mb-2 text-xs text-ink-3">
          Aucune position saisie — répartition cible du mémo ci-dessous.
        </p>
      )}
      <ul className="mt-2 space-y-1">
        {byBlock.map((b) => {
          const actualPct = totalValue > 0 ? (b.value / totalValue) * 100 : null;
          return (
            <li key={b.block} className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: BLOCK_COLORS[b.block] }} />
              <span className="text-ink-2">{b.name}</span>
              <span className="ml-auto tabular text-ink">
                {actualPct !== null ? fmtPct(actualPct, 1) : "—"}
              </span>
              <span className="w-16 whitespace-nowrap text-right tabular text-ink-3">
                cible {b.target} %
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function HoldingsTable({ positions }: { positions: PositionView[] }) {
  return (
    <Card title="Lignes du portefeuille" className="overflow-hidden">
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[900px] text-xs">
          <thead>
            <tr className="border-b border-white/8 text-left text-[11px] text-ink-3">
              <th className="py-2 pr-2 font-medium">Ligne</th>
              <th className="px-2 py-2 text-right font-medium">Cours</th>
              <th className="px-2 py-2 text-right font-medium">Jour</th>
              <th className="px-2 py-2 text-right font-medium">Qté</th>
              <th className="px-2 py-2 text-right font-medium">PRU</th>
              <th className="px-2 py-2 text-right font-medium">Valeur</th>
              <th className="px-2 py-2 text-right font-medium">P&L</th>
              <th className="px-2 py-2 text-right font-medium">Poids / cible</th>
              <th className="px-2 py-2 font-medium">Signaux</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => {
              const q = p.quote;
              return (
                <tr key={p.asset.ticker} className="border-b border-white/5 hover:bg-card-hover">
                  <td className="py-2 pr-2">
                    <Link href={`/asset/${p.asset.ticker}`} className="group flex items-center gap-2">
                      <div>
                        <span className="font-semibold text-ink group-hover:text-accent">
                          {p.asset.ticker}
                        </span>
                        <span className="ml-1.5 hidden text-ink-3 xl:inline">{p.asset.name}</span>
                      </div>
                      <BlockChip block={p.asset.block} />
                    </Link>
                  </td>
                  <td className="px-2 py-2 text-right tabular">{fmtNum(q?.price)}</td>
                  <td className={`px-2 py-2 text-right tabular ${pnlClass(q?.change_pct)}`}>
                    {fmtPct(q?.change_pct, 2, true)}
                  </td>
                  <td className="px-2 py-2 text-right tabular">{p.qty > 0 ? fmtNum(p.qty, 4) : "—"}</td>
                  <td className="px-2 py-2 text-right tabular">{fmtNum(p.avgCost)}</td>
                  <td className="px-2 py-2 text-right tabular">{p.qty > 0 ? fmtUsd(p.marketValue, 0) : "—"}</td>
                  <td className={`px-2 py-2 text-right tabular ${pnlClass(p.unrealizedPnl)}`}>
                    {p.qty > 0 ? (
                      <>
                        {fmtUsd(p.unrealizedPnl, 0)}
                        <span className="ml-1 text-[10px]">({fmtPct(p.unrealizedPnlPct, 1, true)})</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-2 py-2 text-right">
                    <WeightBar weight={p.weightPct} target={p.asset.target_pct} />
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex max-w-72 flex-wrap gap-1">
                      {p.signals.slice(0, 2).map((s, i) => (
                        <SignalBadge key={i} signal={s} />
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function WeightBar({ weight, target }: { weight: number; target: number }) {
  const max = Math.max(weight, target, 0.01) * 1.3;
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="tabular text-ink">{weight > 0 ? fmtPct(weight, 1) : "—"}</span>
      <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-white/8">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent/80"
          style={{ width: `${Math.min((weight / max) * 100, 100)}%` }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-ink-2"
          style={{ left: `${Math.min((target / max) * 100, 100)}%` }}
          title={`Cible ${target} %`}
        />
      </div>
      <span className="w-8 text-right tabular text-[10px] text-ink-3">{target} %</span>
    </div>
  );
}
