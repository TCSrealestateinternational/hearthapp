"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { AgentNav } from "@/components/nav/AgentNav";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { InstallPrompt } from "@/components/shared/InstallPrompt";

export function AgentShellWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAgent>
      <AgentShell>{children}</AgentShell>
    </AuthGuard>
  );
}

function AgentShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  useBrokerage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky glass header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-primary">Hearth</h1>
            <p className="text-xs text-text-secondary hidden md:block">Agent Portal</p>
          </div>
          <AgentNav />
        </div>
        <span className="text-sm text-text-secondary hidden sm:inline">
          {user?.displayName}
        </span>
      </header>

      <InstallPrompt />

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
