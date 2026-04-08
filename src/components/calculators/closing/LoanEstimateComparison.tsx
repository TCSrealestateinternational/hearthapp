"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

interface LoanEstimate {
  name: string;
  loanAmount: number;
  interestRate: number;
  originationFees: number;
  thirdPartyFees: number;
  prepaids: number;
  totalClosingCosts: number;
}

function useLoanEstimate(defaults: LoanEstimate) {
  const [name, setName] = useState(defaults.name);
  const [loanAmount, setLoanAmount] = useState(defaults.loanAmount);
  const [interestRate, setInterestRate] = useState(defaults.interestRate);
  const [originationFees, setOriginationFees] = useState(defaults.originationFees);
  const [thirdPartyFees, setThirdPartyFees] = useState(defaults.thirdPartyFees);
  const [prepaids, setPrepaids] = useState(defaults.prepaids);
  const [totalClosingCosts, setTotalClosingCosts] = useState(defaults.totalClosingCosts);

  return {
    state: { name, loanAmount, interestRate, originationFees, thirdPartyFees, prepaids, totalClosingCosts },
    setters: { setName, setLoanAmount, setInterestRate, setOriginationFees, setThirdPartyFees, setPrepaids, setTotalClosingCosts },
  };
}

export function LoanEstimateComparison() {
  const estimateA = useLoanEstimate({
    name: "Lender A",
    loanAmount: 280000,
    interestRate: 6.5,
    originationFees: 2800,
    thirdPartyFees: 1500,
    prepaids: 3500,
    totalClosingCosts: 7800,
  });

  const estimateB = useLoanEstimate({
    name: "Lender B",
    loanAmount: 280000,
    interestRate: 6.75,
    originationFees: 1400,
    thirdPartyFees: 1500,
    prepaids: 3500,
    totalClosingCosts: 6400,
  });

  const results = useMemo(() => {
    const a = estimateA.state;
    const b = estimateB.state;

    const monthlyA = monthlyPayment(a.loanAmount, a.interestRate, 30);
    const monthlyB = monthlyPayment(b.loanAmount, b.interestRate, 30);

    const totalInterestA = monthlyA * 360 - a.loanAmount;
    const totalInterestB = monthlyB * 360 - b.loanAmount;

    const totalCostA = totalInterestA + a.totalClosingCosts;
    const totalCostB = totalInterestB + b.totalClosingCosts;

    const monthlyDiff = monthlyA - monthlyB;
    const closingDiff = a.totalClosingCosts - b.totalClosingCosts;
    const totalCostDiff = totalCostA - totalCostB;

    // Break-even: if one has lower monthly but higher closing, when does it pay off?
    let breakEvenMonths: number | null = null;
    if (monthlyDiff !== 0 && closingDiff !== 0 && Math.sign(monthlyDiff) !== Math.sign(closingDiff)) {
      breakEvenMonths = Math.abs(Math.round(closingDiff / monthlyDiff));
    }

    const betterMonthly = monthlyA < monthlyB ? "A" : monthlyA > monthlyB ? "B" : "tie";
    const betterClosing = a.totalClosingCosts < b.totalClosingCosts ? "A" : a.totalClosingCosts > b.totalClosingCosts ? "B" : "tie";
    const betterTotal = totalCostA < totalCostB ? "A" : totalCostA > totalCostB ? "B" : "tie";

    return {
      monthlyA, monthlyB,
      totalInterestA, totalInterestB,
      totalCostA, totalCostB,
      monthlyDiff, closingDiff, totalCostDiff,
      breakEvenMonths,
      betterMonthly, betterClosing, betterTotal,
    };
  }, [estimateA.state, estimateB.state]);

  const winnerName = results.betterTotal === "A" ? estimateA.state.name : estimateB.state.name;
  const winnerLabel = results.betterTotal === "tie"
    ? "Both options cost the same over 30 years"
    : `${winnerName} saves ${fmt(Math.abs(results.totalCostDiff))} over 30 years`;

  return (
    <CalculatorShell
      title="Loan Estimate Comparison"
      description="Compare two loan estimates side by side to find the better deal."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Best Overall Value (30-Year Cost)"
            value={results.betterTotal === "tie" ? "Tied" : winnerName}
            variant={results.betterTotal === "tie" ? "secondary" : "success"}
            detail={winnerLabel}
          />

          <Card>
            <CardHeader>
              <CardTitle>Monthly Payment</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label={estimateA.state.name} value={fmt(results.monthlyA)} />
              <ResultRow label={estimateB.state.name} value={fmt(results.monthlyB)} />
              <ResultRow
                label="Difference"
                value={`${fmt(Math.abs(results.monthlyDiff))}/mo`}
                bold
              />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Closing Costs</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label={estimateA.state.name} value={fmt(estimateA.state.totalClosingCosts)} />
              <ResultRow label={estimateB.state.name} value={fmt(estimateB.state.totalClosingCosts)} />
              <ResultRow
                label="Difference"
                value={fmt(Math.abs(results.closingDiff))}
                bold
              />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>30-Year Total Cost</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label={`${estimateA.state.name} Interest`} value={fmt(results.totalInterestA)} />
              <ResultRow label={`${estimateA.state.name} Total`} value={fmt(results.totalCostA)} />
              <ResultRow label={`${estimateB.state.name} Interest`} value={fmt(results.totalInterestB)} />
              <ResultRow label={`${estimateB.state.name} Total`} value={fmt(results.totalCostB)} />
              <ResultRow
                label="Total Savings"
                value={fmt(Math.abs(results.totalCostDiff))}
                bold
              />
            </div>
          </Card>

          {results.breakEvenMonths !== null && (
            <Card>
              <CardHeader>
                <CardTitle>Break-Even Analysis</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                <ResultRow
                  label="Break-Even Point"
                  value={`${results.breakEvenMonths} months (~${(results.breakEvenMonths / 12).toFixed(1)} years)`}
                  bold
                />
                <p className="text-sm text-text-secondary">
                  The lender with lower monthly payments will overtake the lower closing cost option after this period.
                </p>
              </div>
            </Card>
          )}
        </div>
      }
      inputs={
        <div className="space-y-6">
          <Card variant="container">
            <CardHeader>
              <CardTitle>{estimateA.state.name || "Lender A"}</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Lender Name
                </label>
                <input
                  type="text"
                  value={estimateA.state.name}
                  onChange={(e) => estimateA.setters.setName(e.target.value)}
                  placeholder="Lender A"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-text-primary"
                />
              </div>
              <InputField
                label="Loan Amount"
                value={estimateA.state.loanAmount}
                onChange={estimateA.setters.setLoanAmount}
                min={50000}
                max={2000000}
                step={5000}
                prefix="$"
              />
              <InputField
                label="Interest Rate"
                value={estimateA.state.interestRate}
                onChange={estimateA.setters.setInterestRate}
                min={0.5}
                max={15}
                step={0.125}
                suffix="%"
              />
              <InputField
                label="Origination Fees"
                value={estimateA.state.originationFees}
                onChange={estimateA.setters.setOriginationFees}
                min={0}
                max={20000}
                step={100}
                prefix="$"
              />
              <InputField
                label="Third-Party Fees"
                value={estimateA.state.thirdPartyFees}
                onChange={estimateA.setters.setThirdPartyFees}
                min={0}
                max={10000}
                step={100}
                prefix="$"
              />
              <InputField
                label="Prepaids"
                value={estimateA.state.prepaids}
                onChange={estimateA.setters.setPrepaids}
                min={0}
                max={15000}
                step={100}
                prefix="$"
              />
              <InputField
                label="Total Closing Costs"
                value={estimateA.state.totalClosingCosts}
                onChange={estimateA.setters.setTotalClosingCosts}
                min={0}
                max={50000}
                step={100}
                prefix="$"
              />
            </div>
          </Card>

          <Card variant="container">
            <CardHeader>
              <CardTitle>{estimateB.state.name || "Lender B"}</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Lender Name
                </label>
                <input
                  type="text"
                  value={estimateB.state.name}
                  onChange={(e) => estimateB.setters.setName(e.target.value)}
                  placeholder="Lender B"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-text-primary"
                />
              </div>
              <InputField
                label="Loan Amount"
                value={estimateB.state.loanAmount}
                onChange={estimateB.setters.setLoanAmount}
                min={50000}
                max={2000000}
                step={5000}
                prefix="$"
              />
              <InputField
                label="Interest Rate"
                value={estimateB.state.interestRate}
                onChange={estimateB.setters.setInterestRate}
                min={0.5}
                max={15}
                step={0.125}
                suffix="%"
              />
              <InputField
                label="Origination Fees"
                value={estimateB.state.originationFees}
                onChange={estimateB.setters.setOriginationFees}
                min={0}
                max={20000}
                step={100}
                prefix="$"
              />
              <InputField
                label="Third-Party Fees"
                value={estimateB.state.thirdPartyFees}
                onChange={estimateB.setters.setThirdPartyFees}
                min={0}
                max={10000}
                step={100}
                prefix="$"
              />
              <InputField
                label="Prepaids"
                value={estimateB.state.prepaids}
                onChange={estimateB.setters.setPrepaids}
                min={0}
                max={15000}
                step={100}
                prefix="$"
              />
              <InputField
                label="Total Closing Costs"
                value={estimateB.state.totalClosingCosts}
                onChange={estimateB.setters.setTotalClosingCosts}
                min={0}
                max={50000}
                step={100}
                prefix="$"
              />
            </div>
          </Card>
        </div>
      }
      disclaimer="This comparison is based on the values you enter. Always review the full Loan Estimate (LE) from each lender and compare all terms including prepayment penalties and rate lock periods."
    />
  );
}
