"use client";

import { useState, useMemo } from "react";
import { fmt } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function CashFlowAnalyzer() {
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [vacancyPct, setVacancyPct] = useState(5);
  const [propertyMgmtPct, setPropertyMgmtPct] = useState(10);
  const [mortgagePayment, setMortgagePayment] = useState(1500);
  const [propertyTax, setPropertyTax] = useState(300);
  const [insurance, setInsurance] = useState(125);
  const [maintenance, setMaintenance] = useState(150);
  const [hoa, setHoa] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const results = useMemo(() => {
    const grossMonthlyIncome = monthlyRent;
    const vacancyLoss = grossMonthlyIncome * (vacancyPct / 100);
    const effectiveMonthlyIncome = grossMonthlyIncome - vacancyLoss;
    const propertyMgmt = effectiveMonthlyIncome * (propertyMgmtPct / 100);

    const totalExpenses =
      mortgagePayment +
      propertyTax +
      insurance +
      maintenance +
      hoa +
      propertyMgmt +
      otherExpenses;

    const monthlyCashFlow = effectiveMonthlyIncome - totalExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    return {
      grossMonthlyIncome,
      vacancyLoss,
      effectiveMonthlyIncome,
      propertyMgmt,
      totalExpenses,
      monthlyCashFlow,
      annualCashFlow,
    };
  }, [
    monthlyRent,
    vacancyPct,
    propertyMgmtPct,
    mortgagePayment,
    propertyTax,
    insurance,
    maintenance,
    hoa,
    otherExpenses,
  ]);

  const cashFlowVariant = results.monthlyCashFlow >= 0 ? "success" : "error";

  return (
    <CalculatorShell
      title="Cash Flow Analyzer"
      description="Analyze the monthly and annual cash flow of a rental property after all expenses."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Monthly Cash Flow"
              value={fmt(results.monthlyCashFlow)}
              variant={cashFlowVariant}
              detail={
                results.monthlyCashFlow >= 0
                  ? "Positive cash flow"
                  : "Negative cash flow"
              }
            />
            <ResultCard
              label="Annual Cash Flow"
              value={fmt(results.annualCashFlow)}
              variant={cashFlowVariant}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Income</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Gross Monthly Rent" value={fmt(results.grossMonthlyIncome)} />
              <ResultRow label="Vacancy Loss" value={`-${fmt(results.vacancyLoss)}`} />
              <ResultRow label="Effective Monthly Income" value={fmt(results.effectiveMonthlyIncome)} bold />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Mortgage Payment" value={fmt(mortgagePayment)} />
              <ResultRow label="Property Tax" value={fmt(propertyTax)} />
              <ResultRow label="Insurance" value={fmt(insurance)} />
              <ResultRow label="Maintenance" value={fmt(maintenance)} />
              <ResultRow label="Property Management" value={fmt(results.propertyMgmt)} />
              <ResultRow label="HOA" value={fmt(hoa)} />
              <ResultRow label="Other Expenses" value={fmt(otherExpenses)} />
              <ResultRow label="Total Monthly Expenses" value={fmt(results.totalExpenses)} bold />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
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
            label="Property Management"
            value={propertyMgmtPct}
            onChange={setPropertyMgmtPct}
            min={0}
            max={25}
            step={0.5}
            suffix="%"
            slider
          />
          <InputField
            label="Mortgage Payment"
            value={mortgagePayment}
            onChange={setMortgagePayment}
            min={0}
            max={20000}
            step={25}
            prefix="$"
          />
          <InputField
            label="Property Tax (monthly)"
            value={propertyTax}
            onChange={setPropertyTax}
            min={0}
            max={5000}
            step={25}
            prefix="$"
          />
          <InputField
            label="Insurance (monthly)"
            value={insurance}
            onChange={setInsurance}
            min={0}
            max={2000}
            step={10}
            prefix="$"
          />
          <InputField
            label="Maintenance (monthly)"
            value={maintenance}
            onChange={setMaintenance}
            min={0}
            max={3000}
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
            value={otherExpenses}
            onChange={setOtherExpenses}
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
