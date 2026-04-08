"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment, amortizationSchedule } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function PMICalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm] = useState(30);
  const [pmiRate, setPmiRate] = useState(0.85);

  const results = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const loanAmount = homePrice - downPayment;
    const annualPMI = loanAmount * (pmiRate / 100);
    const monthlyPMI = annualPMI / 12;

    // PMI drops when equity reaches 20% of original home price
    const equityThreshold = homePrice * 0.2;

    // Find the month when equity hits 20% (balance drops to 80% of home price)
    const targetBalance = homePrice * 0.8;
    const schedule = amortizationSchedule(loanAmount, interestRate, loanTerm);

    let monthsUntilPMIDrops = 0;
    for (const entry of schedule) {
      // equity = downPayment + (loanAmount - balance)
      // We need: downPayment + (loanAmount - balance) >= equityThreshold
      // That simplifies to: balance <= homePrice - equityThreshold = homePrice * 0.8
      if (entry.balance <= targetBalance) {
        monthsUntilPMIDrops = entry.month;
        break;
      }
    }

    // If PMI never drops in the schedule (shouldn't happen but safety check)
    if (monthsUntilPMIDrops === 0 && downPaymentPct < 20) {
      monthsUntilPMIDrops = loanTerm * 12;
    }

    const totalPMIPaid = monthlyPMI * monthsUntilPMIDrops;

    // P&I payment for context
    const piPayment = monthlyPayment(loanAmount, interestRate, loanTerm);

    return {
      downPayment,
      loanAmount,
      monthlyPMI,
      annualPMI,
      monthsUntilPMIDrops,
      totalPMIPaid,
      piPayment,
      needsPMI: downPaymentPct < 20,
    };
  }, [homePrice, downPaymentPct, interestRate, loanTerm, pmiRate]);

  function monthsToText(months: number): string {
    if (months <= 0) return "No PMI needed";
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem} month${rem !== 1 ? "s" : ""}`;
    if (rem === 0) return `${years} year${years !== 1 ? "s" : ""}`;
    return `${years} yr ${rem} mo`;
  }

  return (
    <CalculatorShell
      title="PMI Calculator"
      description="Estimate your Private Mortgage Insurance cost and how long you will pay it."
      results={
        <div className="space-y-4">
          {results.needsPMI ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultCard
                  label="Monthly PMI"
                  value={fmt(results.monthlyPMI)}
                  variant="error"
                  detail={`${fmtPct(pmiRate)} PMI rate on ${fmt(results.loanAmount)} loan`}
                />
                <ResultCard
                  label="PMI Duration"
                  value={monthsToText(results.monthsUntilPMIDrops)}
                  variant="secondary"
                  detail="Until you reach 20% equity"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>PMI Summary</CardTitle>
                </CardHeader>
                <div className="space-y-2">
                  <ResultRow label="Monthly PMI" value={fmt(results.monthlyPMI)} />
                  <ResultRow label="Annual PMI Cost" value={fmt(results.annualPMI)} />
                  <ResultRow
                    label="Months Until PMI Drops"
                    value={String(results.monthsUntilPMIDrops)}
                  />
                  <ResultRow label="Total PMI Paid" value={fmt(results.totalPMIPaid)} bold />
                  <ResultRow
                    label="P&I Payment (without PMI)"
                    value={fmt(results.piPayment)}
                  />
                  <ResultRow
                    label="Total Payment (with PMI)"
                    value={fmt(results.piPayment + results.monthlyPMI)}
                    bold
                  />
                </div>
              </Card>
            </>
          ) : (
            <ResultCard
              label="No PMI Required"
              value="$0/mo"
              variant="success"
              detail={`With ${fmtPct(downPaymentPct)} down, you meet the 20% threshold and do not need PMI.`}
            />
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
            label="Down Payment"
            value={downPaymentPct}
            onChange={setDownPaymentPct}
            min={1}
            max={30}
            step={0.5}
            suffix="%"
            slider
          />
          <InputField
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={0.5}
            max={15}
            step={0.125}
            suffix="%"
          />
          <InputField
            label="PMI Rate"
            value={pmiRate}
            onChange={setPmiRate}
            min={0.1}
            max={2.5}
            step={0.05}
            suffix="%"
          />
        </div>
      }
      disclaimer="PMI rates vary by lender, credit score, and loan-to-value ratio. This estimate uses a flat annual PMI rate. Actual costs may differ."
    />
  );
}
