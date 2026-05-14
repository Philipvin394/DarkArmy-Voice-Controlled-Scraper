import { ReactNode } from "react";

export function WorkspaceGrid({ children }: { children: ReactNode }) {
  return <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">{children}</section>;
}
