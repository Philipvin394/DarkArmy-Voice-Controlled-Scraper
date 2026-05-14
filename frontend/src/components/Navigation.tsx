"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Mic2, Radar, SearchCode, Settings, Shield } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Shield },
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/voice-console", label: "Voice", icon: Mic2 },
  { href: "/results", label: "Results", icon: SearchCode },
  { href: "/threat-monitor", label: "Threats", icon: Radar },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="glass-panel mb-6 flex flex-wrap items-center gap-2 rounded-2xl p-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
            pathname === link.href
              ? "bg-blue-500/20 text-blue-100"
              : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
