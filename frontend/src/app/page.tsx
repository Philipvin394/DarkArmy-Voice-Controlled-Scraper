import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { IntelligenceCard } from "@/components/IntelligenceCard";
import { AICommandPanel } from "@/components/AICommandPanel";
import { WorkspaceGrid } from "@/components/WorkspaceGrid";
import { Button } from "@/components/ui/button";
import { defaultCommands } from "@/lib/mock-data";
import { FloatingAIEmblem } from "@/components/FloatingAIEmblem";
import Image from "next/image";

export default function Home() {
  return (
    <AppShell>
      <section className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-10">
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_75%_20%,rgba(147,51,234,0.22),transparent_35%)]" />
        <div className="relative grid items-center gap-8 xl:grid-cols-2">
          <div className="max-w-3xl">
          <div className="max-w-3xl">

            <div
        
            >
              {/* Ambient Glow */}
              <div className="absolute -left-10 top-0 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

              {/* Logo */}
              <div
                   className="
                   relative z-10
                   transition-transform duration-300
                   hover:scale-105
                 ">
                <Image
                  src="/Images/Darkarmy.png"
                  alt="Darkarmy Logo"
                  width={230}
                  height={230}
                  priority
                  className="
                    object-contain
                    drop-shadow-[0_0_40px_rgba(59,130,246,0.28)]
                  "
                />
              </div>

              {/* Branding Text */}
              <div className="mt-4">
                <h1
                  className="
                    text-3xl
                    md:text-5xl
                    font-bold
                    tracking-[0.35em]
                    text-zinc-100
                  "
                >
                  DARK ARMY
                </h1>

                <p className="mt-2 text-sm tracking-wide text-slate-400">
                  Cyber Intelligence Platform
                </p>
              </div>
            </div>

            <p className="text-sm text-blue-300">
              AI-Powered Cyber Intelligence Operations
            </p>

            <p className="mt-4 max-w-2xl text-slate-300">
              A tactical AI workspace for continuous cyber intelligence, threat correlation, and automated response planning.
            </p>

            <div className="mt-6 flex gap-3">
              <Link href="/dashboard">
                <Button size="lg">Launch Workspace</Button>
              </Link>

              <Link href="/voice-console">
                <Button variant="secondary" size="lg">
                  Start Voice Ops
                </Button>
              </Link>
            </div>
            </div>
          </div>
          <FloatingAIEmblem />
        </div>
      </section>

      <WorkspaceGrid>
        <div className="xl:col-span-7">
          <IntelligenceCard
            title="AI Threat Correlation"
            summary="Cross-source matching identified campaign overlap between credential leaks and active phishing infrastructure."
            score={84}
            meta="Updated 2 minutes ago"
          />
        </div>
        <div className="xl:col-span-5">
          <AICommandPanel />
        </div>
        <div className="glass-panel rounded-2xl p-5 xl:col-span-12">
          <p className="mb-3 text-sm text-slate-300">Suggested voice workflows</p>
          <ul className="grid gap-2 text-sm text-slate-200 md:grid-cols-2">
            {defaultCommands.map((item) => (
              <li key={item} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">{item}</li>
            ))}
          </ul>
        </div>
      </WorkspaceGrid>
    </AppShell>
  );
}
