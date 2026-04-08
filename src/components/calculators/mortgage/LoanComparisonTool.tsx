"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

function useLoanScenario(defaults: { amount: number; rate: number; term: string; points: number }) {
  const [amount, setAmount] = useState(defaults.amount);
  const [rate, setRate] = useState(defaults.rate);
  const [term, setTerm] = useState(defaults.term);
  const [points, setPoints] = useState(defaults.points);
  return { amount, setAmount, rate, setRate, term, setTerm, points, setPoints };
}

export function LoanComparisonTool() {
  const a = useLoanScenario({ amount: 300000, rate: 6.5, term: "30", points: 0 });
  const b = useLoanScenario({ amount: 300000, rate: 5.75, term: "30", points: 1.5 });

  const results = useMemo(() => {
    function calc(s: { amount: number; rate: number; term: string; points: number }) {
      const years = Number(s.term);
      const pmt = monthlyPayment(s.amount, s.rate, years);
      const totalPaid = pmt * years * 12;
      const totalInterest = totalPaid - s.amount;
      const pointsCost = s.amount * (s.points / 100);
      const totalCost = totalPaid + pointsCost;
      return { pmt, totalPaid, totalInterest, pointsCost, totalCost, years };
    }

    const resA = calc(a);
    const resB = calc(b);

    // "Better deal" = lower total cost
    const winner = resA.totalCost <= resB.totalCost ? "A" : "B";
    const savings = Math.abs(resA.totalCost - resB.totalCost);

    return { a: resA, b: resB, winner, savings };
  }, [a.amount, a.rate, a.term, a.points, b.amount, b.rate, b.term, b.points]);

  const scenarioInputs = (
    label: string,
    s: ReturnType<typeof useLoanScenario>
  ) => (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <InputField
          label="Loan Amount"
          value={s.amount}
          onChange={s.setAmount}
          min={10000}
          max={2000000}
          step={5000}
          prefix="$"
        />
        <InputField
          label="Interest Rate"
          value={s.rate}
          onChange={s.setRate}
          min={0.5}
          max={15}
          step={0.125}
          suffix="%"
        />
        <SelectField
          label="Loan Term"
          value={s.term}
          onChange={s.setTerm}
          options={[
            { value: "30", label: "30 years" },
            { value: "20", label: "20 years" },
            { value: "15", label: "15 years" },
          ]}
        />
        <InputField
          label="Points Paid"
          value={s.points}
          onChange={s.setPoints}
          min={0}
          max={5}
          step={0.25}
          suffix="pts"
        />
      </div>
    </Card>
  );

  return (
    <CalculatorShell
      title="Loan Comparison Tool"
      description="Compare two loan scenarios side by side to find the better deal."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Scenario A"
              value={fmt(results.a.pmt) + "/mo"}
              variant={results.winner === "A" ? "success" : "secondary"}
              detail={results.winner === "A" ? "Better deal" : undefined}
              breakdown={[
                { label: "Total Interest", value: fmt(results.a.totalInterest) },
                { label: "Points Cost", value: fmt(results.a.pointsCost) },
                { label: "Total Cost", value: fmt(results.a.totalCost) },
              ]}
            />
            <ResultCard
              label="Scenario B"
              value={fmt(results.b.pmt) + "/mo"}
              variant={results.winner === "B" ? "success" : "secondary"}
              detail={results.winner === "B" ? "Better deal" : undefined}
              breakdown={[
                { label: "Total Interest", value: fmt(results.b.totalInterest) },
                { label: "Points Cost", value: fmt(results.b.pointsCost) },
                { label: "Total Cost", value: fmt(results.b.totalCost) },
              ]}
            />
          </div>
          <Card>
            <div className="text-center">
              <p className="text-sm text-text-secondary">Total Savings with the Better Deal</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{fmt(results.savings)}</p>
              <p className="text-xs text-text-secondary mt-1">
                Scenario {results.winner} saves you {fmt(results.savings)} over the life of the loan
              </p>
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scenarioInputs("Scenario A", a)}
          {scenarioInputs("Scenario B", b)}
        </div>
      }
    />
  );
}
