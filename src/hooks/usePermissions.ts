"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SyncPermissions, SyncPermissionKey } from "@/types";

interface PermissionsState {
  permissions: SyncPermissions | null;
  isPaused: boolean;
  loading: boolean;
}

export function usePermissions(transactionId: string | undefined) {
  const [state, setState] = useState<PermissionsState>({
    permissions: null,
    isPaused: false,
    loading: true,
  });

  useEffect(() => {
    if (!transactionId) {
      setState({ permissions: null, isPaused: false, loading: false });
      return;
    }

    const unsub = onSnapshot(
      doc(db, "transactions", transactionId),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setState({
            permissions: data.syncPermissions || null,
            isPaused: Boolean(data.syncPausedAt),
            loading: false,
          });
        } else {
          setState({ permissions: null, isPaused: false, loading: false });
        }
      },
      () => {
        setState({ permissions: null, isPaused: false, loading: false });
      },
    );

    return unsub;
  }, [transactionId]);

  function hasPermission(key: SyncPermissionKey): boolean {
    // If paused, deny everything
    if (state.isPaused) return false;
    // If no permissions set (backward compat), allow everything
    if (!state.permissions) return true;
    return state.permissions[key] ?? true;
  }

  return {
    ...state,
    hasPermission,
  };
}
