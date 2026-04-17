"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, pendingSwitch, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && !pendingSwitch) {
      router.replace("/login");
    }
    if (!loading && !user && pendingSwitch) {
      router.replace("/login");
    }
    if (!loading && user && pendingSwitch) {
      router.replace("/login");
    }
    // Agents should not use Hearth — redirect to login with message
    if (!loading && user && user.roles.includes("agent")) {
      router.replace("/login");
    }
  }, [user, pendingSwitch, loading, router]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        role="status"
        aria-label="Loading"
      >
        <div
          className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) return null;
  if (pendingSwitch) return null;
  if (user.roles.includes("agent")) return null;

  return <>{children}</>;
}
