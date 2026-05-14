import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const nodes = [
  { region: "US-East", score: 74, x: "22%", y: "36%" },
  { region: "EU-West", score: 58, x: "49%", y: "28%" },
  { region: "APAC", score: 81, x: "73%", y: "52%" },
];

export function ThreatMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800">
          {nodes.map((node) => (
            <div key={node.region} className="absolute" style={{ left: node.x, top: node.y }}>
              <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <p className="mt-1 text-[11px] text-slate-300">{node.region}</p>
              <p className="text-[10px] text-slate-500">Risk {node.score}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
