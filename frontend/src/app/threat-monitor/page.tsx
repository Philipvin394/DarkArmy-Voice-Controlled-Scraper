import { AppShell } from "@/components/AppShell";
import { ThreatMap } from "@/components/ThreatMap";
import { DetectionTimeline } from "@/components/DetectionTimeline";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { IntelligenceCard } from "@/components/IntelligenceCard";
import { WorkspaceGrid } from "@/components/WorkspaceGrid";

export default function ThreatMonitorPage() {
  return (
    <AppShell>
      <WorkspaceGrid>
        <div className="xl:col-span-7">
          <ThreatMap />
        </div>
        <div className="xl:col-span-5">
          <IntelligenceCard
            title="Alert Prioritization"
            summary="AI assigned elevated risk to APAC node due to repeated credential stuffing signatures and anomalous geolocation patterns."
            score={88}
            meta="Priority queue refreshed 1 min ago"
          />
        </div>
        <div className="xl:col-span-6">
          <LiveActivityFeed />
        </div>
        <div className="xl:col-span-6">
          <DetectionTimeline />
        </div>
      </WorkspaceGrid>
    </AppShell>
  );
}
