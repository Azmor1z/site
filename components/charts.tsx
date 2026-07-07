"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { fmtUsd, fmtPct } from "@/lib/format";
import { Segmented, DeltaChip } from "@/components/ui";
import type { AssetRow } from "@/lib/db";
import type { McResult, McScenario } from "@/lib/montecarlo";

const INK3 = "#8a8f9b";

// Séries (ordre fixe) : cours/valeur = bleu, MM50 = jaune, MM200 = violet
const S_PRICE = "#3987e5";
const S_MA50 = "#c98500";
const S_MA200 = "#9085e9";

function rollingSma(values: number[], n: number): (number | null)[] {
  const out: (number | null)[] = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= n) sum -= values[i - n];
    if (i >= n - 1) out[i] = sum / n;
  }
  return out;
}

function DarkTooltip({
  active,
  label,
  payload,
  formatLabel,
}: {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string; value?: number | number[]; color?: string }[];
  formatLabel?: (label: string | number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2 text-xs shadow-lg"
      style={{ background: "#1b1e26", borderColor: "rgba(255,255,255,0.10)" }}
    >
      <div className="mb-1 font-medium text-ink-2">
        {formatLabel && label !== undefined ? formatLabel(label) : label}
      </div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 tabular">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-ink-3">{p.name}</span>
          <span className="ml-auto pl-3 font-medium text-ink">
            {Array.isArray(p.value)
              ? `${fmtUsd(p.value[0])} → ${fmtUsd(p.value[1])}`
              : fmtUsd(p.value as number)}
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniLegend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  if (items.length < 2) return null;
  return (
    <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-[11px] text-ink-3">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-4 rounded-full"
            style={{
              background: it.dashed
                ? `repeating-linear-gradient(90deg, ${it.color} 0 3px, transparent 3px 6px)`
                : it.color,
            }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

const fmtDateShort = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "2-digit" });

/* ————— Courbe de valeur du portefeuille (style Trade Republic) ————— */

const PF_RANGES = [
  { value: "1M", days: 21 },
  { value: "3M", days: 63 },
  { value: "6M", days: 126 },
  { value: "1A", days: 252 },
  { value: "Tout", days: 99999 },
] as const;

export function PortfolioChart({
  data,
}: {
  data: { date: string; value: number; invested: number }[];
}) {
  const [range, setRange] = useState<string>("3M");

  const slice = useMemo(() => {
    const days = PF_RANGES.find((r) => r.value === range)?.days ?? 63;
    return data.slice(-days);
  }, [data, range]);

  if (data.length < 2) return null;

  const first = slice[0];
  const last = slice[slice.length - 1];
  const delta = last.value - first.value;
  const deltaPct = first.value > 0 ? (delta / first.value) * 100 : null;
  const up = delta >= 0;
  const lineColor = up ? "#22b022" : "#e66767";

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <DeltaChip
          amount={fmtUsd(delta, 0)}
          pct={deltaPct !== null ? fmtPct(deltaPct, 1, true) : undefined}
          label={range === "Tout" ? "depuis le début" : `sur ${range}`}
        />
        <span className="text-[11px] text-ink-3">versements inclus</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={slice} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="pfFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.22} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Tooltip content={<DarkTooltip formatLabel={(v) => fmtDateShort(String(v))} />} />
          <Area
            name="Valeur"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            fill="url(#pfFill)"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            name="Versements"
            dataKey="invested"
            stroke={INK3}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <MiniLegend
        items={[
          { label: "Valeur", color: lineColor },
          { label: "Versements cumulés", color: INK3, dashed: true },
        ]}
      />
      <div className="mt-2 flex justify-center">
        <Segmented
          options={PF_RANGES.map((r) => ({ value: r.value, label: r.value }))}
          value={range}
          onChange={setRange}
        />
      </div>
    </div>
  );
}

/* ————— Graphique de cours par titre ————— */

const RANGES = [
  { value: "3M", days: 63 },
  { value: "6M", days: 126 },
  { value: "1A", days: 252 },
  { value: "2A", days: 9999 },
] as const;

export function PriceChart({
  history,
  asset,
}: {
  history: { date: string; close: number }[];
  asset: AssetRow;
}) {
  const [range, setRange] = useState<string>("1A");
  const [showMM, setShowMM] = useState(true);
  const [showLevels, setShowLevels] = useState(true);

  const data = useMemo(() => {
    const days = RANGES.find((r) => r.value === range)?.days ?? 252;
    const closes = history.map((h) => h.close);
    const ma50 = rollingSma(closes, 50);
    const ma200 = rollingSma(closes, 200);
    return history
      .map((h, i) => ({ date: h.date, close: h.close, ma50: ma50[i], ma200: ma200[i] }))
      .slice(-days);
  }, [history, range]);

  if (history.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-ink-3">
        Pas d&apos;historique — cliquez sur « Actualiser » depuis le tableau de bord.
      </div>
    );
  }

  const values = data.map((d) => d.close);
  const levels = showLevels
    ? [asset.stop_price, asset.buy_low, asset.buy_high, asset.tp1_low, asset.obj_low].filter(
        (v): v is number => v !== null
      )
    : [];
  const yMin = Math.min(...values, ...levels) * 0.97;
  const yMax = Math.max(...values, ...levels) * 1.03;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <Segmented
          options={RANGES.map((r) => ({ value: r.value, label: r.value }))}
          value={range}
          onChange={setRange}
        />
        <div className="flex gap-1">
          <button
            onClick={() => setShowMM(!showMM)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
              showMM ? "bg-white/10 text-ink" : "text-ink-3 hover:bg-white/5"
            }`}
          >
            MM50/200
          </button>
          <button
            onClick={() => setShowLevels(!showLevels)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
              showLevels ? "bg-white/10 text-ink" : "text-ink-3 hover:bg-white/5"
            }`}
          >
            Niveaux
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 4, right: showLevels ? 54 : 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={S_PRICE} stopOpacity={0.18} />
              <stop offset="100%" stopColor={S_PRICE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: INK3, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            minTickGap={70}
            tickFormatter={(d: string) =>
              new Date(d).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
            }
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: INK3, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickCount={5}
            tickFormatter={(v: number) => v.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
          />
          <Tooltip content={<DarkTooltip formatLabel={(v) => fmtDateShort(String(v))} />} />
          {showLevels && asset.buy_low !== null && asset.buy_high !== null && (
            <ReferenceArea
              y1={asset.buy_low}
              y2={asset.buy_high}
              fill="rgba(12,163,12,0.08)"
              stroke="rgba(12,163,12,0.22)"
              strokeDasharray="4 4"
            />
          )}
          {showLevels && asset.stop_price !== null && (
            <ReferenceLine
              y={asset.stop_price}
              stroke="#d03b3b"
              strokeDasharray="5 4"
              label={{ value: `Stop ${asset.stop_price}`, position: "right", fill: "#f0908f", fontSize: 10 }}
            />
          )}
          {showLevels && asset.tp1_low !== null && (
            <ReferenceLine
              y={asset.tp1_low}
              stroke="#4cc94c"
              strokeDasharray="5 4"
              label={{ value: `TP1 ${asset.tp1_low}`, position: "right", fill: "#4cc94c", fontSize: 10 }}
            />
          )}
          {showLevels && asset.obj_low !== null && (
            <ReferenceLine
              y={asset.obj_low}
              stroke="#199e70"
              strokeDasharray="2 4"
              label={{ value: `Obj. ${asset.obj_low}`, position: "right", fill: "#199e70", fontSize: 10 }}
            />
          )}
          <Area
            name="Cours"
            dataKey="close"
            stroke={S_PRICE}
            strokeWidth={2}
            fill="url(#priceFill)"
            dot={false}
            isAnimationActive={false}
          />
          {showMM && (
            <Line name="MM50" dataKey="ma50" stroke={S_MA50} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          )}
          {showMM && (
            <Line name="MM200" dataKey="ma200" stroke={S_MA200} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      {showMM && (
        <MiniLegend
          items={[
            { label: "Cours", color: S_PRICE },
            { label: "MM50", color: S_MA50 },
            { label: "MM200", color: S_MA200 },
          ]}
        />
      )}
    </div>
  );
}

/* ————— Cône Monte Carlo ————— */

export function McConeChart({ mc, scenario }: { mc: McResult; scenario: McScenario }) {
  const data = useMemo(
    () =>
      [{ day: 0, p5: mc.s0, p25: mc.s0, p50: mc.s0, p75: mc.s0, p95: mc.s0 }, ...scenario.cone].map(
        (c) => ({
          month: c.day / 21,
          band90: [c.p5, c.p95] as [number, number],
          band50: [c.p25, c.p75] as [number, number],
          median: c.p50,
        })
      ),
    [mc, scenario]
  );

  const { tp1, obj, stop } = mc.levels;
  const last = scenario.cone[scenario.cone.length - 1];
  const yMax = Math.max(last.p95, obj ?? 0) * 1.02;
  const yMin = Math.min(last.p5, stop ?? Infinity, mc.s0) * 0.9;

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 4, right: 54, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="month"
            type="number"
            domain={[0, 24]}
            ticks={[0, 3, 6, 9, 12, 18, 24]}
            tick={{ fill: INK3, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v} m`}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: INK3, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={52}
            tickCount={5}
            tickFormatter={(v: number) => v.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
          />
          <Tooltip
            content={<DarkTooltip formatLabel={(v) => `${Number(v).toFixed(1)} mois`} />}
          />
          <Area
            name="90 % des trajectoires"
            dataKey="band90"
            stroke="none"
            fill="#184f95"
            fillOpacity={0.26}
            isAnimationActive={false}
          />
          <Area
            name="50 % des trajectoires"
            dataKey="band50"
            stroke="none"
            fill="#2a78d6"
            fillOpacity={0.34}
            isAnimationActive={false}
          />
          <Line
            name="Médiane"
            dataKey="median"
            stroke="#6da7ec"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          {tp1 !== null && (
            <ReferenceLine
              y={tp1}
              stroke="#4cc94c"
              strokeDasharray="5 4"
              label={{ value: `TP1 ${tp1}`, position: "right", fill: "#4cc94c", fontSize: 10 }}
            />
          )}
          {obj !== null && (
            <ReferenceLine
              y={obj}
              stroke="#199e70"
              strokeDasharray="2 4"
              label={{ value: `Obj. ${obj}`, position: "right", fill: "#199e70", fontSize: 10 }}
            />
          )}
          {stop !== null && (
            <ReferenceLine
              y={stop}
              stroke="#d03b3b"
              strokeDasharray="5 4"
              label={{ value: `Stop ${stop}`, position: "right", fill: "#f0908f", fontSize: 10 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <MiniLegend
        items={[
          { label: "Médiane", color: "#6da7ec" },
          { label: "50 % des trajectoires", color: "#2a78d6" },
          { label: "90 % des trajectoires", color: "#184f95" },
        ]}
      />
    </div>
  );
}
