"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function ROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [closingCosts, setClosingCosts] = useState(9000);
  const [rehabCosts, setRehabCosts] = useState(15000);
  const [currentValue, setCurrentValue] = useState(350000);
  const [annualRentalIncome, setAnnualRentalIncome] = useState(30000);
  const [annualExpenses, setAnnualExpenses] = useState(18000);
  const [yearsHeld, setYearsHeld] = useState(5);

  const results = useMemo(() => {
    const totalInvestment = downPayment + closingCosts + rehabCosts;
    const appreciation = currentValue - purchasePrice;
    const totalCashFlow = (annualRentalIncome - annualExpenses) * yearsHeld;
    const totalReturns = appreciation + totalCashFlow;
    const roi = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;
    const annualizedROI =
      yearsHeld > 0 && totalInvestment > 0
        ? (Math.pow(1 + totalReturns / totalInvestment, 1 / yearsHeld) - 1) * 100
        : 0;
    const annualCashFlow = annualRentalIncome - annualExpenses;

    return {
      totalInvestment,
      appreciation,
      totalCashFlow,
      totalReturns,
      roi,
      annualizedROI,
      annualCashFlow,
    };
  }, [
    purchasePrice,
    downPayment,
    closingCosts,
    rehabCosts,
    currentValue,
    annualRentalIncome,
    annualExpenses,
    yearsHeld,
  ]);

  const roiVariant = (): "success" | "primary" | "error" => {
    if (results.roi > 50) return "success";
    if (results.roi >= 0) return "primary";
    return "error";
  };

  return (
    <CalculatorShell
      title="ROI Calculator"
      description="Calculate your total return on investment including appreciation and cash flow over the holding period."
      results={
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              label="Total ROI"
              value={fmtPct(results.roi)}
              variant={roiVariant()}
              detail={`Over ${yearsHeld} year${yearsHeld !== 1 ? "s" : ""}`}
              breakdown={[
                { label: "Appreciation", value: fmt(results.appreciation) },
                { label: "Total Cash Flow", value: fmt(results.totalCashFlow) },
              ]}
            />
            <ResultCard
              label="Annualized ROI"
              value={fmtPct(results.annualizedROI)}
              variant={results.annualizedROI >= 10 ? "success" : "primary"}
              detail="Compound annual return"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Investment Summary</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Down Payment" value={fmt(downPayment)} />
              <ResultRow label="Closing Costs" value={fmt(closingCosts)} />
              <ResultRow label="Rehab Costs" value={fmt(rehabCosts)} />
              <ResultRow label="Total Cash Invested" value={fmt(results.totalInvestment)} bold />
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Returns</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Purchase Price" value={fmt(purchasePrice)} />
              <ResultRow label="Current Value" value={fmt(currentValue)} />
              <ResultRow label="Appreciation" value={fmt(results.appreciation)} />
              <ResultRow label="Annual Cash Flow" value={fmt(results.annualCashFlow)} />
              <ResultRow
                label={`Total Cash Flow (${yearsHeld} yr${yearsHeld !== 1 ? "s" : ""})`}
                value={fmt(results.totalCashFlow)}
              />
              <ResultRow label="Total Returns" value={fmt(results.totalReturns)} bold />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
            min={10000}
            max={5000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Down Payment"
            value={downPayment}
            onChange={setDownPayment}
            min={0}
            max={2000000}
            step={1000}
            prefix="$"
          />
          <InputField
            label="Closing Costs"
            value={closingCosts}
            onChange={setClosingCosts}
            min={0}
            max={200000}
            step={500}
            prefix="$"
          />
          <InputField
            label="Rehab / Renovation Costs"
            value={rehabCosts}
            onChange={setRehabCosts}
            min={0}
            max={500000}
            step={1000}
            prefix="$"
          />
          <InputField
            label="Current Property Value"
            value={currentValue}
            onChange={setCurrentValue}
            min={10000}
            max={5000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Annual Rental Income"
            value={annualRentalIncome}
            onChange={setAnnualRentalIncome}
            min={0}
            max={500000}
            step={500}
            prefix="$"
          />
          <InputField
            label="Annual Expenses (incl. mortgage)"
            value={annualExpenses}
            onChange={setAnnualExpenses}
            min={0}
            max={300000}
            step={500}
            prefix="$"
          />
          <InputField
            label="Years Held"
            value={yearsHeld}
            onChange={setYearsHeld}
            min={1}
            max={30}
            step={1}
            slider
          />
        </div>
      }
    />
  );
}
