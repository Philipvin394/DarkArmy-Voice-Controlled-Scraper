"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Navigation } from "./Navigation";
import { FloatingCommandPalette } from "./FloatingCommandPalette";
import { BrandMark } from "./BrandMark";
import { LiveAIStatusOrb } from "./LiveAIStatusOrb";

export function AppShell({ children }: { children: ReactNode }) {
  const [cursor, setCursor] = useState({ x: 50, y: 50 });

  return (
    <div
      className="relative mx-auto w-full max-w-7xl p-4 md:p-8"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setCursor({ x, y });
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-30"
        style={{
          background: `radial-gradient(340px circle at ${cursor.x}% ${cursor.y}%, rgba(56,189,248,0.20), transparent 65%)`,
        }}
      />
      <div className="ambient-ring -top-16 -left-16 bg-blue-500/50" />
      <div className="ambient-ring top-16 right-4 bg-violet-500/40" />
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <BrandMark />
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <LiveAIStatusOrb />
          <div>
            <p className="text-xs text-slate-300">AI Monitoring</p>
            <p className="text-xs text-cyan-300">Active</p>
          </div>
        </div>
      </header>
      <Navigation />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-4"
      >
        {children}
      </motion.main>
      <FloatingCommandPalette />
    </div>
  );
}
