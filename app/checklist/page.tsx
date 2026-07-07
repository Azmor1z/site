"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button, Spinner } from "@/components/ui";
import { fmtDate } from "@/lib/format";

interface Item {
  id: number;
  label: string;
  category: string | null;
  due: string | null;
  done: number;
}

export default function ChecklistPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newCat, setNewCat] = useState("Signaux");
  const [newDue, setNewDue] = useState("");

  const load = useCallback(async () => {
    setItems(await fetch("/api/checklist").then((r) => r.json()));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (item: Item) => {
    await fetch("/api/checklist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, done: !item.done }),
    });
    load();
  };

  const add = async () => {
    if (!newLabel.trim()) return;
    await fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim(), category: newCat, due: newDue || null }),
    });
    setNewLabel("");
    setNewDue("");
    load();
  };

  const del = async (id: number) => {
    await fetch(`/api/checklist?id=${id}`, { method: "DELETE" });
    load();
  };

  const grouped = useMemo(() => {
    if (!items) return [];
    const cats = new Map<string, Item[]>();
    for (const i of items) {
      const c = i.category ?? "Divers";
      cats.set(c, [...(cats.get(c) ?? []), i]);
    }
    return [...cats.entries()];
  }, [items]);

  if (!items) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-lg font-bold">Checklist — à revérifier avant toute action</h1>
        <p className="text-xs text-ink-3">
          Section 7 du mémo : cours, Fed, spot mémoire, capex, résultats, flux ETF…
        </p>
      </div>

      <Card title="Ajouter un point de contrôle">
        <div className="flex flex-wrap items-end gap-2">
          <label className="grow text-[11px] text-ink-3">
            Intitulé
            <input
              type="text"
              className="mt-0.5 block w-full"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
          </label>
          <label className="text-[11px] text-ink-3">
            Catégorie
            <select className="mt-0.5 block" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
              {["Avant exécution", "Macro", "Signaux", "Résultats", "Pratique", "Divers"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-[11px] text-ink-3">
            Échéance
            <input type="date" className="mt-0.5 block" value={newDue} onChange={(e) => setNewDue(e.target.value)} />
          </label>
          <Button onClick={add} disabled={!newLabel.trim()}>Ajouter</Button>
        </div>
      </Card>

      {grouped.map(([cat, list]) => (
        <Card key={cat} title={`${cat} (${list.filter((i) => !i.done).length}/${list.length})`}>
          <ul className="space-y-1">
            {list.map((item) => {
              const overdue = item.due && !item.done && item.due <= today;
              const soon =
                item.due && !item.done && !overdue &&
                (new Date(item.due).getTime() - Date.now()) / 8.64e7 <= 14;
              return (
                <li
                  key={item.id}
                  className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-xs hover:bg-card-hover"
                >
                  <input
                    type="checkbox"
                    checked={!!item.done}
                    onChange={() => toggle(item)}
                    className="mt-0.5 h-3.5 w-3.5 accent-[#3987e5]"
                  />
                  <span className={item.done ? "text-ink-3 line-through" : "text-ink-2"}>
                    {item.label}
                  </span>
                  {item.due && (
                    <span
                      className="ml-auto shrink-0 rounded-md px-1.5 py-0.5 text-[10px] tabular"
                      style={{
                        background: overdue
                          ? "rgba(208,59,59,0.15)"
                          : soon
                            ? "rgba(250,178,25,0.12)"
                            : "rgba(255,255,255,0.05)",
                        color: overdue ? "#f0908f" : soon ? "var(--warning)" : "var(--ink-3)",
                      }}
                    >
                      {overdue ? "⚠ " : ""}{fmtDate(item.due)}
                    </span>
                  )}
                  <button
                    onClick={() => del(item.id)}
                    className="invisible text-ink-3 hover:text-critical group-hover:visible"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </div>
  );
}
