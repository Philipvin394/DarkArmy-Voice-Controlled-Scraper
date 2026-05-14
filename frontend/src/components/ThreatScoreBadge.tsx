import { Badge } from "@/components/ui/badge";

export function ThreatScoreBadge({ score }: { score: number }) {
  const variant = score >= 80 ? "high" : score >= 55 ? "medium" : "low";
  return <Badge variant={variant}>Risk Score {score}</Badge>;
}
