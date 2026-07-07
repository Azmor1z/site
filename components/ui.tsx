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
    <section className={`card p-4 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
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
    <div className="card p-4">
      <div className="text-xs text-ink-3">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      {sub !== undefined && <div className={`mt-0.5 text-xs ${subClass}`}>{sub}</div>}
    </div>
  );
}

export function BlockChip({ block }: { block: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: BLOCK_COLORS[block] ?? "var(--ink-3)" }}
      />
      {blockLabel(block)}
    </span>
  );
}

const SIGNAL_STYLES: Record<Signal["level"], { bg: string; fg: string; icon: string }> = {
  danger: { bg: "rgba(208,59,59,0.14)", fg: "#f0908f", icon: "▼" },
  warning: { bg: "rgba(250,178,25,0.12)", fg: "var(--warning)", icon: "!" },
  success: { bg: "rgba(12,163,12,0.14)", fg: "#4cc94c", icon: "✓" },
  buy: { bg: "rgba(57,135,229,0.14)", fg: "#7db4f0", icon: "◎" },
  info: { bg: "rgba(255,255,255,0.06)", fg: "var(--ink-3)", icon: "i" },
};

export function SignalBadge({ signal }: { signal: Signal }) {
  const s = SIGNAL_STYLES[signal.level];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] leading-tight"
      style={{ background: s.bg, color: s.fg }}
      title={signal.label}
    >
      <span aria-hidden>{s.icon}</span>
      {signal.label}
    </span>
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
        : "bg-white/5 hover:bg-white/10 text-ink-2";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Spinner() {
  return (
    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/80 align-middle" />
  );
}
