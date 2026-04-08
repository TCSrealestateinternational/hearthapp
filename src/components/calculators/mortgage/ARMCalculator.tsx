"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function ARMCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [initialRate, setInitialRate] = useState(5.25);
  const [initialPeriod, setInitialPeriod] = useState("5");
  const [adjustedRate, setAdjustedRate] = useState(7.5);
  const [totalTerm] = useState(30);

  const results = useMemo(() => {
    const initYears = Number(initialPeriod);
    const remainingYears = totalTerm - initYears;

    // Initial period payment
    const initialPmt = monthlyPayment(loanAmount, initialRate, totalTerm);

    // Calculate remaining balance after initial period
    const r = initialRate / 100 / 12;
    const n = totalTerm * 12;
    let balance = loanAmount;
    for (let i = 0; i < initYears * 12; i++) {
      const interest = balance * r;
      const principal = initialPmt - interest;
      balance = Math.max(0, balance - principal);
    }

    // Adjusted period payment on remaining balance
    const adjustedPmt =
      remainingYears > 0
        ? monthlyPayment(balance, adjustedRate, remainingYears)
        : 0;

    const paymentIncrease = adjustedPmt - initialPmt;

    // Total cost with ARM
    const totalInitialCost = initialPmt * initYears * 12;
    const totalAdjustedCost = adjustedPmt * remainingYears * 12;
    const totalARMCost = totalInitialCost + totalAdjustedCost;

    // Compare vs. fixed-rate at the adjusted rate for the full term
    const fixedPmt = monthlyPayment(loanAmount, adjustedRate, totalTerm);
    const totalFixedCost = fixedPmt * totalTerm * 12;

    // Compare vs. fixed-rate at the initial rate for the full term
    const fixedInitialPmt = monthlyPayment(loanAmount, initialRate, totalTerm);
    const totalFixedInitialCost = fixedInitialPmt * totalTerm * 12;

    const armSavingsVsFixed = totalFixedCost - totalARMCost;

    return {
      initialPmt,
      adjustedPmt,
      paymentIncrease,
      balance,
      totalARMCost,
      totalFixedCost,
      fixedPmt,
      fixedInitialPmt,
      totalFixedInitialCost,
      armSavingsVsFixed,
      initYears,
      remainingYears,
    };
  }, [loanAmount, initialRate, initialPeriod, adjustedRate, totalTerm]);

  return (
    <CalculatorShell
      title="ARM Calculator"
      description="Compare an adjustable-rate mortgage to a fixed rate and see how your payment changes after the initial period."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Initial Payment"
              value={fmt(results.initialPmt) + "/mo"}
              variant="success"
              detail={`${fmtPct(initialRate)} for first ${initialPeriod} years`}
            />
            <ResultCard
              label="Adjusted Payment"
              value={fmt(results.adjustedPmt) + "/mo"}
              variant={results.paymentIncrease > 0 ? "error" : "success"}
              detail={`${fmtPct(adjustedRate)} for remaining ${results.remainingYears} years`}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Change</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Initial Monthly Payment" value={fmt(results.initialPmt)} />
              <ResultRow label="Adjusted Monthly Payment" value={fmt(results.adjustedPmt)} />
              <ResultRow
                label="Payment Increase"
                value={
                  results.paymentIncrease >= 0
                    ? "+" + fmt(results.paymentIncrease)
                    : "-" + fmt(Math.abs(results.paymentIncrease))
                }
                bold
              />
              <ResultRow
                label="Balance at Adjustment"
                value={fmt(results.balance)}
              />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Cost Comparison</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow
                label={`ARM (${initialPeriod}/1)`}
                value={fmt(results.totalARMCost)}
              />
              <ResultRow
                label={`Fixed at ${fmtPct(adjustedRate)}`}
                value={fmt(results.totalFixedCost)}
              />
              <ResultRow
                label={`Fixed at ${fmtPct(initialRate)}`}
                value={fmt(results.totalFixedInitialCost)}
              />
              <ResultRow
                label={`ARM Savings vs Fixed ${fmtPct(adjustedRate)}`}
                value={
                  results.armSavingsVsFixed >= 0
                    ? fmt(results.armSavingsVsFixed)
                    : "-" + fmt(Math.abs(results.armSavingsVsFixed))
                }
                bold
              />
            </div>
          </Card>

          <Card variant="container">
            <div className="text-sm text-text-secondary space-y-2">
              <p>
                <span className="font-medium text-text-primary">How ARM works:</span>{" "}
                You pay {fmtPct(initialRate)} for the first {initialPeriod} years, then the rate
                adjusts. This calculator assumes the rate adjusts once to {fmtPct(adjustedRate)} for
                the remaining {results.remainingYears} years.
              </p>
              <p>
                In practice, ARM rates adjust periodically (usually annually) based on a market
                index plus a margin. Your actual adjusted rate may be higher or lower.
              </p>
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={10000}
            max={2000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Initial Interest Rate"
            value={initialRate}
            onChange={setInitialRate}
            min={0.5}
            max={15}
            step={0.125}
            suffix="%"
          />
          <SelectField
            label="Initial Fixed Period"
            value={initialPeriod}
            onChange={setInitialPeriod}
            options={[
              { value: "3", label: "3 years (3/1 ARM)" },
              { value: "5", label: "5 years (5/1 ARM)" },
              { value: "7", label: "7 years (7/1 ARM)" },
              { value: "10", label: "10 years (10/1 ARM)" },
            ]}
          />
          <InputField
            label="Adjusted Interest Rate"
            value={adjustedRate}
            onChange={setAdjustedRate}
            min={0.5}
            max={15}
            step={0.125}
            suffix="%"
          />
        </div>
      }
      disclaimer="ARM rates are unpredictable. This calculator assumes a single adjustment for illustration purposes. Actual ARM terms include rate caps, adjustment periods, and index-based rates that may differ significantly."
    />
  );
}
