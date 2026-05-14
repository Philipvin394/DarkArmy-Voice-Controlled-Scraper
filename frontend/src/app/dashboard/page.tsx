"use client";

import { AppShell } from "@/components/AppShell";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { AIInsightPanel } from "@/components/AIInsightPanel";
import { DetectionTimeline } from "@/components/DetectionTimeline";
import { SystemHealthWidget } from "@/components/SystemHealthWidget";
import { DashboardLayout } from "@/components/DashboardLayout";
import { telemetrySeries } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardWatermark } from "@/components/DashboardWatermark";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type DashboardItem = {
  id: string;
  title: string;
  url: string;
};

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const [data, setData] = useState<DashboardItem[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Test Supabase connectivity
    const testConnection = async () => {
      try {
        const { error } = await supabase.from("results").select("count").limit(1);
        setSupabaseConnected(!error);
      } catch {
        setSupabaseConnected(false);
      }
    };

    testConnection();

    const loadData = async () => {
      const { data: results, error } = await supabase
        .from("results")
        .select("id,title,url")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error("Dashboard results fetch failed", error);
        return;
      }

      setData(results || []);
    };

    loadData();

    const channel = supabase
      .channel("dashboard-results")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "results" },
        (payload) => {
          if (payload?.new) {
            setData((prev) => [payload.new as DashboardItem, ...prev].slice(0, 6));
          }
        },
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [supabase]);

  return (
    <AppShell>
      <DashboardLayout
        main={
          <>
            <div className="p-6 rounded-[2rem] border border-white/10 bg-slate-950/70">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Intelligence Feed</p>
                  <h2 className="text-2xl font-semibold text-white sm:text-3xl">Live campaign signal</h2>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        supabaseConnected === true
                          ? "bg-green-400"
                          : supabaseConnected === false
                          ? "bg-red-400"
                          : "bg-yellow-400 animate-pulse"
                      }`}
                    />
                    <span className="text-slate-400">
                      {supabaseConnected === true
                        ? "Supabase Connected"
                        : supabaseConnected === false
                        ? "Supabase Disconnected"
                        : "Checking Connection..."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((item: DashboardItem, i: number) => (
                  <div key={i} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                    <p className="font-medium text-slate-100">{item.title}</p>
                    <a
                      href={item.url}
                      className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 px-4 py-5 sm:px-6 sm:py-6">
              <DashboardWatermark />
              <Card>
                <CardHeader>
                  <CardTitle>Live Telemetry</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetrySeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="detections" stroke="#60a5fa" fill="#3b82f620" />
                      <Area type="monotone" dataKey="prevented" stroke="#22d3ee" fill="#22d3ee20" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        }
        aside={
          <>
            <SystemHealthWidget />
            <LiveActivityFeed />
            <AIInsightPanel />
            <DetectionTimeline />
          </>
        }
      />
    </AppShell>
  );

  
}
