"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, Button, Spinner } from "@/components/ui";
import { fmtUsd, fmtNum, fmtDate } from "@/lib/format";
import type { AssetRow } from "@/lib/db";

interface TxRow {
  id: number;
  ticker: string;
  name: string;
  kind: "buy" | "sell";
  date: string;
  qty: number;
  price: number;
  fees: number;
  note: string | null;
}

export default function TransactionsPage() {
  const [txs, setTxs] = useState<TxRow[] | null>(null);
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [form, setForm] = useState({
    ticker: "",
    kind: "buy",
    date: new Date().toISOString().slice(0, 10),
    qty: "",
    price: "",
    fees: "0",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [t, a] = await Promise.all([
      fetch("/api/transactions").then((r) => r.json()),
      fetch("/api/assets").then((r) => r.json()),
    ]);
    setTxs(t);
    setAssets(a);
    setForm((f) => (f.ticker === "" && a.length ? { ...f, ticker: a[0].ticker } : f));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    setSaving(true);
    setErr(null);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticker: form.ticker,
        kind: form.kind,
        date: form.date,
        qty: Number(form.qty),
        price: Number(form.price),
        fees: Number(form.fees || 0),
        note: form.note || null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setErr((await res.json()).error ?? "Erreur");
      return;
    }
    setForm({ ...form, qty: "", price: "", note: "" });
    load();
  };

  const del = async (id: number) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    load();
  };

  if (!txs) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

  const totalBuys = txs.filter((t) => t.kind === "buy").reduce((a, t) => a + t.qty * t.price + t.fees, 0);
  const totalSells = txs.filter((t) => t.kind === "sell").reduce((a, t) => a + t.qty * t.price - t.fees, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-lg font-bold">Transactions</h1>
        <p className="text-xs text-ink-3">
          {txs.length} opérations · {fmtUsd(totalBuys, 0)} achetés · {fmtUsd(totalSells, 0)} vendus
        </p>
      </div>

      <Card title="Nouvelle opération">
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-[11px] text-ink-3">
            Actif
            <select
              className="mt-0.5 block w-40"
              value={form.ticker}
              onChange={(e) => setForm({ ...form, ticker: e.target.value })}
            >
              {assets.map((a) => (
                <option key={a.ticker} value={a.ticker}>
                  {a.ticker} — {a.name}
                </option>
              ))}
            </select>
          </label>
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
          <label className="text-[11px] text-ink-3">
            Note
            <input
              type="text"
              className="mt-0.5 block w-40"
              value={form.note}
              placeholder="ex : entrée 1/3, zone d'achat"
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </label>
          <Button onClick={submit} disabled={saving || !form.qty || !form.price || !form.ticker}>
            {saving ? <Spinner /> : "Ajouter"}
          </Button>
          {err && <span className="text-[11px] text-serious">{err}</span>}
        </div>
      </Card>

      <Card title="Journal">
        {txs.length === 0 ? (
          <p className="text-xs text-ink-3">Aucune opération pour l&apos;instant.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-xs">
              <thead>
                <tr className="border-b border-white/8 text-left text-[11px] text-ink-3">
                  <th className="py-2 pr-2 font-medium">Date</th>
                  <th className="px-2 font-medium">Actif</th>
                  <th className="px-2 font-medium">Sens</th>
                  <th className="px-2 text-right font-medium">Quantité</th>
                  <th className="px-2 text-right font-medium">Prix</th>
                  <th className="px-2 text-right font-medium">Frais</th>
                  <th className="px-2 text-right font-medium">Montant</th>
                  <th className="px-2 font-medium">Note</th>
                  <th className="px-2" />
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-card-hover">
                    <td className="py-2 pr-2 tabular text-ink-3">{fmtDate(t.date)}</td>
                    <td className="px-2">
                      <Link href={`/asset/${t.ticker}`} className="font-semibold text-accent hover:underline">
                        {t.ticker}
                      </Link>
                    </td>
                    <td className={`px-2 ${t.kind === "buy" ? "text-pos" : "text-neg"}`}>
                      {t.kind === "buy" ? "Achat" : "Vente"}
                    </td>
                    <td className="px-2 text-right tabular">{fmtNum(t.qty, 4)}</td>
                    <td className="px-2 text-right tabular">{fmtNum(t.price)}</td>
                    <td className="px-2 text-right tabular text-ink-3">{fmtNum(t.fees)}</td>
                    <td className="px-2 text-right tabular">{fmtUsd(t.qty * t.price, 0)}</td>
                    <td className="max-w-40 truncate px-2 text-ink-3">{t.note}</td>
                    <td className="px-2 text-right">
                      <button onClick={() => del(t.id)} className="text-ink-3 hover:text-critical" title="Supprimer">
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
