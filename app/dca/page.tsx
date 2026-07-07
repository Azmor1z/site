"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, Button, Spinner, BlockChip } from "@/components/ui";
import { fmtUsd, fmtPct, fmtNum } from "@/lib/format";
import type { PortfolioSummary } from "@/lib/positions";

const SCENARIOS_3Y = [
  { name: "Bull", value: 143000, perf: "+52 %" },
  { name: "Base", value: 111000, perf: "+18 %" },
  { name: "Bear puis reprise", value: 108000, perf: "+15 %" },
  { name: "Bear prolongé", value: 86000, perf: "-9 %" },
];
const SCENARIOS_7Y = [
  { name: "Bull décélérant", value: 350000, perf: "+75 %" },
  { name: "Base", value: 292000, perf: "+46 %" },
  { name: "Bear puis reprise", value: 289000, perf: "+45 %" },
  { name: "Bear prolongé", value: 240000, perf: "+20 %" },
];

export default function DcaPage() {
  const [pf, setPf] = useState<PortfolioSummary | null>(null);
  const [monthly, setMonthly] = useState("2200");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    setPf(p);
    if (s.monthly_dca_usd) setMonthly(s.monthly_dca_usd);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveMonthly = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthly_dca_usd: monthly }),
    });
    setSaving(false);
  };

  const amount = Number(monthly) || 0;

  const plan = useMemo(() => {
    if (!pf || pf.totalValue <= 0) return null;

    // 60 % → lignes cœur les plus en retard sur leur cible
    const coreLagging = pf.positions
      .filter((p) => p.asset.block === "coeur")
      .sort((a, b) => a.targetGapPct - b.targetGapPct)
      .filter((p) => p.targetGapPct < 0)
      .slice(0, 2);

    // 40 % → poche opportuniste : lignes dans leur zone d'achat (max 2)
    const inBuyZone = pf.positions
      .filter((p) => {
        const price = p.quote?.price;
        return (
          price != null &&
          p.asset.buy_low != null &&
          p.asset.buy_high != null &&
          price >= p.asset.buy_low &&
          price <= p.asset.buy_high &&
          p.asset.block !== "cash"
        );
      })
      .slice(0, 2);

    // sinon : reconstituer le cash (SGOV) jusqu'à ~10 %
    const cash = pf.positions.find((p) => p.asset.block === "cash");
    const cashPct = cash ? cash.weightPct : 0;

    // Escalade : drawdown pondéré du bloc IA vs plus hauts 52 semaines
    const aiLines = pf.positions.filter(
      (p) => p.asset.ai_factor === 1 && p.quote?.price != null && p.quote?.week52_high != null
    );
    const totalAi = aiLines.reduce((a, p) => a + p.marketValue, 0);
    let drawdown: number | null = null;
    if (aiLines.length > 0) {
      if (totalAi > 0) {
        drawdown =
          aiLines.reduce(
            (a, p) => a + (p.quote!.price! / p.quote!.week52_high! - 1) * p.marketValue,
            0
          ) / totalAi;
      } else {
        drawdown =
          aiLines.reduce((a, p) => a + (p.quote!.price! / p.quote!.week52_high! - 1), 0) /
          aiLines.length;
      }
    }

    return { coreLagging, inBuyZone, cashPct, drawdown };
  }, [pf]);

  if (!pf) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-lg font-bold">DCA & plan de déploiement</h1>
        <p className="text-xs text-ink-3">
          Règle 60/40 du mémo : rééquilibrage par apports, sans vendre (donc sans flat tax).
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Versement mensuel">
          <div className="flex items-end gap-2">
            <label className="text-[11px] text-ink-3">
              Montant $ / mois
              <input
                type="number"
                className="mt-0.5 block w-28"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
              />
            </label>
            <Button onClick={saveMonthly} disabled={saving} variant="ghost">
              {saving ? <Spinner /> : "Enregistrer"}
            </Button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
            ≈ 2 000 €/mois. Le vrai risque = arrêter le DCA pendant la baisse : mieux vaut un
            montant soutenable tenu 84 mois qu&apos;un montant théorique abandonné.
          </p>
        </Card>

        <Card title={`Suggestion du mois (${fmtUsd(amount, 0)})`} className="lg:col-span-2">
          {!plan ? (
            <p className="text-xs text-ink-3">
              Saisissez vos positions et rafraîchissez les cours pour obtenir la ventilation 60/40.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-[11px] font-semibold text-ink-2">
                  60 % — cœur en retard sur cible ({fmtUsd(amount * 0.6, 0)})
                </div>
                {plan.coreLagging.length === 0 ? (
                  <p className="text-[11px] text-ink-3">
                    Aucune ligne cœur en retard — répartir sur le cœur au prorata des cibles.
                  </p>
                ) : (
                  <ul className="space-y-1 text-xs">
                    {plan.coreLagging.map((p) => (
                      <li key={p.asset.ticker} className="flex items-center gap-2">
                        <Link href={`/asset/${p.asset.ticker}`} className="font-semibold text-accent hover:underline">
                          {p.asset.ticker}
                        </Link>
                        <span className="text-ink-3">
                          {fmtPct(p.weightPct, 1)} vs cible {p.asset.target_pct} %
                        </span>
                        <span className="ml-auto tabular">
                          ≈ {fmtUsd((amount * 0.6) / plan.coreLagging.length, 0)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <div className="mb-1 text-[11px] font-semibold text-ink-2">
                  40 % — poche opportuniste ({fmtUsd(amount * 0.4, 0)})
                </div>
                {plan.inBuyZone.length > 0 ? (
                  <ul className="space-y-1 text-xs">
                    {plan.inBuyZone.map((p) => (
                      <li key={p.asset.ticker} className="flex items-center gap-2">
                        <Link href={`/asset/${p.asset.ticker}`} className="font-semibold text-accent hover:underline">
                          {p.asset.ticker}
                        </Link>
                        <BlockChip block={p.asset.block} />
                        <span className="text-ink-3">dans sa zone d&apos;achat</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-ink-3">
                    Aucune ligne dans sa zone d&apos;achat → reconstituer le cash (SGOV) jusqu&apos;à ~10 %
                    (actuellement {fmtPct(plan.cashPct, 1)}). IBIT plafonné à 2 %.
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {plan?.drawdown != null && (
        <Card title="Règle d'escalade (le vrai kicker)">
          <EscalationGauge drawdown={plan.drawdown} />
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <ScenarioTable
          title="Scénarios 3 ans (≈ 94 200 $ investis)"
          scenarios={SCENARIOS_3Y}
        />
        <ScenarioTable
          title="Scénarios 7 ans (≈ 199 800 $ investis)"
          scenarios={SCENARIOS_7Y}
          note="Sur 7 ans les 4 scénarios finissent positifs : le temps + l'accumulation dominent le point d'entrée."
        />
      </div>

      <Card title="Garde-fous du mémo">
        <ul className="list-disc space-y-1 pl-5 text-xs text-ink-2">
          <li>Pas de nouvelle ligne chaque mois : 15-17 lignes max, on remplace (les exclusions sont des swaps).</li>
          <li>Pas de renfort au-dessus du plafond de poids ; pas d&apos;achat sur ce qui vient de faire +30 % dans le mois.</li>
          <li>Glide path : facteur IA de ~55 % → ~45 % à 3 ans en dirigeant les apports vers JPM/GS/ABBV/XOM/BRK.B quand la tech a couru.</li>
          <li>Sur 7 ans : envisager un cœur d&apos;ETF indiciel large (S&P 500 / MSCI World) + sélection IA en satellite.</li>
          <li>Enveloppe & change (CTO, flat tax 30 %, EUR/USD, résidence fiscale) : peut peser plus que 1-2 pts de perf.</li>
        </ul>
      </Card>
    </div>
  );
}

function EscalationGauge({ drawdown }: { drawdown: number }) {
  const dd = drawdown * 100;
  const status =
    dd <= -30
      ? { label: "≤ -30 % : déployer le cash AGRESSIVEMENT", color: "var(--critical)" }
      : dd <= -20
        ? { label: "≤ -20 % : déployer le cash en 2-3 fois", color: "var(--warning)" }
        : { label: "Zone normale : DCA standard 60/40", color: "var(--good)" };
  // échelle 0 → -40 %
  const pos = Math.min(Math.max(-dd / 40, 0), 1) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-xs">
        <span className="font-semibold tabular" style={{ color: status.color }}>
          {fmtNum(dd, 1)} %
        </span>
        <span className="text-ink-2">
          drawdown pondéré du bloc IA vs plus hauts 52 semaines — {status.label}
        </span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: "linear-gradient(90deg, rgba(12,163,12,0.5) 0%, rgba(12,163,12,0.5) 48%, rgba(250,178,25,0.55) 52%, rgba(250,178,25,0.55) 73%, rgba(208,59,59,0.6) 77%, rgba(208,59,59,0.6) 100%)" }}>
        <div
          className="absolute top-1/2 h-3.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{ left: `${pos}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-ink-3">
        <span>0 %</span>
        <span>-20 %</span>
        <span>-30 %</span>
        <span>-40 %</span>
      </div>
      <p className="mt-2 text-[11px] text-ink-3">
        « La quasi-totalité de la surperformance se joue là » — bloc IA / SMH à -20 % des plus
        hauts → déployer le cash en 2-3 fois ; à -30 % → agressif.
      </p>
    </div>
  );
}

function ScenarioTable({
  title,
  scenarios,
  note,
}: {
  title: string;
  scenarios: { name: string; value: number; perf: string }[];
  note?: string;
}) {
  return (
    <Card title={title}>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/8 text-left text-[11px] text-ink-3">
            <th className="py-1.5 font-medium">Scénario</th>
            <th className="text-right font-medium">Valeur finale ≈</th>
            <th className="text-right font-medium">Perf.</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s) => (
            <tr key={s.name} className="border-b border-white/5">
              <td className="py-1.5">{s.name}</td>
              <td className="text-right tabular">{fmtUsd(s.value, 0)}</td>
              <td className={`text-right tabular ${s.perf.startsWith("-") ? "text-neg" : "text-pos"}`}>
                {s.perf}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="mt-2 text-[11px] text-ink-3">{note}</p>}
      <p className="mt-1 text-[10px] text-ink-3">Chiffres illustratifs du mémo, pas des prédictions.</p>
    </Card>
  );
}
