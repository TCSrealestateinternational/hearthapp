"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions } from "@/hooks/useTransaction";
import { OfferCard } from "@/components/seller/OfferCard";
import { OfferNetCalculator } from "@/components/seller/OfferNetCalculator";
import { getOffers, getListing } from "@/lib/firestore";
import type { Offer, Listing } from "@/types";
import { DollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function OffersPage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const sellingTx = transactions.find((t) => t.type === "selling");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [listing, setListing] = useState<Listing | null>(null);
  const [view, setView] = useState<"offers" | "calculator">("offers");

  useEffect(() => {
    if (!sellingTx?.id) return;
    getOffers(sellingTx.id).then(setOffers);
    getListing(sellingTx.id).then(setListing);
  }, [sellingTx?.id]);

  const highestOffer = offers.reduce(
    (max, o) => (o.offerPrice > max ? o.offerPrice : max),
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">Offers</h1>
        <div className="inline-flex items-center bg-primary-light rounded-full p-0.5">
          <button
            onClick={() => setView("offers")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              view === "offers"
                ? "bg-primary text-white"
                : "text-text-secondary"
            }`}
          >
            Offers
          </button>
          <button
            onClick={() => setView("calculator")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              view === "calculator"
                ? "bg-primary text-white"
                : "text-text-secondary"
            }`}
          >
            Net Calculator
          </button>
        </div>
      </div>

      {view === "offers" ? (
        offers.length > 0 ? (
          <div className="space-y-3">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isHighest={offer.offerPrice === highestOffer}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <DollarSign
                size={40}
                className="mx-auto mb-3 text-text-secondary opacity-50"
              />
              <p className="text-text-secondary">No offers received yet.</p>
              <p className="text-sm text-text-secondary mt-1">
                Offers will appear here as they come in.
              </p>
            </div>
          </Card>
        )
      ) : (
        <OfferNetCalculator
          offers={offers.map((o) => ({
            id: o.id,
            buyerName: o.buyerName,
            offerPrice: o.offerPrice,
            sellerConcessions: o.sellerConcessions,
          }))}
          listPrice={listing?.listPrice || 0}
        />
      )}
    </div>
  );
}
