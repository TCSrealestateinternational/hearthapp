"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function IncomeQualifier() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insuranceMonthly, setInsuranceMonthly] = useState(150);
  const [maxDTI, setMaxDTI] = useState(28);

  const results = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const loanAmount = homePrice - downPayment;
    const years = Number(loanTerm);

    const monthlyPI = monthlyPayment(loanAmount, interestRate, years);
    const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;
    const totalMonthlyPayment = monthlyPI + monthlyTax + insuranceMonthly;

    // Required income = total housing payment / (maxDTI / 100)
    const requiredGrossMonthlyIncome = maxDTI > 0
      ? totalMonthlyPayment / (maxDTI / 100)
      : 0;
    const requiredAnnualIncome = requiredGrossMonthlyIncome * 12;

    // Resulting DTI at that income
    const resultingDTI = requiredGrossMonthlyIncome > 0
      ? (totalMonthlyPayment / requiredGrossMonthlyIncome) * 100
      : 0;

    // Also show what DTI would be at common income levels
    const incomeScenarios = [60000, 80000, 100000, 120000, 150000].map((annual) => {
      const monthly = annual / 12;
      const dti = monthly > 0 ? (totalMonthlyPayment / monthly) * 100 : 0;
      return { annual, dti };
    });

    return {
      downPayment,
      loanAmount,
      monthlyPI,
      monthlyTax,
      totalMonthlyPayment,
      requiredGrossMonthlyIncome,
      requiredAnnualIncome,
      resultingDTI,
      incomeScenarios,
    };
  }, [homePrice, downPaymentPct, interestRate, loanTerm, propertyTaxRate, insuranceMonthly, maxDTI]);

  return (
    <CalculatorShell
      title="Income Qualifier"
      description="Find out the minimum income needed to qualify for a specific home price at your target DTI ratio."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Minimum Annual Income Required"
            value={fmt(results.requiredAnnualIncome)}
            variant="primary"
            detail={`To keep housing costs at or below ${fmtPct(maxDTI)} of gross income`}
            breakdown={[
              { label: "Required Monthly Income", value: fmt(results.requiredGrossMonthlyIncome) },
              { label: "Total Monthly Payment", value: fmt(results.totalMonthlyPayment) },
              { label: "Resulting DTI", value: fmtPct(results.resultingDTI) },
            ]}
          />
          <Card>
            <CardHeader>
              <CardTitle>Payment Breakdown</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Home Price" value={fmt(homePrice)} />
              <ResultRow label="Down Payment" value={`${fmt(results.downPayment)} (${downPaymentPct}%)`} />
              <ResultRow label="Loan Amount" value={fmt(results.loanAmount)} />
              <ResultRow label="Principal & Interest" value={fmt(results.monthlyPI)} />
              <ResultRow label="Property Tax (monthly)" value={fmt(results.monthlyTax)} />
              <ResultRow label="Insurance (monthly)" value={fmt(insuranceMonthly)} />
              <ResultRow label="Total Monthly Payment" value={fmt(results.totalMonthlyPayment)} bold />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>DTI at Common Income Levels</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {results.incomeScenarios.map((s) => {
                const variant: "success" | "secondary" | "error" =
                  s.dti <= 28 ? "success" : s.dti <= 36 ? "secondary" : "error";
                const colorClass =
                  variant === "success"
                    ? "text-success"
                    : variant === "secondary"
                      ? "text-secondary"
                      : "text-error";
                return (
                  <div key={s.annual} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{fmt(s.annual)}/year</span>
                    <span className={`font-medium ${colorClass}`}>
                      {fmtPct(s.dti)} DTI
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Desired Home Price"
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
            value={insuranceMonthly}
            onChange={setInsuranceMonthly}
            min={0}
            max={1000}
            step={10}
            prefix="$"
          />
          <InputField
            label="Max DTI Ratio (front-end)"
            value={maxDTI}
            onChange={setMaxDTI}
            min={10}
            max={60}
            step={1}
            suffix="%"
            slider
          />
        </div>
      }
      disclaimer="Income requirements are estimates based on the front-end DTI ratio. Lenders also consider credit score, employment history, reserves, and back-end DTI."
    />
  );
}
