import Image from "next/image";

export function DashboardWatermark() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-8 right-[-120px] opacity-[0.07]">
        <Image src="/api/brand-logo" alt="" width={620} height={620} className="object-contain" unoptimized />
      </div>
    </div>
  );
}
