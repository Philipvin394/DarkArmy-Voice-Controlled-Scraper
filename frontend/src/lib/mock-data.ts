export const activityFeed = [
  { id: "a1", time: "14:01", event: "New phishing campaign pattern detected", source: "Email telemetry", risk: "high" },
  { id: "a2", time: "14:05", event: "Credential exposure matched to monitored tenant", source: "Dark web source", risk: "medium" },
  { id: "a3", time: "14:09", event: "Suspicious auth cluster contained by policy", source: "Identity guard", risk: "low" },
  { id: "a4", time: "14:14", event: "Threat correlation updated across 6 entities", source: "AI analyst", risk: "info" },
];

export const telemetrySeries = [
  { name: "Mon", detections: 22, prevented: 17, confidence: 81 },
  { name: "Tue", detections: 25, prevented: 20, confidence: 84 },
  { name: "Wed", detections: 34, prevented: 28, confidence: 87 },
  { name: "Thu", detections: 29, prevented: 23, confidence: 85 },
  { name: "Fri", detections: 38, prevented: 31, confidence: 90 },
  { name: "Sat", detections: 26, prevented: 21, confidence: 82 },
];

export const defaultCommands = [
  "Analyze latest ransomware campaign indicators",
  "Extract exposed emails and employee references",
  "Monitor domain anomalies in real time",
  "Scan for unprotected authentication endpoints",
];

export const aiInsights = [
  "Attack chain confidence increased by 12% after correlating login anomalies with leaked creds.",
  "Top exposure vector is third-party SSO misconfiguration in one monitored supplier domain.",
  "Recommended action: prioritize identity hardening and adaptive policy rollouts in 24h window.",
];

export const threatTimeline = [
  { id: "t1", label: "IOC ingestion", detail: "Batch 402 imported from external feeds", at: "13:42" },
  { id: "t2", label: "Behavioral match", detail: "Lateral movement signature matched in sandbox", at: "13:48" },
  { id: "t3", label: "Risk escalation", detail: "Correlation graph crossed critical threshold", at: "13:54" },
  { id: "t4", label: "Containment policy", detail: "Adaptive isolation pushed to endpoint group", at: "14:00" },
];

export const healthStats = [
  { label: "Collection nodes", value: "18 / 18", trend: "+2 this week" },
  { label: "Model confidence", value: "89.4%", trend: "+1.3%" },
  { label: "Active monitors", value: "142", trend: "Stable" },
];
