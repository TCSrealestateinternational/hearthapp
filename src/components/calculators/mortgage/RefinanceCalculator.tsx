"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(280000);
  const [currentRate, setCurrentRate] = useState(7.25);
  const [currentPayment, setCurrentPayment] = useState(2100);
  const [newRate, setNewRate] = useState(5.75);
  const [newTerm, setNewTerm] = useState("30");
  const [closingCosts, setClosingCosts] = useState(6000);

  const results = useMemo(() => {
    const years = Number(newTerm);
    const newPmt = monthlyPayment(currentBalance, newRate, years);
    const monthlySavings = currentPayment - newPmt;
    const breakEvenMonths =
      monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;

    // Total cost of new loan
    const newTotalPaid = newPmt * years * 12;
    const newTotalInterest = newTotalPaid - currentBalance;

    // Remaining cost if staying (estimate based on current payment for same term)
    // We will use the remaining term as a proxy
    const remainingCostCurrent = currentPayment * years * 12;

    // Net savings = remaining cost on current - (new total + closing costs)
    const lifetimeSavings = remainingCostCurrent - (newTotalPaid + closingCosts);

    return {
      newPmt,
      monthlySavings,
      breakEvenMonths,
      newTotalPaid,
      newTotalInterest,
      lifetimeSavings,
      isWorthIt: monthlySavings > 0,
    };
  }, [currentBalance, currentRate, currentPayment, newRate, newTerm, closingCosts]);

  function breakEvenText(months: number): string {
    if (!isFinite(months) || months <= 0) return "N/A";
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem} month${rem !== 1 ? "s" : ""}`;
    if (rem === 0) return `${years} year${years !== 1 ? "s" : ""}`;
    return `${years} yr ${rem} mo`;
  }

  return (
    <CalculatorShell
      title="Refinance Calculator"
      description="Determine if refinancing makes financial sense by comparing your current and new loan."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="New Payment"
              value={fmt(results.newPmt) + "/mo"}
              variant="primary"
              detail={`${fmtPct(newRate)} for ${newTerm} years`}
            />
            <ResultCard
              label="Monthly Savings"
              value={
                results.monthlySavings >= 0
                  ? fmt(results.monthlySavings)
                  : "-" + fmt(Math.abs(results.monthlySavings))
              }
              variant={results.monthlySavings > 0 ? "success" : "error"}
              detail={results.monthlySavings > 0 ? "per month saved" : "per month more"}
            />
            <ResultCard
              label="Break-even"
              value={breakEvenText(results.breakEvenMonths)}
              variant="secondary"
              detail={
                isFinite(results.breakEvenMonths) && results.breakEvenMonths > 0
                  ? `${results.breakEvenMonths} months to recoup ${fmt(closingCosts)}`
                  : "Refinancing may not save money"
              }
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Comparison</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Current Payment" value={fmt(currentPayment) + "/mo"} />
              <ResultRow label="New Payment" value={fmt(results.newPmt) + "/mo"} />
              <ResultRow
                label="Monthly Difference"
                value={
                  (results.monthlySavings >= 0 ? "-" : "+") +
                  fmt(Math.abs(results.monthlySavings))
                }
              />
              <ResultRow label="Closing Costs" value={fmt(closingCosts)} />
              <ResultRow label="New Total Interest" value={fmt(results.newTotalInterest)} />
              <ResultRow
                label="Lifetime Savings"
                value={
                  results.lifetimeSavings >= 0
                    ? fmt(results.lifetimeSavings)
                    : "-" + fmt(Math.abs(results.lifetimeSavings))
                }
                bold
              />
            </div>
          </Card>

          {results.isWorthIt && isFinite(results.breakEvenMonths) && (
            <Card variant="container">
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  If you plan to stay in your home longer than{" "}
                  <span className="font-semibold text-text-primary">
                    {breakEvenText(results.breakEvenMonths)}
                  </span>
                  , refinancing could save you{" "}
                  <span className="font-semibold text-text-primary">
                    {fmt(results.lifetimeSavings)}
                  </span>{" "}
                  over the life of the loan.
                </p>
              </div>
            </Card>
          )}
        </div>
      }
      inputs={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Loan</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <InputField
                  label="Current Loan Balance"
                  value={currentBalance}
                  onChange={setCurrentBalance}
                  min={10000}
                  max={2000000}
                  step={5000}
                  prefix="$"
                />
                <InputField
                  label="Current Interest Rate"
                  value={currentRate}
                  onChange={setCurrentRate}
                  min={0.5}
                  max={15}
                  step={0.125}
                  suffix="%"
                />
                <InputField
                  label="Current Monthly Payment"
                  value={currentPayment}
                  onChange={setCurrentPayment}
                  min={100}
                  max={20000}
                  step={50}
                  prefix="$"
                />
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Loan</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <InputField
                  label="New Interest Rate"
                  value={newRate}
                  onChange={setNewRate}
                  min={0.5}
                  max={15}
                  step={0.125}
                  suffix="%"
                />
                <SelectField
                  label="New Loan Term"
                  value={newTerm}
                  onChange={setNewTerm}
                  options={[
                    { value: "30", label: "30 years" },
                    { value: "20", label: "20 years" },
                    { value: "15", label: "15 years" },
                    { value: "10", label: "10 years" },
                  ]}
                />
                <InputField
                  label="Closing Costs"
                  value={closingCosts}
                  onChange={setClosingCosts}
                  min={0}
                  max={50000}
                  step={500}
                  prefix="$"
                />
              </div>
            </Card>
          </div>
        </div>
      }
    />
  );
}
