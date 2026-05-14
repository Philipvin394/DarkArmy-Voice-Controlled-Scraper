"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-semibold text-slate-100">Something went wrong</h2>
      <p className="text-slate-400">The workspace encountered an issue while loading intelligence modules.</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
