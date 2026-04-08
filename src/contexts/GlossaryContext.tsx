"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useGlossary } from "@/hooks/useGlossary";
import type { GlossaryTerm } from "@/types";

interface GlossaryContextValue {
  terms: GlossaryTerm[];
  loading: boolean;
}

const GlossaryContext = createContext<GlossaryContextValue>({
  terms: [],
  loading: true,
});

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const { terms, loading } = useGlossary();
  return (
    <GlossaryContext.Provider value={{ terms, loading }}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossaryTerms() {
  return useContext(GlossaryContext);
}
