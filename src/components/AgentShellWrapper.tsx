"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { AgentNav } from "@/components/nav/AgentNav";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { LogOut } from "lucide-react";

export function AgentShellWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAgent>
      <AgentShell>{children}</AgentShell>
    </AuthGuard>
  );
}

function AgentShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  useBrokerage();

  return (
    <div className="flex min-h-screen">
      <AgentNav />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
          <h1 className="text-lg font-bold text-primary md:hidden">
            Hearth Agent
          </h1>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-text-secondary">
              {user?.displayName}
            </span>
            <button
              onClick={signOut}
              className="p-2 rounded-lg text-text-secondary hover:bg-primary-light transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
