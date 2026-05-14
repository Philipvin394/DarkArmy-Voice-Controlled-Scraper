"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const lines = ["Initializing intelligence core", "Calibrating AI signal mesh", "Darkarmy network synchronized"];

export function IntelligenceCoreBoot() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070d]/95"
        >
          <div className="glass-panel relative w-[92%] max-w-xl rounded-3xl p-8 text-center">
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.65 }}
              className="mx-auto mb-5 w-fit"
            >
              <Image src="/api/brand-logo" alt="Darkarmy core" width={120} height={120} className="rounded-2xl" unoptimized />
            </motion.div>
            <div className="space-y-2 text-sm text-slate-300">
              {lines.map((line, idx) => (
                <motion.p key={line} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.35 }}>
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
