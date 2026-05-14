type SpeechState =
  | "idle"
  | "requesting-permission"
  | "listening"
  | "processing"
  | "errored"
  | "unsupported";

type SpeechErrorKind =
  | "not-allowed"
  | "service-not-allowed"
  | "no-speech"
  | "audio-capture"
  | "network"
  | "aborted"
  | "timeout"
  | "unsupported"
  | "unknown";

export interface SpeechServiceError {
  kind: SpeechErrorKind;
  message: string;
  original?: unknown;
}

export interface SpeechServiceResult {
  transcript: string;
}

export type SpeechStateChange = (state: SpeechState) => void;
export type SpeechResultHandler = (result: SpeechServiceResult) => void;
export type SpeechErrorHandler = (error: SpeechServiceError) => void;

type Listener<T> = (payload: T) => void;

type SpeechRecognitionConstructor = new () => SpeechRecognition;

const getSpeechRecognitionConstructor =
  (): SpeechRecognitionConstructor | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    return win.SpeechRecognition || win.webkitSpeechRecognition || null;
  };

const normalizeErrorKind = (error: string): SpeechErrorKind => {
  switch (error) {
    case "not-allowed":
      return "not-allowed";
    case "service-not-allowed":
      return "service-not-allowed";
    case "no-speech":
      return "no-speech";
    case "audio-capture":
      return "audio-capture";
    case "network":
      return "network";
    case "aborted":
      return "aborted";
    case "timeout":
      return "timeout";
    case "unsupported":
      return "unsupported";
    default:
      return "unknown";
  }
};

const buildError = (
  kind: SpeechErrorKind,
  message: string,
  original?: unknown,
): SpeechServiceError => ({
  kind,
  message,
  original,
});

