"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

function dtiVariant(
  ratio: number,
  thresholds: { green: number; yellow: number }
): "success" | "secondary" | "error" {
  if (ratio <= thresholds.green) return "success";
  if (ratio <= thresholds.yellow) return "secondary";
  return "error";
}

function dtiLabel(
  ratio: number,
  thresholds: { green: number; yellow: number }
): string {
  if (ratio <= thresholds.green) return "Good";
  if (ratio <= thresholds.yellow) return "Caution";
  return "High Risk";
}

export function DTICalculator() {
  // Income
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(7000);

  // Housing expenses
  const [mortgage, setMortgage] = useState(1500);
  const [propertyTax, setPropertyTax] = useState(250);
  const [homeInsurance, setHomeInsurance] = useState(120);
  const [hoa, setHoa] = useState(0);

  // Other debts
  const [carPayment, setCarPayment] = useState(350);
  const [studentLoans, setStudentLoans] = useState(200);
  const [creditCards, setCreditCards] = useState(100);
  const [otherDebts, setOtherDebts] = useState(0);

  const results = useMemo(() => {
    const totalHousing = mortgage + propertyTax + homeInsurance + hoa;
    const totalOtherDebts = carPayment + studentLoans + creditCards + otherDebts;
    const totalAllDebts = totalHousing + totalOtherDebts;

    const frontEndDTI = grossMonthlyIncome > 0
      ? (totalHousing / grossMonthlyIncome) * 100
      : 0;
    const backEndDTI = grossMonthlyIncome > 0
      ? (totalAllDebts / grossMonthlyIncome) * 100
      : 0;

    const remainingIncome = grossMonthlyIncome - totalAllDebts;

    return {
      totalHousing,
      totalOtherDebts,
      totalAllDebts,
      frontEndDTI,
      backEndDTI,
      remainingIncome,
    };
  }, [grossMonthlyIncome, mortgage, propertyTax, homeInsurance, hoa, carPayment, studentLoans, creditCards, otherDebts]);

  const frontEndVariant = dtiVariant(results.frontEndDTI, { green: 28, yellow: 33 });
  const backEndVariant = dtiVariant(results.backEndDTI, { green: 36, yellow: 43 });
  const frontEndStatus = dtiLabel(results.frontEndDTI, { green: 28, yellow: 33 });
  const backEndStatus = dtiLabel(results.backEndDTI, { green: 36, yellow: 43 });

  return (
    <CalculatorShell
      title="Debt-to-Income Ratio Calculator"
      description="Calculate your front-end and back-end DTI ratios to see how lenders evaluate your borrowing capacity."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Front-End DTI (Housing Only)"
              value={fmtPct(results.frontEndDTI)}
              variant={frontEndVariant}
              detail={`${frontEndStatus} — Recommended: under 28%`}
              breakdown={[
                { label: "Mortgage P&I", value: fmt(mortgage) },
                { label: "Property Tax", value: fmt(propertyTax) },
                { label: "Insurance", value: fmt(homeInsurance) },
                { label: "HOA", value: fmt(hoa) },
              ]}
            />
            <ResultCard
              label="Back-End DTI (All Debts)"
              value={fmtPct(results.backEndDTI)}
              variant={backEndVariant}
              detail={`${backEndStatus} — Recommended: under 36%`}
              breakdown={[
                { label: "Total Housing", value: fmt(results.totalHousing) },
                { label: "Other Debts", value: fmt(results.totalOtherDebts) },
                { label: "Total Debts", value: fmt(results.totalAllDebts) },
              ]}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Gross Monthly Income" value={fmt(grossMonthlyIncome)} />
              <ResultRow label="Total Housing Costs" value={fmt(results.totalHousing)} />
              <ResultRow label="Total Other Debts" value={fmt(results.totalOtherDebts)} />
              <ResultRow label="Total Debt Payments" value={fmt(results.totalAllDebts)} />
              <ResultRow label="Remaining Income" value={fmt(results.remainingIncome)} bold />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>DTI Guidelines</CardTitle>
            </CardHeader>
            <div className="space-y-3 text-sm text-text-secondary">
              <div className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-success mt-0.5 shrink-0" />
                <span>
                  <strong className="text-text-primary">Good:</strong> Front-end under 28%, Back-end under 36%. Most conventional loans approve comfortably.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-secondary mt-0.5 shrink-0" />
                <span>
                  <strong className="text-text-primary">Caution:</strong> Front-end 28-33%, Back-end 36-43%. May qualify with strong credit or compensating factors.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-error mt-0.5 shrink-0" />
                <span>
                  <strong className="text-text-primary">High Risk:</strong> Front-end above 33%, Back-end above 43%. May have difficulty qualifying for most loans.
                </span>
              </div>
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Income</h4>
            <InputField
              label="Gross Monthly Income"
              value={grossMonthlyIncome}
              onChange={setGrossMonthlyIncome}
              min={0}
              max={50000}
              step={100}
              prefix="$"
              slider
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Housing Expenses</h4>
            <div className="space-y-4">
              <InputField
                label="Mortgage Payment (P&I)"
                value={mortgage}
                onChange={setMortgage}
                min={0}
                max={10000}
                step={50}
                prefix="$"
              />
              <InputField
                label="Property Tax (monthly)"
                value={propertyTax}
                onChange={setPropertyTax}
                min={0}
                max={2000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Home Insurance (monthly)"
                value={homeInsurance}
                onChange={setHomeInsurance}
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
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Other Monthly Debts</h4>
            <div className="space-y-4">
              <InputField
                label="Car Payment"
                value={carPayment}
                onChange={setCarPayment}
                min={0}
                max={3000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Student Loans"
                value={studentLoans}
                onChange={setStudentLoans}
                min={0}
                max={5000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Credit Card Minimum Payments"
                value={creditCards}
                onChange={setCreditCards}
                min={0}
                max={3000}
                step={25}
                prefix="$"
              />
              <InputField
                label="Other Debt Payments"
                value={otherDebts}
                onChange={setOtherDebts}
                min={0}
                max={5000}
                step={25}
                prefix="$"
              />
            </div>
          </div>
        </div>
      }
      disclaimer="DTI thresholds are guidelines based on conventional lending standards. FHA, VA, and other programs may allow higher ratios."
    />
  );
}
