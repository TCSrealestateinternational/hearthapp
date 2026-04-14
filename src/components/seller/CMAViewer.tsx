"use client";

import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, FileText } from "lucide-react";

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
          <FileText size={40} className="mx-auto mb-3 text-text-secondary opacity-50" />
          <p className="text-text-secondary">
            Your CMA has not been uploaded yet.
          </p>
          <p className="text-sm text-text-secondary mt-1">
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
              <p className="text-sm text-text-secondary">Low</p>
              <p className="text-lg font-semibold text-text-primary">
                ${priceRangeLow.toLocaleString()}
              </p>
            </div>
            <div className="flex-1 h-2 bg-primary-light rounded-full relative">
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
              <p className="text-sm text-text-secondary">High</p>
              <p className="text-lg font-semibold text-text-primary">
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
        <div className="p-4 flex items-center justify-between border-b border-border">
          <CardTitle>Comparative Market Analysis</CardTitle>
          <a href={cmaUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm">
              <Download size={14} aria-hidden="true" />
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
