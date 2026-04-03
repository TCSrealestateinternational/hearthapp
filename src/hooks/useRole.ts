"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

type ActiveRole = "buyer" | "seller";

const STORAGE_KEY = "hearth-active-role";

export function useRole(user: User | null) {
  const [activeRole, setActiveRole] = useState<ActiveRole>("buyer");

  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem(STORAGE_KEY) as ActiveRole | null;

    if (stored && user.roles.includes(stored)) {
      setActiveRole(stored);
    } else if (user.roles.includes("buyer")) {
      setActiveRole("buyer");
    } else if (user.roles.includes("seller")) {
      setActiveRole("seller");
    }
  }, [user]);

  const toggleRole = useCallback(() => {
    setActiveRole((prev) => {
      const next = prev === "buyer" ? "seller" : "buyer";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const isDual = user?.roles.includes("dual") || false;

  return { activeRole, toggleRole, isDual };
}
