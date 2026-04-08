"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function InterestRateImpact() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [baseRate, setBaseRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState("30");

  const results = useMemo(() => {
    const years = Number(loanTerm);
    const basePmt = monthlyPayment(loanAmount, baseRate, years);
    const baseTotalInterest = basePmt * years * 12 - loanAmount;

    const rows: {
      rate: number;
      pmt: number;
      totalInterest: number;
      diffMonthly: number;
      diffTotal: number;
      isBase: boolean;
    }[] = [];

    const low = Math.max(0.25, baseRate - 1);
    const high = baseRate + 1;

    for (let rate = low; rate <= high + 0.001; rate += 0.25) {
      const r = Math.round(rate * 100) / 100; // avoid float issues
      const pmt = monthlyPayment(loanAmount, r, years);
      const totalInterest = pmt * years * 12 - loanAmount;

      rows.push({
        rate: r,
        pmt,
        totalInterest,
        diffMonthly: pmt - basePmt,
        diffTotal: totalInterest - baseTotalInterest,
        isBase: Math.abs(r - baseRate) < 0.001,
      });
    }

    return { basePmt, baseTotalInterest, rows };
  }, [loanAmount, baseRate, loanTerm]);

  return (
    <CalculatorShell
      title="Interest Rate Impact"
      description="See how small changes in interest rate affect your monthly payment and total interest paid."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Base Monthly Payment"
            value={fmt(results.basePmt)}
            variant="primary"
            detail={`${fmt(loanAmount)} at ${fmtPct(baseRate)} for ${loanTerm} years`}
            breakdown={[
              { label: "Total Interest at Base Rate", value: fmt(results.baseTotalInterest) },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Rate Comparison</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface-container sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2 text-text-secondary font-medium">Rate</th>
                    <th className="text-right px-3 py-2 text-text-secondary font-medium">Monthly Payment</th>
                    <th className="text-right px-3 py-2 text-text-secondary font-medium">Total Interest</th>
                    <th className="text-right px-3 py-2 text-text-secondary font-medium">Monthly Diff</th>
                    <th className="text-right px-3 py-2 text-text-secondary font-medium">Total Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row) => (
                    <tr
                      key={row.rate}
                      className={`border-t border-border ${
                        row.isBase
                          ? "bg-primary-light font-semibold"
                          : "hover:bg-surface-container/50"
                      }`}
                    >
                      <td className="px-3 py-2 text-text-primary">
                        {fmtPct(row.rate)}
                        {row.isBase && (
                          <span className="ml-2 text-xs text-primary font-medium">(base)</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-text-primary">{fmt(row.pmt)}</td>
                      <td className="px-3 py-2 text-right text-text-secondary">{fmt(row.totalInterest)}</td>
                      <td
                        className={`px-3 py-2 text-right ${
                          row.diffMonthly > 0.5
                            ? "text-error"
                            : row.diffMonthly < -0.5
                            ? "text-success"
                            : "text-text-secondary"
                        }`}
                      >
                        {row.isBase
                          ? "--"
                          : (row.diffMonthly >= 0 ? "+" : "") + fmt(row.diffMonthly)}
                      </td>
                      <td
                        className={`px-3 py-2 text-right ${
                          row.diffTotal > 0.5
                            ? "text-error"
                            : row.diffTotal < -0.5
                            ? "text-success"
                            : "text-text-secondary"
                        }`}
                      >
                        {row.isBase
                          ? "--"
                          : (row.diffTotal >= 0 ? "+" : "") + fmt(row.diffTotal)}
                      </td>
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
            label="Base Interest Rate"
            value={baseRate}
            onChange={setBaseRate}
            min={1}
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
            ]}
          />
        </div>
      }
    />
  );
}
