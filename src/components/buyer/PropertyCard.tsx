"use client";

import type { Property } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GlossaryHighlight } from "@/components/ui/GlossaryTooltip";
import { AddressLink } from "@/components/shared/AddressLink";
import { useGlossaryTerms } from "@/contexts/GlossaryContext";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

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
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {property.photos[0] && (
        <div className="relative -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-4">
          <img
            src={property.photos[0]}
            alt={`Photo of ${property.address}`}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-on-surface text-xl">
            ${property.price.toLocaleString()}
          </p>
          <div className="text-sm text-on-surface-variant mt-0.5">
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
      <div className="flex items-center gap-4 mt-3 text-sm text-on-surface-variant">
        <span>{property.beds} bed</span>
        <span>{property.baths} bath</span>
        <span>{property.sqft.toLocaleString()} sqft</span>
      </div>
      <div className="flex items-center gap-1 mt-2" aria-label={`Rating: ${property.rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <MaterialIcon
            key={s}
            name="star"
            size={14}
            className={
              s <= property.rating
                ? "fill-cta text-cta"
                : "text-outline-variant"
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
          <MaterialIcon name="open_in_new" size={12} />
          View Listing
          <span className="sr-only">(opens in new tab)</span>
        </a>
      )}
      {property.notes && (
        <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">
          <GlossaryHighlight text={property.notes} terms={terms} />
        </p>
      )}
    </Card>
  );
}
