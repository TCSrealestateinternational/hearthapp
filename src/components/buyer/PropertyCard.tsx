"use client";

import type { Property } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GlossaryHighlight } from "@/components/ui/GlossaryTooltip";
import { AddressLink } from "@/components/shared/AddressLink";
import { useGlossaryTerms } from "@/contexts/GlossaryContext";
import { ExternalLink, Star } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

const statusVariant: Record<
  string,
  "default" | "primary" | "success" | "warning" | "error" | "cta"
> = {
  interested: "primary",
  toured: "cta",
  "offer-pending": "warning",
  "offer-accepted": "success",
  rejected: "error",
  withdrawn: "default",
};

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  const { terms } = useGlossaryTerms();
  return (
    <Card
      className="cursor-pointer hover:border-primary/30 transition-colors"
      onClick={onClick}
    >
      {property.photos[0] && (
        <div className="relative -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-4">
          <img
            src={property.photos[0]}
            alt={property.address}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-primary text-xl">
            ${property.price.toLocaleString()}
          </p>
          <div className="text-sm text-text-secondary mt-0.5">
            <AddressLink
              address={property.address}
              city={property.city}
              state={property.state}
              zip={property.zip}
            />
          </div>
        </div>
        <Badge variant={statusVariant[property.status] || "default"}>
          {property.status.replace("-", " ")}
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
        <span>{property.beds} bed</span>
        <span>{property.baths} bath</span>
        <span>{property.sqft.toLocaleString()} sqft</span>
      </div>
      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= property.rating
                ? "fill-cta text-cta"
                : "text-border"
            }
          />
        ))}
      </div>
      {property.mlsUrl && (
        <a
          href={property.mlsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
        >
          <ExternalLink size={12} />
          View Listing
        </a>
      )}
      {property.notes && (
        <p className="text-sm text-text-secondary mt-2 line-clamp-2">
          <GlossaryHighlight text={property.notes} terms={terms} />
        </p>
      )}
    </Card>
  );
}
