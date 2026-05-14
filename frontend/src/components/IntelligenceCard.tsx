import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThreatScoreBadge } from "./ThreatScoreBadge";

type IntelligenceCardProps = {
  title: string;
  summary: string;
  score: number;
  meta: string;
};

export function IntelligenceCard({ title, summary, score, meta }: IntelligenceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{meta}</CardDescription>
        </div>
        <ThreatScoreBadge score={score} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-300">{summary}</p>
      </CardContent>
    </Card>
  );
}
