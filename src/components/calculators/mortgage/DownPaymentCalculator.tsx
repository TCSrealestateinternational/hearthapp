"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function DownPaymentCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(35000);
  const [currentSavings, setCurrentSavings] = useState(15000);
  const [monthlySavings, setMonthlySavings] = useState(1000);

  const results = useMemo(() => {
    const downPaymentPct = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
    const loanAmount = Math.max(0, homePrice - downPayment);
    const remaining = Math.max(0, downPayment - currentSavings);
    const monthsToSave =
      monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : Infinity;

    // 20% threshold
    const twentyPct = homePrice * 0.2;
    const needForTwentyPct = Math.max(0, twentyPct - currentSavings);
    const monthsToTwentyPct =
      monthlySavings > 0
        ? Math.ceil(needForTwentyPct / monthlySavings)
        : Infinity;

    const hasPMI = downPaymentPct < 20;

    return {
      downPaymentPct,
      loanAmount,
      remaining,
      monthsToSave,
      twentyPct,
      monthsToTwentyPct,
      hasPMI,
    };
  }, [homePrice, downPayment, currentSavings, monthlySavings]);

  function monthsToText(months: number): string {
    if (!isFinite(months)) return "N/A";
    if (months <= 0) return "Ready now";
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem} month${rem !== 1 ? "s" : ""}`;
    if (rem === 0) return `${years} year${years !== 1 ? "s" : ""}`;
    return `${years}y ${rem}m`;
  }

  return (
    <CalculatorShell
      title="Down Payment Calculator"
      description="Figure out how much to save, how long it will take, and whether you will need PMI."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Down Payment"
              value={fmt(downPayment)}
              variant="primary"
              detail={`${fmtPct(results.downPaymentPct)} of home price`}
            />
            <ResultCard
              label="Time to Save"
              value={monthsToText(results.monthsToSave)}
              variant={results.remaining <= 0 ? "success" : "secondary"}
              detail={
                results.remaining <= 0
                  ? "You already have enough saved"
                  : `${fmt(results.remaining)} more needed`
              }
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Home Price" value={fmt(homePrice)} />
              <ResultRow label="Loan Amount" value={fmt(results.loanAmount)} />
              <ResultRow
                label="Down Payment %"
                value={fmtPct(results.downPaymentPct)}
              />
              <ResultRow
                label="Still Need to Save"
                value={results.remaining > 0 ? fmt(results.remaining) : "$0"}
              />
              <ResultRow
                label="20% Threshold"
                value={fmt(results.twentyPct)}
                bold
              />
              <ResultRow
                label="Time to Reach 20%"
                value={monthsToText(results.monthsToTwentyPct)}
              />
            </div>
          </Card>

          {results.hasPMI && (
            <Card variant="container">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center text-warning font-bold text-sm">
                  !
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    PMI will likely be required
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    With less than 20% down ({fmtPct(results.downPaymentPct)}),
                    most lenders require Private Mortgage Insurance. Consider
                    saving to {fmt(results.twentyPct)} to avoid PMI.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Home Price"
            value={homePrice}
            onChange={setHomePrice}
            min={50000}
            max={2000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Down Payment Amount"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={homePrice}
            step={1000}
            prefix="$"
            slider
          />
          <InputField
            label="Current Savings"
            value={currentSavings}
            onChange={setCurrentSavings}
            min={0}
            max={1000000}
            step={500}
            prefix="$"
          />
          <InputField
            label="Monthly Savings Contribution"
            value={monthlySavings}
            onChange={setMonthlySavings}
            min={0}
            max={20000}
            step={100}
            prefix="$"
          />
        </div>
      }
    />
  );
}
