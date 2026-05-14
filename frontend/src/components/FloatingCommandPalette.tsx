"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { LiveAIStatusOrb } from "./LiveAIStatusOrb";

export function FloatingCommandPalette() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed right-6 bottom-6 z-40 hidden w-80 items-center gap-2 rounded-2xl border border-white/15 bg-slate-950/80 p-3 backdrop-blur-xl md:flex"
    >
      <LiveAIStatusOrb />
      <Search className="h-4 w-4 text-slate-400" />
      <Input className="h-8 border-0 bg-transparent px-1" placeholder="Command palette..." />
      <span className="rounded-md border border-white/15 px-2 py-0.5 text-[10px] text-slate-400">Ctrl K</span>
    </motion.div>
  );
}
