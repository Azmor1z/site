"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, Button, Spinner, TickerAvatar } from "@/components/ui";
import { fmtUsd, fmtNum, fmtDate } from "@/lib/format";
import type { AssetRow } from "@/lib/db";

interface TxRow {
  id: number;
  ticker: string;
  name: string;
  block: string;
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
  const [open, setOpen] = useState(false);
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
    setOpen(false);
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Transactions</h1>
          <p className="text-xs text-ink-3">
            {txs.length} opérations · {fmtUsd(totalBuys, 0)} achetés · {fmtUsd(totalSells, 0)} vendus
          </p>
        </div>
        <Button variant={open ? "ghost" : "primary"} onClick={() => setOpen(!open)}>
          {open ? "Annuler" : "＋ Opération"}
        </Button>
      </div>

      {open && (
        <Card>
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-[11px] text-ink-3">
              Actif
              <select
                className="mt-0.5 block w-44"
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
            <label className="grow text-[11px] text-ink-3">
              Note
              <input
                type="text"
                className="mt-0.5 block w-full"
                value={form.note}
                placeholder="ex : entrée 1/3, zone d'achat"
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </label>
            <Button onClick={submit} disabled={saving || !form.qty || !form.price || !form.ticker}>
              {saving ? <Spinner /> : "Valider"}
            </Button>
            {err && <span className="text-[11px] text-serious">{err}</span>}
          </div>
        </Card>
      )}

      <Card className="!p-3">
        {txs.length === 0 ? (
          <p className="p-2 text-xs text-ink-3">
            Aucune opération. Cliquez sur « ＋ Opération » pour saisir votre premier achat.
          </p>
        ) : (
          <ul>
            {txs.map((t) => (
              <li
                key={t.id}
                className="group flex items-center gap-3 rounded-2xl px-2 py-2.5 hover:bg-card-hover"
              >
                <TickerAvatar ticker={t.ticker} block={t.block} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <Link href={`/asset/${t.ticker}`} className="font-semibold hover:text-accent">
                      {t.ticker}
                    </Link>
                    <span className={`text-xs ${t.kind === "buy" ? "text-pos" : "text-neg"}`}>
                      {t.kind === "buy" ? "Achat" : "Vente"}
                    </span>
                  </div>
                  <div className="truncate text-[11px] text-ink-3">
                    <span className="tabular">
                      {fmtNum(t.qty, 4)} × {fmtNum(t.price)} $
                      {t.fees > 0 && ` · frais ${fmtNum(t.fees)}`}
                    </span>
                    {t.note && ` · ${t.note}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular">
                    {t.kind === "buy" ? "-" : "+"}
                    {fmtUsd(t.qty * t.price, 0)}
                  </div>
                  <div className="text-[11px] text-ink-3">{fmtDate(t.date)}</div>
                </div>
                <button
                  onClick={() => del(t.id)}
                  className="invisible ml-1 text-ink-3 hover:text-critical group-hover:visible"
                  title="Supprimer"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
