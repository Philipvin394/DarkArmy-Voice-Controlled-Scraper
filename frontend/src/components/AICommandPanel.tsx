"use client";

import { useMemo, useRef, useState } from "react";
import { parseVoiceCommand } from "@/lib/command-parser";
import { createClient } from "@/utils/supabase/client";

interface LocalSpeechRecognitionEvent {
  results: Array<{ 0: { transcript: string }; length: number }>;
}

interface LocalSpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

type SpeechRecognitionClass = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: () => void;
  onresult: (event: LocalSpeechRecognitionEvent) => void;
  onerror: (event: LocalSpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start(): void;
  stop(): void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionClass;

type SpeechWindow = Window & {
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
  SpeechRecognition?: SpeechRecognitionConstructor;
};

export function AICommandPanel() {
  const recognitionRef = useRef<SpeechRecognitionClass | null>(null);
  const [listening, setListening] = useState(false);
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState("Awaiting command...");
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const extractUrl = (text: string) => {
    const match = text.match(/https?:\/\/[\w.-]+(?:\/[\w\-./?=&%]*)?/i);
    return match?.[0] ?? "http://192.168.56.1:3000";
  };

  const handleCommand = async (transcript: string) => {
    try {
      setLoading(true);
      setStatus("Parsing command...");

      const parsed = parseVoiceCommand(transcript);
      const target = extractUrl(transcript);

      setStatus(parsed.label);
      setStatus("Launching scrape mission...");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const payload = {
        url: target,
        title: `Scraped data for ${target}`,
        keywords: [parsed.action],
        tags: [parsed.action, "voice-scrape"],
      };

      const { error } = await supabase.from("results").insert([payload]);
      if (error) {
        throw error;
      }

      setStatus("Scraping complete. Results saved to Supabase.");
    } catch (error) {
      console.error("AICommandPanel mission error:", error);
      setStatus("Mission failed. Check Supabase table and JSON payload.");
    } finally {
      setLoading(false);
    }
  };



  const startVoiceCommand = async () => {
    if (listening || loading) {
      return;
    }
  
    try {
      setStatus("Requesting microphone access...");
  
      const mediaDevices = navigator.mediaDevices;
      if (!mediaDevices || typeof mediaDevices.getUserMedia !== "function") {
        setStatus(
          "Your browser does not support microphone access. Please use Chrome or Edge."
        );
        return;
      }
  
      await mediaDevices.getUserMedia({
        audio: true,
      });
  
      const SpeechRecognition =
        (window as SpeechWindow).SpeechRecognition ||
        (window as SpeechWindow).webkitSpeechRecognition;
  
      if (!SpeechRecognition) {
        setStatus(
          "Speech recognition not supported in this browser."
        );
        return;
      }
  
      // stop old recognition instance safely
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
  
      const recognition = new SpeechRecognition();
  
      recognitionRef.current = recognition;
  
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
  
      recognition.onstart = () => {
        setListening(true);
        setStatus("Listening...");
      };
  
      recognition.onresult = async (event: LocalSpeechRecognitionEvent) => {
        try {
          const transcript =
            event.results[0][0].transcript;
  
          setCommand(transcript);
  
          setStatus("Command received.");
  
          await handleCommand(transcript);
        } catch (err) {
          console.error(err);
          setStatus("Could not process speech.");
        }
      };
  
      recognition.onerror = (event: LocalSpeechRecognitionErrorEvent) => {
        console.error(
          "Speech recognition full error:",
          event
        );
  
        const errorMessage =
          event?.error ||
          event?.message ||
          "Unknown speech error";
  
        switch (errorMessage) {
          case "not-allowed":
            setStatus(
              "Microphone permission blocked."
            );
            break;
  
          case "network":
            setStatus(
              "Speech recognition network issue."
            );
            break;
  
          case "no-speech":
            setStatus(
              "No speech detected."
            );
            break;
  
          case "audio-capture":
            setStatus(
              "No microphone found."
            );
            break;
  
          case "aborted":
            setStatus(
              "Voice recognition aborted."
            );
            break;
  
          default:
            setStatus(
              `Voice error: ${errorMessage}`
            );
        }
  
        setListening(false);
      };
  
      recognition.onend = () => {
        setListening(false);
  
        setStatus((prev) =>
          prev === "Listening..."
            ? "Awaiting command..."
            : prev
        );
      };
  
      recognition.start();
    } catch (error) {
      console.error("Microphone access error:", error);
  
      setListening(false);
  
      setStatus(
        "Failed to access microphone."
      );
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            AI status
          </p>

          <h3 className="text-lg font-semibold text-white">
            Voice Command Center
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`
              h-3
              w-3
              rounded-full
              ${
                listening
                  ? "animate-pulse bg-green-400"
                  : "bg-blue-400"
              }
            `}
          />

          <span className="text-xs text-slate-400">
            {listening
              ? "Microphone Active"
              : "Idle"}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={startVoiceCommand}
          disabled={loading || listening}
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-3
            text-white
            transition
            hover:bg-blue-500
            disabled:opacity-50
          "
        >
          {listening
            ? "Listening..."
            : loading
            ? "Processing..."
            : "Start Voice Command"}
        </button>

        {listening && (
          <div className="mt-5 flex items-center gap-1">
            <div className="h-8 w-1 animate-pulse rounded bg-cyan-400" />
            <div className="h-5 w-1 animate-pulse rounded bg-cyan-400" />
            <div className="h-10 w-1 animate-pulse rounded bg-cyan-400" />
            <div className="h-6 w-1 animate-pulse rounded bg-cyan-400" />
            <div className="h-8 w-1 animate-pulse rounded bg-cyan-400" />
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm text-slate-400">
          Recognized Command
        </p>

        <p className="mt-2 text-white">
          {command || "No command yet."}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm text-slate-400">
          Assistant Status
        </p>

        <p className="mt-2 text-blue-300">
          {status}
        </p>
      </div>
    </div>
  );
}