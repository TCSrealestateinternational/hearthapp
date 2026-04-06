"use client";

import { type ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { ClientNav } from "@/components/nav/ClientNav";
import { RoleToggle } from "@/components/nav/RoleToggle";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useBrokerage } from "@/hooks/useBrokerage";
import { LogOut } from "lucide-react";
import { InstallPrompt } from "@/components/shared/InstallPrompt";

export function ClientShellWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ClientShell>{children}</ClientShell>
    </AuthGuard>
  );
}

function ClientShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { activeRole, toggleRole, isDual } = useRole(user);
  const { brokerage } = useBrokerage();

  return (
    <div className="flex min-h-screen">
      <ClientNav role={activeRole} unreadCount={0} />
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-primary md:hidden">
              Hearth
            </h1>
            {isDual && (
              <RoleToggle activeRole={activeRole} onToggle={toggleRole} />
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary hidden sm:inline">
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

        <InstallPrompt />

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 pb-20 md:pb-6">{children}</main>

        {/* Footer - desktop only */}
        <div className="hidden md:block">
          <Footer brokerage={brokerage} />
        </div>
      </div>
    </div>
  );
}
