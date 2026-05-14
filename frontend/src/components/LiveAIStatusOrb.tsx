"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LiveAIStatusOrb() {
  return (
    <div className="relative h-9 w-9">
      <motion.span
        animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.05, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-cyan-400/40"
      />
      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-cyan-200/40 bg-slate-900">
        <Image src="/api/brand-logo" alt="AI status" fill className="object-cover" unoptimized />
      </div>
    </div>
  );
}
