"use client";

import type { Offer } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GlossaryHighlight } from "@/components/ui/GlossaryTooltip";
import { useGlossaryTerms } from "@/contexts/GlossaryContext";

interface OfferCardProps {
  offer: Offer;
  isHighest?: boolean;
}

const statusVariant: Record<
  string,
  "default" | "primary" | "success" | "warning" | "error" | "cta"
> = {
  received: "primary",
  countered: "warning",
  accepted: "success",
  rejected: "error",
  expired: "default",
};

export function OfferCard({ offer, isHighest = false }: OfferCardProps) {
  const { terms } = useGlossaryTerms();
  return (
    <Card
      className={`${isHighest ? "ring-2 ring-cta" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-text-primary">
              ${offer.offerPrice.toLocaleString()}
            </p>
            {isHighest && <Badge variant="cta">Highest</Badge>}
          </div>
          <p className="text-sm text-text-secondary">{offer.buyerName}</p>
        </div>
        <Badge variant={statusVariant[offer.status] || "default"}>
          {offer.status}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
        <div>
          <span className="text-text-secondary">Down Payment: </span>
          <span className="text-text-primary">{offer.downPaymentPct}%</span>
        </div>
        <div>
          <span className="text-text-secondary">Loan: </span>
          <span className="text-text-primary uppercase">{offer.loanType}</span>
        </div>
        <div>
          <span className="text-text-secondary">Closing: </span>
          <span className="text-text-primary">{offer.closingDate}</span>
        </div>
        <div>
          <span className="text-text-secondary">Concessions: </span>
          <span className="text-text-primary">
            ${offer.sellerConcessions.toLocaleString()}
          </span>
        </div>
      </div>
      {offer.contingencies.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-text-secondary">Contingencies: </span>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {offer.contingencies.map((c, i) => (
              <Badge key={i} variant="default">
                <GlossaryHighlight text={c} terms={terms} />
              </Badge>
            ))}
          </div>
        </div>
      )}
      {offer.notes && (
        <p className="text-sm text-text-secondary mt-2">
          <GlossaryHighlight text={offer.notes} terms={terms} />
        </p>
      )}
    </Card>
  );
}
