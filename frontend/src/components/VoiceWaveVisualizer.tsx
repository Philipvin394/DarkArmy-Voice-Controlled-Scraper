"use client";

import { motion } from "framer-motion";

export function VoiceWaveVisualizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-16 items-end gap-1">
      {Array.from({ length: 20 }).map((_, idx) => (
        <motion.span
          key={idx}
          animate={{
            height: active ? [8, 28 + (idx % 4) * 6, 10] : 6,
            opacity: active ? [0.4, 1, 0.5] : 0.3,
          }}
          transition={{ repeat: Infinity, duration: 1.1 + idx * 0.03 }}
          className="w-1.5 rounded-full bg-gradient-to-t from-blue-500 to-cyan-300"
        />
      ))}
    </div>
  );
}
