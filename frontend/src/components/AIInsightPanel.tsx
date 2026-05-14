import { aiInsights } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AIInsightPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insight Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {aiInsights.map((insight) => (
            <li key={insight} className="rounded-xl border border-violet-400/20 bg-violet-500/10 p-3 text-sm text-slate-200">
              {insight}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
