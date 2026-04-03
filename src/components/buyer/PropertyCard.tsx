"use client";

import type { Property } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Star, MapPin } from "lucide-react";

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
            className="w-full h-40 object-cover rounded-t-xl"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text-primary text-lg">
            ${property.price.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-sm text-text-secondary mt-0.5">
            <MapPin size={14} />
            <span className="truncate">{property.address}</span>
          </div>
          <p className="text-sm text-text-secondary">
            {property.city}, {property.state} {property.zip}
          </p>
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
      {property.notes && (
        <p className="text-sm text-text-secondary mt-2 line-clamp-2">
          {property.notes}
        </p>
      )}
    </Card>
  );
}
