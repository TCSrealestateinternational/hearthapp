"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import type { SyncPermissionKey } from "@/types";
import { Card } from "@/components/ui/Card";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface PermissionGateProps {
  transactionId: string | undefined;
  permission: SyncPermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  transactionId,
  permission,
  children,
  fallback,
}: PermissionGateProps) {
  const { hasPermission, isPaused, loading } = usePermissions(transactionId);

  if (loading) return null;

  if (!hasPermission(permission)) {
    if (fallback) return <>{fallback}</>;
    return (
      <Card className="text-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-border/20 flex items-center justify-center">
            <MaterialIcon name="shield" size={24} className="text-on-surface-variant" />
          </div>
          <div>
            <p className="font-semibold text-on-surface">
              {isPaused ? "Portal access is paused" : "This section is not available"}
            </p>
            <p className="text-sm text-on-surface-variant mt-1">
              {isPaused
                ? "Your agent has temporarily paused portal access. You'll be notified when it resumes."
                : "Contact your agent if you think this is a mistake."}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}

export function PauseBanner({ transactionId }: { transactionId: string | undefined }) {
  const { isPaused, loading } = usePermissions(transactionId);

  if (loading || !isPaused) return null;

  return (
    <div className="bg-warning/10 border border-warning/20 rounded-xl px-4 py-3 flex items-center gap-3">
      <MaterialIcon name="shield" size={18} className="text-warning shrink-0" />
      <div>
        <p className="text-sm font-semibold text-on-surface">Portal access is paused</p>
        <p className="text-xs text-on-surface-variant">
          Your agent has temporarily paused sync. Some sections may be hidden.
        </p>
      </div>
    </div>
  );
}
