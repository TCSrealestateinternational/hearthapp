"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment, amortizationSchedule } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState(280000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState("30");

  const results = useMemo(() => {
    const years = Number(loanTerm);
    const schedule = amortizationSchedule(loanAmount, interestRate, years);
    const pmt = monthlyPayment(loanAmount, interestRate, years);
    const totalPaid = pmt * years * 12;
    const totalInterest = totalPaid - loanAmount;

    const now = new Date();
    const payoffDate = new Date(now.getFullYear() + years, now.getMonth(), 1);
    const payoffStr = payoffDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Build yearly summary
    const yearlySummary: {
      year: number;
      beginBalance: number;
      principalPaid: number;
      interestPaid: number;
      endBalance: number;
    }[] = [];

    for (let y = 0; y < years; y++) {
      const startIdx = y * 12;
      const endIdx = startIdx + 12;
      const yearMonths = schedule.slice(startIdx, endIdx);
      if (yearMonths.length === 0) break;

      const beginBalance = y === 0 ? loanAmount : yearlySummary[y - 1].endBalance;
      const principalPaid = yearMonths.reduce((sum, m) => sum + m.principalPaid, 0);
      const interestPaid = yearMonths.reduce((sum, m) => sum + m.interestPaid, 0);
      const endBalance = yearMonths[yearMonths.length - 1].balance;

      yearlySummary.push({
        year: y + 1,
        beginBalance,
        principalPaid,
        interestPaid,
        endBalance,
      });
    }

    return { pmt, totalPaid, totalInterest, payoffStr, yearlySummary };
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <CalculatorShell
      title="Amortization Calculator"
      description="See how your loan balance decreases over time and how much goes to principal vs. interest each year."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Monthly Payment (P&I)"
            value={fmt(results.pmt)}
            variant="primary"
            breakdown={[
              { label: "Total Interest Paid", value: fmt(results.totalInterest) },
              { label: "Total Amount Paid", value: fmt(results.totalPaid) },
              { label: "Payoff Date", value: results.payoffStr },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Yearly Amortization Schedule</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface-container sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 text-text-secondary font-medium">Year</th>
                    <th className="text-right px-3 py-2 text-text-secondary font-medium">Starting Balance</th>
                    <th className="text-right px-3 py-2 text-text-secondary font-medium">Principal</th>
                    <th className="text-right px-3 py-2 text-text-secondary font-medium">Interest</th>
                    <th className="text-right px-3 py-2 text-text-secondary font-medium">Ending Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlySummary.map((row) => (
                    <tr key={row.year} className="border-t border-border hover:bg-surface-container/50">
                      <td className="px-3 py-2 text-text-primary font-medium">{row.year}</td>
                      <td className="px-3 py-2 text-right text-text-secondary">{fmt(row.beginBalance)}</td>
                      <td className="px-3 py-2 text-right text-text-primary">{fmt(row.principalPaid)}</td>
                      <td className="px-3 py-2 text-right text-text-secondary">{fmt(row.interestPaid)}</td>
                      <td className="px-3 py-2 text-right text-text-primary font-medium">{fmt(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={0.5}
            max={15}
            step={0.125}
            suffix="%"
          />
          <SelectField
            label="Loan Term"
            value={loanTerm}
            onChange={setLoanTerm}
            options={[
              { value: "30", label: "30 years" },
              { value: "20", label: "20 years" },
              { value: "15", label: "15 years" },
              { value: "10", label: "10 years" },
            ]}
          />
        </div>
      }
    />
  );
}
