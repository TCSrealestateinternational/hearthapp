"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface CMAViewerProps {
  cmaUrl?: string;
  listPrice?: number;
  priceRangeLow?: number;
  priceRangeHigh?: number;
}

export function CMAViewer({
  cmaUrl,
  listPrice,
  priceRangeLow,
  priceRangeHigh,
}: CMAViewerProps) {
  if (!cmaUrl) {
    return (
      <Card>
        <div className="text-center py-8">
          <MaterialIcon name="description" size={40} className="mx-auto mb-3 text-on-surface-variant opacity-50" />
          <p className="text-on-surface-variant">
            Your CMA has not been uploaded yet.
          </p>
          <p className="text-sm text-on-surface-variant mt-1">
            Your agent will upload it when ready.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Price range summary */}
      {priceRangeLow && priceRangeHigh && (
        <Card>
          <CardTitle>Suggested Price Range</CardTitle>
          <div className="mt-3 flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-on-surface-variant">Low</p>
              <p className="text-lg font-semibold text-on-surface">
                ${priceRangeLow.toLocaleString()}
              </p>
            </div>
            <div className="flex-1 h-2 bg-primary-container rounded-full relative">
              {listPrice && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cta rounded-full border-2 border-white shadow"
                  style={{
                    left: `${
                      ((listPrice - priceRangeLow) /
                        (priceRangeHigh - priceRangeLow)) *
                      100
                    }%`,
                  }}
                />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-on-surface-variant">High</p>
              <p className="text-lg font-semibold text-on-surface">
                ${priceRangeHigh.toLocaleString()}
              </p>
            </div>
          </div>
          {listPrice && (
            <p className="sr-only">
              Your list price of ${listPrice.toLocaleString()} falls between the suggested low of ${priceRangeLow.toLocaleString()} and high of ${priceRangeHigh.toLocaleString()}.
            </p>
          )}
          {listPrice && (
            <p className="text-center text-sm text-cta font-medium mt-2">
              Your list price: ${listPrice.toLocaleString()}
            </p>
          )}
        </Card>
      )}

      {/* PDF embed */}
      <Card padding={false}>
        <div className="p-4 flex items-center justify-between border-b border-outline-variant">
          <CardTitle>Comparative Market Analysis</CardTitle>
          <a href={cmaUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm">
              <MaterialIcon name="download" size={14} />
              Download
            </Button>
          </a>
        </div>
        <iframe
          src={cmaUrl}
          className="w-full h-[600px]"
          title="CMA Document"
        />
      </Card>
    </div>
  );
}
