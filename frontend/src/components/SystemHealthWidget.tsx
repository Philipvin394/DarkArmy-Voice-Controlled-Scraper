import { healthStats } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemHealthWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
              <div>
                <p className="text-sm text-slate-200">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.trend}</p>
              </div>
              <p className="text-sm font-medium text-cyan-200">{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
