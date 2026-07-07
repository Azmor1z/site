"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, BlockChip, SignalBadge, Button, Spinner } from "@/components/ui";
import { PriceChart, McConeChart } from "@/components/charts";
import { fmtUsd, fmtNum, fmtPct, fmtDate, fmtDateTime, pnlClass } from "@/lib/format";
import { computePosition, buildSignals } from "@/lib/positions";
import type { AssetRow, QuoteRow, TransactionRow } from "@/lib/db";
import type { McResult } from "@/lib/montecarlo";

interface Detail {
  asset: AssetRow;
  quote: QuoteRow | null;
  transactions: TransactionRow[];
  history: { date: string; close: number }[];
}

export default function AssetPage() {
  const { ticker } = useParams<{ ticker: string }>();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/assets/${ticker}`);
    if (!res.ok) {
      setNotFound(true);
      return;
    }
    setDetail(await res.json());
  }, [ticker]);

  useEffect(() => {
    load();
  }, [load]);

  if (notFound) {
    return (
      <div className="text-sm text-ink-2">
        Actif introuvable. <Link href="/" className="text-accent underline">Retour</Link>
      </div>
    );
  }
  if (!detail) {
    return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
  }

  const { asset, quote, transactions, history } = detail;
  const pos = computePosition(transactions);
  const price = quote?.price ?? null;
  const marketValue = price !== null ? pos.qty * price : 0;
  const unrealized = marketValue - pos.invested;
  const base = {
    asset,
    quote,
    ...pos,
    marketValue,
    unrealizedPnl: unrealized,
    unrealizedPnlPct: pos.invested > 0 ? (unrealized / pos.invested) * 100 : null,
    dayChange: 0,
    weightPct: 0,
    targetGapPct: 0,
  };
  const signals = buildSignals(base).filter((s) => s.level !== "info");

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-ink-3 hover:text-ink">←</Link>
            <h1 className="text-lg font-bold">{asset.ticker}</h1>
            <span className="text-sm text-ink-3">{asset.name}</span>
            <BlockChip block={asset.block} />
            {asset.ai_factor === 1 && (
              <span className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] text-ink-3">facteur IA</span>
            )}
          </div>
          <p className="mt-1 max-w-xl text-xs text-ink-3">
            <span className="text-ink-2">{asset.thesis}</span>
            {asset.risk && <> · Risque clé : {asset.risk}</>}
            {asset.timing && <> · Timing mémo : {asset.timing}</>}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular">{fmtNum(price)} $</div>
          <div className={`text-xs tabular ${pnlClass(quote?.change_pct)}`}>
            {fmtPct(quote?.change_pct, 2, true)} aujourd&apos;hui
          </div>
          <div className="mt-0.5 text-[10px] text-ink-3">
            MM50 {fmtNum(quote?.ma50, 0)} · MM200 {fmtNum(quote?.ma200, 0)} · maj {fmtDateTime(quote?.updated_at)}
          </div>
        </div>
      </div>

      {signals.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {signals.map((s, i) => (
            <SignalBadge key={i} signal={s} />
          ))}
        </div>
      )}

      <LevelsScale asset={asset} price={price} />

      <Card title="Cours, moyennes mobiles et niveaux d'exécution">
        <PriceChart history={history} asset={asset} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <PositionCard
          asset={asset}
          pos={pos}
          marketValue={marketValue}
          unrealized={unrealized}
          transactions={transactions}
          onChange={load}
        />
        <LevelsCard asset={asset} onSaved={load} />
      </div>

      <MonteCarloCard ticker={asset.ticker} />

      {asset.stop_note && (
        <Card title="Stop « événement » / notes d'invalidation">
          <p className="text-xs leading-relaxed text-ink-2">{asset.stop_note}</p>
        </Card>
      )}
    </div>
  );
}

/* ——— Échelle visuelle stop → zone d'achat → TP1 → objectif ——— */
function LevelsScale({ asset, price }: { asset: AssetRow; price: number | null }) {
  const pts = [asset.stop_price, asset.buy_low, asset.buy_high, asset.tp1_low, asset.tp1_high, asset.obj_low, asset.obj_high, price]
    .filter((v): v is number => v != null);
  if (pts.length < 3) return null;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const x = (v: number) => ((v - min) / span) * 100;

  return (
    <Card title="Niveaux du mémo">
      <div className="px-2 pb-5 pt-6">
        <div className="relative h-2 rounded-full bg-white/8">
          {asset.buy_low != null && asset.buy_high != null && (
            <div
              className="absolute inset-y-0 rounded-full"
              style={{
                left: `${x(asset.buy_low)}%`,
                width: `${x(asset.buy_high) - x(asset.buy_low)}%`,
                background: "rgba(12,163,12,0.45)",
              }}
              title={`Zone d'achat ${asset.buy_low}–${asset.buy_high}`}
            />
          )}
          {asset.stop_price != null && (
            <Marker xPct={x(asset.stop_price)} color="#d03b3b" label={`Stop ${asset.stop_price}`} below />
          )}
          {asset.tp1_low != null && (
            <Marker xPct={x(asset.tp1_low)} color="#4cc94c" label={`TP1 ${asset.tp1_low}`} below />
          )}
          {asset.obj_low != null && (
            <Marker xPct={x(asset.obj_low)} color="#199e70" label={`Obj. ${asset.obj_low}`} below />
          )}
          {price != null && (
            <Marker xPct={x(price)} color="#f5f6f8" label={`Cours ${fmtNum(price, 0)}`} />
          )}
        </div>
      </div>
    </Card>
  );
}

