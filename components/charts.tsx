"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from "recharts";
import { fmtUsd } from "@/lib/format";
import type { AssetRow } from "@/lib/db";
import type { McResult, McScenario } from "@/lib/montecarlo";

const INK3 = "#8a8f9b";
const GRID = "#262a33";

// Séries du graphique de cours (ordre fixe) : cours, MM50, MM200
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
      className="rounded-lg border px-3 py-2 text-xs"
      style={{ background: "#1d212a", borderColor: "rgba(255,255,255,0.12)" }}
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

const RANGES = [
  { label: "3M", days: 63 },
  { label: "6M", days: 126 },
  { label: "1A", days: 252 },
  { label: "2A", days: 9999 },
];

export function PriceChart({
  history,
  asset,
}: {
  history: { date: string; close: number }[];
  asset: AssetRow;
}) {
  const [range, setRange] = useState(252);

  const data = useMemo(() => {
    const closes = history.map((h) => h.close);
    const ma50 = rollingSma(closes, 50);
    const ma200 = rollingSma(closes, 200);
    const full = history.map((h, i) => ({
      date: h.date,
      close: h.close,
      ma50: ma50[i],
      ma200: ma200[i],
    }));
    return full.slice(-range);
  }, [history, range]);

  if (history.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-ink-3">
        Pas d&apos;historique — cliquez sur « Rafraîchir les cours ».
      </div>
    );
  }

  const values = data.map((d) => d.close);
  const levels = [asset.stop_price, asset.buy_low, asset.buy_high, asset.tp1_low, asset.obj_low]
    .filter((v): v is number => v !== null);
  const yMin = Math.min(...values, ...levels) * 0.97;
  const yMax = Math.max(...values, ...levels) * 1.03;

  return (
    <div>
      <div className="mb-2 flex justify-end gap-1">
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setRange(r.days)}
            className={`rounded-md px-2 py-0.5 text-[11px] ${
              range === r.days ? "bg-white/10 font-semibold text-ink" : "text-ink-3 hover:text-ink-2"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 4, right: 56, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: INK3, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: GRID }}
            minTickGap={60}
            tickFormatter={(d: string) =>
              new Date(d).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
            }
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: INK3, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(v: number) => v.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
          />
          <Tooltip content={<DarkTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: INK3 }}
            iconType="plainline"
            formatter={(v) => <span style={{ color: "#b6bac4" }}>{v}</span>}
          />
          {asset.buy_low !== null && asset.buy_high !== null && (
            <ReferenceArea
              y1={asset.buy_low}
              y2={asset.buy_high}
              fill="rgba(12,163,12,0.09)"
              stroke="rgba(12,163,12,0.25)"
              strokeDasharray="4 4"
              label={{ value: "Zone d'achat", position: "insideTopRight", fill: "#4cc94c", fontSize: 10 }}
            />
          )}
          {asset.stop_price !== null && (
            <ReferenceLine
              y={asset.stop_price}
              stroke="#d03b3b"
              strokeDasharray="5 4"
              label={{ value: `Stop ${asset.stop_price}`, position: "right", fill: "#f0908f", fontSize: 10 }}
            />
          )}
          {asset.tp1_low !== null && (
            <ReferenceLine
              y={asset.tp1_low}
              stroke="#4cc94c"
              strokeDasharray="5 4"
              label={{ value: `TP1 ${asset.tp1_low}`, position: "right", fill: "#4cc94c", fontSize: 10 }}
            />
          )}
          {asset.obj_low !== null && (
            <ReferenceLine
              y={asset.obj_low}
              stroke="#199e70"
              strokeDasharray="2 4"
              label={{ value: `Obj. ${asset.obj_low}`, position: "right", fill: "#199e70", fontSize: 10 }}
            />
          )}
          <Line name="Cours" type="monotone" dataKey="close" stroke={S_PRICE} strokeWidth={2} dot={false} />
          <Line name="MM50" type="monotone" dataKey="ma50" stroke={S_MA50} strokeWidth={1.5} dot={false} />
          <Line name="MM200" type="monotone" dataKey="ma200" stroke={S_MA200} strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function McConeChart({
  mc,
  scenario,
}: {
  mc: McResult;
  scenario: McScenario;
}) {
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
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 4, right: 56, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="month"
          type="number"
          domain={[0, 24]}
          ticks={[0, 3, 6, 9, 12, 18, 24]}
          tick={{ fill: INK3, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: GRID }}
          tickFormatter={(v: number) => `${v} m`}
        />
        <YAxis
          domain={[yMin, yMax]}
          tick={{ fill: INK3, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v: number) => v.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}
        />
        <Tooltip
          content={<DarkTooltip formatLabel={(v) => `${Number(v).toFixed(1)} mois`} />}
        />
        <Legend
          wrapperStyle={{ fontSize: 11 }}
          formatter={(v) => <span style={{ color: "#b6bac4" }}>{v}</span>}
        />
        <Area
          name="90 % des trajectoires (p5–p95)"
          dataKey="band90"
          stroke="none"
          fill="#184f95"
          fillOpacity={0.28}
          isAnimationActive={false}
        />
        <Area
          name="50 % des trajectoires (p25–p75)"
          dataKey="band50"
          stroke="none"
          fill="#2a78d6"
          fillOpacity={0.35}
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
  );
}
