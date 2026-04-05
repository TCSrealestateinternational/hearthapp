"use client";

import { useEffect, useState } from "react";
import { subscribeToGlossary } from "@/lib/firestore";
import type { GlossaryTerm } from "@/types";

export function useGlossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToGlossary((newTerms) => {
      setTerms(newTerms);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { terms, loading };
}
