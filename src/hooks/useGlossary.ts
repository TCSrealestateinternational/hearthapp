"use client";

import { useEffect, useState, useMemo } from "react";
import { subscribeToGlossary } from "@/lib/firestore";
import { defaultGlossaryTerms } from "@/data/defaultGlossaryTerms";
import type { GlossaryTerm } from "@/types";

export function useGlossary() {
  const [firestoreTerms, setFirestoreTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToGlossary((newTerms) => {
      setFirestoreTerms(newTerms);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Merge: Firestore terms override defaults with the same term name
  const terms = useMemo(() => {
    const byTerm = new Map<string, GlossaryTerm>();

    // Defaults first
    for (const t of defaultGlossaryTerms) {
      byTerm.set(t.term.toLowerCase(), t);
    }

    // Firestore overrides
    for (const t of firestoreTerms) {
      byTerm.set(t.term.toLowerCase(), t);
    }

    return Array.from(byTerm.values()).sort((a, b) =>
      a.term.localeCompare(b.term)
    );
  }, [firestoreTerms]);

  return { terms, loading };
}
