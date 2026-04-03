import { type ReactNode } from "react";
import { ClientShellWrapper } from "@/components/ClientShellWrapper";

export const dynamic = "force-dynamic";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <ClientShellWrapper>{children}</ClientShellWrapper>;
}
