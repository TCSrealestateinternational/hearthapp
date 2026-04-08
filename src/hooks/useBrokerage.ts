"use client";

import { useEffect, useState } from "react";
import type { Brokerage } from "@/types";
import { getBrokerage, getBrokerageBySlug } from "@/lib/firestore";
import { applyBrandTokens, defaultTokens } from "@/lib/brand";
import { useAuth } from "@/hooks/useAuth";

export function useBrokerage() {
  const [brokerage, setBrokerage] = useState<Brokerage | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Apply defaults immediately to avoid flash of unstyled content
    applyBrandTokens(defaultTokens);

    async function load() {
      try {
        let b: Brokerage | null = null;

        // Prefer the logged-in user's brokerageId (correct for any tenant)
        if (user?.brokerageId) {
          b = await getBrokerage(user.brokerageId);
        }

        // Fall back to env-var slug for unauthenticated / login page
        if (!b) {
          const slug =
            process.env.NEXT_PUBLIC_DEFAULT_BROKERAGE_SLUG ||
            "life-built-in-kentucky";
          b = await getBrokerageBySlug(slug);
        }

        if (b) {
          setBrokerage(b);
          applyBrandTokens(b.brandTokens);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user?.brokerageId]);

  return { brokerage, loading };
}
