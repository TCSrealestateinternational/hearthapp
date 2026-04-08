"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct, monthlyPayment } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function AffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(85000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState("30");
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insuranceMonthly, setInsuranceMonthly] = useState(150);

  const results = useMemo(() => {
    const grossMonthlyIncome = annualIncome / 12;
    const years = Number(loanTerm);

    // Front-end ratio: 28% of gross monthly income for housing
    const maxHousingPayment = grossMonthlyIncome * 0.28;

    // Back-end ratio: 36% of gross monthly income for all debts
    const maxTotalDebtPayment = grossMonthlyIncome * 0.36;
    const maxHousingFromBackEnd = maxTotalDebtPayment - monthlyDebts;

    // Use the more restrictive of the two limits
    const effectiveMaxHousing = Math.min(maxHousingPayment, maxHousingFromBackEnd);

    // Subtract tax and insurance from max housing to get max P&I
    // We need to iterate: max home price determines tax, which affects how much is left for P&I
    // Use a convergence approach: start with an estimate, refine
    let maxHomePrice = 0;
    let maxLoanAmount = 0;
    let monthlyPI = 0;
    let monthlyTax = 0;

    // Iterative solver: back-calculate max home price
    // maxPI = effectiveMaxHousing - (homePrice * taxRate / 100 / 12) - insurance
    // homePrice = loanAmount + downPayment
    // loanAmount = present value of annuity at maxPI
    // So: maxPI = effectiveMaxHousing - ((loanAmount + downPayment) * taxRate/100/12) - insurance
    // Solve iteratively
    let estimate = effectiveMaxHousing - insuranceMonthly;
    for (let i = 0; i < 20; i++) {
      // Given a P&I payment of `estimate`, what loan amount does that support?
      const r = interestRate / 100 / 12;
      const n = years * 12;
      let loan: number;
      if (r === 0) {
        loan = estimate * n;
      } else {
        const factor = Math.pow(1 + r, n);
        loan = estimate * ((factor - 1) / (r * factor));
      }
      const price = loan + downPayment;
      const tax = (price * (propertyTaxRate / 100)) / 12;
      const newEstimate = effectiveMaxHousing - tax - insuranceMonthly;
      if (Math.abs(newEstimate - estimate) < 0.01) {
        estimate = newEstimate;
        break;
      }
      estimate = newEstimate;
    }

    // Final calculation with converged estimate
    const r = interestRate / 100 / 12;
    const n = years * 12;
    if (r === 0) {
      maxLoanAmount = estimate * n;
    } else {
      const factor = Math.pow(1 + r, n);
      maxLoanAmount = estimate * ((factor - 1) / (r * factor));
    }
    maxLoanAmount = Math.max(0, maxLoanAmount);
    maxHomePrice = maxLoanAmount + downPayment;
    monthlyPI = monthlyPayment(maxLoanAmount, interestRate, years);
    monthlyTax = (maxHomePrice * (propertyTaxRate / 100)) / 12;

    const totalMonthlyPayment = monthlyPI + monthlyTax + insuranceMonthly;

    // Ratio checks
    const frontEndRatio = grossMonthlyIncome > 0
      ? (totalMonthlyPayment / grossMonthlyIncome) * 100
      : 0;
    const backEndRatio = grossMonthlyIncome > 0
      ? ((totalMonthlyPayment + monthlyDebts) / grossMonthlyIncome) * 100
      : 0;

    const frontEndOk = frontEndRatio <= 28;
    const backEndOk = backEndRatio <= 36;

    return {
      maxHomePrice,
      maxLoanAmount,
      maxHousingPayment: effectiveMaxHousing,
      monthlyPI,
      monthlyTax,
      totalMonthlyPayment,
      frontEndRatio,
      backEndRatio,
      frontEndOk,
      backEndOk,
      grossMonthlyIncome,
    };
  }, [annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate, insuranceMonthly]);

  return (
    <CalculatorShell
      title="Home Affordability Calculator"
      description="Determine the maximum home price you can afford based on your income, debts, and down payment."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Maximum Home Price"
            value={fmt(results.maxHomePrice)}
            variant="primary"
            detail={`Based on ${fmtPct(interestRate)} rate, ${loanTerm}-year term, ${fmt(downPayment)} down`}
            breakdown={[
              { label: "Estimated Loan Amount", value: fmt(results.maxLoanAmount) },
              { label: "Down Payment", value: fmt(downPayment) },
            ]}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Max Monthly Payment"
              value={fmt(results.totalMonthlyPayment)}
              variant="secondary"
              breakdown={[
                { label: "Principal & Interest", value: fmt(results.monthlyPI) },
                { label: "Property Tax", value: fmt(results.monthlyTax) },
                { label: "Insurance", value: fmt(insuranceMonthly) },
              ]}
            />
            <ResultCard
              label="Estimated Loan Amount"
              value={fmt(results.maxLoanAmount)}
              variant="secondary"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>DTI Ratio Check</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow
                label="Front-End Ratio (Housing / Income)"
                value={fmtPct(results.frontEndRatio)}
              />
              <div className="text-xs text-text-secondary ml-auto">
                {results.frontEndOk
                  ? "Within the recommended 28% guideline"
                  : "Exceeds the recommended 28% guideline"}
              </div>
              <ResultRow
                label="Back-End Ratio (All Debts / Income)"
                value={fmtPct(results.backEndRatio)}
              />
              <div className="text-xs text-text-secondary ml-auto">
                {results.backEndOk
                  ? "Within the recommended 36% guideline"
                  : "Exceeds the recommended 36% guideline"}
              </div>
              <ResultRow
                label="Gross Monthly Income"
                value={fmt(results.grossMonthlyIncome)}
                bold
              />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Annual Gross Income"
            value={annualIncome}
            onChange={setAnnualIncome}
            min={10000}
            max={1000000}
            step={1000}
            prefix="$"
            slider
          />
          <InputField
            label="Monthly Debts (car, student loans, etc.)"
            value={monthlyDebts}
            onChange={setMonthlyDebts}
            min={0}
            max={10000}
            step={50}
            prefix="$"
          />
          <InputField
            label="Down Payment Amount"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={500000}
            step={1000}
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
        </div>
      }
      disclaimer="This calculator uses the 28/36 rule as a guideline. Actual lending criteria vary by lender and loan program."
    />
  );
}