export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private state: SpeechState = "idle";
  private backoffAttempts = 0;
  private backoffTimer: number | null = null;
  private watchdogTimer: number | null = null;
  private pendingStart = false;
  private permissionRequested = false;
  private listeners = {
    state: new Set<Listener<SpeechState>>(),
    result: new Set<Listener<SpeechServiceResult>>(),
    error: new Set<Listener<SpeechServiceError>>(),
  };

  get isSupported() {
    return (
      getSpeechRecognitionConstructor() !== null &&
      typeof navigator !== "undefined"
    );
  }

  get currentState() {
    return this.state;
  }

  private emitState(state: SpeechState) {
    this.state = state;
    this.listeners.state.forEach((listener) => listener(state));
  }

  private emitResult(result: SpeechServiceResult) {
    this.listeners.result.forEach((listener) => listener(result));
  }

  private emitError(error: SpeechServiceError) {
    this.listeners.error.forEach((listener) => listener(error));
  }

  onState(listener: SpeechStateChange) {
    this.listeners.state.add(listener);
    listener(this.state);
    return () => this.listeners.state.delete(listener);
  }

  onResult(listener: SpeechResultHandler) {
    this.listeners.result.add(listener);
    return () => this.listeners.result.delete(listener);
  }

  onError(listener: SpeechErrorHandler) {
    this.listeners.error.add(listener);
    return () => this.listeners.error.delete(listener);
  }

  async requestMicrophoneAccess() {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      const error = buildError(
        "unsupported",
        "Browser does not support microphone permission request or speech recognition.",
      );
      this.emitError(error);
      throw error;
    }

    this.emitState("requesting-permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      this.permissionRequested = true;
      this.emitState("idle");
      return stream;
    } catch (rawError) {
      const kind = normalizeErrorKind(
        (rawError as any)?.name || (rawError as any)?.error || "not-allowed",
      );
      const error = buildError(
        kind,
        "Microphone permission denied or blocked. Please allow microphone access to continue.",
        rawError,
      );
      this.emitError(error);
      this.emitState("errored");
      throw error;
    }
  }

  private initializeRecognition() {
    const Recognition = getSpeechRecognitionConstructor();
    if (!Recognition) {
      return;
    }

    this.cleanupRecognition();

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent) =>
      this.handleRecognitionResult(event);
    recognition.onerror = (event: any) =>
      this.handleRecognitionError(event?.error || event);
    recognition.onend = () => this.handleRecognitionEnd();
    recognition.onaudioend = () => {
      if (this.state === "listening") {
        this.handleRecognitionEnd();
      }
    };

    this.recognition = recognition;
  }

  private cleanupRecognition() {
    if (!this.recognition) {
      return;
    }

    this.recognition.onresult = null;
    this.recognition.onerror = null;
    this.recognition.onend = null;
    this.recognition.onaudioend = null;
    this.recognition = null;
  }

  async startListening() {
    if (!this.isSupported) {
      const error = buildError(
        "unsupported",
        "Speech recognition is unavailable in this browser.",
      );
      this.emitError(error);
      return;
    }

    if (this.pendingStart || this.state === "listening") {
      return;
    }

    this.pendingStart = true;

    try {
      if (!this.permissionRequested) {
        await this.requestMicrophoneAccess();
      }

      this.initializeRecognition();
      if (!this.recognition) {
        throw buildError(
          "unsupported",
          "Unable to initialize the speech recognition engine.",
        );
      }

      this.recognition.start();
      this.emitState("listening");
      this.startWatchdog();
    } catch (rawError) {
      const message =
        rawError instanceof Error
          ? rawError.message
          : "Unable to start speech recognition.";
      const kind = normalizeErrorKind(
        (rawError as any)?.kind || (rawError as any)?.name || "unknown",
      );
      const error = buildError(kind, message, rawError);
      this.emitError(error);
      if (kind === "no-speech" || kind === "network" || kind === "aborted") {
        this.restartWithBackoff();
      }
      this.emitState("errored");
    } finally {
      this.pendingStart = false;
    }
  }

  stopListening() {
    if (this.recognition && this.state === "listening") {
      try {
        this.recognition.stop();
      } catch (error) {
        console.warn("SpeechService stop failed:", error);
      }
    }

    this.clearWatchdog();

    if (this.state !== "errored") {
      this.emitState("idle");
    }
  }

  reset() {
    this.backoffAttempts = 0;
    this.pendingStart = false;
    this.permissionRequested = false;
    if (this.backoffTimer) {
      window.clearTimeout(this.backoffTimer);
      this.backoffTimer = null;
    }
    this.clearWatchdog();
    this.cleanupRecognition();
    this.emitState("idle");
  }

  private handleRecognitionResult(event: SpeechRecognitionEvent) {
    const transcript = String(event.results?.[0]?.[0]?.transcript || "").trim();
    this.backoffAttempts = 0;
    this.clearWatchdog();
    this.emitResult({ transcript });
    this.emitState("processing");
  }

  private handleRecognitionError(rawError: unknown) {
    const errorType =
      typeof rawError === "string"
        ? rawError
        : (rawError as any)?.error || (rawError as any)?.name || "unknown";
    const kind = normalizeErrorKind(errorType);
    const message = (rawError as any)?.message
      ? String((rawError as any).message)
      : `Speech recognition error: ${errorType}`;

    const error = buildError(kind, message, rawError);
    this.emitError(error);
    this.emitState("errored");
    this.clearWatchdog();

    if (kind === "no-speech") {
      this.restartWithBackoff();
      return;
    }

    if (kind === "not-allowed" || kind === "service-not-allowed") {
      return;
    }

    this.stopListening();
  }

  private handleRecognitionEnd() {
    if (this.state === "listening") {
      this.emitState("idle");
    }
    this.clearWatchdog();
  }

  private startWatchdog() {
    this.clearWatchdog();
    this.watchdogTimer = window.setTimeout(() => {
      const error = buildError(
        "timeout",
        "Speech recognition timed out while waiting for audio input.",
      );
      this.emitError(error);
      this.stopListening();
      this.restartWithBackoff();
    }, 12000);
  }

  private clearWatchdog() {
    if (this.watchdogTimer) {
      window.clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  private restartWithBackoff() {
    if (this.backoffAttempts >= 5) {
      const error = buildError(
        "timeout",
        "Repeated speech recognition retries exceeded the allowed limit.",
      );
      this.emitError(error);
      return;
    }

    this.backoffAttempts += 1;
    const delay = Math.min(30000, 1000 * 2 ** this.backoffAttempts);

    if (this.backoffTimer) {
      window.clearTimeout(this.backoffTimer);
    }

    this.backoffTimer = window.setTimeout(() => {
      this.backoffTimer = null;
      this.startListening();
    }, delay);
  }
}

export const speechService = new SpeechService();
