"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { ClientNav } from "@/components/nav/ClientNav";
import { RoleToggle } from "@/components/nav/RoleToggle";
import { Footer } from "@/components/Footer";
import { GlossaryProvider } from "@/contexts/GlossaryContext";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useBrokerage } from "@/hooks/useBrokerage";
import { LogOut } from "lucide-react";
import { InstallPrompt } from "@/components/shared/InstallPrompt";

export function ClientShellWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <GlossaryProvider>
        <ClientShell>{children}</ClientShell>
      </GlossaryProvider>
    </AuthGuard>
  );
}

function ClientShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { activeRole, toggleRole, isDual } = useRole(user);
  const { brokerage } = useBrokerage();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky glass header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-primary">Hearth</h1>
          <ClientNav role={activeRole} unreadCount={0} />
        </div>
        <div className="flex items-center gap-3">
          {isDual && (
            <RoleToggle activeRole={activeRole} onToggle={toggleRole} />
          )}
          <span className="text-sm text-text-secondary hidden sm:inline">
            {user?.displayName}
          </span>
          <button
            onClick={signOut}
            className="p-2 rounded-xl text-text-secondary hover:bg-primary-light transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <InstallPrompt />

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Footer */}
      <div className="hidden md:block">
        <Footer brokerage={brokerage} />
      </div>
    </div>
  );
}
