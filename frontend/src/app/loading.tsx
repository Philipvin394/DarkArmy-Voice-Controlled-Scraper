import { Skeleton } from "@/components/ui/skeleton";
import { BrandMark } from "@/components/BrandMark";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-8">
      <BrandMark />
      <Skeleton className="h-14 w-64" />
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    </div>
  );
}
