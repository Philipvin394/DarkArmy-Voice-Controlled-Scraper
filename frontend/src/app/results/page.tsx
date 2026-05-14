"use client";

import { AppShell } from "@/components/AppShell";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DetectionTimeline } from "@/components/DetectionTimeline";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";

type ScrapeResult = {
  id: string;
  url: string;
  title: string;
  emails?: string[];
  socialLinks?: string[];
  keywords?: string[];
  tags?: string[];
  summary?: string;
};

export default function ResultsPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ScrapeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Awaiting data pull...");
  const supabase = useMemo(() => createClient(), []);

  const primaryResult = useMemo(() => results[0], [results]);

  const toCsv = (rows: ScrapeResult[]) => {
    const headers = ["id", "url", "title", "keywords", "tags"];
    const lines = rows.map((row) => {
      const values = [
        row.id,
        row.url,
        row.title,
        `"${row.keywords?.join(";") || ""}"`,
        `"${row.tags?.join(";") || ""}"`,
      ];
      return values.join(",");
    });
    return [headers.join(","), ...lines].join("\n");
  };

  const loadResults = async () => {
    setLoading(true);
    try {
      let query = supabase.from("results").select("*").order("created_at", { ascending: false });

      if (search.trim()) {
        const term = search.trim();
        query = query.or(`url.ilike.%${term}%,title.ilike.%${term}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      setResults(data || []);
      setStatus(`Loaded ${data?.length || 0} intelligence records.`);
    } catch (error) {
      console.error("Load results error:", error);
      setStatus("Failed to sync results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();

    const channel = supabase
      .channel("results-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "results" },
        (payload) => {
          if (payload?.new) {
            setResults((prev) => [payload.new as ScrapeResult, ...prev]);
            setStatus("New intelligence added.");
          }
        },
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [search, supabase]);

  const exportFile = async (format: "json" | "csv") => {
    try {
      const { data, error } = await supabase.from('results').select('*');
      if (error) throw error;
      
      if (format === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `darkarmy-intel.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else if (format === "csv") {
        const csv = toCsv(data || []);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `darkarmy-intel.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <AppShell>
      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Results Viewer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex gap-2">
              <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags, keywords, target..."
            />
              <Button variant="secondary" onClick={loadResults}>
                {loading ? "Syncing..." : "Sync"}
              </Button>
            </div>
            <p className="mb-3 text-xs text-slate-500">{status}</p>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-slate-300">
                  <tr>
                    <th className="px-3 py-2">Target</th>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Signals</th>
                  </tr>
                </thead>
                <tbody>
                  {(results.length ? results : [primaryResult]).filter(Boolean).slice(0, 6).map((row) => (
                    <tr key={row?.id} className="border-t border-white/10 text-slate-200">
                      <td className="px-3 py-2">{row?.url}</td>
                      <td className="px-3 py-2">{row?.title || "Untitled result"}</td>
                      <td className="px-3 py-2">{row?.keywords?.slice(0, 2).join(", ") || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Export Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => exportFile("json")}>
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => exportFile("csv")}>
                Export CSV
              </Button>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge variant="info">AI summary attached</Badge>
              <Badge variant="default">Auto-tagged</Badge>
            </div>
            <pre className="mt-4 overflow-auto rounded-lg bg-slate-950/70 p-3 text-xs text-slate-300">
              {JSON.stringify(primaryResult || { hint: "Run a voice mission to populate results." }, null, 2)}
            </pre>
          </CardContent>
        </Card>
        <div className="xl:col-span-12">
          <DetectionTimeline />
        </div>
      </div>
    </AppShell>
  );
}
