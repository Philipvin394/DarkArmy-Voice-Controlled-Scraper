/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveAIStatusOrb } from "./LiveAIStatusOrb";
import { VoiceWaveVisualizer } from "./VoiceWaveVisualizer";
import { MicPermissionModal } from "./MicPermissionModal";
import {
  executeVoiceCommand,
  isSpeechRecognitionSupported,
  parseVoiceCommand,
  VoiceCommandParse,
  VoiceCommandResult,
} from "@/lib/command-parser";
import { createClient } from "@/utils/supabase/client";
import { speechService, type SpeechServiceError, type SpeechState } from "@/lib/speechService";

function statusVariant(status: string) {
  if (status.toLowerCase().includes("error") || status.toLowerCase().includes("denied")) {
    return "high" as const;
  }
  if (status.toLowerCase().includes("ready") || status.toLowerCase().includes("success")) {
    return "low" as const;
  }
  return "default" as const;
}

export function VoiceCommandCenter() {
  const supabase = useMemo(() => createClient(), []);
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [parsedCommand, setParsedCommand] = useState<VoiceCommandParse | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Ready to receive a cybersecurity command."
  );
  const [assistantStatus, setAssistantStatus] = useState<string>("Idle");
  const [commandResult, setCommandResult] = useState<VoiceCommandResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionModalMessage, setPermissionModalMessage] = useState(
    "Microphone permission is required to process voice commands."
  );
  const [voiceState, setVoiceState] = useState<SpeechState>("idle");

  const extractUrl = (text: string) => {
    const match = text.match(/https?:\/\/[\w.-]+(?:\/[\w\-./?=&%]*)?/i);
    return match?.[0] ?? "http://192.168.56.1:3000";
  };

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
    setVoiceState(speechService.currentState);

    const unsubscribeState = speechService.onState((state) => {
      setVoiceState(state);
      setIsListening(state === "listening");

      if (state === "idle" && !errorMessage) {
        setStatusMessage("Ready for the next command.");
        setAssistantStatus("Idle");
      }
    });

    const unsubscribeError = speechService.onError(handleSpeechServiceError);
    const unsubscribeResult = speechService.onResult(handleSpeechServiceResult);

    return () => {
      unsubscribeState();
      unsubscribeError();
      unsubscribeResult();
      speechService.stopListening();
    };
  }, [errorMessage]);

  const resetSession = () => {
    setTranscript("");
    setParsedCommand(null);
    setCommandResult(null);
    setErrorMessage(null);
    setStatusMessage("Ready to receive a cybersecurity command.");
    setAssistantStatus("Idle");
  };

  const handleSpeechServiceError = (error: SpeechServiceError) => {
    console.error("SpeechService error:", error);

    let message = error.message;
    if (error.kind === "not-allowed") {
      message =
        "Microphone permission denied. Please allow microphone access in your browser settings.";
      setShowPermissionModal(true);
    } else if (error.kind === "service-not-allowed") {
      message = "Browser is blocking the speech recognition service. Please review browser permissions.";
      setShowPermissionModal(true);
    } else if (error.kind === "no-speech") {
      message = "No speech detected. Speak clearly into the microphone and try again.";
    } else if (error.kind === "audio-capture") {
      message = "No microphone detected. Please connect a microphone and retry.";
    }

    setErrorMessage(message);
    setStatusMessage("Voice engine error detected.");
    setAssistantStatus("Retry required");
  };

  const handleSpeechServiceResult = async ({ transcript }: { transcript: string }) => {
    const normalizedTranscript = transcript.trim();

    setTranscript(normalizedTranscript);
    setStatusMessage("Parsing command intent...");
    setAssistantStatus("Analyzing voice input");
    setErrorMessage(null);

    const parsed = parseVoiceCommand(normalizedTranscript);
    setParsedCommand(parsed);

    if (parsed.action === "unknown") {
      setStatusMessage("Command not recognized.");
      setAssistantStatus("Requires supported phrase");
      setCommandResult(null);
      speechService.stopListening();
      return;
    }

    setStatusMessage(`Executing: ${parsed.label}`);
    setAssistantStatus("Saving intelligence record");

    try {
      const result = await executeVoiceCommand(parsed.action);
      const payload = {
        url: extractUrl(normalizedTranscript),
        title: `${parsed.label} — ${normalizedTranscript.slice(0, 60)}`,
        keywords: [parsed.action],
        tags: [parsed.action, "voice-command"],
        summary: result.summary,
      };

      const { error } = await supabase.from("results").insert([payload]);
      if (error) {
        throw error;
      }

      setCommandResult(result);
      setStatusMessage(
        result.status === "success"
          ? "Mission complete and saved."
          : "Mission complete with warnings."
      );
      setAssistantStatus(result.summary);
    } catch (error) {
      console.error("Voice command execution failed", error);
      setErrorMessage("Command execution failed. Please try again.");
      setStatusMessage("Execution error.");
      setAssistantStatus("Retry required");
    } finally {
      speechService.stopListening();
    }
  };

  const handleStartListening = async () => {
    resetSession();
    setErrorMessage(null);
    setStatusMessage("Requesting microphone access...");
    setAssistantStatus("Awaiting permission");

    try {
      await speechService.startListening();
    } catch (error) {
      console.error("Failed to request microphone access:", error);
      setErrorMessage(
        "Unable to start voice recognition. Please grant microphone access and try again."
      );
      setStatusMessage("Permission required.");
      setAssistantStatus("Retry required");
    }
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
    setStatusMessage("Microphone turned off.");
  };

  const handleRetryPermission = async () => {
    setShowPermissionModal(false);
    setPermissionModalMessage(
      "Retry microphone access to continue using voice commands."
    );
    await handleStartListening();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Voice Command Center</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <VoiceWaveVisualizer active={isListening} />

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] items-center">
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Microphone status</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={isSupported ? "info" : "default"}>
                    {isSupported ? "Web Speech API supported" : "Unsupported browser"}
                  </Badge>
                  <Badge variant={isListening ? "high" : "default"}>
                    {isListening ? "Listening" : "Idle"}
                  </Badge>
                  <Badge variant={statusVariant(voiceState)}>
                    {voiceState}
                  </Badge>
                  <Badge variant={statusVariant(assistantStatus)}>
                    {assistantStatus}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                <Button onClick={handleStartListening} disabled={!isSupported || isListening}>
                  Start listening
                </Button>
                <Button variant="secondary" onClick={handleStopListening} disabled={!isListening}>
                  Stop
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Recognized transcript
                </p>
                <p className="mt-3 min-h-[4rem] text-sm text-slate-100">
                  {transcript || "No voice input captured yet."}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Detected command
                </p>
                <p className="mt-3 min-h-[4rem] text-sm text-slate-100">
                  {parsedCommand?.label || "Awaiting a supported command phrase."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Assistant status
                  </p>
                  <p className="mt-2 text-sm text-slate-100">{statusMessage}</p>
                </div>
                <LiveAIStatusOrb />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Mission output
              </p>
              <div className="mt-3 space-y-3">
                {errorMessage ? (
                  <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200">
                    {errorMessage}
                  </div>
                ) : commandResult ? (
                  <div className="space-y-2 text-sm text-slate-200">
                    <p>{commandResult.summary}</p>
                    <p className="text-slate-400 whitespace-pre-line">{commandResult.details}</p>
                    <p className="text-xs uppercase text-slate-500">
                      Action: {commandResult.action}
                    </p>
                    <p className="text-xs uppercase text-slate-500">
                      Timestamp: {new Date(commandResult.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    Say one of the supported commands to generate a simulated mission result.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <MicPermissionModal
        open={showPermissionModal}
        message={permissionModalMessage}
        onRetry={handleRetryPermission}
        onClose={() => setShowPermissionModal(false)}
      />
    </>
  );
}
