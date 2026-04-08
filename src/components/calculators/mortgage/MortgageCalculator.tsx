"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insurance, setInsurance] = useState(150);
  const [hoa, setHoa] = useState(0);

  const results = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const loanAmount = homePrice - downPayment;
    const years = Number(loanTerm);
    const pi = monthlyPayment(loanAmount, interestRate, years);
    const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;
    const totalMonthly = pi + monthlyTax + insurance + hoa;
    const totalInterest = pi * years * 12 - loanAmount;
    const cashNeeded = downPayment + (homePrice * 0.03); // rough closing cost estimate

    return {
      downPayment,
      loanAmount,
      pi,
      monthlyTax,
      totalMonthly,
      totalInterest,
      cashNeeded,
    };
  }, [homePrice, downPaymentPct, interestRate, loanTerm, propertyTaxRate, insurance, hoa]);

  return (
    <CalculatorShell
      title="Mortgage Payment Calculator"
      description="Estimate your total monthly mortgage payment including taxes, insurance, and HOA."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Total Monthly Payment"
            value={fmt(results.totalMonthly)}
            variant="primary"
            detail={`${fmt(results.loanAmount)} loan at ${fmtPct(interestRate)} for ${loanTerm} years`}
            breakdown={[
              { label: "Principal & Interest", value: fmt(results.pi) },
              { label: "Property Tax", value: fmt(results.monthlyTax) },
              { label: "Insurance", value: fmt(insurance) },
              { label: "HOA", value: fmt(hoa) },
            ]}
          />
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Home Price" value={fmt(homePrice)} />
              <ResultRow label="Down Payment" value={`${fmt(results.downPayment)} (${downPaymentPct}%)`} />
              <ResultRow label="Loan Amount" value={fmt(results.loanAmount)} />
              <ResultRow label="Total Interest" value={fmt(results.totalInterest)} />
              <ResultRow label="Cash Needed at Closing" value={fmt(results.cashNeeded)} bold />
            </div>
          </Card>
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
            min={0}
            max={100}
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
          <InputField
            label="Property Tax Rate"
            value={propertyTaxRate}
            onChange={setPropertyTaxRate}
            min={0}
            max={5}
            step={0.05}
            suffix="%"
          />
          <InputField
            label="Home Insurance (monthly)"
            value={insurance}
            onChange={setInsurance}
            min={0}
            max={1000}
            step={10}
            prefix="$"
          />
          <InputField
            label="HOA (monthly)"
            value={hoa}
            onChange={setHoa}
            min={0}
            max={2000}
            step={25}
            prefix="$"
          />
        </div>
      }
    />
  );
}
