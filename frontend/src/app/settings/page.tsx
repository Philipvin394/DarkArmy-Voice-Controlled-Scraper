import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-300">
            <label className="block space-y-1">
              API endpoint
              <Input
                defaultValue="http://localhost:5050"
              />
            </label>
            <label className="block space-y-1">
              OpenAI key (optional parsing)
              <Input
                type="password"
                placeholder="sk-..."
              />
            </label>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="info">Proxy rotation enabled</Badge>
            <Badge variant="default">AI summarization enabled</Badge>
            <Badge variant="default">Browser recording enabled</Badge>
            <Badge variant="default">Scheduled jobs enabled</Badge>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
