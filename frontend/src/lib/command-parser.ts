export type VoiceAction =
  | "scan-domains"
  | "extract-emails"
  | "check-phishing"
  | "analyze-ransomware"
  | "unknown";

export type VoiceCommandParse = {
  command: string;
  action: VoiceAction;
  label: string;
};

export type VoiceCommandResult = {
  action: VoiceAction;
  status: "success" | "warning" | "error";
  summary: string;
  details: string;
  timestamp: string;
};

const commandMap = [
  {
    action: "scan-domains" as const,
    label: "Scan network domains",
    phrases: ["scan domains", "domain scan", "scan domain", "subdomain scan"],
  },
  {
    action: "extract-emails" as const,
    label: "Extract emails",
    phrases: ["extract emails", "email extraction", "find emails", "collect emails"],
  },
  {
    action: "check-phishing" as const,
    label: "Check phishing infrastructure",
    phrases: ["check phishing", "phishing scan", "detect phishing", "phishing infrastructure"],
  },
  {
    action: "analyze-ransomware" as const,
    label: "Analyze ransomware activity",
    phrases: ["analyze ransomware", "ransomware analysis", "ransomware scan", "check ransomware"],
  },
];

export function parseVoiceCommand(command: string): VoiceCommandParse {
  const normalized = command.trim().toLowerCase();

  if (!normalized) {
    return {
      command,
      action: "unknown",
      label: "No voice command detected",
    };
  }

  const match = commandMap.find((item) =>
    item.phrases.some((phrase) => normalized.includes(phrase))
  );

  if (match) {
    return {
      command,
      action: match.action,
      label: match.label,
    };
  }

  return {
    command,
    action: "unknown",
    label: "Unrecognized command",
  };
}

function createResult(action: VoiceAction): VoiceCommandResult {
  const base = {
    action,
    timestamp: new Date().toISOString(),
  } as const;

  switch (action) {
    case "scan-domains":
      return {
        ...base,
        status: "success",
        summary: "Domain reconnaissance executed.",
        details:
          "Simulated domain scan complete. Found active hosts, suspicious redirects, and exposed subdomains for follow-up.",
      };

    case "extract-emails":
      return {
        ...base,
        status: "success",
        summary: "Email extraction complete.",
        details:
          "Simulated OSINT extraction returned 14 unique addresses and contextual source links ready for backend enrichment.",
      };

    case "check-phishing":
      return {
        ...base,
        status: "warning",
        summary: "Phishing infrastructure review complete.",
        details:
          "Simulated check identified 3 suspicious landing pages and one malicious redirect chain. Review the threat score and escalations.",
      };

    case "analyze-ransomware":
      return {
        ...base,
        status: "warning",
        summary: "Ransomware behavior analysis complete.",
        details:
          "Simulated analysis flagged ransomware TTPs in the target surface and generated a high-priority alert payload.",
      };

    default:
      return {
        ...base,
        status: "error",
        summary: "Command not mapped.",
        details:
          "The transcript did not match a known cybersecurity action. Try a supported command phrase.",
      };
  }
}

export async function executeVoiceCommand(
  action: VoiceAction
): Promise<VoiceCommandResult> {
  // Placeholder for future backend integration.
  await new Promise((resolve) => setTimeout(resolve, 900));
  return createResult(action);
}

type SpeechRecognitionPlatform = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: (event: unknown) => void;
  onerror: (event: unknown) => void;
  onend: () => void;
};

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const globalWindow = window as Window & {
    webkitSpeechRecognition?: SpeechRecognitionPlatform;
    SpeechRecognition?: SpeechRecognitionPlatform;
  };

  return Boolean(globalWindow.SpeechRecognition || globalWindow.webkitSpeechRecognition);
}
