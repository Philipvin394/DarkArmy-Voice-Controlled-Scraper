"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent } from "react";

export function FloatingAIEmblem() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { stiffness: 130, damping: 18 });
  const rotateY = useSpring(mouseX, { stiffness: 130, damping: 18 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    mouseX.set(x);
    mouseY.set(y);
  };

  const glow = useMotionTemplate`radial-gradient(240px circle at ${rotateY}px ${rotateX}px, rgba(56,189,248,0.35), transparent 65%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      onMouseMove={handleMove}
      className="relative mx-auto h-[360px] w-[360px]"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full rounded-[2.2rem] bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/70 backdrop-blur-xl"
      >
        <motion.div style={{ background: glow }} className="absolute inset-0 rounded-[2.2rem]" />
        <div className="absolute inset-4 rounded-[1.8rem] border border-white/10" />
        <Image
         src="/Images/Darkarmy.png"
         alt="Darkarmy AI emblem"
         width={320}
         height={320}
         className="relative z-10 h-full w-full object-contain drop-shadow-[0_18px_40px_rgba(14,165,233,0.25)]"
         unoptimized
       />
      
      </motion.div>
      <motion.div
        animate={{ scale: [0.95, 1.03, 0.95], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 4.2, repeat: Infinity }}
        className="absolute inset-6 -z-10 rounded-[2rem] bg-violet-400/20 blur-3xl"
      />
    </motion.div>
  );
}
