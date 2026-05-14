import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-white/15 bg-white/10 text-slate-200",
        high: "border-red-400/30 bg-red-500/15 text-red-200",
        medium: "border-amber-400/30 bg-amber-500/15 text-amber-200",
        low: "border-emerald-400/30 bg-emerald-500/15 text-emerald-200",
        info: "border-cyan-400/30 bg-cyan-500/15 text-cyan-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
