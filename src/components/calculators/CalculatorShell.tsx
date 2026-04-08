"use client";

import type { ReactNode } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface CalculatorShellProps {
  title: string;
  description?: string;
  results: ReactNode;
  inputs: ReactNode;
  disclaimer?: string;
}

export function CalculatorShell({
  title,
  description,
  results,
  inputs,
  disclaimer,
}: CalculatorShellProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>

      {results}

      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <div className="space-y-4">{inputs}</div>
      </Card>

      <p className="text-xs text-text-secondary">
        {disclaimer ||
          "These estimates are for informational purposes only. Consult with a qualified professional for accurate figures."}
      </p>
    </div>
  );
}
