"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { CMAViewer } from "@/components/seller/CMAViewer";
import { getListing } from "@/lib/firestore";
import type { Listing } from "@/types";

export default function CMAPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const sellingTx = transactions.find((t) => t.type === "selling");
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (!sellingTx?.id) return;
    getListing(sellingTx.id).then(setListing);
  }, [sellingTx?.id]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-text-primary mb-4">
        Market Analysis
      </h1>
      <CMAViewer
        cmaUrl={listing?.cmaUrl}
        listPrice={listing?.listPrice}
      />
    </div>
  );
}
