"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { ListingDetail } from "@/components/seller/ListingDetail";
import { Card } from "@/components/ui/Card";
import { getListing } from "@/lib/firestore";
import type { Listing } from "@/types";
import { Home } from "lucide-react";

export default function ListingPage() {
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

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-text-primary mb-4">
          My Listing
        </h1>
        <Card>
          <div className="text-center py-8">
            <Home
              size={40}
              className="mx-auto mb-3 text-text-secondary opacity-50"
            />
            <p className="text-text-secondary">
              Your listing has not been set up yet.
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Your agent will add your listing details when ready.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-text-primary mb-4">My Listing</h1>
      <ListingDetail listing={listing} />
    </div>
  );
}
