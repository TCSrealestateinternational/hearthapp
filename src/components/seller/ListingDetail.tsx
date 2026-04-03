"use client";

import type { Listing } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Calendar, MapPin } from "lucide-react";

interface ListingDetailProps {
  listing: Listing;
}

const statusVariant: Record<
  string,
  "default" | "primary" | "success" | "warning" | "error" | "cta"
> = {
  "coming-soon": "cta",
  active: "success",
  pending: "warning",
  sold: "primary",
  withdrawn: "default",
};

export function ListingDetail({ listing }: ListingDetailProps) {
  return (
    <div className="space-y-4">
      {/* Photos */}
      {listing.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {listing.photos.map((photo, i) => (
            <img
              key={i}
              src={photo}
              alt={`${listing.address} photo ${i + 1}`}
              className={`rounded-lg object-cover w-full ${
                i === 0 ? "col-span-2 h-48 sm:h-64" : "h-32"
              }`}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <Card>
        <CardHeader>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle>
                ${listing.listPrice.toLocaleString()}
              </CardTitle>
              <Badge
                variant={statusVariant[listing.status] || "default"}
              >
                {listing.status.replace("-", " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <MapPin size={14} />
              <span>
                {listing.address}, {listing.city}, {listing.state}{" "}
                {listing.zip}
              </span>
            </div>
          </div>
        </CardHeader>
        <div className="flex gap-4 text-sm text-text-secondary">
          <span>{listing.beds} bed</span>
          <span>{listing.baths} bath</span>
          <span>{listing.sqft.toLocaleString()} sqft</span>
        </div>
        {listing.description && (
          <p className="text-sm text-text-primary mt-3">
            {listing.description}
          </p>
        )}
      </Card>

      {/* Showing log */}
      {listing.showingLog.length > 0 && (
        <Card>
          <CardTitle>Showings</CardTitle>
          <div className="mt-3 space-y-2">
            {listing.showingLog.map((showing, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-2 border-b border-border last:border-0"
              >
                <Calendar size={16} className="text-text-secondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {showing.date} at {showing.time}
                  </p>
                  {showing.feedback && (
                    <p className="text-sm text-text-secondary mt-0.5">
                      {showing.feedback}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Timeline */}
      {listing.timeline.length > 0 && (
        <Card>
          <CardTitle>Timeline</CardTitle>
          <div className="mt-3 space-y-2">
            {listing.timeline.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-text-secondary w-24">
                  {entry.date}
                </span>
                <span className="text-sm text-text-primary">
                  {entry.event}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
