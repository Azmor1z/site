"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, TickerAvatar, Spinner, Stat } from "@/components/ui";
import { fmtUsd, fmtPct, fmtNum, fmtDate, pnlClass } from "@/lib/format";
import type { PortfolioSummary } from "@/lib/positions";

type PfHistory = { date: string; value: number; invested: number }[];

export default function AnalysePage() {
  const [pf, setPf] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<PfHistory>([]);
  const [fees, setFees] = useState<number>(0);

  const load = useCallback(async () => {
    const [p, h, txs] = await Promise.all([
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/portfolio/history").then((r) => r.json()),
      fetch("/api/transactions").then((r) => r.json()),
    ]);
    setPf(p);
    setHistory(h);
    setFees((txs as { fees: number }[]).reduce((a, t) => a + (t.fees || 0), 0));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    if (history.length < 2) return null;
    // P&L quotidien hors effet des versements : Δ(valeur - investi)
    const pnl = history.map((h) => h.value - h.invested);
    const dailyPnl: { date: string; d: number; base: number }[] = [];
    for (let i = 1; i < history.length; i++) {
      dailyPnl.push({ date: history[i].date, d: pnl[i] - pnl[i - 1], base: history[i - 1].value });
    }
    const rets = dailyPnl.filter((x) => x.base > 0).map((x) => x.d / x.base);
    const mean = rets.length ? rets.reduce((a, b) => a + b, 0) / rets.length : 0;
    const vol =
      rets.length > 1
        ? Math.sqrt(rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1)) *
          Math.sqrt(252)
        : null;
    let best = dailyPnl[0];
    let worst = dailyPnl[0];
    for (const x of dailyPnl) {
      if (x.d > best.d) best = x;
      if (x.d < worst.d) worst = x;
    }
    // Drawdown sur le P&L cumulé rapporté à la valeur (approx. performance)
    let peak = -Infinity;
    let maxDd = 0;
    const ddSeries = history.map((h, i) => {
      const perf = pnl[i];
      peak = Math.max(peak, perf);
      const base = h.value > 0 ? h.value : 1;
      const dd = peak > 0 ? -Math.max(0, peak - perf) / base : 0;
      maxDd = Math.min(maxDd, dd);
      return { date: h.date, dd: dd * 100 };
    });
    return { vol, best, worst, ddSeries, maxDd: maxDd * 100 };
  }, [history]);

  if (!pf) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

  const held = pf.positions.filter((p) => p.qty > 0);
  const maxAbsPnl = Math.max(...held.map((p) => Math.abs(p.unrealizedPnl)), 1);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-lg font-bold">Analyse</h1>
        <p className="text-xs text-ink-3">
          Contribution au résultat, risque réalisé et exposition au facteur IA.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card p-4">
          <Stat
            label="Volatilité du portefeuille"
            value={stats?.vol != null ? fmtPct(stats.vol * 100, 0) : "—"}
            sub="annualisée, hors versements"
          />
        </div>
        <div className="card p-4">
          <Stat
            label="Drawdown max"
            value={stats ? fmtPct(stats.maxDd, 1) : "—"}
            sub="pire recul du P&L"
          />
        </div>
        <div className="card p-4">
          <Stat
            label="Meilleur jour"
            value={
              stats ? (
                <span className="text-pos">{fmtUsd(stats.best.d, 0)}</span>
              ) : (
                "—"
              )
            }
            sub={stats ? fmtDate(stats.best.date) : undefined}
          />
        </div>
        <div className="card p-4">
          <Stat
            label="Pire jour"
            value={
              stats ? (
                <span className="text-neg">{fmtUsd(stats.worst.d, 0)}</span>
              ) : (
                "—"
              )
            }
            sub={stats ? fmtDate(stats.worst.date) : undefined}
          />
        </div>
      </div>

      <Card title="Contribution au P&L latent">
        {held.length === 0 ? (
          <p className="text-xs text-ink-3">Aucune position saisie pour l&apos;instant.</p>
        ) : (
          <ul className="space-y-2">
            {[...held]
              .sort((a, b) => b.unrealizedPnl - a.unrealizedPnl)
              .map((p) => (
                <li key={p.asset.ticker} className="flex items-center gap-3 text-xs">
                  <TickerAvatar ticker={p.asset.ticker} block={p.asset.block} size={26} />
                  <Link
                    href={`/asset/${p.asset.ticker}`}
                    className="w-14 shrink-0 font-semibold hover:text-accent"
                  >
                    {p.asset.ticker}
                  </Link>
                  <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/6">
                    <div
                      className="absolute inset-y-0 rounded-full"
                      style={{
                        left: p.unrealizedPnl >= 0 ? "50%" : undefined,
                        right: p.unrealizedPnl < 0 ? "50%" : undefined,
                        width: `${(Math.abs(p.unrealizedPnl) / maxAbsPnl) * 48}%`,
                        background: p.unrealizedPnl >= 0 ? "var(--pos)" : "var(--neg)",
                        opacity: 0.85,
                      }}
                    />
                    <div className="absolute inset-y-0 left-1/2 w-px bg-white/25" />
                  </div>
                  <span className={`w-20 shrink-0 text-right tabular ${pnlClass(p.unrealizedPnl)}`}>
                    {fmtUsd(p.unrealizedPnl, 0)}
                  </span>
                  <span className="w-16 shrink-0 text-right tabular text-ink-3">
                    {fmtPct(p.unrealizedPnlPct, 1, true)}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </Card>

      {stats && stats.ddSeries.length >= 2 && (
        <Card title="Drawdown du P&L (depuis le plus haut atteint)">
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={stats.ddSeries} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="ddFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e66767" stopOpacity={0} />
                  <stop offset="100%" stopColor="#e66767" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "#8a8f9b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                minTickGap={70}
                tickFormatter={(d: string) =>
                  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                }
              />
              <YAxis
                tick={{ fill: "#8a8f9b", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={48}
                tickCount={4}
                tickFormatter={(v: number) => `${v.toFixed(1)} %`}
              />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(2)} %`, "Drawdown"]}
                labelFormatter={(d) => fmtDate(String(d))}
                contentStyle={{
                  background: "#1b1e26",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                dataKey="dd"
                stroke="#e66767"
                strokeWidth={1.5}
                fill="url(#ddFill)"
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card title="Exposition au facteur IA (trigger macro du mémo)">
        <AiGauge aiPct={pf.aiFactorPct} />
      </Card>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-3">
        <span>
          P&L réalisé{" "}
          <strong className={`tabular ${pnlClass(pf.totalRealized)}`}>
            {fmtUsd(pf.totalRealized, 0)}
          </strong>
        </span>
        <span>
          Frais cumulés <strong className="tabular text-ink-2">{fmtUsd(fees)}</strong>
        </span>
        <span>
          Positions <strong className="tabular text-ink-2">{held.length}</strong> / {pf.positions.length} lignes suivies
        </span>
      </div>
    </div>
  );
}

function AiGauge({ aiPct }: { aiPct: number }) {
  const max = 80;
  const x = (v: number) => `${Math.min(v / max, 1) * 100}%`;
  const over = aiPct > 55;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2 text-xs">
        <span className="text-xl font-semibold tabular" style={{ color: over ? "var(--warning)" : "var(--ink)" }}>
          {fmtNum(aiPct, 1)} %
        </span>
        <span className="text-ink-3">
          de la valeur du portefeuille sur le facteur IA · thèse assumée ≈ 55 % · repli cible 40 % si trigger macro
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-white/6">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: x(aiPct), background: "var(--c-coeur)", opacity: 0.85 }}
        />
        <div className="absolute inset-y-0 w-px bg-white/60" style={{ left: x(40) }} title="Cible si trigger macro : 40 %" />
        <div className="absolute inset-y-0 w-px bg-white/60" style={{ left: x(55) }} title="Thèse : ~55 %" />
      </div>
      <div className="relative mt-1 h-4 text-[10px] text-ink-3">
        <span className="absolute -translate-x-1/2" style={{ left: x(40) }}>40 %</span>
        <span className="absolute -translate-x-1/2" style={{ left: x(55) }}>55 %</span>
      </div>
      <p className="text-[11px] leading-relaxed text-ink-3">
        Trigger macro du mémo : 2 hausses Fed cumulées OU 10 ans US &gt; 5,25 % → réduire le bloc IA
        de ~55 % vers ~40 %. Le glide path DCA fait le même travail sans vendre, en dirigeant les
        apports vers JPM/GS/ABBV/XOM.
      </p>
    </div>
  );
}
