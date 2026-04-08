"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function OperatingExpenseEstimator() {
  const [propertyValue, setPropertyValue] = useState(300000);
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insuranceMonthly, setInsuranceMonthly] = useState(125);
  const [maintenancePct, setMaintenancePct] = useState(1);
  const [propertyMgmtPct, setPropertyMgmtPct] = useState(10);
  const [vacancyPct, setVacancyPct] = useState(5);
  const [utilities, setUtilities] = useState(0);
  const [hoa, setHoa] = useState(0);
  const [other, setOther] = useState(0);

  const results = useMemo(() => {
    const monthlyPropertyTax = (propertyValue * (propertyTaxRate / 100)) / 12;
    const monthlyMaintenance = (propertyValue * (maintenancePct / 100)) / 12;
    const effectiveRent = monthlyRent * (1 - vacancyPct / 100);
    const monthlyPropertyMgmt = effectiveRent * (propertyMgmtPct / 100);
    const monthlyVacancyLoss = monthlyRent * (vacancyPct / 100);

    const totalMonthlyExpenses =
      monthlyPropertyTax +
      insuranceMonthly +
      monthlyMaintenance +
      monthlyPropertyMgmt +
      monthlyVacancyLoss +
      utilities +
      hoa +
      other;

    const annualGrossIncome = monthlyRent * 12;
    const annualExpenses = totalMonthlyExpenses * 12;
    const operatingExpenseRatio =
      annualGrossIncome > 0 ? (annualExpenses / annualGrossIncome) * 100 : 0;

    const annualEffectiveIncome = effectiveRent * 12;
    const annualOperatingExpensesExVacancy =
      (monthlyPropertyTax +
        insuranceMonthly +
        monthlyMaintenance +
        monthlyPropertyMgmt +
        utilities +
        hoa +
        other) * 12;
    const noi = annualEffectiveIncome - annualOperatingExpensesExVacancy;

    return {
      monthlyPropertyTax,
      monthlyMaintenance,
      monthlyPropertyMgmt,
      monthlyVacancyLoss,
      totalMonthlyExpenses,
      annualExpenses,
      operatingExpenseRatio,
      noi,
    };
  }, [
    propertyValue,
    monthlyRent,
    propertyTaxRate,
    insuranceMonthly,
    maintenancePct,
    propertyMgmtPct,
    vacancyPct,
    utilities,
    hoa,
    other,
  ]);

  return (
    <CalculatorShell
      title="Operating Expense Estimator"
      description="Estimate total operating expenses, expense ratio, and NOI for a rental property."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Monthly Expenses"
              value={fmt(results.totalMonthlyExpenses)}
              variant="primary"
            />
            <ResultCard
              label="Expense Ratio"
              value={fmtPct(results.operatingExpenseRatio)}
              variant={results.operatingExpenseRatio <= 50 ? "success" : "error"}
              detail={
                results.operatingExpenseRatio <= 50
                  ? "Healthy ratio"
                  : "High expense ratio"
              }
            />
            <ResultCard
              label="Annual NOI"
              value={fmt(results.noi)}
              variant={results.noi >= 0 ? "success" : "error"}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown (Monthly)</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Property Tax" value={fmt(results.monthlyPropertyTax)} />
              <ResultRow label="Insurance" value={fmt(insuranceMonthly)} />
              <ResultRow label="Maintenance" value={fmt(results.monthlyMaintenance)} />
              <ResultRow label="Property Management" value={fmt(results.monthlyPropertyMgmt)} />
              <ResultRow label="Vacancy Allowance" value={fmt(results.monthlyVacancyLoss)} />
              <ResultRow label="Utilities" value={fmt(utilities)} />
              <ResultRow label="HOA" value={fmt(hoa)} />
              <ResultRow label="Other" value={fmt(other)} />
              <ResultRow
                label="Total Monthly Expenses"
                value={fmt(results.totalMonthlyExpenses)}
                bold
              />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Annual Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Annual Gross Income" value={fmt(monthlyRent * 12)} />
              <ResultRow label="Annual Operating Expenses" value={fmt(results.annualExpenses)} />
              <ResultRow label="Operating Expense Ratio" value={fmtPct(results.operatingExpenseRatio)} />
              <ResultRow label="Net Operating Income (NOI)" value={fmt(results.noi)} bold />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Property Value"
            value={propertyValue}
            onChange={setPropertyValue}
            min={10000}
            max={5000000}
            step={5000}
            prefix="$"
            slider
          />
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
            label="Property Tax Rate (annual)"
            value={propertyTaxRate}
            onChange={setPropertyTaxRate}
            min={0}
            max={5}
            step={0.05}
            suffix="%"
          />
          <InputField
            label="Insurance (monthly)"
            value={insuranceMonthly}
            onChange={setInsuranceMonthly}
            min={0}
            max={2000}
            step={10}
            prefix="$"
          />
          <InputField
            label="Maintenance (% of value per year)"
            value={maintenancePct}
            onChange={setMaintenancePct}
            min={0}
            max={5}
            step={0.1}
            suffix="%"
            slider
          />
          <InputField
            label="Property Management (% of rent)"
            value={propertyMgmtPct}
            onChange={setPropertyMgmtPct}
            min={0}
            max={25}
            step={0.5}
            suffix="%"
            slider
          />
          <InputField
            label="Vacancy Rate"
            value={vacancyPct}
            onChange={setVacancyPct}
            min={0}
            max={50}
            step={0.5}
            suffix="%"
            slider
          />
          <InputField
            label="Utilities (monthly)"
            value={utilities}
            onChange={setUtilities}
            min={0}
            max={2000}
            step={25}
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
          <InputField
            label="Other Expenses (monthly)"
            value={other}
            onChange={setOther}
            min={0}
            max={5000}
            step={25}
            prefix="$"
          />
        </div>
      }
    />
  );
}
