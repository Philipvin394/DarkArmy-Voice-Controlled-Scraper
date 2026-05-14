import { speechService } from "@/lib/speechService";

describe("SpeechService", () => {
  const originalSpeechRecognition = (window as any).SpeechRecognition;
  const originalWebkitSpeechRecognition = (window as any)
    .webkitSpeechRecognition;
  const originalGetUserMedia = navigator.mediaDevices?.getUserMedia;

  const recognitionMock = {
    lang: "",
    interimResults: false,
    maxAlternatives: 1,
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    onerror: null,
    onend: null,
    onaudioend: null,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    speechService.stopListening();
    speechService.reset?.();

    (window as any).SpeechRecognition = jest.fn(() => recognitionMock);
    (window as any).webkitSpeechRecognition = undefined;
    Object.defineProperty(navigator, "mediaDevices", {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    (window as any).SpeechRecognition = originalSpeechRecognition;
    (window as any).webkitSpeechRecognition = originalWebkitSpeechRecognition;
    if (originalGetUserMedia) {
      Object.defineProperty(navigator, "mediaDevices", {
        value: { getUserMedia: originalGetUserMedia },
        configurable: true,
      });
    }
  });

  it("requests microphone permission before listening", async () => {
    await speechService.startListening();
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: true,
    });
    expect((window as any).SpeechRecognition).toHaveBeenCalled();
    expect(speechService.currentState).toBe("listening");
  });

  it("emits transcript results when recognition returns text", async () => {
    const transcripts: string[] = [];
    speechService.onResult(({ transcript }) => transcripts.push(transcript));

    await speechService.startListening();
    recognitionMock.onresult({
      results: [[{ transcript: "deploy sensor" }]],
    } as any);

    expect(transcripts).toContain("deploy sensor");
    expect(speechService.currentState).toBe("processing");
  });

  it("handles no-speech errors with backoff retry", async () => {
    const errors: any[] = [];
    speechService.onError((error) => errors.push(error));

    await speechService.startListening();
    recognitionMock.onerror({ error: "no-speech" });

    expect(errors.some((error) => error.kind === "no-speech")).toBe(true);
  });

  it("stops listening and returns to idle state", async () => {
    await speechService.startListening();

    speechService.stopListening();

    expect(recognitionMock.stop).toHaveBeenCalled();
    expect(speechService.currentState).toBe("idle");
  });

  it("handles not-allowed microphone errors", async () => {
    const errors: any[] = [];
    speechService.onError((error) => errors.push(error));

    await speechService.startListening();
    recognitionMock.onerror({ error: "not-allowed" });

    expect(errors.some((error) => error.kind === "not-allowed")).toBe(true);
  });

  it("requests microphone permission and stops tracks when granted", async () => {
    const stopSpy = jest.fn();
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue({
      getTracks: () => [{ stop: stopSpy }],
    });

    const stream = await speechService.requestMicrophoneAccess();

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: true,
    });
    expect(stopSpy).toHaveBeenCalled();
    expect(stream).toBeDefined();
    expect(speechService.currentState).toBe("idle");
  });

  it("returns to idle state when recognition ends", async () => {
    await speechService.startListening();

    (speechService as any).handleRecognitionEnd();

    expect(speechService.currentState).toBe("idle");
  });

  it("handles service-not-allowed and audio-capture error branches", async () => {
    const errors: any[] = [];
    speechService.onError((error) => errors.push(error));

    (speechService as any).handleRecognitionError({
      error: "service-not-allowed",
      message: "blocked",
    });
    (speechService as any).handleRecognitionError({
      error: "audio-capture",
      message: "no device",
    });

    expect(errors.some((error) => error.kind === "service-not-allowed")).toBe(
      true,
    );
    expect(errors.some((error) => error.kind === "audio-capture")).toBe(true);
  });

  it("retries with backoff after no-speech detection", async () => {
    jest.useFakeTimers();
    await speechService.startListening();
    expect(recognitionMock.start).toHaveBeenCalledTimes(1);

    recognitionMock.onerror({ error: "no-speech" });
    jest.advanceTimersByTime(2000);
    await Promise.resolve();

    expect(recognitionMock.start).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });
});
