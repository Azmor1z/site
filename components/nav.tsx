"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Portefeuille", icon: "◆" },
  { href: "/transactions", label: "Transactions", icon: "⇄" },
  { href: "/analyse", label: "Analyse", icon: "◧" },
  { href: "/dca", label: "DCA & Plan", icon: "◔" },
  { href: "/checklist", label: "Checklist", icon: "☑" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {LINKS.map((l) => {
        const active =
          l.href === "/"
            ? pathname === "/" || pathname.startsWith("/asset")
            : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors ${
              active
                ? "bg-white/8 font-semibold text-ink"
                : "text-ink-3 hover:bg-white/5 hover:text-ink-2"
            }`}
          >
            <span className="w-4 text-center" aria-hidden>
              {l.icon}
            </span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
