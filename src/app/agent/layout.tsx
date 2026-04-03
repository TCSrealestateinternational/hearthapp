import { type ReactNode } from "react";
import { AgentShellWrapper } from "@/components/AgentShellWrapper";

export const dynamic = "force-dynamic";

export default function AgentLayout({ children }: { children: ReactNode }) {
  return <AgentShellWrapper>{children}</AgentShellWrapper>;
}
