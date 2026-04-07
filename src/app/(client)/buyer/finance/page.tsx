"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { useTransactions, useTransaction } from "@/hooks/useTransaction";
import { FinanceCalculator } from "@/components/buyer/FinanceCalculator";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

export default function FinancePage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();
  const { transactions } = useTransactions(
    brokerage?.id || "",
    user?.id || ""
  );
  const buyingTx = transactions.find((t) => t.type === "buying");
  const { scenarios, addScenario, removeScenario } = useTransaction(
    buyingTx?.id || ""
  );
  const [saving, setSaving] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
        Finance Calculator
      </h1>

      <FinanceCalculator
        transactionId={buyingTx?.id || ""}
        saving={saving}
        onSave={async (scenario) => {
          setSaving(true);
          await addScenario(scenario);
          setSaving(false);
        }}
      />

      {/* Saved scenarios */}
      {scenarios.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Saved Scenarios
          </h2>
          <div className="space-y-3">
            {scenarios.map((s) => (
              <Card key={s.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">{s.name}</p>
                    <p className="text-sm text-text-secondary">
                      ${s.offerPrice.toLocaleString()} - {s.downPaymentPct}%
                      down - {s.interestRate}% rate
                    </p>
                    <div className="flex gap-4 mt-1 text-sm">
                      <span className="text-primary font-medium">
                        ${Math.round(s.monthlyTotal).toLocaleString()}/mo
                      </span>
                      <span className="text-secondary font-medium">
                        ${Math.round(s.cashToClose).toLocaleString()} to close
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeScenario(s.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
