"use client";

import { useState, useMemo } from "react";
import { fmt } from "@/components/calculators/helpers";
import { InputField, SelectField } from "@/components/calculators/InputField";
import { ResultCard, ResultRow } from "@/components/calculators/ResultCard";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export function ExpenseEstimator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [squareFootage, setSquareFootage] = useState(2000);
  const [yearBuilt, setYearBuilt] = useState(2000);
  const [hasPool, setHasPool] = useState("no");

  const results = useMemo(() => {
    // Property tax: default 1.2% of home price per year
    const propertyTaxAnnual = homePrice * 0.012;
    const propertyTaxMonthly = propertyTaxAnnual / 12;

    // Insurance: $100/mo base, adjustments for age and price
    const currentYear = 2026;
    const age = currentYear - yearBuilt;
    let insuranceBase = 100;
    // Older homes cost more to insure
    if (age > 40) insuranceBase += 50;
    else if (age > 20) insuranceBase += 25;
    // Higher-value homes cost more
    insuranceBase += Math.floor(homePrice / 100000) * 15;
    const insuranceMonthly = insuranceBase;

    // Utilities: $0.15 per square foot
    const utilitiesMonthly = squareFootage * 0.15;

    // Maintenance: 1% of home price per year
    const maintenanceAnnual = homePrice * 0.01;
    const maintenanceMonthly = maintenanceAnnual / 12;

    // Lawn care: base $100/mo, more for larger lots (rough proxy from sqft)
    let lawnCareMonthly = 100;
    if (squareFootage > 3000) lawnCareMonthly = 150;
    if (squareFootage > 5000) lawnCareMonthly = 200;

    // Pool care
    const poolCareMonthly = hasPool === "yes" ? 150 : 0;

    const totalLawnPoolCare = lawnCareMonthly + poolCareMonthly;

    const totalMonthly =
      propertyTaxMonthly +
      insuranceMonthly +
      utilitiesMonthly +
      maintenanceMonthly +
      totalLawnPoolCare;

    const totalAnnual = totalMonthly * 12;

    return {
      propertyTaxMonthly,
      insuranceMonthly,
      utilitiesMonthly,
      maintenanceMonthly,
      lawnCareMonthly,
      poolCareMonthly,
      totalLawnPoolCare,
      totalMonthly,
      totalAnnual,
    };
  }, [homePrice, squareFootage, yearBuilt, hasPool]);

  return (
    <CalculatorShell
      title="Homeownership Expense Estimator"
      description="Estimate the true monthly cost of owning a home beyond your mortgage payment."
      results={
        <div className="space-y-4">
          <ResultCard
            label="Total Monthly Homeownership Costs"
            value={fmt(results.totalMonthly)}
            variant="primary"
            detail={`${fmt(results.totalAnnual)} per year beyond mortgage`}
            breakdown={[
              { label: "Property Tax", value: fmt(results.propertyTaxMonthly) },
              { label: "Insurance", value: fmt(results.insuranceMonthly) },
              { label: "Utilities", value: fmt(results.utilitiesMonthly) },
              { label: "Maintenance", value: fmt(results.maintenanceMonthly) },
              { label: "Lawn / Pool Care", value: fmt(results.totalLawnPoolCare) },
            ]}
          />
          <Card>
            <CardHeader>
              <CardTitle>Cost Details</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <ResultRow label="Property Tax" value={`${fmt(results.propertyTaxMonthly)}/mo`} />
              <div className="text-xs text-text-secondary">
                Based on 1.2% of {fmt(homePrice)} home value
              </div>
              <ResultRow label="Homeowner Insurance" value={`${fmt(results.insuranceMonthly)}/mo`} />
              <div className="text-xs text-text-secondary">
                $100 base adjusted for home age ({2026 - yearBuilt} yrs) and value
              </div>
              <ResultRow label="Utilities" value={`${fmt(results.utilitiesMonthly)}/mo`} />
              <div className="text-xs text-text-secondary">
                Estimated at $0.15/sqft for {squareFootage.toLocaleString()} sqft
              </div>
              <ResultRow label="Maintenance Reserve" value={`${fmt(results.maintenanceMonthly)}/mo`} />
              <div className="text-xs text-text-secondary">
                1% of home price annually set aside for repairs
              </div>
              <ResultRow label="Lawn Care" value={`${fmt(results.lawnCareMonthly)}/mo`} />
              {hasPool === "yes" && (
                <ResultRow label="Pool Maintenance" value={`${fmt(results.poolCareMonthly)}/mo`} />
              )}
              <ResultRow label="Total Monthly" value={fmt(results.totalMonthly)} bold />
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
            label="Square Footage"
            value={squareFootage}
            onChange={setSquareFootage}
            min={500}
            max={10000}
            step={100}
            suffix="sqft"
          />
          <InputField
            label="Year Built"
            value={yearBuilt}
            onChange={setYearBuilt}
            min={1900}
            max={2026}
            step={1}
          />
          <SelectField
            label="Has Pool?"
            value={hasPool}
            onChange={setHasPool}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
        </div>
      }
      disclaimer="These are rough estimates based on national averages. Actual costs vary significantly by location, home condition, and lifestyle."
    />
  );
}
