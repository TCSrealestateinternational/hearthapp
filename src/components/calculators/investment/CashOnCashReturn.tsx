"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function CashOnCashReturn() {
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [monthlyExpenses, setMonthlyExpenses] = useState(800);
  const [mortgagePayment, setMortgagePayment] = useState(1200);
  const [downPayment, setDownPayment] = useState(60000);
  const [closingCosts, setClosingCosts] = useState(9000);
  const [rehabCosts, setRehabCosts] = useState(0);

  const results = useMemo(() => {
    const annualCashFlow =
      (monthlyRent - monthlyExpenses - mortgagePayment) * 12;
    const totalCashInvested = downPayment + closingCosts + rehabCosts;
    const cashOnCash =
      totalCashInvested > 0
        ? (annualCashFlow / totalCashInvested) * 100
        : 0;

    return { annualCashFlow, totalCashInvested, cashOnCash };
  }, [monthlyRent, monthlyExpenses, mortgagePayment, downPayment, closingCosts, rehabCosts]);

  const variant = (): "success" | "primary" | "secondary" | "error" => {
    if (results.cashOnCash >= 12) return "success";
    if (results.cashOnCash >= 8) return "primary";
    if (results.cashOnCash >= 0) return "secondary";
    return "error";
  };

  const benchmark = (): string => {
    if (results.cashOnCash >= 12) return "Excellent (12%+)";
    if (results.cashOnCash >= 8) return "Good (8-12%)";
    if (results.cashOnCash >= 4) return "Moderate (4-8%)";
    if (results.cashOnCash >= 0) return "Low (0-4%)";
    return "Negative return";
  };

  return (
    <CalculatorShell
      title="Cash-on-Cash Return Calculator"
      description="Measure the annual return on the actual cash you invested in a rental property."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Cash-on-Cash Return"
            value={fmtPct(results.cashOnCash)}
            variant={variant()}
            detail={benchmark()}
            breakdown={[
              { label: "Annual Cash Flow", value: fmt(results.annualCashFlow) },
              { label: "Total Cash Invested", value: fmt(results.totalCashInvested) },
            ]}
          />
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Monthly Rent" value={fmt(monthlyRent)} />
              <ResultRow label="Monthly Expenses" value={fmt(monthlyExpenses)} />
              <ResultRow label="Mortgage Payment" value={fmt(mortgagePayment)} />
              <ResultRow
                label="Monthly Cash Flow"
                value={fmt(monthlyRent - monthlyExpenses - mortgagePayment)}
              />
              <ResultRow label="Annual Cash Flow" value={fmt(results.annualCashFlow)} bold />
              <ResultRow label="Down Payment" value={fmt(downPayment)} />
              <ResultRow label="Closing Costs" value={fmt(closingCosts)} />
              <ResultRow label="Rehab Costs" value={fmt(rehabCosts)} />
              <ResultRow label="Total Cash Invested" value={fmt(results.totalCashInvested)} bold />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Benchmark Ranges</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Excellent" value="12%+" />
              <ResultRow label="Good" value="8% - 12%" />
              <ResultRow label="Moderate" value="4% - 8%" />
              <ResultRow label="Low" value="0% - 4%" />
              <ResultRow label="Negative" value="Below 0%" />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Monthly Rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            min={0}
            max={50000}
            step={50}
            prefix="$"
          />
          <InputField
            label="Monthly Expenses (excl. mortgage)"
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            min={0}
            max={20000}
            step={50}
            prefix="$"
          />
          <InputField
            label="Mortgage Payment (monthly)"
            value={mortgagePayment}
            onChange={setMortgagePayment}
            min={0}
            max={20000}
            step={25}
            prefix="$"
          />
          <InputField
            label="Down Payment"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={2000000}
            step={1000}
            prefix="$"
          />
          <InputField
            label="Closing Costs"
            value={closingCosts}
            onChange={setClosingCosts}
            min={0}
            max={200000}
            step={500}
            prefix="$"
          />
          <InputField
            label="Rehab / Renovation Costs"
            value={rehabCosts}
            onChange={setRehabCosts}
            min={0}
            max={500000}
            step={1000}
            prefix="$"
          />
        </div>
      }
    />
  );
}
