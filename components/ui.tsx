"use client";

import { ReactNode } from "react";
import { BLOCK_LABELS, Block } from "@/lib/memo-data";
import type { Signal } from "@/lib/positions";

export const BLOCK_COLORS: Record<string, string> = {
  coeur: "var(--c-coeur)",
  satellite: "var(--c-satellite)",
  speculatif: "var(--c-speculatif)",
  crypto: "var(--c-crypto)",
  hedge: "var(--c-hedge)",
  cash: "var(--c-cash)",
};

export function blockLabel(block: string): string {
  return BLOCK_LABELS[block as Block] ?? block;
}

export function Card({
  title,
  children,
  className = "",
  action,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`card p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && <h2 className="text-[13px] font-semibold text-ink">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  sub,
  subClass = "text-ink-3",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  subClass?: string;
}) {
  return (
    <div>
      <div className="text-xs text-ink-3">{label}</div>
      <div className="mt-1 text-base font-semibold tabular">{value}</div>
      {sub !== undefined && <div className={`mt-0.5 text-xs ${subClass}`}>{sub}</div>}
    </div>
  );
}

/** Pastille ronde façon logo (initiales du ticker, teintée par bloc). */
export function TickerAvatar({
  ticker,
  block,
  size = 36,
}: {
  ticker: string;
  block: string;
  size?: number;
}) {
  const color = BLOCK_COLORS[block] ?? "var(--ink-3)";
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        color,
        background: `color-mix(in srgb, ${color} 16%, transparent)`,
      }}
      aria-hidden
    >
      {ticker.slice(0, 2)}
    </span>
  );
}

export function BlockChip({ block }: { block: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-ink-2"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: BLOCK_COLORS[block] ?? "var(--ink-3)" }}
      />
      {blockLabel(block)}
    </span>
  );
}

/** Variation encapsulée façon Revolut : ▲ +12 $ · +1,2 % */
export function DeltaChip({
  amount,
  pct,
  label,
}: {
  amount: string;
  pct?: string;
  label?: string;
}) {
  const neg = amount.trimStart().startsWith("-");
  const zero = !neg && !/[1-9]/.test(amount);
  const color = zero ? "var(--ink-3)" : neg ? "var(--neg)" : "var(--pos)";
  const bg = zero
    ? "rgba(255,255,255,0.05)"
    : neg
      ? "rgba(230,103,103,0.12)"
      : "rgba(34,176,34,0.12)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tabular"
      style={{ background: bg, color }}
    >
      {!zero && <span aria-hidden>{neg ? "▼" : "▲"}</span>}
      {amount}
      {pct && <span className="opacity-80">· {pct}</span>}
      {label && <span className="font-normal opacity-70">{label}</span>}
    </span>
  );
}

const SIGNAL_STYLES: Record<Signal["level"], { bg: string; fg: string; icon: string }> = {
  danger: { bg: "rgba(208,59,59,0.14)", fg: "#f0908f", icon: "▼" },
  warning: { bg: "rgba(250,178,25,0.10)", fg: "var(--warning)", icon: "!" },
  success: { bg: "rgba(12,163,12,0.14)", fg: "#4cc94c", icon: "✓" },
  buy: { bg: "rgba(57,135,229,0.14)", fg: "#7db4f0", icon: "◎" },
  info: { bg: "rgba(255,255,255,0.05)", fg: "var(--ink-3)", icon: "i" },
};

export function SignalBadge({ signal }: { signal: Signal }) {
  const s = SIGNAL_STYLES[signal.level];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] leading-tight"
      style={{ background: s.bg, color: s.fg }}
      title={signal.label}
    >
      <span aria-hidden>{s.icon}</span>
      {signal.label}
    </span>
  );
}

/** Point coloré discret pour signaler un état sur une ligne de liste. */
export function SignalDot({ level }: { level: Signal["level"] }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ background: SIGNAL_STYLES[level].fg }}
    />
  );
}

export function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-accent/90 hover:bg-accent text-white"
      : variant === "danger"
        ? "bg-critical/80 hover:bg-critical text-white"
        : "bg-white/6 hover:bg-white/10 text-ink-2";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

/** Sélecteur segmenté façon Trade Republic (pilules). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; title?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          title={o.title}
          className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
            value === o.value
              ? "bg-white/10 text-ink"
              : "text-ink-3 hover:bg-white/5 hover:text-ink-2"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Spinner() {
  return (
    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/80 align-middle" />
  );
}
