"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  main: ReactNode;
  aside: ReactNode;
}

export function DashboardLayout({ main, aside }: DashboardLayoutProps) {
  const [showPanels, setShowPanels] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            Cyber Intelligence Workspace
          </h1>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="lg:hidden"
          onClick={() => setShowPanels((current) => !current)}
        >
          {showPanels ? "Hide panels" : "Show panels"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <main className="space-y-4">{main}</main>
        <aside
          className={cn(
            "space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/60 p-4 backdrop-blur-xl lg:block",
            showPanels ? "block" : "hidden",
          )}
        >
          {aside}
        </aside>
      </div>
    </div>
  );
}
