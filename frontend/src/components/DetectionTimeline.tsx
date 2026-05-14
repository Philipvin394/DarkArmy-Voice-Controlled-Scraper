import { threatTimeline } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DetectionTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {threatTimeline.map((item) => (
            <li key={item.id} className="relative border-l border-white/15 pl-4">
              <span className="absolute top-1 -left-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <p className="text-sm font-medium text-slate-100">{item.label}</p>
              <p className="text-xs text-slate-400">{item.detail}</p>
              <p className="mt-1 text-xs text-slate-500">{item.at}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
