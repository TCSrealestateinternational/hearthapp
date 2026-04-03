"use client";

import { useEffect, useState } from "react";
import type { Brokerage } from "@/types";
import { getBrokerageBySlug } from "@/lib/firestore";
import { applyBrandTokens, defaultTokens } from "@/lib/brand";

export function useBrokerage() {
  const [brokerage, setBrokerage] = useState<Brokerage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apply defaults immediately to avoid flash of unstyled content
    applyBrandTokens(defaultTokens);

    const slug =
      process.env.NEXT_PUBLIC_DEFAULT_BROKERAGE_SLUG ||
      "life-built-in-kentucky";

    getBrokerageBySlug(slug)
      .then((b) => {
        if (b) {
          setBrokerage(b);
          applyBrandTokens(b.brandTokens);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { brokerage, loading };
}
