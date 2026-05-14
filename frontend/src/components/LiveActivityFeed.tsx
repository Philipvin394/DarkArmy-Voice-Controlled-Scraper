import { activityFeed } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LiveActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activityFeed.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm text-slate-200">{item.event}</p>
                <Badge variant={item.risk as "high" | "medium" | "low" | "info"}>{item.time}</Badge>
              </div>
              <p className="text-xs text-slate-400">{item.source}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
