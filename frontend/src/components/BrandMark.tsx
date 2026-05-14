import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
};

export function BrandMark({ className, imageClassName, showText = true }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative overflow-hidden rounded-xl border border-white/15 bg-slate-950/80 p-1">
        <Image
          src="/api/brand-logo"
          alt="Darkarmy insignia"
          width={46}
          height={46}
          className={cn("h-10 w-10 rounded-lg object-cover", imageClassName)}
          unoptimized
        />
      </div>
      {showText ? (
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-slate-100">DARKARMY</p>
          <p className="text-xs text-slate-400">Cyber Intelligence Platform</p>
        </div>
      ) : null}
    </div>
  );
}