function Marker({
  xPct,
  color,
  label,
  below = false,
}: {
  xPct: number;
  color: string;
  label: string;
  below?: boolean;
}) {
  return (
    <div className="absolute" style={{ left: `${xPct}%`, top: below ? "100%" : "auto", bottom: below ? "auto" : "100%" }}>
      <div
        className="absolute h-3 w-0.5 -translate-x-1/2"
        style={{ background: color, top: below ? -8 : 5 }}
      />
      <div
        className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] tabular"
        style={{ color, top: below ? 6 : -22 }}
      >
        {label}
      </div>
    </div>
  );
}

/* ——— Position + transactions ——— */
function PositionCard({
  asset,
  pos,
  marketValue,
  unrealized,
  transactions,
  onChange,
}: {
  asset: AssetRow;
  pos: { qty: number; avgCost: number | null; invested: number; realizedPnl: number };
  marketValue: number;
  unrealized: number;
  transactions: TransactionRow[];
  onChange: () => void;
}) {
  const [form, setForm] = useState({
    kind: "buy",
    date: new Date().toISOString().slice(0, 10),
    qty: "",
    price: "",
    fees: "0",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setSaving(true);
    setErr(null);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticker: asset.ticker,
        kind: form.kind,
        date: form.date,
        qty: Number(form.qty),
        price: Number(form.price),
        fees: Number(form.fees || 0),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json();
      setErr(j.error ?? "Erreur");
      return;
    }
    setForm({ ...form, qty: "", price: "" });
    onChange();
  };

  const del = async (id: number) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    onChange();
  };

  return (
    <Card title="Ma position">
      <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-ink-3">Quantité</div>
          <div className="font-semibold tabular">{fmtNum(pos.qty, 4)}</div>
        </div>
        <div>
          <div className="text-ink-3">PRU</div>
          <div className="font-semibold tabular">{fmtNum(pos.avgCost)}</div>
        </div>
        <div>
          <div className="text-ink-3">Investi</div>
          <div className="font-semibold tabular">{fmtUsd(pos.invested, 0)}</div>
        </div>
        <div>
          <div className="text-ink-3">Valeur</div>
          <div className="font-semibold tabular">{fmtUsd(marketValue, 0)}</div>
        </div>
        <div>
          <div className="text-ink-3">P&L latent</div>
          <div className={`font-semibold tabular ${pnlClass(unrealized)}`}>
            {fmtUsd(unrealized, 0)}
            {pos.invested > 0 && (
              <span className="ml-1 text-[10px]">({fmtPct((unrealized / pos.invested) * 100, 1, true)})</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-ink-3">P&L réalisé</div>
          <div className={`font-semibold tabular ${pnlClass(pos.realizedPnl)}`}>{fmtUsd(pos.realizedPnl, 0)}</div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-end gap-2 rounded-lg bg-surface p-2.5">
        <label className="text-[11px] text-ink-3">
          Sens
          <select
            className="mt-0.5 block"
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
          >
            <option value="buy">Achat</option>
            <option value="sell">Vente</option>
          </select>
        </label>
        <label className="text-[11px] text-ink-3">
          Date
          <input
            type="date"
            className="mt-0.5 block"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </label>
        <label className="text-[11px] text-ink-3">
          Quantité
          <input
            type="number"
            step="any"
            min="0"
            className="mt-0.5 block w-24"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
          />
        </label>
        <label className="text-[11px] text-ink-3">
          Prix $
          <input
            type="number"
            step="any"
            min="0"
            className="mt-0.5 block w-24"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </label>
        <label className="text-[11px] text-ink-3">
          Frais $
          <input
            type="number"
            step="any"
            min="0"
            className="mt-0.5 block w-20"
            value={form.fees}
            onChange={(e) => setForm({ ...form, fees: e.target.value })}
          />
        </label>
        <Button onClick={submit} disabled={saving || !form.qty || !form.price}>
          {saving ? <Spinner /> : "Ajouter"}
        </Button>
        {err && <span className="text-[11px] text-serious">{err}</span>}
      </div>

      {transactions.length > 0 && (
        <ul className="max-h-44 space-y-1 overflow-y-auto text-xs">
          {transactions.map((t) => (
            <li key={t.id} className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-card-hover">
              <span className={t.kind === "buy" ? "text-pos" : "text-neg"}>
                {t.kind === "buy" ? "Achat" : "Vente"}
              </span>
              <span className="text-ink-3">{fmtDate(t.date)}</span>
              <span className="tabular">
                {fmtNum(t.qty, 4)} × {fmtNum(t.price)} $
              </span>
              {t.fees > 0 && <span className="tabular text-ink-3">frais {fmtNum(t.fees)}</span>}
              <button
                onClick={() => del(t.id)}
                className="ml-auto text-ink-3 hover:text-critical"
                title="Supprimer"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ——— Édition des niveaux ——— */
const LEVEL_FIELDS = [
  ["buy_low", "Zone achat bas"],
  ["buy_high", "Zone achat haut"],
  ["tp1_low", "TP1 bas"],
  ["tp1_high", "TP1 haut"],
  ["obj_low", "Objectif bas"],
  ["obj_high", "Objectif haut"],
  ["stop_price", "Stop"],
  ["target_pct", "Poids cible %"],
] as const;

function LevelsCard({ asset, onSaved }: { asset: AssetRow; onSaved: () => void }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      LEVEL_FIELDS.map(([k]) => [k, asset[k as keyof AssetRow] != null ? String(asset[k as keyof AssetRow]) : ""])
    )
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    const body: Record<string, number | null> = {};
    for (const [k] of LEVEL_FIELDS) {
      body[k] = values[k] === "" ? null : Number(values[k]);
    }
    await fetch(`/api/assets/${asset.ticker}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSaved();
  };

  return (
    <Card
      title="Niveaux d'exécution (modifiables)"
      action={
        <Button onClick={save} disabled={saving} variant="ghost">
          {saving ? <Spinner /> : saved ? "✓ Enregistré" : "Enregistrer"}
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {LEVEL_FIELDS.map(([key, label]) => (
          <label key={key} className="text-[11px] text-ink-3">
            {label}
            <input
              type="number"
              step="any"
              className="mt-0.5 block w-full"
              value={values[key]}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-ink-3">
        Stops = clôtures ({asset.stop_kind === "weekly_close" ? "hebdomadaires" : "quotidiennes"}), pas de mèches intraday.
        Un stop « événement » prime toujours sur le stop prix.
      </p>
    </Card>
  );
}

/* ——— Monte Carlo ——— */
function MonteCarloCard({ ticker }: { ticker: string }) {
  const [mc, setMc] = useState<McResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState<"hist" | "neutral">("neutral");

  const load = useCallback(
    async (force = false) => {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/montecarlo/${ticker}${force ? "?force=1" : ""}`);
      const j = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(j.error ?? "Erreur de calcul");
        return;
      }
      setMc(j);
    },
    [ticker]
  );

  useEffect(() => {
    load();
  }, [load]);

  const sc = mc ? (scenario === "hist" ? mc.hist : mc.neutral) : null;

  return (
    <Card
      title="Prédictions Monte Carlo (4 000 trajectoires, calibrées sur 2 ans d'historique)"
      action={
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-white/10 text-[11px]">
            <button
              onClick={() => setScenario("neutral")}
              className={`px-2.5 py-1 ${scenario === "neutral" ? "bg-white/10 font-semibold" : "text-ink-3"}`}
              title="Dérive nulle : seule la volatilité joue (prudent)"
            >
              Dérive neutre
            </button>
            <button
              onClick={() => setScenario("hist")}
              className={`px-2.5 py-1 ${scenario === "hist" ? "bg-white/10 font-semibold" : "text-ink-3"}`}
              title="Prolonge le momentum des 2 dernières années (optimiste si le titre a monté)"
            >
              Dérive historique
            </button>
          </div>
          <Button variant="ghost" onClick={() => load(true)} disabled={loading}>
            ⟳ Recalculer
          </Button>
        </div>
      }
    >
      {loading && <div className="flex h-40 items-center justify-center"><Spinner /></div>}
      {error && <p className="text-xs text-serious">{error}</p>}
      {mc && sc && !loading && (
        <>
          <p className="mb-2 text-[11px] text-ink-3">
            Volatilité annualisée : <strong className="text-ink-2">{fmtPct(mc.sigmaAnnual * 100, 0)}</strong>
            {" · "}dérive simulée : <strong className="text-ink-2">{fmtPct(sc.driftAnnual * 100, 0, true)}/an</strong>
            {" · "}dérive historique 2 ans : {fmtPct(mc.muAnnual * 100, 0, true)}/an
            {" · "}spot : {fmtNum(mc.s0)} $
          </p>
          <McConeChart mc={mc} scenario={sc} />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-xs">
              <thead>
                <tr className="border-b border-white/8 text-left text-[11px] text-ink-3">
                  <th className="py-1.5 pr-2 font-medium">Horizon</th>
                  <th className="px-2 text-right font-medium">Médiane</th>
                  <th className="px-2 text-right font-medium">p5 / p95</th>
                  <th className="px-2 text-right font-medium">P(hausse)</th>
                  <th className="px-2 text-right font-medium">P(TP1)</th>
                  <th className="px-2 text-right font-medium">P(objectif)</th>
                  <th className="px-2 text-right font-medium">P(stop touché)</th>
                </tr>
              </thead>
              <tbody>
                {sc.horizons.map((h) => (
                  <tr key={h.days} className="border-b border-white/5">
                    <td className="py-1.5 pr-2 font-medium">{h.label}</td>
                    <td className="px-2 text-right tabular">{fmtNum(h.median, 0)} $</td>
                    <td className="px-2 text-right tabular text-ink-3">
                      {fmtNum(h.p5, 0)} / {fmtNum(h.p95, 0)}
                    </td>
                    <td className="px-2 text-right tabular">{fmtPct(h.probUp * 100, 0)}</td>
                    <td className="px-2 text-right tabular text-pos">
                      {h.probTP1 !== null ? fmtPct(h.probTP1 * 100, 0) : "—"}
                    </td>
                    <td className="px-2 text-right tabular text-pos">
                      {h.probObj !== null ? fmtPct(h.probObj * 100, 0) : "—"}
                    </td>
                    <td className="px-2 text-right tabular text-neg">
                      {h.probStop !== null ? fmtPct(h.probStop * 100, 0) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-ink-3">
            Modèle GBM calibré sur l&apos;historique réel ({mc.histDays} séances). « P(TP1/objectif/stop) » =
            probabilité de toucher le niveau au moins une fois avant l&apos;horizon. Ce sont des distributions
            statistiques, pas des prédictions d&apos;événements (résultats, guidances, macro). La dérive
            historique prolonge le passé récent — à lire avec recul sur les titres qui viennent de doubler.
          </p>
        </>
      )}
    </Card>
  );
}
