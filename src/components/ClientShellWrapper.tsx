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
import { useTransactions } from "@/hooks/useTransaction";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
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
  const { transactions } = useTransactions(brokerage?.id || "", user?.id || "");
  const activeTx = transactions.find(
    (tx) => tx.type === (activeRole === "buyer" ? "buying" : "selling"),
  );

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
          <span className="text-lg font-bold text-primary font-serif italic shrink-0">Hearth Real Estate<sup className="text-[0.6em] align-super">&copy;</sup></span>
          <ClientNav role={activeRole} unreadCount={0} transactionId={activeTx?.id} />
        </div>
        <div className="flex items-center gap-3">
          {isDual && user?.portalViewPreference !== "unified" && (
            <RoleToggle activeRole={activeRole} onToggle={toggleRole} />
          )}
          <span className="text-sm text-on-surface-variant hidden sm:inline">
            {user?.displayName}
          </span>
          <button
            onClick={signOut}
            className="p-2 rounded-full text-on-surface-variant hover:bg-primary-container transition-colors"
            aria-label="Sign out"
          >
            <MaterialIcon name="logout" size={18} />
          </button>
        </div>
      </header>

      <InstallPrompt />

      {/* Main content */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Footer */}
      <div className="hidden md:block">
        <Footer brokerage={brokerage} />
      </div>
    </div>
  );
}
