import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { NavLinks } from "@/components/nav";

export const metadata: Metadata = {
  title: "Cockpit US — Suivi d'investissements",
  description:
    "Suivi de portefeuille actions US : positions, niveaux d'exécution, signaux, Monte Carlo, DCA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          <aside className="sticky top-0 flex h-screen w-52 shrink-0 flex-col border-r border-white/8 bg-surface px-3 py-5">
            <Link href="/" className="mb-6 flex items-center gap-2 px-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-bold text-white"
                style={{ background: "linear-gradient(135deg, #2a78d6, #184f95)" }}
              >
                ◆
              </span>
              <div>
                <div className="text-sm font-bold leading-tight">Cockpit US</div>
                <div className="text-[10px] text-ink-3">Stratégie actions 2026</div>
              </div>
            </Link>
            <NavLinks />
            <div className="mt-auto px-2 text-[10px] leading-snug text-ink-3">
              Analyse d&apos;information et de méthode — pas un conseil en investissement.
              Cours à revérifier avant toute exécution.
            </div>
          </aside>
          <main className="min-w-0 flex-1 px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
