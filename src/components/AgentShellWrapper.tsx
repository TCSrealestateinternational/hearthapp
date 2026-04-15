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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Sticky glass header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-lg font-bold text-primary font-serif italic">Hearth Real Estate<sup className="text-[0.6em] align-super">&copy;</sup></span>
            <p className="text-xs text-on-surface-variant hidden md:block">Agent Portal</p>
          </div>
          <AgentNav />
        </div>
        <span className="text-sm text-on-surface-variant hidden sm:inline">
          {user?.displayName}
        </span>
      </header>

      <InstallPrompt />

      {/* Main content */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {children}
      </main>

    </div>
  );
}
