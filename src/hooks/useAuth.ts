"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser } from "@/lib/firestore";
import type { User } from "@/types";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userData = await getUser(fbUser.uid);
        setState({ firebaseUser: fbUser, user: userData, loading: false });
      } else {
        setState({ firebaseUser: null, user: null, loading: false });
      }
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUser(cred.user.uid);
    setState({ firebaseUser: cred.user, user: userData, loading: false });
    return userData;
  }

  async function signOut() {
    await fbSignOut(auth);
    setState({ firebaseUser: null, user: null, loading: false });
  }

  return { ...state, login, signOut };
}
