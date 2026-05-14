import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MicPermissionModalProps {
  open: boolean;
  message: string;
  onRetry: () => void;
  onClose: () => void;
}

export function MicPermissionModal({ open, message, onRetry, onClose }: MicPermissionModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl border-slate-600/60 p-6">
        <CardHeader>
          <CardTitle>Microphone Access Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-200">
          <p>{message}</p>
          <p>
            To use voice commands, allow microphone access in your browser prompt. If access is denied,
            open your browser site permissions and enable the microphone for this site.
          </p>
          <div className="rounded-2xl bg-slate-900/80 p-4 text-slate-300">
            <p className="font-semibold text-slate-100">Quick steps</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Allow the microphone prompt when it appears.</li>
              <li>If denied, go to browser settings → Site permissions → Microphone.</li>
              <li>Refresh the page after updating permissions.</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <Button onClick={onRetry}>Retry microphone access</Button>
            <Button variant="secondary" onClick={onClose}>Dismiss</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
