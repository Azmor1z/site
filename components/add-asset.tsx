"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Spinner } from "@/components/ui";
import { BLOCK_LABELS, BLOCK_ORDER } from "@/lib/memo-data";

interface Hit {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export function AddAssetButton({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>＋ Titre</Button>
      {open && <AddAssetModal onClose={() => setOpen(false)} onAdded={onAdded} />}
    </>
  );
}

function AddAssetModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Hit | null>(null);
  const [block, setBlock] = useState("satellite");
  const [target, setTarget] = useState("3");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // recherche avec petit délai de frappe
  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    const id = setTimeout(async () => {
      setSearching(true);
      setSearchErr(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const j = await res.json();
        if (!res.ok) throw new Error(j.error ?? "Recherche indisponible");
        setHits(j);
      } catch (e) {
        setSearchErr(e instanceof Error ? e.message : "Erreur");
        setHits([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [q]);

  const add = async () => {
    if (!selected) return;
    setSaving(true);
    setErr(null);
    const res = await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticker: selected.symbol,
        name: selected.name,
        block,
        target_pct: Number(target) || 0,
        stop_kind: "close",
      }),
    });
    if (!res.ok) {
      setSaving(false);
      setErr((await res.json()).error ?? "Erreur");
      return;
    }
    // charge cours + historique du nouveau titre
    await fetch(`/api/refresh?ticker=${selected.symbol}`, { method: "POST" }).catch(() => {});
    setSaving(false);
    onAdded();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-24"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-sm font-semibold">Ajouter un titre</h2>
        <input
          ref={inputRef}
          type="text"
          className="w-full"
          placeholder="Rechercher un ticker ou un nom (ex : BRK.B, Apple…)"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSelected(null);
          }}
        />
        <div className="mt-2 max-h-56 overflow-y-auto">
          {searching && (
            <div className="flex justify-center py-3"><Spinner /></div>
          )}
          {searchErr && <p className="px-1 py-2 text-xs text-serious">{searchErr}</p>}
          {!searching &&
            hits.map((h) => (
              <button
                key={h.symbol}
                onClick={() => setSelected(h)}
                className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs transition-colors ${
                  selected?.symbol === h.symbol ? "bg-white/10" : "hover:bg-card-hover"
                }`}
              >
                <span className="w-16 shrink-0 font-semibold">{h.symbol}</span>
                <span className="min-w-0 flex-1 truncate text-ink-2">{h.name}</span>
                <span className="shrink-0 text-[10px] text-ink-3">
                  {h.type} · {h.exchange}
                </span>
              </button>
            ))}
          {!searching && q.trim() && hits.length === 0 && !searchErr && (
            <p className="px-1 py-2 text-xs text-ink-3">Aucun résultat.</p>
          )}
        </div>

        {selected && (
          <div className="mt-3 flex flex-wrap items-end gap-2 rounded-2xl bg-surface p-3">
            <label className="text-[11px] text-ink-3">
              Bloc
              <select className="mt-0.5 block" value={block} onChange={(e) => setBlock(e.target.value)}>
                {BLOCK_ORDER.map((b) => (
                  <option key={b} value={b}>
                    {BLOCK_LABELS[b]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[11px] text-ink-3">
              Poids cible %
              <input
                type="number"
                step="any"
                min="0"
                className="mt-0.5 block w-20"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </label>
            <Button onClick={add} disabled={saving}>
              {saving ? <Spinner /> : `Ajouter ${selected.symbol}`}
            </Button>
            {err && <span className="text-[11px] text-serious">{err}</span>}
          </div>
        )}
        <p className="mt-3 text-[10px] text-ink-3">
          Rappel du mémo : 15-17 lignes max — les nouveaux noms sont des <strong>swaps</strong>,
          pas des ajouts. Zones d&apos;achat, stop et objectifs se règlent ensuite sur la fiche du titre.
        </p>
      </div>
    </div>
  );
}
