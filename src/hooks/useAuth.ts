"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser, updateUser, getBrokerage } from "@/lib/firestore";
import type { User, Brokerage } from "@/types";

export interface PendingSwitch {
  currentBrokerage: Brokerage;
  newBrokerage: Brokerage;
}

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  pendingSwitch: PendingSwitch | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    user: null,
    pendingSwitch: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userData = await getUser(fbUser.uid);
        if (userData?.pendingBrokerageId) {
          // Client has a pending brokerage switch
          const [currentBrokerage, newBrokerage] = await Promise.all([
            getBrokerage(userData.brokerageId),
            getBrokerage(userData.pendingBrokerageId),
          ]);
          if (currentBrokerage && newBrokerage) {
            setState({
              firebaseUser: fbUser,
              user: userData,
              pendingSwitch: { currentBrokerage, newBrokerage },
              loading: false,
            });
            return;
          }
        }
        setState({
          firebaseUser: fbUser,
          user: userData,
          pendingSwitch: null,
          loading: false,
        });
      } else {
        setState({
          firebaseUser: null,
          user: null,
          pendingSwitch: null,
          loading: false,
        });
      }
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUser(cred.user.uid);

    // Check for pending brokerage switch
    if (userData?.pendingBrokerageId) {
      const [currentBrokerage, newBrokerage] = await Promise.all([
        getBrokerage(userData.brokerageId),
        getBrokerage(userData.pendingBrokerageId),
      ]);
      if (currentBrokerage && newBrokerage) {
        setState({
          firebaseUser: cred.user,
          user: userData,
          pendingSwitch: { currentBrokerage, newBrokerage },
          loading: false,
        });
        return null; // Signal: pending switch prompt needed
      }
    }

    // Mark pending clients as active on first login
    if (userData && userData.status === "pending") {
      await updateUser(cred.user.uid, { status: "active" });
      userData.status = "active";
    }
    setState({
      firebaseUser: cred.user,
      user: userData,
      pendingSwitch: null,
      loading: false,
    });
    return userData;
  }

  async function confirmSwitch() {
    const { user } = state;
    if (!user?.pendingBrokerageId) return null;

    const newBrokerageId = user.pendingBrokerageId;
    const profile = user.brokerageProfiles?.[newBrokerageId];

    // Update user doc: switch active brokerage, clear pending
    const updates: Partial<User> = {
      brokerageId: newBrokerageId,
      pendingBrokerageId: undefined,
    };

    // Apply per-brokerage profile overrides if they exist
    if (profile) {
      if (profile.roles) updates.roles = profile.roles;
      if (profile.displayName) updates.displayName = profile.displayName;
    }

    await updateUser(user.id, updates);

    const updatedUser: User = {
      ...user,
      ...updates,
      pendingBrokerageId: undefined,
    };

    setState((prev) => ({
      ...prev,
      user: updatedUser,
      pendingSwitch: null,
    }));

    return updatedUser;
  }

  async function declineSwitch() {
    const { user } = state;
    if (!user?.pendingBrokerageId) return;

    // Clear pending brokerage, remove it from brokerageIds
    const updatedIds = (user.brokerageIds || []).filter(
      (id) => id !== user.pendingBrokerageId
    );
    const updatedProfiles = { ...user.brokerageProfiles };
    if (user.pendingBrokerageId) {
      delete updatedProfiles[user.pendingBrokerageId];
    }

    await updateUser(user.id, {
      pendingBrokerageId: undefined,
      brokerageIds: updatedIds,
      brokerageProfiles: updatedProfiles,
    } as Partial<User>);

    const updatedUser: User = {
      ...user,
      pendingBrokerageId: undefined,
      brokerageIds: updatedIds,
      brokerageProfiles: updatedProfiles,
    };

    setState((prev) => ({
      ...prev,
      user: updatedUser,
      pendingSwitch: null,
    }));
  }

  async function refreshUser() {
    const fbUser = auth.currentUser;
    if (fbUser) {
      const userData = await getUser(fbUser.uid);
      setState({
        firebaseUser: fbUser,
        user: userData,
        pendingSwitch: null,
        loading: false,
      });
      return userData;
    }
    return null;
  }

  async function signOut() {
    await fbSignOut(auth);
    setState({
      firebaseUser: null,
      user: null,
      pendingSwitch: null,
      loading: false,
    });
  }

  return {
    ...state,
    login,
    refreshUser,
    signOut,
    confirmSwitch,
    declineSwitch,
  };
}
