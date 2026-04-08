"use client";

import { useState, useMemo } from "react";
import { fmt, fmtPct } from "@/components/calculators/helpers";
import { InputField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function CapRateCalculator() {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [grossAnnualRent, setGrossAnnualRent] = useState(36000);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [operatingExpenses, setOperatingExpenses] = useState(8000);

  const results = useMemo(() => {
    const effectiveGrossIncome =
      grossAnnualRent * (1 - vacancyRate / 100);
    const noi = effectiveGrossIncome - operatingExpenses;
    const capRate = propertyPrice > 0 ? (noi / propertyPrice) * 100 : 0;

    return { effectiveGrossIncome, noi, capRate };
  }, [propertyPrice, grossAnnualRent, vacancyRate, operatingExpenses]);

  const capRateVariant = (): "success" | "primary" | "secondary" => {
    if (results.capRate > 8) return "success";
    if (results.capRate >= 5) return "primary";
    return "secondary";
  };

  return (
    <CalculatorShell
      title="Cap Rate Calculator"
      description="Calculate the capitalization rate to evaluate the return potential of an investment property."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Cap Rate"
            value={fmtPct(results.capRate)}
            variant={capRateVariant()}
            detail={
              results.capRate > 8
                ? "Strong return potential"
                : results.capRate >= 5
                  ? "Moderate return potential"
                  : "Lower return — evaluate appreciation potential"
            }
            breakdown={[
              { label: "Effective Gross Income", value: fmt(results.effectiveGrossIncome) },
              { label: "Net Operating Income", value: fmt(results.noi) },
            ]}
          />
          <Card>
            <CardHeader>
              <CardTitle>Breakdown</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Property Price" value={fmt(propertyPrice)} />
              <ResultRow label="Gross Annual Rent" value={fmt(grossAnnualRent)} />
              <ResultRow label="Vacancy Loss" value={fmt(grossAnnualRent * (vacancyRate / 100))} />
              <ResultRow label="Effective Gross Income" value={fmt(results.effectiveGrossIncome)} />
              <ResultRow label="Operating Expenses" value={fmt(operatingExpenses)} />
              <ResultRow label="Net Operating Income (NOI)" value={fmt(results.noi)} bold />
            </div>
          </Card>
        </div>
      }
      inputs={
        <div className="space-y-4">
          <InputField
            label="Property Price"
            value={propertyPrice}
            onChange={setPropertyPrice}
            min={10000}
            max={5000000}
            step={5000}
            prefix="$"
            slider
          />
          <InputField
            label="Gross Annual Rent"
            value={grossAnnualRent}
            onChange={setGrossAnnualRent}
            min={0}
            max={500000}
            step={500}
            prefix="$"
          />
          <InputField
            label="Vacancy Rate"
            value={vacancyRate}
            onChange={setVacancyRate}
            min={0}
            max={50}
            step={0.5}
            suffix="%"
            slider
          />
          <InputField
            label="Annual Operating Expenses"
            value={operatingExpenses}
            onChange={setOperatingExpenses}
            min={0}
            max={200000}
            step={500}
            prefix="$"
          />
        </div>
      }
    />
  );
}
