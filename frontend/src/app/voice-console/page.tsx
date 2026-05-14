import { AppShell } from "@/components/AppShell";
import { VoiceCommandCenter } from "@/components/VoiceCommandCenter";
import { AICommandPanel } from "@/components/AICommandPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VoiceConsolePage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-[2fr_1fr] xl:grid-cols-[2fr_1fr]">
        <div className="md:col-span-1">
          <VoiceCommandCenter />
        </div>
        <Card className="order-first md:order-none">
          <CardHeader>
            <CardTitle>Assistant Tone</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>Analysis complete.</li>
              <li>Monitoring active.</li>
              <li>New intelligence detected.</li>
              <li>Threat correlation updated.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="info">Conversational UX</Badge>
              <Badge variant="default">Intent extraction</Badge>
              <Badge variant="default">Action cards</Badge>
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2">
          <AICommandPanel />
        </div>
      </div>
    </AppShell>
  );
}
