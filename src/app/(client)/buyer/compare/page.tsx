"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions, useTransaction } from "@/hooks/useTransaction";
import { PropertyCompare } from "@/components/buyer/PropertyCompare";
import { Card } from "@/components/ui/Card";
import type { Property } from "@/types";
import { PermissionGate } from "@/components/shared/PermissionGate";

export default function ComparePage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const buyingTx = transactions.find((t) => t.type === "buying");
  const { properties } = useTransaction(buyingTx?.id || "");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  }

  const compareList = properties.filter((p) => selected.has(p.id));

  return (
    <PermissionGate transactionId={buyingTx?.id} permission="property">
      <div className="max-w-6xl mx-auto space-y-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
          Compare Properties
        </h1>

        {/* Selection */}
        <div className="flex flex-wrap gap-2">
          {properties.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleSelect(p.id)}
              aria-pressed={selected.has(p.id)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                selected.has(p.id)
                  ? "bg-primary text-white border-primary"
                  : "bg-surface text-text-primary border-border hover:border-primary"
              }`}
            >
              {p.address}
            </button>
          ))}
        </div>

        {properties.length === 0 ? (
          <Card>
            <p className="text-center text-text-secondary py-8">
              Add properties first, then compare them here.
            </p>
          </Card>
        ) : (
          <Card padding={false} className="rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6">
              <PropertyCompare properties={compareList} />
            </div>
          </Card>
        )}
      </div>
    </PermissionGate>
  );
}
